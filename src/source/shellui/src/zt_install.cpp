/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.  */

/* A .ztheme is a ZIP of a theme's folder:
     theme.json                 {"format":2,"name","author","description","settings":{...}}
     wallpapers/<file>  icons/<file>  fonts/<file>
   Older .ztheme files are translated when they are installed: a ZIP with
   theme.ztheme (a whole theme.js) + zhitheme.json + assets/<kind>/<file>,
   or that theme text alone; only the values of its THEME block are kept.
   Every install goes through here: the editor's Install (POST /install),
   the Home menu, USB and /data/XMB5/Install (FTP, USB copy..., at the
   module's start). The theme becomes Themes/<name>/ (theme.json + its
   files; a name already there is kept: the new one becomes <name>-2,
   -3...), the folders / custom tile choices of the theme in use are kept,
   and it becomes the theme in use. A file of Install/ is then deleted; one
   that is not a theme becomes <file>.failed (kept, not tried again).
   zt_theme_pack_* make the .ztheme of a theme (the editor's Download). */

#include "zt_storage.hpp"
#include "zt_log.hpp"
#include "external_symbols.hpp"
#include "zt_update.hpp"

#include <ctype.h>
#include <dirent.h>
#include <errno.h>
#include <fcntl.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <time.h>
#include <unistd.h>
#include <zlib.h>

#include <pthread.h>

#include <algorithm>
#include <atomic>
#include <functional>
#include <initializer_list>
#include <string>
#include <vector>

#define ZT_INSTALL ZT_DIR "/Install"

/* homeui_js_inject.cpp */
std::vector<std::pair<std::string, std::string>> zt_theme_values_of(const std::string &text);

