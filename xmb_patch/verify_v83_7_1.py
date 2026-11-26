#!/usr/bin/env python3
"""Checks full-unload symbols after restoring the original V82 UI-thread implementation."""
from pathlib import Path
root=Path(__file__).resolve().parents[1]
src=(root/'src/source/shellui/src/homeui_js_inject.cpp').read_text()
h=(root/'src/source/shellui/include/homeui_js_inject.hpp').read_text()
web=(root/'src/source/shellui/src/theme_web.cpp').read_text()
checks={
 'V83.7 first-run bootstrap retained':'XMB5 FIRST_RUN: installed embedded Default.ztheme' in src,
 'full unload request defined':'void theme_request_full_unload()' in src and 'void theme_request_full_unload();' in h,
 'full unload completion defined':'bool theme_full_unload_done()' in src and 'bool theme_full_unload_done();' in h,
 'UI thread runs theme_unload and restores Sony Home':'const int reverted=theme_unload();' in src and 'ReloadRNPSApp("NPXS40002")' in src,
 'worker waits for acknowledgment':'theme_request_full_unload();' in web and 'theme_full_unload_done()' in web,
 'disabled-mode stubs exist':src.count('void theme_request_full_unload()')==2 and src.count('bool theme_full_unload_done()')==2,
}
for label,ok in checks.items(): print(('PASS' if ok else 'FAIL')+': '+label)
if not all(checks.values()):raise SystemExit(1)
