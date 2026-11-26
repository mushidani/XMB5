/* V43: the Users category shows the console's real users (name + picture), as the PS3 did.
 *
 * Users: the 16 account slots of the system registry (user id per slot, the same entity numbers the OnionHEN account activator reads),
 * names from libSceUserService. Pictures: the system's profile cache (/system_data/priv/cache/profile/0x<user id>/avatar*.png); the
 * first one found is turned into a 180 px PNG in Assets/cache/xmbusers (HomeUI can always read that folder). A user without a local
 * picture gets none (the XMB shows its generic user icon).
 */
#include "zt_xmb_users.hpp"
#include "zt_xmb_glow.hpp"
#include "zt_storage.hpp"
#include "zt_paths.hpp"
#include "zt_log.hpp"
#include "zt_xmb_music.hpp"
#include <onion/reg_entity.h>

#include <ctype.h>
#include <dirent.h>
#include <errno.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>
#include <strings.h>
#include <sys/stat.h>
#include <unistd.h>
#include <pthread.h>

#include <algorithm>
#include <string>
#include <vector>

int sceRegMgrGetInt_hook(long regid, int *out_val);
extern "C" int sceUserServiceGetUserName(int, char *, size_t);
extern "C" int sceUserServiceGetForegroundUser(int *);

namespace {
constexpr int kUserIdEntity = 0x7800100, kUserIdEntity2 = 0x7940100;   /* account_activator.h USER_ID_ENTITY_NUMBER(_2) */
bool g_listed = false;

std::string json_str(const char *s) {
  std::string o = "\"";
  for (const unsigned char *c = (const unsigned char *)s; *c; ++c) {
    if (*c == '"' || *c == '\\') { o += '\\'; o += (char)*c; }
    else if (*c < 0x20) o += ' ';
    else o += (char)*c;
  }
  return o + "\"";
}

bool copy_file(const std::string &src, const std::string &dst) {
  FILE *in = fopen(src.c_str(), "rb");
  if (!in) return false;
  const std::string tmp = dst + ".tmp";
  FILE *out = fopen(tmp.c_str(), "wb");
  if (!out) { fclose(in); return false; }
  char buf[16384];
  size_t n, total = 0;
  bool ok = true;
  while ((n = fread(buf, 1, sizeof(buf), in)) > 0) { if (fwrite(buf, 1, n, out) != n) { ok = false; break; } total += n; }
  fclose(in);
  fclose(out);
  if (!ok || total < 64 || rename(tmp.c_str(), dst.c_str()) != 0) { unlink(tmp.c_str()); return false; }
  return true;
}

/* the user's picture from the profile cache (/system_data/priv/cache/profile/0x<user id>/avatar.png), as a PNG HomeUI can load
 * ("" when there is none). V48: every step that fails is written to the status file; a picture the decoder cannot read is copied as it is. */
std::string user_picture(int uid) {
  char dir0[160], dir1[96], dir2[96];
  /* V77: first the copy the ZhiThemes payload makes (ShellUI's sandbox cannot open /system_data/priv: the picture was never found) */
  snprintf(dir0, sizeof(dir0), "%s/profile/0x%08x", ZT_CACHE, (unsigned)uid);
  snprintf(dir1, sizeof(dir1), "/system_data/priv/cache/profile/0x%08x", (unsigned)uid);
  snprintf(dir2, sizeof(dir2), "/system_data/priv/cache/profile/0x%08X", (unsigned)uid);
  static const char *const names[] = {"avatar.png", "avatar440.png", "avatar260.png", "avatar128.png", "avatar64.png", "avatar.jpg", "online_avatar.png"};
  const std::string out_dir = std::string(ZT_CACHE) + "/xmbusers";
  std::string why;
  for (const char *d : {(const char *)dir0, (const char *)dir1, (const char *)dir2}) {
    if (!g_listed) {   /* once: what is really there (the file names differ between firmwares) */
      DIR *dd = opendir(d);
      if (dd) {
        std::string files;
        while (dirent *e = readdir(dd)) if (e->d_name[0] != '.') { files += e->d_name; files += ' '; if (files.size() > 300) break; }
        closedir(dd);
        zt_log("PS5XMB: USER_PROFILE %s: %s", d, files.c_str());
        zt_xmb_note(std::string("users: ") + d + ": " + files);
      } else {
        zt_xmb_note(std::string("users: ") + d + " cannot be listed (errno " + std::to_string(errno) + ")");
      }
    }
    for (const char *n : names) {
      const std::string src = std::string(d) + "/" + n;
      struct stat st;
      if (stat(src.c_str(), &st) != 0) { if (n == names[0]) why += src + ": errno " + std::to_string(errno) + "; "; continue; }
      if (st.st_size < 64) { why += src + ": too small; "; continue; }
      char out[192], raw[192];
      snprintf(out, sizeof(out), "%s/c_%08x_%lld.png", out_dir.c_str(), (unsigned)uid, (long long)st.st_size);   /* V78: c_ = the round copy */
      snprintf(raw, sizeof(raw), "%s/r_%08x_%lld%s", out_dir.c_str(), (unsigned)uid, (long long)st.st_size, strstr(n, ".jpg") ? ".jpg" : ".png");
      struct stat os;
      if (stat(out, &os) == 0 && os.st_size > 100) return out;
      if (stat(raw, &os) == 0 && os.st_size > 100) return raw;
      zt_mkdirs(out_dir);
      if (zt_xmb_square_png(src, out, 180, true)) { if (!g_listed) zt_xmb_note(std::string("users: picture ") + src + " -> " + out); return out; }
      if (copy_file(src, raw)) { zt_xmb_note(std::string("users: picture ") + src + " copied as it is (not decodable here) -> " + raw); return raw; }
      why += src + ": readable " + std::to_string(access(src.c_str(), R_OK) == 0) + " but not copied (errno " + std::to_string(errno) + "); ";
    }
  }
  if (!g_listed) { char h[16]; snprintf(h, sizeof(h), "%08x", (unsigned)uid); zt_xmb_note(std::string("users: no picture for 0x") + h + ": " + why); }
  return "";
}

/* V48: the PS5's captures (Create button screenshots): /user/av_contents/photo/NPXS40087/NPXS40087/<nnn>/<date>_<time>_<n>.png, newest first */
struct Photo { std::string path; long long mtime; };
} // namespace

