/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.  */

/*
 * A theme on the PS5 is Themes/<Name>/theme.json (+ its wallpapers, icons,
 * fonts next to it), the same file a .ztheme pack carries:
 *
 *   {"format": 2, "name": "...", "author": "...", "description": "...",
 *    "settings": {"tileSize": 143, "wallpaperOn": true, "wallpaper": "x.mp4"}}
 *
 * settings = values only: numbers, true/false, texts. Everything that reads
 * the theme works on THEME text ("var THEME = {\n    key: value,\n  };"),
 * as when the theme file was a whole theme.js: zt_theme_read() makes that
 * text from theme.json and zt_theme_write() takes the values of such a text
 * (the editor's theme.js, an older theme file) back into theme.json. Only
 * values that pass safe_value (homeui_js_inject.cpp) are kept, so a shared
 * theme can never carry code.
 */

#include "zt_storage.hpp"
#include "zt_log.hpp"

#include <ctype.h>
#include <errno.h>
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <unistd.h>

#include <mutex>
#include <string>
#include <utility>
#include <vector>

/* homeui_js_inject.cpp */
std::vector<std::pair<std::string, std::string>> zt_theme_values_of(const std::string &text);
bool zt_theme_value_ok(const std::string &value);

namespace {

typedef std::vector<std::pair<std::string, std::string>> Values;

std::mutex g_write_lock;

const size_t kMaxFile = 8u << 20;

std::string read_all(const std::string &path) {
  std::string out;
  const int fd = open(path.c_str(), O_RDONLY);
  if (fd < 0)
    return out;
  char buf[16384];
  ssize_t n;
  while (out.size() < kMaxFile && (n = read(fd, buf, sizeof(buf))) > 0)
    out.append(buf, (size_t)n);
  close(fd);
  return out;
}

/* written to <file>.tmp, synced, then renamed: a cut never leaves half a theme */
bool write_atomic(const std::string &file, const std::string &data) {
  const size_t slash = file.rfind('/');
  const std::string dir = slash == std::string::npos ? std::string(".") : file.substr(0, slash);
  zt_mkdirs(dir);
  const std::string temp = file + ".tmp";
  const int fd = open(temp.c_str(), O_WRONLY | O_CREAT | O_TRUNC, 0666);
  if (fd < 0)
    return false;
  bool ok = true;
  for (size_t off = 0; ok && off < data.size();) {
    const ssize_t n = write(fd, data.data() + off, data.size() - off);
    ok = n > 0;
    off += ok ? (size_t)n : 0;
  }
  ok = fsync(fd) == 0 && ok;
  close(fd);
  if (!ok || rename(temp.c_str(), file.c_str()) != 0) {
    unlink(temp.c_str());
    return false;
  }
  const int d = open(dir.c_str(), O_RDONLY);
  if (d >= 0) {
    fsync(d);
    close(d);
  }
  return true;
}

/* the theme folder's name of Themes/<Name>/theme.json */
std::string folder_of(const std::string &file) {
  const size_t s2 = file.rfind('/');
  if (s2 == std::string::npos || s2 == 0)
    return std::string();
  const size_t s1 = file.rfind('/', s2 - 1);
  return file.substr(s1 == std::string::npos ? 0 : s1 + 1, s2 - (s1 == std::string::npos ? 0 : s1 + 1));
}

void put_utf8(std::string &out, unsigned cp) {
  if (cp < 0x80)
    out += (char)cp;
  else if (cp < 0x800) {
    out += (char)(0xC0 | (cp >> 6));
    out += (char)(0x80 | (cp & 0x3F));
  } else if (cp < 0x10000) {
    out += (char)(0xE0 | (cp >> 12));
    out += (char)(0x80 | ((cp >> 6) & 0x3F));
    out += (char)(0x80 | (cp & 0x3F));
  } else {
    out += (char)(0xF0 | (cp >> 18));
    out += (char)(0x80 | ((cp >> 12) & 0x3F));
    out += (char)(0x80 | ((cp >> 6) & 0x3F));
    out += (char)(0x80 | (cp & 0x3F));
  }
}

/* ---- a small JSON reader: enough for theme.json ---- */
struct Reader {
  const std::string &s;
  size_t i = 0;
  explicit Reader(const std::string &text) : s(text) {
    if (s.compare(0, 3, "\xEF\xBB\xBF") == 0)
      i = 3; /* a BOM from a Windows editor */
  }
  void ws() {
    while (i < s.size() && (s[i] == ' ' || s[i] == '\t' || s[i] == '\n' || s[i] == '\r'))
      ++i;
  }
  bool eat(char c) {
    ws();
    if (i < s.size() && s[i] == c) {
      ++i;
      return true;
    }
    return false;
  }
  int hex4() {
    if (i + 4 > s.size())
      return -1;
    int v = 0;
    for (int k = 0; k < 4; ++k) {
      const char c = s[i++];
      v = v * 16 + (isdigit((unsigned char)c) ? c - '0' : (c >= 'a' && c <= 'f') ? c - 'a' + 10
                                                         : (c >= 'A' && c <= 'F') ? c - 'A' + 10 : -1000);
    }
    return v < 0 ? -1 : v;
  }
  bool str(std::string &out) {
    out.clear();
    ws();
    if (i >= s.size() || s[i] != '"')
      return false;
    ++i;
    while (i < s.size() && s[i] != '"') {
      const unsigned char c = (unsigned char)s[i++];
      if (c < 0x20)
        return false;
      if (c != '\\') {
        out += (char)c;
        continue;
      }
      if (i >= s.size())
        return false;
      const char e = s[i++];
      switch (e) {
      case '"': out += '"'; break;
      case '\\': out += '\\'; break;
      case '/': out += '/'; break;
      case 'b': out += '\b'; break;
      case 'f': out += '\f'; break;
      case 'n': out += '\n'; break;
      case 'r': out += '\r'; break;
      case 't': out += '\t'; break;
      case 'u': {
        int cp = hex4();
        if (cp < 0)
          return false;
        if (cp >= 0xD800 && cp < 0xDC00 && i + 1 < s.size() && s[i] == '\\' && s[i + 1] == 'u') {
          i += 2;
          const int lo = hex4();
          if (lo < 0xDC00 || lo > 0xDFFF)
            return false;
          cp = 0x10000 + ((cp - 0xD800) << 10) + (lo - 0xDC00);
        }
        put_utf8(out, (unsigned)cp);
        break;
      }
      default:
        return false;
      }
    }
    if (i >= s.size())
      return false;
    ++i;
    return true;
  }
  /* a number token as it is written */
  bool num(std::string &out) {
    ws();
    const size_t from = i;
    if (i < s.size() && s[i] == '-')
      ++i;
    size_t digits = 0;
    while (i < s.size() && (isdigit((unsigned char)s[i]) || s[i] == '.' || s[i] == 'e' || s[i] == 'E' ||
                            ((s[i] == '+' || s[i] == '-') && i > from && (s[i - 1] == 'e' || s[i - 1] == 'E')))) {
      digits += isdigit((unsigned char)s[i]) ? 1 : 0;
      ++i;
    }
    out = s.substr(from, i - from);
    return digits > 0;
  }
  bool word(const char *w) {
    ws();
    const size_t n = strlen(w);
    if (s.compare(i, n, w) != 0)
      return false;
    i += n;
    return true;
  }
  /* any value, thrown away */
  bool skip(int depth = 0) {
    if (depth > 32)
      return false;
    ws();
    if (i >= s.size())
      return false;
    std::string t;
    if (s[i] == '"')
      return str(t);
    if (s[i] == '{' || s[i] == '[') {
      const char close = s[i] == '{' ? '}' : ']';
      const bool obj = s[i] == '{';
      ++i;
      if (eat(close))
        return true;
      do {
        if (obj && (!str(t) || !eat(':')))
          return false;
        if (!skip(depth + 1))
          return false;
      } while (eat(','));
      return eat(close);
    }
    if (word("true") || word("false") || word("null"))
      return true;
    return num(t);
  }
};

/* ---- values: the JavaScript form of the THEME text ('text', 12, true) ---- */

std::string json_quote(const std::string &s) {
  std::string out = "\"";
  for (unsigned char c : s) {
    if (c == '"' || c == '\\') {
      out += '\\';
      out += (char)c;
    } else if (c < 0x20) {
      char b[8];
      snprintf(b, sizeof(b), "\\u%04x", c);
      out += b;
    } else
      out += (char)c;
  }
  return out + "\"";
}

/* a JavaScript number of the THEME text as JSON (".5" -> "0.5", "3." -> "3") */
std::string json_number(std::string v) {
  const bool neg = !v.empty() && v[0] == '-';
  std::string d = neg ? v.substr(1) : v;
  if (!d.empty() && d[0] == '.')
    d = "0" + d;
  if (!d.empty() && d.back() == '.')
    d.pop_back();
  /* no leading zeros ("007" is not JSON) */
  while (d.size() > 1 && d[0] == '0' && d[1] != '.')
    d.erase(0, 1);
  return (neg ? "-" : "") + d;
}

std::string json_of(const std::string &v) {
  if (v.size() >= 2 && v.front() == '\'' && v.back() == '\'')
    return json_quote(v.substr(1, v.size() - 2));
  if (v == "true" || v == "false")
    return v;
  return json_number(v);
}

/* the safe values of a THEME text, each key once (the last one wins, at the
   place of the first); old field names under their new name */
Values values_of_text(const std::string &text, int *dropped) {
  Values out;
  int bad = 0;
  for (auto kv : zt_theme_values_of(text)) {
    if (kv.first.compare(0, 12, "homeTrophies") == 0)
      kv.first = "fakeTrophies" + kv.first.substr(12);
    /* XMB5 still uses themeName in its original renderer; retain it as a setting. */
    if (!zt_theme_value_ok(kv.second)) {
      ++bad;
      continue;
    }
    bool seen = false;
    for (auto &o : out)
      if (o.first == kv.first) {
        o.second = kv.second;
        seen = true;
        break;
      }
    if (!seen)
      out.push_back(kv);
  }
  if (dropped)
    *dropped = bad;
  return out;
}

std::string text_of(const Values &values) {
  std::string out = "var THEME = {\n";
  for (const auto &kv : values)
    out += "    " + kv.first + ": " + kv.second + ",\n";
  return out + "  };\n";
}

std::string json_text(const ZtThemeInfo &info, const Values &values) {
  std::string out = "{\n  \"format\": 2,\n";
  out += "  \"name\": " + json_quote(info.name) + ",\n";
  out += "  \"author\": " + json_quote(info.author) + ",\n";
  out += "  \"description\": " + json_quote(info.description) + ",\n";
  out += "  \"settings\": {";
  for (size_t k = 0; k < values.size(); ++k)
    out += (k ? ",\n    " : "\n    ") + json_quote(values[k].first) + ": " + json_of(values[k].second);
  out += values.empty() ? "}\n}\n" : "\n  }\n}\n";
  return out;
}

bool key_ok(const std::string &k) {
  if (k.empty() || k.size() > 64 || isdigit((unsigned char)k[0]))
    return false;
  for (char c : k)
    if (!isalnum((unsigned char)c) && c != '_')
      return false;
  return true;
}

/* theme.json -> info + values; false when it is not a theme.json */
bool parse(const std::string &json, ZtThemeInfo *info, Values *values, int *dropped, int *format) {
  Reader r(json);
  int bad = 0, fmt = 0;
  bool settings = false;
  if (!r.eat('{'))
    return false;
  if (!r.eat('}')) {
    do {
      std::string key, t;
      if (!r.str(key) || !r.eat(':'))
        return false;
      if (key == "format") {
        if (!r.num(t))
          return false;
        fmt = atoi(t.c_str());
      } else if (key == "name" || key == "author" || key == "description") {
        if (!r.str(t)) {
          if (!r.skip())
            return false;
          continue;
        }
        if (t.size() > 2000)
          t.resize(2000);
        (key == "name" ? info->name : key == "author" ? info->author : info->description) = t;
      } else if (key == "settings") {
        settings = true;
        if (!r.eat('{'))
          return false;
        if (r.eat('}'))
          continue;
        do {
          std::string k, v;
          if (!r.str(k) || !r.eat(':'))
            return false;
          r.ws();
          const char c = r.i < r.s.size() ? r.s[r.i] : 0;
          std::string js;
          if (c == '"') {
            if (!r.str(v))
              return false;
            /* a JavaScript 'text' without a quote or backslash inside */
            if (v.find_first_of("'\\") == std::string::npos)
              js = "'" + v + "'";
          } else if (r.word("true"))
            js = "true";
          else if (r.word("false"))
            js = "false";
          else if (c == '-' || isdigit((unsigned char)c)) {
            if (!r.num(v))
              return false;
            js = v;
          } else if (!r.skip())
            return false;
          if (js.empty() || !key_ok(k) || !zt_theme_value_ok(js)) {
            ++bad;
            continue;
          }
          if (k.compare(0, 12, "homeTrophies") == 0)
            k = "fakeTrophies" + k.substr(12);
          bool seen = false;
          for (auto &o : *values)
            if (o.first == k) {
              o.second = js;
              seen = true;
              break;
            }
          if (!seen)
            values->emplace_back(k, js);
        } while (r.eat(','));
        if (!r.eat('}'))
          return false;
      } else if (!r.skip())
        return false;
    } while (r.eat(','));
    if (!r.eat('}'))
      return false;
  }
  if (!settings || fmt < 2)
    return false;
  if (dropped)
    *dropped = bad;
  if (format)
    *format = fmt;
  return true;
}

} // namespace

