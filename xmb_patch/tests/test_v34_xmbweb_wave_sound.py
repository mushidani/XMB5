#!/usr/bin/env python3
"""V34 static checks (no console, no Node needed):
 - the xmb-web-exact renderer is inlined once, carries xmb-web's constants, and is the only drawing layer
 - the old wave code (16 frames / 12 frames / 30 strips / month gradients) is gone; the wave is xmb-web's own, as two H.264 loops
   rendered from its WebGL shader, embedded in the ELF and installed into the wallpapers folder
 - sounds: xmb-web snd_nav / snd_nav2 (back, open) embedded next to the two scroll samples, native C++ handles 4 kinds
 - categories: Music / Network / PlayStation Network / Friends are gone; Circle on the top level no longer leaves the XMB
"""
from pathlib import Path
import re, json, subprocess, shutil, tempfile, os, sys
R = Path(__file__).resolve().parents[2]
x = (R / 'xmb_patch/xmb_extension.js').read_text(encoding='utf-8')
t = (R / 'theme/theme.js').read_text(encoding='utf-8')
b = (R / 'xmb_patch/xmb_native_bundle.js').read_text(encoding='utf-8').strip()
assert t.count(x.strip()) == 1, 'theme.js must contain the extension exactly once'
assert x.count(b) == 1 and t.count(b) == 1, 'renderer bundle must be inlined exactly once (run xmb_patch/embed_native_bundle.py)'

# ---- xmb-web constants carried by the bundle
expect = {'CAT_X': 566, 'CAT_Y': 289, 'CAT_SPACING': 203, 'CAT_ICON_ACTIVE': 168, 'CAT_ICON_INACTIVE': 117,
          'ITEM_ICON_X': 566, 'ITEM_FOCUS_Y': 515, 'ITEM_SPACING': 80, 'ITEM_ICON_SIZE': 78, 'ITEM_ICON_ACTIVE': 180,
          'ITEM_TEXT_X': 683, 'ITEM_ACTIVE_PAD': 87, 'PARENT_COL_X': 316,
          'CAT_ANIM_MS': 250, 'ITEM_ANIM_MS': 200, 'SUBMENU_ANIM_MS': 250,       # V37: xmb-web's own durations; the live Animation Speed setting scales them
          'INPUT_INITIAL_DELAY_MS': 210, 'INPUT_REPEAT_MS': 105, 'INPUT_MIN_REPEAT_MS': 32}
for k, v in expect.items():
    m = re.search(r'\b%s:\s*([0-9.]+)' % k, b)
    assert m and float(m.group(1)) == v, 'bundle constant %s != %s (%s)' % (k, v, m and m.group(1))
assert re.search(r'INPUT_ACCEL_MULT:\s*1\.4\b', b)
# scroll speed: every animated node of a row is built once (memoised), not once per D-pad step
assert 'useMemo' in b and 'memo' in b and 'sigOf' in b, 'renderer must memoise rows (scroll speed)'

# ---- assets referenced by the menu data
P = R / 'theme/particles'
have = {f.stem for f in P.glob('*.png')}
names = set(re.findall(r'"(?:iconAsset|asset)":"(xmbweb_[a-z0-9_]+)"', x))
assert len(names) >= 40
missing = sorted(n for n in names if n not in have)
assert not missing, 'menu data references missing PNG assets: %s' % missing
for n in ('bg_storemain', 'bg_signup', 'bg_whatsnew', 'bg_photogallery', 'bg_storegame', 'bg_storevideo'):
    assert 'xmbweb_cinfo_' + n in have, 'hover picture missing: ' + n
for n in have:
    assert re.fullmatch(r'[a-z0-9_]+', n), 'bad embed name ' + n
for n in have:
    assert not re.match(r'(xmbweb_wave_frame_|xmb_linkev_frame_|xmb_vsh_|ps5xmb_|xmb_native_|xmb_cat_)', n), 'obsolete image still embedded: ' + n

# ---- text safety + cadence + hooks
assert not re.search(r'fontSize\s*:\s*\d', x), 'raw fontSize number in extension'
assert 'XMB_REPEAT_IV = ztXmbNative.repeatIntervals' in x
assert 'V33_XMBWEB_EXACT_RENDERER_READY' in x and "xmbDeactivate('NO_NATIVE_ANIMATED')" in x
assert 'fontSize:fontSize' in x, 'renderer must snap text to the FontSizePS table via theme fontSize()'

