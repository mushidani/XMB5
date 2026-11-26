/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.  */

#include "zt_log.hpp"
#include "zt_brand.hpp"
#include "zt_paths.hpp"
#include "zt_storage.hpp"

#include "defs.h"
#include <onion/platform.h>

#include <algorithm>
#include <atomic>
#include <ctype.h>
#include <dirent.h>
#include <errno.h>
#include <fcntl.h>
#include <mutex>
#include <stdarg.h>
#include <stdio.h>
#include <string.h>
#include <stdint.h>
#include <sys/mman.h>
#include <sys/stat.h>
#include <time.h>
#include <unistd.h>
#include <vector>

namespace {

constexpr const char *kLogDir = ZT_LOGS;
constexpr const char *kLog = ZT_LOGS "/xmb5.log";
constexpr const char *kTemp = ZT_LOGS "/xmb5.log.tmp";
/* small state files, kept beside Logs/ so that folder holds only logs */
constexpr const char *kDebugFlag = ZT_DIR "/debug.on";
/* written at the start, deleted at a clean end: still there at the next
   start = the session before did not close */
constexpr const char *kOpenMark = ZT_DIR "/session.open";
/* at a start past kMaxLog, the oldest whole sessions go until the file is
   at most kTrimTo (so the cut is not done at every start) */
constexpr off_t kMaxLog = 16 << 20;
constexpr off_t kTrimTo = 12 << 20;
/* while running: something logging far too much is cut at once */
constexpr off_t kHardMax = 32 << 20;
/* longest text of one line */
constexpr size_t kMaxText = 4000;
/* the first line of every session; the cut keeps sessions whole by it */
constexpr const char *kStartMark = "==== session start";

std::mutex g_lock;
timespec g_start = {};
time_t g_started = 0;
bool g_opened = false;
int g_debug = -1; /* -1 = not read yet, 0 off, 1 on, 2 on + sys */
std::string g_fw;
unsigned g_fw_hex = 0;

void ensure_dir() {
  mkdir("/user/data", 0777);
  mkdir(ZT_DIR, 0777);
  mkdir(kLogDir, 0777);
}

off_t file_size(const char *path) {
  struct stat st;
  return stat(path, &st) == 0 ? st.st_size : -1;
}

void read_debug_flag() {
  /* the diagnostic build: debug mode with the Settings/Trophies map, always */
  if (ZT_DIAG) {
    g_debug = 2;
    return;
  }
  const int fd = open(kDebugFlag, O_RDONLY);
  if (fd < 0) {
    g_debug = 0;
    return;
  }
  close(fd);
  /* debug mode always maps Settings and Trophies too (no separate switch) */
  g_debug = 2;
}

/* "2026-11-17 12:00:00.123 +12.345 I  " */
size_t line_head(char *out, size_t room, char level) {
  timespec now = {};
  clock_gettime(CLOCK_REALTIME, &now);
  struct tm at = {};
  gmtime_r(&now.tv_sec, &at);
  double since = 0;
  if (g_start.tv_sec)
    since = (double)(now.tv_sec - g_start.tv_sec) + (now.tv_nsec - g_start.tv_nsec) / 1e9;
  const int n = snprintf(out, room, "%04d-%02d-%02d %02d:%02d:%02d.%03d +%.3f %c  ",
                         at.tm_year + 1900, at.tm_mon + 1, at.tm_mday, at.tm_hour, at.tm_min,
                         at.tm_sec, (int)(now.tv_nsec / 1000000), since, level ? level : 'I');
  return n > 0 && (size_t)n < room ? (size_t)n : 0;
}

/* Keeps the newest part of the log, from the first session start at or
   after (size - keep); when one session alone is bigger, from a line. The
   caller holds g_lock. */
void trim_locked(off_t keep) {
  const off_t size = file_size(kLog);
  if (size <= keep)
    return;
  const int in = open(kLog, O_RDONLY);
  if (in < 0)
    return;
  const off_t from = size - keep;
  std::vector<char> buf(65536); /* on the heap: module threads have small stacks */
  const size_t mark_len = strlen(kStartMark);
  off_t cut = -1, first_line = -1;
  /* chunks overlap by the mark's length so a mark across two is found */
  for (off_t at = from; at < size && cut < 0;) {
    const ssize_t n = pread(in, buf.data(), buf.size(), at);
    if (n <= 0)
      break;
    for (ssize_t i = 0; i < n; ++i) {
      if (first_line < 0 && buf[i] == '\n')
        first_line = at + i + 1;
      if (buf[i] == '=' && (size_t)(n - i) >= mark_len &&
          memcmp(buf.data() + i, kStartMark, mark_len) == 0) {
        /* the start of that line */
        off_t ls = at + i;
        char back[96];
        const off_t b0 = ls > (off_t)sizeof(back) ? ls - (off_t)sizeof(back) : 0;
        const ssize_t bn = pread(in, back, (size_t)(ls - b0), b0);
        for (ssize_t k = bn - 1; k >= 0; --k)
          if (back[k] == '\n') {
            ls = b0 + k + 1;
            break;
          }
        if (ls >= from) {
          cut = ls;
          break;
        }
      }
    }
    if ((size_t)n < mark_len + 1)
      break;
    at += n - (ssize_t)mark_len;
  }
  if (cut < 0)
    cut = first_line >= 0 ? first_line : from;
  const int out = open(kTemp, O_WRONLY | O_CREAT | O_TRUNC, 0666);
  if (out < 0) {
    close(in);
    return;
  }
  char note[160];
  const size_t h = line_head(note, sizeof(note), 'I');
  const int nn = snprintf(note + h, sizeof(note) - h,
                          "(older lines removed: %lld bytes; the log keeps about %d MB)\n",
                          (long long)cut, (int)(kMaxLog >> 20));
  if (nn > 0)
    (void)!write(out, note, h + (size_t)nn);
  bool ok = true;
  for (off_t at = cut; at < size;) {
    const ssize_t n = pread(in, buf.data(), buf.size(), at);
    if (n <= 0)
      break;
    if (write(out, buf.data(), (size_t)n) != n) {
      ok = false;
      break;
    }
    at += n;
  }
  close(in);
  fsync(out);
  close(out);
  if (ok)
    rename(kTemp, kLog);
  else
    unlink(kTemp);
}

/* the files of the old layout (one log per kind): now all in zhithemes.log */
void remove_old_files() {
  static const char *const kOld[] = {"previous.log", "boot.log", "payload.log"};
  for (const char *n : kOld)
    unlink((std::string(kLogDir) + "/" + n).c_str());
  std::vector<std::string> names;
  if (DIR *d = opendir(kLogDir)) {
    while (dirent *e = readdir(d))
      if (strncmp(e->d_name, "debug-", 6) == 0 || strncmp(e->d_name, "crash-", 6) == 0)
        names.push_back(e->d_name);
    closedir(d);
  }
  for (const std::string &n : names)
    unlink((std::string(kLogDir) + "/" + n).c_str());
}

/* w inside l[0..n) (no memmem in the PS5's libc) */
bool contains(const char *l, size_t n, const char *w) {
  const size_t k = strlen(w);
  return std::search(l, l + n, w, w + k) != l + n;
}

/* the level letter of a written line ("date time +s L  text"), 0 if none */
char line_level(const char *l, size_t n) {
  if (n < 26)
    return 0;
  const char *p = static_cast<const char *>(memchr(l + 24, ' ', n - 24));
  return p && p + 2 < l + n && p[2] == ' ' ? p[1] : 0;
}

/* ---- flight recorder ----
   /data/XMB5/.blackbox: a 64-byte head + a 2 MB ring, mapped into
   memory (MAP_SHARED): every log line and the debug lines that do not go
   to the log (D with debug mode off: keys, new testIDs...) are copied in
   with memcpy. The pages live in the system's cache, so a ShellUI crash
   keeps them; msync every 2 s and at each E/W puts them on the disk. At
   the next start, after a session that did not close, its newest lines
   are pasted into zhithemes.log. No mmap -> pwrite to the same file. */
constexpr const char *kBox = ZT_DIR "/.blackbox";
constexpr size_t kBoxHead = 64, kBoxRing = 2u << 20;
constexpr char kBoxMagic[8] = {'Z', 'T', 'B', 'O', 'X', '0', '0', '1'};
struct BoxHead {
  char magic[8];
  uint64_t written; /* bytes put in the ring since the session start */
  int32_t pid;
  int64_t started;
};
int g_box_fd = -1;
char *g_box = nullptr; /* the mapping (head + ring), or nullptr */
uint64_t g_box_written = 0;

void box_head_locked() {
  BoxHead h = {};
  memcpy(h.magic, kBoxMagic, 8);
  h.written = g_box_written;
  h.pid = (int32_t)getpid();
  h.started = (int64_t)g_started;
  if (g_box)
    memcpy(g_box, &h, sizeof(h));
  else if (g_box_fd >= 0)
    (void)!pwrite(g_box_fd, &h, sizeof(h), 0);
}

void box_put_locked(const char *data, size_t len) {
  if (g_box_fd < 0 || !len)
    return;
  if (len > kBoxRing)
    return;
  size_t at = (size_t)(g_box_written % kBoxRing);
  while (len) {
    const size_t part = std::min(len, kBoxRing - at);
    if (g_box)
      memcpy(g_box + kBoxHead + at, data, part);
    else
      (void)!pwrite(g_box_fd, data, part, (off_t)(kBoxHead + at));
    data += part;
    len -= part;
    g_box_written += part;
    at = 0;
  }
  box_head_locked();
}

void box_sync_locked() {
  if (g_box)
    msync(g_box, kBoxHead + kBoxRing, MS_SYNC);
  else if (g_box_fd >= 0)
    fsync(g_box_fd);
}

/* the ring of the session before, as text (oldest first, whole lines) */
std::string box_read_old() {
  std::string out;
  const int fd = open(kBox, O_RDONLY);
  if (fd < 0)
    return out;
  BoxHead h = {};
  if (pread(fd, &h, sizeof(h), 0) == (ssize_t)sizeof(h) && memcmp(h.magic, kBoxMagic, 8) == 0 &&
      h.written > 0) {
    const size_t have = (size_t)std::min<uint64_t>(h.written, kBoxRing);
    out.resize(have);
    if (h.written <= kBoxRing) {
      if (pread(fd, &out[0], have, (off_t)kBoxHead) != (ssize_t)have)
        out.clear();
    } else {
      const size_t at = (size_t)(h.written % kBoxRing);
      const ssize_t a = pread(fd, &out[0], kBoxRing - at, (off_t)(kBoxHead + at));
      const ssize_t b = at ? pread(fd, &out[kBoxRing - at], at, (off_t)kBoxHead) : 0;
      if (a != (ssize_t)(kBoxRing - at) || b != (ssize_t)at)
        out.clear();
      else
        out.erase(0, out.find('\n') + 1); /* the first line was cut by the ring */
    }
  }
  close(fd);
  return out;
}

/* opens (makes) the ring for this session, from empty */
void box_open_locked() {
  g_box_fd = open(kBox, O_RDWR | O_CREAT, 0666);
  if (g_box_fd < 0)
    return;
  if (ftruncate(g_box_fd, (off_t)(kBoxHead + kBoxRing)) != 0) {
    close(g_box_fd);
    g_box_fd = -1;
    return;
  }
  void *m = mmap(nullptr, kBoxHead + kBoxRing, PROT_READ | PROT_WRITE, MAP_SHARED, g_box_fd, 0);
  g_box = m == MAP_FAILED ? nullptr : static_cast<char *>(m);
  g_box_written = 0;
  box_head_locked();
}

/* "date time" of a line, for comparing (the first 23 characters) */
std::string line_time(const char *l, size_t n) { return n >= 23 ? std::string(l, 23) : ""; }

/* "YYYY-MM-DD HH:MM:SS..." (UTC) -> seconds since 1970; 0 when not a time */
long long line_epoch(const std::string &t) {
  int y, mo, d, hh, mi, ss;
  if (t.size() < 19 || sscanf(t.c_str(), "%4d-%2d-%2d %2d:%2d:%2d", &y, &mo, &d, &hh, &mi, &ss) != 6)
    return 0;
  /* days since 1970-01-01 (civil calendar) */
  y -= mo <= 2;
  const long long era = (y >= 0 ? y : y - 399) / 400;
  const long long yoe = y - era * 400;
  const long long doy = (153 * (mo + (mo > 2 ? -3 : 9)) + 2) / 5 + d - 1;
  const long long doe = yoe * 365 + yoe / 4 - yoe / 100 + doy;
  return (era * 146097 + doe - 719468) * 86400 + hh * 3600 + mi * 60 + ss;
}

/* the time of the module's last line in zhithemes.log (the payload's
   "[payload]" lines after a crash do not count) */
std::string log_last_time() {
  const int fd = open(kLog, O_RDONLY);
  if (fd < 0)
    return "";
  struct stat st;
  std::string tail;
  if (fstat(fd, &st) == 0 && st.st_size > 0) {
    const off_t from = st.st_size > 65536 ? st.st_size - 65536 : 0;
    tail.resize((size_t)(st.st_size - from));
    if (pread(fd, &tail[0], tail.size(), from) != (ssize_t)tail.size())
      tail.clear();
  }
  close(fd);
  std::string last;
  for (size_t at = 0; at < tail.size();) {
    size_t end = tail.find('\n', at);
    if (end == std::string::npos)
      end = tail.size();
    if (end - at >= 23 && tail[at] == '2' && !contains(tail.data() + at, end - at, "[payload]"))
      last = line_time(tail.data() + at, end - at);
    at = end + 1;
  }
  return last;
}

/* ---- copy of the E/W/A lines (and the session marks) on a USB stick ----
   /usbN/XMB5-log.txt while a stick is in: a console reset no longer
   takes the log with it. The stick is looked for at the start and once a
   minute (zt_log_usb_check). */
std::string g_usb_log;

void usb_put_locked(const char *line, size_t len) {
  if (g_usb_log.empty())
    return;
  const char lv = line_level(line, len);
  const bool mark = contains(line, len, "====");
  if (lv != 'E' && lv != 'W' && lv != 'A' && !mark)
    return;
  const int fd = open(g_usb_log.c_str(), O_WRONLY | O_CREAT | O_APPEND, 0666);
  if (fd < 0) {
    g_usb_log.clear(); /* the stick went */
    return;
  }
  (void)!write(fd, line, len);
  close(fd);
}

void append_locked(const char *line, size_t len, bool sync) {
  ensure_dir();
  box_put_locked(line, len);
  usb_put_locked(line, len);
  const int fd = open(kLog, O_WRONLY | O_CREAT | O_APPEND, 0666);
  if (fd < 0)
    return;
  (void)!write(fd, line, len);
  if (sync) {
    fsync(fd);
    const char lv = line_level(line, len);
    if (lv == 'E' || lv == 'W')
      box_sync_locked();
  }
  const off_t size = lseek(fd, 0, SEEK_END);
  close(fd);
  if (size > kHardMax)
    trim_locked(kTrimTo);
}

/* The same line again and again (same level and text): only the first is
   written, then "(the line before x N more)" when another line comes, at
   the health line and at the end. Long lines are not compared. */
std::string g_prev;
char g_prev_level = 0;
int g_repeats = 0;
timespec g_prev_last = {};

void flush_repeats_locked() {
  if (!g_repeats)
    return;
  char line[200];
  const size_t h = line_head(line, sizeof(line), g_prev_level);
  struct tm at = {};
  gmtime_r(&g_prev_last.tv_sec, &at);
  const int n = snprintf(line + h, sizeof(line) - h,
                         "(the line before x %d more, the last at %02d:%02d:%02d)\n", g_repeats,
                         at.tm_hour, at.tm_min, at.tm_sec);
  g_repeats = 0;
  if (n > 0)
    append_locked(line, h + (size_t)n, false);
}

/* a D line with debug mode off: only into the flight recorder, at most
   kBoxPerSecond a second (the rest counted) */
constexpr int kBoxPerSecond = 200;

void box_only_line(const char *text, size_t len) {
  static time_t second = 0;
  static int count = 0, dropped = 0;
  std::string line;
  line.resize(64 + len + 1);
  size_t used = line_head(&line[0], 64, 'D');
  memcpy(&line[used], text, len);
  used += len;
  line[used++] = '\n';
  line.resize(used);
  std::lock_guard<std::mutex> guard(g_lock);
  const time_t now = time(nullptr);
  if (now != second) {
    if (dropped) {
      char note[96];
      const size_t h = line_head(note, sizeof(note), 'D');
      const int n = snprintf(note + h, sizeof(note) - h, "(recorder: %d lines left out in 1 s)\n", dropped);
      if (n > 0)
        box_put_locked(note, h + (size_t)n);
    }
    second = now;
    count = dropped = 0;
  }
  if (++count > kBoxPerSecond) {
    ++dropped;
    return;
  }
  box_put_locked(line.data(), line.size());
}

void write_line(char level, const char *text, size_t len) {
  if (level == 'D' && !zt_debug_on()) {
    box_only_line(text, len);
    return;
  }
  {
    std::lock_guard<std::mutex> guard(g_lock);
    if (len < 1024 && level == g_prev_level && len == g_prev.size() &&
        memcmp(text, g_prev.data(), len) == 0) {
      ++g_repeats;
      clock_gettime(CLOCK_REALTIME, &g_prev_last);
      return;
    }
    flush_repeats_locked();
    if (len < 1024)
      g_prev.assign(text, len);
    else
      g_prev.clear();
    g_prev_level = level;
  }
  std::string line;
  line.resize(64 + len + 1);
  size_t used = line_head(&line[0], 64, level);
  memcpy(&line[used], text, len);
  used += len;
  line[used++] = '\n';
  line.resize(used);
  std::lock_guard<std::mutex> guard(g_lock);
  append_locked(line.data(), line.size(), level == 'E' || level == 'W' || level == 'A');
}

/* "error" as a word of its own (not errorTitle, errors=0) */
bool has_error_word(const char *t) {
  for (const char *p = t; (p = strstr(p, "error")) != nullptr; p += 5) {
    const bool start = p == t || !isalnum((unsigned char)p[-1]);
    const bool end = !isalnum((unsigned char)p[5]) && p[5] != '=';
    if (start && end)
      return true;
  }
  return false;
}

/* level of a line written without one */
char guess_level(const char *t) {
  if (strstr(t, " threw") || strstr(t, "exception") || strstr(t, "CRASH"))
    return 'E';
  if (strstr(t, "failed") || strstr(t, "cannot ") || strstr(t, "refused") ||
      strstr(t, "WARNING") || strstr(t, "warning") || strstr(t, "not found") ||
      strstr(t, "missing") || strstr(t, "unavailable") || has_error_word(t))
    return 'W';
  return 'I';
}

void vlog(char level, const char *fmt, va_list ap) {
  char small[512];
  va_list again;
  va_copy(again, ap);
  const int n = vsnprintf(small, sizeof(small), fmt, ap);
  if (n <= 0) {
    va_end(again);
    return;
  }
  std::string big;
  const char *text = small;
  size_t len = (size_t)n;
  if (len >= sizeof(small)) {
    /* long line: formatted again on the heap (up to kMaxText) */
    if (len > kMaxText)
      len = kMaxText;
    big.resize(len + 1);
    vsnprintf(&big[0], len + 1, fmt, again);
    text = big.data();
  }
  va_end(again);
  /* no line breaks inside a line */
  std::string flat;
  if (memchr(text, '\n', len) || memchr(text, '\r', len)) {
    flat.assign(text, len);
    for (char &c : flat)
      if (c == '\n' || c == '\r')
        c = ' ';
    text = flat.data();
  }
  if (!level)
    level = guess_level(text);
  write_line(level, text, len);
  LOG_INFO("zhithemes: %c %.*s", level, (int)(len < 400 ? len : 400), text);
}

std::string json_text(const std::string &s) {
  std::string out = "\"";
  for (char c : s) {
    if (c == '"' || c == '\\')
      out += '\\';
    if ((unsigned char)c >= 32)
      out += c;
  }
  return out + "\"";
}

/* the stick for the copy of the E/W/A lines ("" = none) */
void usb_check_locked() {
  std::string found;
  for (int i = 0; i < 8 && found.empty(); ++i) {
    const std::string root = "/usb" + std::to_string(i);
    struct stat st;
    if (stat(root.c_str(), &st) == 0 && S_ISDIR(st.st_mode))
      found = root + "/XMB5-log.txt";
  }
  g_usb_log = found;
}

/* After a session that did not close: the flight recorder's lines that are
   not in zhithemes.log (the debug lines kept only there, and the lines
   newer than the log's last one, lost with the crash) go into the log,
   newest 512 KB. Caller holds g_lock; the ring is not open yet. */
void paste_recorder_locked(const std::string &last) {
  constexpr size_t kMaxPaste = 512u << 10;
  const std::string old = box_read_old();
  if (old.empty())
    return;
  std::string keep;
  size_t lines = 0;
  for (size_t at = 0; at < old.size();) {
    size_t end = old.find('\n', at);
    if (end == std::string::npos)
      break; /* a line cut by the crash */
    const char *l = old.data() + at;
    const size_t n = end - at;
    if (n >= 26 && (line_level(l, n) == 'D' || line_time(l, n) > last)) {
      keep.append(l, n + 1);
      ++lines;
    }
    at = end + 1;
  }
  if (keep.size() > kMaxPaste)
    keep.erase(0, keep.find('\n', keep.size() - kMaxPaste) + 1);
  char line[256];
  size_t h = line_head(line, sizeof(line), 'I');
  int n = snprintf(line + h, sizeof(line) - h,
                   "---- flight recorder of that session: %zu lines not in the log (debug lines, "
                   "and lines after %s) ----\n",
                   lines, last.empty() ? "?" : last.c_str());
  if (n > 0)
    append_locked(line, h + (size_t)n, false);
  if (!keep.empty())
    append_locked(keep.data(), keep.size(), false);
  h = line_head(line, sizeof(line), 'I');
  n = snprintf(line + h, sizeof(line) - h, "---- end of the flight recorder ----\n");
  if (n > 0)
    append_locked(line, h + (size_t)n, true);
}

/* First line of this ShellUI's session (once): the start mark, the crash
   mark of the session before, the cut at kMaxLog. Caller holds g_lock. */
void open_session_locked() {
  if (g_opened)
    return;
  g_opened = true;
  ensure_dir();
  clock_gettime(CLOCK_REALTIME, &g_start);
  g_started = g_start.tv_sec;
  remove_old_files();
  if (file_size(kLog) > kMaxLog)
    trim_locked(kTrimTo);
  const bool unclosed = file_size(kOpenMark) >= 0;
  char line[256];
  size_t h;
  int n;
  usb_check_locked(); /* first: the crash mark goes to the stick too */
  /* the log's newest line before anything of this start is written */
  const std::string last = unclosed ? log_last_time() : std::string();
  if (unclosed) {
    /* the PS5 started after that session's last line: it was switched off
       or restarted (rest mode keeps the ShellUI, so no new session), not a
       crash of the ShellUI */
    timespec up = {};
    clock_gettime(CLOCK_MONOTONIC, &up);
    const long long boot = (long long)g_start.tv_sec - (long long)up.tv_sec;
    const long long when = line_epoch(last);
    if (when > 0 && when + 5 < boot) {
      const time_t bt = (time_t)boot;
      struct tm b;
      gmtime_r(&bt, &b);
      h = line_head(line, sizeof(line), 'W');
      n = snprintf(line + h, sizeof(line) - h,
                   "==== previous session had no clean end: the PS5 was switched off or "
                   "restarted after it (its last line %.19s, PS5 started %04d-%02d-%02d "
                   "%02d:%02d:%02d) ====\n",
                   last.c_str(), b.tm_year + 1900, b.tm_mon + 1, b.tm_mday, b.tm_hour, b.tm_min,
                   b.tm_sec);
    } else {
      h = line_head(line, sizeof(line), 'E');
      n = snprintf(line + h, sizeof(line) - h,
                   "==== previous session CRASHED (no clean end, and the PS5 kept running: "
                   "the ShellUI went down) ====\n");
    }
    if (n > 0)
      append_locked(line, h + (size_t)n, true);
    paste_recorder_locked(last);
  }
  box_open_locked();
  /* an empty line before the mark: sessions are easy to see */
  if (file_size(kLog) > 0)
    append_locked("\n", 1, false);
  h = line_head(line, sizeof(line), 'I');
  n = snprintf(line + h, sizeof(line) - h, "%s (ShellUI pid %d) ====\n", kStartMark,
               (int)getpid());
  if (n > 0)
    append_locked(line, h + (size_t)n, true);
  const int mark = open(kOpenMark, O_WRONLY | O_CREAT | O_TRUNC, 0666);
  if (mark >= 0)
    close(mark);
}

} // namespace