namespace {

const size_t kMaxText = 8u << 20;
/* what a pack may hold: the editor's packs are a few files; a long video
   wallpaper is the biggest thing a theme has */
const size_t kMaxEntries = 256;          /* ZIP entries in all */
const size_t kMaxAssets = 64;            /* files under assets/ */
const uint64_t kMaxAsset = 2ull << 30;   /* one file, unpacked (the editor's upload limit) */
const uint64_t kMaxPack = 4ull << 30;    /* every file, unpacked */

/* the file's type from its first bytes, so a pack cannot put something
   else under a picture / video / font name: "" when unknown */
std::string sniff(const unsigned char *h, size_t n) {
  auto at = [&](size_t o, const char *s) {
    const size_t k = strlen(s);
    return n >= o + k && memcmp(h + o, s, k) == 0;
  };
  if (n >= 8 && memcmp(h, "\x89PNG\r\n\x1a\n", 8) == 0)
    return "png";
  if (n >= 3 && h[0] == 0xFF && h[1] == 0xD8 && h[2] == 0xFF)
    return "jpg";
  if (at(0, "GIF87a") || at(0, "GIF89a"))
    return "gif";
  if (at(0, "RIFF") && at(8, "WEBP"))
    return "webp";
  if (at(0, "RIFF") && at(8, "WAVE"))
    return "wav";
  if (at(4, "ftyp"))
    return "mp4";
  if (n >= 4 && h[0] == 0x1A && h[1] == 0x45 && h[2] == 0xDF && h[3] == 0xA3)
    return "webm";
  if (at(0, "OggS"))
    return "ogg";
  if (at(0, "ID3") || (n >= 2 && h[0] == 0xFF && (h[1] & 0xE0) == 0xE0))
    return "mp3";
  if ((n >= 4 && h[0] == 0 && h[1] == 1 && h[2] == 0 && h[3] == 0) || at(0, "OTTO") || at(0, "true") ||
      at(0, "ttcf"))
    return "font";
  return "";
}

/* the types a file of that kind and extension may be ("" = not allowed) */
const char *allowed_types(const std::string &kind, const std::string &file) {
  std::string ext;
  const size_t dot = file.rfind('.');
  if (dot != std::string::npos)
    for (size_t i = dot + 1; i < file.size(); ++i)
      ext += (char)tolower((unsigned char)file[i]);
  const bool picture = ext == "png" || ext == "jpg" || ext == "jpeg" || ext == "webp" || ext == "gif";
  if (kind == "fonts")
    return ext == "ttf" || ext == "otf" || ext == "ttc" ? "font" : "";
  if (kind == "icons")
    return picture ? "png jpg webp gif" : "";
  if (kind != "wallpapers")
    return "";
  if (picture)
    return "png jpg webp gif";
  if (ext == "mp4" || ext == "m4v" || ext == "mov" || ext == "webm")
    return "mp4 webm";
  if (ext == "mp3" || ext == "aac" || ext == "m4a" || ext == "wav" || ext == "at9" || ext == "ogg")
    return "mp3 mp4 wav ogg";
  return "";
}

bool type_ok(const char *allowed, const std::string &type) {
  if (type.empty())
    return false;
  const std::string list = std::string(" ") + allowed + " ";
  return list.find(" " + type + " ") != std::string::npos;
}

bool ends_with(const std::string &s, const char *e) {
  const size_t n = strlen(e);
  return s.size() >= n && s.compare(s.size() - n, n, e) == 0;
}

uint16_t le16(const unsigned char *p) { return (uint16_t)(p[0] | p[1] << 8); }
uint32_t le32(const unsigned char *p) {
  return (uint32_t)p[0] | (uint32_t)p[1] << 8 | (uint32_t)p[2] << 16 | (uint32_t)p[3] << 24;
}

bool read_at(int fd, void *buf, size_t size, off_t at) {
  size_t got = 0;
  while (got < size) {
    const ssize_t n = pread(fd, (char *)buf + got, size - got, at + (off_t)got);
    if (n <= 0)
      return false;
    got += (size_t)n;
  }
  return true;
}

bool write_out(int fd, const char *data, size_t size) {
  for (size_t off = 0; off < size;) {
    const ssize_t n = write(fd, data + off, size - off);
    if (n <= 0)
      return false;
    off += (size_t)n;
  }
  return true;
}

/* the editor's foldHash (djb2 xor, base 36) */
std::string fold_hash(const std::string &t) {
  uint32_t h = 5381;
  for (unsigned char c : t)
    h = (h * 33) ^ c;
  std::string out;
  do {
    out.insert(out.begin(), "0123456789abcdefghijklmnopqrstuvwxyz"[h % 36]);
    h /= 36;
  } while (h);
  return out;
}

/* the editor's uploadName: a file name the PS5 accepts (A-Z a-z 0-9 . _ -,
   not starting with . _ -, at most 60 letters with a short hash) */
std::string upload_name(const std::string &name) {
  std::string n;
  for (unsigned char c : name) {
    const char k = isalnum(c) || c == '.' || c == '_' || c == '-' ? (char)c : '_';
    if (k == '_' && !n.empty() && n.back() == '_')
      continue;
    n += k;
  }
  size_t lead = 0;
  while (lead < n.size() && (n[lead] == '.' || n[lead] == '_' || n[lead] == '-'))
    ++lead;
  n.erase(0, lead);
  std::string ext;
  const size_t dot = n.rfind('.');
  if (dot != std::string::npos && n.size() - dot >= 2 && n.size() - dot <= 6) {
    bool ok = true;
    for (size_t i = dot + 1; i < n.size(); ++i)
      ok = ok && isalnum((unsigned char)n[i]);
    if (ok)
      ext = n.substr(dot);
  }
  std::string base = n.substr(0, n.size() - ext.size());
  if (n.size() > 60) {
    base = base.substr(0, 60 - ext.size() - 8);
    while (!base.empty() && (base.back() == '.' || base.back() == '_' || base.back() == '-'))
      base.pop_back();
    std::string h = "000000" + fold_hash(name);
    base += "_" + h.substr(h.size() - 6);
  }
  return (base.empty() ? "file" : base) + ext;
}

bool name_ok(const std::string &name) {
  if (name.empty() || name.size() >= 80 || name[0] == '.' || name[0] == '_' || name[0] == '-')
    return false;
  for (char c : name)
    if (!(isalnum((unsigned char)c) || c == '.' || c == '-' || c == '_'))
      return false;
  return true;
}

/* a theme name from any text: other letters become '-', at most 40 */
std::string theme_safe(const std::string &s) {
  std::string n;
  for (unsigned char c : s) {
    const char k = isalnum(c) || c == '.' || c == '_' || c == '-' ? (char)c : '-';
    if (k == '-' && !n.empty() && n.back() == '-')
      continue;
    n += k;
  }
  while (!n.empty() && (n[0] == '.' || n[0] == '-'))
    n.erase(0, 1);
  if (n.size() > 40)
    n.resize(40);
  while (!n.empty() && (n.back() == '-' || n.back() == '.'))
    n.pop_back();
  return zt_theme_name_ok(n) ? n : std::string();
}

/* 'value' of `key: '...'` (themeName) or of "key":"..." (zhitheme.json) */
std::string quoted_after(const std::string &text, const char *key, char quote) {
  const size_t at = text.find(key);
  if (at == std::string::npos)
    return std::string();
  const size_t colon = text.find(':', at + strlen(key));
  if (colon == std::string::npos)
    return std::string();
  size_t q1 = colon + 1;
  while (q1 < text.size() && (text[q1] == ' ' || text[q1] == '\t'))
    ++q1;
  if (q1 >= text.size() || text[q1] != quote)
    return std::string();
  const size_t q2 = text.find(quote, q1 + 1);
  if (q2 == std::string::npos || q2 - q1 > 80)
    return std::string();
  return text.substr(q1 + 1, q2 - q1 - 1);
}

bool is_theme_text(const std::string &t) { return t.find("var THEME") != std::string::npos; }

std::string read_text(const char *path) {
  std::string out;
  const int fd = open(path, O_RDONLY);
  if (fd < 0)
    return out;
  char buf[16384];
  ssize_t n;
  while (out.size() < kMaxText && (n = read(fd, buf, sizeof(buf))) > 0)
    out.append(buf, (size_t)n);
  close(fd);
  return out;
}

/* ---- ZIP (stored or deflated entries; the editor's packs are stored) ---- */
struct Entry {
  std::string name;
  uint16_t method = 0;
  uint32_t csize = 0, usize = 0, local = 0;
};

bool zip_list(int fd, off_t size, std::vector<Entry> &out) {
  const size_t tail = size < 65557 ? (size_t)size : 65557;
  if (tail < 22)
    return false;
  std::vector<unsigned char> t(tail);
  if (!read_at(fd, t.data(), tail, size - (off_t)tail))
    return false;
  long end = -1;
  for (long i = (long)tail - 22; i >= 0; --i)
    if (le32(&t[(size_t)i]) == 0x06054b50) {
      end = i;
      break;
    }
  if (end < 0)
    return false;
  const uint16_t count = le16(&t[(size_t)end + 10]);
  const uint32_t csize = le32(&t[(size_t)end + 12]), at = le32(&t[(size_t)end + 16]);
  if ((off_t)at + (off_t)csize > size || csize > (16u << 20))
    return false;
  std::vector<unsigned char> c(csize);
  if (!read_at(fd, c.data(), csize, at))
    return false;
  size_t p = 0;
  for (uint16_t n = 0; n < count; ++n) {
    if (p + 46 > c.size() || le32(&c[p]) != 0x02014b50)
      return false;
    Entry e;
    e.method = le16(&c[p + 10]);
    e.csize = le32(&c[p + 20]);
    e.usize = le32(&c[p + 24]);
    const uint16_t nlen = le16(&c[p + 28]), xlen = le16(&c[p + 30]), clen = le16(&c[p + 32]);
    e.local = le32(&c[p + 42]);
    if (p + 46 + nlen > c.size())
      return false;
    e.name.assign((const char *)&c[p + 46], nlen);
    p += 46 + (size_t)nlen + xlen + clen;
    if (!e.name.empty() && e.name.back() != '/')
      out.push_back(e);
  }
  return true;
}

/* the entry's bytes to `sink` a piece at a time (big videos never whole in memory) */
template <typename Sink> bool zip_read(int fd, const Entry &e, Sink sink) {
  unsigned char h[30];
  if (!read_at(fd, h, sizeof(h), e.local) || le32(h) != 0x04034b50)
    return false;
  off_t at = (off_t)e.local + 30 + le16(h + 26) + le16(h + 28);
  std::vector<unsigned char> in(256u << 10);
  uint32_t left = e.csize;
  if (e.method == 0) {
    while (left) {
      const size_t n = left < in.size() ? left : in.size();
      if (!read_at(fd, in.data(), n, at) || !sink((const char *)in.data(), n))
        return false;
      at += (off_t)n;
      left -= (uint32_t)n;
    }
    return true;
  }
  if (e.method != 8)
    return false;
  z_stream zs = {};
  if (inflateInit2(&zs, -15) != Z_OK)
    return false;
  std::vector<unsigned char> out(256u << 10);
  bool ok = true, done = false;
  while (ok && !done) {
    if (zs.avail_in == 0 && left) {
      const size_t n = left < in.size() ? left : in.size();
      ok = read_at(fd, in.data(), n, at);
      at += (off_t)n;
      left -= (uint32_t)n;
      zs.next_in = in.data();
      zs.avail_in = (uInt)n;
    }
    zs.next_out = out.data();
    zs.avail_out = (uInt)out.size();
    const int r = inflate(&zs, Z_NO_FLUSH);
    if (r != Z_OK && r != Z_STREAM_END)
      ok = false;
    const size_t made = out.size() - zs.avail_out;
    if (ok && made && !sink((const char *)out.data(), made))
      ok = false;
    done = r == Z_STREAM_END;
    if (ok && !done && !left && zs.avail_in == 0 && made == 0)
      ok = false; /* cut short */
  }
  inflateEnd(&zs);
  return ok;
}

bool zip_text(int fd, const Entry &e, std::string &out) {
  out.clear();
  return zip_read(fd, e, [&](const char *d, size_t n) {
    if (out.size() + n > kMaxText)
      return false;
    out.append(d, n);
    return true;
  });
}

/* one asset to dest: never more bytes than the ZIP says (a deflated entry
   cannot grow past its declared size), than kMaxAsset or than what is left
   of kMaxPack (*total = bytes written so far), and its first bytes must be
   one of the `allowed` types. *why = the reason when it is not written. */
bool zip_file(int fd, const Entry &e, const std::string &dest, const char *allowed, uint64_t *total,
              std::string *why) {
  const std::string temp = dest + ".part";
  const int out = open(temp.c_str(), O_WRONLY | O_CREAT | O_TRUNC, 0666);
  if (out < 0) {
    *why = "cannot write";
    return false;
  }
  unsigned char head[16] = {};
  size_t got = 0;
  uint64_t size = 0;
  bool checked = false;
  bool ok = zip_read(fd, e, [&](const char *d, size_t n) {
    size += n;
    if (size > e.usize || size > kMaxAsset || *total + size > kMaxPack) {
      *why = size > e.usize ? "bigger than the pack says" : "too big";
      return false;
    }
    if (!checked) {
      const size_t k = std::min(n, sizeof(head) - got);
      memcpy(head + got, d, k);
      got += k;
      if (got == sizeof(head) || size >= e.usize) {
        checked = true;
        if (!type_ok(allowed, sniff(head, got))) {
          *why = "not the kind of file its name says";
          return false;
        }
      }
    }
    return write_out(out, d, n);
  });
  if (ok && !checked && !type_ok(allowed, sniff(head, got))) {
    *why = "not the kind of file its name says";
    ok = false;
  }
  if (!ok && why->empty())
    *why = "cannot unpack";
  ok = fsync(out) == 0 && ok;
  close(out);
  ok = ok && rename(temp.c_str(), dest.c_str()) == 0;
  if (!ok)
    unlink(temp.c_str());
  else
    *total += size;
  return ok;
}

void tell(const std::string &text) {
  zt_log("install: %s", text.c_str());
  if (!sceKernelSendNotificationRequest)
    return;
  OrbisNotificationRequest req = {};
  snprintf(req.message, sizeof(req.message), "XMB5: %s", text.c_str());
  sceKernelSendNotificationRequest(0, &req, sizeof(req), 0);
}

/* a name already taken: its .ztheme or its folder (a folder left without
   its file still makes zt_theme_new refuse the name) */
bool name_taken(const std::string &n) {
  return access(zt_theme_file(n).c_str(), F_OK) == 0 || access((std::string(ZT_THEMES "/") + n).c_str(), F_OK) == 0;
}

/* the theme's name, or <name>-2, -3... when a theme already has it */
std::string free_name(const std::string &n) {
  if (!name_taken(n))
    return n;
  for (int i = 2; i < 1000; ++i) {
    const std::string tail = "-" + std::to_string(i);
    std::string base = n.substr(0, 40 - tail.size());
    while (!base.empty() && (base.back() == '-' || base.back() == '.'))
      base.pop_back();
    const std::string m = base + tail;
    if (zt_theme_name_ok(m) && !name_taken(m))
      return m;
  }
  return n;
}

/* "" when installed (*name = the theme), else the reason. replace: the
   theme this file installed before (a USB file updated): that one is
   replaced; any other theme with the same name is kept. */
std::string install_one(const std::string &path, const std::string &stem, std::string *name,
                        const std::string &replace = std::string()) {
  const int fd = open(path.c_str(), O_RDONLY);
  if (fd < 0)
    return "cannot open";
  struct stat st = {};
  fstat(fd, &st);
  unsigned char head[4] = {};
  const bool zip = st.st_size >= 22 && read_at(fd, head, 4, 0) && le32(head) == 0x04034b50;
  /* what the file holds: info + the THEME values, and the files to unpack
     (<kind>/<file>; assets/<kind>/<file> in older packs) */
  ZtThemeInfo info;
  std::string text, json, old_info, from;
  std::vector<Entry> entries, assets;
  if (zip) {
    if (!zip_list(fd, st.st_size, entries)) {
      close(fd);
      return "broken ZIP file";
    }
    if (entries.size() > kMaxEntries) {
      close(fd);
      return "too many files in this pack";
    }
    uint64_t declared = 0;
    for (const Entry &e : entries)
      declared += e.usize;
    if (declared > kMaxPack) {
      close(fd);
      return "pack too big (more than 4 GB unpacked)";
    }
    /* theme.json at the top, or in one folder (a theme's folder zipped by hand) */
    std::string base;
    for (const Entry &e : entries) {
      const size_t slash = e.name.find('/');
      const std::string file = e.name.substr(slash == std::string::npos ? 0 : slash + 1);
      if ((e.name == "theme.json" || (file == "theme.json" && e.name.find('/', slash + 1) == std::string::npos)) &&
          (json.empty() || e.name == "theme.json")) {
        if (!zip_text(fd, e, json)) {
          close(fd);
          return "cannot read theme.json";
        }
        base = e.name.substr(0, e.name.size() - 10);
      }
    }
    for (const Entry &e : entries) {
      if (e.name == "theme.ztheme" && json.empty() && !zip_text(fd, e, text)) {
        close(fd);
        return "cannot read theme.ztheme";
      }
      if (e.name == "zhitheme.json")
        zip_text(fd, e, old_info);
      std::string rel = e.name;
      if (!base.empty()) {
        if (rel.compare(0, base.size(), base) != 0)
          continue;
        rel = rel.substr(base.size());
      } else if (rel.rfind("assets/", 0) == 0)
        rel = rel.substr(7);
      const size_t s1 = rel.find('/');
      if (s1 == std::string::npos || rel.find('/', s1 + 1) != std::string::npos || s1 + 1 >= rel.size())
        continue;
      const std::string kind = rel.substr(0, s1);
      if ((kind == "wallpapers" || kind == "icons" || kind == "fonts") && assets.size() < kMaxAssets) {
        Entry a = e;
        a.name = rel; /* <kind>/<file> */
        assets.push_back(a);
      }
    }
    if (!json.empty()) {
      int dropped = 0;
      if (!zt_theme_json_parse(json, &info, &text, &dropped)) {
        close(fd);
        return "theme.json of this pack is not a ZhiThemes theme (format 2)";
      }
      from = "pack";
      if (dropped)
        zt_logl('W', "install: %s: %d values not plain values, left out", path.c_str(), dropped);
    } else if (text.empty()) {
      close(fd);
      return "no theme.json in this pack";
    } else
      from = "old pack, translated";
  } else {
    if (st.st_size > (off_t)kMaxText) {
      close(fd);
      return "not a theme (too big for a theme text)";
    }
    text = read_text(path.c_str());
    from = "old theme text, translated";
  }
  if (!is_theme_text(text)) {
    close(fd);
    return "no theme.json and no \"var THEME = {...}\" block: not a XMB5 theme";
  }
  /* the name: theme.json's, an older pack's zhitheme.json / themeName, the file's */
  if (info.name.empty())
    info.name = quoted_after(old_info, "\"name\"", '"');
  if (info.name.empty())
    info.name = quoted_after(text, "themeName", '\'');
  std::string n = theme_safe(info.name);
  if (n.empty())
    n = theme_safe(stem);
  if (n.empty())
    n = "New-theme";
  if (info.name.empty())
    info.name = n;
  if (!replace.empty() && zt_theme_name_ok(replace) && access(zt_theme_file(replace).c_str(), F_OK) == 0)
    n = replace;
  else {
    const std::string asked = n;
    n = free_name(n);
    if (n != asked)
      zt_log("install: a theme %s is already there, this one becomes %s", asked.c_str(), n.c_str());
  }
  *name = n;
  const std::string active = zt_theme_name();
  const bool there = access(zt_theme_file(n).c_str(), F_OK) == 0;
  const std::string before = n == active ? zt_theme_read(active) : std::string();
  std::string err = there ? zt_theme_clear(n) : zt_theme_new(n, std::string());
  if (!err.empty()) {
    close(fd);
    return err;
  }
  int files = 0, refused = 0;
  uint64_t total = 0;
  for (const Entry &e : assets) {
    const size_t s1 = e.name.find('/');
    const std::string kind = e.name.substr(0, s1), orig = e.name.substr(s1 + 1);
    std::string file = name_ok(orig) ? orig : upload_name(orig);
    const char *allowed = allowed_types(kind, file);
    if (!*allowed) {
      zt_log("install: %s left out (not a %s file type)", e.name.c_str(), kind.c_str());
      ++refused;
      continue;
    }
    if (file != orig)
      for (size_t at = 0; (at = text.find(orig, at)) != std::string::npos; at += file.size())
        text.replace(at, orig.size(), file);
    const std::string dir = zt_theme_dir_of(n, kind.c_str());
    zt_mkdirs(dir);
    const std::string dest = dir + "/" + file;
    std::string why;
    if (!zip_file(fd, e, dest, allowed, &total, &why)) {
      zt_log("install: %s left out: %s (method %u, %u bytes)", e.name.c_str(), why.c_str(), e.method, e.csize);
      ++refused;
      continue;
    }
    zt_dedupe(dest);
    ++files;
  }
  close(fd);
  if (!zt_theme_save(n, info, text))
    return "cannot write " + zt_theme_file(n);
  if (n == active) {
    if (!before.empty())
      zt_carry_personal(before, zt_theme_file(n));
  } else if (!(err = zt_theme_use(n)).empty())
    return err;
  zt_logl('A', "install: %s -> theme %s (%s, %d of %zu files%s)", path.c_str(), n.c_str(), from.c_str(), files,
          assets.size(), there ? ", replaced the old one" : "");
  if (refused)
    tell(std::to_string(refused) + " file(s) of " + n + " left out (wrong type or too big, see the log)");
  return "";
}

} // namespace