# ---- the old wave is gone, the xmb-web wave video is in
for tok in ('xmbweb_wave_frame_', 'xmb_linkev_frame_', 'webWaveFrame', 'shaderFrame', 'wave-window-', 'xmb_vsh_silk_', 'xmb_vsh_month_',
            'motionState', "kind:'wave-switch'", 'XMB_LINK_EV_AVAILABLE'):
    assert tok not in x, 'old wave code still present: ' + tok
assert 'PS5XMB_XMBWEB_Wave_Day.mp4' in x and 'PS5XMB_XMBWEB_Wave_Night.mp4' in x and "127.0.0.1:4445/v/" in x and 'VideoWallpaper' in x
assert '__WAVE_' not in x, 'backdrop colour placeholders must be replaced'
for k in ('day', 'night'):
    f = R / ('ps3_assets/PS5XMB_XMBWEB_Wave_%s.mp4' % k.capitalize())
    assert f.is_file() and 1_000_000 < f.stat().st_size < 20_000_000, f
    if shutil.which('ffprobe'):
        j = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=codec_name,pix_fmt,width,height,avg_frame_rate,duration',
                                                 '-of', 'json', str(f)], text=True))['streams'][0]
        assert j['codec_name'] == 'h264' and j['pix_fmt'] == 'yuv420p' and j['width'] >= 1280, j
        assert 104 < float(j['duration']) < 108, ('V35: one full xmb-web wave cycle (106.25 s) at real speed', j)
man = json.loads((R / 'ps3_assets/embedded_media_manifest.json').read_text())
for key in ('snd_cursor', 'snd_category', 'snd_decide', 'snd_cancel', 'snd_ok', 'snd_ng', 'wave_day', 'wave_night'):
    assert key in man, 'embedded media manifest lacks ' + key
asm = (R / 'src/source/shellui/src/zt_xmb_embedded_media.s').read_text()
for key in ('snd_cursor', 'snd_category', 'snd_decide', 'snd_cancel', 'snd_ok', 'snd_ng', 'wave_day', 'wave_night'):
    assert 'zt_xmb_%s_start:' % key in asm and '.incbin' in asm
cpp = (R / 'src/source/shellui/src/zt_xmb_media.cpp').read_text()
assert 'zt_xmb_wave_day_start' in cpp and 'zt_xmb_snd_decide_start' in cpp and 'xmb_install_file' in cpp
web = (R / 'src/source/shellui/src/theme_web.cpp').read_text()
assert 'kind=cursor, category, decide, cancel, ok, ng, warm or sleep' in web and 'zt_xmb_sfx_play(sfx_id)' in web
assert 'bool zt_xmb_sfx_play(int which)' in (R / 'src/source/shellui/include/zt_xmb_media.hpp').read_text()

# ---- V36 sounds: the six original PS3 XMB wavs, PCM s16le 48 kHz stereo, lifted to a -10 dBFS peak
import array
for n, mx in (('cursor', 4000), ('category_decide', 4000), ('decide', 4000), ('cancel', 4000), ('system_ok', 4000), ('system_ng', 4000)):
    d = (R / ('ps3_assets/PS3_snd_%s.s16le' % n)).read_bytes()
    assert len(d) % 4 == 0 and 1024 < len(d) < 512000, n
    a = array.array('h'); a.frombytes(d)
    assert 9000 < max(abs(v) for v in a) < 11000, 'unexpected level for ' + n
assert "kind === 'cursor' || kind === 'category'" in x and 'sfxNow - xmbSfxLast[kind] < 20' in x, 'scroll sounds are not throttled to a crawl'
assert 'XMB_SFX_WIRE' not in x and "kind='+kind" in x
for k in ("'cursor'", "'category'", "'decide'", "'cancel'", "'ok'", "'ng'"): assert "xmbPlaySfx(" in x and k in x
assert "category: 'psfx_change_space'" in x.replace("category:'psfx_change_space'", "category: 'psfx_change_space'")
assert 'kSfxVoices' in cpp and 'pthread_cond_timedwait' in cpp, 'native mixer with a persistent port'

# ---- categories + circle
cats = json.loads(re.search(r'var XMB_WEB_NATIVE_CATEGORIES = (\[.*\]);\n', x).group(1))
assert 'XMB_WEB_NATIVE_CATEGORIES = XMB_WEB_NATIVE_CATEGORIES.filter' in x
for gone in ('music', 'network', 'psn', 'friends', 'video'):
    assert ("c.id!=='%s'" % gone) in x
