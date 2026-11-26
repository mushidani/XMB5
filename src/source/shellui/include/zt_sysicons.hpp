/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.  */

#pragma once

#include <string>

/* A system icon (the IconPS ids, e.g. "game", "music_and_video") read from
   the console's own /system_ex/vsh_asset/Sce.PlayStation.PUI_UI3.rco, for
   the editor's icon picker: its picture (SVG or PNG) and the content type.
   False when the name is not there or the file cannot be read. Nothing of
   the console's files is shipped with ZhiThemes. */
bool zt_sysicon(const std::string &name, std::string &data, std::string &type);