void zt_install_dropped() {
  mkdir(ZT_INSTALL, 0777);
  std::vector<std::string> names;
  if (DIR *d = opendir(ZT_INSTALL)) {
    while (dirent *e = readdir(d)) {
      const std::string f = e->d_name;
      if (f.empty() || f[0] == '.' || ends_with(f, ".failed") || ends_with(f, ".part") || ends_with(f, ".tmp"))
        continue;
      struct stat st = {};
      if (stat((std::string(ZT_INSTALL "/") + f).c_str(), &st) == 0 && S_ISREG(st.st_mode))
        names.push_back(f);
    }
    closedir(d);
  }
  if (names.empty())
    return;
  std::sort(names.begin(), names.end());
  std::string last;
  int done = 0;
  for (const std::string &f : names) {
    const std::string path = std::string(ZT_INSTALL "/") + f;
    const size_t dot = f.rfind('.');
    const std::string stem = dot == std::string::npos || dot == 0 ? f : f.substr(0, dot);
    std::string theme;
    const time_t t0 = time(nullptr);
    const std::string err = install_one(path, stem, &theme);
    if (err.empty()) {
      unlink(path.c_str());
      last = theme;
      ++done;
      zt_log("install: %s done in %ld s, deleted from Install", f.c_str(), (long)(time(nullptr) - t0));
    } else {
      rename(path.c_str(), (path + ".failed").c_str());
      tell(f + " not installed: " + err + " (now " + f + ".failed)");
    }
  }
  /* a theme dropped in Install/ turns ZhiThemes back on */
  if (done)
    unlink(ZT_DIR "/no_theme");
  if (done == 1)
    tell("theme " + last + " installed from the Install folder and in use");
  else if (done > 1)
    tell(std::to_string(done) + " themes installed from the Install folder; in use: " + zt_theme_name());
}