body = x[x.index('function xmbBack()'):]
body = body[:body.index('function xmbTriangle()')]
assert 'xmbDeactivate' not in body, 'Circle must not leave the XMB'
assert "function xmbReturnToStock()" in x and "xmbHome.confirmExit=true" in x and "function xmbReturnDialog" in x, "Return to PS5 Home requires explicit PS3-style confirmation"

# ---- installer logic, compiled and run on Linux with the real source and stubbed system calls
if shutil.which('g++') and shutil.which('as'):
    inc = Path(tempfile.mkdtemp()); (inc / 'ps5').mkdir()
    (inc / 'ps5/kernel.h').write_text('#pragma once\n#include <stddef.h>\n#include <stdint.h>\n#include <sys/types.h>\nextern "C" void *kernel_dynlib_dlsym(int,int,const char*);\nstatic inline int kernel_dynlib_handle(pid_t, const char *, uint32_t *) { return -1; }\n')
    exe = inc / 'host'
    cmd = ['g++', '-std=c++17', '-I', str(R / 'src/source/shellui/include'), '-I', str(inc), str(R / 'xmb_patch/tests/media_installer_host.cpp'),
           str(R / 'src/source/shellui/src/zt_xmb_media.cpp'), str(R / 'src/source/shellui/src/zt_xmb_music.cpp'), str(R / 'src/source/shellui/src/zt_xmb_embedded_media.s'), '-lpthread', '-o', str(exe)]
    r = subprocess.run(cmd, capture_output=True, text=True)
    assert r.returncode == 0, r.stderr[-2000:]
    r = subprocess.run([str(exe)], capture_output=True, text=True)
    assert r.returncode == 0 and 'PASS' in r.stdout, r.stdout + r.stderr
    shutil.rmtree(inc, ignore_errors=True)
    print(r.stdout.strip())
else:
    print('NOTE: g++ unavailable, installer host test skipped')
# ---- V35: crisp text/icons, clock box, fast-scroll mode, sounds
assert 'iconMip' in b and "const FAST_GAP" in b and 'st.fast' in b, 'renderer: mip icons + fast-scroll mode'
assert 'sa.size !== sb.size' in b, 'renderer: unscaled two-layer titles'
nat = (R / 'xmb_patch/native_src/integration/ps5xmb-native.js').read_text()
assert 'Math.abs(k - 1) <= 0.08' in nat and 'clockBox' in nat and 'iconMip' in nat
for n in ('xmbweb_clock_box', 'xmbweb_clock_ring'):
    assert n in have, 'clock asset missing: ' + n
for n in sorted(have):
    m = re.fullmatch(r'(xmbweb_xmb_icon_\d{3}|xmbweb_xmb_icon_psn|xmbweb_playstation_store)', n)
    if m: assert n + '_s' in have and n + '_m' in have, 'icon mip level missing for ' + n
# ---- V36: Game = apps + games only, Photo trimmed, focus background + music, preSync, dim
assert 'onDwell:xmbFocusDwell' in x and 'AppSnd0' in x and 'preSync' in x and 'sndPathWithTs' in x
assert 'dimV' in b and 'CinfoBg' in b and 'preSync' in nat
# ---- V37: halo as images, live speed controls, deferred sound, game music robustness
for n in ('xmbweb_glow_l', 'xmbweb_glow_m', 'xmbweb_glow_r'):
    assert n in have, 'glow slice missing: ' + n
assert 'glowImg' in nat and 'GLOW_IMG' in b and 'FAST_GAP = 0' in b and 'hermite' in b and 'st.speed' in b
assert 'animSpeed' in x and 'speed:100/xmbHome.animSpeed' in x and 'xmbHome.holdSpeed' in x
assert 'function xmbSendSfx' in x and 'xmbMoveNotify' in x, 'V39: a step starts the animation without a React render, the sound goes in the same turn'
i_n = x.index('function xmbMove(dir)'); mv = x[i_n:x.index('function xmbBack()')]
assert mv.index('if (changed) xmbMoveNotify(') < mv.index("if (changed) xmbPlaySfx("), 'animation before sound'
assert 'suppressBgm:!xmbHome.fbPlaying' in x and 'if (xmbHome.fbPlaying) return undefined;' in x and "'/snd0.at9'" in x
assert ".split('?')[0];" not in t[t.index('var snd = String(r.sndPathWithTs'):t.index('var snd = String(r.sndPathWithTs')+120]
# ---- V38: warm audio port, art check, native glow picture, re-focus fix, delay controls
src = (R / 'src/source/shellui/src/zt_xmb_media.cpp').read_text()
assert 'zt_xmb_sfx_warm' in src and 'g_xmb_sfx_warm' in src
for f in ('src/zt_xmb_glow.cpp', 'src/zt_xmb_art.cpp', 'include/zt_xmb_glow.hpp'):
    assert (R / 'src/source/shellui' / f).exists(), f
