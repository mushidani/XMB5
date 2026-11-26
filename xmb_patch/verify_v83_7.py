#!/usr/bin/env python3
"""Check V83.7 first-run bootstrap wiring; native PS5 compilation still required."""
from pathlib import Path
p=Path(__file__).resolve().parents[1]/"src/source/shellui/src/homeui_js_inject.cpp"
s=p.read_text()
checks={
 "first-run bootstrap": "XMB5 FIRST_RUN: installed embedded Default.ztheme" in s,
 "only XMB5 auto-bootstraps": "#if defined(ZHITHEMES) && ZHITHEMES\n  if (data.empty())" in s,
 "does not overwrite existing theme": "stat(theme_file.c_str(), &existing) == 0" in s,
 "does not override another theme": "if (another_theme)" in s,
 "atomic file install": "rename(tmp.c_str(), theme_file.c_str())" in s,
 "the normal startup calls bootstrap": "  write_default_script();" in s,
}
for name,ok in checks.items(): print(("PASS" if ok else "FAIL")+": "+name)
if not all(checks.values()): raise SystemExit(1)