void zt_log(const char *fmt, ...) {
  va_list ap;
  va_start(ap, fmt);
  vlog(0, fmt, ap);
  va_end(ap);
}

void zt_logl(char level, const char *fmt, ...) {
  va_list ap;
  va_start(ap, fmt);
  vlog(level, fmt, ap);
  va_end(ap);
}

void zt_log_boot(const char *step, int alive) {
#if defined(ZHITHEMES) && ZHITHEMES
  char line[256];
  std::lock_guard<std::mutex> guard(g_lock);
  open_session_locked();
  const size_t h = line_head(line, sizeof(line), 'I');
  const int n = alive > 0 ? snprintf(line + h, sizeof(line) - h,
                                     "[boot] alive %d s (last step: %s)\n", alive, step)
                          : snprintf(line + h, sizeof(line) - h, "[boot] %s\n", step);
  /* fsync: a start that takes the whole console down (a kernel panic)
     keeps only what reached the disk */
  if (n > 0)
    append_locked(line, std::min(h + (size_t)n, sizeof(line) - 1), true);
#else
  (void)step;
  (void)alive;
#endif
}

void zt_log_session_start(const char *fw_text, unsigned fw_hex) {
  {
    std::lock_guard<std::mutex> guard(g_lock);
    open_session_locked();
    /* "9.60" from the version number (0x09600004 -> 9.60); the system's
       text (" 9.600.004", a fixed 0x1C-byte field) only when it is 0 */
    g_fw_hex = fw_hex;
    if (fw_hex >> 16) {
      char buf[16];
      snprintf(buf, sizeof(buf), "%x.%02x", (fw_hex >> 24) & 0xff, (fw_hex >> 16) & 0xff);
      g_fw = buf;
    } else {
      g_fw = fw_text ? std::string(fw_text, strnlen(fw_text, 0x1C)) : "";
      while (!g_fw.empty() && (g_fw.back() == ' ' || g_fw.back() == 0))
        g_fw.pop_back();
      while (!g_fw.empty() && g_fw.front() == ' ')
        g_fw.erase(0, 1);
    }
    read_debug_flag();
  }
  timespec up = {};
  clock_gettime(CLOCK_MONOTONIC, &up);
  const long mins = (long)(up.tv_sec / 60);
  /* the theme in use: the module's own name of it is read later (storage
     start, "storage: active theme ..."), so here the file it comes from */
  std::string theme;
  {
    char tb[64] = {};
    const int tf = open(ZT_ACTIVE_FILE, O_RDONLY);
    if (tf >= 0) {
      const ssize_t n = read(tf, tb, sizeof(tb) - 1);
      close(tf);
      if (n > 0)
        theme.assign(tb, (size_t)n);
    }
    while (!theme.empty() && (theme.back() == '\n' || theme.back() == '\r' || theme.back() == ' '))
      theme.pop_back();
    if (theme.empty())
      theme = zt_theme_name();
  }
  zt_logl('I', "==== %s%s %s (build %d, %s %s) by %s ====", ZT_NAME, ZT_EDITION, ZT_VERSION,
          ZT_BUILD, __DATE__, __TIME__, ZT_AUTHOR);
  /* the injection number is in the payload's "injection N into this
     ShellUI" line just after: it counts it once the injection is done, so
     inject_count here may still hold the one before */
  zt_logl('I', "PS5: firmware %s (0x%08x) | ShellUI pid %d | PS5 on for %ld h %02ld min",
          g_fw.empty() ? "unknown" : g_fw.c_str(), g_fw_hex, (int)getpid(), mins / 60, mins % 60);
  zt_logl('I', "theme: %s | debug mode: %s | times are UTC, +seconds since this start; "
               "levels E error, W warning, A user action, I info, D debug, H health",
          theme.empty() ? "(none: PS5 default)" : theme.c_str(),
          ZT_DIAG ? "on (diagnostic build: everything is logged)"
                  : g_debug == 2 ? "on (+ Settings/Trophies map)" : g_debug == 1 ? "on" : "off");
}