web38 = (R / 'src/source/shellui/src/theme_web.cpp').read_text()
assert '"/xmb-glow"' in web38 and '"/xmb-art"' in web38 and 'zt_xmb_glow_make' in web38 and 'zt_xmb_art_check' in web38 and 'zt_xmb_sfx_warm' in web38
assert 'xmbSfxPort(true)' in x and 'xmbSfxPort(false)' in x and 'xmbArtCheck' in x and 'xmbGlowFor' in x
assert 'animSpeed: 100, holdSpeed: 100' in x and 'XMB_BGDELAY_STEPS' in x and 'dwell:Math.round(1000*xmbHome.bgDelay/100)' in x
assert 'loaded.current[u]' in b and 'resolveArt' in b and 'PULSE_MIN' in b and 'env.glowFor' in b and "on ? 680 : 110" in b
assert 'xmbHome.fbKey === id' in x
# ---- V39: one drawing copy, no render per step, velocity-continuous steps, native pulse loop + keep-alive, stock BGM replay, glow baseline
assert 'xmbLayerOwner' in x and 'XMB_RENDER_MAXWAIT' in x and 'function xmbFlushRender' in x and 'STOCK_BGM' in x and 'XMB_BGM_AFTER_RELEASE_MS' in x
assert 'KeepAlive' in b and 'PULSE_TR' in b and 'iterations: -1' in b and 'bgRetarget' in b
g39 = (R / 'src/source/shellui/src/zt_xmb_glow.cpp').read_text()
assert 'winAsc' in g39 and '"/g2_' in g39
# ---- V40: native game music (AT9 via libSceAudiodec), console sound channel, optical icon centring
mus = (R / 'src/source/shellui/src/zt_xmb_music.cpp').read_text()
assert 'sceAudiodecCreateDecoder' in mus and 'zt_xmb_music_mix' in mus and 'parse_at9' in mus
assert 'zt_xmb_music_mix(acc, kSfxGrain)' in src and 'zt_xmb_sfx_kick' in src
assert '"/xmb-music"' in (R / 'src/source/shellui/src/theme_web.cpp').read_text()
assert 'THEME-XMBSFX ' in (R / 'src/source/shellui/src/homeui_js_inject.cpp').read_text(errors='ignore')
assert "console.log('THEME-XMBSFX ' + kind)" in x and 'xmbMusicNative' in x and 'musicVol: 60' in x and 'appStateHooked' in x
assert 'iconOffsetX' in b and 'iconShift' in b
# ---- V41: Ajm ATRAC9 backend, no system-music fallback, hub diagnostics, filtered game icons, whole-list mounting
assert 'sceAjmBatchJobRunBufferRa' in mus and 'MUSIC_AJM_READY' in mus
assert 'FOCUS_MUSIC_UNAVAILABLE' in x and 'HUB_BGM' in x and 'xmbIconLevels' in x
assert 'GameIcon' in b and 'items.length <= 80' in b
assert '"/xmb-icon"' in (R / 'src/source/shellui/src/theme_web.cpp').read_text() and 'zt_xmb_icon_levels' in (R / 'src/source/shellui/src/zt_xmb_art.cpp').read_text()
# ---- V42: ghost-free title growth, no render while held, music status
assert 'tr.K' in b and '(listLen && listLen <= 80)' in x and 'zt_xmb_music_status' in mus
# ---- V43: Ajm via sysmodule id, real users, no-blink submenu close
assert 'sceSysmoduleLoadModuleInternal' in mus and '0x80000023' in mus
assert (R / 'src/source/shellui/src/zt_xmb_users.cpp').exists() and '"/xmb-users"' in (R / 'src/source/shellui/src/theme_web.cpp').read_text()
assert 'xmbUserItems' in x and 'parentFade' in b
# ---- V44: submenu leaves the outside untouched, all lists mounted, user pictures via profilecache, music status details
assert 'settle(val, to)' in b and 'xmbSniffFace' in x and 'PS5XMB_music_status.txt' in mus and 'xmbFaceUris' in x and 'init%d reg%d' in mus
# ---- V46: no parent-column switch (collapse carried by the rows), own Ajm batches + sceAjmBatchStart
assert 'SUBD' in b and 'sub: true' in b and 'sceAjmBatchStart"' in mus and 'AjmBatchInfo' in mus
# ---- V47: Ajm batch priority + batch-info layout probing, notes into the status file, user picture over the user icon
assert 'be.prio' in mus and 'info_layout' in mus and 'zt_xmb_note' in mus and 'op == "note"' in (R / 'src/source/shellui/src/theme_web.cpp').read_text().replace("op==\"note\"", 'op == "note"')
assert 'xmbNote(' in x and 'p.under' in b
# ---- V48: no title music while a game runs, Settings / Photo trimmed, screenshots in Photos, user picture fallbacks
assert 'sceSystemServiceGetAppIdOfRunningBigApp' in mus and 'return 409' in mus and 'musicHold' in x and 'XMB_SETTINGS_REMOVED' in x
assert 'zt_xmb_photos_json' in (R / 'src/source/shellui/src/theme_web.cpp').read_text() and 'NPXS40087' in (R / 'src/source/shellui/src/zt_xmb_users.cpp').read_text()
assert 'copied as it is' in (R / 'src/source/shellui/src/zt_xmb_users.cpp').read_text() and 'p.thumb' in b and 'photo-viewer' in x
# ---- V49: per-month wave loops from /user/data/ZhiThemes/xmbwaves (XMB5 wave kit), built-in loops as the fallback
assert 'xmbWaveMonthName' in x and "XMB5_Wave_" in x and 'ZT_DIR "/xmbwaves/"' in (R / 'src/source/shellui/src/theme_web.cpp').read_text()
# ---- V50: the month waves are uploaded to ZT_DIR/xmbwaves through the web server (kind=xmbwaves), listed by GET /xmbwaves
tw = (R / 'src/source/shellui/src/theme_web.cpp').read_text()
assert 'kind == "xmbwaves"' in tw and 'path == "/xmbwaves"' in tw and (R / 'UPLOAD_XMB_WAVES.bat').exists() and (R / 'UPLOAD_XMB_WAVES.sh').exists()
# ---- V51: Theme Settings > Colour / Day/Night pick the wave; XMB settings saved in ZT_DIR/PS5XMB_settings.txt (/xmb-prefs)
assert 'xmbWaveMenus' in x and "kind:'wave-month'" in x and 'xmbPrefsLoad' in x and 'path == "/xmb-prefs"' in tw
assert 'zt_xmb_prefs_set' in (R / 'src/source/shellui/src/zt_xmb_users.cpp').read_text()
# ---- V52: PS3 firmware motion (PAF mode 5, 200 ms), PS3 bar spacing 200 + 10, PS3 day/night switch times
assert 'ps3Curve' in b and '0.33333298563957214' in b and '1.0000009536743164' in b and 'BAR_STEP = 200, BAR_GAP = 10' in b
assert 'motion:xmbHome.motion' in x and 'h >= 19.415' in x
# ---- V53: PS3 submenu open/close measured from the RPCS3 recording (parent -262, siblings -110 @ 0.12, arrow tip 433, child fade after 160 ms)
assert 'PARENT_COL_X' in b and 'childTextX: 622' in b and 'childDelay: 160' in b and 'sibAlpha: 0.2' in b and 'tipX: 433' in b
assert 'openFx' in b and 'closeFx' in b and 'subText' in b and 'ITEM_FOCUS_Y = 505' in b
# ---- V54: submenu spacing as on the PS3 (row above at 330, mirrors the rows below), 37 / 86 px child icons, the arrow as a PNG
assert 'o.sub ? fy - pad - V.ITEM_SPACING' in b and 'childIcon: 86, childIconSmall: 37' in b and 'env.subArrow' in b and "xmbweb_arrow_sub" in b
assert 'xmbweb_arrow_sub' in have and 'Sets the name for this system' in x
# V62: the PS3 Triangle options panel + Information screen, from the 4.93 system_plugin.rco textures
assert 'xmbweb_optmenu_bg' in have and 'xmbweb_optmenu_line' in have and 'xmbweb_optmenu_arrow_r' in have
assert 'function OptPanel' in b and 'function InfoScreen' in b and "xmbweb_optmenu_bg" in b and 'outputRange: [1, 0.43, 0.24]' in b
assert "key:'options-panel'" not in x and "key:'info-overlay'" not in x and 'opt:xmbHome.optionsOpen ?' in x
# V63: Game category only, Sort By (Creation Date / Format / A to Z / Z to A), the title's size on the Information screen
assert 'xmbweb_optmenu_arrow_d' in have and 'optArrowD' in b and 'headY: 270' in b
assert 'function xmbOptionsAllowed' in x and "['Creation Date','date'],['Format','format'],['A to Z','az'],['Z to A','za']" in x and "rows.push(['Size'" in x
tw = (R / 'src/source/shellui/src/theme_web.cpp').read_text()
assert 'path == "/xmb-appinfo"' in tw and 'THEME-XMBFOCUS ' in (R / 'src/source/shellui/src/homeui_js_inject.cpp').read_text() and 'int zt_focus_on_home()' in (R / 'src/source/shellui/src/zt_sys_video.cpp').read_text()
assert 'props.soundEffectsEnabled = false' in x and 'learn_home_widget' in (R / 'src/source/shellui/src/homeui_js_inject.cpp').read_text()
assert 'function xmbWaveSwapStart' in x and "key:'xmbweb-wave-cover'" in x and 'function xmbGameItems' in x and 'path == "/xmb-folders"' in tw
assert 'xmbweb_folder_ps3' in have and 'xmbweb_triangle_hint' in have and 'function xmbHintKick' in x and 'g_rename_prev' in (R / 'src/source/shellui/src/homeui_js_inject.cpp').read_text()
assert 'function xmbColumnsApply' in x and 'path == "/xmb-columns"' in tw and 'path == "/xmb-app"' in tw and 'kind == "xmbicons"' in tw
assert 'function xmbBlockKeys' in x and 'function xmbMuteSystemSounds' in x and "console.log('THEME-XMBFOCUS '" in x and 'zt_xmb_appinfo_json' in (R / 'src/source/shellui/src/zt_xmb_appinfo.cpp').read_text()
# ---- V55: host cursor at start (no Settings item-5 default), submenus open inside sync() and close at once (no timer / end callback)
assert 'opts.sel ? opts.sel[i] || 0 : 0' in b and 'sel: m.sel, noPulse' in b and 'setTimeout(open, 0)' not in b and 'subT: f.t,' in b and 'lvT = ' in b
import subprocess as _sp
_r = _sp.run(['node', str(R / 'xmb_patch/native_src/test/controller.test.js')], capture_output=True, text=True)
assert _r.returncode == 0 and 'controller assertions passed' in _r.stdout, _r.stdout + _r.stderr
print(_r.stdout.strip())
# ---- V56: PS3 submenu background blur: blurred copies of the wave loops (embedded for the built-in ones, _Blur next to the month waves)
for key in ('wave_day_blur', 'wave_night_blur'):
    assert key in man and 'zt_xmb_%s_start:' % key in asm and 'zt_xmb_%s_start' % key in cpp