/* ---- the Home's Options menu > ZhiThemes ----
   The list of themes, the theme files found on a USB stick
   (/mnt/usbN/ZhiThemes/<file>, or /mnt/usbN/<file>.ztheme) and in Install/,
   "PS5 default" (no_theme: ZhiThemes off, only this menu stays) and the
   safe mode (a USB stick with ZhiThemes/no_theme). */
namespace {

const char *const kStockFile = ZT_DIR "/no_theme";
std::atomic<bool> g_menu_installing{false};

bool exists(const std::string &p) {
  struct stat st = {};
  return stat(p.c_str(), &st) == 0;
}

bool ends_nocase(const std::string &s, const char *e) {
  const size_t n = strlen(e);
  if (s.size() < n)
    return false;
  for (size_t i = 0; i < n; ++i)
    if (tolower((unsigned char)s[s.size() - n + i]) != e[i])
      return false;
  return true;
}

/* ShellUI sees the USB drives as /usb0../usb7 (AniketosHEN's package_files:
   "ShellUI has its own view of the file system"); /mnt/usbN as well, for safety */
std::string usb_root(int i) { return (i < 8 ? "/usb" : "/mnt/usb") + std::to_string(i % 8); }

bool usb_off() {
  for (int i = 0; i < 16; ++i) {
    const std::string b = usb_root(i) + "/XMB5/no_theme";
    if (exists(b) || exists(b + ".txt"))
      return true;
  }
  return false;
}

struct Found {
  std::string path, name, from;
  long long size = 0, mtime = 0;
  /* USB files: "new", "installed" (same name, size and date as a
     file installed before, its theme still there) or "update" (same name,
     other size or date) */
  std::string state = "new", theme;
};

/* Themes/.installed, one line per USB file installed:
   <file name>|<size>|<mtime>|<theme> (the last install of that name) */
#define ZT_INSTALLED ZT_THEMES "/.installed"
struct Record {
  std::string file, theme;
  long long size, mtime;
};

std::vector<Record> records() {
  std::vector<Record> out;
  FILE *fp = fopen(ZT_INSTALLED, "r");
  if (!fp)
    return out;
  char line[512];
  while (fgets(line, sizeof(line), fp)) {
    std::string l = line;
    while (!l.empty() && (l.back() == 10 || l.back() == 13))
      l.pop_back();
    const size_t a = l.find('|'), b = a == std::string::npos ? a : l.find('|', a + 1),
                 c = b == std::string::npos ? b : l.find('|', b + 1);
    if (c == std::string::npos)
      continue;
    out.push_back({l.substr(0, a), l.substr(c + 1), atoll(l.c_str() + a + 1), atoll(l.c_str() + b + 1)});
  }
  fclose(fp);
  return out;
}

void record_install(const Found &f, const std::string &theme) {
  std::vector<Record> list = records();
  list.erase(std::remove_if(list.begin(), list.end(), [&](const Record &r) { return r.file == f.name; }),
             list.end());
  list.push_back({f.name, theme, f.size, f.mtime});
  if (list.size() > 200)
    list.erase(list.begin(), list.begin() + (list.size() - 200));
  const std::string temp = std::string(ZT_INSTALLED) + ".tmp";
  FILE *fp = fopen(temp.c_str(), "w");
  if (!fp)
    return;
  for (const Record &r : list)
    fprintf(fp, "%s|%lld|%lld|%s\n", r.file.c_str(), r.size, r.mtime, r.theme.c_str());
  fclose(fp);
  rename(temp.c_str(), ZT_INSTALLED);
}

/* any: the Install/ filter (every file but .x, .failed, .part, .tmp);
   else only .ztheme / .zip (a USB stick has other files) */
void scan_dir(const std::string &dir, const char *from, int kind, std::vector<Found> &out) {
  DIR *d = opendir(dir.c_str());
  if (!d)
    return;
  std::vector<std::string> names;
  while (dirent *e = readdir(d)) {
    const std::string f = e->d_name;
    if (f.empty() || f[0] == '.' || ends_with(f, ".failed") || ends_with(f, ".part") || ends_with(f, ".tmp"))
      continue;
    if (kind == 1 && !ends_nocase(f, ".ztheme") && !ends_nocase(f, ".zip"))
      continue;
    if (kind == 2 && !ends_nocase(f, ".ztheme"))
      continue;
    struct stat st = {};
    if (stat((dir + "/" + f).c_str(), &st) == 0 && S_ISREG(st.st_mode))
      names.push_back(f);
  }
  closedir(d);
  std::sort(names.begin(), names.end());
  for (size_t i = 0; i < names.size() && i < 20; ++i) {
    Found f;
    f.path = dir + "/" + names[i];
    f.name = names[i];
    f.from = from;
    struct stat st = {};
    if (stat(f.path.c_str(), &st) == 0) {
      f.size = (long long)st.st_size;
      f.mtime = (long long)st.st_mtime;
    }
    out.push_back(f);
  }
}

/* what ShellUI sees of each /mnt/usbN (logged when it changes): the
   an older menu showed no USB files with a stick in usb1 */
void usb_report() {
  static std::string last;
  std::string now;
  for (int i = 0; i < 16; ++i) {
    const std::string usb = usb_root(i);
    struct stat st = {};
    if (stat(usb.c_str(), &st) != 0) {
      if (errno != ENOENT)
        now += usb + ": stat errno " + std::to_string(errno) + "; ";
      continue;
    }
    DIR *d = opendir(usb.c_str());
    if (!d) {
      now += usb + ": opendir errno " + std::to_string(errno) + "; ";
      continue;
    }
    now += usb + ":";
    int n = 0;
    while (dirent *e = readdir(d)) {
      if (e->d_name[0] == '.')
        continue;
      if (n++ < 25)
        now += std::string(" ") + e->d_name + (e->d_type == DT_DIR ? "/" : "");
    }
    closedir(d);
    if (n > 25)
      now += " (+" + std::to_string(n - 25) + ")";
    now += "; ";
  }
  if (now.empty())
    now = "no USB drive (/usbN, /mnt/usbN)";
  if (now != last) {
    last = now;
    zt_log("menu: usb: %.900s", now.c_str());
  }
}

std::vector<Found> found_files() {
  std::vector<Found> out;
  usb_report();
  for (int i = 0; i < 16; ++i) {
    if (i == 8 && !out.empty())
      break; /* the same drives seen as /usbN: not twice */
    const std::string usb = usb_root(i);
    /* ZhiThemes/ (also ZhiThemes/Themes/ and Themes/, like the console
       layout): .ztheme and .zip; the stick's root: .ztheme only */
    scan_dir(usb + "/XMB5", "usb", 1, out);
    scan_dir(usb + "/XMB5/Themes", "usb", 1, out);
    scan_dir(usb + "/Themes", "usb", 1, out);
    scan_dir(usb, "usb", 2, out);
  }
  /* a USB file installed before (Themes/.installed) */
  const std::vector<Record> done = records();
  for (Found &f : out) {
    if (f.from != "usb")
      continue;
    for (const Record &r : done) {
      if (r.file != f.name || !zt_theme_name_ok(r.theme) || !exists(zt_theme_file(r.theme)))
        continue;
      f.theme = r.theme;
      f.state = r.size == f.size && r.mtime == f.mtime ? "installed" : "update";
    }
  }
  scan_dir(ZT_INSTALL, "install", 0, out);
  return out;
}

std::string jstr(const std::string &s) {
  std::string out = "\"";
  for (unsigned char c : s) {
    if (c == '"' || c == 92) {
      out += (char)92;
      out += (char)c;
    } else if (c < 0x20) {
      char b[8];
      snprintf(b, sizeof(b), "%cu%04x", 92, c);
      out += b;
    } else
      out += (char)c;
  }
  return out + "\"";
}

void menu_tell(const std::string &text) {
  zt_log("menu: %s", text.c_str());
  if (!sceKernelSendNotificationRequest)
    return;
  OrbisNotificationRequest req = {};
  snprintf(req.message, sizeof(req.message), "XMB5: %s", text.c_str());
  sceKernelSendNotificationRequest(0, &req, sizeof(req), 0);
}

struct InstallJob {
  Found file;
  void (*done)();
};

void *install_thread(void *arg) {
  InstallJob *job = (InstallJob *)arg;
  const Found f = job->file;
  void (*done)() = job->done;
  delete job;
  const size_t dot = f.name.rfind('.');
  const std::string stem = dot == std::string::npos || dot == 0 ? f.name : f.name.substr(0, dot);
  const bool usb = f.from == "usb";
  menu_tell("installing " + f.name + (usb ? " from USB..." : " from the Install folder..."));
  std::string theme;
  const time_t t0 = time(nullptr);
  /* a newer copy of a USB file installed before replaces its theme */
  const std::string err = install_one(f.path, stem, &theme, usb && f.state == "update" ? f.theme : std::string());
  if (err.empty()) {
    /* the USB stick is left as it is; Install/ is emptied as at the start */
    if (!usb)
      unlink(f.path.c_str());
    else
      record_install(f, theme); /* shown as "(installed)" from now on */
    zt_stock_set(false);
    zt_log("menu: %s -> %s in %ld s", f.path.c_str(), theme.c_str(), (long)(time(nullptr) - t0));
    menu_tell("theme " + theme + " installed" + (usb ? " from USB" : "") + " and in use" +
              (usb_off() ? " (a USB stick with XMB5/no_theme keeps XMB5 off)" : ""));
    if (done)
      done();
  } else {
    if (!usb)
      rename(f.path.c_str(), (f.path + ".failed").c_str());
    menu_tell(f.name + " not installed: " + err);
  }
  g_menu_installing.store(false);
  return nullptr;
}

} // namespace

