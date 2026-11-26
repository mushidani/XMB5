/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.  */

#pragma once

/*
 * XMB5 localhost-only service on 127.0.0.1:4444, with no editor website;
 * all non-XMB request paths are rejected.
 *
 * Disable (must recompile shellui):
 *   -D SHELLUI_THEME_WEB=0
 */
#ifndef SHELLUI_THEME_WEB
#define SHELLUI_THEME_WEB 1
#endif

#include <string>

void theme_web_start();
/* the video server (127.0.0.1:4445): connections open now, answered and
   refused since the start */
void zt_video_counts(int *open, unsigned *accepted, unsigned *refused);
bool theme_set_field(const std::string &key, const std::string &value);
/* the same in another theme file */
bool theme_set_field_in(const std::string &file, const std::string &key, const std::string &value);
/* `key: true|false` in the active theme (no quotes, unlike theme_set_field) */
bool theme_set_bool(const std::string &key, bool on);
