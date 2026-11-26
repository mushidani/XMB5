/* ZhiThemes ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â PS5 Home theme engine.
   Copyright (C) 2026 Zhi (ZhiThemes author)

This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version. See LICENSE and NOTICE (additional term under section 7(b):
keep the author attribution).  */

/* Name, author and version shown by the payload, the editor and the logs.
   One place to change them. */
#pragma once

#define ZT_NAME "XMB5"
#define ZT_AUTHOR "mushidani - based on ZhiThemes by Zhi"   /* keep the original author attribution (GPL-3.0 section 7(b)) */
#define ZT_VERSION "1.0-beta"
#define ZT_BUILD 451
#define ZT_STR2(x) #x
#define ZT_STR(x) ZT_STR2(x)
#define ZT_BUILD_TEXT ZT_STR(ZT_BUILD)
/* the diagnostic build (ZhiThemes-diag.elf, CMake ZT_DIAG=ON), only for
   studying a new firmware: the normal build + debug mode always on (so the
   D lines also go to the log, not only to the flight recorder), the screen
   dump and the decrypted app bundles always (Dumps/<fw>/), fine start-up
   steps + heartbeat ([boot]), ShellUI thread states and the process list
   ([payload]), ShellUI's modules. All lines in the same zhithemes.log. */
#ifndef ZT_DIAG
#define ZT_DIAG 0
#endif
#define ZT_EDITION (ZT_DIAG ? " diag" : "")
/* test builds of the updater only: the module takes ShellUI down 25 s
   after it starts (to test going back to the previous version). Always 0
   in a real build. */
#ifndef ZT_CRASH_TEST
#define ZT_CRASH_TEST 0
#endif
/* links shown in the editor's About tab; empty = "coming soon" */
#define ZT_HOME "https://github.com/mushidani/XMB5"
#define ZT_KOFI "https://ko-fi.com/zhi"