/* no theme file (first run, or deleted) is off too: the factory theme
   is never applied on its own */
bool zt_stock_on() { return exists(kStockFile) || usb_off() || !exists(zt_theme_file()); }

void zt_stock_set(bool on) {
  if (on) {
    const int fd = open(kStockFile, O_WRONLY | O_CREAT | O_TRUNC, 0666);
    if (fd >= 0)
      close(fd);
  } else
    unlink(kStockFile);
}

std::string zt_theme_menu_json() {
  std::string out = "{\"off\":";
  out += exists(kStockFile) || !exists(zt_theme_file()) ? "true" : "false";
  out += ",\"usbOff\":";
  out += usb_off() ? "true" : "false";
  out += ",\"installing\":";
  out += g_menu_installing.load() ? "true" : "false";
  out += ",\"list\":" + zt_themes_json() + ",\"tools\":" + zt_tools_json() +
         ",\"update\":" + zt_update_json() + ",\"files\":[";
  bool first = true;
  for (const Found &f : found_files()) {
    out += first ? "" : ",";
    first = false;
    out += "{\"path\":" + jstr(f.path) + ",\"name\":" + jstr(f.name) + ",\"from\":" + jstr(f.from) +
           ",\"state\":" + jstr(f.state) + ",\"theme\":" + jstr(f.theme) + "}";
  }
  return out + "]}";
}