/* ---------------- the theme file ---------------- */

std::string zt_theme_read_path(const std::string &file) {
  const std::string json = read_all(file);
  if (json.empty())
    return std::string();
  ZtThemeInfo info;
  Values values;
  int dropped = 0;
  if (!parse(json, &info, &values, &dropped, nullptr)) {
    static int told = 0;
    if (told++ < 3)
      zt_logl('W', "theme: %s is not a theme.json (broken JSON?)", file.c_str());
    return std::string();
  }
  if (dropped) {
    static int told = 0;
    if (told++ < 3)
      zt_logl('W', "theme: %s: %d values not plain values, left at stock", file.c_str(), dropped);
  }
  return text_of(values);
}

std::string zt_theme_read(const std::string &name) { return zt_theme_read_path(zt_theme_file(name)); }

ZtThemeInfo zt_theme_info(const std::string &name) {
  ZtThemeInfo info;
  Values values;
  if (!parse(read_all(zt_theme_file(name)), &info, &values, nullptr, nullptr) || info.name.empty())
    info.name = name.empty() ? zt_theme_name() : name;
  return info;
}

static bool zt_theme_save_path(const std::string &file, const ZtThemeInfo &info, const std::string &text) {
  Values values = values_of_text(text, nullptr);
  ZtThemeInfo i = info;
  if (i.name.empty())
    i.name = folder_of(file);
  std::lock_guard<std::mutex> lock(g_write_lock);
  return write_atomic(file, json_text(i, values));
}

