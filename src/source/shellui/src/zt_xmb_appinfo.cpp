/* V63: facts about installed titles for the XMB's Game category (PS3 Triangle panel):
 *   date - when the title was installed (its /user/app/<id> folder was created): the "Creation Date" sort, newest first
 *   size - the title's size on the console: its app folder + its update (patch) + its add-ons, every storage (Information)
 * Only folders are read (lstat, symlinks never followed); nothing is written. The size of a title is kept for 10 minutes. */
#include "zt_xmb_users.hpp"
#include "zt_paths.hpp"
#include "zt_log.hpp"

#include <dirent.h>
#include <pthread.h>
#include <stdio.h>
#include <string.h>
#include <sys/stat.h>
#include <time.h>
#include <ctype.h>
#include <unistd.h>

#include <map>
#include <set>
#include <utility>
#include <string>

namespace {
const char *const kApp[] = {"/user/app/", "/mnt/ext0/user/app/", "/mnt/ext1/user/app/"};
/* V71: where else a title's data can be. GTA V showed 62 MB: only its /user/app folder was found (icons, param files) - the game itself
   was elsewhere. ShellUI has its own view of the file system (extended storage / USB as /extN, /usbN); a game dump run by a dump
   runner / ShadowMount is mounted at /system_ex/app/<id>. Every folder that exists is added once (same folder = same device + inode). */
const char *const kMore[] = {"/user/patch/", "/mnt/ext0/user/patch/", "/mnt/ext1/user/patch/",
                             "/user/addcont/", "/mnt/ext0/user/addcont/", "/mnt/ext1/user/addcont/",
                             "/ext0/user/app/", "/ext1/user/app/", "/ext0/user/patch/", "/ext1/user/patch/",
                             "/ext0/user/addcont/", "/ext1/user/addcont/", "/system_ex/app/"};
pthread_mutex_t g_lock = PTHREAD_MUTEX_INITIALIZER;
struct Cached { long long bytes; time_t at; };
std::map<std::string, Cached> g_size;

bool valid_id(const std::string &id) {
  if (id.size() != 9) return false;
  for (int k = 0; k < 4; ++k) if (id[k] < 'A' || id[k] > 'Z') return false;
  for (int k = 4; k < 9; ++k) if (id[k] < '0' || id[k] > '9') return false;
  return true;
}

long long born(const struct stat &st) {
#ifdef st_birthtime /* FreeBSD (the PS5): the folder's creation time */
  if (st.st_birthtime > 0) return (long long)st.st_birthtime;
#endif
  return (long long)st.st_mtime;
}

/* V71: big files already counted (a linked app.pkg and the folder it lives in are both walked): device + inode */
using Counted = std::set<std::pair<long long, long long>>;
long long count_file(const struct stat &st, Counted &counted) {
  if (st.st_size >= (1 << 20) && !counted.insert({(long long)st.st_dev, (long long)st.st_ino}).second) return 0;
  return (long long)st.st_size;
}

/* regular files below `dir`, depth-limited, at most `left` entries in all */
long long tree_bytes(const std::string &dir, int depth, long &left, Counted &counted) {
  if (depth > 24 || left <= 0) return 0;
  DIR *d = opendir(dir.c_str());
  if (!d) return 0;
  long long sum = 0;
  while (struct dirent *e = readdir(d)) {
    if (--left <= 0) break;
    if (!strcmp(e->d_name, ".") || !strcmp(e->d_name, "..")) continue;
    const std::string p = dir + "/" + e->d_name;
    struct stat st;
    if (lstat(p.c_str(), &st) != 0) continue;
    if (S_ISLNK(st.st_mode)) {   /* V71: a linked file (app.pkg on other storage) counts; a linked folder is never followed (no loops) */
      struct stat t;
      if (stat(p.c_str(), &t) == 0 && S_ISREG(t.st_mode)) sum += count_file(t, counted);
      continue;
    }
    if (S_ISREG(st.st_mode)) sum += count_file(st, counted);
    else if (S_ISDIR(st.st_mode)) sum += tree_bytes(p, depth + 1, left, counted);
  }
  closedir(d);
  return sum;
}

long long title_bytes(const std::string &id) {
  const time_t now = time(nullptr);
  pthread_mutex_lock(&g_lock);
  auto it = g_size.find(id);
  if (it != g_size.end() && now - it->second.at < 600) { const long long b = it->second.bytes; pthread_mutex_unlock(&g_lock); return b; }
  pthread_mutex_unlock(&g_lock);
  long left = 400000;
  long long sum = 0;
  bool any = false;
  std::string seen, parts;
  Counted counted;
  auto add = [&](const char *root, bool app) {
    struct stat st;
    const std::string p = root + id;
    if (stat(p.c_str(), &st) != 0 || !S_ISDIR(st.st_mode)) return;
    const std::string key = std::to_string((long long)st.st_dev) + ":" + std::to_string((long long)st.st_ino) + ";";
    if (seen.find(key) != std::string::npos) return;
    seen += key;
    const long long b = tree_bytes(p, 0, left, counted);
    sum += b;
    any = any || app || b > 0;
    char line[160];
    snprintf(line, sizeof(line), " %s=%lld", p.c_str(), b);
    parts += line;
  };
  for (const char *root : kApp) add(root, true);
  for (const char *root : kMore) add(root, false);
  zt_log("PS5XMB: SIZE %s %lld bytes:%s", id.c_str(), sum, parts.c_str());
  if (!any) return -1;
  pthread_mutex_lock(&g_lock);
  g_size[id] = Cached{sum, now};
  pthread_mutex_unlock(&g_lock);
  return sum;
}
} // namespace