std::string zt_theme_menu_use(const std::string &name) {
  if (!zt_theme_name_ok(name) || !exists(zt_theme_file(name)))
    return "no theme " + name;
  if (name != zt_theme_name()) {
    const std::string err = zt_theme_use(name);
    if (!err.empty())
      return err;
  }
  zt_stock_set(false);
  menu_tell("theme " + name + " in use" +
            (usb_off() ? " (a USB stick with XMB5/no_theme keeps XMB5 off)" : ""));
  return "";
}

std::string zt_theme_menu_install(const std::string &path, void (*done)()) {
  if (g_menu_installing.load())
    return "another theme is being installed";
  for (const Found &f : found_files()) {
    if (f.path != path)
      continue;
    g_menu_installing.store(true);
    pthread_t t;
    InstallJob *job = new InstallJob{f, done};
    if (pthread_create(&t, nullptr, install_thread, job) != 0) {
      delete job;
      g_menu_installing.store(false);
      return "cannot start the install";
    }
    pthread_detach(t);
    return "";
  }
  return "file not found (USB stick taken out?)";
}

void zt_menu_notify(const std::string &text) { menu_tell(text); }

/* the editor's Install: a file it sent (POST /install), installed as the
   Home menu does */
std::string zt_install_file(const std::string &path, const std::string &file_name, std::string *theme,
                            const std::string &replace) {
  bool idle = false;
  if (!g_menu_installing.compare_exchange_strong(idle, true))
    return "another theme is being installed";
  const size_t dot = file_name.rfind('.');
  const std::string stem = dot == std::string::npos || dot == 0 ? file_name : file_name.substr(0, dot);
  const time_t t0 = time(nullptr);
  const std::string err = install_one(path, stem, theme, replace);
  if (err.empty()) {
    zt_stock_set(false);
    zt_log("install: %s (editor) -> %s in %ld s", file_name.c_str(), theme->c_str(), (long)(time(nullptr) - t0));
  }
  g_menu_installing.store(false);
  return err;
}

