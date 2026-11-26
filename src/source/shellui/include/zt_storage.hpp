/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.  */

#pragma once

#include "zt_paths.hpp"

#include <stdint.h>

#include <functional>
#include <string>
#include <vector>

/* one folder per kind of file; the user's own files under
   Assets/, the theme's own files (wallpapers, icons, fonts) under
   Themes/<Name>/ next to its theme.json */
#define ZT_FOLDERS ZT_ASSETS "/folders"            /* uploaded folder icons */
#define ZT_CUSTOMTILE ZT_ASSETS "/customtile"      /* <titleId>_<format>_<n>.png (+ .mp4), logos */
#define ZT_CUSTOMBG ZT_ASSETS "/custombg"          /* <titleId>_16x9_<n>.png (+ .mp4) */
#define ZT_AVATARS ZT_ASSETS "/avatars"            /* avatar pictures */
#define ZT_CACHE ZT_ASSETS "/cache"                /* made by ZhiThemes; can be deleted any time */
#define ZT_CACHE_MOSAICS ZT_CACHE "/mosaics"       /* folder mosaics (zt_folder_*) */
#define ZT_CACHE_FOLDERBG ZT_CACHE "/folderbg"     /* folder backgrounds (zt_fbg_*) */
#define ZT_CACHE_ICONS ZT_CACHE "/icons"           /* tall system tile icons (zt_sys_*) */
#define ZT_PARTICLES ZT_ASSETS "/XMBUI"         /* XMB5 active UI images (migrated from old particles folder) */
#define ZT_LEGACY ZT_ASSETS "/backgrounds"         /* in older versions; read when a file is still there */
#define ZT_SGDB_KEY_FILE ZT_DIR "/steamgrid.key"   /* the SteamGridDB API key, never in a theme */
#define ZT_ACTIVE_FILE ZT_DIR "/active_theme.txt"  /* the name of the theme in use */
#define ZT_FAVORITES_FILE ZT_DIR "/favorites.txt"  /* favourite games, console wide (not in a theme) */
#define ZT_LANG_FILE ZT_DIR "/lang.txt"            /* the PS5's own texts in its language (from the Home) */
#define ZT_THEME_BACKUPS ZT_THEMES "/.backup"      /* a copy of each theme at every start */

/* moves the files of the layout in older versions (everything in
   /data/ZhiThemes) to Assets/, Themes/<Name>/ and reads the active theme.
   Call first, before anything reads the theme. */
void zt_storage_migrate();

/* Makes the folders and, once, moves the files of backgrounds/ (and the
   folder icons of customtile/) to their folder by kind; the SteamGridDB key
   of an older theme goes to steamgrid.key. Call before the theme runs. */
void zt_storage_setup();

/* writes the built-in particle textures (AniketosHEN's, embedded) to
   Assets/XMBUI/ when one is missing or not the same size. */
void zt_particles_install();

/* ---- themes ---- */
/* the theme in use ("Default" when none) */
std::string zt_theme_name();
/* Themes/<name>/theme.json (the active one when name is empty) */
std::string zt_theme_file(const std::string &name = std::string());

/* ---- theme.json (zt_theme_json.cpp) ----
   {"format":2,"name","author","description","settings":{key: value}}.
   Whatever reads a theme works on THEME text ("var THEME = {\n    key:
   value,\n  };", the form of the older theme files): read makes it from
   theme.json, write keeps the plain values of such a text (numbers,
   true/false, 'text') in theme.json. */
struct ZtThemeInfo {
  std::string name, author, description;
};
/* the theme's values as THEME text; "" when missing or not a theme.json */
std::string zt_theme_read(const std::string &name = std::string());
std::string zt_theme_read_path(const std::string &file);
/* the values of text (THEME text, the editor's theme.js, an older theme
   file) become the theme's settings; name/author/description stay */
bool zt_theme_write(const std::string &name, const std::string &text);
bool zt_theme_write_path(const std::string &file, const std::string &text);
/* the same with new name/author/description */
bool zt_theme_save(const std::string &name, const ZtThemeInfo &info, const std::string &text);
/* name/author/description (name = the folder's name when theme.json has none) */
ZtThemeInfo zt_theme_info(const std::string &name);
bool zt_theme_info_set(const std::string &name, const ZtThemeInfo &info);
/* theme.json text from THEME text: older theme files translated;
   *values = how many kept, *dropped = how many were not plain values */
std::string zt_theme_json_make(const std::string &text, const ZtThemeInfo &info, int *values = nullptr,
                               int *dropped = nullptr);
/* a theme.json's info and values as THEME text; false when it is not one */
bool zt_theme_json_parse(const std::string &json, ZtThemeInfo *info, std::string *text, int *dropped = nullptr);
/* "text" with JSON escapes */
std::string zt_json_quote(const std::string &s);
/* Themes/<active>/<kind> (wallpapers, icons, fonts) */
std::string zt_theme_dir(const char *kind);
/* the folder of one kind of a theme (the active one when name is empty) */
std::string zt_theme_dir_of(const std::string &name, const char *kind);
/* a theme name: letters, digits, '.', '-', '_' (no spaces), 1-40, not ".x" */
bool zt_theme_name_ok(const std::string &name);
/* {"active":"X","themes":[{"name":"A","files":3,"bytes":123}]} */
std::string zt_themes_json();
/* these return "" when done, else the reason */
std::string zt_theme_use(const std::string &name);
/* from = a theme to copy (its files linked), "" = the factory theme */
std::string zt_theme_new(const std::string &name, const std::string &from, bool *created = nullptr);
std::string zt_theme_rename(const std::string &name, const std::string &to);
std::string zt_theme_delete(const std::string &name);
/* empties a theme's folder (before a pack replaces it) */
std::string zt_theme_clear(const std::string &name);
/* deletes the files listed in `list` (lines "<wallpapers|icons|fonts>/<file>")
   from that theme's folder; *removed = how many */