std::string zt_xmb_users_json() {
  int fg = -1;
  sceUserServiceGetForegroundUser(&fg);
  std::string out = "[";
  int count = 0;
  for (int slot = 1; slot <= 16; ++slot) {
    int uid = -1;
    if (sceRegMgrGetInt_hook(onion_reg_entity_number(slot, kUserIdEntity, kUserIdEntity2), &uid) != 0 || uid == 0 || uid == -1) continue;
    char name[64] = {};
    if (sceUserServiceGetUserName(uid, name, sizeof(name) - 1) != 0 || !name[0]) continue;   /* an empty slot */
    const std::string pic = user_picture(uid);
    char head[64];
    snprintf(head, sizeof(head), "%s{\"id\":%d,\"slot\":%d,\"fg\":%s,", count ? "," : "", uid, slot, uid == fg ? "true" : "false");
    out += head;
    out += "\"name\":" + json_str(name) + ",\"pic\":" + json_str(pic.c_str()) + "}";
    ++count;
  }
  out += "]";
  if (!g_listed) {
    g_listed = true;
    zt_log("PS5XMB: USERS %d %s", count, out.c_str());
    zt_xmb_note("users: " + out);
    /* where else the system keeps profile pictures on this firmware */
    for (const char *base : {"/system_data/priv/cache/profile", "/user/home", "/system_data/priv/home", "/system_data/priv/cache"}) {
      DIR *dd = opendir(base);
      std::string names;
      if (dd) { while (dirent *e = readdir(dd)) if (e->d_name[0] != '.') { names += e->d_name; names += ' '; if (names.size() > 600) break; } closedir(dd); }
      zt_xmb_note(std::string("users: dir ") + base + (dd ? ": " + names : std::string(" (not readable)")));
    }
  }
  return out;
}