/* ---- the .ztheme of a theme (the editor's Download) ----
   theme.json without the personal values (folders, custom tile choices:
   each user's own) and the files of the fields the theme shows; a picture
   or video in a field that is off stays out (and out of theme.json). A ZIP
   without compression (pictures, videos and fonts are compressed already),
   each entry's CRC and size after its data (sent while it is read, so a
   video is never whole in memory and never read twice). */
namespace {

const char *const kPackPersonal[] = {"folders", "foldersIcon", "customTileChoice", "customBgChoice",
                                     "favorites", "steamGridKey"};

bool pack_wall(const std::string &k) {
  return k == "wallpaper" || k == "bgOverlay" || k == "sysBg" || k == "homeMusic";
}

bool one_of(const std::string &s, std::initializer_list<const char *> list) {
  for (const char *x : list)
    if (s == x)
      return true;
  return false;
}

/* deco1Icon, footerIcon2: prefix + one digit + suffix */
bool digit_key(const std::string &k, const char *prefix, const char *suffix) {
  const size_t p = strlen(prefix), s = strlen(suffix);
  return k.size() == p + 1 + s && k.compare(0, p, prefix) == 0 && isdigit((unsigned char)k[p]) &&
         k.compare(p + 1, s, suffix) == 0;
}

bool pack_icon(const std::string &k) {
  return one_of(k, {"searchIcon", "settingsIcon", "powerBtnIcon", "trophyBtnIcon", "padInfoIcon", "tabsGameIcon",
                    "tabsMediaIcon", "tabsRecentIcon", "tabsFavIcon", "tabsNeverIcon", "tabsGroupLeft",
                    "tabsGroupRight", "particlesImage"}) ||
         digit_key(k, "deco", "Icon") || digit_key(k, "footerIcon", "");
}

bool pack_font(const std::string &k) {
  return one_of(k, {"elementFont", "systemFont", "systemFontBold", "systemFontItalic", "systemFontBoldItalic",
                    "footerIconFont"});
}

bool ends_any(const std::string &s, std::initializer_list<const char *> list) {
  for (const char *e : list)
    if (ends_nocase(s, e))
      return true;
  return false;
}

std::string unquote(const std::string &v) {
  return v.size() >= 2 && v.front() == '\'' && v.back() == '\'' ? v.substr(1, v.size() - 2) : std::string();
}

/* the editor's packUsed: is the field's picture / video shown? */
bool pack_used(const std::string &k, const std::vector<std::pair<std::string, std::string>> &values) {
  auto value = [&](const std::string &f) {
    for (const auto &kv : values)
      if (kv.first == f)
        return kv.second;
    return std::string();
  };
  auto on = [&](const std::string &f) { return value(f) == "true"; };
  if (k == "wallpaper")
    return on("wallpaperOn");
  if (k == "bgOverlay")
    return on("bgOverlayOn");
  if (k == "homeMusic")
    return on("homeMusicOn");
  if (k == "sysBg")
    return on("sysOn") && on("sysBgOn") && !on("sysBgWallpaper");
  if (k == "particlesImage")
    return on("particlesOn") && unquote(value("particlesStyle")).empty();
  if (k == "powerBtnIcon" || k == "trophyBtnIcon" || k == "padInfoIcon")
    return on(k.substr(0, k.size() - 4) + "On");
  if (digit_key(k, "deco", "Icon"))
    return on(k.substr(0, 5) + "On");
  if (k == "tabsGroupLeft" || k == "tabsGroupRight")
    return on("tabsGroup");
  if (k.compare(0, 4, "tabs") == 0 && ends_with(k, "Icon"))
    return on("tabsIconsOn");
  if (digit_key(k, "footerIcon", ""))
    return on("footer");
  return true;
}

std::vector<std::string> dir_files(const std::string &dir) {
  std::vector<std::string> out;
  if (DIR *d = opendir(dir.c_str())) {
    while (dirent *e = readdir(d)) {
      const std::string n = e->d_name;
      if (!n.empty() && n[0] != '.' && !ends_with(n, ".part") && !ends_with(n, ".tmp"))
        out.push_back(n);
    }
    closedir(d);
  }
  std::sort(out.begin(), out.end());
  return out;
}

void put16(std::string &b, unsigned v) {
  b += (char)(v & 255);
  b += (char)((v >> 8) & 255);
}
void put32(std::string &b, uint32_t v) {
  put16(b, v & 0xFFFF);
  put16(b, v >> 16);
}

} // namespace