std::string zt_xmb_appinfo_json(const std::string &ids, bool size) {
  std::string o = "{";
  size_t a = 0;
  int n = 0;
  while (a <= ids.size() && n < 600) {
    size_t b = ids.find(',', a);
    if (b == std::string::npos) b = ids.size();
    const std::string id = ids.substr(a, b - a);
    a = b + 1;
    if (!valid_id(id)) continue;
    ++n;
    long long date = 0;
    for (const char *root : kApp) { struct stat st;
      if (lstat((root + id).c_str(), &st) == 0 && S_ISDIR(st.st_mode)) { date = born(st); break; } }
    std::string one = "\"" + id + "\":{\"d\":" + std::to_string(date);
    /* V78: the format (the PS3's badge): a PS5 title has sce_sys/param.json, a PS4 one sce_sys/param.sfo */
    int plat = 0;
    for (const char *root : {"/system_ex/app/", "/user/app/", "/mnt/ext0/user/app/", "/mnt/ext1/user/app/"}) {
      struct stat st;
      const std::string sys = std::string(root) + id + "/sce_sys/";
      if (stat((sys + "param.json").c_str(), &st) == 0) { plat = 5; break; }
      if (stat((sys + "param.sfo").c_str(), &st) == 0) { plat = 4; break; }
    }
    if (plat) one += ",\"p\":" + std::to_string(plat);
    if (size) { const long long s = title_bytes(id); if (s >= 0) one += ",\"s\":" + std::to_string(s); }
    o += (o.size() > 1 ? "," : "") + one + "}";
    if (size) break; /* a size is asked for one title at a time */
  }
  return o + "}";
}

/* V68: the XMB's game folders (Game category), as the Home's script keeps them: a JSON list in ZT_DIR/PS5XMB_folders.json
   [{"id":"f..","name":"..","ids":["PPSA01234",..],"t":<created ms>}]. Written whole (temp file + rename), at most 64 KB. */
