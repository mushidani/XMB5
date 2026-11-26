/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.  */

/* ZhiThemes — PS5 home screen theme, standalone payload.
 *
 * Based on OnionHEN (GPL-3.0). Only the theme is kept: this payload injects
 * zt_shellui.elf (the theme module) into SceShellUI and watches for ShellUI
 * restarts (rest mode) to inject it again.
 *
 * Replacing a running copy without rebooting: the module already in ShellUI
 * answers on 127.0.0.1:4444; POST /quit makes it take its hooks out (atomic
 * swap back to the original bytes) and close the port, then the new module is
 * injected. A previous watcher process is stopped through its pid file.
 *
 * Files: /data/ZhiThemes/Themes/<active>/theme.json; logs in /data/ZhiThemes/Logs/
 * (zhithemes.log: the module's lines and this payload's "[payload]" lines).
 */

#include <onion/conflict.h>
#include <onion/proc_query.h>
#include <ps5/kernel.h>

#include <arpa/inet.h>
#include <ifaddrs.h>
#include <net/if.h>
#include <ctype.h>
#include <stddef.h>
#include <sys/proc.h>
#include <dirent.h>
#include <errno.h>
#include <fcntl.h>
#include <netinet/in.h>
#include <signal.h>
#include <stdarg.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <sys/sysctl.h>
#include <sys/time.h>
#include <sys/user.h>
#include <time.h>
#include <unistd.h>

#include <initializer_list>
#include <string>
#include <utility>

#include "../../shellui/include/zt_brand.hpp"

extern "C" {
bool Inject_Toolbox(int pid, uint8_t *elf);
int elfldr_raise_privileges(pid_t pid);
extern uint8_t zt_shellui_elf_start[];
int sceKernelSendNotificationRequest(int, void *, size_t, int);
}

