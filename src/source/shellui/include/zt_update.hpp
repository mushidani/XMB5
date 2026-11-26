/* ZhiThemes — PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE.  */

/* Updates of ZhiThemes itself (zt_update.cpp): the check on GitHub, the
   download and the start of the new version. */
#pragma once

#include <string>

/* the update thread: first check ~45 s after the start, then once a day
   (unless auto_check=off in Update/state.txt) */
void zt_update_start();
/* the state for the menu and the editor:
   {"current","build","state":"idle|checking|downloading|applying|error","error",
    "progress","auto","checkedAgo","available","latest","latestBuild","notes",
    "size","crashedBefore","restart","restartVersion","restartPldmgr",
    "restartWhere","rolledBack","rolledBackTo","loads","loadLimit"} */
std::string zt_update_json();
/* check | install | retry | dismiss | auto1 | auto0; "" or the reason */
std::string zt_update_cmd(const std::string &cmd);
