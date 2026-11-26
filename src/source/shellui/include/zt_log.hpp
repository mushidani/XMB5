/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.  */

#pragma once

#include <string>

/*
 * One log file: /data/ZhiThemes/Logs/zhithemes.log (also over FTP/USB, for
 * users who cannot open the editor). Every session of ShellUI goes in it,
 * one after the other:
 *   ==== session start (ShellUI pid N) ====     first line of a start
 *   [boot] ...                                  start-up steps of the module
 *   ==== ZhiThemes ... ====  + header lines     version, firmware, theme,
 *                                               injection number, uptime
 *   ...                                         the session
 *   ==== end (clean) ====                       POST /quit (newer ZhiThemes)
 * A session with no clean end gets "previous session CRASHED" (E) at the
 * next start, or, when the PS5 started after its last line (switched off,
 * restarted), "previous session had no clean end: the PS5 was switched off
 * or restarted" (W). The payload (injector/watcher)
 * writes its lines into the same file with "[payload]".
 *
 * Each line: UTC time, +seconds since this start, a level letter, the text.
 *   E error  W warning  A user action  I info  D debug (in the log with
 *   debug mode on; else only in the flight recorder)
 *   H health (once a minute)
 * E/W/A, [boot] and [payload] lines are flushed to the disk at once
 * (fsync): a crash of the whole console keeps them. Lines up to 4 KB.
 * Past 16 MB the oldest whole sessions are cut at the next start.
 * The state files (debug.on, session.open, inject_count) are beside Logs/.
 */

/* One line; the level is guessed from the text (threw -> E, failed /
   cannot / refused / missing -> W, otherwise I). */
void zt_log(const char *fmt, ...) __attribute__((format(printf, 1, 2)));
/* One line with its level: 'E' 'W' 'A' 'I' 'D' 'H' (0 = guess). */
void zt_logl(char level, const char *fmt, ...) __attribute__((format(printf, 2, 3)));

/* "[boot] <step>" (alive > 0: heartbeat "alive N s (last step: ...)").
   The first call of a ShellUI opens the session: start line, the crash
   mark of the session before, the cut at 16 MB. Safe before main(). */
void zt_log_boot(const char *step, int alive);

/* Start of the module: the header (version, firmware, theme, ...). */
void zt_log_session_start(const char *fw_text, unsigned fw_hex);
/* Clean end (POST /quit, a newer ZhiThemes replaces this one). */
void zt_log_session_end();

/* Writes the pending "(the line before x N more)" now (health line). */
void zt_log_flush_repeats();
/* Flight recorder (/data/ZhiThemes/.blackbox, 2 MB ring, mmap): every
   line, and the D lines that do not go to the log while debug mode is off
   (max 200 a second). After a session with no clean end, its lines that
   are not in the log are pasted into it at the next start. Sync to the
   disk: every 2 s (module thread) and at each E/W. */
void zt_log_box_sync();
/* This session's D lines of the flight recorder (L1/R1 keys, "focus <id>"
   of the row's tiles, new testIDs...), newest max_bytes: for "Report a
   problem". */
std::string zt_log_recorder_tail(size_t max_bytes);
/* Looks for a USB stick (start, once a minute): while there is one, the
   E/W/A lines and the session marks also go to /usbN/ZhiThemes-log.txt. */
void zt_log_usb_check();
/* For "Report a problem": a summary (E/W/A, starts, payload) and the log
   of the last `sessions` sessions (newest max_log bytes). */
std::string zt_log_report(int sessions, size_t max_log);
/* The Home was reloaded (UI thread): counted and logged. */
void zt_log_reload_done();
int zt_log_reloads();
/* Watch on the Home after a reload: the Home's bundle ran again (RunScript)
   -> zt_log_home_started; zt_log_home_watch (once a second) writes a W line
   when a reload got no Home bundle within 15 s, 90 s for the session's first
   one (its JS thread stuck: only the background and the PS button work). */
void zt_log_home_started();
void zt_log_home_watch();

/* Debug mode (editor's Logs tab). */
bool zt_debug_on();
bool zt_debug_sys();
/* Turns it on/off (the lines stay in zhithemes.log); always returns "". */
std::string zt_debug_set(bool on, bool sys);

/* {"name":..,"version":..,"build":..,"author":..,"home":..,"kofi":..,"fw":..,
    "fwHex":..,"debug":..,"sys":..,"started":..} */
std::string zt_sysinfo_json();
/* "9.60" style firmware text, empty when unknown */
const std::string &zt_fw_text();

/* Files of logs/: JSON [{"name":..,"size":..,"time":..}], newest first. */
std::string zt_log_list_json();
/* A log file by name (only names of logs/, no path); empty when missing. */
std::string zt_log_path(const std::string &name);
/* Empties zhithemes.log (editor's Clear) and starts it with a note. */
void zt_log_clear();