#ifndef ZT_XMB_FOLDERS_FILE
#define ZT_XMB_FOLDERS_FILE ZT_DIR "/PS5XMB_folders.json"
#endif
/* V73: the same for the XMB's custom columns (PS5XMB_columns.json: [{"id","name","icon","ids":[..],"t"}]) */
namespace {
std::string list_file(const char *which) {
  return std::string(ZT_DIR "/PS5XMB_") + (strcmp(which, "columns") == 0 ? "columns" : strcmp(which, "order") == 0 ? "order" : strcmp(which, "cats") == 0 ? "cats" : "folders") + ".json";
}
}
std::string zt_xmb_list_get(const char *which) {
  FILE *f = fopen(list_file(which).c_str(), "rb");
  if (!f) return "[]";
  std::string out;
  char buf[8192];
  size_t n;
  while ((n = fread(buf, 1, sizeof(buf), f)) > 0 && out.size() < (64u << 10)) out.append(buf, n);
  fclose(f);
  return out.empty() || out[0] != '[' ? "[]" : out;
}

bool zt_xmb_list_set(const char *which, const std::string &json) {
  if (json.empty() || json.size() > (64u << 10) || json[0] != '[' || json[json.size() - 1] != ']') return false;
  for (unsigned char c : json) if (c < 0x20 && c != '\n' && c != '\r' && c != '\t') return false;
  const std::string file = list_file(which), tmp = file + ".tmp";
  FILE *f = fopen(tmp.c_str(), "wb");
  if (!f) return false;
  const bool ok = fwrite(json.data(), 1, json.size(), f) == json.size();
  fclose(f);
  if (!ok || rename(tmp.c_str(), file.c_str()) != 0) { unlink(tmp.c_str()); return false; }
  return true;
}

std::string zt_xmb_folders_get() { return zt_xmb_list_get("folders"); }
bool zt_xmb_folders_set(const std::string &json) { return zt_xmb_list_set("folders", json); }

/* V73: Close Application (Triangle on the running title). The title running now comes from the system service (the "big app"); it
   is closed through LncUtil (sceLncUtilKillApp from the loaded libSceLncUtil, else sceLncUtilKillAppWithReason). Only the title that
   the XMB asks for is ever closed. */
#ifndef ZT_SYS_HOST_TEST
#include "ps5/kernel.h"
extern "C" int sceLncUtilKillAppWithReason(int appId, int reason);
bool Get_Running_App_TID(std::string &title_id, int &BigAppid);
std::string zt_xmb_running_json() {
  std::string tid;
  int app = -1;
  if (!Get_Running_App_TID(tid, app) || tid.empty() || app < 0) return "{}";
  std::string clean;
  for (char c : tid) if (isalnum((unsigned char)c) || c == '_' || c == '-') clean += c;
  return "{\"id\":\"" + clean + "\",\"app\":" + std::to_string(app) + "}";
}
bool zt_xmb_close_app(const std::string &title_id) {
  std::string tid;
  int app = -1;
  if (title_id.empty() || !Get_Running_App_TID(tid, app) || app < 0 || tid.compare(0, title_id.size(), title_id) != 0) {
    zt_log("PS5XMB: CLOSE_APP %s refused (running: %s)", title_id.c_str(), tid.c_str());
    return false;
  }
  using KillFn = int (*)(uint32_t);
  static KillFn kill = nullptr;
  static bool tried = false;
  if (!tried) {
    tried = true;
    uint32_t h = 0;
    if (kernel_dynlib_handle(getpid(), "libSceLncUtil.sprx", &h) == 0)
      kill = reinterpret_cast<KillFn>(kernel_dynlib_dlsym(-1, (int)h, "sceLncUtilKillApp"));
  }
  const int r = kill ? kill((uint32_t)app) : sceLncUtilKillAppWithReason(app, 0);
  zt_log("PS5XMB: CLOSE_APP %s app 0x%x -> 0x%x (%s)", tid.c_str(), app, (unsigned)r, kill ? "KillApp" : "KillAppWithReason");
  return r == 0;
}
#else
std::string zt_xmb_running_json() { return "{}"; }
bool zt_xmb_close_app(const std::string &) { return false; }
#endif