bool zt_theme_write_path(const std::string &file, const std::string &text) {
  ZtThemeInfo info;
  Values old;
  if (!parse(read_all(file), &info, &old, nullptr, nullptr) || info.name.empty())
    info.name = folder_of(file);
  return zt_theme_save_path(file, info, text);
}

bool zt_theme_write(const std::string &name, const std::string &text) {
  return zt_theme_write_path(zt_theme_file(name), text);
}

bool zt_theme_save(const std::string &name, const ZtThemeInfo &info, const std::string &text) {
  return zt_theme_save_path(zt_theme_file(name), info, text);
}

bool zt_theme_info_set(const std::string &name, const ZtThemeInfo &info) {
  const std::string text = zt_theme_read(name);
  if (text.empty())
    return false;
  return zt_theme_save(name, info, text);
}

std::string zt_theme_json_make(const std::string &text, const ZtThemeInfo &info, int *values, int *dropped) {
  const Values v = values_of_text(text, dropped);
  if (values)
    *values = (int)v.size();
  return json_text(info, v);
}

bool zt_theme_json_parse(const std::string &json, ZtThemeInfo *info, std::string *text, int *dropped) {
  Values values;
  ZtThemeInfo i;
  if (!parse(json, &i, &values, dropped, nullptr))
    return false;
  if (info)
    *info = i;
  if (text)
    *text = text_of(values);
  return true;
}

std::string zt_json_quote(const std::string &s) { return json_quote(s); }