std::string zt_xmb_photos_json() {
  static const char *const root = "/user/av_contents/photo/NPXS40087/NPXS40087";
  std::vector<Photo> list;
  DIR *top = opendir(root);
  if (!top) {
    static bool told = false;
    if (!told) { told = true; zt_xmb_note(std::string("photos: ") + root + " cannot be listed (errno " + std::to_string(errno) + ")"); }
    return "[]";
  }
  while (dirent *e = readdir(top)) {
    if (e->d_name[0] == '.') continue;
    const std::string sub = std::string(root) + "/" + e->d_name;
    DIR *dd = opendir(sub.c_str());
    if (!dd) continue;
    while (dirent *f = readdir(dd)) {
      const size_t len = strlen(f->d_name);
      if (len < 5 || f->d_name[0] == '.') continue;
      const char *ext = f->d_name + len - 4;
      if (strcasecmp(ext, ".png") != 0 && strcasecmp(ext, ".jpg") != 0) continue;
      const std::string p = sub + "/" + f->d_name;
      struct stat st;
      if (stat(p.c_str(), &st) != 0 || !S_ISREG(st.st_mode) || st.st_size < 64) continue;
      list.push_back(Photo{p, (long long)st.st_mtime});
      if (list.size() >= 2000) break;
    }
    closedir(dd);
    if (list.size() >= 2000) break;
  }
  closedir(top);
  /* newest first: the file names start with the date and time (20261119_133727_...) */
  std::sort(list.begin(), list.end(), [](const Photo &a, const Photo &b) {
    const std::string na = a.path.substr(a.path.rfind('/') + 1), nb = b.path.substr(b.path.rfind('/') + 1);
    return na != nb ? na > nb : a.mtime > b.mtime;
  });
  if (list.size() > 500) list.resize(500);
  std::string out = "[";
  for (size_t i = 0; i < list.size(); ++i) {
    char t[32];
    snprintf(t, sizeof(t), ",\"t\":%lld}", list[i].mtime);
    out += (i ? ",{\"p\":" : "{\"p\":") + json_str(list[i].path.c_str()) + t;
  }
  out += "]";
  static size_t told_n = (size_t)-1;
  if (told_n != list.size()) { told_n = list.size(); zt_xmb_note("photos: " + std::to_string(list.size()) + " in " + root); }
  return out;
}

/* V78: the Gallery's Video list: the PS5's captured videos (Create button). They are below /user/av_contents/video (the same
   NPXS40087/NPXS40087/<nnn>/ layout as the screenshots); every .mp4 / .webm up to 4 folders deep, newest first. The player gets them
   from the video server as http://127.0.0.1:4445/c/<index>.mp4 (an index of this list, never a path). */
namespace {
pthread_mutex_t g_vid_lock = PTHREAD_MUTEX_INITIALIZER;
std::vector<std::string> g_vid_paths;
void scan_videos(const std::string &dir, int depth, std::vector<Photo> &list) {
  if (depth > 4 || list.size() >= 1000) return;
  DIR *d = opendir(dir.c_str());
  if (!d) return;
  while (dirent *e = readdir(d)) {
    if (e->d_name[0] == '.') continue;
    const std::string p = dir + "/" + e->d_name;
    struct stat st;
    if (stat(p.c_str(), &st) != 0) continue;
    if (S_ISDIR(st.st_mode)) { scan_videos(p, depth + 1, list); continue; }
    const size_t len = strlen(e->d_name);
    if (!S_ISREG(st.st_mode) || st.st_size < 1024 || len < 6) continue;
    const char *n = e->d_name;
    if (strcasecmp(n + len - 4, ".mp4") != 0 && strcasecmp(n + len - 5, ".webm") != 0) continue;
    list.push_back(Photo{p, (long long)st.st_mtime});
    if (list.size() >= 1000) break;
  }
  closedir(d);
}
} // namespace

