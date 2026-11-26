/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.  */

/* System icons for the editor's picker, from the console's RCO.
   RCOF layout (little endian), as read from FW 9.60's PUI_UI3.rco:
     0x08 tree offset, 0x10 id-string table offset, 0x20 string table
     offset, 0x24 its size, 0x48 file data offset.
   Tree element: name (string table), attribute count, parent, previous,
   next, first child, last child (offsets in the tree; -1/0 = none), then
   16-byte attributes: name (string table), type, value 1, value 2.
   A "texture" element has "id" (type 9: offset in the id-string table,
   where each name follows a 4-byte value), "type" (type 3: string
   "texture/svg" or "texture/png") and "src" (type 8: offset and size in
   the file data). Only the tree and the tables are kept in memory (about
   200 KB, read once); each picture is read from the file when asked. */

#include "zt_sysicons.hpp"
#include "zt_log.hpp"

#include <fcntl.h>
#include <map>
#include <pthread.h>
#include <stdint.h>
#include <string.h>
#include <sys/stat.h>
#include <unistd.h>

namespace {

const char *kRco = "/system_ex/vsh_asset/Sce.PlayStation.PUI_UI3.rco";

struct Icon {
  uint32_t off, size;
  bool svg;
};

pthread_mutex_t g_lock = PTHREAD_MUTEX_INITIALIZER;
bool g_loaded = false;
std::map<std::string, Icon> g_icons;
uint32_t g_file_off = 0;

bool read_at(int fd, uint32_t off, void *buf, size_t n) {
  if (lseek(fd, (off_t)off, SEEK_SET) != (off_t)off)
    return false;
  size_t got = 0;
  while (got < n) {
    const ssize_t r = read(fd, (char *)buf + got, n - got);
    if (r <= 0)
      return false;
    got += (size_t)r;
  }
  return true;
}

uint32_t u32(const std::string &b, size_t o) {
  if (o + 4 > b.size())
    return 0;
  uint32_t v;
  memcpy(&v, b.data() + o, 4);
  return v;
}

/* a 0-ended string at o in table t (empty when outside) */
std::string str_at(const std::string &t, size_t o) {
  if (o >= t.size())
    return std::string();
  const size_t e = t.find('\0', o);
  return t.substr(o, (e == std::string::npos ? t.size() : e) - o);
}

void load() {
  g_loaded = true;
  const int fd = open(kRco, O_RDONLY);
  if (fd < 0) {
    zt_log("sysicons: cannot open %s", kRco);
    return;
  }
  char head[0x50];
  if (!read_at(fd, 0, head, sizeof(head)) || memcmp(head, "RCOF", 4) != 0) {
    zt_log("sysicons: not an RCO file");
    close(fd);
    return;
  }
  std::string h(head, sizeof(head));
  const uint32_t tree_off = u32(h, 0x08), tree_sz = u32(h, 0x0c);
  const uint32_t ids_off = u32(h, 0x10), ids_sz = u32(h, 0x14);
  const uint32_t str_off = u32(h, 0x20), str_sz = u32(h, 0x24);
  g_file_off = u32(h, 0x48);
  /* the tables are small; a bigger one = some other layout */
  if (tree_sz > (4u << 20) || ids_sz > (1u << 20) || str_sz > (1u << 20)) {
    zt_log("sysicons: unexpected RCO table sizes");
    close(fd);
    return;
  }
  std::string tree(tree_sz, '\0'), ids(ids_sz, '\0'), strs(str_sz, '\0');
  const bool ok = read_at(fd, tree_off, &tree[0], tree_sz) && read_at(fd, ids_off, &ids[0], ids_sz) &&
                  read_at(fd, str_off, &strs[0], str_sz);
  close(fd);
  if (!ok) {
    zt_log("sysicons: RCO read failed");
    return;
  }
  /* every element in tree order (they are stored one after the other) */
  size_t o = 0;
  while (o + 28 <= tree.size()) {
    const uint32_t name = u32(tree, o), nattr = u32(tree, o + 4);
    if (nattr > 256)
      break;
    const size_t next = o + 28 + 16 * (size_t)nattr;
    if (next > tree.size())
      break;
    if (str_at(strs, name) == "texture") {
      std::string id;
      Icon ic = {0, 0, false};
      bool have_src = false;
      for (uint32_t i = 0; i < nattr; ++i) {
        const size_t a = o + 28 + 16 * (size_t)i;
        const std::string an = str_at(strs, u32(tree, a));
        const uint32_t at = u32(tree, a + 4), v1 = u32(tree, a + 8), v2 = u32(tree, a + 12);
        if (an == "id" && at == 9)
          id = str_at(ids, (size_t)v1 + 4);
        else if (an == "type" && at == 3)
          ic.svg = str_at(strs, v1) == "texture/svg";
        else if (an == "src" && at == 8) {
          ic.off = v1;
          ic.size = v2;
          have_src = true;
        }
      }
      if (have_src && id.rfind("iconid_", 0) == 0 && ic.size > 0 && ic.size < (4u << 20))
        g_icons[id.substr(7)] = ic;
    }
    o = next;
  }
  zt_log("sysicons: %d system icons", (int)g_icons.size());
}

}  // namespace

bool zt_sysicon(const std::string &name, std::string &data, std::string &type) {
  pthread_mutex_lock(&g_lock);
  if (!g_loaded)
    load();
  const auto it = g_icons.find(name);
  const bool found = it != g_icons.end();
  const Icon ic = found ? it->second : Icon{0, 0, false};
  const uint32_t base = g_file_off;
  pthread_mutex_unlock(&g_lock);
  if (!found)
    return false;
  const int fd = open(kRco, O_RDONLY);
  if (fd < 0)
    return false;
  data.assign(ic.size, '\0');
  const bool ok = read_at(fd, base + ic.off, &data[0], ic.size);
  close(fd);
  if (!ok)
    return false;
  type = ic.svg ? "image/svg+xml" : "image/png";
  return true;
}