namespace {

constexpr const char *kDir = "/user/data/XMB5";
constexpr const char *kPidFile = "/user/data/XMB5/watcher.pid";
constexpr const char *kLog = "/user/data/XMB5/Logs/xmb5.log";
constexpr int kPort = 4444; /* XMB5 internal localhost-only API */

struct NotifyRequest {
  char useless1[45];
  char message[3075];
};

void notify(const char *fmt, ...) {
  NotifyRequest req = {};
  va_list ap;
  va_start(ap, fmt);
  vsnprintf(req.message, sizeof(req.message), fmt, ap);
  va_end(ap);
  sceKernelSendNotificationRequest(0, &req, sizeof(req), 0);
}

/* One "[payload]" line in the module's zhithemes.log (O_APPEND: lines of
   the two processes do not mix), with its UTC time and a level letter
   (W when it failed, else I). The module cuts the file at its start; this
   only stops a runaway file when no module ever starts. */
void logf(const char *fmt, ...) {
  struct stat st;
  if (stat(kLog, &st) == 0 && st.st_size > (64 << 20))
    unlink(kLog);
  mkdir(kDir, 0777);
  mkdir("/user/data/XMB5/Logs", 0777);
  const int fd = open(kLog, O_WRONLY | O_CREAT | O_APPEND, 0666);
  if (fd < 0)
    return;
  char text[900];
  va_list ap;
  va_start(ap, fmt);
  int n = vsnprintf(text, sizeof(text), fmt, ap);
  va_end(ap);
  if (n < 0)
    n = 0;
  if (n > (int)sizeof(text) - 1)
    n = sizeof(text) - 1;
  text[n] = 0;
  for (int i = 0; i < n; ++i)
    if (text[i] == '\n' || text[i] == '\r')
      text[i] = ' ';
  const bool bad = strstr(text, "fail") || strstr(text, "FAIL") || strstr(text, "cannot") ||
                   strstr(text, "error") || strstr(text, "WARNING") || strstr(text, "still missing") ||
                   strstr(text, "safe mode") || strstr(text, "two modules");
  struct timespec now = {};
  clock_gettime(CLOCK_REALTIME, &now);
  struct tm at = {};
  gmtime_r(&now.tv_sec, &at);
  char line[1000];
  const int len = snprintf(line, sizeof(line), "%04d-%02d-%02d %02d:%02d:%02d.%03d %c  [payload] %s\n",
                           at.tm_year + 1900, at.tm_mon + 1, at.tm_mday, at.tm_hour, at.tm_min,
                           at.tm_sec, (int)(now.tv_nsec / 1000000), bad ? 'W' : 'I', text);
  if (len > 0)
    (void)write(fd, line, len < (int)sizeof(line) ? len : (int)sizeof(line) - 1);
  /* always on the disk at once: few lines, and the ones around an
     injection are the ones a full-console crash would lose */
  fsync(fd);
  close(fd);
}

/* One HTTP request to the module in ShellUI; returns the body ("" = no
   answer, nothing listening). */
std::string ask_module(const char *method, const char *path) {
  const int fd = socket(AF_INET, SOCK_STREAM, 0);
  if (fd < 0)
    return "";
  timeval tv = {3, 0};
  setsockopt(fd, SOL_SOCKET, SO_RCVTIMEO, &tv, sizeof(tv));
  setsockopt(fd, SOL_SOCKET, SO_SNDTIMEO, &tv, sizeof(tv));
  sockaddr_in addr = {};
  addr.sin_family = AF_INET;
  addr.sin_port = htons(kPort);
  addr.sin_addr.s_addr = htonl(INADDR_LOOPBACK);
  std::string out;
  if (connect(fd, reinterpret_cast<sockaddr *>(&addr), sizeof(addr)) == 0) {
    char req[160];
    const int n = snprintf(req, sizeof(req),
                           "%s %s HTTP/1.0\r\nContent-Length: 0\r\n\r\n",
                           method, path);
    (void)send(fd, req, n, 0);
    char buf[512];
    ssize_t got;
    while ((got = recv(fd, buf, sizeof(buf), 0)) > 0)
      out.append(buf, (size_t)got);
  }
  close(fd);
  const size_t body = out.find("\r\n\r\n");
  return body == std::string::npos ? out : out.substr(body + 4);
}

/* Swapping the module while someone moves on the Home crashed ShellUI:
   wait until the focus has not moved for kStillMs (the running module
   tells, GET /idle), 30 s at most. A module without /idle (older build) or
   without the frame hook (PS5 default) answers no number / -1: no wait. */
void wait_still_home() {
  const long kStillMs = 2000;
  bool told = false;
  for (int i = 0; i < 120; ++i) { /* 120 x 250 ms = 30 s */
    const std::string idle = ask_module("GET", "/idle");
    char *end = nullptr;
    const long ms = strtol(idle.c_str(), &end, 10);
    if (idle.empty() || end == idle.c_str() || ms < 0) {
      if (i == 0)
        logf("still check: not available ('%.40s')", idle.c_str());
      return;
    }
    if (ms >= kStillMs) {
      if (told)
        logf("still check: Home still after %d ms", i * 250);
      return;
    }
    if (!told) {
      told = true;
      logf("still check: Home moving (%ld ms), waiting", ms);
      notify("XMB5: stop moving on the Home for a moment.\n"
             "Loading starts when the controller is left alone.");
    }
    usleep(250 * 1000);
  }
  logf("still check: Home kept moving for 30 s, going on");
}

/* A module already in ShellUI leaves (hooks out, port closed). False when
   something answers that cannot leave (an old OnionHEN theme build). */
bool replace_running_module() {
  const std::string version = ask_module("GET", "/version");
  if (version.empty()) {
    logf("no module answering on :%d", kPort);
    return true;
  }
  logf("running module: '%s'", version.c_str());
  if (version.find("XMB5") == std::string::npos) {
    logf("refusing to replace non-XMB5 module");
    return false;
  }
  wait_still_home();
  const std::string bye = ask_module("POST", "/quit");
  logf("quit -> '%s'", bye.c_str());
  if (bye.rfind("bye", 0) != 0)
    return false;
  /* the hooks are out when it answers and its thread ends right after;
     the new module's server retries :4444 until the old one closed it.
     Short: the Home must still be still when the new module starts */
  usleep(500 * 1000);
  return true;
}

void stop_previous_watcher() {
  const int fd = open(kPidFile, O_RDONLY);
  if (fd >= 0) {
    char buf[16] = {};
    (void)read(fd, buf, sizeof(buf) - 1);
    close(fd);
    const pid_t old = (pid_t)atoi(buf);
    if (old > 1 && old != getpid() && kill(old, 0) == 0) {
      kill(old, SIGKILL);
      logf("stopped previous watcher pid %d", old);
    }
  }
  const int out = open(kPidFile, O_WRONLY | O_CREAT | O_TRUNC, 0666);
  if (out >= 0) {
    char buf[16];
    const int n = snprintf(buf, sizeof(buf), "%d", getpid());
    (void)write(out, buf, n);
    close(out);
  }
}

/* how many themes wait in Install/ (the module installs them when it
   starts; same filter as zt_install.cpp). 0 = none or already installed. */
int themes_to_install() {
  int n = 0;
  if (DIR *d = opendir((std::string(kDir) + "/Install").c_str())) {
    while (dirent *e = readdir(d)) {
      const std::string f = e->d_name;
      auto ends = [&](const char *x) {
        const size_t l = strlen(x);
        return f.size() >= l && f.compare(f.size() - l, l, x) == 0;
      };
      if (f.empty() || f[0] == '.' || ends(".failed") || ends(".part") || ends(".tmp"))
        continue;
      struct stat st = {};
      if (stat((std::string(kDir) + "/Install/" + f).c_str(), &st) == 0 && S_ISREG(st.st_mode))
        ++n;
    }
    closedir(d);
  }
  return n;
}

/* "PS5 default" (Options menu > ZhiThemes) writes no_theme; a USB
   stick with ZhiThemes/no_theme does the same while it is in (safe mode) */
bool stock_mode() {
  struct stat st = {};
  if (stat((std::string(kDir) + "/no_theme").c_str(), &st) == 0)
    return true;
  /* no theme file (first run, or deleted): the module keeps ZhiThemes off
     too. The name in active_theme.txt, else Default (zt_storage.cpp);
     Themes/<Name>.ztheme and theme.ztheme = older layouts, made
     Themes/<Name>/theme.json by the module */
  {
    std::string active;
    const int fd = open((std::string(kDir) + "/active_theme.txt").c_str(), O_RDONLY);
    if (fd >= 0) {
      char nb[64] = {};
      const ssize_t got = read(fd, nb, sizeof(nb) - 1);
      close(fd);
      for (ssize_t i = 0; i < got && nb[i] != '\n' && nb[i] != '\r'; ++i)
        active += nb[i];
    }
    while (!active.empty() && isspace((unsigned char)active.back()))
      active.pop_back();
    const bool named = !active.empty() && active.find('/') == std::string::npos && active[0] != '.';
    auto theme_there = [&](const std::string &n) {
      return stat((std::string(kDir) + "/Themes/" + n + "/theme.json").c_str(), &st) == 0 ||
             stat((std::string(kDir) + "/Themes/" + n + ".ztheme").c_str(), &st) == 0;
    };
    const bool has = (named && theme_there(active)) || theme_there("Default") ||
                     stat((std::string(kDir) + "/theme.ztheme").c_str(), &st) == 0;
    if (!has)
      return true;
  }
  for (int i = 0; i < 8; ++i) {
    const std::string b = "/mnt/usb" + std::to_string(i) + "/XMB5/no_theme";
    if (stat(b.c_str(), &st) == 0 || stat((b + ".txt").c_str(), &st) == 0)
      return true;
  }
  return false;
}

/* the theme that will load: the name in active_theme.txt (the theme's
   folder, Rename in the editor); "default" without one */
std::string current_theme() {
  std::string active;
  const int fd = open((std::string(kDir) + "/active_theme.txt").c_str(), O_RDONLY);
  if (fd >= 0) {
    char nb[64] = {};
    const ssize_t got = read(fd, nb, sizeof(nb) - 1);
    close(fd);
    for (ssize_t i = 0; i < got && nb[i] != 10 && nb[i] != 13; ++i)
      active += nb[i];
  }
  if (!active.empty() && active.find('/') == std::string::npos)
    return active;
  return "default";
}

/* this watcher is still the one in watcher.pid. On 30/10 two watchers
   ran (the SIGKILL of stop_previous_watcher did not stop the old one): each
   ShellUI restart was logged twice and got two modules (port 4444 busy for 3
   hours, then a crash; later one of two injections failed and ShellUI fell
   18 s after). A watcher that is no longer in the file stops by itself. */
bool still_the_watcher() {
  const int fd = open(kPidFile, O_RDONLY);
  if (fd < 0)
    return true;
  char buf[16] = {};
  (void)read(fd, buf, sizeof(buf) - 1);
  close(fd);
  const pid_t in_file = (pid_t)atoi(buf);
  return in_file <= 0 || in_file == getpid();
}

/* seconds to wait after a ShellUI restart (inject_delay, set in the
   editor's Logs tab; 15 when missing) */
int inject_delay() {
  const std::string path = std::string(kDir) + "/inject_delay";
  const int fd = open(path.c_str(), O_RDONLY);
  int s = 15;
  if (fd >= 0) {
    char buf[16] = {};
    (void)read(fd, buf, sizeof(buf) - 1);
    close(fd);
    s = atoi(buf);
  }
  return s < 5 || s > 120 ? 15 : s;
}

/* how many modules went into this ShellUI. On 28/10 and 04/11 the console crashed after the 6th injection in a row into the same
   ShellUI, with no error in the log (memory not given back on unload is the
   suspect). inject_count holds "<pid> <count> <boot time>"; a new
   ShellUI (or a reboot that reuses the pid) starts again at 1. */
constexpr const char *kCountFile = "/user/data/XMB5/inject_count";
constexpr int kInjectWarn = 4;

long boot_time() {
  struct timeval tv = {};
  size_t len = sizeof(tv);
  if (sysctlbyname("kern.boottime", &tv, &len, nullptr, 0) != 0)
    return 0;
  return (long)tv.tv_sec;
}

int count_injection(pid_t shellui) {
  long pid = 0, count = 0, boot = 0;
  const int fd = open(kCountFile, O_RDONLY);
  if (fd >= 0) {
    char buf[64] = {};
    (void)read(fd, buf, sizeof(buf) - 1);
    close(fd);
    sscanf(buf, "%ld %ld %ld", &pid, &count, &boot);
  }
  const long now_boot = boot_time();
  /* boot times within a minute: the same boot (the value can move a little) */
  const bool same = pid == (long)shellui && count > 0 &&
                    (boot == 0 || now_boot == 0 || labs(boot - now_boot) < 60);
  count = same ? count + 1 : 1;
  const int out = open(kCountFile, O_WRONLY | O_CREAT | O_TRUNC, 0666);
  if (out >= 0) {
    char buf[64];
    const int n = snprintf(buf, sizeof(buf), "%d %ld %ld\n", (int)shellui, count, now_boot);
    (void)write(out, buf, n);
    close(out);
  }
  return (int)count;
}

long long now_ms() {
  struct timeval tv = {};
  gettimeofday(&tv, nullptr);
  return (long long)tv.tv_sec * 1000 + tv.tv_usec / 1000;
}

/* kinfo_proc entries of a process (one per thread with threads=true). The
   PS5's entries can be bigger than the SDK's struct: each is stepped by its
   own ki_structsize, only the SDK's fields are read. */
std::string proc_entries(pid_t pid, bool threads) {
  int mib[4] = {CTL_KERN, KERN_PROC, KERN_PROC_PID | (threads ? KERN_PROC_INC_THREAD : 0), (int)pid};
  size_t len = 0;
  if (sysctl(mib, 4, nullptr, &len, nullptr, 0) != 0 || len == 0)
    return std::string();
  std::string buf(len + 4096, '\0');
  len = buf.size();
  if (sysctl(mib, 4, &buf[0], &len, nullptr, 0) != 0)
    return std::string();
  buf.resize(len);
  return buf;
}

template <typename F> void each_entry(const std::string &buf, F f) {
  size_t at = 0;
  while (at + sizeof(int) <= buf.size()) {
    int size = 0;
    memcpy(&size, buf.data() + at, sizeof(int));
    if (size < (int)offsetof(struct kinfo_proc, ki_tid) + 4 || at + (size_t)size > buf.size())
      break;
    struct kinfo_proc kp;
    memset(&kp, 0, sizeof(kp));
    memcpy(&kp, buf.data() + at, (size_t)size < sizeof(kp) ? (size_t)size : sizeof(kp));
    f(kp);
    at += (size_t)size;
  }
}

/* seconds since the ShellUI process started (-1 when unknown) */
long shellui_age(pid_t pid) {
  long start = 0;
  each_entry(proc_entries(pid, false), [&](const struct kinfo_proc &kp) {
    if (!start)
      start = (long)kp.ki_start.tv_sec;
  });
  return start > 0 ? (long)time(nullptr) - start : -1;
}

/* "48 threads: run 2 sleep 45 stop 1 | flags traced stopped | umtxn 20,
   ipcwait 6, ..." : how ShellUI's threads are right now */
std::string shellui_threads(pid_t pid) {
  int total = 0, run = 0, sleep_ = 0, stop = 0, other = 0;
  long flags = 0;
  std::string waits[64];
  int counts[64] = {};
  int kinds = 0;
  each_entry(proc_entries(pid, true), [&](const struct kinfo_proc &kp) {
    ++total;
    flags |= kp.ki_flag;
    if (kp.ki_stat == SRUN)
      ++run;
    else if (kp.ki_stat == SSLEEP)
      ++sleep_;
    else if (kp.ki_stat == SSTOP)
      ++stop;
    else
      ++other;
    char w[WMESGLEN + 1] = {};
    memcpy(w, kp.ki_wmesg, WMESGLEN);
    const std::string wm = w[0] ? w : "-";
    int i = 0;
    while (i < kinds && waits[i] != wm)
      ++i;
    if (i == kinds && kinds < 64)
      waits[kinds++] = wm;
    if (i < 64)
      ++counts[i];
  });
  if (!total)
    return "gone";
  char head[160];
  snprintf(head, sizeof(head), "%d threads: run %d sleep %d stop %d other %d |%s%s%s |", total, run,
           sleep_, stop, other, (flags & P_TRACED) ? " traced" : "",
           (flags & P_STOPPED) ? " stopped" : "", (flags & (P_TRACED | P_STOPPED)) ? "" : " -");
  std::string out = head;
  for (int i = 0; i < kinds; ++i)
    out += " " + waits[i] + " " + std::to_string(counts[i]) + (i + 1 < kinds ? "," : "");
  return out;
}

/* the first seconds after an injection: ShellUI's threads whenever they
   change (an old ShellUI froze right after the module started on 13.60) */
void watch_shellui(pid_t pid, int seconds) {
  std::string last;
  const long long end = now_ms() + seconds * 1000LL;
  int step = 0;
  while (now_ms() < end) {
    const std::string now = shellui_threads(pid);
    if (now != last) {
      logf("ShellUI pid %d +%lld ms: %s", pid, now_ms() - (end - seconds * 1000LL), now.c_str());
      last = now;
    }
    if (now == "gone" || onion_find_pid("SceShellUI") != pid)
      return;
    usleep(step++ < 20 ? 100 * 1000 : 1000 * 1000);
  }
}

/* Another HEN or payload that puts its own module into ShellUI (etaHEN,
   OnionHEN, AniketosHEN, ...): two modules in one ShellUI crash it, so
   ZhiThemes does not go in (OnionHEN and AniketosHEN refuse etaHEN the
   same way). Returns its name, or nullptr. */
const char *foreign_payload() {
  if (const char *c = onion_conflict_detect())
    return c;
  /* OnionHEN / AniketosHEN: their module also lives in ShellUI */
  static const char *const kOnion[] = {"onion_daemon.elf", "onion_util.elf",
                                       "onion_daemon", "onion_util"};
  for (const char *name : kOnion)
    if (onion_find_pid(name) > 0)
      return "OnionHEN / AniketosHEN";
  return nullptr;
}

bool sprx_loaded(pid_t pid, const char *name) {
  uint32_t handle = (uint32_t)-1;
  return kernel_dynlib_handle(pid, name, &handle) == 0 && handle != (uint32_t)-1;
}

/* A ShellUI that is still starting: wait until it has its trophy modules
   (kstuff patches ShellUI once they are in), then 10 s more. A ShellUI that
   is up is not kept waiting (same rule as AniketosHEN). False when that
   ShellUI is gone meanwhile. */
bool wait_shellui_started(pid_t pid) {
  static const char *const kReady[] = {"libSceNpTrophy.sprx", "libSceNpTrophy2.sprx"};
  bool waited = false;
  for (const char *name : kReady) {
    int i = 0;
    for (; i < 60 && !sprx_loaded(pid, name); ++i) {
      if (onion_find_pid("SceShellUI") != pid)
        return false;
      waited = true;
      usleep(500 * 1000);
    }
    if (i == 60)
      logf("ShellUI pid %d: %s still missing after 30 s", pid, name);
  }
  if (waited) {
    logf("ShellUI pid %d was still starting; waiting 10 s more", pid);
    sleep(10);
    if (onion_find_pid("SceShellUI") != pid)
      return false;
  }
  return true;
}

/* The PS5 web browser (a payload manager page) open while ZhiThemes goes
   into ShellUI: ShellUI froze a few ms after the module started and the
   system killed it (seen on 9.60 and 13.60, only when the ELF was sent
   from the browser; from a PC or an autoloader it always worked).
   Only the page process counts: SceNKUIProcess and SceNKNetworkProcess
   stay alive after the browser is closed.
   Returns the name of the browser process still running, or nullptr. */
const char *browser_process() {
  static const char kPage[] = "SceNKWebProcess";
  return onion_find_pid(kPage) > 0 ? kPage : nullptr;
}

/* wait until the browser is closed before injecting. False when a newer
   watcher took over meanwhile.
   V79: no pop-up any more ("will load when you leave the payload manager" also showed when the browser was not on screen: a page
   process left running in the background, e.g. the browser suspended behind the Home). It waits silently up to 1 s (V80; 10 s in
   V79); a browser page still there after that is closed (page, UI and network processes) and the XMB goes in. */
bool wait_browser_closed(const char *when) {
  const char *open_now = browser_process();
  if (!open_now)
    return true;
  logf("%s: the web browser page is running (%s); waiting up to 1 s before injecting", when, open_now);
  const long long t0 = now_ms();
  for (int i = 0; browser_process(); ++i) {
    usleep(250 * 1000);
    if (i % 4 == 3 && !still_the_watcher()) {
      logf("watcher %d: a newer watcher took over, stopping", getpid());
      return false;
    }
    if (now_ms() - t0 > 1000) {   /* V80: 1 s (was 10 s): the XMB starts right away */
      const pid_t page = onion_find_pid("SceNKWebProcess");
      const int rc = page > 0 ? kill(page, SIGKILL) : -1;
      logf("browser page still running after 1 s: closing it (pid %d): %s", page, rc == 0 ? "ok" : strerror(errno));
      for (int k = 0; k < 40 && browser_process(); ++k) usleep(50 * 1000);
      break;
    }
  }
  logf("web browser page gone after %lld ms", now_ms() - t0);
  usleep(500 * 1000);
  return still_the_watcher();
}

/* The browser's UI and network processes stay alive after the browser is
   closed, and a ShellUI that still has them froze right after the module
   started (a ShellUI where the browser was never opened never did). Close
   them before injecting; the browser starts new ones when it is opened
   again. */
void close_browser_helpers() {
  static const char *const kHelpers[] = {"SceNKUIProcess", "SceNKNetworkProcess"};
  bool any = false;
  for (const char *name : kHelpers) {
    const pid_t pid = onion_find_pid(name);
    if (pid <= 0)
      continue;
    any = true;
    const int rc = kill(pid, SIGKILL);
    logf("closing %s pid %d: %s", name, pid, rc == 0 ? "ok" : strerror(errno));
  }
  if (!any)
    return;
  for (int i = 0; i < 100; ++i) {
    bool left = false;
    for (const char *name : kHelpers)
      if (onion_find_pid(name) > 0)
        left = true;
    if (!left) {
      /* 0.5 s was too short once: the ShellUI still froze at the module's
         start, the same sequence working other times */
      logf("browser helpers closed after %d ms; injecting in 2 s", i * 50);
      sleep(2);
      return;
    }
    usleep(50 * 1000);
  }
  logf("browser helpers still running after 5 s");
}

/* stop when another HEN's module would share ShellUI with ours */
bool refuse_foreign(const char *when) {
  const char *other = foreign_payload();
  if (!other)
    return false;
  logf("%s: %s is running, not injecting (two modules in ShellUI crash it)", when, other);
  notify("XMB5 can't run together with %s.\n"
         "Restart the PS5 and load XMB5 without it.", other);
  return true;
}

/* diagnostic build: every process running (pid, name, threads), to see
   which HEN, payloads and system services are there */
void log_processes() {
  int mib[3] = {CTL_KERN, KERN_PROC, KERN_PROC_PROC};
  size_t len = 0;
  if (sysctl(mib, 3, nullptr, &len, nullptr, 0) != 0 || !len)
    return;
  std::string buf(len + 8192, '\0');
  len = buf.size();
  if (sysctl(mib, 3, &buf[0], &len, nullptr, 0) != 0)
    return;
  buf.resize(len);
  std::string line;
  int count = 0;
  each_entry(buf, [&](const struct kinfo_proc &kp) {
    char name[COMMLEN + 1] = {};
    memcpy(name, kp.ki_comm, COMMLEN);
    char item[64];
    snprintf(item, sizeof(item), "%d %s (%d)", (int)kp.ki_pid, name, kp.ki_numthreads);
    line += (line.empty() ? "" : ", ") + std::string(item);
    ++count;
    if (line.size() > 400) {
      logf("diag: processes: %s", line.c_str());
      line.clear();
    }
  });
  if (!line.empty())
    logf("diag: processes: %s", line.c_str());
  logf("diag: %d processes", count);
}

/* returns the injection number in this ShellUI (0 = failed) */
int inject(pid_t shellui) {
  logf("ShellUI pid %d up for %ld s; injecting", shellui, shellui_age(shellui));
  if (ZT_DIAG)
    log_processes();
  const long long t0 = now_ms();
  const bool ok = Inject_Toolbox((int)shellui, zt_shellui_elf_start);
  logf("inject into SceShellUI pid %d: %s (%lld ms)", shellui, ok ? "ok" : "FAILED",
       now_ms() - t0);
  /* diagnostic build: is that ShellUI running, stuck or stopped afterwards */
  if (ZT_DIAG)
    watch_shellui(shellui, 20);
  if (!ok)
    return 0;
  const int n = count_injection(shellui);
  logf("injection %d into this ShellUI%s", n,
       n >= kInjectWarn ? " (warning shown: restart the PS5 soon)" : "");
  return n;
}


} // namespace

