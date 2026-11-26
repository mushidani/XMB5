#!/usr/bin/env python3
"""V83.13: source integrity and HOST-side native font-override tests.

The test harness compiles the ACTUAL font helper functions extracted from
homeui_js_inject.cpp with small mocks. It does not simulate PS5's runtime.
"""
from pathlib import Path
import shutil
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
NATIVE = ROOT / "src/source/shellui/src/homeui_js_inject.cpp"
MEDIA = ROOT / "src/source/shellui/src/zt_xmb_media.cpp"
TEMPLATE = ROOT / "xmb_patch/tests/check_v8313_font_template.cpp"

def between(s, a, b):
    assert a in s and b in s, f"Missing native source marker {a!r}"
    return s.split(a, 1)[1].split(b, 1)[0]

src = NATIVE.read_text(encoding="utf-8")
media = MEDIA.read_text(encoding="utf-8")
required = (
    "XMB5 FONT: Rodin Regular for all SST weights",
    "zt_theme_dir_of(\"Default\", \"fonts\")",
    "ps3-rodin-regular.ttf",
    "zt_xmb_defaults_install();",
)
for fragment in required:
    assert fragment in src, f"V83.13 native marker absent: {fragment}"
assert 'const std::string fonts = std::string(ZT_THEMES) + "/Default/fonts";' in media
assert src.index("zt_xmb_defaults_install();") < src.index("g_executor_class = mono_class_from_name(")
assert "ps3-rodin-light.ttf" not in src and "ps3-rodin-bold.ttf" not in src
assert "zt_xmb_font_light" not in media and "zt_xmb_font_bold" not in media
assert "XMB5 FIRST_RUN" in src
assert "theme_request_full_unload()" in src
print("PASS V83.14 native source, V83.8 installer, V83.7 first-run/unload retained")

style = "std::string style_sibling(const std::string &path, int style) {" + between(
    src, "std::string style_sibling(const std::string &path, int style) {",
    "/*\n * elementFont:"
)
apply = "void apply_system_font(const std::string &script) {" + between(
    src, "void apply_system_font(const std::string &script) {",
    "/* UI thread: every label lays its text out again"
)
variant = "std::string theme_system_font(const char *sst_name) {" + between(
    src, "std::string theme_system_font(const char *sst_name) {",
    "/* prx.cpp has the real one"
)
harness = TEMPLATE.read_text(encoding="utf-8")
harness = harness.replace("__STYLE__", style).replace("__PROD__", apply).replace("__VARIANT__", variant)
compiler = shutil.which("g++") or shutil.which("clang++")
if not compiler:
    print("SKIP host C++ test: g++/clang++ unavailable; static checks passed")
else:
    with tempfile.TemporaryDirectory(prefix="xmb-v8313-") as d:
        test_cpp = Path(d)/"test.cpp"
        test_bin = Path(d)/"test"
        test_cpp.write_text(harness, encoding="utf-8")
        subprocess.run([compiler, "-std=c++20", "-Wall", "-Wextra", "-Werror", "-O2",
                        str(test_cpp), "-o", str(test_bin)], check=True)
        subprocess.run([str(test_bin)], check=True)
print("PASS V83.14 verification complete (PS5 hardware not tested)")