std::string zt_xmb_videos_json() {
  static const char *const root = "/user/av_contents/video";
  std::vector<Photo> list;
  scan_videos(root, 0, list);
  std::sort(list.begin(), list.end(), [](const Photo &a, const Photo &b) {
    const std::string na = a.path.substr(a.path.rfind('/') + 1), nb = b.path.substr(b.path.rfind('/') + 1);
    return na != nb ? na > nb : a.mtime > b.mtime;
  });
  if (list.size() > 300) list.resize(300);
  std::string out = "[";
  std::vector<std::string> paths;
  for (size_t i = 0; i < list.size(); ++i) {
    struct stat st;
    const long long bytes = stat(list[i].path.c_str(), &st) == 0 ? (long long)st.st_size : 0;
    const std::string file = list[i].path.substr(list[i].path.rfind('/') + 1);
    char t[96];
    snprintf(t, sizeof(t), ",\"i\":%zu,\"t\":%lld,\"s\":%lld}", i, list[i].mtime, bytes);
    out += (i ? ",{\"n\":" : "{\"n\":") + json_str(file.c_str()) + t;
    paths.push_back(list[i].path);
  }
  out += "]";
  pthread_mutex_lock(&g_vid_lock);
  g_vid_paths.swap(paths);
  pthread_mutex_unlock(&g_vid_lock);
  static size_t told_n = (size_t)-1;
  if (told_n != list.size()) { told_n = list.size(); zt_log("PS5XMB: VIDEOS %zu in %s", list.size(), root); zt_xmb_note("videos: " + std::to_string(list.size()) + " in " + root); }
  return out;
}

std::string zt_xmb_video_path(int index) {
  pthread_mutex_lock(&g_vid_lock);
  const std::string p = index >= 0 && (size_t)index < g_vid_paths.size() ? g_vid_paths[index] : "";
  pthread_mutex_unlock(&g_vid_lock);
  return p;
}

/* V51: the XMB's own settings (wave colour, day/night, speeds, volumes...), one "key=value" per line in ZT_DIR/PS5XMB_settings.txt,
 * so they survive a restart of the console. Keys: letters / digits; values: letters, digits, . - _ (max 32). */
#ifndef ZT_XMB_PREFS_FILE
#define ZT_XMB_PREFS_FILE ZT_DIR "/PS5XMB_settings.txt"
#endif
std::string zt_xmb_prefs_get() {
  FILE *f = fopen(ZT_XMB_PREFS_FILE, "rb");
  if (!f) return "";
  char buf[4096];
  const size_t n = fread(buf, 1, sizeof(buf), f);
  fclose(f);
  return std::string(buf, n);
}

bool zt_xmb_prefs_set(const std::string &key, const std::string &value) {
  if (key.empty() || key.size() > 32 || value.size() > 32) return false;
  for (char c : key) if (!isalnum((unsigned char)c)) return false;
  for (char c : value) if (!(isalnum((unsigned char)c) || c == '.' || c == '-' || c == '_')) return false;
  std::string out, cur = zt_xmb_prefs_get();
  size_t at = 0;
  while (at < cur.size()) {
    size_t nl = cur.find('\n', at);
    if (nl == std::string::npos) nl = cur.size();
    const std::string line = cur.substr(at, nl - at);
    at = nl + 1;
    if (line.empty() || line.compare(0, key.size() + 1, key + "=") == 0) continue;
    out += line + "\n";
  }
  out += key + "=" + value + "\n";
  const std::string tmp = std::string(ZT_XMB_PREFS_FILE) + ".tmp";
  FILE *f = fopen(tmp.c_str(), "wb");
  if (!f) return false;
  const bool ok = fwrite(out.data(), 1, out.size(), f) == out.size();
  fclose(f);
  if (!ok || rename(tmp.c_str(), ZT_XMB_PREFS_FILE) != 0) { unlink(tmp.c_str()); return false; }
  return true;
}