void zt_log_flush_repeats() {
  std::lock_guard<std::mutex> guard(g_lock);
  flush_repeats_locked();
}

namespace {
std::atomic<int> g_reloads{0};
}

namespace {
/* the last Home reload still waiting for theme.js in the Home: its number
   (0 = none waiting) and when (ms, monotonic) */
std::atomic<int> g_home_wait_reload{0};
std::atomic<long long> g_home_wait_since{0};
std::atomic<int> g_home_stuck_logged{0};
long long home_watch_ms() {
  struct timespec ts;
  clock_gettime(CLOCK_MONOTONIC, &ts);
  return (long long)ts.tv_sec * 1000 + ts.tv_nsec / 1000000;
}
}

void zt_log_reload_done() {
  const int n = g_reloads.fetch_add(1) + 1;
  zt_logl('I', "reload: Home reloaded (%d in this session)", n);
  /* a reload while one is still waiting keeps the older start time: the
     Home has not run theme.js since then */
  if (!g_home_wait_reload.load())
    g_home_wait_since.store(home_watch_ms());
  g_home_wait_reload.store(n);
}

void zt_log_home_started() {
  const int waited = g_home_wait_reload.exchange(0);
  if (waited && g_home_stuck_logged.load()) {
    zt_logl('I', "reload: the Home started again (reload %d)", waited);
    g_home_stuck_logged.store(0);
  }
}