std::string zt_theme_pack_plan(const std::string &name, ZtPack *pack) {
  *pack = ZtPack();
  if (!zt_theme_name_ok(name))
    return "invalid theme name";
  const std::string text = zt_theme_read(name);
  if (text.empty())
    return "no theme " + name;
  const auto values = zt_theme_values_of(text);
  const std::vector<std::string> fonts = dir_files(zt_theme_dir_of(name, "fonts"));
  std::string out = "var THEME = {\n";
  std::vector<std::string> seen;
  auto add = [&](const char *kind, const std::string &file) {
    const std::string rel = std::string(kind) + "/" + file;
    if (std::find(seen.begin(), seen.end(), rel) != seen.end() || !name_ok(file))
      return;
    seen.push_back(rel);
    std::string path = zt_theme_dir_of(name, kind) + "/" + file;
    struct stat st = {};
    if (stat(path.c_str(), &st) != 0 && strcmp(kind, "fonts") != 0)
      path = std::string(ZT_LEGACY "/") + file; /* files of older versions */
    if (stat(path.c_str(), &st) != 0 || !S_ISREG(st.st_mode)) {
      zt_logl('W', "pack: %s: %s is not on the PS5, left out", name.c_str(), rel.c_str());
      ++pack->missing;
      return;
    }
    pack->files.push_back({rel, path, (uint64_t)st.st_size});
  };
  for (const auto &kv : values) {
    const std::string &k = kv.first;
    bool personal = false;
    for (const char *p : kPackPersonal)
      personal = personal || k == p;
    if (personal)
      continue;
    std::string value = kv.second;
    const std::string v = unquote(value);
    const bool wall = pack_wall(k), icon = pack_icon(k);
    if (!v.empty() && (wall || icon) && !pack_used(k, values)) {
      /* not shown: no file, and its name not in theme.json either */
      if (wall || ends_any(v, {".png", ".jpg", ".jpeg", ".webp", ".gif", ".mp4", ".mp3", ".m4a", ".aac", ".wav",
                               ".at9", ".ogg"}))
        value = "''";
    } else if (!v.empty() && v.find('/') == std::string::npos) {
      if (wall)
        add("wallpapers", v);
      else if (icon && ends_any(v, {".png", ".jpg", ".jpeg", ".webp"}))
        add("icons", v);
      else if (pack_font(k) && std::find(fonts.begin(), fonts.end(), v) != fonts.end()) {
        add("fonts", v);
        /* its -Bold / -Italic files, used when the style fields are empty */
        std::string stem = v.substr(0, v.rfind('.') == std::string::npos ? v.size() : v.rfind('.'));
        for (const char *tail : {"-regular", "-roman"})
          if (ends_nocase(stem, tail))
            stem.resize(stem.size() - strlen(tail));
        for (const std::string &f : fonts)
          if (f != v && f.compare(0, stem.size() + 1, stem + "-") == 0)
            add("fonts", f);
      }
    }
    out += "    " + k + ": " + value + ",\n";
  }
  out += "  };\n";
  if (pack->files.size() > kMaxAssets)
    return "too many files for one .ztheme (" + std::to_string(pack->files.size()) + ", at most " +
           std::to_string(kMaxAssets) + ")";
  pack->theme = name;
  pack->json = zt_theme_json_make(out, zt_theme_info(name));
  uint64_t size = 22;
  auto entry = [&](const std::string &rel, uint64_t bytes) { size += 30 + 16 + 46 + 2 * rel.size() + bytes; };
  entry("theme.json", pack->json.size());
  for (const ZtPackFile &f : pack->files)
    entry(f.rel, f.size);
  if (size >= 0xFFFFFFFFull)
    return "the theme's files are too big for one .ztheme (4 GB at most)";
  pack->size = size;
  return "";
}

bool zt_theme_pack_write(const ZtPack &pack, const std::function<bool(const char *, size_t)> &sink) {
  const time_t now = time(nullptr);
  struct tm tm = {};
  gmtime_r(&now, &tm);
  const unsigned dtime = (unsigned)(tm.tm_hour << 11 | tm.tm_min << 5 | tm.tm_sec / 2);
  const unsigned ddate = (unsigned)((tm.tm_year - 80) << 9 | (tm.tm_mon + 1) << 5 | tm.tm_mday);
  std::string central;
  uint32_t offset = 0;
  unsigned count = 0;
  /* one entry: local header, the data (data() sends it and gives its CRC),
     descriptor; its central record kept for the end */
  auto entry = [&](const std::string &rel, uint64_t size, const std::function<bool(uint32_t *)> &data) {
    std::string h;
    put32(h, 0x04034b50);
    put16(h, 20);
    put16(h, 0x0808); /* sizes after the data; UTF-8 names */
    put16(h, 0);
    put16(h, dtime);
    put16(h, ddate);
    put32(h, 0);
    put32(h, 0);
    put32(h, 0);
    put16(h, (unsigned)rel.size());
    put16(h, 0);
    h += rel;
    if (!sink(h.data(), h.size()))
      return false;
    uint32_t crc = 0;
    if (!data(&crc))
      return false;
    std::string d;
    put32(d, 0x08074b50);
    put32(d, crc);
    put32(d, (uint32_t)size);
    put32(d, (uint32_t)size);
    if (!sink(d.data(), d.size()))
      return false;
    std::string c;
    put32(c, 0x02014b50);
    put16(c, 20);
    put16(c, 20);
    put16(c, 0x0808);
    put16(c, 0);
    put16(c, dtime);
    put16(c, ddate);
    put32(c, crc);
    put32(c, (uint32_t)size);
    put32(c, (uint32_t)size);
    put16(c, (unsigned)rel.size());
    put16(c, 0);
    put16(c, 0);
    put16(c, 0);
    put16(c, 0);
    put32(c, 0);
    put32(c, offset);
    c += rel;
    central += c;
    offset += (uint32_t)(h.size() + size + d.size());
    ++count;
    return true;
  };
  const std::string &json = pack.json;
  if (!entry("theme.json", json.size(), [&](uint32_t *crc) {
        *crc = (uint32_t)crc32(0L, (const Bytef *)json.data(), (uInt)json.size());
        return sink(json.data(), json.size());
      }))
    return false;
  std::vector<char> buf(256u << 10);
  for (const ZtPackFile &f : pack.files) {
    const bool ok = entry(f.rel, f.size, [&](uint32_t *crc) {
      const int in = open(f.path.c_str(), O_RDONLY);
      if (in < 0)
        return false;
      uLong c = crc32(0L, Z_NULL, 0);
      uint64_t left = f.size;
      bool good = true;
      while (good && left) {
        const ssize_t n = read(in, buf.data(), (size_t)std::min<uint64_t>(left, buf.size()));
        good = n > 0 && sink(buf.data(), (size_t)n);
        if (good) {
          c = crc32(c, (const Bytef *)buf.data(), (uInt)n);
          left -= (uint64_t)n;
        }
      }
      close(in);
      *crc = (uint32_t)c;
      return good;
    });
    if (!ok) {
      zt_logl('W', "pack: %s: %s not sent (file changed, or the browser closed the download)", pack.theme.c_str(),
              f.rel.c_str());
      return false;
    }
  }
  std::string e;
  put32(e, 0x06054b50);
  put16(e, 0);
  put16(e, 0);
  put16(e, count);
  put16(e, count);
  put32(e, (uint32_t)central.size());
  put32(e, offset);
  put16(e, 0);
  return sink(central.data(), central.size()) && sink(e.data(), e.size());
}