/* V77: the users' profile pictures for the XMB's Users category. ShellUI cannot open /system_data/priv/cache/profile (its sandbox: the
   picture was never found), this payload can: each user's avatar.png (or picture.png) is copied to
   Assets/cache/profile/0x<user id>/avatar.png, where the module reads it. Only copied when it is new or changed. */
bool copy_whole(const std::string &src, const std::string &dst) {
  FILE *in = fopen(src.c_str(), "rb");
  if (!in) return false;
  const std::string tmp = dst + ".tmp";
  FILE *out = fopen(tmp.c_str(), "wb");
  if (!out) { fclose(in); return false; }
  char buf[16384];
  size_t n, total = 0;
  bool ok = true;
  while ((n = fread(buf, 1, sizeof(buf), in)) > 0 && total < (8u << 20)) { if (fwrite(buf, 1, n, out) != n) { ok = false; break; } total += n; }
  fclose(in);
  fclose(out);
  if (!ok || total < 64 || rename(tmp.c_str(), dst.c_str()) != 0) { unlink(tmp.c_str()); return false; }
  return true;
}
void mirror_profiles() {
  static const char *const root = "/system_data/priv/cache/profile";
  static bool raised = false, told = false;
  DIR *d = opendir(root);
  if (!d && !raised) {
    raised = true;
    const int e = errno, r = elfldr_raise_privileges(getpid());
    logf("profile pictures: %s not readable (errno %d), raise privileges -> %d", root, e, r);
    d = opendir(root);
  }
  if (!d) { if (!told) { told = true; logf("profile pictures: %s not readable (errno %d)", root, errno); } return; }
  const std::string base = std::string(kDir) + "/Assets/cache/profile";
  while (dirent *e = readdir(d)) {
    if (strncmp(e->d_name, "0x", 2) != 0 || strlen(e->d_name) > 20) continue;
    for (const char *name : {"avatar.png", "picture.png"}) {
      const std::string src = std::string(root) + "/" + e->d_name + "/" + name;
      struct stat ss, ds;
      if (stat(src.c_str(), &ss) != 0 || !S_ISREG(ss.st_mode) || ss.st_size < 64) continue;
      const std::string dir = base + "/" + e->d_name, dst = dir + "/avatar.png";
      if (stat(dst.c_str(), &ds) == 0 && ds.st_size == ss.st_size && ds.st_mtime >= ss.st_mtime) break;   /* up to date */
      mkdir((std::string(kDir) + "/Assets").c_str(), 0777);
      mkdir((std::string(kDir) + "/Assets/cache").c_str(), 0777);
      mkdir(base.c_str(), 0777);
      mkdir(dir.c_str(), 0777);
      const bool ok = copy_whole(src, dst);
      logf("profile pictures: %s -> %s %s", src.c_str(), dst.c_str(), ok ? "copied" : "NOT copied");
      if (ok) break;
    }
  }
  closedir(d);
}