void zt_log_home_watch() {
  const int n = g_home_wait_reload.load();
  if (!n || g_home_stuck_logged.load())
    return;
  const long long waited = home_watch_ms() - g_home_wait_since.load();
  /* the first reload of a session: a ShellUI that has just started (after a
     crash or at boot) runs the Home only when the user is in (4.03: 38 s
     after the injection), so it gets longer */
  if (waited < (n == 1 ? 90000 : 15000))
    return;
  g_home_stuck_logged.store(1);
  zt_logl('W', "reload: the Home did not start after reload %d (no Home bundle for %lld s); "
               "if only the background shows and the PS button works, its JS thread is stuck: "
               "put the PS5 in rest mode or restart it", n, waited / 1000);
}

int zt_log_reloads() { return g_reloads.load(); }

void zt_log_session_end() {
  zt_log_flush_repeats();
  zt_logl('I', "==== end (clean) ====");
  {
    /* the ring goes with this module (a newer one maps its own): nothing
       left in ShellUI after /quit */
    std::lock_guard<std::mutex> guard(g_lock);
    if (g_box) {
      msync(g_box, kBoxHead + kBoxRing, MS_SYNC);
      munmap(g_box, kBoxHead + kBoxRing);
      g_box = nullptr;
    }
    if (g_box_fd >= 0)
      close(g_box_fd);
    g_box_fd = -1;
  }
  unlink(kOpenMark);
}