std::string zt_theme_clean(const std::string &name, const std::string &list, int *removed);
/* after a file arrived in a theme folder: when another theme has the same
   file (same size and bytes), this one becomes a hard link to it (no space
   used twice; the space comes back when the last theme with it goes) */
void zt_dedupe(const std::string &file);
/* the personal values (folders, foldersIcon, customTileChoice,
   customBgChoice) of a theme text written into another theme's theme.json:
   they follow the user from theme to theme */
void zt_carry_personal(const std::string &from_text, const std::string &to_file);

/* The files still in backgrounds/ as a JSON list (the theme looks there
   when a name is not in its new folder). */
std::string zt_legacy_js();

/* "THEME-CACHE-KEEP <mosaics|folderbg|icons>|name,name,...": the Home's
   names in use; the other files of that cache folder older than 10 min
   are deleted (they are made again when needed). */
void zt_cache_keep(const std::string &text);

/* The favourite games, console wide: title ids separated by commas
   (favorites.txt). Older themes kept them in the theme's "favorites" field:
   zt_storage_setup gathers those once. */
std::string zt_favorites();
bool zt_favorites_set(const std::string &list);

/* The PS5's language as the code of theme.js' ZT_TEXT ("en", "pt", "pt-BR",
   "ja", "zh-Hans"...), from the system setting. */
std::string zt_lang_code();
/* The PS5's own texts the Home got for that language (I18nPS): "key=text&..."
   with the texts URI-encoded (only [A-Za-z0-9%=&._~!*'()-]); "" when
   lang.txt is for another language. set = the Home's "THEME-LANG <code> <texts>". */
std::string zt_lang_texts(const std::string &code);
bool zt_lang_texts_set(const std::string &code, const std::string &texts);

/* The SteamGridDB key on the PS5 ("" = none); set "" removes it. */
std::string zt_sgdb_key();
bool zt_sgdb_key_set(const std::string &key);

/* installs the themes copied to /data/ZhiThemes/Install (.ztheme, or an
   older theme file, translated) and deletes them from there; the last one
   is used. Call after zt_storage_setup, before the theme runs. */
void zt_install_dropped();
/* the editor's Install: the file at path (sent as file_name) becomes a
   theme of its own (replace: that theme is replaced) and the theme in
   use; "" or the reason */
std::string zt_install_file(const std::string &path, const std::string &file_name, std::string *theme,
                            const std::string &replace = std::string());

/* the .ztheme of a theme (the editor's Download): plan says what goes in
   and how big the ZIP is ("" or the reason), write sends it to sink */
struct ZtPackFile {
  std::string rel, path; /* "<kind>/<file>" in the ZIP, the file on the PS5 */
  uint64_t size;
};
struct ZtPack {
  std::string theme, json;
  std::vector<ZtPackFile> files;
  uint64_t size = 0; /* the whole ZIP */
  int missing = 0;   /* files the theme names that are not on the PS5 */
};
std::string zt_theme_pack_plan(const std::string &name, ZtPack *pack);
bool zt_theme_pack_write(const ZtPack &pack, const std::function<bool(const char *, size_t)> &sink);

/* ---- the Home's Options menu > ZhiThemes ---- */
/* ZhiThemes off ("PS5 default"): /data/ZhiThemes/no_theme, or a USB stick
   with ZhiThemes/no_theme (safe mode, while it is in). The Home then runs
   only the Options menu item; the other apps stay stock. */
bool zt_stock_on();
/* writes / deletes /data/ZhiThemes/no_theme */
void zt_stock_set(bool on);
/* {"off":b,"usbOff":b,"installing":b,"list":<zt_themes_json>,
    "files":[{"path","name","from":"usb"|"install"}]} */
std::string zt_theme_menu_json();
/* switch to a theme and turn ZhiThemes on; "" when done, else the reason */
std::string zt_theme_menu_use(const std::string &name);
/* installs one file of zt_theme_menu_json's "files" in a thread (a USB file
   is kept, an Install/ file deleted); done() runs after a good install */
std::string zt_theme_menu_install(const std::string &path, void (*done)());
/* a PS5 notification "XMB5: <text>" (no [OnionHEN] prefix) */
void zt_menu_notify(const std::string &text);

/* ---- Options menu > ZhiThemes > Quick settings / Tools / About (zt_tools.cpp) ---- */
/* {"ip","port","version","fw","usb":b,"cache":"N MB","cacheFiles","dumpFiles","busy"} */
std::string zt_tools_json();
/* one of the menu's on/off fields into the active theme; "" or the reason */
std::string zt_quick_set(const std::string &key, bool on);
/* reload | cache | dumpon | backup | logs | dump | report (the last four in
   a thread, to the first USB stick; report without a stick: Logs/); "" or
   the reason */
std::string zt_tool_run(const std::string &tool, void (*reload)());
/* "Report a problem": one text with what happened, the system, the active
   theme's values and the last sessions of the log (no user name or IDs) */
std::string zt_report_text(const std::string &what, const char *from);
/* "ZhiThemes-report-<date>.txt" */
std::string zt_report_name();

/* mkdir -p of a folder under ZT_DIR */
void zt_mkdirs(const std::string &path);