int main() {
  mkdir("/user/data", 0777);
  mkdir(kDir, 0777);
  /* logs/ is now Logs/ (the module moves what is left) */
  rename("/user/data/XMB5/logs", "/user/data/XMB5/Logs");
  mkdir("/user/data/XMB5/Logs", 0777);
  logf("%s%s %s (build %d) by %s: payload start (pid %d)", ZT_NAME, ZT_EDITION, ZT_VERSION, ZT_BUILD,
       ZT_AUTHOR, getpid());
  if (ZT_DIAG)
    log_processes();
  stop_previous_watcher();
  pid_t shellui = onion_find_pid("SceShellUI");
  if (shellui <= 0) {
    notify("XMB5: SceShellUI not found");
    return 1;
  }
  if (refuse_foreign("start"))
    return 1;
  /* the waits first, the module swap last: the still-Home check ran 4 s
     before the injection (quit, helpers closed, 2 s waits) and moving the
     controller in that gap crashed the new module as it started */
  if (!wait_browser_closed("start"))
    return 0;
  close_browser_helpers();
  shellui = onion_find_pid("SceShellUI"); /* it may have restarted meanwhile */
  if (shellui <= 0) {
    notify("XMB5: SceShellUI not found");
    return 1;
  }
  if (!wait_shellui_started(shellui)) {
    shellui = onion_find_pid("SceShellUI");
    logf("ShellUI restarted while starting; now pid %d", shellui);
    if (shellui <= 0 || !wait_shellui_started(shellui)) {
      notify("XMB5: SceShellUI not ready");
      return 1;
    }
  }
  mirror_profiles();   /* V77: before the module asks for the users */
  if (!replace_running_module()) {
    notify("XMB5: an older theme (OnionHEN) is active.\n"
           "Reboot without it, then send XMB5 again.");
    return 1;
  }
  const int loads = inject(shellui);
  if (!loads) {
    notify("XMB5: injection failed");
    return 1;
  }
  char extra[200] = "";
  if (loads >= kInjectWarn)
    snprintf(extra, sizeof(extra),
             "\n\xE2\x9A\xA0 Loaded %d times without a restart: restart the PS5 before testing more.",
             loads);
  /* a theme still in Install/ is being installed by the module: the
     old theme's name would be wrong (the module tells the new one) */
  const int pending = themes_to_install();
  std::string loading;
  if (pending == 1)
    loading = "Installing the new theme from the Install folder";
  else if (pending > 1)
    loading = "Installing " + std::to_string(pending) + " themes from the Install folder";
  else if (stock_mode())
    loading = "XMB5 is off (PS5 default): Options on a tile > XMB5 to pick a theme";
  else
    loading = "Now loading " + current_theme();
  /* PS5 XMB: no "Welcome to XMB5" pop-up when the ELF loads (the XMB's own boot intro plays instead); the same text goes to
     the log only. A problem (another theme running, injection failed...) is still shown above. */
  logf("XMB5 %s (%s). %s%s", ZT_VERSION, ZT_AUTHOR,
       loading.c_str(), extra);
  /* V79: no pop-ups when the ELF loads (the "loaded N times" warning and the diagnostic note go to the log only) */
  if (ZT_DIAG)
    logf("DIAGNOSTIC build: everything goes to /data/XMB5/Logs and Dumps");

  /* ShellUI restarts (rest mode, crashes): inject again into the new one.
     Safe mode: two restarts within 3 minutes look like the theme crashing
     ShellUI, so the watcher stops injecting (no crash loop) until a new
     ZhiThemes.elf is sent. */
  time_t last_restart = 0;
  for (int tick = 1;; ++tick) {
    sleep(3);
    if (tick % 10 == 0) mirror_profiles();   /* V77: a changed profile picture within ~30 s */
    if (!still_the_watcher()) {
      logf("watcher %d: a newer watcher took over, stopping", getpid());
      return 0;
    }
    const pid_t now = onion_find_pid("SceShellUI");
    if (now <= 0 || now == shellui)
      continue;
    logf("SceShellUI changed %d -> %d", shellui, now);
    shellui = now;
    const time_t t = time(nullptr);
    if (last_restart && t - last_restart < 180) {
      logf("safe mode: ShellUI restarted twice in %ld s, not injecting",
           (long)(t - last_restart));
      notify("XMB5: ShellUI crashed twice in a row.\n"
             "Theme off (safe mode). Send XMB5.elf again.");
      return 0;
    }
    last_restart = t;
    const int wait = inject_delay();
    logf("waiting %d s before injecting", wait);
    sleep(wait); /* let the new ShellUI load its libraries first */
    if (!still_the_watcher()) {
      logf("watcher %d: a newer watcher took over, stopping", getpid());
      return 0;
    }
    if (onion_find_pid("SceShellUI") != shellui)
      continue;
    /* a module already answering in this ShellUI: never a second one */
    const std::string running = ask_module("GET", "/version");
    if (!running.empty()) {
      logf("module already running ('%s'), not injecting", running.substr(0, 80).c_str());
      continue;
    }
    if (refuse_foreign("restart"))
      return 0;
    if (!wait_browser_closed("restart"))
      return 0;
    close_browser_helpers();
    /* a ShellUI restart while the browser was open is not ours: no safe
       mode count, just let the new one start first */
    const pid_t after = onion_find_pid("SceShellUI");
    if (after != shellui) {
      logf("SceShellUI changed %d -> %d while waiting for the browser", shellui, after);
      shellui = after;
      last_restart = 0;
      if (shellui <= 0)
        continue;
      sleep(inject_delay());
      if (onion_find_pid("SceShellUI") != shellui)
        continue;
    }
    if (!wait_shellui_started(shellui))
      continue;
    (void)inject(shellui);
  }
  return 0;
}