bool zt_debug_on() {
  if (g_debug < 0)
    read_debug_flag();
  return g_debug > 0;
}

bool zt_debug_sys() {
  if (g_debug < 0)
    read_debug_flag();
  return g_debug == 2;
}

std::string zt_debug_set(bool on, bool sys) {
  sys = on; /* debug mode = also the Settings/Trophies map */
  if (on) {
    ensure_dir();
    const int fd = open(kDebugFlag, O_WRONLY | O_CREAT | O_TRUNC, 0666);
    if (fd >= 0) {
      const char *text = sys ? "1 sys\n" : "1\n";
      (void)!write(fd, text, strlen(text));
      close(fd);
    }
    g_debug = sys ? 2 : 1;
    zt_logl('A', "debug mode: on%s", sys ? " (+ Settings/Trophies map)" : "");
    return "";
  }
  if (zt_debug_on())
    zt_logl('A', "debug mode: off");
  unlink(kDebugFlag);
  g_debug = ZT_DIAG ? 2 : 0;
  return "";
}

const std::string &zt_fw_text() { return g_fw; }

std::string zt_sysinfo_json() {
  char buf[64];
  snprintf(buf, sizeof(buf), "0x%08x", g_fw_hex);
  return std::string("{\"name\":") + json_text(ZT_NAME) + ",\"version\":" + json_text(ZT_VERSION) +
         ",\"build\":" + std::to_string(ZT_BUILD) + ",\"author\":" + json_text(ZT_AUTHOR) +
         ",\"home\":" + json_text(ZT_HOME) + ",\"kofi\":" + json_text(ZT_KOFI) +
         ",\"fw\":" + json_text(g_fw) + ",\"fwHex\":" + json_text(buf) +
         ",\"debug\":" + (zt_debug_on() ? "true" : "false") +
         ",\"sys\":" + (zt_debug_sys() ? "true" : "false") +
         ",\"started\":" + std::to_string((long long)g_started) + "}";
}