assert 'xmbWaveBlurName' in x and "'xmbweb-wave-blur-box'" in x and 'blurValue: () => blurV' in b and 'subRun(blurV, 1)' in b
# ---- V57: XMB5 boot intro (embedded, played once per fresh Home session, native fade, skippable, setting saved)
assert 'XMB5_Wave_Intro.mp4' in x and 'xmbIntroFinish(\'missing\')' in x
assert 'xmbIntroStart()' in x and 'if (xmbIntroSkip()) return true;' in x and "key:'xmb-native-box'" in x
assert "props.onPlaying(e)" in (R / 'theme/theme.js').read_text()
# ---- V58: the PS5 plays ONE video at a time: the intro plays alone, then the wave is mounted under a black cover; no second blur player
assert '!xmbIntroHoldsVideo()' in x and 'function xmbIntroSwap(' in x and 'var XMB_BLUR_SECOND_PLAYER = false;' in x and "key:'xmb-intro-vbox'" in x
# ---- V59: the boot cover (black + intro) from the very first frame, the layout check runs under it
assert 'function xmbBootCover(' in x and "xmbIntroStart();   /* V59" in x and "key:'ps5-xmb-probe-stage'" in x and 'xmbBootCover(React.createElement, rn)' in x
# ---- V60: System Settings on a PS5: real values from /xmb-sys, PS3-only items removed, PS5 pages through XMB_PS5_PAGES
tw = (R / 'src/source/shellui/src/theme_web.cpp').read_text()
assert 'path == "/xmb-sys"' in tw and 'zt_xmb_sys_json' in (R / 'src/source/shellui/src/zt_xmb_sys.cpp').read_text()
assert 'function xmbSysSettingsChildren' in x and "kind:'ps5-page'" in x and 'XMB_PS5_PAGES[item.page]' in x and 'xmbSysFetch();' in x
assert "function=language'" in x and "function=notification'" in x and 'function=storage&storage=internal&userid=' in x
assert "kind:'power', what:'restart'" in x and "console.log('THEME-POWER ' + item.what)" in x and 'Press X again' in x
# ---- V61: no render during a category slide (rest render after it settles), every category's glow ready, menus trimmed, the
#      user picture from the PS5's own links first with a 3 s move-on
assert 'XMB_RENDER_REST_CAT = 650' in x and "dir === 'left' || dir === 'right'); else xmbNotify();" in x and 'noGlow: false' in b
assert "if (item.kind === 'info') return true;" in x and "{name:'Return to PS5 Home',kind:'stock'" in x and "e.name === 'Colour' || e.name === 'Day/Night'" in x
assert 'setShown(alt)' in b and x.index("if (pic) out.push(pic);") < x.index("profilecache:image/face/' + sz")   # V77: the payload's copy first
assert 'xmbweb_cross_hint' in x and 'xmbweb_cross_hint' in have and 'mirror_profiles()' in (R / 'src/source/zhithemes/source/main.cpp').read_text()
assert '%s/profile/0x%08x' in (R / 'src/source/shellui/src/zt_xmb_users.cpp').read_text()
# ---- V78: round user picture, Gallery + Video, user switch, format badge, the XMB's own columns renamed
_u = (R / 'src/source/shellui/src/zt_xmb_users.cpp').read_text(); _w = (R / 'src/source/shellui/src/theme_web.cpp').read_text()
assert 'zt_xmb_square_png(src, out, 180, true)' in _u and 'zt_xmb_videos_json' in _u and '"/xmb-videos"' in _w and 'path.rfind("/c/", 0) == 0' in _w and '"/xmb-cats"' in _w
assert "e.name !== 'Create New User'" in x and '"id":"photo","name":"Gallery"' in x and 'function xmbBadge' in x
assert "it.b = b" in b and "OPT.shift[1], OPT.shift[1]" in b
# ---- V79: no user switch, badges as pictures (day / night), intro not skipped, XMB5 (own folder, own ELF name, no pop-ups at load)
_m = (R / 'src/source/zhithemes/source/main.cpp').read_text()
assert 'THEME-USER' not in x and 'THEME-USER' not in (R / 'src/source/shellui/src/homeui_js_inject.cpp').read_text()
assert all(('xmbweb_badge_%s_%s' % (k, m)) in have for k in ('ps5', 'ps4', 'ps3') for m in ('d', 'n')) and "'xmbweb_badge_' + k + '_d'" in x   # V80: always white
assert 'var XMB_INTRO_SKIPPABLE = false;' in x and '#define ZT_DIR "/user/data/XMB5"' in (R / 'src/source/shellui/include/zt_paths.hpp').read_text()
assert 'migrate_old_dir();' not in _m and 'notify("XMB5 will load' not in _m and 'OUTPUT_NAME "XMB5.elf"' in (R / 'src/source/zhithemes/CMakeLists.txt').read_text()
assert "var ZT = '/user/data/XMB5/';" in t if 't' in dir() else True
print('PASS: V34 xmb-web wave video + sounds + 5 categories + Circle stays in the XMB (%d menu assets referenced)' % len(names))

# ---- V80: install date when never played, Gallery counts only when focused, 1 s browser wait, badge closer / smaller
assert 'xmbHome.appDates[item.id] > 0) raw = xmbHome.appDates[item.id]' in x and "photos:true, ns:true" in x and "videos:true, ns:true" in x
assert 'now_ms() - t0 > 1000' in (R / 'src/source/zhithemes/source/main.cpp').read_text(), 'V80: browser wait must remain 1 s'
assert 'BADGE = { x: 540, w: 112, h: 25 }' in b, 'V83.20: badge must be 20 px closer (x=540), same size'
print('PASS: V80 checks')