std::string zt_log_list_json() {
  struct Item {
    std::string name;
    long long size, time;
  };
  std::vector<Item> items;
  if (DIR *d = opendir(kLogDir)) {
    while (dirent *e = readdir(d)) {
      const std::string n = e->d_name;
      if (n.size() < 5 || (n.compare(n.size() - 4, 4, ".log") != 0 &&
                           n.compare(n.size() - 4, 4, ".txt") != 0))
        continue;
      struct stat st;
      if (stat((std::string(kLogDir) + "/" + n).c_str(), &st) != 0)
        continue;
      items.push_back({n, (long long)st.st_size, (long long)st.st_mtime});
    }
    closedir(d);
  }
  std::sort(items.begin(), items.end(), [](const Item &a, const Item &b) { return a.time > b.time; });
  std::string out = "[";
  for (const Item &i : items)
    out += std::string(out.size() > 1 ? "," : "") + "{\"name\":" + json_text(i.name) +
           ",\"size\":" + std::to_string(i.size) + ",\"time\":" + std::to_string(i.time) + "}";
  return out + "]";
}

std::string zt_log_path(const std::string &name) {
  if (name.empty() || name[0] == '.' || name.size() > 80)
    return "";
  for (char c : name)
    if (!isalnum((unsigned char)c) && c != '-' && c != '_' && c != '.')
      return "";
  const std::string path = std::string(kLogDir) + "/" + name;
  return file_size(path.c_str()) >= 0 ? path : "";
}

void zt_log_clear() {
  {
    std::lock_guard<std::mutex> guard(g_lock);
    g_repeats = 0;
    g_prev.clear();
    const int fd = open(kLog, O_WRONLY | O_TRUNC);
    if (fd >= 0)
      close(fd);
    char line[160];
    const size_t h = line_head(line, sizeof(line), 'I');
    const int n = snprintf(line + h, sizeof(line) - h, "%s (ShellUI pid %d, log cleared) ====\n",
                           kStartMark, (int)getpid());
    if (n > 0)
      append_locked(line, h + (size_t)n, true);
  }
  zt_logl('A', "log cleared in the editor");
}

void zt_log_box_sync() {
  /* outside the lock: the JS thread may log while the pages are written
     (the mapping stays for the whole session) */
  char *box;
  int fd;
  {
    std::lock_guard<std::mutex> guard(g_lock);
    box = g_box;
    fd = g_box_fd;
  }
  if (box)
    msync(box, kBoxHead + kBoxRing, MS_SYNC);
  else if (fd >= 0)
    fsync(fd);
}

void zt_log_usb_check() {
  std::lock_guard<std::mutex> guard(g_lock);
  const std::string before = g_usb_log;
  usb_check_locked();
  if (g_usb_log != before && !g_usb_log.empty()) {
    char line[200];
    const size_t h = line_head(line, sizeof(line), 'I');
    const int n = snprintf(line + h, sizeof(line) - h,
                           "==== USB stick: E/W/A lines also go to %s ====\n", g_usb_log.c_str());
    if (n > 0)
      append_locked(line, h + (size_t)n, false);
  }
}

std::string zt_log_report(int sessions, size_t max_log) {
  /* the newest part of the log (sessions are found in it) */
  constexpr size_t kRead = 8u << 20, kMaxSummary = 300u << 10;
  std::string text;
  {
    std::lock_guard<std::mutex> guard(g_lock);
    flush_repeats_locked();
    const int fd = open(kLog, O_RDONLY);
    struct stat st;
    if (fd >= 0 && fstat(fd, &st) == 0 && st.st_size > 0) {
      const off_t from = st.st_size > (off_t)kRead ? st.st_size - (off_t)kRead : 0;
      text.resize((size_t)(st.st_size - from));
      if (pread(fd, &text[0], text.size(), from) != (ssize_t)text.size())
        text.clear();
      if (from > 0)
        text.erase(0, text.find('\n') + 1);
    }
    if (fd >= 0)
      close(fd);
  }
  /* from the start line of the sessions-th newest session */
  std::vector<size_t> starts;
  for (size_t at = 0; at < text.size();) {
    size_t end = text.find('\n', at);
    if (end == std::string::npos)
      end = text.size();
    if (contains(text.data() + at, end - at, kStartMark))
      starts.push_back(at);
    at = end + 1;
  }
  size_t from = 0;
  if ((int)starts.size() > sessions)
    from = starts[starts.size() - (size_t)sessions];
  /* a "session" also takes the lines just before its start: the payload's
     injection, the mark of the session before (CRASHED / switched off) and
     the flight recorder pasted after it */
  for (bool in_box = false; from > 0;) {
    const size_t end = from - 1; /* the '\n' of the line before */
    const size_t pos = end == 0 ? std::string::npos : text.rfind('\n', end - 1);
    const size_t at = pos == std::string::npos ? 0 : pos + 1;
    const char *l = text.data() + at;
    const size_t n = end - at;
    if (in_box) {
      if (contains(l, n, "---- flight recorder of that session"))
        in_box = false;
    } else if (contains(l, n, "---- end of the flight recorder")) {
      in_box = true;
    } else if (!(n == 0 || contains(l, n, "[payload]") || contains(l, n, "==== previous session"))) {
      break;
    }
    from = at;
  }
  text.erase(0, from);
  std::string summary;
  for (size_t at = 0; at < text.size();) {
    size_t end = text.find('\n', at);
    if (end == std::string::npos)
      end = text.size();
    const char *l = text.data() + at;
    const size_t n = end - at;
    const char lv = line_level(l, n);
    if (lv == 'E' || lv == 'W' || lv == 'A' || contains(l, n, "====") ||
        contains(l, n, "[payload]"))
      summary.append(l, n).append("\n");
    at = end + 1;
  }
  if (summary.size() > kMaxSummary)
    summary.erase(0, summary.find('\n', summary.size() - kMaxSummary) + 1);
  if (text.size() > max_log)
    text.erase(0, text.find('\n', text.size() - max_log) + 1);
  char head[160];
  snprintf(head, sizeof(head), "== The last %d sessions: errors, warnings, actions, starts ==\n",
           sessions);
  return std::string(head) + summary + "\n== The log of the last " + std::to_string(sessions) +
         " sessions (newest " + std::to_string(max_log >> 20) + " MB at most) ==\n" + text;
}

std::string zt_log_recorder_tail(size_t max_bytes) {
  /* this session's ring (read() sees what was memcpy'd into the mapping):
     its D lines (keys, testIDs seen for the first time...), the rest is in
     the log already */
  const std::string ring = box_read_old();
  std::string keep;
  for (size_t at = 0; at < ring.size();) {
    size_t end = ring.find('\n', at);
    if (end == std::string::npos)
      break;
    if (line_level(ring.data() + at, end - at) == 'D')
      keep.append(ring, at, end - at + 1);
    at = end + 1;
  }
  if (keep.size() > max_bytes)
    keep.erase(0, keep.find('\n', keep.size() - max_bytes) + 1);
  return keep;
}
