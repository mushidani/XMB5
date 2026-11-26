/* PS5XMB HOME V1.4 MEDIA FOCUS FIX: inserted into XMB5's real React Native Home script.
 * This is NOT a web app, and does not replace firmware files. The stock Home
 * and its game-launch callbacks remain underneath. Reboot restores stock.
 * PATCH 2026-11-14 ALIGNMENT + LINKEV NATIVE-FRAME WAVE, AUDIO-ONLY ELF.
 * Linkev is an upstream WebGL2 reference; its frames must be captured on a PC.
 * Copyright 2026 mushidani / PS5 XMB project; GPL-3.0-or-later.
 */
/* XMB_NATIVE_BUNDLE_BEGIN */
"use strict";
var ztXmbNative = (() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };

  // spec/xmb-spec-lite.json
  var require_xmb_spec_lite = __commonJS({
    "spec/xmb-spec-lite.json"(exports, module) {
      module.exports = { layout: { W: 1920, H: 1080, CAT_Y: 289, CAT_Y_ACTIVE_OFFSET: -10, CAT_X: 566, CAT_SPACING: 203, CAT_ICON_ACTIVE: 168, CAT_ICON_INACTIVE: 117, CAT_LABEL_Y: 342, CAT_LABEL_SIZE: 20, CAT_INACTIVE_ALPHA: 0.9, CAT_FAR_ALPHA: 0.25, ITEM_FOCUS_Y: 515, ITEM_SPACING: 80, ITEM_ACTIVE_PAD: 87, ITEM_ICON_X: 566, ITEM_ICON_SIZE: 78, ITEM_ICON_ACTIVE: 180, ITEM_ICON_ACTIVE_PHOTOFOLDER: 151, PHOTO_LIST_ACTIVE: 258, PHOTO_LIST_INACTIVE: 107, PHOTO_LIST_TEXT_X: 720, PHOTO_LIST_FOCUS_Y: 504, PHOTO_LIST_ACTIVE_PAD: 95, PHOTO_FOLDER_TEXT_X: 708, ITEM_TEXT_X: 683, ITEM_TEXT_SIZE: 30, ITEM_TEXT_ACTIVE_SIZE: 34, ITEM_DESC_OFFSET: 28, ITEM_DESC_SIZE: 18, ITEM_VALUE_RIGHT_PAD: 80, ITEM_ACTIVE_SCALE: 1.3, ITEM_INACTIVE_SCALE: 0.833, ITEM_TWEEN_SCALE_UP: 1.06, ITEM_TWEEN_SCALE_DOWN: 0.76, ALPHA_FOCUS: 1, ALPHA_INACTIVE: 0.48, ALPHA_NEAR: 0.8, ALPHA_MID: 0.5, ALPHA_FAR: 0.3, ALPHA_ADJ1: 0.55, ALPHA_ADJ2: 0.55, ALPHA_ADJ3: 0.55, ALPHA_ADJ4: 0.55, CAT_SUBMENU_SHIFT: -220, CAT_SUBMENU_SHIFT_ALT: -215, CAT_SUBMENU_ALPHA: 0.6, CAT_SUBMENU_SCALE: 0.833, CAT_SUBMENU_SHIFT_X: 257, CAT_SUBMENU_Y_SHIFT: -10, CAT_SUBMENU_BAR_TARGET_Y: 500, CAT_SUBMENU_BAR_ALT_Y: 240, BAR_RESTORE_X: 840, BAR_RESTORE_Y: -475, PARENT_COL_X: 316, PARENT_COL_OFFSET: -180, PARENT_ICON_SIZE: 78, PARENT_SPACING: 80, SUBMENU_ICON_X_SHIFT: 290, SUBMENU_TEXT_X_SHIFT: 290, CLOCK_X: 1716, CLOCK_Y: 103, CLOCK_SIZE: 26, CLOCK_FRAME_X: 1329, CLOCK_FRAME_Y: 75, CLOCK_FRAME_W: 590, CLOCK_FRAME_H: 57, CLOCK_FRAME_CORNER: 6, CLOCK_FRAME_GLOW: 6, CLOCK_ICON_R: 16, CLOCK_ICON_CX: 1789.5, CLOCK_RIGHT_PAD: 114, CAT_ANIM_MS: 250, ITEM_ANIM_MS: 200, SUBMENU_ANIM_MS: 250, LONG_PRESS_MS: 1e3, INPUT_INITIAL_DELAY_MS: 210, INPUT_REPEAT_MS: 105, INPUT_FAST_REPEAT_MS: 45, INPUT_MIN_REPEAT_MS: 32, INPUT_ACCEL_MULT: 1.4, EASE_IN_WEIGHT: 0.5, EASE_OUT_WEIGHT: 0.4, EASE_3STEP: [0.28, 0.5, 0.78], EASE_CURVE: [0.2, 0.28, 0.5, 0.78, 1], EASE_BACK_C1: 1.70158, PULSE_PERIOD_MS: 1500, PULSE_ALPHA_MIN: 0.42, PULSE_ALPHA_MAX: 0.68, PULSE_INNER_MIN: 0.38, PULSE_INNER_MAX: 0.62, XMB_BLUE: [20, 60, 176], GRADIENT_DARK: [51, 71, 128], GRADIENT_MEDIUM: [71, 128, 199], THUMB_W_SMALL: 108, THUMB_H_SMALL: 61, THUMB_W_DEFAULT: 312, THUMB_H_DEFAULT: 176, THUMB_W_MED: 188, THUMB_H_MED: 106, THUMB_W_LARGE: 376, THUMB_H_LARGE: 211, THUMB_W_HUGE: 432, THUMB_H_HUGE: 240, ASPECT_16_9: 1.7778, WAVE_RIBBONS: 5, WAVE_BASE_Y: 0.46, WAVE_COLOR: [140, 50, 160], TEXT_GLOW_RADIUS: 15, TEXT_GLOW_COLOR: "rgba(255,255,255,0.55)", TEXT_GLOW_INNER_RADIUS: 5, TEXT_GLOW_INNER_COLOR: "rgba(255,255,255,0.5)", BLEND_PREV_ALPHA: 0.12 }, iconScale: { xmb_icon_psn: 0.68, playstation_store: 0.83 }, timings: { ITEM_DESC_FADE_MS: 150, HOVER_BG_DWELL_MS: 1e3, HOVER_BG_FADE_IN_MS: 450, HOVER_BG_FADE_OUT_MS: 150, HOVER_BG_MAX_ALPHA: 0.85 }, hoverBg: { "PlayStation\xAEStore": "backgrounds/cinfo-bg-storemain.jpg", "Sign Up": "backgrounds/cinfo-bg-signup.jpg", "Account Management": "backgrounds/cinfo-bg-signup.jpg", "What's New": "backgrounds/cinfo-bg-whatsnew.jpg", "Photo Gallery": "backgrounds/cinfo-bg-photogallery.jpg" }, defaultItemIndex: { settings: 5 }, iconOffsetX: { xmb_icon_001: 0.013, xmb_icon_002: 83e-4, xmb_icon_003: 0.0219, xmb_icon_005: 0.0161, xmb_icon_007: 0.0126, xmb_icon_008: 0.0157, xmb_icon_009: -0.0122, xmb_icon_010: -0.0595, xmb_icon_012: -0.0458, xmb_icon_014: -0.0214, xmb_icon_015: -0.1066, xmb_icon_016: -0.0934, xmb_icon_017: -0.1133, xmb_icon_018: -0.0413, xmb_icon_020: -0.0998, xmb_icon_023: -0.022, xmb_icon_029: -0.0752, xmb_icon_030: 0.0258, xmb_icon_035: 41e-4, xmb_icon_037: -0.0417, xmb_icon_041: -0.0963, xmb_icon_042: -0.0274, xmb_icon_046: -58e-4, xmb_icon_055: 0.0243, xmb_icon_062: -0.0113, xmb_icon_063: -0.0148, xmb_icon_064: 0.0354, xmb_icon_066: -0.0141, xmb_icon_psn: 0.0303 } };
    }
  });

  // core/xmb-core.js
  var require_xmb_core = __commonJS({
    "core/xmb-core.js"(exports, module) {
      "use strict";
      function createCore(spec) {
        const V = Object.assign({}, spec.layout);
        V.ITEM_FOCUS_Y = 505;
        V.ITEM_ACTIVE_PAD = 95;
        V.PARENT_COL_X = V.ITEM_ICON_X - 262;
        const ICON_SCALE = spec.iconScale || {};
        const ease = {
          // default firmware smoothstep (submenu slide)
          smooth: (t) => t >= 1 ? 1 : t <= 0 ? 0 : t * t * (3 - 2 * t),
          // used by xmb-web navCat / navItem
          outCubic: (t) => {
            if (t >= 1) return 1;
            if (t <= 0) return 0;
            const u = 1 - t;
            return 1 - u * u * u;
          },
          outQuad: (t) => {
            if (t >= 1) return 1;
            if (t <= 0) return 0;
            const u = 1 - t;
            return 1 - u * u;
          },
          linear: (t) => t
        };
        function track(points, extend) {
          return { inputRange: points.map((p) => p[0]), outputRange: points.map((p) => p[1]), extrapolate: extend ? "extend" : "clamp" };
        }
        function sample(tr, x) {
          const a = tr.inputRange, b = tr.outputRange, n = a.length;
          if (x <= a[0]) return tr.extrapolate === "extend" && n > 1 ? b[0] + (b[1] - b[0]) * (x - a[0]) / (a[1] - a[0]) : b[0];
          if (x >= a[n - 1]) return tr.extrapolate === "extend" && n > 1 ? b[n - 1] + (b[n - 1] - b[n - 2]) * (x - a[n - 1]) / (a[n - 1] - a[n - 2]) : b[n - 1];
          let k = 1;
          while (x > a[k]) k++;
          return b[k - 1] + (b[k] - b[k - 1]) * (x - a[k - 1]) / (a[k] - a[k - 1]);
        }
        const forElement = (i, pts, extend) => track(pts.map(([e, v]) => [i + e, v]), extend);
        const iconScale = (id) => ICON_SCALE[id] || 1;
        const BAR_STEP = 200, BAR_GAP = 10;
        const barPts = (c, sign) => {
          const pts = [];
          for (let k = -3; k <= 3; k++) pts.push([c + k, sign * (k === 0 ? 0 : k * BAR_STEP + (k > 0 ? BAR_GAP : -BAR_GAP))]);
          return pts;
        };
        const CAT = {
          // icon centre x, relative to CAT_X; negative e = to the right
          x: (i) => track(barPts(i, -1).map(([e, d]) => [e, V.CAT_X + d]), true),
          // e = catPos - i: e > 0 -> left of focus
          // icon centre y
          y: (i) => forElement(i, [[-1, V.CAT_Y], [0, V.CAT_Y + V.CAT_Y_ACTIVE_OFFSET], [1, V.CAT_Y]]),
          // scale relative to the ACTIVE icon size (so the view is laid out once at 168px)
          scale: (i, id) => {
            const s = iconScale(id), r = V.CAT_ICON_INACTIVE / V.CAT_ICON_ACTIVE;
            return forElement(i, [[-1, r * s], [0, s], [1, r * s]]);
          },
          // opacity: 1 active, 0.9 for the 1..2 neighbours, 0.25 beyond (xmb-web catDist tiers)
          alpha: (i) => forElement(i, [[-3, V.CAT_FAR_ALPHA], [-2, V.CAT_INACTIVE_ALPHA], [-1, V.CAT_INACTIVE_ALPHA], [0, 1], [1, V.CAT_INACTIVE_ALPHA], [2, V.CAT_INACTIVE_ALPHA], [3, V.CAT_FAR_ALPHA]]),
          labelAlpha: (i) => forElement(i, [[-1, 0], [0, 0.9], [1, 0]]),
          iconBox: V.CAT_ICON_ACTIVE
        };
        const CAT_SUB = {
          shiftX: track([[0, 0], [1, -262]]),
          shiftY: track([[0, 0], [1, 0]]),
          scale: track([[0, 1], [1, 1]]),
          alpha: track([[0, 1], [1, 1]]),
          otherShiftX: track([[0, 0], [1, -29]]),
          otherShiftY: track([[0, 0], [1, 7.5]]),
          otherScale: track([[0, 1], [1, 0.95]]),
          otherAlpha: track([[0, 1], [1, 0]]),
          // non-active categories fade away
          labelAlpha: track([[0, 1], [1, 0]])
        };
        const ABOVE_BASE_Y = 120;
        function slotY(e, o) {
          o = o || {};
          const fy = o.focusY != null ? o.focusY : V.ITEM_FOCUS_Y, pad = o.pad != null ? o.pad : V.ITEM_ACTIVE_PAD;
          const ab = o.sub ? fy - pad - V.ITEM_SPACING : ABOVE_BASE_Y;
          if (e >= 1) return ab - (e - 1) * V.ITEM_SPACING;
          if (e >= 0) return fy + (ab - fy) * e;
          const d = -e;
          if (d <= 1) return fy + (fy + pad + V.ITEM_SPACING - fy) * d;
          return fy + pad + d * V.ITEM_SPACING;
        }
        const ITEM = {
          y: (i, o) => forElement(i, [[-30, slotY(-30, o)], [-1, slotY(-1, o)], [0, slotY(0, o)], [1, slotY(1, o)], [30, slotY(30, o)]]),
          // opacity incl. xmb-web's edge fades (top 40px, bottom 20px)
          alpha: (i, o) => {
            const A = V.ALPHA_INACTIVE, fTop = 0, fBot = V.H;
            const ab = o && o.sub ? V.ITEM_FOCUS_Y - V.ITEM_ACTIVE_PAD - V.ITEM_SPACING : ABOVE_BASE_Y;
            const eAbove0 = 1 + (ab - fTop) / V.ITEM_SPACING;
            const eAbove40 = 1 + (ab - fTop - 40) / V.ITEM_SPACING;
            const base = V.ITEM_FOCUS_Y + V.ITEM_ACTIVE_PAD;
            const dBot20 = (fBot - 20 - base) / V.ITEM_SPACING, dBot0 = (fBot - base) / V.ITEM_SPACING;
            return forElement(i, [[-dBot0, 0], [-dBot20, A], [-1, A], [0, V.ALPHA_FOCUS], [1, A], [eAbove40, A], [eAbove0, 0]]);
          },
          // active-style text/glow layer crossfade vs inactive-style layer
          activeOpacity: (i) => forElement(i, [[-1, 0], [0, 1], [1, 0]]),
          inactiveOpacity: (i) => forElement(i, [[-1, 1], [0, 0], [1, 1]]),
          // icon scale relative to the focused icon size
          iconScale: (i, id, o) => {
            const act = o && o.activeIcon || V.ITEM_ICON_ACTIVE, small = o && o.inactiveIcon || V.ITEM_ICON_SIZE, s = iconScale(id);
            return forElement(i, [[-1, small / act * s], [0, s], [1, small / act * s]]);
          },
          iconBoxActive: V.ITEM_ICON_ACTIVE,
          // description under the active item (0.7) and short status line under inactive items (0.6)
          descActive: (i) => forElement(i, [[-1, 0], [0, 0.7], [1, 0]]),
          descInactive: (i) => forElement(i, [[-1, 0.6], [0, 0], [1, 0.6]])
        };
        const COLUMN = {
          shiftX: (c) => track(barPts(c, -1), true),
          // the column rides with its category icon (PS3 bar spacing 200 + 10 beside the focus)
          alpha: (c) => track([[c - 1, 0], [c - 0.45, 0], [c, 1], [c + 0.45, 0], [c + 1, 0]])
        };
        const SLIDE_DIST = V.ITEM_ICON_X - V.PARENT_COL_X;
        const SIB_X = V.ITEM_ICON_X - 110;
        const PS3SUB = { parentAlpha: 0.65, sibAlpha: 0.2, sibScale: 0.94, aboveDy: 23.5, belowDy: -21, rowShrink: 4, arrowX: 444, arrowFrom: 80, childTextX: 622, childIcon: 86, childIconSmall: 37, childDelay: 160, valueX: 1301, valueSize: 20 };
        const sibDy = (e) => e === 0 ? 0 : e > 0 ? PS3SUB.aboveDy + (e - 1) * PS3SUB.rowShrink : PS3SUB.belowDy - (-e - 1) * PS3SUB.rowShrink;
        const SUB = {
          SLIDE_DIST,
          SIB_X,
          // Parent layer item `i` with selected parent index `p`, as functions of subT:
          parent: (i, p, o) => {
            const sel = i === p, e = p - i;
            const ySrc = slotY(e, o), yDst = ySrc + sibDy(e);
            const fullA = sel ? V.ALPHA_FOCUS : V.ALPHA_INACTIVE, setA = sel ? PS3SUB.parentAlpha : PS3SUB.sibAlpha;
            return {
              y: track([[0, ySrc], [1, yDst]]),
              x: track([[0, V.ITEM_ICON_X], [1, sel ? V.PARENT_COL_X : SIB_X]]),
              iconAlpha: track([[0, fullA], [1, setA]]),
              textAlpha: track([[0, fullA], [1, 0]]),
              // icon shrinks to the 78px breadcrumb size (from its focused size if selected)
              sel
            };
          },
          childX: track([[0, 0], [1, 0]]),
          // V53: the PS3 child list does not slide, it fades in (see PS3SUB.childDelay)
          childAlpha: track([[0, 0], [1, 1]]),
          chevronAlpha: track([[0, 0], [1, 0.95]]),
          chevron: { tipX: 433, baseX: 447, cy: V.ITEM_FOCUS_Y, h: 16 },
          // V53: PS3 arrow measured: tip x 433, 14 wide, 16 high, white
          PS3: PS3SUB,
          sibDy
        };
        function repeatIntervals(n) {
          const out = [];
          let cur = V.INPUT_REPEAT_MS;
          for (let k = 0; k < n; k++) {
            out.push(k === 0 ? V.INPUT_INITIAL_DELAY_MS : Math.max(V.INPUT_MIN_REPEAT_MS, cur));
            if (k > 0) cur /= V.INPUT_ACCEL_MULT;
          }
          return out;
        }
        const GLOW = {
          periodMs: V.PULSE_PERIOD_MS,
          outer: { radius: V.TEXT_GLOW_RADIUS, min: V.PULSE_ALPHA_MIN, max: V.PULSE_ALPHA_MAX },
          inner: { radius: V.TEXT_GLOW_INNER_RADIUS, min: V.PULSE_INNER_MIN, max: V.PULSE_INNER_MAX }
        };
        return { V, BAR_STEP, BAR_GAP, ease, track, sample, forElement, slotY, CAT, CAT_SUB, ITEM, COLUMN, SUB, GLOW, repeatIntervals, iconScale, ABOVE_BASE_Y };
      }
      function sampledEasing(fn, n) {
        n = n || 12;
        const pts = [];
        for (let k = 0; k <= n; k++) pts.push([k / n, fn(k / n)]);
        return { inputRange: pts.map((p) => p[0]), outputRange: pts.map((p) => p[1]) };
      }
      module.exports = { createCore, sampledEasing };
    }
  });

  // rn/xmb-rn.js
  var require_xmb_rn = __commonJS({
    "rn/xmb-rn.js"(exports, module) {
      "use strict";
      module.exports = function createXmb(env) {
        const { React, rn, core, spec } = env;
        const { View, Text, Image, Animated } = rn;
        const h = React.createElement;
        const V = core.V, font = env.fontFamily || "PS3";
        const PULSE_MS = 2e3, PULSE_MIN = 0.2;
        const PULSE_TR = (() => {
          const ir = [], or = [];
          for (let k = 0; k <= 16; k++) {
            const x = k / 16;
            ir.push(x);
            or.push(PULSE_MIN + (1 - PULSE_MIN) * (0.5 + 0.5 * Math.cos(2 * Math.PI * x)));
          }
          return { inputRange: ir, outputRange: or };
        })();
        const nativeDriver = env.useNativeDriver !== false;
        const snap = env.fontSnap || ((px) => ({ size: px, scale: 1 }));
        const layout = (kind) => env.onLayout ? (e) => env.onLayout(kind, e) : void 0;
        const iconSrc = (it) => it && it.src ? { uri: it.src } : env.iconSource(it && it.i);
        const iconMip = (id, suf) => env.iconMip && id ? env.iconMip(id, suf) : null;
        const scaleKey = (it) => it && (it.sk || it.i) || "";
        const OFFS = spec.iconOffsetX || {};
        const iconShift = (id, box) => {
          const k = String(id || "").replace(/^xmbweb_/, "");
          const f = OFFS[k];
          return f ? Math.round(-f * box * 10) / 10 : 0;
        };
        const shifted = (id, box, kids) => {
          const dx = iconShift(id, box);
          return dx ? h(View, { pointerEvents: "none", style: { position: "absolute", left: 0, top: 0, width: box, height: box, transform: [{ translateX: dx }] } }, kids) : kids;
        };
        const INACTIVE_K = V.ITEM_TEXT_SIZE / V.ITEM_TEXT_ACTIVE_SIZE;
        const memo = React.memo || ((c) => c);
        const useMemo = React.useMemo || ((fn, deps) => {
          const r = React.useRef(null), c = r.current;
          if (c && c.d.length === deps.length && c.d.every((x, k) => x === deps[k])) return c.v;
          const v = fn();
          r.current = { d: deps, v };
          return v;
        });
        const A = {
          mul: (a, b) => b === void 0 || b === null ? a : a === void 0 || a === null ? b : Animated.multiply(a, b),
          add: (a, b) => b === void 0 || b === null ? a : a === void 0 || a === null ? b : Animated.add(a, b)
        };
        const interp = (val, tr, delta) => val.interpolate({ inputRange: tr.inputRange, outputRange: delta ? tr.outputRange.map((v) => v + delta) : tr.outputRange, extrapolate: tr.extrapolate || "clamp" });
        const constTr = (v) => ({ inputRange: [0, 1], outputRange: [v, v], extrapolate: "clamp" });
        function createController(categories, opts) {
          opts = opts || {};
          const listeners = /* @__PURE__ */ new Set();
          const cats = categories;
          const st = {
            ci: Math.min(cats.length - 1, opts.startCategory || 0),
            // V55: the host's cursor wins (opts.sel). The old xmb-web default (Settings -> item 5) put the list on the LAST row of the trimmed
            // Settings at start while the host's cursor was on the first one.
            sel: cats.map((c, i) => Math.min(Math.max(0, (c.items || []).length - 1), Math.max(0, opts.sel ? opts.sel[i] || 0 : 0))),
            stack: [],
            // frames: { items, idx, pos: Animated.Value, parentIdx }
            leaving: false,
            startDelay: 0,
            // V38: live 'scroll start delay' (ms) before a cursor move starts animating (host: model.startDelay)
            dwell: -1,
            // V38: live focus-background delay (ms); 0 = spec value (host: model.dwell)
            speed: 1,
            // live animation-speed factor (host sets it: model.speed); durations = spec value x speed
            motion: "ps3",
            // V52: 'ps3' = the PS3's own curve (PAF mode 5, 200 ms) | 'smooth' = the V39-V51 glide (host: model.motion)
            fast: false,
            // held / rapid D-pad: halo + descriptions are dropped until the cursor rests (no per-step mount churn)
            version: 0,
            opt: [],
            // V62: the Triangle options panel, one entry per open level: [{ items: [{ n, ch }], idx }] (host: model.opt)
            optLast: null,
            //      the last shown level: kept drawn (faded out by optV) so closing fades the panel with its labels
            info: null,
            infoLast: null,
            optEpoch: [0, 0],
            infoEpoch: 0,
            optOpenedAt: [0, 0],
            infoOpenedAt: 0
            // V62: the PS3 Information screen ({ icon, pic, rows: [[label, value]] }, host: model.info)
          };
          const catPos = new Animated.Value(st.ci);
          const rootPos = cats.map((c, i) => new Animated.Value(st.sel[i]));
          const slotDx = cats.map(() => new Animated.Value(0));
          const slotAlpha = cats.map(() => new Animated.Value(1)); /* V83: category insertion fade */
          // V83.17: PS3-like directional ghost fade. The original items keep
          // their normal Mode-5 horizontal motion; ONLY translucent afterimage
          // copies drift into the scroll direction. Both echo layers are mounted
          // in the native animation graph from the first renderer commit.
          const exitMode = cats.map(() => new Animated.Value(0));
          const exitAlpha = cats.map(() => new Animated.Value(0));
          const exitGhostX = cats.map(() => new Animated.Value(0));
          const exitGhostT = cats.map(() => new Animated.Value(0));
          const catSub = new Animated.Value(0);
          const colT = new Animated.Value(0);
          const subText = new Animated.Value(1), arrowV = new Animated.Value(0), childV = new Animated.Value(0);
          const arrowX = new Animated.Value(0);
          const blurV = opts.blurV || new Animated.Value(0);
          const pulse = new Animated.Value(0);
          const zero = new Animated.Value(0);
          const dimV = new Animated.Value(0);
          const optV = new Animated.Value(0);
          const optTxt = interp(optV, { inputRange: [0, 1, 2], outputRange: [1, 0.43, 0.24] });
          const optGlow = interp(optV, { inputRange: [0, 1], outputRange: [1, 0] });
          const infoV = new Animated.Value(0);
          const settle = (val, to) => {
            try {
              if (typeof val._value === "number") val._value = to;
            } catch (e) {
            }
          };
          const run = (val, to, ms, fn, cb, delay) => {
            if (val.stopAnimation) val.stopAnimation();
            Animated.timing(val, { toValue: to, duration: ms, easing: fn, delay: delay || 0, useNativeDriver: nativeDriver }).start((r) => {
              if (!r || r.finished !== false) settle(val, to);
              if (cb) cb(r);
            });
          };
          const D = (k) => Math.max(30, Math.round(V[k] * st.speed));
          /* V83.5: do not start content opacity here. The controller's sync()
           * fires during the host render, BEFORE the new submenu children are
           * committed. Any opacity animation started here can finish before the
           * rows attach and will then look like a snap. MountedReveal below
           * starts its own native animation only AFTER its view has mounted. */
          const motion = /* @__PURE__ */ new Map();
          const outCubic = { f: core.ease.outCubic, d: (u) => 3 * (1 - u) * (1 - u) };
          const hermite = (sl) => ({ f: (u) => u <= 0 ? 0 : u >= 1 ? 1 : sl * u + (3 - 2 * sl) * u * u + (sl - 2) * u * u * u, d: (u) => sl + 2 * (3 - 2 * sl) * u + 3 * (sl - 2) * u * u });
          const PS3_MS = 200, ps3Cache = {};
          const ps3Curve = (ms) => {
            const key = Math.round(ms);
            if (ps3Cache[key]) return ps3Cache[key];
            const fr = Math.fround || ((x) => x);
            const N = Math.trunc(fr(fr(key * fr(1e-3)) * 60));
            const g = N > 4 ? fr(1 / fr(fr((N - 5) * 0.33333298563957214) + 2.200000047683716)) : [1, 0.9615384936332703, 0.78125, 0.6369426250457764, 0.5291005373001099][N] || 1;
            const tab = [0];
            let v = 0;
            while (v < 1 && tab.length < 240) {
              v = fr(fr(v + fr((1 - v) * g)) * 1.0000009536743164);
              tab.push(Math.min(1, v));
            }
            tab[tab.length - 1] = 1;
            const K2 = tab.length - 1;
            const f = (u) => {
              if (u <= 0) return 0;
              if (u >= 1) return 1;
              const x = u * K2, k = Math.floor(x);
              return tab[k] + (tab[k + 1] - tab[k]) * (x - k);
            };
            return ps3Cache[key] = { f, dur: Math.round(K2 * 1e3 / 60), N, g, K: K2 };
          };
          const stepPs3 = (val, to, m0, now) => {
            const c = ps3Curve(PS3_MS * st.speed);
            let from, delay = 0;
            if (m0 && now < m0.t0 + m0.dur) {
              const u = (now - m0.t0) / m0.dur;
              from = u <= 0 ? m0.from : m0.from + (m0.to - m0.from) * m0.c.f(u);
            } else {
              from = m0 ? m0.to : typeof val.__getValue === "function" ? val.__getValue() : to;
              delay = st.startDelay || 0;
            }
            motion.set(val, { t0: now + delay, dur: c.dur, from, to, c });
            run(val, to, c.dur, c.f, null, delay);
          };
          const subRun = (val, to, cb, delay) => {
            if (st.motion !== "smooth") {
              const c = ps3Curve(PS3_MS * st.speed);
              run(val, to, c.dur, c.f, cb, delay);
            } else run(val, to, D("SUBMENU_ANIM_MS"), core.ease.smooth, cb, delay);
          };
          // Match reveal to when the PS3 motion is visually settled, not the
          // ~833 ms almost-invisible tail of the original easing function.
          // Compute the time from the SAME curve as the panel, with no hard-coded
          // callback or extra reveal gate that can keep children hidden.
          const revealSettleMs = () => {
            if (st.motion === "smooth") return D("SUBMENU_ANIM_MS");
            const c = ps3Curve(PS3_MS * st.speed);
            for (let n = 1; n <= c.K; n++) {
              if (c.f(n / c.K) >= 0.976) return Math.round(n * 1e3 / 60);
            }
            return c.dur;
          };
          const lvT = (k) => k === 0 ? colT : st.stack[k - 1].t;
          const lvTxt = (k) => k === 0 ? subText : st.stack[k - 1].txt;
          let frameEpoch = 0;
          const newFrame = (items, idx, title, parentIdx) => ({
            mountEpoch: ++frameEpoch,
            openedAt: Date.now(),
            items,
            idx,
            pos: new Animated.Value(idx),
            parentIdx: parentIdx || 0,
            title,
            t: new Animated.Value(0),
            txt: new Animated.Value(1),
            // opacity is owned by MountedReveal after the view commits
          });
          const stopV = (v) => {
            if (v.stopAnimation) v.stopAnimation();
          };
          // The ghost is NOT a moving wipe and never shifts the real items.
          // The original column fades promptly, while two faint echoes trail
          // toward the pressed side, then evaporate. No timer or React remount.
          const exitColumn = (oldCi, newCi) => {
            if (oldCi === newCi || oldCi < 0 || newCi < 0 || oldCi >= cats.length || newCi >= cats.length) return;
            const direction = newCi > oldCi ? 1 : -1;
            const originalMs = Math.max(50, Math.round(110 * st.speed));
            stopV(exitAlpha[oldCi]);
            stopV(exitGhostX[oldCi]);
            stopV(exitGhostT[oldCi]);
            exitMode[oldCi].setValue(1);
            exitAlpha[oldCi].setValue(1);
            exitGhostX[oldCi].setValue(0);
            exitGhostT[oldCi].setValue(0);
            run(exitAlpha[oldCi], 0, originalMs, core.ease.outCubic);
            // V83.23: remove the horizontal ghost afterimage entirely so
            // category changes only use the real column fade.
            // An incoming column must never retain the last outgoing trail.
            stopV(exitAlpha[newCi]);
            stopV(exitGhostX[newCi]);
            stopV(exitGhostT[newCi]);
            exitMode[newCi].setValue(0);
            exitAlpha[newCi].setValue(0);
            exitGhostX[newCi].setValue(0);
            exitGhostT[newCi].setValue(0);
          };
          const openFx = (n, animate) => {
            const T = lvT(n), X = lvTxt(n), f = st.stack[n];
            stopV(X);
            X.setValue(0);
            arrowV.setValue(1);
            if (!animate) {
              // Restoring a pre-existing stack: panel is already in place.
              f.openedAt = 0;
              stopV(T);
              T.setValue(1);
              if (n === 0) {
                stopV(catSub);
                catSub.setValue(1);
                stopV(blurV);
                blurV.setValue(1);
              }
              return;
            }
            stopV(arrowX);
            arrowX.setValue(core.SUB.PS3.arrowFrom);
            subRun(arrowX, 0);
            subRun(T, 1);
            if (n === 0) {
              subRun(catSub, 1);
              subRun(blurV, 1);
            }
          };
          const closeFx = (n, animate) => {
            const T = lvT(n), X = lvTxt(n);
            st.stack.length = n;
            if (n === 0) {
              arrowV.setValue(0);
              if (animate) {
                subRun(catSub, 0);
                subRun(blurV, 0);
              } else {
                stopV(catSub);
                catSub.setValue(0);
                stopV(blurV);
                blurV.setValue(0);
              }
            }
            if (animate) {
              subRun(T, 0);
              subRun(X, 1);
            } else {
              stopV(T);
              T.setValue(0);
              stopV(X);
              X.setValue(1);
            }
          };
          const step = (val, to, key) => {
            const now = Date.now(), T = D(key), m0 = motion.get(val);
            if (st.motion !== "smooth") {
              stepPs3(val, to, m0, now);
              return;
            }
            let curve = outCubic;
            if (m0 && m0.c && m0.c.d) {
              const u = (now - m0.t0) / m0.dur;
              if (u > 0 && u < 1 && m0.to !== m0.from) {
                const gap = now - m0.t0, Th = Math.max(60, Math.min(T, Math.round(gap * 1.8)));
                const p = m0.from + (m0.to - m0.from) * m0.c.f(u), v = (m0.to - m0.from) * m0.c.d(u) / m0.dur, dist = to - p;
                if (Math.abs(dist) > 1e-3) curve = hermite(Math.max(0, Math.min(3, v * Th / dist)));
                motion.set(val, { t0: now, dur: Th, from: p, to, c: curve });
                run(val, to, Th, curve.f, null, 0);
                return;
              }
            }
            const from = typeof val.__getValue === "function" ? val.__getValue() : m0 ? m0.to : to;
            motion.set(val, { t0: now + (st.startDelay || 0), dur: T, from, to, c: curve });
            run(val, to, T, curve.f, null, st.startDelay);
          };
          const notify = () => {
            st.version++;
            listeners.forEach((f) => f(st.version));
          };
          const FAST_GAP = 0, FAST_REST = 240;
          let lastMove = 0, fastTimer = null;
          const markMove = () => {
            if (st.dim) api.setDim(false);
            if (api.bgRetarget) {
              try {
                api.bgRetarget();
              } catch (e) {
              }
            }
            const t = Date.now();
            if (t - lastMove < FAST_GAP) st.fast = true;
            lastMove = t;
            if (fastTimer) clearTimeout(fastTimer);
            fastTimer = setTimeout(() => {
              fastTimer = null;
              if (st.fast) {
                st.fast = false;
                notify();
              }
            }, FAST_REST);
          };
          if (Animated.loop && !opts.noPulse) {
            Animated.loop(Animated.timing(pulse, { toValue: 1, duration: PULSE_MS, easing: core.ease.linear || ((x) => x), useNativeDriver: nativeDriver }), { iterations: -1 }).start();
          }
          const frame = () => st.stack.length ? st.stack[st.stack.length - 1] : null;
          const curItems = () => frame() ? frame().items : cats[st.ci].items || [];
          const curIdx = () => frame() ? frame().idx : st.sel[st.ci];
          const api = {
            state: st,
            catPos,
            slotDx,
            slotAlpha,
            exitMode,
            exitAlpha,
            exitGhostX,
            exitGhostT,
            catSub,
            colT,
            subText,
            arrowV,
            arrowX,
            childV,
            blurV,
            pulse,
            zero,
            dimV,
            rootPos,
            categories: cats,
            optV,
            optTxt,
            optGlow,
            infoV,
            setDim(on) {
              if (st.dim === on) return;
              st.dim = on;
              run(dimV, on ? 1 : 0, on ? 680 : 110, on ? core.ease.smooth : core.ease.outCubic);
            },
            subscribe(fn) {
              listeners.add(fn);
              return () => listeners.delete(fn);
            },
            // V76: the host moved a category (a custom column, left / right): the same category objects, lists and positions in the new order;
            // the focus stays where it is and the categories that changed sides slide over to their new places (PS3 mode-5 move)
            reorder(ids, ci) {
              const byId = {}, oldCi = st.ci;
              cats.forEach((c, k) => {
                stopV(rootPos[k]);
                byId[c.id] = { c, sel: st.sel[k], old: k };
              });
              if (ids.length !== cats.length || ids.some((id) => !byId[id])) return;
              ids.forEach((id, k) => {
                const e = byId[id];
                cats[k] = e.c;
                st.sel[k] = e.sel;
                rootPos[k].setValue(e.sel);
                motion.delete(rootPos[k]);
                e.nw = k;
              });
              st.ci = ci;
              stopV(catPos);
              catPos.setValue(ci);
              motion.delete(catPos);
              exitMode.forEach((v) => v.setValue(0));
              exitAlpha.forEach((v) => { stopV(v); v.setValue(0); });
              exitGhostX.forEach((v) => { stopV(v); v.setValue(0); });
              exitGhostT.forEach((v) => { stopV(v); v.setValue(0); });
              ids.forEach((id) => {
                const e = byId[id], d = (e.old - oldCi - (e.nw - ci)) * V.CAT_SPACING, v = slotDx[e.nw];
                stopV(v);
                v.setValue(d);
                if (d) subRun(v, 0);
              });
              notify();
            },
            /* V83: keep the same controller when columns are added/deleted.
               Surviving categories keep their native Animated.Values, while their
               old positions glide to the newly occupied slots. */
            updateCategories(next, ci, selections) {
              const oldIds = cats.map((c) => c.id), oldCi = st.ci;
              const oldRoot = rootPos.slice(), oldSlots = slotDx.slice(), oldAlphas = slotAlpha.slice();
              const oldSel = st.sel.slice(), lookup = {};
              oldIds.forEach((id, i) => { lookup[id] = i; });
              const newRoot = [], newSlots = [], newAlphas = [], newSel = [];
              next.forEach((c, k) => {
                const old = Object.prototype.hasOwnProperty.call(lookup, c.id) ? lookup[c.id] : -1;
                const select = Math.max(0, (selections && selections[k]) || 0);
                const rp = old >= 0 ? oldRoot[old] : new Animated.Value(select);
                if (old >= 0 && select !== oldSel[old]) {
                  if (rp.stopAnimation) rp.stopAnimation();
                  rp.setValue(select);
                }
                newRoot.push(rp); newSel.push(select);
                const dx = old >= 0 ? oldSlots[old] : new Animated.Value(0);
                const alpha = old >= 0 ? oldAlphas[old] : new Animated.Value(0);
                if (old >= 0) {
                  const offset = (old - oldCi - (k - ci)) * V.CAT_SPACING;
                  if (offset) { if (dx.stopAnimation) dx.stopAnimation(); dx.setValue(offset); }
                } else {
                  if (dx.stopAnimation) dx.stopAnimation();
                  dx.setValue((k >= ci ? 1 : -1) * V.CAT_SPACING * 0.55);
                }
                newSlots.push(dx); newAlphas.push(alpha);
              });
              cats.splice(0, cats.length, ...next);
              rootPos.splice(0, rootPos.length, ...newRoot);
              slotDx.splice(0, slotDx.length, ...newSlots);
              slotAlpha.splice(0, slotAlpha.length, ...newAlphas);
              // A structural edit is not a horizontal D-pad move. Reset the
              // exit layer instead of carrying stale offsets across indices.
              exitAlpha.forEach(stopV);
              exitGhostX.forEach(stopV);
              exitGhostT.forEach(stopV);
              exitMode.splice(0, exitMode.length, ...next.map(() => new Animated.Value(0)));
              exitAlpha.splice(0, exitAlpha.length, ...next.map(() => new Animated.Value(0)));
              exitGhostX.splice(0, exitGhostX.length, ...next.map(() => new Animated.Value(0)));
              exitGhostT.splice(0, exitGhostT.length, ...next.map(() => new Animated.Value(0)));
              st.sel.splice(0, st.sel.length, ...newSel);
              st.ci = Math.max(0, Math.min(ci, cats.length - 1));
              if (catPos.stopAnimation) catPos.stopAnimation();
              catPos.setValue(st.ci); motion.delete(catPos);
              st.structureVersion = (st.structureVersion || 0) + 1;
              const ms = D("CAT_ANIM_MS");
              newSlots.forEach((v) => {
                if (typeof v.__getValue !== "function" || Math.abs(v.__getValue()) > 0.1)
                  subRun(v, 0);
              });
              newAlphas.forEach((v) => {
                if (typeof v.__getValue !== "function" || v.__getValue() < 0.99)
                  run(v, 1, ms, core.ease.outCubic);
              });
            },
            refresh() {
              notify();
            },
            // V39: re-render the rows now (the host calls sync() per step and renders when the cursor rests)
            current() {
              return { item: curItems()[curIdx()], index: curIdx(), depth: st.stack.length, category: cats[st.ci] };
            },
            // ---- driver mode: the host owns the navigation state (category, per-category cursor, submenu stack) and calls
            // sync(model) on every render; the controller only derives the animations from the differences. model:
            //   { ci, sel: [index per category], stack: [{ items, idx, title }] }   (items already in {n,i,d,v,ch,src,sk} form)
            sync(m) {
              if (m.speed && m.speed !== st.speed) st.speed = m.speed;
              if (m.motion === "ps3" || m.motion === "smooth") st.motion = m.motion;
              if (typeof m.startDelay === "number") st.startDelay = Math.max(0, m.startDelay);
              if (typeof m.dwell === "number") st.dwell = Math.max(0, m.dwell);
              const ol = Array.isArray(m.opt) ? m.opt.filter((l) => l && Array.isArray(l.items)) : [];
              const oldOptDepth = st.opt.length, newOptDepth = ol.length;
              st.opt = ol;
              if (ol.length) st.optLast = ol;
              if (newOptDepth !== oldOptDepth) {
                if (newOptDepth > oldOptDepth) {
                  for (let k = oldOptDepth; k < newOptDepth; k++) {
                    st.optEpoch[k]++;
                    st.optOpenedAt[k] = Date.now();
                  }
                  subRun(optV, newOptDepth);
                } else {
                  subRun(optV, newOptDepth);
                }
              }
              if (ol.length >= 2) {
                const longest = Math.max.apply(null, ol[0].items.map((it) => String(it.n || "").length));
                st.optNest = Math.max(OPT.nest, Math.min(400, Math.round(longest * OPT.size * 0.62) + OPT.textX + 50));
              }
              const inf = m.info && Array.isArray(m.info.rows) ? m.info : null;
              const wasInfo = !!st.info;
              st.info = inf;
              if (inf) st.infoLast = inf;
              if (!!inf !== wasInfo) {
                if (inf) {
                  st.infoEpoch++;
                  st.infoOpenedAt = Date.now();
                  subRun(infoV, 1);
                } else subRun(infoV, 0);
              }
              const lastDepth = st.stack.length;
              if (m.ci !== st.ci) {
                exitColumn(st.ci, m.ci);
                st.ci = m.ci;
                step(catPos, m.ci, "CAT_ANIM_MS");
                markMove();
              }
              for (let c = 0; c < cats.length; c++) {
                const n = Math.max(0, m.sel[c] || 0);
                if (n !== st.sel[c]) {
                  const jump = Math.abs(n - st.sel[c]) > 1 || c !== st.ci;
                  st.sel[c] = n;
                  if (jump) {
                    rootPos[c].stopAnimation && rootPos[c].stopAnimation();
                    rootPos[c].setValue(n);
                  } else {
                    step(rootPos[c], n, "ITEM_ANIM_MS");
                    markMove();
                  }
                }
              }
              const want = m.stack.length;
              if (want > lastDepth) {
                for (let k = lastDepth; k < want; k++) {
                  st.stack.push(newFrame(m.stack[k].items, m.stack[k].idx, m.stack[k].title));
                  openFx(k, k === want - 1);
                }
              } else if (want < lastDepth) {
                for (let k = lastDepth - 1; k >= want; k--) closeFx(k, k === want);
              }
              for (let k = 0; k < Math.min(m.stack.length, st.stack.length); k++) {
                const f = st.stack[k], mf = m.stack[k];
                f.items = mf.items;
                if (mf.idx !== f.idx) {
                  f.idx = mf.idx;
                  step(f.pos, mf.idx, "ITEM_ANIM_MS");
                  markMove();
                }
              }
            },
            moveCat(dir) {
              if (st.stack.length) return;
              const n = st.ci + dir;
              if (n < 0 || n >= cats.length) return;
              exitColumn(st.ci, n);
              st.ci = n;
              step(catPos, n, "CAT_ANIM_MS");
              markMove();
              notify();
            },
            moveItem(dir) {
              const items = curItems(), n = curIdx() + dir;
              if (n < 0 || n >= items.length) return;
              const f = frame();
              if (f) {
                f.idx = n;
                step(f.pos, n, "ITEM_ANIM_MS");
              } else {
                st.sel[st.ci] = n;
                step(rootPos[st.ci], n, "ITEM_ANIM_MS");
              }
              markMove();
              notify();
            },
            enter() {
              const items = curItems(), it = items[curIdx()];
              if (!it) return;
              if (Array.isArray(it.ch) && it.ch.length) {
                st.stack.push(newFrame(it.ch, 0, it.n, curIdx()));
                openFx(st.stack.length - 1, true);
                notify();
              } else if (opts.onActivate) opts.onActivate(it, api.path());
            },
            back() {
              if (!st.stack.length) return;
              closeFx(st.stack.length - 1, true);
              notify();
            },
            path() {
              return [cats[st.ci].id].concat(st.stack.map((f) => f.title));
            },
            // D-pad semantics of xmb-web: left/right = categories, or back/enter inside a submenu
            press(key) {
              switch (key) {
                case "left":
                  return st.stack.length ? api.back() : api.moveCat(-1);
                case "right":
                  return st.stack.length ? (curItems()[curIdx()] || {}).ch ? api.enter() : void 0 : api.moveCat(1);
                case "up":
                  return api.moveItem(-1);
                case "down":
                  return api.moveItem(1);
                case "enter":
                  return api.enter();
                case "back":
                  return api.back();
              }
            }
          };
          const held = {};
          api.keyDown = (key) => {
            if (held[key]) return;
            api.press(key);
            if (key === "enter" || key === "back") {
              held[key] = { t: 0 };
              return;
            }
            const iv2 = core.repeatIntervals(40);
            let k = 0;
            const h2 = held[key] = { t: null };
            const tick = () => {
              k++;
              if (!held[key]) return;
              api.press(key);
              h2.t = setTimeout(tick, iv2[Math.min(k, iv2.length - 1)]);
            };
            h2.t = setTimeout(tick, iv2[0]);
          };
          api.keyUp = (key) => {
            if (held[key]) {
              clearTimeout(held[key].t);
              delete held[key];
            }
          };
          const rep = {};
          const iv = core.repeatIntervals(40);
          const handle = (key) => (e) => {
            const type = e && e.keyEventType, t = Date.now();
            if (!type || type === "Down") {
              rep[key] = { n: 0, t };
              api.press(key);
            } else if (type === "Repeat" && (key === "left" || key === "right" || key === "up" || key === "down")) {
              const r = rep[key] || (rep[key] = { n: 0, t });
              if (t - r.t >= iv[Math.min(r.n + 1, iv.length - 1)]) {
                r.n++;
                r.t = t;
                api.press(key);
              }
            }
            if (e && typeof e === "object") {
              try {
                e.__xmb = true;
              } catch (x) {
              }
            }
            return false;
          };
          api.keyProps = () => ({
            onLeftKeyDown: handle("left"),
            onRightKeyDown: handle("right"),
            onUpKeyDown: handle("up"),
            onDownKeyDown: handle("down"),
            onBackKeyDown: handle("back"),
            onPress: () => api.press("enter")
          });
          api.ps3Curve = ps3Curve;
          api.revealSettleMs = revealSettleMs;
          return api;
        }
        const FILL = { position: "absolute", left: 0, top: 0, width: V.W, height: V.H };
        const lh = (px) => Math.round(px * 1.25);
        function useVersion(ctl) {
          const [v, setV] = React.useState(0);
          React.useEffect(() => ctl.subscribe(setV), [ctl]);
          return v;
        }
        /* V83.12: begin each submenu's ONE native opacity fade in the final
         * 150 ms of the panel's visible opening motion, not after it settles.
         * Use the same PS3 curve's visual-settle time as V83.9; avoid waiting
         * for its almost-invisible tail or for JS completion callbacks.
         * Late-mounted rows start fading immediately on mount. */
        function MountedReveal(p) {
          const ref = React.useRef(null);
          if (!ref.current) ref.current = new Animated.Value(0);
          React.useEffect(() => {
            const v = ref.current;
            if (v.stopAnimation) v.stopAnimation();
            v.setValue(0);
            const speed = p.speed || 1;
            // Fade lasts 245 ms at 1x speed and begins 150 ms before visual settle.
            const duration = Math.max(195, Math.min(390, Math.round(245 * speed)));
            const fadeStartMs = Math.max(0, p.settleMs - 150);
            const elapsed = p.openedAt > 0 ? Math.max(0, Date.now() - p.openedAt) : p.settleMs;
            const remaining = Math.max(0, Math.round(fadeStartMs - elapsed));
            const animation = Animated.timing(v, {
              toValue: 1,
              duration,
              delay: remaining,  // Starts 150 ms before panel settle; never waits if mounted late.
              easing: core.ease.smooth,
              useNativeDriver: nativeDriver
            });
            animation.start();
            return () => {
              if (animation.stop) animation.stop();
              else if (v.stopAnimation) v.stopAnimation();
            };
          }, [p.epoch]);
          return h(Animated.View, { pointerEvents: "none",
            style: Object.assign({}, FILL, { opacity: ref.current }) }, p.children);
        }
        function Label(p) {
          const sn = snap(p.size), L = p.lh ? Math.round(p.lh * sn.size / p.size) : lh(sn.size), lines = p.lines || 1, W = p.width || 900;
          const k = sn.scale, al = p.align || "left";
          const tx = al === "right" ? W / 2 * (1 - k) : al === "center" ? 0 : -W / 2 * (1 - k);
          const text = h(Text, { onLayout: p.onLayout, numberOfLines: lines, style: Object.assign({ fontFamily: font, fontSize: sn.size, lineHeight: L, color: p.color, textAlign: al }, env.fakeGlow ? {} : p.shadow || {}) }, p.text);
          const box = Math.abs(k - 1) > 0.02 ? h(View, { pointerEvents: "none", style: { width: W, height: L * lines, transform: [{ translateX: tx }, { scale: k }] } }, text) : text;
          return h(Animated.View, { pointerEvents: "none", style: { position: "absolute", left: p.left, top: (p.top || 0) - L / 2, width: W, height: L * lines, opacity: p.opacity } }, box);
        }
        const GLOW_RINGS = env.fakeGlow ? env.fakeGlow.rings || [{ r: 3, a: 0.05, n: 8 }, { r: 6, a: 0.04, n: 10 }, { r: 10, a: 0.025, n: 12 }] : null;
        const GLOW_N = env.fakeGlow ? env.fakeGlow.n || 6 : 0;
        const GLOW_IMG = env.glowImg || null, GLOW_H = 110, GLOW_CAP = 80, GLOW_PAD = 48;
        const glowW = {}, glowMeta = {}, glowOk = {}, glowRetry = {};
        const GlowPic = memo(function GlowPic2(p) {
          const [ok, setOk] = React.useState(!!glowOk[p.path]);
          return h(
            View,
            { pointerEvents: "none", style: { position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h, opacity: ok ? 1 : 0 } },
            h(Image, {
              source: { uri: "file://" + p.path },
              resizeMode: "stretch",
              style: { width: p.w, height: p.h },
              onLoad: () => {
                glowOk[p.path] = true;
                setOk(true);
              },
              onError: () => {
                delete glowOk[p.path];
                setOk(false);
                if (p.onFail) p.onFail();
              }
            })
          );
        }, (a, b) => a.path === b.path && a.left === b.left && a.top === b.top && a.w === b.w && a.h === b.h);
        const glowAgain = (gkey, ask, set) => {
          if (glowRetry[gkey]) {
            glowMeta[gkey] = false;
            set(false);
            return;
          }
          glowRetry[gkey] = true;
          ask((info) => {
            glowMeta[gkey] = info || false;
            set(glowMeta[gkey] ? Object.assign({}, glowMeta[gkey], { again: 1 }) : false);
          });
        };
        const TitleLabel = memo(function TitleLabel2(p) {
          const sa = snap(V.ITEM_TEXT_SIZE), sb = snap(V.ITEM_TEXT_ACTIVE_SIZE), W = p.width || 900;
          const two = sa.size !== sb.size || sa.scale !== sb.scale;
          const La = lh(sa.size), Lb = lh(sb.size);
          const tr = useMemo(() => {
            if (two && !p.pos) {
              const K2 = sb.size * sb.scale / (sa.size * sa.scale), f = !!p.focusedStatic;
              return { a: f ? 0 : 1, b: f ? 1 : 0, K: K2, k: f ? K2 : 1, tx: f ? -W / 2 * (1 - K2) : 0 };
            }
            if (p.pos && two) {
              const K2 = sb.size * sb.scale / (sa.size * sa.scale);
              return {
                a: interp(p.pos, core.forElement(p.i, [[-1, 1], [-0.6, 1], [0, 0], [0.6, 1], [1, 1]])),
                b: interp(p.pos, core.forElement(p.i, [[-1, 0], [-0.6, 0], [0, 1], [0.6, 0], [1, 0]])),
                K: K2,
                k: interp(p.pos, core.forElement(p.i, [[-1, 1], [0, K2], [1, 1]])),
                tx: interp(p.pos, core.forElement(p.i, [[-1, 0], [0, -W / 2 * (1 - K2)], [1, 0]]))
              };
            }
            return null;
          }, [p.pos, p.i, two, !!p.focusedStatic]);
          const baseB = { fontFamily: font, fontSize: sb.size, lineHeight: Lb, width: W };
          const [gw, setGw] = React.useState(glowW[p.text + "|" + sb.size] || 0);
          const gkey = p.text + "|" + sb.size + "|" + Lb;
          const [gi, setGi] = React.useState(glowMeta[gkey] === void 0 ? null : glowMeta[gkey]);
          React.useEffect(() => {
            if (!p.glow || !env.glowFor) return void 0;
            if (glowMeta[gkey] !== void 0) {
              if (glowMeta[gkey] !== gi) setGi(glowMeta[gkey]);
              return void 0;
            }
            let live = true;
            env.glowFor(p.text, sb.size, Lb, (info) => {
              glowMeta[gkey] = info || false;
              if (live) setGi(glowMeta[gkey]);
            });
            return () => {
              live = false;
            };
          }, [!!p.glow, gkey]);
          const onGlowLayout = (probe) => (e) => {
            if (probe) probe(e);
            const w = Math.round(e && e.nativeEvent && e.nativeEvent.layout ? e.nativeEvent.layout.width : 0);
            if (w > 0 && w < W - 2 && Math.abs(w - gw) > 2) {
              glowW[p.text + "|" + sb.size] = w;
              setGw(w);
            }
          };
          const estW = Math.min(W, Math.round(String(p.text).length * sb.size * 0.52));
          const copies = useMemo(() => {
            if (env.glowFor && p.glow && gi) {
              const sx = gw && gi.tw ? Math.min(1.12, Math.max(0.88, gw / gi.tw)) : 1;
              return [h(GlowPic, {
                key: "gt" + (gi.again ? "r" : ""),
                path: gi.p,
                left: -Math.round(gi.pad * sx),
                top: -gi.pad,
                w: Math.round(gi.w * sx),
                h: gi.h,
                onFail: () => glowAgain(gkey, (cb) => env.glowFor(p.text, sb.size, Lb, cb), setGi)
              })];
            }
            if (env.glowFor && p.glow && gi === null) return null;
            if (GLOW_IMG && p.glow) {
              const tw = gw || estW, top = Lb / 2 - GLOW_H / 2, mid = Math.max(0, tw - 64);
              const img = (key, src, left, width) => h(Image, { key, source: src, resizeMode: "stretch", style: { position: "absolute", left, top, width, height: GLOW_H } });
              return [img("gl", GLOW_IMG.l, -GLOW_PAD, GLOW_CAP), mid ? img("gm", GLOW_IMG.m, 32, mid) : null, img("gr", GLOW_IMG.r, tw - 32, GLOW_CAP)];
            }
            if (!(p.glow && GLOW_RINGS)) return null;
            const cop = [];
            GLOW_RINGS.forEach((ring, ri) => {
              const cnt = ring.n || GLOW_N;
              for (let q = 0; q < cnt; q++) {
                const ang = q / cnt * Math.PI * 2 + ri * 0.5;
                cop.push(h(Text, { key: "g" + ri + "_" + q, numberOfLines: 1, style: Object.assign({ position: "absolute", left: Math.cos(ang) * ring.r, top: Math.sin(ang) * ring.r, color: "rgba(255,255,255," + ring.a + ")" }, baseB) }, p.text));
              }
            });
            return cop;
          }, [!!p.glow, p.text, sb.size, gw, gi]);
          const layer = (key, sn, L, opacity, probe, glowKids2, shadow) => {
            const k = sn.scale;
            const measure = !!(key === "b" && p.glow && (GLOW_IMG || env.glowFor));
            const text = h(Text, {
              key: "t",
              onLayout: measure ? onGlowLayout(probe ? layout(probe) : null) : probe ? layout(probe) : void 0,
              numberOfLines: 1,
              style: Object.assign({ color: "#fff", fontFamily: font, fontSize: sn.size, lineHeight: L }, measure ? { alignSelf: "flex-start", maxWidth: W } : { width: W }, shadow)
            }, p.text);
            const inner = glowKids2 ? [glowKids2, text] : text;
            const box = k !== 1 ? h(View, { pointerEvents: "none", style: { width: W, height: L, transform: [{ translateX: -W / 2 * (1 - k) }, { scale: k }] } }, inner) : inner;
            return h(Animated.View, { key, pointerEvents: "none", style: { position: "absolute", left: p.left, top: (p.top || 0) - L / 2, width: W, height: L, opacity } }, box);
          };
          const glowKids = copies ? h(Animated.View, { key: "glow", pointerEvents: "none", style: { position: "absolute", left: 0, top: 0, width: W, height: Lb, opacity: p.glowOpacity } }, copies) : null;
          const shB = env.fakeGlow ? null : p.glow ? SH_GLOW : SH_INACTIVE, shA = env.fakeGlow ? null : SH_INACTIVE;
          const wrapOp = p.opacity;
          const kids = [];
          if (!two) kids.push(layer("b", sb, Lb, null, p.probe, glowKids, shB));
          else {
            const inWrap = (key, sn, L, opacity, probe, gk, shadow, k, top) => {
              const measure = !!(key === "b" && p.glow && (GLOW_IMG || env.glowFor));
              const text = h(Text, {
                key: "t",
                onLayout: measure ? onGlowLayout(probe ? layout(probe) : null) : probe ? layout(probe) : void 0,
                numberOfLines: 1,
                style: Object.assign({ color: "#fff", fontFamily: font, fontSize: sn.size, lineHeight: L }, measure ? { alignSelf: "flex-start", maxWidth: W } : { width: W }, shadow)
              }, p.text);
              const inner = gk ? [gk, text] : text;
              const box = Math.abs(k - 1) > 1e-4 ? h(View, { pointerEvents: "none", style: { width: W, height: L, transform: [{ translateX: -W / 2 * (1 - k) }, { scale: k }] } }, inner) : inner;
              return h(Animated.View, { key, pointerEvents: "none", style: { position: "absolute", left: 0, top, width: W, height: L, opacity } }, box);
            };
            kids.push(h(
              Animated.View,
              { key: "w", pointerEvents: "none", style: { position: "absolute", left: p.left, top: (p.top || 0) - Lb / 2, width: W, height: Lb, transform: [{ translateX: tr.tx }, { scale: tr.k }] } },
              inWrap("a", sa, La, tr.a, null, null, shA, sa.scale, (Lb - La) / 2),
              inWrap("b", sb, Lb, tr.b, p.probe, glowKids, shB, sb.scale / tr.K, 0)
            ));
          }
          return h(Animated.View, { pointerEvents: "none", style: { position: "absolute", left: 0, top: 0, width: V.W, height: 0, opacity: wrapOp } }, kids);
        }, (a, b) => a.text === b.text && a.i === b.i && a.pos === b.pos && a.focusedStatic === b.focusedStatic && a.left === b.left && a.top === b.top && a.opacity === b.opacity && !!a.glow === !!b.glow && a.glowOpacity === b.glowOpacity && a.probe === b.probe);
        const SH_INACTIVE = { textShadowColor: "rgba(0,0,0,0.4)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 };
        const SH_GLOW = { textShadowColor: "rgba(255,255,255,0.85)", textShadowOffset: { width: 0, height: 0 }, textShadowRadius: V.TEXT_GLOW_RADIUS };
        const SH_GLOW_IN = { textShadowColor: "rgba(255,255,255,0.5)", textShadowOffset: { width: 0, height: 0 }, textShadowRadius: V.TEXT_GLOW_INNER_RADIUS };
        const artState = {};
        const checkArt = (uri, cb) => {
          if (!env.artCheck) {
            cb("ok");
            return;
          }
          const c = artState[uri];
          if (c === "ok" || c === "bad") {
            cb(c);
            return;
          }
          if (Array.isArray(c)) {
            c.push(cb);
            return;
          }
          artState[uri] = [cb];
          env.artCheck(uri, (r) => {
            const q = artState[uri];
            artState[uri] = r === "ok" ? "ok" : "bad";
            q.forEach((f) => f(artState[uri]));
          });
        };
        const resolveArt = (cands, cb) => {
          let i = 0;
          const next = () => {
            if (i >= cands.length) {
              cb(null);
              return;
            }
            const u = cands[i++];
            checkArt(u, (r) => r === "ok" ? cb(u) : next());
          };
          next();
        };
        function CinfoBg(p) {
          const ctl = p.ctl, T = spec.timings, map = spec.hoverBg || {};
          useVersion(ctl);
          const targetOf = () => {
            const cur = ctl.current(), item = cur.item;
            if (!item) return null;
            if (ctl.state.stack.length !== 0 && !(item.art && item.art.length)) return null;
            if (item.art && item.art.length) return { key: "g:" + (item.gid || item.n), cands: item.art, item, game: true };
            if (map[item.n] && env.assetSource) return { key: "p:" + map[item.n], cands: [env.assetSource(map[item.n]).uri], item };
            return null;
          };
          const a = React.useRef(null);
          if (!a.current) a.current = new Animated.Value(0);
          const shown = React.useRef(""), timer = React.useRef(null), tgt = React.useRef(null), curKey = React.useRef(null);
          const uriRef = React.useRef(null), loaded = React.useRef({}), res = React.useRef({ key: "", done: false, uri: null, waiters: [] });
          const [uri, setUriState] = React.useState(null);
          const setUri = (u) => {
            uriRef.current = u;
            setUriState(u);
          };
          const fadeIn = (t) => {
            Animated.timing(a.current, { toValue: t.game ? 1 : T.HOVER_BG_MAX_ALPHA, duration: T.HOVER_BG_FADE_IN_MS, useNativeDriver: nativeDriver }).start();
            if (t.game) ctl.setDim(true);
          };
          const reveal = (u, t) => {
            a.current.setValue(0);
            if (uriRef.current === u && loaded.current[u]) fadeIn(t);
            else setUri(u);
          };
          const retarget = () => {
            const target = targetOf(), key = target ? target.key : "";
            tgt.current = target;
            if (key === curKey.current) return;
            curKey.current = key;
            clearTimeout(timer.current);
            if (shown.current && shown.current !== key) {
              shown.current = "";
              Animated.timing(a.current, { toValue: 0, duration: T.HOVER_BG_FADE_OUT_MS, useNativeDriver: nativeDriver }).start();
              ctl.setDim(false);
              if (env.onDwellEnd) env.onDwellEnd();
            }
            if (target && shown.current !== key) {
              const r = res.current = { key, done: false, uri: null, waiters: [] };
              const dw = ctl.state.dwell >= 0 ? ctl.state.dwell : T.HOVER_BG_DWELL_MS;
              timer.current = setTimeout(() => {
                const t = tgt.current;
                if (!t || t.key !== key) return;
                shown.current = key;
                if (env.onDwell) env.onDwell(t.item.raw || t.item);
                const go = (u) => {
                  if (shown.current !== key || !u) return;
                  reveal(u, t);
                };
                if (r.done) go(r.uri);
                else r.waiters.push(go);
              }, dw);
              setTimeout(() => {
                if (curKey.current !== key) return;
                (target.game ? resolveArt : (c, cb) => cb(c[0]))(target.cands, (u) => {
                  r.done = true;
                  r.uri = u;
                  r.waiters.forEach((f) => f(u));
                  r.waiters = [];
                });
              }, Math.min(150, Math.max(0, dw - 60)));
            }
          };
          ctl.bgRetarget = retarget;
          React.useEffect(() => {
            retarget();
          });
          React.useEffect(() => () => {
            clearTimeout(timer.current);
            ctl.bgRetarget = null;
          }, []);
          if (!uri) return null;
          const onLoad = () => {
            loaded.current[uriRef.current] = true;
            const t = tgt.current;
            if (!t || shown.current !== t.key || res.current.uri !== uriRef.current) return;
            fadeIn(t);
          };
          const onError = () => {
            const bad = uriRef.current;
            if (bad) artState[bad] = "bad";
            const t = tgt.current;
            if (!t || shown.current !== t.key) {
              setUri(null);
              return;
            }
            resolveArt(t.cands, (u) => {
              if (tgt.current && tgt.current.key === t.key && shown.current === t.key && u && u !== bad) {
                res.current.uri = u;
                reveal(u, t);
              } else setUri(null);
            });
          };
          return h(
            Animated.View,
            { pointerEvents: "none", style: Object.assign({}, FILL, { opacity: a.current }) },
            h(Image, { source: { uri }, resizeMode: "cover", onLoad, onError, style: { width: V.W, height: V.H } }),
            h(View, { style: Object.assign({}, FILL, { backgroundColor: "rgba(0,0,0,0.22)" }) })
          );
        }
        const CatItem = memo(function CatItem2(p) {
          const { ctl, c, i, act } = p;
          const sn = snap(V.CAT_LABEL_SIZE), CL = lh(sn.size), box = V.CAT_ICON_ACTIVE, half = box / 2;
          const n = useMemo(() => {
            const CS = core.CAT_SUB;
            const subScale = interp(ctl.catSub, act ? CS.scale : CS.otherScale), subA = interp(ctl.catSub, CS.alpha);
            const tx = A.add(A.add(interp(ctl.catPos, core.CAT.x(i)), interp(ctl.catSub, act ? CS.shiftX : CS.otherShiftX)), ctl.slotDx[i]);
            const ty = A.add(interp(ctl.catPos, core.CAT.y(i), -half), interp(ctl.catSub, act ? CS.shiftY : CS.otherShiftY));
            let alpha = A.mul(A.mul(interp(ctl.catPos, core.CAT.alpha(i)), subA), ctl.slotAlpha[i]);
            if (!act) alpha = A.mul(alpha, interp(ctl.catSub, core.CAT_SUB.otherAlpha));
            const scale = A.mul(interp(ctl.catPos, core.CAT.scale(i, c.sk || c.icon)), subScale);
            const labelA = A.mul(interp(ctl.catPos, core.CAT.labelAlpha(i)), act ? interp(ctl.catSub, core.CAT_SUB.labelAlpha) : null);
            const mid = iconMip(c.icon, "_m");
            const big = mid ? interp(ctl.catPos, core.forElement(i, [[-1, 0], [-0.7, 0], [0, 1], [0.7, 0], [1, 0]])) : null;
            const small = mid ? interp(ctl.catPos, core.forElement(i, [[-1, 1], [-0.7, 1], [0, 0], [0.7, 1], [1, 1]])) : null;
            return { tx, ty, alpha, scale, labelA, mid, big, small };
          }, [ctl, i, act, c.sk || c.icon]);
          const txt = h(Text, { onLayout: act ? layout("full-cat") : void 0, numberOfLines: 1, style: { width: 400, textAlign: "center", fontFamily: font, fontSize: sn.size, lineHeight: CL, color: "rgb(225,210,235)" } }, c.name);
          return h(
            React.Fragment,
            null,
            h(
              Animated.View,
              { pointerEvents: "none", style: { position: "absolute", left: -half, top: 0, width: box, height: box, opacity: n.alpha, transform: [{ translateX: n.tx }, { translateY: n.ty }, { scale: n.scale }] } },
              shifted(c.icon, box, n.mid ? [
                h(Animated.View, { key: "b", pointerEvents: "none", style: { position: "absolute", left: 0, top: 0, width: box, height: box, opacity: n.big } }, h(Image, { source: env.iconSource(c.icon), resizeMode: "contain", style: { width: box, height: box } })),
                h(Animated.View, { key: "s", pointerEvents: "none", style: { position: "absolute", left: 0, top: 0, width: box, height: box, opacity: n.small } }, h(Image, { source: n.mid, resizeMode: "contain", style: { width: box, height: box } }))
              ] : h(Image, { source: env.iconSource(c.icon), resizeMode: "contain", style: { width: box, height: box } }))
            ),
            h(
              Animated.View,
              { pointerEvents: "none", style: { position: "absolute", left: -200, top: 0, width: 400, height: 40, opacity: n.labelA, transform: [{ translateX: n.tx }] } },
              h(View, { style: { position: "absolute", left: 0, top: V.CAT_LABEL_Y - 2, width: 400, height: CL, transform: Math.abs(sn.scale - 1) > 0.02 ? [{ scale: sn.scale }] : [] } }, txt)
            )
          );
        }, (a, b) => a.ctl === b.ctl && a.c === b.c && a.i === b.i && a.act === b.act && a.name === b.name && a.icon === b.icon);
        function CategoryBar(p) {
          const { ctl } = p, st = ctl.state;
          return h(View, { style: FILL, pointerEvents: "none" }, ctl.categories.map((c, i) => h(CatItem, { key: "s" + c.id, ctl, c, i, act: i === st.ci, name: c.name, icon: c.icon })));
        }
        const K = (ctl, v) => interp(ctl.zero, constTr(v));
        const SUBD = (() => {
          const P3 = core.SUB.PS3, E = [-30, -1, 0, 1, 30];
          const fullA = (d) => d === 0 ? V.ALPHA_FOCUS : V.ALPHA_INACTIVE, setA = (d) => d === 0 ? P3.parentAlpha : P3.sibAlpha;
          const ratio = [];
          for (let e = -14; e <= 14; e++) ratio.push([e, setA(Math.abs(e)) / fullA(Math.abs(e)) - 1]);
          return {
            dy: (i) => core.forElement(i, E.map((e) => [e, core.SUB.sibDy(e)])),
            dx: (i) => core.forElement(i, [[-1, core.SUB.SIB_X - V.ITEM_ICON_X], [0, V.PARENT_COL_X - V.ITEM_ICON_X], [1, core.SUB.SIB_X - V.ITEM_ICON_X]]),
            da: (i) => core.forElement(i, ratio),
            ds: (i, sk, compact) => {
              const sm = (compact ? P3.childIconSmall : V.ITEM_ICON_SIZE) / V.ITEM_ICON_ACTIVE * core.iconScale(sk), d = sm * (P3.sibScale - 1);
              return core.forElement(i, [[-1, d], [0, 0], [1, d]]);
            }
          };
        })();
        const levels = {};
        const GameIcon = memo(function GameIcon2(p) {
          const [lv, setLv] = React.useState(levels[p.src] || null);
          const [alt, setAlt] = React.useState(0);
          const srcs = [p.src].concat(p.alts || []);
          const [shown, setShown] = React.useState(-1);
          const shownRef = React.useRef(-1);
          shownRef.current = shown;
          React.useEffect(() => {
            if (lv || !p.under || alt >= srcs.length || typeof setTimeout !== "function") return void 0;
            const t = setTimeout(() => {
              if (shownRef.current !== alt) setAlt((a) => a === alt ? alt + 1 : a);
            }, 3e3);
            return () => clearTimeout(t);
          }, [alt, lv, p.under, srcs.length]);
          React.useEffect(() => {
            if (!/^file:\/\//.test(p.src)) return void 0;
            if (levels[p.src] !== void 0) {
              if (levels[p.src] !== lv) setLv(levels[p.src]);
              return void 0;
            }
            let live = true;
            env.iconLevels(p.src, (r) => {
              levels[p.src] = r || null;
              if (live && r) setLv(r);
            });
            return () => {
              live = false;
            };
          }, [p.src]);
          const img = (key, uri, op, onError, onLoad) => h(
            Animated.View,
            { key, pointerEvents: "none", style: { position: "absolute", left: 0, top: 0, width: p.box, height: p.box, opacity: op } },
            h(Image, { source: typeof uri === "string" ? { uri } : uri, resizeMode: "contain", onError, onLoad, style: { width: p.box, height: p.box } })
          );
          if (!lv) {
            if (alt >= srcs.length || p.thumb) return img("f", env.iconSource(p.fallback), null);
            if (p.under) return [img("u", env.iconSource(p.fallback), null), img("o" + alt, srcs[alt], shown === alt ? null : 0, () => setAlt(alt + 1), () => setShown(alt))];
            return img("o" + alt, srcs[alt], null, () => setAlt(alt + 1));
          }
          return p.big ? [img("b", "file://" + lv.b, p.big), img("s", "file://" + lv.s, p.small)] : img("s", "file://" + lv.s, null);
        }, (a, b) => a.src === b.src && a.big === b.big && a.small === b.small && a.box === b.box && (a.alts || []).join("|") === (b.alts || []).join("|"));
        const BADGE = { x: 540, w: 112, h: 25 }; // V83.20: 20 px closer to game details
        const Row = memo(function Row2(p) {
          const { ctl, it, i, pos, near, focused, compact, collapse, collapseIdx, fast } = p;
          const item = it;
          const iconBox = V.ITEM_ICON_ACTIVE, half = iconBox / 2, sk = scaleKey(item);
          const textX = compact ? core.SUB.PS3.childTextX : V.ITEM_TEXT_X;
          const n = useMemo(() => {
            let ty, tx = null, alpha, iconScale, textMul = null, icBig = null, icSmall = null, dimMul = null;
            const mip = !item.src ? iconMip(item.i, "_s") : null, lv = !!(item.src && env.iconLevels);
            if (collapse) {
              const P = core.SUB.parent(i, collapseIdx);
              ty = interp(ctl.colT, P.y);
              tx = interp(ctl.colT, { inputRange: [0, 1], outputRange: [0, (P.sel ? V.PARENT_COL_X : core.SUB.SIB_X) - V.ITEM_ICON_X] });
              alpha = interp(ctl.colT, P.iconAlpha);
              const s0 = (P.sel ? 1 : V.ITEM_ICON_SIZE / iconBox) * core.iconScale(sk), s1 = (P.sel ? 1 : V.ITEM_ICON_SIZE / iconBox * core.SUB.PS3.sibScale) * core.iconScale(sk);
              iconScale = interp(ctl.colT, { inputRange: [0, 1], outputRange: [s0, s1] });
              textMul = interp(ctl.colT, { inputRange: [0, 1], outputRange: [1, 0] });
              if ((mip || lv) && P.sel) {
                icBig = K(ctl, 1);
                icSmall = K(ctl, 0);
              }
            } else {
              const so = compact ? { sub: true } : void 0;
              ty = interp(pos, core.ITEM.y(i, so));
              alpha = interp(pos, core.ITEM.alpha(i, so));
              iconScale = compact ? interp(pos, core.ITEM.iconScale(i, sk, { activeIcon: core.SUB.PS3.childIcon, inactiveIcon: core.SUB.PS3.childIconSmall })) : interp(pos, core.ITEM.iconScale(i, sk));
              if (compact) iconScale = A.mul(iconScale, core.SUB.PS3.childIcon / iconBox);
              if (p.shiftX) tx = p.shiftX;
              if (p.alphaMul) alpha = A.mul(alpha, p.alphaMul);
              if (p.sub) {
                const cf = p.subT || ctl.colT;
                ty = A.add(ty, A.mul(cf, interp(pos, SUBD.dy(i))));
                tx = A.mul(cf, interp(pos, SUBD.dx(i)));
                alpha = A.mul(alpha, A.add(A.mul(cf, interp(pos, SUBD.da(i))), K(ctl, 1)));
                iconScale = A.add(iconScale, A.mul(cf, interp(pos, SUBD.ds(i, sk, compact))));
                textMul = p.subTxt || ctl.subText;
              }
              if (!compact) dimMul = interp(A.mul(ctl.dimV, interp(pos, core.ITEM.inactiveOpacity(i))), { inputRange: [0, 1], outputRange: [1, 0] });
              if ((mip || lv) && !compact) {
                icBig = interp(pos, core.forElement(i, [[-1, 0], [-0.7, 0], [0, 1], [0.7, 0], [1, 0]]));
                icSmall = interp(pos, core.forElement(i, [[-1, 1], [-0.7, 1], [0, 0], [0.7, 1], [1, 1]]));
              }
            }
            const ttlOp = A.mul(collapse ? textMul : A.mul(dimMul, textMul), ctl.optTxt);
            return { ty, tx, alpha, iconScale, textMul, mip, lv, icBig, icSmall, dimMul, ttlOp };
          }, [ctl, i, sk, pos, compact, collapse, collapse ? collapseIdx : 0, p.shiftX, p.alphaMul, !!p.sub, p.subT, p.subTxt]);
          const glowOn = (collapse ? focused && !!p.fadeIn : near) && !p.noGlow && !p.ghostOnly && !fast;
          const glowA = useMemo(
            () => glowOn ? A.mul(A.mul(collapse ? p.fadeIn : interp(pos, core.ITEM.activeOpacity(i)), ctl.pulse ? interp(ctl.pulse, PULSE_TR) : null), A.mul(collapse ? null : n.textMul, ctl.optGlow)) : void 0,
            [glowOn, pos, i, ctl, collapse, p.fadeIn, n.textMul]
          );
          const wantDesc = !!((item.d || item.b) && (collapse ? focused && !!p.fadeIn : near) && !fast && !p.ghostOnly);
          const descA = useMemo(() => {
            if (!wantDesc) return null;
            if (collapse) return { a: A.mul(interp(p.fadeIn, { inputRange: [0, 1], outputRange: [0, 0.7] }), ctl.optTxt), b: null };
            const b = interp(pos, core.ITEM.descInactive(i));
            return { a: A.mul(A.mul(interp(pos, core.ITEM.descActive(i)), n.textMul), ctl.optTxt), b: A.mul(A.mul(n.dimMul ? A.mul(b, n.dimMul) : b, n.textMul), ctl.optTxt) };
          }, [wantDesc, pos, i, n.dimMul, collapse, p.fadeIn, n.textMul]);
          const pulseA = useMemo(() => focused && !collapse && !p.ghostOnly && ctl.pulse && !env.fakeGlow ? interp(ctl.pulse, { inputRange: [0, 1], outputRange: [V.PULSE_INNER_MIN, V.PULSE_INNER_MAX] }) : null, [focused && !collapse, ctl]);
          const rowStyle = { position: "absolute", left: 0, top: 0, width: V.W, height: 0, opacity: n.alpha, transform: [{ translateY: n.ty }].concat(n.tx ? [{ translateX: n.tx }] : []) };
          const text = item.n;
          const kids = [];
          const bigImg = (op) => h(
            Animated.View,
            { key: "ib", pointerEvents: "none", style: { position: "absolute", left: 0, top: 0, width: iconBox, height: iconBox, opacity: op } },
            h(Image, { source: iconSrc(item), resizeMode: "contain", style: { width: iconBox, height: iconBox } })
          );
          const smallImg = (op) => h(
            Animated.View,
            { key: "is", pointerEvents: "none", style: { position: "absolute", left: 0, top: 0, width: iconBox, height: iconBox, opacity: op } },
            h(Image, { source: n.mip, resizeMode: "contain", style: { width: iconBox, height: iconBox } })
          );
          const iconKids = n.lv ? h(GameIcon, { key: "gi", src: item.src, alts: item.alts, under: !!item.alts, thumb: !!item.thumb, fallback: item.i, big: n.icBig, small: n.icSmall, box: iconBox }) : !n.mip ? bigImg(null) : n.icBig ? [bigImg(n.icBig), smallImg(n.icSmall)] : smallImg(null);
          kids.push(h(Animated.View, { key: "ic", pointerEvents: "none", style: { position: "absolute", left: V.ITEM_ICON_X - half, top: -half, width: iconBox, height: iconBox, transform: [{ scale: n.iconScale }] } }, item.src ? iconKids : shifted(item.i, iconBox, iconKids)));
          kids.push(h(TitleLabel, {
            key: "ttl",
            text,
            i,
            pos: collapse ? null : pos,
            zero: ctl.zero,
            focusedStatic: collapse && focused,
            left: textX,
            top: focused || !collapse ? -1 : 1,
            opacity: n.ttlOp,
            glow: glowOn,
            glowOpacity: glowA,
            probe: focused && !p.ghostOnly ? "full-item" : null
          }));
          if (pulseA) kids.push(h(Label, { key: "glow", text, size: V.ITEM_TEXT_ACTIVE_SIZE, left: textX, top: -1, color: "#fff", shadow: SH_GLOW_IN, opacity: A.mul(A.mul(pulseA, n.textMul), ctl.optGlow) }));
          if (descA && item.b) {
            if (item.d) kids.push(h(Label, {
              key: "dsc",
              text: item.d,
              size: V.ITEM_DESC_SIZE,
              lh: V.ITEM_DESC_SIZE + 4,
              lines: 1,
              width: BADGE.x - 20,
              left: textX,
              top: V.ITEM_DESC_OFFSET + 4,
              color: "rgb(235,235,235)",
              opacity: descA.a,
              shadow: SH_INACTIVE
            }));
            kids.push(h(
              Animated.View,
              { key: "dsb", pointerEvents: "none", style: { position: "absolute", left: textX + BADGE.x, top: V.ITEM_DESC_OFFSET + 4 - BADGE.h / 2, width: BADGE.w, height: BADGE.h, opacity: descA.a } },
              h(Image, { source: env.iconSource(item.b), resizeMode: "stretch", style: { width: BADGE.w, height: BADGE.h } })
            ));
          }
          if (descA && !item.b) {
            kids.push(h(Label, {
              key: "dsc",
              text: item.d,
              size: V.ITEM_DESC_SIZE,
              lh: V.ITEM_DESC_SIZE + 4,
              lines: 3,
              width: V.W - textX - 200,
              left: textX,
              top: V.ITEM_DESC_OFFSET + 4,
              color: "rgb(235,235,235)",
              opacity: descA.a,
              shadow: SH_INACTIVE
            }));
            if (descA.b && item.d && item.d.length < 20 && !item.ns) kids.push(h(Label, { key: "dsi", text: item.d, size: V.ITEM_TEXT_SIZE - 8, left: textX, top: 22, color: "rgb(235,235,235)", opacity: descA.b, shadow: SH_INACTIVE }));
          }
          if (compact && item.v) kids.push(h(Label, { key: "val", text: item.v, size: core.SUB.PS3.valueSize, left: core.SUB.PS3.valueX, top: 2, width: V.W - core.SUB.PS3.valueX - 40, align: "left", color: "rgb(245,240,250)", opacity: A.mul(n.textMul, ctl.optTxt), shadow: SH_INACTIVE }));
          return h(Animated.View, { style: rowStyle, pointerEvents: "none" }, kids);
        }, (a, b) => a.sig === b.sig && a.i === b.i && a.ctl === b.ctl && a.pos === b.pos && a.near === b.near && a.focused === b.focused && a.compact === b.compact && a.collapse === b.collapse && a.collapseIdx === b.collapseIdx && a.shiftX === b.shiftX && a.alphaMul === b.alphaMul && a.noGlow === b.noGlow && a.ghostOnly === b.ghostOnly && a.fast === b.fast && a.fadeIn === b.fadeIn && a.sub === b.sub && a.subT === b.subT && a.subTxt === b.subTxt);
        const sigOf = (it) => (it.n || "") + "|" + (it.i || "") + "|" + (it.src || "") + "|" + (it.alts ? it.alts.join(",") : "") + "|" + (it.d || "") + "|" + (it.v || "") + "|" + (it.ns ? 1 : 0) + "|" + (it.b || "");
        function Column(p) {
          const { ctl, items, pos, focusIdx } = p, up = p.up == null ? 12 : p.up, down = p.down == null ? 18 : p.down;
          const all = !!p.whole && items.length <= 80 && !p.collapse;
          const lo = all ? 0 : Math.max(0, focusIdx - up), hi = all ? items.length - 1 : Math.min(items.length - 1, focusIdx + down), rows = [];
          for (let i = lo; i <= hi; i++) {
            const it = items[i], e0 = focusIdx - i;
            rows.push(h(Row, {
              key: p.keyPrefix + i,
              ctl,
              it,
              sig: sigOf(it),
              i,
              pos,
              near: Math.abs(e0) <= 1,
              focused: e0 === 0,
              compact: p.compact,
              collapse: p.collapse,
              collapseIdx: p.collapse ? focusIdx : 0,
              noGlow: p.noGlow,
              fast: !!ctl.state.fast,
              fadeIn: p.collapse ? p.fadeIn : void 0,
              sub: !!p.sub,
              subT: p.subT,
              subTxt: p.subTxt
            }));
          }
          const colStyle = Object.assign({}, FILL, p.alphaMul ? { opacity: p.alphaMul } : null, p.shiftX ? { transform: [{ translateX: p.shiftX }] } : null);
          const content = h(Animated.View, { style: colStyle, pointerEvents: "none" }, rows);
          return content;
        }
        const OPT = { x: 1320, w: 536, lineW: 4, textX: 15, y0: 551, headY: 270, pitch: 40, size: 26, slide: 192, nest: 213, arrowX: 188, markX: 176, markGap: 10, shift: [0, -192, -372] };
        const OptLabel = memo(function OptLabel2(p) {
          const sn = snap(OPT.size), L = lh(sn.size), W = p.clip || 440, k = sn.scale;
          const gkey = p.text + "|" + sn.size + "|" + L;
          const [gi, setGi] = React.useState(glowMeta[gkey] === void 0 ? null : glowMeta[gkey]);
          React.useEffect(() => {
            if (!p.glow || !env.glowFor) return void 0;
            if (glowMeta[gkey] !== void 0) {
              if (glowMeta[gkey] !== gi) setGi(glowMeta[gkey]);
              return void 0;
            }
            let live = true;
            env.glowFor(p.text, sn.size, L, (info) => {
              glowMeta[gkey] = info || false;
              if (live) setGi(glowMeta[gkey]);
            });
            return () => {
              live = false;
            };
          }, [!!p.glow, gkey]);
          let halo = null;
          if (p.glow && env.glowFor && gi) halo = h(GlowPic, {
            key: "g" + (gi.again ? "r" : ""),
            path: gi.p,
            left: -gi.pad,
            top: -gi.pad,
            w: gi.w,
            h: gi.h,
            onFail: () => glowAgain(gkey, (cb) => env.glowFor(p.text, sn.size, L, cb), setGi)
          });
          else if (p.glow && GLOW_IMG && !(env.glowFor && gi === null)) {
            const tw2 = Math.round(String(p.text).length * sn.size * 0.5), gh = Math.round(GLOW_H * 0.8), top = L / 2 - gh / 2, mid = Math.max(0, tw2 - 64);
            const img = (key, src, left, width) => h(Image, { key, source: src, resizeMode: "stretch", style: { position: "absolute", left, top, width, height: gh } });
            halo = [img("gl", GLOW_IMG.l, -GLOW_PAD, GLOW_CAP), mid ? img("gm", GLOW_IMG.m, 32, mid) : null, img("gr", GLOW_IMG.r, tw2 - 32, GLOW_CAP)];
          }
          const [tw, setTw] = React.useState(0);
          const onTw = p.mark || p.arrow || p.back ? (e) => {
            const w = Math.round(e && e.nativeEvent && e.nativeEvent.layout ? e.nativeEvent.layout.width : 0);
            if (w > 0 && w <= W && Math.abs(w - tw) > 1) setTw(w);
          } : void 0;
          const text = h(Text, { key: "t", numberOfLines: 1, ellipsizeMode: "tail", onLayout: onTw, style: Object.assign(
            { fontFamily: font, fontSize: sn.size, lineHeight: L, color: p.glow ? "#fff" : "rgb(229,229,229)" },
            p.mark || p.arrow || p.back || p.clip ? { alignSelf: "flex-start", maxWidth: W } : { width: W },
            env.fakeGlow ? {} : p.glow ? SH_GLOW : SH_INACTIVE
          ) }, p.text);
          const markEl = p.mark && env.optArrowD ? h(Image, {
            key: "mk",
            source: env.optArrowD,
            resizeMode: "stretch",
            style: { position: "absolute", left: (tw || Math.round(String(p.text).length * sn.size * 0.52)) + OPT.markGap, top: L / 2 - 7, width: 22, height: 15 }
          }) : null;
          const estW = Math.round(String(p.text).length * sn.size * 0.52);
          const arrowEl = p.arrow && env.optArrowR ? h(Image, {
            key: "ar",
            source: env.optArrowR,
            resizeMode: "stretch",
            style: { position: "absolute", left: Math.max(OPT.arrowX - OPT.textX, (tw || estW) + 22), top: L / 2 - 7, width: 16, height: 14 }
          }) : null;
          const backEl = p.back && env.subArrow ? h(Image, {
            key: "bk",
            source: env.subArrow,
            resizeMode: "stretch",
            style: { position: "absolute", left: Math.max(OPT.markX - OPT.textX, Math.min(W, tw || estW) + 10), top: L / 2 - 7, width: 16, height: 14 }
          }) : null;
          const inner = [halo ? h(View, { key: "h", pointerEvents: "none", style: { position: "absolute", left: 0, top: 0, width: W, height: L } }, halo) : null, text, markEl, arrowEl, backEl];
          const box = Math.abs(k - 1) > 0.02 ? h(View, { pointerEvents: "none", style: { width: W, height: L, transform: [{ translateX: -W / 2 * (1 - k) }, { scale: k }] } }, inner) : inner;
          return h(View, { pointerEvents: "none", style: { position: "absolute", left: p.left, top: p.top - L / 2, width: W, height: L, opacity: p.dim ? 0.8 : 1 } }, box);
        }, (a, b) => a.text === b.text && a.glow === b.glow && a.dim === b.dim && a.left === b.left && a.top === b.top && !!a.mark === !!b.mark && !!a.arrow === !!b.arrow && !!a.back === !!b.back && a.clip === b.clip);
        function OptPanel(p) {
          const ctl = p.ctl, st = ctl.state, lvls = (st.opt.length ? st.opt : st.optLast || []).slice(0, 2);
          const nest = st.optNest || OPT.nest;
          const nodes = useMemo(() => [0, 1].map((k) => ({
            x: interp(ctl.optV, { inputRange: [k, k + 1, k + 2], outputRange: [OPT.slide, 0, -nest] }),
            a: interp(ctl.optV, { inputRange: [k, k + 1], outputRange: [0, 1] })
          })), [ctl, nest]);
          if (!lvls.length) return null;
          const rowsY = (lv, y0) => {
            const nh = lv.items.filter((it) => it.head).length, ng = lv.items.filter((it) => it.grp).length;
            const gStart = y0 - 2 * OPT.pitch - (ng - 1) * OPT.pitch;
            const hStart = ng ? Math.min(OPT.headY, gStart - 2 * OPT.pitch - (nh - 1) * OPT.pitch) : OPT.headY;
            let hd = 0, gp = 0, rest = 0;
            return lv.items.map((it) => it.head ? hStart + hd++ * OPT.pitch : it.grp ? gStart + gp++ * OPT.pitch : y0 + rest++ * OPT.pitch);
          };
          let ys = null;
          const out = lvls.map((lv, k) => {
            const top = k === lvls.length - 1, kids = [];
            if (k === 0) ys = rowsY(lv, OPT.y0);
            else {
              const n = lv.items.length, idx = lv.idx || 0, TOPY = 70, BOTY = V.H - 70;
              let y0 = (ys[lvls[k - 1].idx || 0] || OPT.y0) - (lv.at || 0) * OPT.pitch;
              if (y0 + (n - 1) * OPT.pitch > BOTY) y0 = BOTY - (n - 1) * OPT.pitch;
              if (y0 < TOPY) y0 = TOPY;
              if (y0 + idx * OPT.pitch > BOTY) y0 = BOTY - idx * OPT.pitch;
              ys = rowsY(lv, y0);
            }
            kids.push(env.optBg ? h(Image, { key: "bg", source: env.optBg, resizeMode: "stretch", style: { position: "absolute", left: 0, top: 0, width: OPT.w, height: V.H } }) : h(View, { key: "bg", style: { position: "absolute", left: 0, top: 0, width: 420, height: V.H, backgroundColor: "rgba(79,79,84,0.55)" } }));
            kids.push(env.optLine ? h(Image, { key: "ln", source: env.optLine, resizeMode: "stretch", style: { position: "absolute", left: 0, top: 0, width: OPT.lineW, height: V.H } }) : h(View, { key: "ln", style: { position: "absolute", left: 1, top: 0, width: 2, height: V.H, backgroundColor: "rgba(255,255,255,0.25)" } }));
            lv.items.forEach((it, j) => {
              const y = ys[j], foc = j === lv.idx;
              if (y < 40 || y > V.H - 40) return;
              kids.push(h(OptLabel, { key: "o" + j, text: it.n, left: OPT.textX, top: y, glow: top && foc, dim: !top, mark: !!it.mark, arrow: top && !!it.ch, back: !top && foc, clip: top ? 0 : nest - OPT.textX - 34 }));
            });
            /* The panel travels normally. Its labels mount at 0 opacity and
             * receive their independent fast native fade only AFTER commit. */
            return h(Animated.View, { key: "lv" + k, pointerEvents: "none",
              style: { position: "absolute", left: OPT.x, top: 0, width: OPT.w, height: V.H,
                opacity: nodes[k].a, transform: [{ translateX: nodes[k].x }] } },
              kids.slice(0, 2),
              h(MountedReveal, { key: "opt-content-" + k + "-" + (st.optEpoch[k] || 0),
                epoch: st.optEpoch[k] || 0, speed: st.speed,
                openedAt: st.optOpenedAt[k] || 0,
                settleMs: ctl.revealSettleMs() }, kids.slice(2)));
          });
          return h(View, { pointerEvents: "none", style: FILL }, out);
        }
        const INFO = { line1: 199, line2: 879, fx: 729, fy: 257, fs: 190, labR: 804, valX: 844, y0: 508, pitch: 40, size: 24, backX: 1155, backY: 906 };
        function InfoScreen(p) {
          const ctl = p.ctl, st = ctl.state, inf = st.info || st.infoLast;
          if (!inf) return null;
          const kids = [];
          kids.push(h(View, { key: "l1", style: { position: "absolute", left: 0, top: INFO.line1, width: V.W, height: 1, backgroundColor: "rgb(174,174,174)" } }));
          kids.push(h(View, { key: "l2", style: { position: "absolute", left: 0, top: INFO.line2, width: V.W, height: 1, backgroundColor: "rgb(174,174,174)" } }));
          const pad = inf.pic ? 7 : 25;
          kids.push(h(
            View,
            { key: "fr", style: { position: "absolute", left: INFO.fx, top: INFO.fy, width: INFO.fs, height: INFO.fs, backgroundColor: "rgba(36,36,36,0.85)", borderWidth: 1, borderColor: "rgb(96,96,96)", borderRadius: 2 } },
            inf.icon ? h(Image, { source: inf.icon, resizeMode: "contain", style: { position: "absolute", left: pad - 1, top: pad - 1, width: INFO.fs - 2 * pad, height: INFO.fs - 2 * pad } }) : null
          ));
          let y = INFO.y0;
          inf.rows.forEach((r, k) => {
            const lines = Math.min(3, r[2] || 1);
            kids.push(h(Label, { key: "k" + k, text: String(r[0]), size: INFO.size, left: INFO.labR - 400, top: y, width: 400, align: "right", color: "rgb(229,229,229)", shadow: SH_INACTIVE }));
            kids.push(h(Label, { key: "v" + k, text: String(r[1]), size: INFO.size, left: INFO.valX, top: y + (lines - 1) * 15, width: 820, lines, lh: 30, color: "#fff", shadow: SH_INACTIVE }));
            y += INFO.pitch + (lines - 1) * 30;
          });
          kids.push(h(Label, { key: "back", text: "\u25CB  Back", size: INFO.size, left: INFO.backX, top: INFO.backY, width: 300, color: "#fff", shadow: SH_INACTIVE }));
          return h(Animated.View, { pointerEvents: "none",
            style: Object.assign({}, FILL, { opacity: ctl.infoV }) },
            kids.slice(0, 2),
            h(MountedReveal, { key: "info-content-" + st.infoEpoch,
              epoch: st.infoEpoch, speed: st.speed,
              openedAt: st.infoOpenedAt || 0,
              settleMs: ctl.revealSettleMs() }, kids.slice(2)));
        }
        const Chevron = memo(function Chevron2(p) {
          const c = core.SUB.chevron, hgt = c.h / 2;
          const a = p.ctl.arrowV, dx = p.ctl.arrowX;
          if (env.subArrow) return h(
            Animated.View,
            { pointerEvents: "none", style: { position: "absolute", left: c.tipX - 2.5, top: c.cy - 11.5, width: 28, height: 24, opacity: a, transform: [{ translateX: dx }] } },
            h(Image, { source: env.subArrow, style: { width: 28, height: 24 } })
          );
          return h(
            Animated.View,
            { pointerEvents: "none", style: { position: "absolute", left: c.tipX, top: c.cy - hgt, opacity: a, transform: [{ translateX: dx }] } },
            h(View, { style: { width: 0, height: 0, borderTopWidth: hgt, borderBottomWidth: hgt, borderRightWidth: c.baseX - c.tipX, borderTopColor: "transparent", borderBottomColor: "transparent", borderRightColor: "rgb(240,240,240)" } })
          );
        }, (a, b) => a.ctl === b.ctl);
        const Clock = memo(function Clock2(p) {
          const d = p.now || /* @__PURE__ */ new Date(), two = (n) => (n < 10 ? "0" : "") + n;
          const txt = d.getDate() + "/" + (d.getMonth() + 1) + " " + d.getHours() + ":" + two(d.getMinutes());
          const R = V.CLOCK_ICON_R, cx = V.CLOCK_ICON_CX, cy = V.CLOCK_FRAME_Y + V.CLOCK_FRAME_H / 2;
          // V83.20: rotate each hand around the dial's actual CENTER, not
          // around a translated rectangle (which produced eccentric hands
          // on PS5's React Native renderer). All angles use the local RTC.
          const hand = (len, w, deg, key) => {
            const rad = deg * Math.PI / 180;
            const midX = cx + Math.sin(rad) * len / 2;
            const midY = cy - Math.cos(rad) * len / 2;
            return h(View, { key, style: {
              position: "absolute", left: midX - w / 2, top: midY - len / 2,
              width: w, height: len, borderRadius: w / 2,
              backgroundColor: "rgba(255,255,255,0.96)",
              transform: [{ rotate: deg + "deg" }]
            }});
          };
          const minPart = d.getMinutes() + d.getSeconds() / 60;
          const minDeg = minPart * 6;
          const hourDeg = (d.getHours() % 12 + minPart / 60) * 30;
          const HW = Math.max(2.4, R * 0.18);
          const frameW = V.W - V.CLOCK_FRAME_X;
          return h(
            View,
            { pointerEvents: "none", style: FILL },
            env.clockBox ? h(Image, { key: "box", source: env.clockBox, resizeMode: "stretch", style: { position: "absolute", left: V.CLOCK_FRAME_X, top: V.CLOCK_FRAME_Y, width: frameW, height: V.CLOCK_FRAME_H + 1 } }) : h(View, { key: "box", style: { position: "absolute", left: V.CLOCK_FRAME_X, top: V.CLOCK_FRAME_Y, width: frameW, height: V.CLOCK_FRAME_H, backgroundColor: "rgba(0,0,0,0.18)", borderTopLeftRadius: V.CLOCK_FRAME_CORNER, borderBottomLeftRadius: V.CLOCK_FRAME_CORNER } }),
            h(Label, { key: "txt", text: txt, size: V.CLOCK_SIZE, left: cx - R - 18 - 300, top: V.CLOCK_Y + 3, width: 300, align: "right", color: "rgba(255,255,255,0.92)" }),
            env.clockRing ? h(Image, { key: "ring", source: env.clockRing, style: { position: "absolute", left: cx - 24, top: cy - 24, width: 48, height: 48 } }) : h(View, { key: "ring", style: { position: "absolute", left: cx - R, top: cy - R, width: R * 2, height: R * 2, borderRadius: R, borderWidth: 2.6, borderColor: "rgba(255,255,255,0.96)" } }),
            hand(R * 0.51, HW + 0.65, hourDeg, "hh"),
            hand(R * 0.78, HW, minDeg, "mh"),
            h(View, { key: "hub", style: { position: "absolute",
              left: cx - 2.5, top: cy - 2.5, width: 5, height: 5,
              borderRadius: 2.5, backgroundColor: "#fff" } })
          );
        }, (a, b) => {
          const x = a.now || /* @__PURE__ */ new Date(), y = b.now || /* @__PURE__ */ new Date();
          return x.getMinutes() === y.getMinutes() && x.getHours() === y.getHours() && x.getDate() === y.getDate();
        });
        const KeepAlive = memo(function KeepAlive2(p) {
          const a = useMemo(() => interp(p.ctl.pulse, { inputRange: [0, 1], outputRange: [0, 1e-3] }), [p.ctl]);
          return h(Animated.View, { pointerEvents: "none", style: { position: "absolute", left: 0, top: 0, width: 1, height: 1, opacity: a } });
        }, (a, b) => a.ctl === b.ctl);
        function Xmb(p) {
          const ctl = p.controller, st = ctl.state;
          useVersion(ctl);
          const nodes = useMemo(() => ({
            // The original PS3 Mode-5 colShift is NEVER altered for the exit.
            colShift: ctl.categories.map((c, i) => A.add(interp(ctl.catPos, core.COLUMN.shiftX(i)), ctl.slotDx[i])),
            // Echo offsets are separate from the item's normal positioning.
            // The near image drifts less; the far copy fades more subtly.
            colGhostXNear: ctl.categories.map((c, i) => A.mul(ctl.exitGhostX[i], 0.48)),
            colGhostXFar: ctl.categories.map((c, i) => ctl.exitGhostX[i]),
            colGhostANear: ctl.categories.map((c, i) => A.mul(ctl.exitMode[i], interp(ctl.exitGhostT[i], {
              inputRange: [0, 0.08, 0.32, 0.72, 1], outputRange: [0, 0.24, 0.19, 0.07, 0]
            }))),
            colGhostAFar: ctl.categories.map((c, i) => A.mul(ctl.exitMode[i], interp(ctl.exitGhostT[i], {
              inputRange: [0, 0.15, 0.42, 0.78, 1], outputRange: [0, 0.04, 0.11, 0.05, 0]
            }))),
            // Usual catPos fade for arriving items; outgoing originals fade
            // independently while translucent ghost echoes linger briefly.
            colAlpha: ctl.categories.map((c, i) => A.mul(ctl.slotAlpha[i], A.add(
              A.mul(interp(ctl.catPos, core.COLUMN.alpha(i)), interp(ctl.exitMode[i], { inputRange: [0, 1], outputRange: [1, 0] })),
              A.mul(ctl.exitAlpha[i], ctl.exitMode[i])
            ))),
            childX: interp(ctl.colT, core.SUB.childX),
            childA: interp(ctl.colT, core.SUB.childAlpha),
            parentFade: interp(ctl.colT, { inputRange: [0, 1], outputRange: [1, 0] }),
            clockA: A.mul(interp(ctl.optV, { inputRange: [0, 1], outputRange: [1, 0] }), interp(ctl.infoV, { inputRange: [0, 1], outputRange: [1, 0] })),
            shown: interp(ctl.infoV, { inputRange: [0, 1], outputRange: [1, 0] })
          }), [ctl, ctl.categories.length, st.structureVersion]);
          const optShift = useMemo(() => interp(ctl.optV, { inputRange: [0, 1, 2], outputRange: [OPT.shift[0], OPT.shift[1], OPT.shift[1]] }), [ctl]);
          const depth = st.stack.length, cols = [];
          const rootCols = [];
          for (let c = 0; c < ctl.categories.length; c++) {
            rootCols.push(h(Column, {
              key: "cat" + ctl.categories[c].id,
              keyPrefix: "c" + ctl.categories[c].id + ":",
              ctl,
              items: ctl.categories[c].items || [],
              pos: ctl.rootPos[c],
              focusIdx: st.sel[c],
              // All original items use their unchanged PS3 trajectory.
              shiftX: nodes.colShift[c],
              alphaMul: nodes.colAlpha[c],
              noGlow: false,
              whole: true,
              sub: true
            }));
          }
          const fadeOf = (f) => f.fade || (f.fade = interp(f.t, { inputRange: [0, 1], outputRange: [1, 0] }));
          cols.push(h(Animated.View, { key: "roots", pointerEvents: "none", style: Object.assign({}, FILL, { opacity: depth >= 1 ? fadeOf(st.stack[0]) : 1 }) }, rootCols));
          for (let k = 0; k < depth; k++) {
            const f = st.stack[k], next = k + 1 < depth ? st.stack[k + 1] : null;
            /* Keep each frame's content mounted across navigation updates.
             * New frames get a new key and an opacity initialized to zero;
             * the fade starts from MountedReveal's commit-time effect. */
            cols.push(h(MountedReveal, {
              key: "frame-reveal-" + f.mountEpoch,
              epoch: f.mountEpoch, speed: st.speed,
              openedAt: f.openedAt,
              settleMs: ctl.revealSettleMs()
            }, h(Column, {
              key: "f" + k,
              keyPrefix: "f" + k + ":",
              ctl,
              items: f.items,
              pos: f.pos,
              focusIdx: f.idx,
              compact: true,
              whole: true,
              alphaMul: next ? fadeOf(next) : null,
              sub: true,
              subT: f.t,
              subTxt: f.txt
            })));
          }
          if (depth >= 1) cols.push(h(Chevron, { key: "chev", ctl }));
          const moving = h(Animated.View, { key: "xmbmove", pointerEvents: "none", style: Object.assign({}, FILL, { opacity: nodes.shown, transform: [{ translateX: optShift }] }) }, h(CategoryBar, { key: "bar", ctl }), cols);
          const clock = p.clock === false ? null : h(Animated.View, { key: "clk", pointerEvents: "none", style: Object.assign({}, FILL, { opacity: nodes.clockA }) }, h(Clock, { now: p.now }));
          return h(
            View,
            { style: FILL, pointerEvents: "none", onLayout: layout("full-view") },
            p.background || null,
            h(CinfoBg, { ctl }),
            moving,
            clock,
            h(Animated.View, { key: "optbox", pointerEvents: "none", style: Object.assign({}, FILL, { opacity: nodes.shown }) }, h(OptPanel, { ctl })),
            h(InfoScreen, { key: "info", ctl }),
            h(KeepAlive, { ctl })
          );
        }
        return { Xmb, createController, Clock };
      };
    }
  });

  // integration/ps5xmb-native.js
  var require_ps5xmb_native = __commonJS({
    "integration/ps5xmb-native.js"(exports) {
      var spec = require_xmb_spec_lite();
      var { createCore } = require_xmb_core();
      var createXmb = require_xmb_rn();
      exports.spec = spec;
      exports.repeatIntervals = (n) => createCore(spec).repeatIntervals(n);
      exports.create = function create(host) {
        const { React, rn } = host, log = host.log || function() {
        };
        const core = createCore(spec);
        const snapCache = {};
        const fontSnap = (px) => {
          if (snapCache[px]) return snapCache[px];
          let best = 0;
          try {
            best = host.fontSize ? host.fontSize(px) : 0;
          } catch (e) {
            best = 0;
          }
          const k = best > 0 ? px / best : 1;
          return snapCache[px] = best > 0 ? { size: best, scale: Math.abs(k - 1) <= 0.08 ? 1 : k } : { size: px, scale: 1 };
        };
        const hoverAsset = (f) => "xmbweb_cinfo_" + String(f).replace(/^.*\//, "").replace(/\.[a-z]+$/i, "").replace(/^cinfo-/, "").replace(/[^a-z0-9]+/gi, "_").toLowerCase();
        const env = {
          React,
          rn,
          core,
          spec,
          fontFamily: host.fontFamily,
          // V73: a custom column's icon can be a PNG of its own (file:///user/data/ZhiThemes/xmbicons/<name>.png)
          iconSource: (id) => ({ uri: /^(file|https?):/.test(id || "") ? id : String(id || "").charAt(0) === "/" ? "file://" + id : host.assetUri(id || "xmbweb_xmb_icon_022") }),
          assetSource: (f) => ({ uri: host.assetUri(hoverAsset(f)) }),
          // hand-made mip levels exist for the glass icons only (install_xmbnative_assets.py): xmbweb_xmb_icon_NNN / _psn / playstation_store
          iconMip: (id, suf) => /^xmbweb_(xmb_icon_(\d{3}|psn)|playstation_store)$/.test(id || "") ? { uri: host.assetUri(id + suf) } : null,
          glowImg: host.glow === "native" ? void 0 : { l: { uri: host.assetUri("xmbweb_glow_l") }, m: { uri: host.assetUri("xmbweb_glow_m") }, r: { uri: host.assetUri("xmbweb_glow_r") } },
          clockBox: { uri: host.assetUri("xmbweb_clock_box") },
          clockRing: { uri: host.assetUri("xmbweb_clock_ring") },
          subArrow: { uri: host.assetUri("xmbweb_arrow_sub") },
          optBg: { uri: host.assetUri("xmbweb_optmenu_bg") },
          optLine: { uri: host.assetUri("xmbweb_optmenu_line") },
          optArrowR: { uri: host.assetUri("xmbweb_optmenu_arrow_r") },
          optArrowD: { uri: host.assetUri("xmbweb_optmenu_arrow_d") },
          // V62: the PS3 Triangle panel
          fontSnap,
          onLayout: host.onLayout,
          fakeGlow: host.glow === "native" ? void 0 : {},
          useNativeDriver: true,
          noPulse: host.noPulse,
          artCheck: host.artCheck,
          glowFor: host.glowFor,
          iconLevels: host.iconLevels,
          // V41: filtered small copies of game icons           // V38: host helpers (blank-picture check, letter-hugging glow picture)
          onDwell: host.onDwell,
          onDwellEnd: host.onDwellEnd
          // focus-background dwell (the host starts / stops the title's own music)
        };
        const { Xmb, createController } = createXmb(env);
        const cache = typeof WeakMap === "function" ? /* @__PURE__ */ new WeakMap() : null;
        const scaleKeyOf = (asset) => /(^|_)psn$/.test(asset || "") ? "psn" : /playstation_store$/.test(asset || "") ? "playstation_store" : "";
        const game0 = (r) => r && r.kind === "game";
        function adapt(raw) {
          if (!raw) return { n: "", i: "xmbweb_xmb_icon_022" };
          const hit = cache && !game0(raw) && cache.get(raw);
          if (hit) return hit;
          const game = raw.kind === "game";
          if (game && cache) {
            const g = cache.get(raw);
            if (g && Date.now() - g.t < 4e3) return g.it;
          }
          const pic = (game || raw.kind === "user" || raw.kind === "photo") && typeof raw.icon === "string" && raw.icon;
          const icon = pic ? raw.icon.charAt(0) === "/" ? "file://" + raw.icon : raw.icon : game && /^[A-Z]{4}\d{5}$/.test(raw.id || "") ? "file:///user/app/" + raw.id + "/sce_sys/icon0.png" : "";
          const it = { n: raw.name, i: raw.iconAsset || "xmbweb_xmb_icon_022", sk: scaleKeyOf(raw.iconAsset), src: icon || void 0, raw };
          if (game) {
            const lab = host.playedLabel ? host.playedLabel(raw) : "";
            if (lab) it.d = lab;
            it.ns = true;
          } else if (raw.subtitle) it.d = raw.subtitle;
          if (game && host.badge) {
            const b = host.badge(raw);
            if (b) it.b = b;
          }
          if (game) {
            it.gid = raw.id;
            const c = [];
            [
              raw.bg,
              "/user/appmeta/" + raw.id + "/pic0.png",
              "/user/appmeta/" + raw.id + "/pic0.jpg",
              "/user/appmeta/" + raw.id + "/pic1.png",
              "/user/app/" + raw.id + "/sce_sys/pic1.png",
              "/user/app/" + raw.id + "/sce_sys/pic0.png"
            ].forEach((v) => {
              if (typeof v !== "string" || !v || !/^(?:file:\/\/|\/)/.test(v)) return;
              const u = v.charAt(0) === "/" ? "file://" + v : v;
              if (c.indexOf(u) < 0) c.push(u);
            });
            if (/^[A-Z]{4}\d{5}$/.test(raw.id || "") && c.length) it.art = c;
          }
          if (raw.ns) it.ns = true;
          if (raw.kind === "photo") it.thumb = true;
          if (raw.kind === "user" && Array.isArray(raw.alts)) it.alts = raw.alts.slice();
          if (raw.value) it.v = String(raw.value);
          if (Array.isArray(raw.children) && raw.children.length) it.ch = raw.children.map(adapt);
          if (cache) cache.set(raw, game ? { t: Date.now(), it } : it);
          return it;
        }
        const listMemo = typeof WeakMap === "function" ? /* @__PURE__ */ new WeakMap() : null;
        const adaptList = (list) => {
          if (!list) return [];
          const m = listMemo && listMemo.get(list);
          if (m && m.raw.length === list.length && m.raw.every((r, k) => r === list[k]) && Date.now() - m.t < 4e3) return m.out;
          const out = list.map(adapt);
          if (listMemo) listMemo.set(list, { raw: list.slice(), out, t: Date.now() });
          return out;
        };
        const infoIcon = (v) => typeof v !== "string" || !v ? null : v.charAt(0) === "/" ? { uri: "file://" + v } : /^(file|https?):/.test(v) ? { uri: v } : { uri: host.assetUri(v) };
        let hostCats = {};
        const toSync = (m) => (hostCats = {}, m.cats.forEach((c) => {
          hostCats[c.id] = c;
        }), {
          speed: m.speed,
          startDelay: m.startDelay,
          dwell: m.dwell,
          motion: m.motion,
          // only the ACTIVE category's list length is needed (the host already clamps the others): building every category's list on every key press was wasted work
          ci: m.ci,
          sel: m.cats.map((c, i) => i === m.ci ? Math.min(Math.max(0, m.sel[i] || 0), Math.max(0, (c.getItems() || []).length - 1)) : Math.max(0, m.sel[i] || 0)),
          stack: m.stack.map((f) => ({ items: adaptList(f.entries), idx: f.cursor || 0, title: f.name })),
          // V62: the Triangle options panel: [{ items: [{ n, ch }], idx }] per open level (plain labels from the host)
          opt: Array.isArray(m.opt) ? m.opt.map((l) => ({ items: (l.items || []).map((o) => typeof o === "string" ? { n: o } : { n: o.n || o.name || "", ch: !!(o.ch || o.children), head: !!o.head, grp: !!o.grp, mark: !!o.mark }), idx: l.idx || 0, at: l.at || 0 })) : [],
          // V62: the Information screen: { icon: '/path' | 'file://..' | asset id, pic: true for a picture that fills the frame, rows: [[label, value, lines]] }
          info: m.info && Array.isArray(m.info.rows) ? Object.assign({}, m.info, { icon: infoIcon(m.info.icon) }) : null
        });
        let live = null;
        let gen = 0;
        const blurV = new rn.Animated.Value(0);
        const catSig = (m) => m.cats.map((c) => c.id + "|" + c.name + "|" + c.asset).join(",");
        let cur = null;
        const makeCat = (c) => ({ id: c.id, name: c.name, icon: c.asset, sk: scaleKeyOf(c.asset), get items() {
          const hc = hostCats[c.id];
          return adaptList(hc ? hc.getItems() : []);
        } });
        function adopt(m) {
          const r = cur;
          if (!r || r.sig === (r.sig2 = catSig(m))) return true;
          const ids = m.cats.map((c) => c.id), have = r.ctl.categories.map((c) => c.id);
          const sameSet = ids.length === have.length && ids.slice().sort().join(",") === have.slice().sort().join(",");
          if (!sameSet && !r.ctl.updateCategories) return false;
          hostCats = {};
          m.cats.forEach((c) => {
            hostCats[c.id] = c;
          });
          if (!sameSet) {
            r.ctl.updateCategories(m.cats.map(makeCat), m.ci, m.sel);
            log("xmb renderer: columns inserted/deleted with preserved animations");
          } else if (ids.join(",") !== have.join(",")) {
            r.ctl.reorder(ids, m.ci);
            log("xmb renderer: categories re-ordered");
          }
          let changed = false;
          m.cats.forEach((c) => {
            const rc = r.ctl.categories.find((x) => x.id === c.id);
            if (rc && (rc.name !== c.name || rc.icon !== c.asset)) {
              rc.name = c.name;
              rc.icon = c.asset;
              rc.sk = scaleKeyOf(c.asset);
              changed = true;
            }
          });
          if (changed) {
            log("xmb renderer: category name / icon updated");
            r.ctl.refresh();
          }
          r.sig = r.sig2;
          return true;
        }
        function View(p) {
          const m = p.model;
          const ref = React.useRef(null);
          if (ref.current && ref.current !== cur) ref.current = null;
          if (ref.current && !adopt(m)) {
            log("xmb renderer: categories changed (" + m.cats.length + ")");
            ref.current = null;
          }
          if (!ref.current) {
            hostCats = {};
            m.cats.forEach((c) => {
              hostCats[c.id] = c;
            });
            const cats = m.cats.map(makeCat);
            gen++;
            ref.current = cur = { ctl: createController(cats, { startCategory: m.ci, sel: m.sel, noPulse: host.noPulse, blurV }), cats, sig: catSig(m), gen };
            ref.current.ctl.state.sel = m.cats.map((c, i) => m.sel[i] || 0);
            log("xmb renderer ready: " + cats.length + " categories, glow=" + (host.glow || "copies"));
          }
          const ctl = ref.current.ctl;
          live = ctl;
          ctl.sync(toSync(m));
          return React.createElement(Xmb, { key: "g" + ref.current.gen, controller: ctl, background: p.background, now: p.now });
        }
        function preSync(model) {
          if (live) {
            try {
              if (adopt(model)) live.sync(toSync(model));
            } catch (e) {
              log("preSync: " + e);
            }
          }
        }
        return { View, core, repeatIntervals: core.repeatIntervals, adapt, preSync, blurValue: () => blurV };
      };
    }
  });
  return require_ps5xmb_native();
})();
/* XMB_NATIVE_BUNDLE_END */
  /* Editable in the XMB5 browser: XMB Designer. JSON MUST stay inside markers. */
  var XMB_DESIGNER = /* XMB_DESIGNER_BEGIN */{"categoryCenterX":566,"categoryTop":195,"categoryCellWidth":203,"categoryFocusSize":168,"categoryIdleSize":117,"categoryIdleDrop":36,"categoryLabelGap":-19,"categoryLabelFont":20,"categoryIdleOpacity":0.9,"itemCenterX":566,"itemFocusY":425,"itemAboveY":309,"itemBelowY":643,"itemGap":80,"gameFocusWidth":180,"gameFocusHeight":180,"gameIdleWidth":78,"gameIdleHeight":78,"otherFocusSize":180,"otherIdleSize":78,"gameLabelX":683,"otherLabelX":683,"gameLabelTop":62,"otherFocusLabelTop":60,"otherIdleLabelTop":16,"gameTitleFont":34,"otherFocusTitleFont":34,"otherIdleTitleFont":30,"subtitleFont":18,"titleGlow":15,"itemIdleOpacity":0.48,"clockRight":64,"clockTop":75,"clockWidth":590,"clockHeight":57,"backgroundColor":"#07152e","gameThumbFit":"contain","showUnfocusedGameNames":false,"showUnfocusedOtherNames":true,"showLastPlayed":true,"gameArtOpacity":0.53}/* XMB_DESIGNER_END */;
  // XMB5 merges persisted settings from var THEME across HomeUI reloads.
  // JSON above supplies build defaults; the xmbD_ keys below are the live saved
  // values from XMB5's own editor and survive reboot without custom C++.
  Object.keys(XMB_DESIGNER).forEach(function(k){
    var candidate=THEME['xmbD_'+k];
    if(typeof candidate===typeof XMB_DESIGNER[k]) XMB_DESIGNER[k]=candidate;
  });
  /* V29 Sony 4.93: migrate only persisted legacy 78-unit row pitch. */
  if (XMB_DESIGNER.itemGap === 78) XMB_DESIGNER.itemGap = 80;
  /* V31: xmb-web canonical 1920x1080 defaults outrank OLD persisted Designer values.
   * Set THEME.xmbWebReplicaLayout=false to opt out without removing V31. */
  if (THEME.xmbWebReplicaLayout !== false) {
    var v31Canonical = {"categoryCenterX":566,"categoryTop":195,"categoryCellWidth":203,"categoryFocusSize":168,"categoryIdleSize":117,"categoryIdleDrop":36,"categoryLabelGap":-19,"categoryLabelFont":20,"categoryIdleOpacity":0.9,"itemCenterX":566,"itemFocusY":425,"itemAboveY":309,"itemBelowY":643,"itemGap":80,"gameFocusWidth":180,"gameFocusHeight":180,"gameIdleWidth":78,"gameIdleHeight":78,"otherFocusSize":180,"otherIdleSize":78,"gameLabelX":683,"otherLabelX":683,"gameLabelTop":62,"otherFocusLabelTop":60,"otherIdleLabelTop":16,"gameTitleFont":34,"otherFocusTitleFont":34,"otherIdleTitleFont":30,"subtitleFont":18,"titleGlow":15,"itemIdleOpacity":0.48,"clockRight":64,"clockTop":75,"clockWidth":590,"clockHeight":57};
    Object.keys(v31Canonical).forEach(function(k){XMB_DESIGNER[k]=v31Canonical[k];});
  }
  /* V31 WEB SOURCE EXACT CATEGORY MODEL — 9 clone categories, 205 extracted menu entries.
   * Native PS5 draws these from RN images/text; the browser's GLSL/Canvas pipeline
   * cannot be executed inside ShellUI's native React UI without a WebGL surface. */
  var XMB_WEB_NATIVE_CATEGORIES = [{"id":"user","name":"Users","asset":"xmbweb_xmb_icon_000","entries":[{"name":"Turn Off System","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_054"},{"name":"Create New User","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_041"},{"name":"*User","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_041"}]},{"id":"settings","name":"Settings","asset":"xmbweb_xmb_icon_001","entries":[{"name":"System Update","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_008","subtitle":"Update the PS3™ system software.","action":"netwiz"},{"name":"Game Settings","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_005","subtitle":"Adjusts settings for games.","children":[{"name":"View Mode (PSP Remasters)","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Configure the screen size for PSP® Remasters.","value":"Normal"},{"name":"3D Display (PSP Remasters)","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Display PSP® Remasters in 3D.","value":"Off"},{"name":"Ad Hoc Channel (PSP Remasters)","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Set the Ad Hoc Mode channel for PSP® Remasters."},{"name":"Ad Hoc Mode (PSP Remasters)","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Configure Ad Hoc Mode settings for PSP® Remasters.","value":"Off"},{"name":"PS Upscaler","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Apply upscaling to PlayStation® format software.","value":"Off"},{"name":"PS/PS2 Smoothing","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Smooth out the rough edges of images of PlayStation® and PlayStation®2 format software.","value":"Off"}]},{"name":"Video Settings","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_009","subtitle":"Adjusts settings for video.","children":[{"name":"BD/DVD Auto-start","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Configure BD/DVD auto-start settings.","value":"On"}]},{"name":"Music Settings","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_003","subtitle":"Adjusts settings for music.","children":[{"name":"Output Frequency","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","value":"48 kHz"},{"name":"Crossfade","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","value":"Off"}]},{"name":"Chat Settings","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_042","subtitle":"Adjusts settings for chat.","children":[{"name":"Microphone Volume","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","value":"Normal"},{"name":"Echo Cancellation","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","value":"On"}]},{"name":"System Settings","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_012","subtitle":"Adjusts settings for this PS3™ system.","children":[{"name":"Automatic Update","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Starts the system automatically and downloads game patches, uploads new saved data to online storage and syncs trophy information with the server.","value":"Off"},{"name":"System Name","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Sets the name for this system. You can use the name to distinguish multiple PS3™ systems on a network.","value":"PS3-625"},{"name":"System Language","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","value":"English (United Kingdom)"},{"name":"Character Set","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022"},{"name":"Dictionary Type","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","value":"English (UK)"},{"name":"Add/Edit Term","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","action":"netwiz"},{"name":"Delete Predictive Text Dictionary","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Deletes words that were added automatically to the dictionary when using the on-screen keyboard.","action":"dialog"},{"name":"Notification Messages","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","value":"Display"},{"name":"Trophy Notifications","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","value":"Display"},{"name":"Display [What's New]","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","value":"On"},{"name":"Disc Auto-Start","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","value":"On"},{"name":"Control for HDMI","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","value":"Off"},{"name":"DivX® VOD Registration Code","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Displays the registration code that is required to play DivX® VOD content.","action":"dialog"},{"name":"Enable ATRAC","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022"},{"name":"Enable WMA Playback","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022"},{"name":"Connect PS Vita System Using Network","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","value":"On"},{"name":"List of Registered PS Vita Systems","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","action":"dialog"},{"name":"Delete PS Vita System's Backup Files","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Deletes backup files for the PS Vita system saved on this system.","action":"dialog"},{"name":"Format Utility","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","action":"netwiz"},{"name":"Backup Utility","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","action":"netwiz"},{"name":"Data Transfer Utility","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","action":"netwiz"},{"name":"Restore Default Settings","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","action":"netwiz"},{"name":"Restore PS3™ System","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","action":"netwiz"},{"name":"System Information","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","action":"netwiz"}]},{"name":"Theme Settings","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_023","subtitle":"Adjusts settings related to the appearance of the XMB™ screen.","children":[{"name":"Theme","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Sets for use of a preset combination of elements such as colour, background or icons.","action":"dialog"},{"name":"Colour","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Sets the colour of the background and options menu.","action":"dialog"},{"name":"Background","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Sets the background of the XMB™ screen.","action":"dialog"},{"name":"Font","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Sets the font displayed on the XMB™ screen.","action":"dialog"},{"name":"Day/Night","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Sets the time-of-day lighting (day, dusk, night or automatic).","action":"dialog"}]},{"name":"Date and Time Settings","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_014","subtitle":"Adjusts date and time settings.","children":[{"name":"Date and Time","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Sets the date and time for this system.","action":"dialog"},{"name":"Date Format","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Sets the order of display for year, month and day.","value":"DD/MM/YYYY"},{"name":"Time Format","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Sets the time display to either a 12-hour or 24-hour clock.","value":"24-Hour Clock"},{"name":"Time Zone","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","value":"GMT"},{"name":"Daylight Saving","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Sets for daylight saving time.","value":"Off"},{"name":"Set via Internet","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Obtains the correct date and time automatically via the Internet when you sign in to PSN, and sets them on your system.","action":"netwiz"},{"name":"Set Manually","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","action":"netwiz"}]},{"name":"Power Save Settings","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_056","subtitle":"Adjusts settings to reduce power usage by this system.","children":[{"name":"System Auto-Off","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Sets whether or not to automatically turn off this system. If you do not operate the system for a set amount of time, the system will turn off automatically.","value":"Off"},{"name":"Controller Auto-Off","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Sets whether or not to automatically turn off controllers. If you do not use a controller for a set amount of time, it will turn off automatically.","value":"After 10 min."},{"name":"Power Indicator","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","value":"Bright"},{"name":"Turn Off System Automatically After Background Download","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","value":"Off"}]},{"name":"Accessory Settings","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_015","subtitle":"Adjusts settings for accessories that are connected to this system.","children":[{"name":"Calibrate Motion Controller","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Calibrates the magnetic sensor of a motion controller. Use this setting when the motion controller does not control on-screen movement as expected.","action":"dialog"},{"name":"Reassign Controllers","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Change the number assigned to the controller that is currently in use.","action":"dialog"},{"name":"Controller Vibration Function","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Sets whether or not to use the vibration function. This setting will be applied to all controllers that support the vibration function.","value":"On"},{"name":"BD Remote Control Registration","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Register the BD Remote Control.","action":"netwiz"},{"name":"Manage Bluetooth® Devices","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Manage Bluetooth® devices.","action":"netwiz"},{"name":"Camera Device Settings","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Tests the image from a camera that is connected to the system using a USB cable. You can adjust settings to reduce flickering for some cameras.","action":"dialog"},{"name":"Audio Device Settings","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Sets the audio input and output devices for voice/video chat and other communication features.","action":"netwiz"},{"name":"Stereo Headset Audio Extension","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Sets whether or not to output all audio to the headset.","value":"Off"},{"name":"Voice Changer","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"You can change the voice that is input using an audio input device."},{"name":"Keyboard Type","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Select the keyboard type.","value":"English (US)"},{"name":"Keyboard Entry Method","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Sets the text entry method for a connected keyboard."},{"name":"Key Repeat Delay","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Sets the delay before key repeat starts."},{"name":"Key Repeat Rate","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Sets the rate at which a held key repeats."},{"name":"Mouse Type","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Sets the mouse type. Set this option based on which hand you use to operate the mouse.","value":"Right-handed"},{"name":"Pointer Speed","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Sets the speed at which the mouse pointer moves. The mouse pointer is displayed in the Internet browser and in games and other software that support use of a mouse.","value":"Normal"}]},{"name":"Printer Settings","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_010","subtitle":"Adjusts settings for printers that are connected to this system.","action":"dialog"},{"name":"Display Settings","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_016","subtitle":"Adjusts settings for video output.","children":[{"name":"Video Output Settings","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Configure video output settings according to your TV.","action":"netwiz"},{"name":"Screen Saver","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Configure the screen saver settings.","value":"After 20 Minutes"},{"name":"Cross Color Reduction Filter","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Reduces rainbow-effect artifacts. This setting is used when the system outputs composite signal to a VIDEO IN or SCART connector.","value":"Off"},{"name":"50 Hz Video Output","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Sets the playback method for content recorded at 50 Hz. This setting is used when playing content saved on the system storage or storage media.","value":"Auto"},{"name":"RGB Full Range (HDMI)","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Sets the range of RGB output signals for an HDMI connection.","value":"Limited"},{"name":"Y Pb/Cb Pr/Cr Super-White (HDMI)","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Sets the output format of video content recorded in a wide color range. Set this option as necessary for the TV in use.","value":"Off"},{"name":"Deep Color Output (HDMI)","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Outputs Deep Color video signal. If the video output is not clean or the colors do not look right, set this option to [Off].","value":"Automatic"},{"name":"1080p 24 Hz Output (HDMI)","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Sets the playback method for content items recorded at 24 Hz (frames/second).","value":"Auto"},{"name":"BD/DVD - Video Output Format (HDMI)","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Sets the output method for color signals when playing BDs or DVDs.","value":"Auto"},{"name":"Control for HDMI","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"The system and devices connected via HDMI can operate each other.","value":"Off"}]},{"name":"Sound Settings","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_017","subtitle":"Adjusts settings for audio output.","children":[{"name":"Audio Output Settings","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Configure audio output settings.","action":"netwiz"},{"name":"Audio Multi-Output","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Sets to output audio through multiple connectors simultaneously. Audio output to connectors that are not selected in [Audio Output Settings] is downscaled to 2 Ch.","value":"Off"},{"name":"Audio Output Device","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Sets the audio output device for use during remote play. To output audio from a PS Vita system, a PSP™ system, a PC or a mobile phone, select [Remote Play Device].","value":"System Default"},{"name":"Key Tone","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Sets whether or not to use key tones on the XMB™ menu.","value":"On"},{"name":"BD Audio Language","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Set the default BD audio language.","value":"Original"},{"name":"DVD Audio Language","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Set the default DVD audio language.","value":"English"},{"name":"HDD Audio Language","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Set the default audio language for content on the HDD.","value":"English"},{"name":"BD Audio Output Format (HDMI)","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Set the BD audio output format.","value":"Linear PCM"}]},{"name":"Security Settings","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_018","subtitle":"Adjusts parental control settings.","children":[{"name":"Change Password","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","action":"netwiz"},{"name":"Parental Control","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","value":"Off"},{"name":"Internet Browser Start Control","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","value":"Off"},{"name":"BD Parental Control","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","value":"Off"},{"name":"DVD Parental Control","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","value":"Off"}]},{"name":"Remote Play Settings","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_020","subtitle":"Adjusts settings for remote play. Remote play enables you to use a device that supports the remote play feature (such as a PSP™ system) to operate this system over a network.","children":[{"name":"Remote Start","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Sets whether or not to turn on this system automatically when a registered device is connected for remote play.","value":"Off"},{"name":"Register Device","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Register a remote play device with this system.","action":"netwiz"},{"name":"Status of Registered Devices","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","action":"netwiz"},{"name":"Delete Registered Device","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","action":"netwiz"}]},{"name":"Network Settings","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_006","subtitle":"Adjusts settings for the Internet connection.","children":[{"name":"Settings and Connection Status List","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Displays current network settings and connection status.","action":"netwiz"},{"name":"Internet Connection","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Sets whether or not to connect this system to the Internet. Select this option if you want to temporarily disable the Internet connection.","value":"Enabled"},{"name":"Internet Connection Settings","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Sets the method for connecting the system to the Internet. Select this option to connect to a wireless LAN or to change the settings.","action":"netwiz"},{"name":"Internet Connection Test","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Tests the Internet connection and displays the results.","action":"netwiz"},{"name":"Media Server Connection","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022","subtitle":"Sets whether or not to connect to media servers.","value":"Disabled"}]}]},{"id":"photo","name":"Gallery","asset":"xmbweb_xmb_icon_002","entries":[{"name":"Search for Media Servers","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_035"},{"name":"Photo Gallery","kind":"web-menu","iconAsset":"xmbweb_asset_hakoniwa"},{"name":"Playlists","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_037"},{"name":"Photos","kind":"web-menu","iconAsset":"xmbweb_asset_358972","subtitle":"10 Images","children":[{"name":"358972","kind":"web-menu","iconAsset":"xmbweb_asset_358972"},{"name":"1308922","kind":"web-menu","iconAsset":"xmbweb_asset_1308922"},{"name":"106481","kind":"web-menu","iconAsset":"xmbweb_asset_106481"},{"name":"1245403","kind":"web-menu","iconAsset":"xmbweb_asset_1245403"},{"name":"551537","kind":"web-menu","iconAsset":"xmbweb_asset_551537"},{"name":"677357","kind":"web-menu","iconAsset":"xmbweb_asset_677357"},{"name":"586388","kind":"web-menu","iconAsset":"xmbweb_asset_586388"},{"name":"509987","kind":"web-menu","iconAsset":"xmbweb_asset_509987"},{"name":"976156","kind":"web-menu","iconAsset":"xmbweb_asset_976156"},{"name":"893848","kind":"web-menu","iconAsset":"xmbweb_asset_893848"}]}]},{"id":"music","name":"Music","asset":"xmbweb_xmb_icon_003","entries":[{"name":"Search for Media Servers","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_035","subtitle":"Scans the network and connects to a media server. To use this function, a media server must be set up to allow connections from the PS3™ system."},{"name":"Playlists","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_037"},{"name":"http://s3k.ocremix.org - Project Chaos - Bonus Tracks","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_folder","subtitle":"35 Tracks  28:00","children":[{"name":"Sonic the Hedgehog and Knuckles","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"},{"name":"The Wait is Over!","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"},{"name":"Divided from Grace","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"},{"name":"Caution-Echidnas May Eat Your Brain","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"},{"name":"Walk on Water","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"},{"name":"Knuckleduster","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"},{"name":"Three Ring Nightfall","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"},{"name":"That Freezing Feeling","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"},{"name":"Elevator Music","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"},{"name":"Robotnik Radio","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"},{"name":"iMushroom","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"},{"name":"Dead Batteries","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"},{"name":"Live at the Sandopolis","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"},{"name":"Beneath the Ashes","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"},{"name":"The Secluded Stronghold","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"},{"name":"Breathtaking Vision","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"},{"name":"Scrambled Eggman","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"},{"name":"Before the Storm","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"},{"name":"Malicious Fingers","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"},{"name":"The Doomsday","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"},{"name":"So Long and Thanks for All the...","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"},{"name":"Red Sphere, Blue Sphere","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"},{"name":"Schumacher Bar","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"},{"name":"Momentary Standstill","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"},{"name":"Helium Stairways","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"},{"name":"Ivory Gadget","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"},{"name":"Heat Blur","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"},{"name":"Eternal Excavation","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"},{"name":"Groove Basin","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"},{"name":"Water on the Dancefloor","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"},{"name":"Heads Up for Tails","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"},{"name":"Stranger to Closure","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"},{"name":"Ice Cap 4 Life","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"},{"name":"Hydrochill","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"},{"name":"Lava Passion","kind":"web-menu","iconAsset":"xmbweb_asset_icon_fw_track"}]}]},{"id":"video","name":"Video","asset":"xmbweb_xmb_icon_004","entries":[{"name":"BD Data Utility","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_062","subtitle":"Delete BD data saved on the system storage."},{"name":"Search for Media Servers","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_035","subtitle":"Scans the network and connects to a media server. To use this function, a media server must be set up to allow connections from the PS3™ system."},{"name":"Video Editor & Uploader","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_067","subtitle":"You can edit a video that you like, upload it to a video sharing website, and then invite your friends to view the video."},{"name":"Welcome Clip","kind":"web-menu","iconAsset":"xmbweb_asset_clip1","subtitle":"AVC  640x360"},{"name":"Fractal Dive","kind":"web-menu","iconAsset":"xmbweb_asset_clip2","subtitle":"AVC  640x360"}]},{"id":"game","name":"Game","asset":"xmbweb_xmb_icon_005","entries":[{"name":"PS Vita System Application Utility","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_062","subtitle":"*User"},{"name":"Game Data Utility","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_062","subtitle":"Manages game data installed on the PS3™ system. To delete a game data item, select it and then press the @T button."},{"name":"Memory Card Utility (PS/PS2)","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_064","subtitle":"Manages internal memory cards for use with PlayStation® and PlayStation®2 format software.","children":[{"name":"Internal Memory Card","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_064","subtitle":"Internal memory card for PS/PS2 saved data."},{"name":"Create New Internal Memory Card","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_064","subtitle":"Create a new internal memory card."}]},{"name":"Saved Data Utility (PS2)","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_063","subtitle":"*User"},{"name":"Saved Data Utility (minis/PSP™)","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_066","subtitle":"*User"},{"name":"Saved Data Utility (PS3™)","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_063","subtitle":"*User"},{"name":"PlayStation®Store","kind":"web-menu","iconAsset":"xmbweb_playstation_store","subtitle":"FREE* to access, PlayStation®Store is the only place to download new and exclusive PS3™ games, FREE playable demos, add-on packs, and high-definition videos.\n\nGet more for your PS3™ and visit PlayStation®Store today.\n\n* Broadband Internet connection required.","action":"landing"},{"name":"Software Instruction Manuals","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_030","subtitle":"Displays manuals for the software installed on the PS3™ system."},{"name":"Corrupted Data","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_022"}]},{"id":"network","name":"Network","asset":"xmbweb_xmb_icon_006","entries":[{"name":"Online Instruction Manuals","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_030","subtitle":"View the online instruction manuals.\nThe latest version of the manual will be available."},{"name":"Play Remote Devices","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_036","subtitle":"Operate other devices on the network from this system."},{"name":"Internet Browser","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_040","subtitle":"View Web pages on the Internet."},{"name":"Internet Search","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_055","subtitle":"Search the Internet."}]},{"id":"psn","name":"PlayStation®Network","asset":"xmbweb_xmb_icon_psn","entries":[{"name":"Sign Up","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_029","subtitle":"Sign up for a PlayStation®Network account.\nA broadband Internet connection is required.","action":"landing"},{"name":"What's New","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_046","subtitle":"Welcome to PlayStation®3.\nThe \"What's New\" screen is where to find all the latest PlayStation® news, updates, plus easy access to the games you've most recently played.\nTo access the \"What's New\" screen, connect to PSN* – it's free to join and it's your gateway to a world of entertainment, so sign up today!\n\n* Broadband Internet connection required.","action":"landing"},{"name":"Trophy Collection","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_039","subtitle":"View trophies that you have earned."},{"name":"PlayStation®Plus","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_039","subtitle":"Subscribe to PlayStation®Plus and get your hands on all the benefits that come with membership."},{"name":"PlayStation®Store","kind":"web-menu","iconAsset":"xmbweb_playstation_store","subtitle":"FREE* to access, PlayStation®Store is the only place to download new and exclusive PS3™ games, FREE playable demos, add-on packs, and high-definition videos.\n\nGet more for your PS3™ and visit PlayStation®Store today.\n\n* Broadband Internet connection required.","action":"landing"}]},{"id":"friends","name":"Friends","asset":"xmbweb_xmb_icon_007","entries":[{"name":"Sign in to use Friends features","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_007","subtitle":"Sign in to PlayStation®Network to add friends, exchange messages and join chat rooms."},{"name":"Players Blocked","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_007","subtitle":"View the list of players you have blocked. You will not receive messages from blocked players."},{"name":"Add a Friend","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_007","subtitle":"Add a player to your Friends list using their PlayStation®Network ID."},{"name":"Players Met","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_007","subtitle":"View the list of players you have met during online play."},{"name":"Start a Chat","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_007","subtitle":"Start a new text chat with a friend or a group."},{"name":"Chat Rooms","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_007","subtitle":"View and join active chat rooms."},{"name":"Message Box","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_007","subtitle":"View messages you have received and sent.","children":[{"name":"Inbox","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_007","subtitle":"Displays the messages you have received."},{"name":"Sent Items","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_007","subtitle":"Displays the messages you have sent."},{"name":"Send a Message","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_007","subtitle":"Compose and send a new message."}]},{"name":"My PlayStation®Network Account","kind":"web-menu","iconAsset":"xmbweb_xmb_icon_psn","subtitle":"Manage your PlayStation®Network account.","action":"landing"}]}];
  /* V34: this XMB has no Music, Network, PlayStation Network or Friends category. */
  XMB_WEB_NATIVE_CATEGORIES = XMB_WEB_NATIVE_CATEGORIES.filter(function(c){
    return c.id!=='music' && c.id!=='network' && c.id!=='psn' && c.id!=='friends' && c.id!=='video';});
  /* V36: no Video category; Photo keeps Photo Gallery and Photos only. */
  XMB_WEB_NATIVE_CATEGORIES.forEach(function(c){
    if (c.id==='photo') c.entries=c.entries.filter(function(e){return e.name!=='Search for Media Servers' && e.name!=='Playlists';});
  });
  /* V48: Settings keeps System Settings, Theme Settings and PS5 XMB Controls; Photo keeps Photos only (your screenshots) */
  var XMB_SETTINGS_REMOVED = ['System Update','Game Settings','Video Settings','Music Settings','Chat Settings','Power Save Settings',
    'Accessory Settings','Printer Settings','Display Settings','Sound Settings','Security Settings','Remote Play Settings','Network Settings',
    'Date and Time Settings'];
  XMB_WEB_NATIVE_CATEGORIES.forEach(function(c){
    if (c.id==='settings') c.entries=c.entries.filter(function(e){return XMB_SETTINGS_REMOVED.indexOf(e.name)<0;});
    if (c.id==='photo') c.entries=c.entries.filter(function(e){return e.name!=='Photo Gallery';});
  });
  /* V60: Settings > System Settings on a PS5. The PS3 list without what has no PS5 equivalent (character set / dictionary / predictive
   * text, DivX, ATRAC / WMA, PS Vita, What's New, disc auto-start); the PS5's real values where the PS3 showed one (read through the
   * ELF: /xmb-sys); the rest open the matching PS5 Settings screen (XMB_PS5_PAGES - filled in once the PS5's page links are known;
   * until then they say "not available yet"). Nothing here changes a system setting by itself. */
  /* page key -> PS5 URI (or a function giving it). From psdevwiki's PS5 URI list: pssettings:play?mode=settings&function=<page>.
   * Pages with no known link of their own open PS5 Settings at its start (mode=settings). */
  var XMB_PS5_SETTINGS = 'pssettings:play?mode=settings';
  var XMB_PS5_PAGES = {
    settings: XMB_PS5_SETTINGS,
    language: XMB_PS5_SETTINGS + '&function=language',
    notifications: XMB_PS5_SETTINGS + '&function=notification',
    trophyNotifications: XMB_PS5_SETTINGS + '&function=notification',
    storage: function () { return XMB_PS5_SETTINGS + '&function=storage&storage=internal&userid=' + (xmbUsersCache && xmbUsersCache.fgId != null ? xmbUsersCache.fgId : ''); },
    network: XMB_PS5_SETTINGS + '&function=network',
    autoUpdate: XMB_PS5_SETTINGS, systemName: XMB_PS5_SETTINGS, hdmi: XMB_PS5_SETTINGS, backup: XMB_PS5_SETTINGS,
    dataTransfer: XMB_PS5_SETTINGS, reset: XMB_PS5_SETTINGS
  };
  var XMB_LANG_NAMES = ['Japanese','English (United States)','French (France)','Spanish (Spain)','German','Italian','Dutch','Portuguese (Portugal)',
    'Russian','Korean','Chinese (Traditional)','Chinese (Simplified)','Finnish','Swedish','Danish','Norwegian','Polish','Portuguese (Brazil)',
    'English (United Kingdom)','Turkish','Spanish (Latin America)','Arabic','French (Canada)','Czech','Hungarian','Greek','Romanian','Thai',
    'Vietnamese','Indonesian','Ukrainian'];
  function xmbGB(b) { b = Number(b) || 0; return b >= 1e9 ? (Math.round(b / 1e8) / 10) + ' GB' : Math.round(b / 1e6) + ' MB'; }
  function xmbSysSettingsChildren() {
    /* V61: read-only information about this PS5 + one item that opens the PS5's own Settings */
    var s = (xmbHome && xmbHome.sys) || {}, I = 'xmbweb_xmb_icon_022';   /* runs once before xmbHome exists (var: undefined) */
    var lang = typeof s.lang === 'number' ? (XMB_LANG_NAMES[s.lang] || ('Language ' + s.lang)) : '';
    var info = function (name, value) { return {name:name, kind:'info', iconAsset:I, value:value || ''}; };
    return [
      {name:'PS5 Settings', kind:'ps5-page', page:'settings', iconAsset:I, subtitle:'Opens the settings of this PS5™ system.'},
      info('System Software', s.fw ? 'Version ' + s.fw : ''),
      info('System Name', s.name),
      info('System Language', lang),
      info('MAC Address' + (s.wifi === true ? ' (Wi-Fi)' : s.wifi === false ? ' (Wired)' : ''), s.mac),
      info('IP Address', s.ip || 'Not connected'),
      info('System Storage', s.total ? xmbGB(s.free) + ' free of ' + xmbGB(s.total) : '')
    ];
  }
  /* put the list in place (again when the values arrive; an open System Settings / System Information list is refreshed too) */
  function xmbSysSettingsApply() {
    XMB_WEB_NATIVE_CATEGORIES.forEach(function (c) {
      if (c.id !== 'settings') return;
      c.entries.forEach(function (e, k) {
        if (e.name !== 'System Settings') return;
        var old = e.children, kids = xmbSysSettingsChildren(), oldInfo = null;
        (old || []).forEach(function (o) { if (o.name === 'System Information') oldInfo = o.children; });
        c.entries[k] = Object.assign({}, e, {children:kids, subtitle:'Shows information about this PS5™ system and opens its settings.'});
        ((xmbHome && xmbHome.webStack) || []).forEach(function (f) {
          if (old && f.entries === old) f.entries = kids;
          else if (oldInfo && f.entries === oldInfo) f.entries = kids;
        });
      });
    });
  }
  xmbSysSettingsApply();
  function xmbSysFetch() {
    if (xmbHome.sysPending || typeof globalThis.fetch !== 'function') return;
    xmbHome.sysPending = true;
    try {
      globalThis.fetch('http://127.0.0.1:4444/xmb-sys', {method:'POST'})
        .then(function (r) { return r && r.ok ? r.text() : ''; })
        .then(function (t) {
          xmbHome.sysPending = false;
          var j = null; try { j = t ? JSON.parse(t) : null; } catch (e) { j = null; }
          if (!j || typeof j !== 'object') return;
          xmbHome.sys = j; xmbSysSettingsApply();
          log('PS5XMB: SYSINFO ' + String(t).slice(0, 200));
          xmbNotify();
        })
        .catch(function () { xmbHome.sysPending = false; });
    } catch (e) { xmbHome.sysPending = false; }
  }
  /* V51: Settings > Theme Settings > Colour and Day/Night choose the wave, as on the PS3: Colour = Original (the month's colour, changes
   * every month) or one month's colour all year; Day/Night = Automatic (PS3 times, see xmbWaveIsNight) or always Day / always Night. Saved on the
   * console (ZT_DIR/PS5XMB_settings.txt) with the other XMB settings. */
  var XMB_MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var XMB_WAVE_TIMES = [['Automatic','auto','As on the PS3: day from 02:35 to 19:25, night the rest of the time.'],['Day','day','Always the day wave.'],['Night','night','Always the night wave.']];
  function xmbThemeSettings() {
    var st = XMB_WEB_NATIVE_CATEGORIES.filter(function(c){return c.id==='settings';})[0];
    return st ? st.entries.filter(function(e){return e.name==='Theme Settings';})[0] || null : null;
  }
  function xmbWaveMenus() {
    var ts = xmbThemeSettings(), tick = '\u2713';
    if (!ts || !Array.isArray(ts.children)) return;
    var colour = [{name:'Original', kind:'wave-month', month:0, iconAsset:'xmbweb_xmb_icon_022', subtitle:'The colour changes every month, as on the PS3.', value:xmbHome.waveMonth === 0 ? tick : ''}]
      .concat(XMB_MONTH_NAMES.map(function(n, i){return {name:n, kind:'wave-month', month:i + 1, iconAsset:'xmbweb_xmb_icon_022', subtitle:'Always the ' + n + ' colour.', value:xmbHome.waveMonth === i + 1 ? tick : ''};}));
    var times = XMB_WAVE_TIMES.map(function(t){return {name:t[0], kind:'wave-time', time:t[1], iconAsset:'xmbweb_xmb_icon_022', subtitle:t[2], value:xmbHome.waveTime === t[1] ? tick : ''};});
    var timeName = XMB_WAVE_TIMES.filter(function(t){return t[1] === xmbHome.waveTime;})[0];
    ts.children = ts.children.filter(function(e){ return e.name === 'Colour' || e.name === 'Day/Night'; }).map(function(e){   /* V61: only these two */
      if (e.name === 'Colour') return {name:'Colour', kind:'web-menu', iconAsset:e.iconAsset, waveMenu:'month', children:colour,
        subtitle:'Sets the colour of the background (Original changes every month).', value:xmbHome.waveMonth ? XMB_MONTH_NAMES[xmbHome.waveMonth - 1] : 'Original'};
      if (e.name === 'Day/Night') return {name:'Day/Night', kind:'web-menu', iconAsset:e.iconAsset, waveMenu:'time', children:times,
        subtitle:'Sets the time-of-day lighting of the background.', value:timeName ? timeName[0] : 'Automatic'};
      return e;
    });
    /* open menus follow (new rows -> the renderer shows the new tick / value) */
    xmbHome.webStack.forEach(function(f){
      if (f.name === 'Theme Settings') f.entries = ts.children;
      else if (f.waveMenu === 'month') f.entries = colour;
      else if (f.waveMenu === 'time') f.entries = times;
    });
  }
  function xmbPrefSave(key, value) {
    if (typeof globalThis.fetch !== 'function') return;
    try { globalThis.fetch('http://127.0.0.1:4444/xmb-prefs?key=' + encodeURIComponent(key) + '&value=' + encodeURIComponent(String(value)), {method:'POST'}).catch(function(){}); } catch (e) {}
  }
  function xmbPrefsApply(text) {
    String(text || '').split('\n').forEach(function(line){
      var m = /^([A-Za-z0-9]+)=([A-Za-z0-9._-]+)\s*$/.exec(line);
      if (!m) return;
      var k = m[1], v = m[2], n = Number(v);
      if (k === 'waveMonth' && n >= 0 && n <= 12 && Math.floor(n) === n) xmbHome.waveMonth = n;
      else if (k === 'waveTime' && /^(auto|day|night)$/.test(v)) xmbHome.waveTime = v;
      else if (k === 'gameSort' && /^(date|format|az|za|custom)$/.test(v) && v !== xmbHome.gameSort) { xmbHome.gameSort = v; xmbGamesResort(); }   /* V63; V74 custom */
      /* V61: everything else is fixed (PS3 motion and sounds, 100 % speeds, 0 ms start delay, music volume 60, boot animation on):
       * older saved values for them are ignored */
    });
    xmbWaveMenus();
  }
  function xmbPrefsLoad() {
    if (typeof globalThis.fetch !== 'function') return;
    try {
      globalThis.fetch('http://127.0.0.1:4444/xmb-prefs', {method:'GET'})
        .then(function (r) { return r && r.ok ? r.text() : ''; })
        .then(function (t) { if (t) { xmbPrefsApply(t); log('PS5XMB: SETTINGS ' + String(t).replace(/\n/g, ' ').slice(0, 200)); xmbNotify(); } })
        .catch(function () {});
    } catch (e) {}
  }
  var XMB_GAME_CAT = XMB_WEB_NATIVE_CATEGORIES.map(function(c){return c.id;}).indexOf('game');
  function xmbWebActiveIndex() {
    var st=xmbHome.webStack;
    return st && st.length ? (st[st.length-1].cursor || 0) :
      (xmbHome.cursor[xmbHome.category] || 0);
  }
  function xmbWebEnter(item) {
    if (!item || !Array.isArray(item.children) || !item.children.length) return false;
    if (xmbHome.webStack.length > 8) return false;
    xmbHome.webStack.push({entries:item.children,cursor:0,name:item.name,photos:!!item.photos,waveMenu:item.waveMenu || '',fid:item.fid || ''});
    xmbHome.onLaunch=null;
    xmbPlaySfx('decide');
    xmbNotify();
    return true;
  }
  var xmbHome = {
    fbToken: 0, fbKey: '', sfxPortOn: false, fbNative: false, musicVol: 60,
    animSpeed: 100, holdSpeed: 100, bgDelay: 100, startDelay: 0, waveMonth: 0, waveTime: 'auto', motion: 'ps3',   /* V52: PS3 motion = 200 ms at 100 % */   /* V51: wave colour 0 = Original (by month) | 1-12, day/night auto|day|night */   /* V38 defaults; bgDelay = focus-background delay in % of 1000 ms, startDelay = ms before a cursor move starts animating */
    visible: APP === 'home' && !PLAIN && !!THEME.xmbHomeOn,
    /* v0.5: NEVER hide Home or intercept input before native text lays out. */
    active: false, mounted: false, viewLaidOut: false, textLaidOut: false,
    fullProbe: false, fullViewLaidOut: false, fullCatLaidOut: false,
    fullItemLaidOut: false, probeTimer: null, watchdog: null,
    stage: 'WAITING_FOR_NATIVE_LAYOUT',
    category: XMB_GAME_CAT, cursor: XMB_WEB_NATIVE_CATEGORIES.map(function(){return 0;}),
    soundMode: 'ps3', sfxKind: '', sfxToken: 0, sfxTimer: null, sfxFailed: false,
    optionsOpen: false, optionsCursor: 0, optionsSub: null, confirmExit:false, exitError:'', gameSort: 'az', appDates: {}, appSizes: {}, infoOpen: false, visualMode: 'classic',
    categoryMotionMode: 'xmb-web', // exact clone's 250ms easeOutCubic timing; Mode-5 selectable
    verticalMotionMode: 'xmb-web', // exact clone's 200ms easeOutCubic timing; Mode-5 selectable
    verticalGeometryMode: 'designer', // Sony preset 0 proportions are experimental and NOT proven Game defaults
    cats: XMB_WEB_NATIVE_CATEGORIES.map(function(c){return {
      id:c.id,name:c.name,asset:c.asset
    };}),
    webStack:[],
    listeners: [], onLaunch: null, logCount: 0, captureCount: 0, inputLogCount: 0, rootQueued: false, renderCalls: 0,
    diagnosticOnly: false
  };
  xmbWaveMenus();   /* V51: Theme Settings > Colour / Day/Night (re-made when the saved settings arrive) */
  /* Suppress Sony's Home header while the opt-in XMB is enabled. These
   * are the existing XMB5 display flags, not new native detours.
   * On /quit the original styles are restored along with the hooks. */
  if (xmbHome.visible) {
    THEME.hideTabs = true; THEME.hideSearch = true;
    THEME.hideSettings = true; THEME.hideProfile = true;
    THEME.hideClock = true; THEME.topBarOpacity = 0;
    // Don't start a second upstream XMB5 wallpaper/video while XMB is active.
    xmbHome.previousMediaSettings={wallpaperOn:THEME.wallpaperOn,
      tileAnimOn:THEME.tileAnimOn,homeMusicOn:THEME.homeMusicOn};
    THEME.wallpaperOn=false; THEME.tileAnimOn=false; THEME.homeMusicOn=false;
    /* XMB5's clock style is separately forced transparent below, since
       display:none on the native clock wrapper can leave its text visible. */
  }
  if (APP === 'home') {
    log('PS5XMB: SCRIPT_EVALUATED app=' + APP + ' visible=' + xmbHome.visible +
        ' react=' + !!T.React + ' rn=' + !!T.rn + ' plain=' + PLAIN);
    setTimeout(function () {
      log('PS5XMB: EIGHT_SECOND_STATUS root=' + xmbHome.rootQueued +
          ' renderCalls=' + xmbHome.renderCalls + ' wrappedControls=' + xmbHome.captureCount + ' mounted=' + xmbHome.mounted +
          ' viewLayout=' + xmbHome.viewLaidOut + ' textLayout=' + xmbHome.textLaidOut +
          ' fullProbe=' + xmbHome.fullProbe + ' active=' + xmbHome.active +
          ' stage=' + xmbHome.stage);
    }, 8000);
  }
  /* Critical on PS5: native Text accepts ONLY FontSizePS table values.
   * XMB5 fontSize(px) resolves to the closest supported enum. A raw
   * integer such as 23 can kill the HomeUI renderer before onLayout. */
  function xmbFontSize(px) {
    var safe = fontSize(px);
    return safe > 0 ? safe : undefined; /* omit if table is not available */
  }
  /* PS3 VSH 4.93 PAF mode-5 category timing (research): input 200 ms,
   * 12 nominal 60 Hz ticks, gain 1/((12-5)*0.33333298564+2.20000004768)
   * and per-evaluation multiplier 1.0000009536743164. The source widget's
   * dynamic vtable on actual hardware remains unproven. This approximation
   * maps frame recurrence into wall-clock time for RN's native driver.
   * It is NOT a byte-exact PS3 renderer or a verified PS5 hardware result. */
  var XMB_PS3_BAR_SETTLE_MS = 850;
  function xmbPs3CategoryEase(value) {
    var t = typeof value === 'number' && isFinite(value) ? Math.max(0,Math.min(1,value)) : 0;
    var gain = 1 / ((12-5)*0.33333298564+2.20000004768);
    var multiplier = 1.0000009536743164;
    var retention = multiplier*(1-gain);
    var limit = multiplier*gain/(1-retention);
    var frames = t*XMB_PS3_BAR_SETTLE_MS*60/1000;
    return Math.max(0,Math.min(1,limit*(1-Math.pow(retention,frames))));
  }
  /* Source: user-provided xmb-web/index.html easeOutCubic(t) and V.CAT_ANIM_MS=250, V.ITEM_ANIM_MS=200.
   * Same easing expression, executed by PS5 native Animated driver rather than browser Canvas. */
  var XMB_WEB_CAT_MS = 250, XMB_WEB_ITEM_MS = 200;
  function xmbWebEase(t) {
    t = typeof t==='number' && isFinite(t) ? Math.max(0,Math.min(1,t)) : 0;
    return 1-Math.pow(1-t,3);
  }
  /* Sony's vertical VSH reflow callers pass 200.0 to PAF mode 5.
   * The PS5 React Native easing is a bounded approximation, NOT Sony's
   * byte-exact interpolator. Do not borrow the category-only 850ms tail:
   * that makes the row cursor lag several items during rapid D-pad input. */
  var XMB_PS3_VERTICAL_DURATION_MS = 200;
  function xmbPs3VerticalEase(value) {
    var t = typeof value === 'number' && isFinite(value) ?
      Math.max(0,Math.min(1,value)) : 0;
    return t*t*(3-2*t); // Continuous first derivative at both ends, both directions.
  }
  /* PS5XMB_V19_1_EXACT_SOURCE_GAME_VERTICAL_20261117 */
  /* V18 RPCS3 evidence: 141 cue-aligned frames, departing/arriving Game
   * folders' positional tau ~61.2/61.9 ms. This 320 ms finite exponential
   * is a visually fitted FIRST PS5 test, not proven Sony source easing.
   * Existing row position AND game icon scale interpolate against the same
   * native Animated.Value, so no second scale system is introduced. */
  var XMB_V19_1_GAME_DURATION_MS = 320;
  function xmbV19_1GameEase(value) {
    var t=typeof value==='number' && isFinite(value)?
      Math.max(0,Math.min(1,value)):0;
    var exponent=XMB_V19_1_GAME_DURATION_MS/62;
    return (1-Math.exp(-exponent*t))/(1-Math.exp(-exponent));
  }
  /* A row's path is linear except at the immediate focus boundaries.
   * Anchors are tied to the ROW, not the latest cursor. They span the whole
   * list, so rapid input/reversal cannot clamp at a moving local window. */
  function xmbRowMotionAnchors(row, count, category, focusHeight, idleHeight) {
    var last = Math.max(0, count-1), raw=[0,row-1,row,row+1,last];
    var ix=[], oy=[], scales=[];
    for (var q=0;q<raw.length;q++) {
      var k=raw[q];
      if (k<0 || k>last || ix.indexOf(k)!==-1) continue;
      ix.push(k);
    }
    ix.sort(function(a,b){return a-b;});
    for (var a=0;a<ix.length;a++) {
      var selection=ix[a]===row;
      // Image is always based on its largest (focus) size. Center the
      // idle image in exactly the same location as the pre-patch layout.
      oy.push(xmbRowY(row-ix[a],category) +
        (selection ? 0 : (idleHeight-focusHeight)/2));
      scales.push(selection ? 1 : 0);
    }
    return {ix:ix, y:oy, focus:scales};
  }
  function xmbEnabled() { return APP === 'home' && !PLAIN && !!THEME.xmbHomeOn && xmbHome.visible && xmbHome.active; }
  var xmbGamesCache = {row:null, all:null, at:0, items:null};
  function xmbGames() {
    var list = T.rowData || [], all = T.allGames || {}, now = Date.now();
    if (xmbGamesCache.items && xmbGamesCache.row === list &&
        xmbGamesCache.all === all && xmbGamesCache.sort === xmbHome.gameSort && now - xmbGamesCache.at < 5000)
      return xmbGamesCache.items;
    var result = [], seen = {};
    /* Prefer the currently shown Sony game row. Never modify that list. */
    function add(id, name, icon, bg, snd) {
      if (typeof id !== 'string' || !/^[A-Z]{4}\d{5}$/.test(id) || /^NPXS/.test(id) || seen[id]) return;
      seen[id] = true;
      var meta = all[id] || {};
      result.push({ id: id, name: String(name || id).slice(0, 90), icon: String(icon || ''), bg: String(bg || meta.bg || ''), snd: String(snd || meta.snd || ''), kind: 'game',
        lastPlayed: (T.played && T.played[id]) || (T.allGames && T.allGames[id] && T.allGames[id].lastPlayed) || 0 });
    }
    list.forEach(function (g) { if (g) add(g.id, g.experienceName || g.name, g.iconPath && g.iconPath.uri,
      (g.pic0PathWithTs || g.backgroundImagePathWithTs || (g.backgroundImage && g.backgroundImage.uri) || ''), g.sndPathWithTs); });
    Object.keys(all).forEach(function (id) {
      var g = all[id]; if (g) add(id, g.name || g.experienceName, g.icon, g.bg, g.snd);
    });
    xmbGamesSort(result);   /* V63: the Triangle panel's Sort By (A to Z by default) */
    xmbAppDatesWant(result);
    // Game category contains installed games/apps ONLY. Keep the Library
    // route elsewhere; no Data Utility, Saved Data or Trophy utility tiles.
    if (!result.length) result.push({name:'Loading installed games...',kind:'loading',iconAsset:'xmb_item_game'});
    xmbGamesCache = {row:list, all:all, at:now, items:result, sort:xmbHome.gameSort};
    return result;
  }
  /* Sony app.db lastPlayedDate, already gathered by XMB5 notePlayed().
     Unknown timestamps are not estimated from lastAccessDate or build date. */
  function xmbPlayedLabel(item) {
    if (!item || item.kind !== 'game') return '';
    var raw = (T.played && T.played[item.id]) || item.lastPlayed;
    /* V80: a title never played (or whose play date the Home does not give) shows the date it was installed, as the PS3 shows a date
     * on every title (the ELF reads it with the badges: /xmb-appinfo) */
    if (!raw && xmbHome.appDates && xmbHome.appDates[item.id] > 0) raw = xmbHome.appDates[item.id];
    if (!raw) return '';
    var v = typeof raw === 'number' ? raw : Date.parse(String(raw));
    if (!(v > 0) && /^\d+$/.test(String(raw))) v = Number(raw);
    if (!(v > 0)) return '';
    if (v < 1e11) v *= 1000;
    if (!(v > 946684800000 && v < Date.now() + 86400000)) return '';
    var d = new Date(v), hr = d.getHours(), mm = d.getMinutes();
    return (d.getMonth()+1) + '/' + d.getDate() + '/' +
      d.getFullYear() + '  ' + ((hr%12)||12) + ':' + (mm < 10 ? '0':'') + mm +
      (hr < 12 ? ' AM':' PM');
  }
  /* V31: parsed xmb-web DATA hierarchy, not placeholder PS5 labels. */
  function xmbCategoryItems(c) {
    var cat=XMB_WEB_NATIVE_CATEGORIES[c];
    if (!cat) return [];
    /* V36: the Game category holds installed games and apps ONLY (Return to PS5 Home / Game Library live in Settings > PS5 XMB Controls). */
    if (cat.id==='game') return xmbGameItems();   /* V68: folders first, then the games that are in none */
    if (cat.colId) return xmbColumnItems(cat.colId);   /* V73: a custom column */
    if (cat.id==='user') return xmbUserItems(cat.entries);
    if (cat.id==='photo') return xmbPhotoItems(cat.entries);
    if (cat.id==='settings') return cat.entries.concat([{
      name:'PS5 XMB Controls',kind:'web-menu',iconAsset:'xmbweb_xmb_icon_023',subtitle:'Leaves the XMB and returns to the PS5 Home screen.',children:[
        {name:'Return to PS5 Home',kind:'stock',iconAsset:'xmbweb_xmb_icon_054'},
      ]
    }]);
    return cat.entries;
  }
  /* V48: Photo > Photos lists the console's screenshots (/user/av_contents/photo/NPXS40087/NPXS40087/<nnn>/*.png, from the ELF:
   * /xmb-photos), newest first. Each row shows a small filtered copy (made once by the ELF, like the game icons); X shows the picture
   * full screen, Left / Right go to the previous / next one, Circle (or X) goes back. */
  var xmbPhotosCache = {at:0, raw:null, folder:null, pending:false};
  function xmbPhotoName(path) {
    var f = String(path).replace(/^.*\//, ''), m = /^(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/.exec(f);
    return m ? m[1] + '/' + m[2] + '/' + m[3] + ' ' + m[4] + ':' + m[5] + ':' + m[6] : f.replace(/\.[a-z]+$/i, '');
  }
  function xmbPhotosFetch(force) {
    if (xmbPhotosCache.pending || typeof globalThis.fetch !== 'function') return;
    if (!force && xmbPhotosCache.raw !== null && Date.now() - xmbPhotosCache.at < 20000) return;
    xmbPhotosCache.pending = true;
    try {
      globalThis.fetch('http://127.0.0.1:4444/xmb-photos', {method:'POST'})
        .then(function (r) { return r && r.ok ? r.text() : ''; })
        .then(function (t) { xmbPhotosCache.pending = false; xmbPhotosCache.at = Date.now(); xmbPhotosApply(t); })
        .catch(function () { xmbPhotosCache.pending = false; });
    } catch (e) { xmbPhotosCache.pending = false; }
  }
  function xmbPhotosApply(t) {
          var list = null; try { list = t ? JSON.parse(t) : null; } catch (e) { list = null; }
          if (!Array.isArray(list) || t === xmbPhotosCache.raw) return;
          xmbPhotosCache.raw = t;
          xmbPhotosCache.folder = null;
          xmbPhotosCache.list = list.filter(function (p) { return p && typeof p.p === 'string'; }).map(function (p, k) {
            return {name:xmbPhotoName(p.p), kind:'photo', id:'photo-' + k, path:p.p, icon:p.p, iconAsset:'xmbweb_xmb_icon_002'};
          });
          log('PS5XMB: PHOTOS ' + xmbPhotosCache.list.length);
          /* an open Photos list follows the new one (same cursor where possible) */
          xmbHome.webStack.forEach(function (f) { if (f.photos) { f.entries = xmbPhotoFolder(null).children; f.cursor = Math.min(f.cursor, f.entries.length - 1); } });
          xmbNotify();
  }
  function xmbPhotoFolder(base) {
    if (xmbPhotosCache.folder) return xmbPhotosCache.folder;
    var list = xmbPhotosCache.list || [], b = base || {};
    xmbPhotosCache.folder = {name:'Photos', kind:'web-menu', photos:true, ns:true, iconAsset:b.iconAsset || 'xmbweb_asset_358972',   /* V80: count only when focused */
      subtitle:xmbPhotosCache.list ? list.length + (list.length === 1 ? ' Image' : ' Images') : '',
      children:list.length ? list : [{name:xmbPhotosCache.list ? 'No screenshots yet' : 'Loading...', kind:'none', iconAsset:'xmbweb_xmb_icon_002'}]};
    return xmbPhotosCache.folder;
  }
  /* V78: Gallery (was Photo) > Video: the PS5's captured videos (/xmb-videos). X plays one full screen (the wave video stops: the PS5
   * plays one video at a time), Left / Right = previous / next, Circle (or X) goes back. */
  var xmbVideosCache = {at:0, raw:null, folder:null, pending:false};
  function xmbVideosFetch(force) {
    if (xmbVideosCache.pending || typeof globalThis.fetch !== 'function') return;
    if (!force && xmbVideosCache.raw !== null && Date.now() - xmbVideosCache.at < 20000) return;
    xmbVideosCache.pending = true;
    try {
      globalThis.fetch('http://127.0.0.1:4444/xmb-videos', {method:'POST'})
        .then(function (r) { return r && r.ok ? r.text() : ''; })
        .then(function (t) { xmbVideosCache.pending = false; xmbVideosCache.at = Date.now(); xmbVideosApply(t); })
        .catch(function () { xmbVideosCache.pending = false; });
    } catch (e) { xmbVideosCache.pending = false; }
  }
  function xmbVideosApply(t) {
    var list = null; try { list = t ? JSON.parse(t) : null; } catch (e) { list = null; }
    if (!Array.isArray(list) || t === xmbVideosCache.raw) return;
    xmbVideosCache.raw = t;
    xmbVideosCache.folder = null;
    xmbVideosCache.list = list.filter(function (v) { return v && typeof v.n === 'string' && typeof v.i === 'number'; }).map(function (v) {
      return {name:xmbPhotoName(v.n), kind:'video', id:'video-' + v.i, vi:v.i, iconAsset:'xmbweb_xmb_icon_004',
              subtitle:v.s ? xmbSizeText(v.s) : '', ext:/\.webm$/i.test(v.n) ? 'webm' : 'mp4'};
    });
    log('PS5XMB: VIDEOS ' + xmbVideosCache.list.length);
    xmbPhotosCache.items = null;
    xmbHome.webStack.forEach(function (f) { if (f.videos) { f.entries = xmbVideoFolder().children; f.cursor = Math.min(f.cursor, f.entries.length - 1); } });
    xmbNotify();
  }
  function xmbVideoFolder() {
    if (xmbVideosCache.folder) return xmbVideosCache.folder;
    var list = xmbVideosCache.list || [];
    xmbVideosCache.folder = {name:'Video', kind:'web-menu', videos:true, ns:true, iconAsset:'xmbweb_xmb_icon_004',
      subtitle:xmbVideosCache.list ? list.length + (list.length === 1 ? ' Video' : ' Videos') : '',
      children:list.length ? list : [{name:xmbVideosCache.list ? 'No videos yet' : 'Loading...', kind:'none', iconAsset:'xmbweb_xmb_icon_004'}]};
    return xmbVideosCache.folder;
  }
  function xmbPhotoItems(entries) {
    xmbPhotosFetch(false);
    xmbVideosFetch(false);
    var base = entries.filter(function (e) { return e.name === 'Photos'; })[0];
    var folder = xmbPhotoFolder(base), vfolder = xmbVideoFolder();
    if (xmbPhotosCache.items && xmbPhotosCache.items[0] === folder && xmbPhotosCache.items.vf === vfolder && xmbPhotosCache.items.src === entries) return xmbPhotosCache.items;
    var out = entries.map(function (e) { return e.name === 'Photos' ? folder : e; });
    out.push(vfolder);
    out.vf = vfolder;
    out.src = entries;
    xmbPhotosCache.items = out;
    return out;
  }
  /* V43: the Users category lists the console's real users (name + picture, from the ELF: /xmb-users), after Turn Off System and
   * Create New User, as on the PS3. The list is asked for when the XMB starts and again when you come back to Users (>= 30 s later). */
  var xmbUsersCache = {at:0, list:null, raw:null, pending:false};
  function xmbUsersFetch(force) {
    if (xmbUsersCache.pending || typeof globalThis.fetch !== 'function') return;
    if (!force && xmbUsersCache.list && Date.now() - xmbUsersCache.at < 30000) return;
    xmbUsersCache.pending = true;
    try {
      globalThis.fetch('http://127.0.0.1:4444/xmb-users', {method:'POST'})
        .then(function (r) { return r && r.ok ? r.text() : ''; })
        .then(function (t) {
          xmbUsersCache.pending = false; xmbUsersCache.at = Date.now();
          var list = null; try { list = t ? JSON.parse(t) : null; } catch (e) { list = null; }
          if (!Array.isArray(list)) return;
          if (t === xmbUsersCache.raw && xmbUsersCache.face === xmbHome.faceUri) return;
          xmbUsersCache.face = xmbHome.faceUri;
          xmbUsersCache.raw = t;
          xmbUsersCache.fgId = null;
          list.forEach(function (u) { if (u.fg) xmbUsersCache.fgId = u.id; });   /* V60: the signed-in user (PS5 Storage page link) */
          xmbUsersCache.list = list.map(function (u) {
            var uris = xmbFaceUris(Number(u.id) || 0, u.pic ? String(u.pic) : '');
            return {name:String(u.name || 'User'), kind:'user', id:'user-' + u.id, uid:Number(u.id) || 0, fg:!!u.fg, iconAsset:'xmbweb_xmb_icon_000', icon:uris[0], alts:uris.slice(1),
                    subtitle:u.fg ? 'Signed in' : ''};
          });
          log('PS5XMB: USERS ' + xmbUsersCache.list.length + ' ' + xmbUsersCache.list.map(function (u) { return u.name + (u.icon ? '+pic' : ''); }).join(', '));
          xmbNote('users: picture of the signed-in user seen in the Home: ' + (xmbHome.faceUri ? 'yes' : 'not yet') + '; tried: ' +
            xmbUsersCache.list.map(function (u) { return u.name + ' -> ' + [u.icon].concat(u.alts || []).slice(0, 3).join(' , '); }).join(' | '));
          xmbUsersCache.items = null;
          xmbNotify();
        })
        .catch(function () { xmbUsersCache.pending = false; });
    } catch (e) { xmbUsersCache.pending = false; }
  }
  /* V60: Users > Turn Off System (PS3) + Restart System + Enter Rest Mode. X once arms it ("Press X again"), X again within 5 s does it,
   * through XMB5's power path (THEME-POWER -> the ShellUI's own PowerManager: apps are closed normally). */
  var XMB_POWER_ITEMS = [
    {name:'Turn Off System', kind:'power', what:'off', iconAsset:'xmbweb_xmb_icon_054', subtitle:'Turns off this system.'},
    {name:'Restart System', kind:'power', what:'restart', iconAsset:'xmbweb_xmb_icon_054', subtitle:'Restarts this system.'},
    {name:'Enter Rest Mode', kind:'power', what:'rest', iconAsset:'xmbweb_xmb_icon_054', subtitle:'Puts this system in rest mode.'}
  ];
  /* the renderer caches a row per entry object: a changed value is a NEW object (and a new Users list) */
  function xmbPowerValue(what, value) {
    XMB_POWER_ITEMS.forEach(function (p, k) {
      var v = p.what === what ? value : '';
      if ((p.value || '') !== v) XMB_POWER_ITEMS[k] = Object.assign({}, p, {value:v});
    });
    xmbUsersCache.items = null;
  }
  function xmbPowerPress(item) {
    var now = Date.now(), arm = xmbHome.powerArm;
    if (arm && arm.what === item.what && now - arm.at < 5000) {
      xmbHome.powerArm = null; xmbPowerValue('', '');
      xmbPlaySfx('decide'); log('PS5XMB: POWER ' + item.what);
      try { console.log('THEME-POWER ' + item.what); } catch (e) {}
      xmbNotify(); return true;
    }
    xmbHome.powerArm = {what:item.what, at:now}; xmbPowerValue(item.what, 'Press X again');
    xmbPlaySfx('ok'); xmbNotify();
    if (typeof setTimeout === 'function') setTimeout(function () {
      if (xmbHome.powerArm && xmbHome.powerArm.at === now) { xmbHome.powerArm = null; xmbPowerValue('', ''); xmbNotify(); }
    }, 5000);
    return true;
  }
  function xmbUserItems(entries) {
    xmbUsersFetch(false);
    if (xmbUsersCache.items && xmbUsersCache.items.src === entries) return xmbUsersCache.items;
    /* V68: no Turn Off / Restart / Rest Mode here any more (the PS button's menu has them) */
    var base = entries.filter(function (e) { return e.name !== '*User' && e.name !== 'Turn Off System' && e.name !== 'Create New User'; });   /* V78: no Create New User */
    var out = base.concat(xmbUsersCache.list && xmbUsersCache.list.length ? xmbUsersCache.list : entries.filter(function (e) { return e.name === '*User'; }));
    out.src = entries;
    if (xmbUsersCache.list) xmbUsersCache.items = out;    /* one array per user list: the renderer keeps its rows */
    return out;
  }
  function xmbItems() {
    var st=xmbHome.webStack;
    if (st && st.length) return st[st.length-1].entries;
    return xmbCategoryItems(xmbHome.category);
  }
  function xmbSelected() {
    var items = xmbItems();
    var n = Math.max(0, Math.min(items.length - 1, xmbWebActiveIndex()));
    return items[n] || null;
  }
  function xmbRoute(item) {
    if (!item) return '';
    if (item.kind === 'library') return 'pslibraryhub:main?space=game';
    if (item.kind === 'route' && typeof item.uri === 'string') return item.uri;
    if (item.kind === 'ps5-page' && XMB_PS5_PAGES[item.page]) {   /* V60 */
      var pg = XMB_PS5_PAGES[item.page];
      return typeof pg === 'function' ? pg() : pg;
    }
    if (item.kind === 'game' && /^[A-Z]{4}\d{5}$/.test(item.id) && !/^NPXS/.test(item.id))
      return folderLink(item.id); /* same link as XMB5's working folder launcher */
    return '';
  }
  function xmbNotify() {
    xmbFocusFrameSync();   /* V64 */
    if (xmbHome.renderTimer) { clearTimeout(xmbHome.renderTimer); xmbHome.renderTimer = null; }
    xmbHome.renderFirst = 0;
    /* start the animations NOW; the React render that follows only updates the rows */
    if (xmbNativeInstance && xmbNativeInstance.preSync && xmbHome.active) { try { xmbNativeInstance.preSync(xmbNativeModel()); } catch (e) {} }
    xmbHome.listeners.slice().forEach(function (f) { try { f(); } catch (e) {} });
  }
  /* V39 "console mode" for D-pad steps: the native animation (and the sound) start immediately, React does NOT render in the key
   * handler. The rows (glow, description, the row window) are brought up to date once the cursor rests (XMB_RENDER_REST ms after the
   * last step), and at most every XMB_RENDER_MAXWAIT ms while the D-pad is held. The renderer keeps enough rows mounted around the
   * focus for the steps in between. Before: every step re-rendered the whole XMB in every Home copy (~50 ms of JS on the PS5) before
   * the next step could even be read. */
  var XMB_RENDER_REST = 180, XMB_RENDER_MAXWAIT = 800;   /* V41: the focused list is mounted whole, nothing needs a render while the D-pad is held */   /* V40: the rest render comes after the step motion (~175 ms) has finished */
  /* V61: a category step needs no render at all (the bar, the columns and every category's focused glow are native / already there);
   * its rest render comes only once the slide has settled, so a render never lands in the middle of a category move */
  var XMB_RENDER_REST_CAT = 650;
  function xmbMoveNotify(listLen, horizontal) {
    if (!xmbHome.active || !xmbNativeInstance || !xmbNativeInstance.preSync || globalThis.__ps5xmbHarness === true || typeof setTimeout !== 'function') { xmbNotify(); return; }
    try { xmbNativeInstance.preSync(xmbNativeModel()); } catch (e) { xmbNotify(); return; }
    var now = Date.now();
    if (!xmbHome.renderFirst) xmbHome.renderFirst = now;
    if (xmbHome.renderTimer) clearTimeout(xmbHome.renderTimer);
    /* V42: a list of up to 80 entries is mounted whole by the renderer: NO render at all while the D-pad is held (only once it rests) */
    var maxWait = horizontal || (listLen && listLen <= 80) ? 1e9 : XMB_RENDER_MAXWAIT;
    xmbHome.renderTimer = setTimeout(xmbFlushRender, Math.max(0, Math.min(horizontal ? XMB_RENDER_REST_CAT : XMB_RENDER_REST, xmbHome.renderFirst + maxWait - now)));
  }
  function xmbFlushRender() {
    if (xmbHome.renderTimer) { clearTimeout(xmbHome.renderTimer); xmbHome.renderTimer = null; }
    xmbHome.renderFirst = 0;
    xmbHome.listeners.slice().forEach(function (f) { try { f(); } catch (e) {} });
  }
  /* React Native's onLayout is our first proof that a visible text surface
   * exists. Until BOTH the test Text and its View report positive geometry,
   * the original Sony Home continues to render unobscured. A timeout does
   * NOT count as success. */
  function xmbTryActivate() {
    if (!xmbHome.visible || xmbHome.active || !xmbHome.mounted ||
        !xmbHome.viewLaidOut || !xmbHome.textLaidOut || xmbHome.fullProbe) return;
    xmbHome.fullProbe = true;
    xmbHome.stage = 'PROBE_TEXT_AND_VIEW_LAYOUT_OK';
    log('PS5XMB: ' + xmbHome.stage + '; drawing transparent XMB for verification');
    xmbHome.watchdog = setTimeout(function () {
      xmbHome.watchdog = null;
      if (!xmbHome.active) xmbDeactivate('FULL_XMB_LAYOUT_TIMEOUT');
    }, 6000);
    xmbNotify();
  }
  function xmbTryCommit() {
    if (!xmbHome.fullProbe || xmbHome.active || !xmbHome.mounted ||
        !xmbHome.fullViewLaidOut || !xmbHome.fullCatLaidOut ||
        !xmbHome.fullItemLaidOut || xmbHome.probeTimer) return;
    xmbHome.stage = 'FULL_XMB_TEXT_LAYOUT_OK';
    if (xmbHome.diagnosticOnly) {
      if (!xmbHome.diagnosticLogged) { xmbHome.diagnosticLogged = true; log('PS5XMB: FULL_LAYOUT_CONFIRMED_DIAGNOSTIC_ONLY'); }
      return;
    }
    log('PS5XMB: ' + xmbHome.stage + '; enabling XMB input');
    xmbHome.probeTimer = setTimeout(function () {
      xmbHome.probeTimer = null;
      if (!xmbHome.visible || !xmbHome.mounted ||
          !xmbHome.fullViewLaidOut || !xmbHome.fullCatLaidOut || !xmbHome.fullItemLaidOut) return;
      xmbHome.active = true;
      xmbHome.stage = 'XMB_OVERLAY_ACTIVATED';
      xmbIntroStart();   /* V57: only the first time in this Home session (ELF start, /quit, reboot) */
      xmbBgmRequest(true);
      xmbSfxPort(true);
      xmbUsersFetch(true);
      xmbSysFetch();          /* V60: real PS5 values for System Settings */
      xmbFoldersLoad();       /* V68: the Game category's folders */
      xmbColumnsLoad();       /* V73: the custom columns */
      xmbCatsLoad();          /* V78: names / icons of the XMB's own columns */
      xmbOrderLoad();         /* V74: the custom order */
      xmbRunningFetch();      /* V73: Close Application */
      xmbHintKick();          /* V69: the Triangle hint for the first title */
      try { xmbBackHandler(); } catch (e) { log('PS5XMB: BACK_HANDLER ' + e); }   /* V65 */
      xmbPhotosFetch(true);
      xmbVideosFetch(true);
      xmbPrefsLoad();
      /* V40: a game started / the Home went to the background: the title's music stops and the audio port is released */
      var AS = T.rn && T.rn.AppState;
      if (AS && !xmbHome.appStateHooked && typeof AS.addEventListener === 'function') {
        xmbHome.appStateHooked = true;
        try {
          AS.addEventListener('change', function (st) {
            xmbHome.appState = String(st);
            if (/background|inactive/i.test(String(st))) { xmbFocusEnd(); xmbSfxPort(false); log('PS5XMB: HOME_' + String(st).toUpperCase()); }
            else { if (xmbHome.active) xmbSfxPort(true); log('PS5XMB: HOME_' + String(st).toUpperCase()); xmbRunningFetch(); if (xmbSfxConsole()) { xmbHome.homeSentAt = Date.now(); try { console.log('THEME-XMBHOME'); } catch (e) {} } }
            xmbFocusFrameSync();   /* V66 */
          });
        } catch (e) {}
      }
      if (xmbHome.watchdog) { clearTimeout(xmbHome.watchdog); xmbHome.watchdog = null; }
      log('PS5XMB: ' + xmbHome.stage);
      xmbNotify();
    }, 0);  /* V83: layout already confirmed; no additional 400 ms input lock */
  }
  var xmbLayoutCounts = {};
  function xmbLayout(kind, ev) {
    var r = ev && ev.nativeEvent && ev.nativeEvent.layout;
    if (!xmbLayoutCounts[kind]) {
      xmbLayoutCounts[kind] = true;
      log('PS5XMB: NATIVE_ONLAYOUT kind=' + kind +
          ' width=' + (r && r.width) + ' height=' + (r && r.height));
    }
    if (!r || !(Number(r.width) > 0) || !(Number(r.height) > 0)) return;
    if (kind === 'view') xmbHome.viewLaidOut = true;
    if (kind === 'text') xmbHome.textLaidOut = true;
    if (kind === 'full-view') xmbHome.fullViewLaidOut = true;
    if (kind === 'full-cat') xmbHome.fullCatLaidOut = true;
    if (kind === 'full-item') xmbHome.fullItemLaidOut = true;
    xmbTryActivate();
    xmbTryCommit();
  }
  /* Do NOT mute whole console AudioOut: the user's PCM scroll effects must
   * continue. Hook only Sony's Home background-music request. The XMB5
   * upstream Sounds hook is disabled, so our wrapper owns this isolated path.
   * Firmware may ignore null: record evidence instead of claiming success. */
  /* V66 diagnostics: what the Home / hub tell their scene about input (setInputBehavior, setFocusable): logged, nothing changed */
  function xmbSceneSpy(sc) {
    ['setInputBehavior', 'setFocusable'].forEach(function (fn) {
      var f = sc && sc[fn];
      if (typeof f !== 'function' || f.__xmbSpy) return;
      var n = 0;
      var w = function () {
        if (++n <= 8) { var a = ''; try { a = JSON.stringify(Array.prototype.slice.call(arguments)).slice(0, 200); } catch (e) { a = '?'; } log('PS5XMB: SCENE_' + APP + ' ' + fn + ' ' + a); }
        return f.apply(this, arguments);
      };
      w.__xmbSpy = true;
      try { sc[fn] = w; } catch (e) {}
    });
  }
  function xmbBgmHook(sc) {
    if (APP === 'hub' && sc && typeof sc.setSystemBgm === 'function' && !sc.setSystemBgm.__xmbHub) {
      /* V41 diagnostics: what the game hub asks the music player for (logged only, nothing changed) */
      var hubOriginal = sc.setSystemBgm, hubLogs = 0;
      var hubWrap = function (bgm) {
        try { if (hubLogs++ < 24) log('PS5XMB: HUB_BGM ' + JSON.stringify(bgm === undefined ? 'undefined' : bgm).slice(0, 220)); } catch (e) {}
        return hubOriginal.apply(this, arguments);
      };
      hubWrap.__xmbHub = true;
      try { sc.setSystemBgm = hubWrap; } catch (e) {}
      return;
    }
    if (!xmbHome.visible || !sc || typeof sc.setSystemBgm!=='function') return;
    if (sc.setSystemBgm.__xmbMute) return;
    var original=sc.setSystemBgm;
    var wrapper=function(bgm) {
      /* V39: learn exactly what the stock Home asks for (it keeps focusing its own tiles behind the XMB): logged, and kept per title so the
       * XMB can replay the very same request for that title */
      try {
        if ((xmbHome.stockBgmLogs = (xmbHome.stockBgmLogs || 0) + 1) <= 24) log('PS5XMB: STOCK_BGM ' + JSON.stringify(bgm === undefined ? 'undefined' : bgm).slice(0, 220));
        if (bgm && typeof bgm === 'object') {
          var sid = String(bgm.src || bgm.uri || bgm.path || '').match(/[A-Z]{4}\d{5}/);
          if (sid) { xmbHome.stockBgm = xmbHome.stockBgm || {}; xmbHome.stockBgm[sid[0]] = bgm; xmbHome.stockBgmShape = bgm; }
        }
      } catch (e) {}
      if (xmbHome.visible) { /* V83: suppress Sony tile BGM during coldboot too */
        if (xmbHome.fbPlaying) return undefined;     /* the stock Home's own (null) request must not stop the title's music we started */
        if (!xmbHome.bgmCalls) xmbHome.bgmCalls=0;
        if (++xmbHome.bgmCalls<=5)log('PS5XMB: BGM_REQUEST_SUPPRESSED');
        return original.call(this,null);
      }
      xmbHome.bgmLast=bgm;
      return original.apply(this,arguments);
    };
    wrapper.__xmbMute=true;
    try {sc.setSystemBgm=wrapper;}catch(e){}
    if (sc.setSystemBgm===wrapper) {
      xmbHome.bgmScene=sc; xmbHome.bgmOriginal=original;
      log('PS5XMB: BGM_NULL_HOOK_INSTALLED');
    } else log('PS5XMB: BGM_HOOK_NOT_REPLACEABLE');
  }
  function xmbBgmRequest(silent) {
    var sc=xmbHome.bgmScene;
    if (!sc || typeof sc.setSystemBgm!=='function') {
      if (silent) log('PS5XMB: BGM_CONTROL_UNAVAILABLE');
      return;
    }
    try {sc.setSystemBgm(silent?null:(xmbHome.bgmLast||null));
      log(silent?'PS5XMB: BGM_STOP_REQUESTED':'PS5XMB: BGM_STOCK_RESTORED');
    }catch(e){log('PS5XMB: BGM_CONTROL_ERROR '+String(e));}
  }
  /* No full-screen fallback layer. A native render error restores stock Home. */
  function xmbDeactivate(why) {
    xmbHome.active = false; xmbHome.visible = false;
    xmbFocusFrameSync();   /* V64: the stock Home gets its focus frame back */
    xmbHome.fbPlaying = false;
    if (xmbHome.fbNative) xmbMusicStop();
    xmbSfxPort(false);
    xmbBgmRequest(false);
    if (xmbHome.previousMediaSettings) {
      THEME.wallpaperOn=xmbHome.previousMediaSettings.wallpaperOn;
      THEME.tileAnimOn=xmbHome.previousMediaSettings.tileAnimOn;
      THEME.homeMusicOn=xmbHome.previousMediaSettings.homeMusicOn;
    }
    if (xmbHome.sfxTimer) {clearTimeout(xmbHome.sfxTimer);xmbHome.sfxTimer=null;}
    xmbHome.stage = 'DISABLED_' + String(why || 'ERROR');
    if (xmbHome.probeTimer) { clearTimeout(xmbHome.probeTimer); xmbHome.probeTimer = null; }
    if (xmbHome.watchdog) { clearTimeout(xmbHome.watchdog); xmbHome.watchdog = null; }
    log('PS5XMB: ' + xmbHome.stage + '; Sony Home remains available');
    xmbNotify();
  }
  var XmbErrorBoundary = null;
  function xmbBoundary(React) {
    if (XmbErrorBoundary || !React || !React.Component) return XmbErrorBoundary;
    XmbErrorBoundary = class XmbHomeErrorBoundary extends React.Component {
      constructor(props) { super(props); this.state = { failed: false }; }
      static getDerivedStateFromError() { return { failed: true }; }
      componentDidCatch(error) {
        xmbDeactivate('REACT_RENDER');
        log('PS5XMB: React boundary caught ' + String(error));
      }
      render() { return this.state.failed ? null : this.props.children; }
    };
    return XmbErrorBoundary;
  }
  /* V63: the PS3 Triangle panel belongs to the Game category only: "Sort By" (its own group at the top; the sorts open to its right),
   * then the title's own options. No "Close" entry (Triangle / Circle close it, as on the PS3). */
  var XMB_GAME_SORTS = [['Creation Date','date'],['Format','format'],['A to Z','az'],['Z to A','za'],['Custom','custom']];   /* V74: Custom = your own order (Triangle > Move) */
  /* V68: also inside one of the XMB's game folders */
  function xmbFolderFrame() { var st = xmbHome.webStack; return st.length === 1 && st[0].fid ? st[0] : null; }
  /* V73: the Game category, a game folder, or one of the custom columns */
  function xmbColumnOfCat(c) { var cat = XMB_WEB_NATIVE_CATEGORIES[c]; return cat && cat.colId ? xmbColumnById(cat.colId) : null; }
  function xmbOptionsAllowed() {
    if (xmbHome.category === XMB_GAME_CAT) return !xmbHome.webStack.length || !!xmbFolderFrame();
    return !xmbHome.webStack.length;   /* V78: every column (Rename Column / Column Icon) */
  }
  /* V68 / V73: the panel's entries: act = what X does; ch = opens a list to its right; head = the top group (PS3: Sort By)
   *   Game category, a game:   Sort By >, New Folder, New Column | Start, Close Application, Add to Folder >, Move to Column >, Information
   *   a folder:                Sort By >, New Folder, New Column | Rename, Delete Folder, Information
   *   a game in a folder:      Sort By > | Start, Close Application, Move to Folder >, Move to Column >, Remove from Folder, Information
   *   a custom column:         Sort By >, Rename Column, Column Icon >, Delete Column | Start, Close Application, Move to Column >,
   *                            Remove from Column, Information
   * (Close Application only on the title that is running; Move to Column only once a column exists) */
  function xmbOptionItems() {
    var item = xmbSelected(), inFolder = !!xmbFolderFrame(), col = xmbColumnOfCat(xmbHome.category), out = [{n:'Sort By', ch:true, head:true, act:'sort'}];
    /* V78: one of the XMB's own columns (not Game): only its name and icon (it cannot be deleted or moved) */
    var nCats = XMB_WEB_NATIVE_CATEGORIES.length, cat0 = xmbHome.category;
    if (!col && xmbHome.category !== XMB_GAME_CAT) {   /* V79: + Move Column Left / Right */
      var bo = [{n:'Rename Column', act:'renamecol'}, {n:'Column Icon', ch:true, act:'colicon'}];
      if (cat0 > 0) bo.push({n:'Move Column Left', act:'colleft'});
      if (cat0 < nCats - 1) bo.push({n:'Move Column Right', act:'colright'});
      return bo;
    }
    var hasCols = (xmbHome.columns || []).length > 0;
    /* V76: the column options are a group of their own (grp), between the top group and the title's options */
    if (col) {
      out.push({n:'Rename Column', grp:true, act:'renamecol'});
      out.push({n:'Column Icon', ch:true, grp:true, act:'colicon'});
      /* V74: the column's place in the bar */
      if (cat0 > 0) out.push({n:'Move Column Left', grp:true, act:'colleft'});
      if (cat0 < XMB_WEB_NATIVE_CATEGORIES.length - 1) out.push({n:'Move Column Right', grp:true, act:'colright'});
      out.push({n:'Delete Column', grp:true, act:'delcol'});
    } else if (!inFolder) {
      out.push({n:'New Folder', head:true, act:'newfolder'});
      out.push({n:'Rename Column', grp:true, act:'renamecol'});   /* V78: Game's own name / icon */
      out.push({n:'Column Icon', ch:true, grp:true, act:'colicon'});
      if (cat0 > 0) out.push({n:'Move Column Left', grp:true, act:'colleft'});   /* V79: Game moves too */
      if (cat0 < nCats - 1) out.push({n:'Move Column Right', grp:true, act:'colright'});
      out.push({n:'New Column', grp:true, act:'newcol'});
    }
    if (item && item.kind === 'game') {
      if (xmbRoute(item)) out.push({n:'Start', act:'start'});
      if (xmbHome.running && xmbHome.running.id && item.id && xmbHome.running.id.indexOf(item.id) === 0) out.push({n:'Close Application', act:'closeapp'});
      if (!col) out.push({n:inFolder ? 'Move to Folder' : 'Add to Folder', ch:true, act:'addfolder'});
      if (hasCols || col) out.push({n:'Move to Column', ch:true, act:'tocolumn'});   /* V74: in a column it lists "Game" too */
      if (inFolder) out.push({n:'Remove from Folder', act:'remove'});
      out.push({n:'Move App', act:'move'});   /* V74: your own order (Sort By > Custom) */
      out.push({n:'Information', act:'info'});
    } else if (item && item.kind === 'xmb-folder') {
      out.push({n:'Rename', act:'rename'});
      out.push({n:'Folder Icon', ch:true, act:'foldericon'});   /* V74 */
      out.push({n:'Move Folder', act:'move'});
      out.push({n:'Delete Folder', act:'delfolder'});
      out.push({n:'Information', act:'info'});
    }
    return out;
  }
  function xmbOptSubKind(o) { return !o ? 'sort' : o.act === 'addfolder' ? 'folders' : o.act === 'tocolumn' ? 'columns' : o.act === 'colicon' ? 'icons' : o.act === 'foldericon' ? 'ficons' : 'sort'; }
  function xmbOptionLabels() { return xmbOptionItems().map(function (o) { return o.n; }); }
  function xmbOptionsFirst() {   /* the cursor opens on the title's first option (PS3), Sort By when there is none */
    var it = xmbOptionItems();
    for (var k = 0; k < it.length; k++) if (!it[k].head && !it[k].grp) return k;
    return 0;
  }
  function xmbSortIndex() {
    var cs = xmbCurSort();
    for (var k = 0; k < XMB_GAME_SORTS.length; k++) if (XMB_GAME_SORTS[k][1] === cs) return k;
    return 2;
  }
  function xmbSortItems() {   /* the active sort carries the PS3's down-arrow mark */
    var cs = xmbCurSort();   /* V76: the sort of THIS list (each column has its own) */
    return XMB_GAME_SORTS.map(function (srt) { return {n:srt[0], mark:srt[1] === cs}; });
  }
  /* V68: the list to the right of "Add to Folder": the folders (not the one the game is in) and "New Folder" */
  function xmbFolderTargets() {
    var cur = xmbFolderFrame(), F = xmbHome.folders || [];
    return F.filter(function (f) { return !cur || f.id !== cur.fid; });
  }
  /* V73: the columns a game can move to (not the one it is in), and the icons a column can take */
  function xmbColumnTargets() {
    var cur = xmbColumnOfCat(xmbHome.category);
    return (xmbHome.columns || []).filter(function (c) { return !cur || c.id !== cur.id; });
  }
  var XMB_COLUMN_ICONS = [['Controller','xmbweb_xmb_icon_005'],['PlayStation','xmbweb_xmb_icon_psn'],['Game Folder','xmbweb_xmb_icon_063'],
    ['Folder','xmbweb_xmb_icon_062'],['Memory Card','xmbweb_xmb_icon_064'],['PSP','xmbweb_xmb_icon_036'],['Media','xmbweb_xmb_icon_046'],
    ['Settings','xmbweb_xmb_icon_001'],['Video','xmbweb_xmb_icon_004'],['Music','xmbweb_xmb_icon_003'],['Photo','xmbweb_xmb_icon_002'],['Network','xmbweb_xmb_icon_006'],
    ['Friends','xmbweb_xmb_icon_007'],['Trophy','xmbweb_xmb_icon_039'],['Store','xmbweb_playstation_store'],['Tools','xmbweb_xmb_icon_022'],
    ['Search','xmbweb_xmb_icon_055'],['Home','xmbweb_xmb_icon_000']];
  var XMB_BUNDLED_PS3_ICONS = ["xmbweb_xmb_icon_000","xmbweb_xmb_icon_001","xmbweb_xmb_icon_002","xmbweb_xmb_icon_003","xmbweb_xmb_icon_004","xmbweb_xmb_icon_005","xmbweb_xmb_icon_006","xmbweb_xmb_icon_007","xmbweb_xmb_icon_008","xmbweb_xmb_icon_009","xmbweb_xmb_icon_010","xmbweb_xmb_icon_012","xmbweb_xmb_icon_014","xmbweb_xmb_icon_015","xmbweb_xmb_icon_016","xmbweb_xmb_icon_017","xmbweb_xmb_icon_018","xmbweb_xmb_icon_020","xmbweb_xmb_icon_022","xmbweb_xmb_icon_023","xmbweb_xmb_icon_029","xmbweb_xmb_icon_030","xmbweb_xmb_icon_035","xmbweb_xmb_icon_036","xmbweb_xmb_icon_037","xmbweb_xmb_icon_039","xmbweb_xmb_icon_040","xmbweb_xmb_icon_041","xmbweb_xmb_icon_042","xmbweb_xmb_icon_046","xmbweb_xmb_icon_054","xmbweb_xmb_icon_055","xmbweb_xmb_icon_056","xmbweb_xmb_icon_062","xmbweb_xmb_icon_063","xmbweb_xmb_icon_064","xmbweb_xmb_icon_066","xmbweb_xmb_icon_067"];
  function xmbIconChoices() {   /* every bundled PS3 icon, plus user PNGs */
    var used = {}, out = [{n:'PS3 Folder', icon:'xmbweb_folder_ps3'}];
    used.xmbweb_folder_ps3 = true;
    XMB_COLUMN_ICONS.forEach(function(k){ if (!used[k[1]]) { out.push({n:k[0],icon:k[1]}); used[k[1]]=true; } });
    XMB_BUNDLED_PS3_ICONS.forEach(function(icon){ if (!used[icon]) {
      out.push({n:'PS3 Icon '+icon.slice(-3),icon:icon}); used[icon]=true;
    } });
    return out.concat((xmbHome.customIcons || []).map(function(f) {
      return {n:f.replace(/\\.png$/i, ''),icon:'file://' + ZT + 'xmbicons/' + f};
    }));
  }
  /* V74: Move to Column lists "Game" first when the title is in a column (back to the Game category) */
  function xmbColumnMenu() {
    var out = xmbColumnOfCat(xmbHome.category) ? [{n:'Game', game:true}] : [];
    return out.concat(xmbColumnTargets().map(function (c) { return {n:c.name, col:c}; })).concat([{n:'New Column', make:true}]);
  }
  function xmbIconOwner() {   /* whose icon the Icon list changes: the column, or the focused folder */
    var cc = xmbColumnOfCat(xmbHome.category), it = xmbSelected();
    if (xmbHome.optionsSub && xmbHome.optionsSub.kind === 'ficons') return it && it.kind === 'xmb-folder' ? {folder:xmbFolderById(it.fid)} : null;
    if (cc) return {column:cc};
    var tg = xmbCatTarget(xmbHome.category);   /* V78: one of the XMB's own columns */
    return tg && !tg.custom ? {base:tg.cat, icon:tg.icon} : null;
  }
  function xmbSubItems(sub) {
    if (sub && sub.kind === 'columns') return xmbColumnMenu().map(function (c) { return {n:c.n}; });
    if (sub && (sub.kind === 'icons' || sub.kind === 'ficons')) {
      var ow = xmbIconOwner(), cur = ow && ow.column ? ow.column.icon : ow && ow.base ? ow.icon : ow && ow.folder ? (ow.folder.icon || 'xmbweb_folder_ps3') : '';
      return xmbIconChoices().map(function (k) { return {n:k.n, mark:cur === k.icon}; });
    }
    /* V69: no folders made yet: the list stays empty (New Folder is in the top group) */
    if (sub && sub.kind === 'folders') return (xmbHome.folders || []).length ? xmbFolderTargets().map(function (f) { return {n:f.name}; }).concat([{n:'New Folder'}]) : [];
    return xmbSortItems();
  }
  function xmbOptionsSubOpen(kind) {
    var at = kind === 'sort' || !kind ? xmbSortIndex() : 0;
    if (kind === 'icons' || kind === 'ficons') {   /* opens on the column's / folder's own icon */
      xmbHome.optionsSub = {kind:kind, cursor:0, at:0};
      var ow = xmbIconOwner(), cur = ow && ow.column ? ow.column.icon : ow && ow.base ? ow.icon : ow && ow.folder ? (ow.folder.icon || 'xmbweb_folder_ps3') : '', ch = xmbIconChoices();
      for (var k = 0; k < ch.length; k++) if (ch[k].icon === cur) at = k;
      xmbIconsFetch();
    }
    xmbHome.optionsSub = {kind:kind || 'sort', cursor:at, at:at};
    xmbPlaySfx('decide');
    xmbNotify();
  }
  /* the Game list's order: Creation Date (installed, newest first), Format (PS5 games, PS4 games, then apps; A to Z in each), A to Z, Z to A */
  function xmbGameFormat(g) {
    var meta = T.allGames && T.allGames[g.id];
    if (meta && meta.space === 'media') return 2;
    return /^PPSA/.test(g.id) ? 0 : /^CUSA/.test(g.id) ? 1 : 2;
  }
  /* V76: each list keeps its own sort: the Game category (and its folders) and every custom column */
  function xmbSortOf(catIdx) {
    var cat = XMB_WEB_NATIVE_CATEGORIES[catIdx], c = cat && cat.colId ? xmbColumnById(cat.colId) : null;
    return c ? (c.sort || 'az') : (xmbHome.gameSort || 'az');
  }
  function xmbCurSort() { return xmbSortOf(xmbHome.category); }
  function xmbGamesSort(list, mode) {
    var m = mode || xmbHome.gameSort || 'az', D = xmbHome.appDates || {};
    var az = function (a, b) { return a.name.localeCompare(b.name); };
    var O = m === 'custom' ? xmbOrderIndex() : null;
    list.sort(m === 'za' ? function (a, b) { return b.name.localeCompare(a.name); }
      : m === 'custom' ? function (a, b) { return xmbOrderCmp(O, a.id, b.id) || az(a, b); }
      : m === 'date' ? function (a, b) { return ((D[b.id] || 0) - (D[a.id] || 0)) || az(a, b); }
      : m === 'format' ? function (a, b) { return (xmbGameFormat(a) - xmbGameFormat(b)) || az(a, b); } : az);
  }
  /* re-sort, keeping the focus on the same title */
  function xmbGamesResort() {
    var c0 = xmbGameItemsCache || {}, cur = c0.items && c0.items[xmbHome.cursor[XMB_GAME_CAT] || 0], key = cur && (cur.fid || cur.id);
    xmbGamesCache = {row:null, all:null, at:0, items:null};
    xmbGameItemsCache = {};
    var list = xmbGameItems();
    for (var k = 0; key && k < list.length; k++) if ((list[k].fid || list[k].id) === key) { xmbHome.cursor[XMB_GAME_CAT] = k; break; }
    xmbFolderFrameRefresh();
  }
  /* ---- V68: the XMB's own game folders (Game category). Kept on the console (ZT_DIR/PS5XMB_folders.json through /xmb-folders):
   * [{id, name, ids:[title ids], t}]. A folder shows first in the list (PS3 folder icon, "N items"), X opens its games as a submenu,
   * and a game in a folder is no longer in the list itself. Triangle: New Folder, Add to Folder > (a folder / New Folder), Rename,
   * Delete Folder (its games go back to the list), Remove from Folder. Names are typed on the PS5 keyboard (XMB5's native text
   * field: "THEME-RENAME XMBF..|name", the answer comes back as data "zt-rename"). */
  var xmbGameItemsCache = {};
  function xmbGameItems() {
    var games = xmbGames(), F = xmbHome.folders || [];
    if (xmbGameItemsCache.games === games && xmbGameItemsCache.ver === xmbHome.foldersVer && xmbGameItemsCache.cver === xmbHome.columnsVer && xmbGameItemsCache.items) return xmbGameItemsCache.items;
    var inF = {}, m = xmbHome.gameSort || 'az', inC = xmbInColumns();
    F.forEach(function (f) { f.ids.forEach(function (id) { inF[id] = f.id; }); });
    var items = F.map(function (f) {
      var kids = games.filter(function (g) { return g.kind === 'game' && f.ids.indexOf(g.id) >= 0 && !inC[g.id]; });
      return {kind:'xmb-folder', fid:f.id, name:f.name, t:f.t || 0, iconAsset:f.icon || 'xmbweb_folder_ps3', ns:true,   /* V74: its own icon */   /* V71: "N items" only when focused */
        subtitle:kids.length ? kids.length + (kids.length === 1 ? ' item' : ' items') : 'Empty', children:kids.length ? kids : undefined};
    });
    items.sort(m === 'za' ? function (a, b) { return b.name.localeCompare(a.name); }
      : m === 'date' ? function (a, b) { return (b.t - a.t) || a.name.localeCompare(b.name); } : function (a, b) { return a.name.localeCompare(b.name); });
    var rest = games.filter(function (g) { return !inF[g.id] && !inC[g.id]; });
    if (!rest.length && !items.length) rest = games;
    var out = items.concat(rest);
    if (m === 'custom') {   /* V74: folders and games in your own order */
      var O = xmbOrderIndex();
      out = out.map(function (it, k) { return {it:it, k:k}; }).sort(function (a, b) { return xmbOrderCmp(O, xmbOrderKey(a.it), xmbOrderKey(b.it)) || (a.k - b.k); }).map(function (x) { return x.it; });
    }
    xmbGameItemsCache = {games:games, ver:xmbHome.foldersVer, cver:xmbHome.columnsVer, items:out};
    return out;
  }
  /* an open folder's submenu follows its folder (a game removed / moved, the folder deleted or emptied: back to the list) */
  function xmbFolderFrameRefresh() {
    var fr = xmbFolderFrame();
    if (!fr) return;
    var list = xmbGameItems(), f = null;
    for (var k = 0; k < list.length; k++) if (list[k].fid === fr.fid) { f = list[k]; xmbHome.cursor[XMB_GAME_CAT] = k; break; }
    if (!f || !f.children || !f.children.length) { xmbHome.webStack = []; return; }
    var curId = fr.entries[fr.cursor] && fr.entries[fr.cursor].id;
    fr.entries = f.children; fr.name = f.name;
    var at = -1;
    for (var j = 0; j < f.children.length; j++) if (f.children[j].id === curId) at = j;
    fr.cursor = at >= 0 ? at : Math.min(fr.cursor, f.children.length - 1);
  }
  function xmbFoldersChanged(save) {
    xmbHome.foldersVer = (xmbHome.foldersVer || 0) + 1;
    if (save) xmbFoldersSave();
    xmbGamesResort();   /* the focus stays on the same folder / game; when that one left the list, on the row that took its place */
    var n = xmbGameItems().length;
    xmbHome.cursor[XMB_GAME_CAT] = Math.max(0, Math.min(n - 1, xmbHome.cursor[XMB_GAME_CAT] || 0));
  }
  function xmbFoldersValid(list) {
    if (!Array.isArray(list)) return [];
    return list.filter(function (f) { return f && typeof f.id === 'string' && typeof f.name === 'string' && Array.isArray(f.ids); }).map(function (f) {
      return {id:f.id.slice(0, 24), name:f.name.slice(0, 40), ids:f.ids.filter(function (id) { return typeof id === 'string' && /^[A-Z]{4}\d{5}$/.test(id); }), t:Number(f.t) || 0,
        icon:typeof f.icon === 'string' && xmbIconOk(f.icon) ? f.icon : ''};
    });
  }
  function xmbFoldersLoad() {
    if (xmbHome.foldersAsked || typeof globalThis.fetch !== 'function') return;
    xmbHome.foldersAsked = true;
    try {
      globalThis.fetch('http://127.0.0.1:4444/xmb-folders', {method:'GET'})
        .then(function (r) { return r && r.ok ? r.text() : ''; })
        .then(function (t) {
          var j = null; try { j = t ? JSON.parse(t) : null; } catch (e) { j = null; }
          if (!Array.isArray(j)) { xmbHome.foldersAsked = false; return; }
          xmbHome.folders = xmbFoldersValid(j);
          log('PS5XMB: FOLDERS ' + xmbHome.folders.length);
          xmbFoldersChanged(false);
          xmbNotify();
        })
        .catch(function () { xmbHome.foldersAsked = false; });
    } catch (e) { xmbHome.foldersAsked = false; }
  }
  function xmbFoldersSave() {
    if (typeof globalThis.fetch !== 'function') return;
    var body = JSON.stringify(xmbHome.folders || []);
    try {
      globalThis.fetch('http://127.0.0.1:4444/xmb-folders', {method:'POST', body:body})
        .then(function (r) { log('PS5XMB: FOLDERS_SAVED ' + (r && r.ok ? 'ok' : 'FAILED ' + (r && r.status))); })
        .catch(function (e) { log('PS5XMB: FOLDERS_SAVED FAILED ' + e); });
    } catch (e) {}
  }
  function xmbFolderById(fid) { var F = xmbHome.folders || []; for (var k = 0; k < F.length; k++) if (F[k].id === fid) return F[k]; return null; }
  function xmbFolderAdd(gameId, fid) {
    var f = xmbFolderById(fid);
    if (!f || !/^[A-Z]{4}\d{5}$/.test(gameId || '')) return;
    (xmbHome.folders || []).forEach(function (o) { o.ids = o.ids.filter(function (x) { return x !== gameId; }); });
    if (xmbColumnTake(gameId)) xmbColumnsChanged(true);   /* V73: a game is in one place only */
    f.ids.push(gameId);
    log('PS5XMB: FOLDER_ADD ' + gameId + ' -> ' + f.name);
    xmbFoldersChanged(true);
  }
  function xmbFolderRemove(gameId) {
    (xmbHome.folders || []).forEach(function (o) { o.ids = o.ids.filter(function (x) { return x !== gameId; }); });
    log('PS5XMB: FOLDER_REMOVE ' + gameId);
    xmbFoldersChanged(true);
  }
  function xmbFolderCreate(name, gameId) {
    xmbHome.folders = xmbHome.folders || [];
    /* a unique id even for two folders made in the same millisecond (the V68 test on a fast PC got the same id twice) */
    var fid = 'f' + Date.now().toString(36), k0 = 0;
    while (xmbFolderById(fid + (k0 ? '_' + k0 : ''))) k0++;
    var f = {id:fid + (k0 ? '_' + k0 : ''), name:name, ids:[], t:Date.now()};
    xmbHome.folders.push(f);
    log('PS5XMB: FOLDER_NEW ' + name);
    if (gameId && /^[A-Z]{4}\d{5}$/.test(gameId)) xmbFolderAdd(gameId, f.id);
    else xmbFoldersChanged(true);
    /* the focus goes to the new folder (only from the list itself) */
    if (!xmbHome.webStack.length) { var list = xmbGameItems(); for (var k = 0; k < list.length; k++) if (list[k].fid === f.id) xmbHome.cursor[XMB_GAME_CAT] = k; }
  }
  function xmbFolderRename(fid, name) {
    var f = xmbFolderById(fid);
    if (!f) return;
    f.name = name;
    log('PS5XMB: FOLDER_RENAME ' + fid + ' ' + name);
    xmbFoldersChanged(true);
  }
  function xmbFolderDelete(fid) {
    xmbHome.folders = (xmbHome.folders || []).filter(function (f) { return f.id !== fid; });
    log('PS5XMB: FOLDER_DELETE ' + fid);
    xmbFoldersChanged(true);
  }
  /* ---- V73: custom columns. The user's own categories to the right of Game (a "Homebrew" column, "Emulators", "PS4" ...), each with
   * its name and an icon (the XMB's own icons, or a PNG uploaded to XMB5/xmbicons with UPLOAD_XMB_ICONS.bat). A game or app is in
   * one place: the Game list (or one of its folders) or one column. Kept on the console: ZT_DIR/PS5XMB_columns.json (/xmb-columns):
   * [{id, name, icon, ids:[title ids], t}]. Triangle: New Column (Game category), Move to Column >, Remove from Column, and in a column
   * Rename Column, Column Icon >, Delete Column (its games go back to Game). */
  var XMB_BASE_CATS = null;
  function xmbIconOk(icon) { return /^(xmbweb_[a-z0-9_]+|file:\/\/\/[A-Za-z0-9_.\/ -]+\.png)$/i.test(icon); }
  function xmbColumnById(id) { var C = xmbHome.columns || []; for (var k = 0; k < C.length; k++) if (C[k].id === id) return C[k]; return null; }
  function xmbInColumns() {
    if (xmbHome.inColVer === xmbHome.columnsVer && xmbHome.inCol) return xmbHome.inCol;
    var m = {};
    (xmbHome.columns || []).forEach(function (c) { c.ids.forEach(function (id) { m[id] = c.id; }); });
    xmbHome.inCol = m; xmbHome.inColVer = xmbHome.columnsVer;
    return m;
  }
  var xmbColumnItemsCache = {};
  function xmbColumnItems(colId) {
    var games = xmbGames(), c = xmbColumnById(colId), key = colId + '|' + xmbHome.columnsVer + '|' + xmbHome.orderVer + '|' + (c && c.sort);
    var hit = xmbColumnItemsCache[key];
    if (hit && hit.games === games) return hit.items;
    var items = c ? games.filter(function (g) { return g.kind === 'game' && c.ids.indexOf(g.id) >= 0; }) : [];
    if (c && (c.sort || 'az') !== (xmbHome.gameSort || 'az')) xmbGamesSort(items, c.sort || 'az');   /* V76: the column's own sort */
    if (!items.length) items = [{name:'No games yet', kind:'none', iconAsset:'xmbweb_xmb_icon_062', subtitle:'Triangle on a game in Game > Move to Column', ns:true}];
    xmbColumnItemsCache[key] = {games:games, items:items};
    return items;
  }
  /* the category list = the XMB's own categories, then the columns (the renderer makes a new bar when it changes) */
  function xmbColumnsApply() {
    if (!XMB_BASE_CATS) XMB_BASE_CATS = XMB_WEB_NATIVE_CATEGORIES.filter(function (c) { return !c.colId; });
    var oldIds = XMB_WEB_NATIVE_CATEGORIES.map(function (c) { return c.id; }), curId = oldIds[xmbHome.category], cur = {};
    oldIds.forEach(function (id, k) { cur[id] = xmbHome.cursor[k] || 0; });
    /* V74: each column has its place in the bar (pos = its index; -1 = at the end) */
    /* V78: the XMB's own columns can have their own name / icon (Triangle > Rename Column / Column Icon) */
    var ov = xmbHome.catOv || {};
    var bar = XMB_BASE_CATS.map(function (c) {
      var o = ov[c.id];
      return o && (o.name || o.icon) ? Object.assign({}, c, {name:o.name || c.name, asset:o.icon || c.asset}) : c;
    });
    (xmbHome.columns || []).map(function (c, k) { return {c:c, k:k}; })
      .sort(function (a, b) { var pa = a.c.pos >= 0 ? a.c.pos : 1e6 + a.k, pb = b.c.pos >= 0 ? b.c.pos : 1e6 + b.k; return pa - pb; })
      .forEach(function (x) {
        var c = x.c, cat = {id:'col_' + c.id, name:c.name, asset:c.icon || 'xmbweb_xmb_icon_005', entries:[], colId:c.id};
        bar.splice(c.pos >= 0 ? Math.min(c.pos, bar.length) : bar.length, 0, cat);
      });
    /* V79: every column can be moved: the whole bar's order (ids) when one was saved; a column it does not know keeps its own place */
    var bo = xmbHome.barOrder;
    if (Array.isArray(bo) && bo.length) {
      var byId = {}, placed = {}, ordered = [];
      bar.forEach(function (c) { byId[c.id] = c; });
      bo.forEach(function (id) { if (byId[id] && !placed[id]) { ordered.push(byId[id]); placed[id] = true; } });
      bar.forEach(function (c, k) { if (!placed[c.id]) ordered.splice(Math.min(k, ordered.length), 0, c); });
      bar = ordered;
    }
    XMB_WEB_NATIVE_CATEGORIES = bar;
    XMB_GAME_CAT = bar.map(function (c) { return c.id; }).indexOf('game');
    xmbHome.cats = XMB_WEB_NATIVE_CATEGORIES.map(function (c) { return {id:c.id, name:c.name, asset:c.asset}; });
    xmbHome.cursor = XMB_WEB_NATIVE_CATEGORIES.map(function (c) { return cur[c.id] || 0; });
    var at = XMB_WEB_NATIVE_CATEGORIES.map(function (c) { return c.id; }).indexOf(curId);
    if (at < 0) { at = XMB_GAME_CAT; xmbHome.webStack = []; xmbHome.optionsOpen = false; xmbHome.optionsSub = null; }
    xmbHome.category = at;
    xmbNativeCats = null;
    xmbColumnItemsCache = {};
    for (var k = 0; k < XMB_WEB_NATIVE_CATEGORIES.length; k++) {   /* every cursor inside its list */
      var n = xmbCategoryItems(k).length;
      xmbHome.cursor[k] = Math.max(0, Math.min(n - 1, xmbHome.cursor[k] || 0));
    }
  }
  function xmbColumnsChanged(save) {
    xmbHome.columnsVer = (xmbHome.columnsVer || 0) + 1;
    xmbColumnItemsCache = {};
    if (save) xmbColumnsSave();
    xmbFoldersChanged(false);   /* the Game list / its folders (games came or went), the focus kept */
    xmbColumnsApply();
  }
  function xmbColumnsValid(list) {
    if (!Array.isArray(list)) return [];
    return list.filter(function (c) { return c && typeof c.id === 'string' && typeof c.name === 'string' && Array.isArray(c.ids); }).slice(0, 12).map(function (c) {
      var icon = typeof c.icon === 'string' && xmbIconOk(c.icon) ? c.icon : 'xmbweb_xmb_icon_005';
      return {id:c.id.slice(0, 24), name:c.name.slice(0, 40), icon:icon, ids:c.ids.filter(function (id) { return typeof id === 'string' && /^[A-Z]{4}\d{5}$/.test(id); }), t:Number(c.t) || 0,
        pos:typeof c.pos === 'number' && c.pos >= 0 ? Math.floor(c.pos) : -1, sort:/^(date|format|az|za|custom)$/.test(c.sort || '') ? c.sort : 'az'};
    });
  }
  /* V78: the names / icons given to the XMB's own columns: [{id:'photo', name:'..', icon:'..'}] in ZT_DIR/PS5XMB_cats.json (/xmb-cats) */
  function xmbCatsLoad() {
    if (xmbHome.catsAsked || typeof globalThis.fetch !== 'function') return;
    xmbHome.catsAsked = true;
    try {
      globalThis.fetch('http://127.0.0.1:4444/xmb-cats', {method:'GET'})
        .then(function (r) { return r && r.ok ? r.text() : ''; })
        .then(function (t) {
          var j = null; try { j = t ? JSON.parse(t) : null; } catch (e) { j = null; }
          if (!Array.isArray(j)) { xmbHome.catsAsked = false; return; }
          var ov = {};
          j.forEach(function (o) {
            if (o && o.id === '_bar' && Array.isArray(o.ids)) { xmbHome.barOrder = o.ids.filter(function (v) { return typeof v === 'string' && /^[A-Za-z0-9_]{1,40}$/.test(v); }); return; }
            if (!o || typeof o.id !== 'string' || !/^[a-z]{2,12}$/.test(o.id)) return;
            ov[o.id] = {name:typeof o.name === 'string' ? o.name.slice(0, 40) : '', icon:typeof o.icon === 'string' && xmbIconOk(o.icon) ? o.icon : ''};
          });
          xmbHome.catOv = ov;
          log('PS5XMB: CATS ' + Object.keys(ov).length);
          if (Object.keys(ov).length || xmbHome.barOrder) { xmbColumnsApply(); xmbNotify(); }
        })
        .catch(function () { xmbHome.catsAsked = false; });
    } catch (e) { xmbHome.catsAsked = false; }
  }
  function xmbCatSet(id, what, value) {
    var ov = xmbHome.catOv || (xmbHome.catOv = {}), o = ov[id] || (ov[id] = {name:'', icon:''});
    o[what] = value;
    log('PS5XMB: CAT_' + what.toUpperCase() + ' ' + id + ' ' + value);
    xmbCatsSave();
    xmbColumnsApply();
  }
  function xmbCatsSave() {
    var ov = xmbHome.catOv || {};
    var list = Object.keys(ov).map(function (k) { return {id:k, name:ov[k].name || '', icon:ov[k].icon || ''}; });
    if (xmbHome.barOrder) list.push({id:'_bar', ids:xmbHome.barOrder});
    if (typeof globalThis.fetch === 'function') {
      try { globalThis.fetch('http://127.0.0.1:4444/xmb-cats', {method:'POST', body:JSON.stringify(list)}).catch(function () {}); } catch (e) {}
    }
  }
  /* V79: any column one place to the left / right (the XMB's own ones too); the whole order is saved */
  function xmbBarShift(catIdx, dir) {
    var ids = XMB_WEB_NATIVE_CATEGORIES.map(function (c) { return c.id; }), to = catIdx + dir;
    if (catIdx < 0 || to < 0 || to >= ids.length) return false;
    var t = ids[catIdx]; ids[catIdx] = ids[to]; ids[to] = t;
    xmbHome.barOrder = ids;
    (xmbHome.columns || []).forEach(function (c) { c.pos = ids.indexOf('col_' + c.id); });
    log('PS5XMB: COLUMN_MOVE ' + t + ' -> ' + to);
    xmbCatsSave();
    xmbColumnsChanged(true);
    return true;
  }
  /* the column the Triangle panel's column options work on: a custom column, or one of the XMB's own (rename / icon only) */
  function xmbCatTarget(c) {
    var cat = XMB_WEB_NATIVE_CATEGORIES[c];
    if (!cat) return null;
    if (cat.colId) { var col = xmbColumnById(cat.colId); return col ? {custom:true, col:col, id:col.id, name:col.name, icon:col.icon} : null; }
    return {custom:false, cat:cat.id, id:'B_' + cat.id, name:cat.name, icon:cat.asset};
  }
  function xmbColumnsLoad() {
    if (xmbHome.columnsAsked || typeof globalThis.fetch !== 'function') return;
    xmbHome.columnsAsked = true;
    try {
      globalThis.fetch('http://127.0.0.1:4444/xmb-columns', {method:'GET'})
        .then(function (r) { return r && r.ok ? r.text() : ''; })
        .then(function (t) {
          var j = null; try { j = t ? JSON.parse(t) : null; } catch (e) { j = null; }
          if (!Array.isArray(j)) { xmbHome.columnsAsked = false; return; }
          xmbHome.columns = xmbColumnsValid(j);
          log('PS5XMB: COLUMNS ' + xmbHome.columns.length);
          if (xmbHome.columns.length) { xmbColumnsChanged(false); xmbNotify(); }
        })
        .catch(function () { xmbHome.columnsAsked = false; });
    } catch (e) { xmbHome.columnsAsked = false; }
  }
  function xmbColumnsSave() {
    if (typeof globalThis.fetch !== 'function') return;
    try {
      globalThis.fetch('http://127.0.0.1:4444/xmb-columns', {method:'POST', body:JSON.stringify(xmbHome.columns || [])})
        .then(function (r) { log('PS5XMB: COLUMNS_SAVED ' + (r && r.ok ? 'ok' : 'FAILED ' + (r && r.status))); })
        .catch(function (e) { log('PS5XMB: COLUMNS_SAVED FAILED ' + e); });
    } catch (e) {}
  }
  /* takes a game out of every column (true when it was in one) */
  function xmbColumnTake(gameId) {
    var was = false;
    (xmbHome.columns || []).forEach(function (c) { var n = c.ids.length; c.ids = c.ids.filter(function (x) { return x !== gameId; }); if (c.ids.length !== n) was = true; });
    return was;
  }
  function xmbColumnAdd(gameId, colId) {
    var c = xmbColumnById(colId);
    if (!c || !/^[A-Z]{4}\d{5}$/.test(gameId || '')) return;
    xmbColumnTake(gameId);
    var inFolder = false;
    (xmbHome.folders || []).forEach(function (f) { var n = f.ids.length; f.ids = f.ids.filter(function (x) { return x !== gameId; }); if (f.ids.length !== n) inFolder = true; });
    if (inFolder) { xmbHome.foldersVer = (xmbHome.foldersVer || 0) + 1; xmbFoldersSave(); }
    c.ids.push(gameId);
    log('PS5XMB: COLUMN_ADD ' + gameId + ' -> ' + c.name);
    xmbColumnsChanged(true);
  }
  function xmbColumnRemove(gameId) {
    xmbColumnTake(gameId);
    log('PS5XMB: COLUMN_REMOVE ' + gameId);
    xmbColumnsChanged(true);
  }
  function xmbColumnCreate(name, gameId) {
    xmbHome.columns = xmbHome.columns || [];
    if (xmbHome.columns.length >= 12) { xmbPlaySfx('ng'); return; }
    var cid = 'c' + Date.now().toString(36), k0 = 0;
    while (xmbColumnById(cid + (k0 ? '_' + k0 : ''))) k0++;
    var c = {id:cid + (k0 ? '_' + k0 : ''), name:name, icon:'xmbweb_xmb_icon_005', ids:[], t:Date.now()};
    xmbHome.columns.push(c);
    log('PS5XMB: COLUMN_NEW ' + name);
    if (gameId && /^[A-Z]{4}\d{5}$/.test(gameId)) xmbColumnAdd(gameId, c.id);
    else xmbColumnsChanged(true);
  }
  function xmbColumnRename(id, name) {
    var c = xmbColumnById(id);
    if (!c) return;
    c.name = name;
    log('PS5XMB: COLUMN_RENAME ' + id + ' ' + name);
    xmbColumnsChanged(true);
  }
  function xmbColumnSetIcon(id, icon) {
    var c = xmbColumnById(id);
    if (!c) return;
    c.icon = icon;
    log('PS5XMB: COLUMN_ICON ' + id + ' ' + icon);
    xmbColumnsChanged(true);
  }
  /* V74: a column one place to the left / right in the bar (past the XMB's own categories too) */
  function xmbColumnShift(id, dir) {   /* V79: through the whole bar's order */
    return xmbBarShift(XMB_WEB_NATIVE_CATEGORIES.map(function (c) { return c.id; }).indexOf('col_' + id), dir);
  }
  function xmbFolderSetIcon(fid, icon) {
    var f = xmbFolderById(fid);
    if (!f) return;
    f.icon = icon;
    log('PS5XMB: FOLDER_ICON ' + fid + ' ' + icon);
    xmbFoldersChanged(true);
  }
  /* ---- V74: Custom sort - one order of every game and folder (folders as "F:<id>"), kept on the console (/xmb-order). Each list
   * (Game, a folder, a column) shows its own entries in that order. Triangle > Move: Up / Down move the title, X or O ends. */
  function xmbOrderKey(it) { return it && it.kind === 'xmb-folder' ? 'F:' + it.fid : it ? it.id : ''; }
  function xmbOrderIndex() {
    if (xmbHome.orderIdxVer === xmbHome.orderVer && xmbHome.orderIdx) return xmbHome.orderIdx;
    var m = {};
    (xmbHome.order || []).forEach(function (k, i) { if (m[k] === undefined) m[k] = i; });
    xmbHome.orderIdx = m; xmbHome.orderIdxVer = xmbHome.orderVer;
    return m;
  }
  function xmbOrderCmp(O, a, b) {
    var ia = O[a], ib = O[b];
    if (ia === undefined && ib === undefined) return 0;
    if (ia === undefined) return 1;
    if (ib === undefined) return -1;
    return ia - ib;
  }
  /* the order on screen now (folders first, then the games in the sort in use) is taken as the starting custom order */
  function xmbOrderSeed() {
    if ((xmbHome.order || []).length) return;
    var keys = [];
    (xmbHome.folders || []).forEach(function (f) { keys.push('F:' + f.id); });
    xmbGames().forEach(function (g) { if (g.kind === 'game') keys.push(g.id); });
    xmbHome.order = keys;
    xmbHome.orderVer = (xmbHome.orderVer || 0) + 1;
    xmbOrderSave();
  }
  /* V76: switching a list to Custom keeps what is on screen: its entries take, in the order shown, the places they hold in the order */
  function xmbOrderAdopt(list, newOnly) {
    var O = xmbHome.order, keys = (list || []).filter(function (it) { return it && (it.kind === 'game' || it.kind === 'xmb-folder'); }).map(xmbOrderKey);
    var added = 0;
    keys.forEach(function (k) { if (O.indexOf(k) < 0) { O.push(k); added++; } });
    if (newOnly) { if (added) { xmbHome.orderVer = (xmbHome.orderVer || 0) + 1; xmbOrderSave(); } return; }
    var slots = keys.map(function (k) { return O.indexOf(k); }).sort(function (a, b) { return a - b; });
    keys.forEach(function (k, i) { O[slots[i]] = k; });
    xmbHome.orderVer = (xmbHome.orderVer || 0) + 1;
    xmbOrderSave();
  }
  function xmbOrderLoad() {
    if (xmbHome.orderAsked || typeof globalThis.fetch !== 'function') return;
    xmbHome.orderAsked = true;
    try {
      globalThis.fetch('http://127.0.0.1:4444/xmb-order', {method:'GET'})
        .then(function (r) { return r && r.ok ? r.text() : ''; })
        .then(function (t) {
          var j = null; try { j = t ? JSON.parse(t) : null; } catch (e) { j = null; }
          if (!Array.isArray(j)) { xmbHome.orderAsked = false; return; }
          xmbHome.order = j.filter(function (k) { return typeof k === 'string' && /^(F:[A-Za-z0-9_]{1,24}|[A-Z]{4}\d{5}|#L:(game|C[A-Za-z0-9_]{1,24}))$/.test(k); });
          xmbHome.orderVer = (xmbHome.orderVer || 0) + 1;
          xmbGamesResort(); xmbColumnItemsCache = {}; xmbNotify();
        })
        .catch(function () { xmbHome.orderAsked = false; });
    } catch (e) { xmbHome.orderAsked = false; }
  }
  function xmbOrderSave() {
    if (typeof globalThis.fetch !== 'function') return;
    try { globalThis.fetch('http://127.0.0.1:4444/xmb-order', {method:'POST', body:JSON.stringify(xmbHome.order || [])}).catch(function () {}); } catch (e) {}
  }
  /* the list the moved title is in, and where it is */
  function xmbMoveList() { return xmbItems(); }
  function xmbMoveStart() {
    if (xmbCurSort() !== 'custom') xmbSetGameSort('custom');
    var mcol = xmbColumnOfCat(xmbHome.category), mlk = '#L:' + (mcol ? 'C' + mcol.id : 'game');   /* V79: this list has its own custom order now */
    if ((xmbHome.order || []).indexOf(mlk) < 0) { xmbOrderSeed(); xmbHome.order.push(mlk); xmbHome.orderVer++; xmbOrderSave(); }
    var it = xmbSelected();
    if (!it || (it.kind !== 'game' && it.kind !== 'xmb-folder')) return;
    xmbOrderSeed();
    xmbHome.moveMode = {key:xmbOrderKey(it), name:it.name};
    log('PS5XMB: MOVE_START ' + xmbHome.moveMode.key);
  }
  function xmbMoveStep(dir) {
    var mm = xmbHome.moveMode, list = xmbMoveList(), at = -1;
    for (var k = 0; k < list.length; k++) if (xmbOrderKey(list[k]) === mm.key) at = k;
    var to = at + (dir === 'up' ? -1 : 1);
    if (at < 0 || to < 0 || to >= list.length) { xmbPlaySfx('ng'); return; }
    var other = xmbOrderKey(list[to]), O = xmbHome.order;
    [mm.key, other].forEach(function (k) { if (O.indexOf(k) < 0) O.push(k); });
    var ia = O.indexOf(mm.key), ib = O.indexOf(other);
    O[ia] = other; O[ib] = mm.key;
    xmbHome.orderVer = (xmbHome.orderVer || 0) + 1;
    xmbGamesCache = {row:null, all:null, at:0, items:null};
    xmbGameItemsCache = {}; xmbColumnItemsCache = {};
    var fr = xmbHome.webStack[xmbHome.webStack.length - 1];
    if (fr && fr.fid) xmbFolderFrameRefresh();
    var nl = xmbMoveList();
    for (var j = 0; j < nl.length; j++) if (xmbOrderKey(nl[j]) === mm.key) {
      if (fr) fr.cursor = j; else xmbHome.cursor[xmbHome.category] = j;
    }
    xmbPlaySfx('cursor', dir);
    xmbMoveNotify(nl.length);
  }
  function xmbMoveEnd() {
    if (!xmbHome.moveMode) return;
    log('PS5XMB: MOVE_END ' + xmbHome.moveMode.key);
    xmbHome.moveMode = null;
    xmbOrderSave();
    xmbPlaySfx('decide');
    xmbNotify();
  }
  function xmbColumnDelete(id) {
    xmbHome.columns = (xmbHome.columns || []).filter(function (c) { return c.id !== id; });
    log('PS5XMB: COLUMN_DELETE ' + id);
    xmbColumnsChanged(true);
  }
  /* the PNG icons uploaded to XMB5/xmbicons */
  function xmbIconsFetch() {
    if (typeof globalThis.fetch !== 'function' || xmbHome.iconsAsking) return;
    xmbHome.iconsAsking = true;
    try {
      globalThis.fetch('http://127.0.0.1:4444/xmbicons', {method:'GET'})
        .then(function (r) { return r && r.ok ? r.text() : ''; })
        .then(function (t) {
          xmbHome.iconsAsking = false;
          var list = String(t || '').split('\n').map(function (l) { return l.trim().split(' ')[0]; }).filter(function (f) { return /^[A-Za-z0-9_.-]+\.png$/i.test(f); }).sort();
          if (list.join('|') !== (xmbHome.customIcons || []).join('|')) { xmbHome.customIcons = list; if (xmbHome.optionsOpen) xmbNotify(); }
        })
        .catch(function () { xmbHome.iconsAsking = false; });
    } catch (e) { xmbHome.iconsAsking = false; }
  }
  /* ---- V73: Close Application: the title running now (asked when Triangle opens and when the Home comes back) */
  function xmbRunningFetch() {
    if (typeof globalThis.fetch !== 'function') return;
    try {
      globalThis.fetch('http://127.0.0.1:4444/xmb-app?op=running', {method:'POST'})
        .then(function (r) { return r && r.ok ? r.text() : ''; })
        .then(function (t) {
          var j = null; try { j = t ? JSON.parse(t) : null; } catch (e) { j = null; }
          var id = j && typeof j.id === 'string' ? j.id : '';
          if (id !== ((xmbHome.running && xmbHome.running.id) || '')) {
            xmbHome.running = id ? {id:id} : null;
            log('PS5XMB: RUNNING ' + (id || 'none'));
            if (xmbHome.optionsOpen) xmbNotify();
          }
        })
        .catch(function () {});
    } catch (e) {}
  }
  function xmbCloseApp(id) {
    if (typeof globalThis.fetch !== 'function') { xmbHome.running = null; return; }
    log('PS5XMB: CLOSE_APP ' + id);
    try {
      globalThis.fetch('http://127.0.0.1:4444/xmb-app?op=close&id=' + encodeURIComponent(id), {method:'POST'})
        .then(function (r) {
          log('PS5XMB: CLOSE_APP ' + id + ' ' + (r && r.ok ? 'closed' : 'FAILED ' + (r && r.status)));
          xmbHome.running = null;
          if (typeof setTimeout === 'function') setTimeout(xmbRunningFetch, 1500);
        })
        .catch(function () {});
    } catch (e) {}
  }
  /* the PS5 keyboard for a folder name */
  function xmbFolderAsk(kind, o) {
    o = o || {};
    xmbHome.kb = {kind:kind, fid:o.fid || '', gameId:o.gameId || '', at:Date.now()};
    xmbDataHook();
    log('PS5XMB: FOLDER_KEYBOARD ' + kind);
    if (!xmbSfxConsole()) return;   /* the host harness answers with test.folderData() */
    if (!xmbHome.kbPoll && typeof setInterval === 'function')
      xmbHome.kbPoll = setInterval(function () {
        if (!xmbHome.kb || Date.now() - xmbHome.kb.at > 300000) { clearInterval(xmbHome.kbPoll); xmbHome.kbPoll = null; xmbHome.kb = null; return; }
        try { console.log('THEME-ASK'); } catch (e) {}
      }, 250);
    var cur = kind === 'rename' || kind === 'renamecol' ? String(o.name || '').replace(/[|\r\n]/g, ' ') : '';
    /* after the panel has closed (the keyboard opens on the focused scene) */
    var kid = kind === 'rename' ? 'XMBF' + o.fid : kind === 'renamecol' ? 'XMBC' + o.fid : kind === 'newcol' ? 'XMBCNEW' : 'XMBFNEW';
    setTimeout(function () { try { console.log('THEME-RENAME ' + kid + '|' + cur); } catch (e) {} }, 300);
  }
  /* "zt-rename" {id, name, t} from the keyboard: ours start with XMBF, everything else goes on to XMB5's own handler */
  function xmbFolderKbData(text) {
    var rn = null;
    try { rn = JSON.parse(String(text)); } catch (e) { return false; }
    if (!rn || typeof rn.id !== 'string' || (rn.id.indexOf('XMBF') !== 0 && rn.id.indexOf('XMBC') !== 0)) return false;
    if (xmbSfxConsole()) { try { console.log('THEME-DATA zt-rename done'); } catch (e) {} }
    var kb = xmbHome.kb;
    xmbHome.kb = null;
    if (!kb) return true;
    var name = String(rn.name || '').replace(/[\u0000-\u001f|]/g, '').trim().slice(0, 40);
    log('PS5XMB: FOLDER_KEYBOARD done ' + kb.kind + ' "' + name + '"');
    if (!name) return true;   /* cancelled or left empty */
    if (kb.kind === 'new') xmbFolderCreate(name, kb.gameId);
    else if (kb.kind === 'rename') xmbFolderRename(kb.fid, name);
    else if (kb.kind === 'newcol') xmbColumnCreate(name, kb.gameId);
    else if (kb.kind === 'renamecol' && kb.fid.indexOf('B_') === 0) xmbCatSet(kb.fid.slice(2), 'name', name);   /* V78: an XMB column */
    else if (kb.kind === 'renamecol') xmbColumnRename(kb.fid, name);
    xmbNotify();
    return true;
  }
  function xmbDataHook() {
    var prev = globalThis.__themeData;
    if (prev && prev.__xmb) return;
    var w = function (key, text) {
      if (key === 'zt-rename') { try { if (xmbFolderKbData(text)) return undefined; } catch (e) { log('PS5XMB: FOLDER_KEYBOARD ' + e); } }
      return typeof prev === 'function' ? prev.apply(this, arguments) : undefined;
    };
    w.__xmb = true;
    globalThis.__themeData = w;
  }
  function xmbSetGameSort(mode) {
    if (!/^(date|format|az|za|custom)$/.test(mode)) return;
    var col = xmbColumnOfCat(xmbHome.category);
    /* V76: the first time a list goes Custom, the order on screen becomes its custom one (nothing jumps). V79: after that its own custom
     * order is kept: A to Z and back to Custom brings back the order you made (a "#L:<list>" mark in the saved order) */
    if (mode === 'custom') {
      xmbOrderSeed();
      var lk = '#L:' + (col ? 'C' + col.id : 'game');
      if (xmbHome.order.indexOf(lk) < 0) { xmbOrderAdopt(xmbCategoryItems(xmbHome.category)); xmbHome.order.push(lk); xmbHome.orderVer++; xmbOrderSave(); }
      else xmbOrderAdopt(xmbCategoryItems(xmbHome.category), true);   /* only titles new to the order are added */
    }
    if (col) {   /* V76: this column's own sort */
      col.sort = mode;
      log('PS5XMB: COLUMN_SORT ' + col.name + ' ' + mode);
      xmbColumnsChanged(true);
      return;
    }
    xmbHome.gameSort = mode;
    xmbPrefSave('gameSort', mode);
    xmbGamesResort();
    log('PS5XMB: GAME_SORT ' + mode);
  }
  /* V78: the PS3's format badge after the date line of a game / app: PS5, PS4 or PS3 (from its param file, read by the ELF with the
   * install dates; the title ID when the ELF has no answer) */
  function xmbBadgeKind(g) {
    var id = String(g && g.id || ''), P = xmbHome.appPlat || {};
    if (P[id]) return 'ps' + P[id];
    if (/^(PPSA|ECAS|ELAS|ELJM|ELJS)/.test(id)) return 'ps5';
    if (/^(CUSA|PCAS|PCJS|PCKS|PLAS|PLJS|PLJM)/.test(id)) return 'ps4';
    if (/^(BL|BC|NP)[A-Z]{2}\d{5}$/.test(id)) return 'ps3';
    return '';
  }
  /* V79: the badge picture (theme/particles/xmbweb_badge_<ps5|ps4|ps3>_<d|n>.png: see-through letters), white by day, black by night */
  function xmbBadge(g) {
    var k = xmbBadgeKind(g);
    return k ? 'xmbweb_badge_' + k + '_d' : '';   /* V80: always the white one, day and night */
  }
  /* install dates of every title (the folder's creation time, read by the ELF), asked once per new title */
  function xmbAppDatesWant(list) {
    if (typeof globalThis.fetch !== 'function') return;
    var D = xmbHome.appDates = xmbHome.appDates || {}, now = Date.now();
    if (xmbHome.appDatesPending || now - (xmbHome.appDatesFailAt || 0) < 30000) return;
    var ids = list.filter(function (g) { return g && g.kind === 'game' && D[g.id] === undefined; }).map(function (g) { return g.id; });
    if (!ids.length) return;
    xmbHome.appDatesPending = true;
    try {
      globalThis.fetch('http://127.0.0.1:4444/xmb-appinfo', {method:'POST', body:ids.join(',')})
        .then(function (r) { return r && r.ok ? r.text() : ''; })
        .then(function (t) {
          xmbHome.appDatesPending = false;
          var j = null; try { j = t ? JSON.parse(t) : null; } catch (e) { j = null; }
          if (!j || typeof j !== 'object') { xmbHome.appDatesFailAt = Date.now(); return; }
          var P = xmbHome.appPlat = xmbHome.appPlat || {};
          ids.forEach(function (id) { var d = j[id] && Number(j[id].d); D[id] = d > 0 ? d * 1000 : 0; if (j[id] && (j[id].p === 4 || j[id].p === 5)) P[id] = j[id].p; });
          log('PS5XMB: GAME_DATES ' + ids.length);
          if (xmbHome.gameSort === 'date') { xmbGamesResort(); xmbNotify(); }
        })
        .catch(function () { xmbHome.appDatesPending = false; xmbHome.appDatesFailAt = Date.now(); });
    } catch (e) { xmbHome.appDatesPending = false; }
  }
  /* one title's size (its app + update + add-on folders, added up by the ELF) for the Information screen */
  function xmbAppSize(id) {
    var S = xmbHome.appSizes = xmbHome.appSizes || {};
    if (S[id] !== undefined || typeof globalThis.fetch !== 'function') return S[id];
    S[id] = 'pending';
    /* busy / failed: "Calculating..." stays, asked again 2 s later */
    var retry = function () { if (typeof setTimeout === 'function') setTimeout(function () { if (S[id] === 'pending') delete S[id]; if (xmbHome.infoOpen) xmbNotify(); }, 2000); };
    try {
      globalThis.fetch('http://127.0.0.1:4444/xmb-appinfo?size=1&ids=' + encodeURIComponent(id), {method:'POST'})
        .then(function (r) { return r && r.ok ? r.text() : ''; })
        .then(function (t) {
          var j = null; try { j = t ? JSON.parse(t) : null; } catch (e) { j = null; }
          if (!j) { retry(); return; }
          var b = j[id] && Number(j[id].s);
          S[id] = b >= 0 ? b : -1;
          log('PS5XMB: GAME_SIZE ' + id + ' ' + S[id]);
          if (xmbHome.infoOpen) xmbNotify();
        })
        .catch(retry);
    } catch (e) { delete S[id]; }
    return S[id];
  }
  function xmbSizeText(b) {
    if (b === 'pending' || b === undefined) return 'Calculating...';
    if (!(b >= 0)) return 'Unknown';
    var K = 1024;
    if (b >= K * K * K) return (b / K / K / K).toFixed(2) + ' GB';
    if (b >= K * K) return Math.round(b / K / K) + ' MB';
    return Math.max(1, Math.round(b / K)) + ' KB';
  }
  /* V62: the PS3 Information screen's fields (drawn by the renderer: icon box, right-aligned labels, values, O Back) */
  function xmbInfoModel() {
    var it = xmbSelected();
    if (!it) return {icon:'xmbweb_xmb_icon_022', pic:false, rows:[['Title', 'PS5 XMB']]};
    var rows = [['Title', String(it.name || '')]], pic = false, icon = it.iconAsset || 'xmbweb_xmb_icon_022';
    if (it.kind === 'game') {
      if (it.id) rows.push([/^(PPSA|CUSA)/.test(it.id) ? 'Title ID' : 'ID', String(it.id)]);
      var played = xmbPlayedLabel(it);
      if (played) rows.push(['Last Played', played]);
      if (/^[A-Z]{4}\d{5}$/.test(it.id || '')) rows.push(['Size', xmbSizeText(xmbAppSize(it.id))]);   /* V63 */
      if (typeof it.icon === 'string' && it.icon) { icon = it.icon; pic = true; }
      else if (/^[A-Z]{4}\d{5}$/.test(it.id || '')) { icon = '/user/app/' + it.id + '/sce_sys/icon0.png'; pic = true; }
    } else if (it.kind === 'xmb-folder') {   /* V68 */
      rows.push(['Contents', it.subtitle || 'Empty']);
    } else {
      if ((it.kind === 'user' || it.kind === 'photo') && typeof it.icon === 'string' && it.icon) { icon = it.icon; pic = true; }
      if (it.value !== undefined && it.value !== null && it.value !== '') rows.push(['Setting', String(it.value)]);
      if (it.kind === 'unwired') rows.push(['Status', 'Not available on the PS5 yet']);
      if (it.subtitle) rows.push(['Description', String(it.subtitle), String(it.subtitle).length > 60 ? 2 : 1]);
    }
    return {icon:icon, pic:pic, rows:rows};
  }
  /* PS5XMB_V26_SONY_VERIFIED_296_46_INPUT_DIAGNOSTIC_20261117 */
  /* Sony PS3 4.93 vsh.elf 0x00428DE8 repeat producer uses defaults:
   * first threshold 296.0; continuous threshold 46.0.
   * V25.1 independently verified both as ACTIVE in two RPCS3 snapshots;
   * frame delta ~16.6667, giving ~18 and ~3 frames at 60 Hz.
   * This trial still uses PS5's *native callback events*. It cannot emit
   * faster than native Repeat callbacks. No free-running timer is started
   * until a reliable native key-release signal is independently verified.
   * Diagnostic logs show Down/Repeat/Up (when delivered) and cadence.
   * Horizontal Mode-5 and V19.1 Game row animations remain UNCHANGED. */
  /* V33: xmb-web key-repeat cadence (xmb-web V.INPUT_INITIAL_DELAY_MS 300, V.INPUT_REPEAT_MS 200,
   * each following interval divided by V.INPUT_ACCEL_MULT 1.4, floored at V.INPUT_MIN_REPEAT_MS 50).
   * Still driven by the native Repeat callbacks (no free-running timer): a Repeat is accepted once the
   * current interval has elapsed since the last accepted step. */
  var XMB_REPEAT_IV = ztXmbNative.repeatIntervals(48);
  var XMB_REPEAT_H_MUL = 0.7;   /* V75: confirmed horizontal factor */
    var XMB_REPEAT_V_MUL = XMB_REPEAT_H_MUL;  /* V83: identical vertical repeat cadence */
  var xmbRepeat = {direction:'',start:0,last:0,n:0,logs:0,blockedDirection:''};
  function xmbShouldNavigate(e, direction) {
    var kind = e && e.keyEventType;
    var now = Date.now();
    if (kind === 'Up' || kind === 'Release' || kind === 'KeyUp') {
      xmbRepeat.blockedDirection=direction;
      if (xmbRepeat.direction===direction) {xmbRepeat.direction='';xmbRepeat.start=0;xmbRepeat.last=0;xmbRepeat.n=0;}
      return false;
    }
    if (kind === 'Repeat') {
      if (xmbRepeat.blockedDirection===direction) return false;
      if (xmbRepeat.direction !== direction) {
        /* orphan Repeat (focus changed mid-hold): act as a fresh press, no autonomous repeats */
        xmbRepeat.direction=direction; xmbRepeat.start=now; xmbRepeat.last=now; xmbRepeat.n=0;
        return true;
      }
      /* V75: holding Left / Right (categories) repeats faster: 0.7 x the vertical intervals (first repeat ~150 ms instead of 210) */
      var hmul=(direction==='left'||direction==='right')?XMB_REPEAT_H_MUL:XMB_REPEAT_V_MUL;
      var need=Math.max(20,XMB_REPEAT_IV[Math.min(xmbRepeat.n,XMB_REPEAT_IV.length-1)]*hmul*100/xmbHome.holdSpeed);
      if (now-xmbRepeat.last+4<need) return false;
      xmbRepeat.last=now; xmbRepeat.n++;
      return true;
    }
    if (!pressed(e)) return false;
    xmbRepeat.direction=direction; xmbRepeat.blockedDirection='';
    xmbRepeat.start=now; xmbRepeat.last=now; xmbRepeat.n=0;
    return true;
  }
  /* Real owner-supplied PS3 navigation audio is now played as short 48k
   * stereo PCM by the C++ AudioOut worker, which shares NO video decoder
   * with the XMB wallpaper. The localhost-only endpoint is in theme_web.cpp.
   * A native or networking failure falls back to the existing PS5 UI sound.
   * This new AudioOut path still requires console testing. */
  /* V37: live speed controls (Settings > PS5 XMB Controls). Animation speed: 100 % = xmb-web's durations (250 / 200 ms), higher = faster.
   * Hold-scroll speed: 100 % = the V36 key-repeat cadence (210 ms, then 105 ms accelerating), higher = faster. */
  var XMB_SPEED_STEPS = [50, 60, 70, 80, 90, 100, 110, 115, 125, 140, 160, 180, 200];
  var XMB_BGDELAY_STEPS = [0, 25, 50, 75, 100, 125, 150, 200, 300];      /* % of the 1000 ms focus-background dwell */
  var XMB_STARTDELAY_STEPS = [0, 10, 20, 30, 40, 60, 80, 100, 150];     /* ms */
  var XMB_MUSICVOL_STEPS = [0, 20, 40, 60, 80, 100];                    /* % */
  /* V38 defaults: xmbHome.animSpeed 115, xmbHome.holdSpeed 110, bgDelay 100, startDelay 0 (edit them in the xmbHome object) */
  function xmbCycleSpeed(key) {
    var steps = key === 'bgDelay' ? XMB_BGDELAY_STEPS : key === 'startDelay' ? XMB_STARTDELAY_STEPS : key === 'musicVol' ? XMB_MUSICVOL_STEPS : XMB_SPEED_STEPS;
    var i = steps.indexOf(xmbHome[key]);
    xmbHome[key] = steps[(i + 1) % steps.length];
    xmbPrefSave(key, xmbHome[key]);   /* V51: kept across restarts */
    log('PS5XMB: SPEED ' + key + '=' + xmbHome[key] + (key === 'startDelay' ? ' ms' : '%'));
  }
  var XMB_SYS_SOUND = {cursor:'psfx_focus_move', category:'psfx_change_space', decide:'psfx_decide', cancel:'psfx_cancel', ok:'psfx_decide', ng:'psfx_cancel'};
  function xmbSystemSound(kind, direction) {
    try {
      var snd = T.rn && T.rn.SystemSoundPS;
      if (snd && typeof snd.playByID === 'function') {
        xmbHome.ownSysSound = true;   /* V64: not muted (xmbMuteSystemSounds) */
        try { snd.playByID(XMB_SYS_SOUND[kind] || 'psfx_focus_move', undefined,{pan:direction === 'left' ? -70 : direction === 'right' ? 70 : 0}); }
        finally { xmbHome.ownSysSound = false; }
        if (xmbHome.sfxToken <= 5) log('PS5XMB: SYSTEM_SFX_FALLBACK ' + kind);
        return;
      }
    } catch (e) {log('PS5XMB: SYSTEM_SFX_FAILED ' + e);}
    if (xmbHome.sfxToken <= 5) log('PS5XMB: SYSTEM_SFX_MISSING');
  }
  /* V36: the original PS3 XMB sounds (snd_cursor, snd_category_decide, snd_decide, snd_cancel, snd_system_ok, snd_system_ng) are mixed by
   * the native worker (several at once, one open port): kinds cursor / category / decide / cancel / ok / ng. Every scroll step asks for its
   * sound immediately (20 ms guard only) so the sound follows the scrolling speed. */
  var xmbSfxLast = {};
  function xmbPlaySfx(kind, direction) {
    if (!xmbEnabled()) return;
    if (kind === 'cursor' || kind === 'category') {
      var sfxNow = Date.now();
      if (xmbSfxLast[kind] && sfxNow - xmbSfxLast[kind] < 20) return;
      xmbSfxLast[kind] = sfxNow;
    }
    ++xmbHome.sfxToken;
    /* V39: sent at once. A D-pad step no longer renders React before returning (xmbMoveNotify), so nothing sits in front of the request:
     * the sound leaves in the same JS turn as the animation start. */
    xmbSendSfx(kind, direction);
  }
  /* V38: the XMB is on screen: keep the native audio port open (it plays silence between sounds), so the first sound after a pause is never lost. */
  /* V40: sounds go to the ELF through the console channel XMB5 already hooks (console.log -> ConsoleLog hook, same JS turn):
   * "THEME-XMBSFX <kind>" reaches the mixer in microseconds. The HTTP request it replaces queued behind any other request the small web
   * server was busy with (glow pictures, picture checks ...), so sounds came late or bunched up while scrolling fast. */
  function xmbSfxConsole() { return globalThis.__ps5xmbHarness !== true && typeof console !== 'undefined' && typeof console.log === 'function'; }
  function xmbSfxPort(on) {
    if (xmbHome.soundMode !== 'ps3') return;
    if (xmbHome.sfxPortOn === on) return;
    if (xmbSfxConsole()) { xmbHome.sfxPortOn = on; try { console.log('THEME-XMBSFX ' + (on ? 'warm' : 'sleep')); log('PS5XMB: NATIVE_SFX_' + (on ? 'WARM' : 'SLEEP')); } catch (e) {} return; }
    if (typeof globalThis.fetch !== 'function') return;
    xmbHome.sfxPortOn = on;
    try {
      globalThis.fetch('http://127.0.0.1:4444/xmb-sfx?kind=' + (on ? 'warm' : 'sleep'), {method:'POST'}).catch(function () {});
      log('PS5XMB: NATIVE_SFX_' + (on ? 'WARM' : 'SLEEP'));
    } catch (e) {}
  }
  /* V38: host helpers for the native renderer (localhost endpoints in theme_web.cpp) */
  var xmbArtQueue = [], xmbArtBusy = 0;
  function xmbArtCheck(uri, cb) {
    var req = typeof globalThis.fetch === 'function' ? globalThis.fetch : null;
    if (!req) { cb('ok'); return; }
    xmbArtQueue.push({uri:uri, cb:cb});
    xmbArtPump();
  }
  /* one picture check at a time (the native side decodes the picture on its own thread, at most two at once) */
  function xmbArtPump() {
    if (xmbArtBusy || !xmbArtQueue.length) return;
    var job = xmbArtQueue.shift(), done = false;
    xmbArtBusy = 1;
    var finish = function (r) { if (done) return; done = true; xmbArtBusy = 0; try { job.cb(r); } catch (e) {} xmbArtPump(); };
    var path = String(job.uri).replace(/^file:\/\//, '').replace(/\?.*$/, '');
    try {
      globalThis.fetch('http://127.0.0.1:4444/xmb-art?path=' + encodeURIComponent(path), {method:'POST'})
        .then(function (r) { return r && r.ok ? r.text() : 'ok'; })
        .then(function (t) {
          t = String(t).trim();
          if ((xmbHome.artLogs = (xmbHome.artLogs || 0) + 1) <= 16) log('PS5XMB: ART_CHECK ' + path + ' ' + t);
          finish(t === 'blank' ? 'blank' : t === 'missing' ? 'missing' : 'ok');
        })
        .catch(function () { finish('ok'); });
    } catch (e) { finish('ok'); }
  }
  /* V41: filtered 96 / 180 px copies of a game icon (made once by the ELF, cached in Assets/cache/xmbicons) - one request at a time */
  var xmbIconQueue = [], xmbIconBusy = 0;
  function xmbIconLevels(src, cb) {
    if (typeof globalThis.fetch !== 'function') { cb(null); return; }
    xmbIconQueue.push({src:src, cb:cb, tries:0});
    xmbIconPump();
  }
  function xmbIconPump() {
    if (xmbIconBusy || !xmbIconQueue.length) return;
    var job = xmbIconQueue.shift(), done = false;
    xmbIconBusy = 1;
    var finish = function (r) { if (done) return; done = true; xmbIconBusy = 0; try { job.cb(r); } catch (e) {} xmbIconPump(); };
    try {
      globalThis.fetch('http://127.0.0.1:4444/xmb-icon?path=' + encodeURIComponent(String(job.src).replace(/^file:\/\//, '')), {method:'POST'})
        .then(function (r) {
          if (r && r.status === 503 && job.tries++ < 5) { done = true; xmbIconBusy = 0; setTimeout(function () { xmbIconQueue.push(job); xmbIconPump(); }, 300); return null; }
          return r && r.ok ? r.text() : '';
        })
        .then(function (t) {
          if (t === null) return;
          var info = null; try { info = t ? JSON.parse(t) : null; } catch (e) { info = null; }
          if ((xmbHome.iconLogs = (xmbHome.iconLogs || 0) + 1) <= 3) log('PS5XMB: ICON_LEVELS ' + (info ? info.s : 'none ' + job.src));
          finish(info && info.s && info.b ? info : null);
        })
        .catch(function () { finish(null); });
    } catch (e) { finish(null); }
  }
  function xmbGlowFor(text, size, lh, cb) {
    var req = typeof globalThis.fetch === 'function' ? globalThis.fetch : null;
    if (!req) { cb(null); return; }
    try {
      req('http://127.0.0.1:4444/xmb-glow?px=' + size + '&lh=' + lh + '&text=' + encodeURIComponent(String(text)), {method:'POST'})
        .then(function (r) { return r && r.ok ? r.text() : null; })
        .then(function (t) {
          var info = null;
          try { info = t ? JSON.parse(t) : null; } catch (e) { info = null; }
          if (!info || !info.p) { if ((xmbHome.glowFails = (xmbHome.glowFails || 0) + 1) <= 3) log('PS5XMB: GLOW_UNAVAILABLE ' + String(text)); cb(null); return; }
          if ((xmbHome.glowLogs = (xmbHome.glowLogs || 0) + 1) <= 4) log('PS5XMB: GLOW_MADE ' + info.p + ' ' + info.w + 'x' + info.h);
          cb(info);
        })
        .catch(function () { cb(null); });
    } catch (e) { cb(null); }
  }
  function xmbSendSfx(kind, direction) {
    if (xmbHome.soundMode !== 'ps3') {xmbSystemSound(kind,direction);return;}
    if (xmbHome.active && !xmbHome.sfxPortOn) xmbSfxPort(true);
    if (xmbSfxConsole()) {
      try { console.log('THEME-XMBSFX ' + kind); if (xmbHome.sfxToken <= 3) log('PS5XMB: NATIVE_SFX_CONSOLE ' + kind); return; }
      catch (e) { /* falls through to HTTP */ }
    }
    var req = typeof globalThis.fetch === 'function' ? globalThis.fetch : null;
    if (!req) {
      if (xmbHome.sfxToken <= 5) log('PS5XMB: NATIVE_SFX_FETCH_UNAVAILABLE');
      xmbSystemSound(kind,direction); return;
    }
    try {
      req('http://127.0.0.1:4444/xmb-sfx?kind='+kind, {method:'POST'})
        .then(function(resp) {
          if (!resp || !resp.ok) {
            if (xmbHome.sfxToken <= 5) log('PS5XMB: NATIVE_SFX_HTTP_UNAVAILABLE status=' + (resp && resp.status));
            xmbSystemSound(kind,direction);
          }
        }).catch(function(e) {
          if (xmbHome.sfxToken <= 5) log('PS5XMB: NATIVE_SFX_FETCH_FAILED ' + String(e));
          xmbSystemSound(kind,direction);
        });
      if (xmbHome.sfxToken <= 5) log('PS5XMB: NATIVE_SFX_REQUEST ' + kind);
    } catch (e) {
      if (xmbHome.sfxToken <= 5) log('PS5XMB: NATIVE_SFX_REQUEST_FAILED ' + e);
      xmbSystemSound(kind,direction);
    }
  }
  /* Pure, bounded PS3-style row geometry (absolute screen Y positions).
     Previous items appear ABOVE the selected category and travel across it
     when scrolling; the chosen content remains illuminated below the rail. */
  /* Geometry uses one invariant center line for ALL icons in a category,
   * including the expanded focused icon. A category's item labels live in
   * their own column and do not move when focus size changes. */
  /* Consistent 1920x1080 internal anchor. The original firmware's 1080p
   * dimensions are verified from VSH; the XMB Home object coordinates below
   * are a visual calibration, NOT mislabeled VSH grid indices. All category
   * and row icons have exactly one x-center and all item text begins at one
   * x-position. This prevents the selection crossing the Game caption. */
  var XMB_ANCHOR = { centerX:XMB_DESIGNER.itemCenterX,
    railTop:XMB_DESIGNER.categoryTop, railWidth:XMB_DESIGNER.categoryCellWidth,
    itemY:XMB_DESIGNER.itemFocusY, labelX:XMB_DESIGNER.gameLabelX,
    itemGap:XMB_DESIGNER.itemGap };
  function xmbIconMetrics(item, chosen, category) {
    var game = category === XMB_GAME_CAT && item && item.kind === 'game';
    // Both focus sizes share a center; a game banner is 16:9, not a tile.
    var w = game ? (chosen ? XMB_DESIGNER.gameFocusWidth : XMB_DESIGNER.gameIdleWidth) :
      (chosen ? XMB_DESIGNER.otherFocusSize : XMB_DESIGNER.otherIdleSize);
    var h = game ? (chosen ? XMB_DESIGNER.gameFocusHeight : XMB_DESIGNER.gameIdleHeight) :
      (chosen ? XMB_DESIGNER.otherFocusSize : XMB_DESIGNER.otherIdleSize);
    return {game:game,width:w,height:h,center:XMB_DESIGNER.itemCenterX,
      left:XMB_DESIGNER.itemCenterX-w/2,
      titleLeft:game ? XMB_DESIGNER.gameLabelX : XMB_DESIGNER.otherLabelX};
  }
  /* Sony vsh.elf, layout preset 0, 1080p: base row step = 80 PAF units;
   * extra gap at each side of focus = 95 PAF units. Only the *ratios* are
   * transferred here: a native PAF unit is NOT a verified framebuffer px.
   * Designer itemGap calibrates the visual scale; a common center is kept
   * when an icon changes between the chosen and unchosen artwork dimensions.
   * This MUST remain optional until the actual Game list preset is known. */
  function xmbRowY(delta, category) {
    if (xmbHome.verticalGeometryMode === 'preset0') {
      if (delta === 0) return XMB_DESIGNER.itemFocusY;
      var unitScale = XMB_DESIGNER.itemGap / 80;
      if (!(unitScale > 0) || !isFinite(unitScale)) unitScale = 1;
      var game = category === XMB_GAME_CAT;
      var focusHeight = game ? XMB_DESIGNER.gameFocusHeight : XMB_DESIGNER.otherFocusSize;
      var idleHeight = game ? XMB_DESIGNER.gameIdleHeight : XMB_DESIGNER.otherIdleSize;
      var centerCorrection = (focusHeight - idleHeight) / 2;
      var units = (80 * delta) + (delta < 0 ? -95 : 95);
      return XMB_DESIGNER.itemFocusY + centerCorrection + units * unitScale;
    }
    if (delta <= -1) return XMB_DESIGNER.itemAboveY + (delta+1) * XMB_DESIGNER.itemGap;
    if (delta === 0) return XMB_DESIGNER.itemFocusY;
    return XMB_DESIGNER.itemBelowY + (delta-1) * XMB_DESIGNER.itemGap;
  }
  /* V48: any button the XMB gets means the Home is in front again: the title music may play again (it is held after a game is started) */
  /* V69: the PS3's "Triangle: Options" hint: it fades in at the bottom right once the cursor has rested 2 s on something that has
   * options (a game or a folder of the Game category, a game inside a folder), and goes at once on the next key */
  var XMB_HINT_AFTER = 2000, XMB_HINT_IN = 300;
  function xmbHintValue() {
    var A = T.rn && T.rn.Animated;
    if (!xmbHome.hintV && A && A.Value) xmbHome.hintV = new A.Value(0);
    return xmbHome.hintV || null;
  }
  function xmbHintWanted() {
    if (!xmbEnabled() || !xmbOptionsAllowed() || xmbHome.optionsOpen || xmbHome.infoOpen || xmbHome.viewer || xmbHome.kb || xmbHome.moveMode) return false;
    if (xmbIntroOn()) return false;
    var it = xmbSelected();
    return !!it && (it.kind === 'game' || it.kind === 'xmb-folder');
  }
  function xmbHintKick() {
    var v = xmbHintValue();
    if (xmbHome.hintTimer) { clearTimeout(xmbHome.hintTimer); xmbHome.hintTimer = null; }
    /* V70: faded out (Triangle opening the panel, any other key), never switched: the view keeps one animated opacity */
    if (v) { try { v.stopAnimation(); T.rn.Animated.timing(v, {toValue:0, duration:150, useNativeDriver:true}).start(); } catch (e) { try { v.setValue(0); } catch (e2) {} } }
    if (!v || typeof setTimeout !== 'function') return;
    xmbHome.hintTimer = setTimeout(function () {
      xmbHome.hintTimer = null;
      if (!xmbHintWanted()) return;
      try { T.rn.Animated.timing(v, {toValue:1, duration:XMB_HINT_IN, useNativeDriver:true}).start(); } catch (e) { try { v.setValue(1); } catch (e2) {} }
    }, XMB_HINT_AFTER);
  }
  function xmbInputSeen() {
    xmbHome.musicHold = false;
    xmbHintKick();   /* V69 */
    if (xmbHome.appState !== 'active') { xmbHome.appState = 'active'; xmbFocusFrameSync(); }   /* V66: a key reached the XMB: the Home is active */
    /* V65: a key reached the XMB, so the Home has the focus right now: the ELF learns which focus layer is the Home's (the focus frame
     * is hidden only on that layer; the PS button's menu and the system apps keep theirs) */
    var now = Date.now();
    if (now - (xmbHome.homeSentAt || 0) > 5000 && xmbSfxConsole()) { xmbHome.homeSentAt = now; try { console.log('THEME-XMBHOME'); } catch (e) {} }
  }
  function xmbMove(dir) {
    if (!xmbEnabled()) return false;
    if (xmbHome.exitPending || xmbHome.confirmExit) return true;
    if (xmbIntroSkip()) return true;   /* V57: a press during the boot intro skips it */
    xmbInputSeen();
    if (xmbHome.viewer) {                          /* V48: photo viewer: Left / Right = previous / next picture */
      var vt = xmbHome.webStack[xmbHome.webStack.length - 1];
      if (vt && (dir === 'left' || dir === 'right')) {
        var vo = vt.cursor;
        vt.cursor = Math.max(0, Math.min(vt.entries.length - 1, vt.cursor + (dir === 'left' ? -1 : 1)));
        if (vo !== vt.cursor) { xmbPlaySfx('cursor', dir === 'left' ? 'up' : 'down'); xmbNotify(); }
      }
      return true;
    }
    if (xmbHome.infoOpen) return true;
    if (xmbHome.moveMode) {   /* V74: Move - Up / Down move the title */
      if (dir === 'up' || dir === 'down') xmbMoveStep(dir);
      return true;
    }
    if (xmbHome.optionsOpen) {
      var osub = xmbHome.optionsSub;
      if (dir === 'up' || dir === 'down') {
        var oc = osub ? osub.cursor : xmbHome.optionsCursor, count = osub ? xmbSubItems(osub).length : xmbOptionItems().length;
        var on = Math.max(0, Math.min(count - 1, oc + (dir === 'up' ? -1 : 1)));
        if (osub) osub.cursor = on; else xmbHome.optionsCursor = on;
        if (on !== oc) xmbPlaySfx('cursor', dir);
        xmbNotify();
      } else if (dir === 'right' && !osub) {   /* V63: Right opens "Sort By" (it has the arrow) */
        var oit = xmbOptionItems()[xmbHome.optionsCursor];
        if (oit && oit.ch) xmbOptionsSubOpen(xmbOptSubKind(oit));
      } else if (dir === 'left' && osub) {     /* Left goes back to the first panel */
        xmbHome.optionsSub = null; xmbPlaySfx('cancel'); xmbNotify();
      }
      return true;
    }
    /* Submenu D-pad behavior comes from xmb-web's nested item model.
     * Horizontal Left backs out; Right opens the selected branch.
     * Native PS5 controller hooks and launch callback remain unchanged. */
    if (xmbHome.webStack.length) {
      var top=xmbHome.webStack[xmbHome.webStack.length-1];
      if (dir==='left') {
        xmbHome.webStack.pop();xmbHome.onLaunch=null;xmbPlaySfx('cancel');xmbNotify();return true;
      }
      if (dir==='right') return xmbWebEnter(xmbSelected());
      var old=top.cursor;
      top.cursor=Math.max(0,Math.min(top.entries.length-1,top.cursor+(dir==='up'?-1:1)));
      xmbHome.onLaunch=null;
      if(old!==top.cursor){xmbMoveNotify(top.entries.length);xmbPlaySfx('cursor',dir);}else xmbNotify();
      return true;
    }
    var changed = false;
    if (dir === 'left' || dir === 'right') {
      var priorCat = xmbHome.category;
      xmbHome.category = Math.min(xmbHome.cats.length - 1,
        Math.max(0, xmbHome.category + (dir === 'left' ? -1 : 1)));
      changed = priorCat !== xmbHome.category;
    } else {
      var n = xmbItems().length, c = xmbHome.category;
      var priorItem = xmbHome.cursor[c];
      xmbHome.cursor[c] = Math.max(0, Math.min(n - 1, xmbHome.cursor[c] + (dir === 'up' ? -1 : 1)));
      changed = priorItem !== xmbHome.cursor[c];
    }
    xmbHome.onLaunch = null;
    if (changed) xmbMoveNotify(dir === 'up' || dir === 'down' ? xmbItems().length : 0, dir === 'left' || dir === 'right'); else xmbNotify();   /* the animation starts FIRST ... */
    if (changed) xmbPlaySfx(dir === 'left' || dir === 'right' ? 'category' : 'cursor', dir);   /* ... then the sound request */
    if (xmbHome.inputLogCount++ < 18) log('PS5XMB: INPUT_MOVE ' + dir + ' category=' + xmbHome.category + ' item=' + xmbHome.cursor[xmbHome.category]);
    return true;
  }
  /* V83: keep the wave hidden under black while its video decoder resumes
     after the Gallery video player exits. Avoid the red fallback frame. */
  function xmbViewerClose() {
    var selected = xmbSelected(), video = selected && selected.kind === 'video';
    xmbHome.viewer = false;
    if (video) {
      xmbHome.waveSwapping = 'in';
      xmbWaveCoverTo(1, 0);
      if (xmbHome.waveSwapTimer) clearTimeout(xmbHome.waveSwapTimer);
      xmbHome.waveSwapTimer = setTimeout(function(){ xmbWavePlaying('video-resume-timeout'); }, 1800);
    }
  }
  function xmbBack() {
    if (!xmbEnabled()) return false;
    if (xmbHome.exitPending) return true;
    if (xmbHome.confirmExit) { xmbHome.confirmExit=false; xmbHome.exitError=''; xmbPlaySfx('cancel'); xmbNotify(); return true; }
    if (xmbIntroSkip()) return true;   /* V57: a press during the boot intro skips it */
    xmbInputSeen();
    if (xmbHome.viewer) { xmbViewerClose(); xmbPlaySfx('cancel'); xmbNotify(); return true; }
    if (xmbHome.infoOpen) { xmbHome.infoOpen = false; xmbPlaySfx('cancel'); xmbNotify(); return true; }
    if (xmbHome.moveMode) { xmbMoveEnd(); return true; }   /* V74 */
    if (xmbHome.optionsOpen) {   /* V63: Circle closes the sorts first, then the panel */
      if (xmbHome.optionsSub) xmbHome.optionsSub = null; else xmbHome.optionsOpen = false;
      xmbPlaySfx('cancel'); xmbNotify(); return true;
    }
    if (xmbHome.webStack.length) {
      xmbHome.webStack.pop();xmbHome.onLaunch=null;xmbPlaySfx('cancel');xmbNotify();return true;
    }
    /* V34: Circle on the top level of the XMB does nothing (it used to drop back to the PS5 Home).
     * "Return to PS5 Home" in the Game category is the way out. */
    return true;
  }
  function xmbTriangle() {
    if (!xmbEnabled()) return false;
    if (xmbHome.exitPending || xmbHome.confirmExit) return true;
    if (xmbIntroSkip()) return true;   /* V57: a press during the boot intro skips it */
    xmbInputSeen();
    if (xmbHome.viewer) return true;
    if (xmbHome.infoOpen) { xmbHome.infoOpen = false; xmbNotify(); return true; }
    if (xmbHome.moveMode) { xmbMoveEnd(); return true; }   /* V74 */
    if (!xmbHome.optionsOpen && !xmbOptionsAllowed()) return true;   /* V63: the panel belongs to the Game category only */
    xmbHome.optionsOpen = !xmbHome.optionsOpen;
    xmbHome.optionsSub = null;
    if (xmbHome.optionsOpen) xmbRunningFetch();   /* V73: is the focused title the one running (Close Application)? */
    xmbHome.optionsCursor = xmbHome.optionsOpen ? xmbOptionsFirst() : 0;
    xmbPlaySfx(xmbHome.optionsOpen ? 'decide' : 'cancel');
    log('PS5XMB: OPTIONS_' + (xmbHome.optionsOpen ? 'OPEN' : 'CLOSED'));
    xmbNotify();
    return true;
  }
  /* V82: separate confirmed unload. No reactivation after a successful request.
   * On failure keep XMB5 active and allow another attempt or Circle to cancel. */
  function xmbReturnToStock() {
    if (xmbHome.exitPending) return;
    xmbHome.exitPending=true;
    xmbFocusEnd();
    xmbSfxPort(false);
    log('PS5XMB: RETURN_TO_STOCK_REQUEST');
    var req=typeof globalThis.fetch==='function' ? globalThis.fetch : null;
    if (!req) { xmbHome.exitPending=false; xmbHome.exitError='Connection to internal XMB service unavailable.'; log('PS5XMB: RETURN_TO_STOCK_NO_FETCH'); xmbNotify(); return; }
    try {
      req('http://127.0.0.1:4444/xmb-unload', {method:'POST'})
        .then(function(r) {
          if (!r || !r.ok) throw Error('HTTP '+(r ? r.status : 0));
          xmbHome.active=false; xmbHome.visible=false;
          xmbHome.stage='DISABLED_UNLOADED';
          log('PS5XMB: RETURN_TO_STOCK_DONE');
        }).catch(function(err) {
          xmbHome.exitPending=false;
          xmbHome.exitError='Internal unload request failed.';
          log('PS5XMB: RETURN_TO_STOCK_FAILED '+String(err));
          xmbNotify();
        });
    } catch(e) { xmbHome.exitPending=false; xmbHome.exitError='Internal unload request failed.'; log('PS5XMB: RETURN_TO_STOCK_FAILED '+String(e)); xmbNotify(); }
  }
  function xmbSelect() {
    if (!xmbEnabled()) return false;
    if (xmbHome.exitPending) return true;
    if (xmbHome.confirmExit) { xmbPlaySfx('decide'); xmbReturnToStock(); return true; }
    if (xmbIntroSkip()) return true;   /* V57: a press during the boot intro skips it */
    /* a D-pad step whose render is still pending: render now (the launch route of the new title is prepared by that render), act after */
    if (xmbHome.renderTimer && typeof setTimeout === 'function') { xmbFlushRender(); setTimeout(function () { xmbSelect(); }, 0); return true; }
    xmbInputSeen();
    if (xmbHome.viewer) { xmbViewerClose(); xmbPlaySfx('cancel'); xmbNotify(); return true; }
    var item = xmbSelected();
    if (!item) return true;
    if (xmbHome.infoOpen) { xmbHome.infoOpen = false; xmbNotify(); return true; }
    if (xmbHome.moveMode) { xmbMoveEnd(); return true; }   /* V74: X ends Move */
    if (xmbHome.optionsOpen) {
      var osb = xmbHome.optionsSub;
      if (osb && osb.kind === 'folders') {   /* V68: Add to Folder > a folder / New Folder */
        var targets = xmbFolderTargets(), tgt = targets[osb.cursor], gid = item.kind === 'game' ? item.id : '';
        if (!xmbSubItems(osb).length) { xmbPlaySfx('ng'); return true; }   /* V69: the empty list */
        xmbHome.optionsSub = null; xmbHome.optionsOpen = false;
        xmbPlaySfx('decide');
        if (tgt) xmbFolderAdd(gid, tgt.id); else xmbFolderAsk('new', {gameId:gid});
        xmbNotify(); return true;
      }
      if (osb && osb.kind === 'columns') {   /* V73: Move to Column > Game (V74) / a column / New Column */
        var cm = xmbColumnMenu()[osb.cursor], cgid = item.kind === 'game' ? item.id : '';
        xmbHome.optionsSub = null; xmbHome.optionsOpen = false;
        xmbPlaySfx('decide');
        if (cm && cm.game) xmbColumnRemove(cgid);
        else if (cm && cm.col) xmbColumnAdd(cgid, cm.col.id);
        else xmbFolderAsk('newcol', {gameId:cgid});
        xmbNotify(); return true;
      }
      if (osb && (osb.kind === 'icons' || osb.kind === 'ficons')) {     /* V73: Column Icon / V74: Folder Icon > an icon */
        var ich = xmbIconChoices()[osb.cursor], own = xmbIconOwner();
        /* V77: the panel and the icon list stay open (try another icon; Circle / Triangle closes) */
        xmbPlaySfx('decide');
        if (ich && own && own.column) xmbColumnSetIcon(own.column.id, ich.icon);
        if (ich && own && own.folder) xmbFolderSetIcon(own.folder.id, ich.icon);
        if (ich && own && own.base) xmbCatSet(own.base, 'icon', ich.icon);   /* V78 */
        xmbNotify(); return true;
      }
      if (osb) {   /* V63: a sort: applied. V78: the panel and the sort list stay open (the mark moves; Circle / Triangle closes) */
        var srt = XMB_GAME_SORTS[osb.cursor];
        xmbPlaySfx('decide');
        if (srt) xmbSetGameSort(srt[1]);
        xmbNotify(); return true;
      }
      var opt = xmbOptionItems()[xmbHome.optionsCursor];
      if (opt && opt.ch) { xmbOptionsSubOpen(xmbOptSubKind(opt)); return true; }
      /* V77: Move Column Left / Right keeps the panel open, the cursor on the same option (or the other direction at an end of the bar) */
      if (opt && (opt.act === 'colleft' || opt.act === 'colright')) {   /* V79: any column */
        var moved = xmbBarShift(xmbHome.category, opt.act === 'colleft' ? -1 : 1);
        xmbPlaySfx(moved ? 'ok' : 'ng');
        var acts = xmbOptionItems().map(function (o) { return o.act; }), ka = acts.indexOf(opt.act);
        if (ka < 0) ka = acts.indexOf(opt.act === 'colleft' ? 'colright' : 'colleft');
        if (ka >= 0) xmbHome.optionsCursor = ka;
        xmbNotify(); return true;
      }
      xmbHome.optionsOpen = false;
      var act = opt ? opt.act : '';
      if (act === 'info') { xmbHome.infoOpen = true; xmbPlaySfx('decide'); xmbNotify(); return true; }
      if (act === 'newfolder') { xmbPlaySfx('decide'); xmbFolderAsk('new', {}); xmbNotify(); return true; }
      if (act === 'rename' && item.kind === 'xmb-folder') { xmbPlaySfx('decide'); xmbFolderAsk('rename', {fid:item.fid, name:item.name}); xmbNotify(); return true; }
      if (act === 'delfolder' && item.kind === 'xmb-folder') { xmbPlaySfx('ok'); xmbFolderDelete(item.fid); xmbNotify(); return true; }
      if (act === 'remove' && item.kind === 'game') { xmbPlaySfx('ok'); xmbFolderRemove(item.id); xmbNotify(); return true; }
      /* V73: columns, Close Application */
      var ocol = xmbColumnOfCat(xmbHome.category);
      if (act === 'newcol') { xmbPlaySfx('decide'); xmbFolderAsk('newcol', {}); xmbNotify(); return true; }
      var otg = xmbCatTarget(xmbHome.category);   /* V78: a custom column or one of the XMB's own */
      if (act === 'renamecol' && otg) { xmbPlaySfx('decide'); xmbFolderAsk('renamecol', {fid:otg.id, name:otg.name}); xmbNotify(); return true; }
      if (act === 'delcol' && ocol) { xmbPlaySfx('ok'); xmbColumnDelete(ocol.id); xmbNotify(); return true; }
      if ((act === 'colleft' || act === 'colright') && ocol) { xmbPlaySfx(xmbColumnShift(ocol.id, act === 'colleft' ? -1 : 1) ? 'ok' : 'ng'); xmbNotify(); return true; }
      if (act === 'move') { xmbPlaySfx('decide'); xmbMoveStart(); xmbNotify(); return true; }
      if (act === 'uncolumn' && item.kind === 'game') { xmbPlaySfx('ok'); xmbColumnRemove(item.id); xmbNotify(); return true; }
      if (act === 'closeapp' && item.kind === 'game') { xmbPlaySfx('ok'); xmbCloseApp(item.id); xmbNotify(); return true; }
      xmbNotify();
      if (act !== 'start') return true;
      /* Start: the title's own action below */
    }
    if (item.kind === 'user') return true;   /* V79: the users are only shown (no switching) */
    if ((item.kind === 'photo' || item.kind === 'video') && !xmbHome.optionsOpen) { xmbHome.viewer = true; xmbPlaySfx('decide'); xmbNotify(); return true; }   /* V78: + videos */
    if (item.kind === 'none') { xmbPlaySfx('ng'); return true; }
    if (item.kind === 'xmb-folder' && !(item.children && item.children.length)) { xmbPlaySfx('ng'); return true; }   /* V68: an empty folder */
    log('PS5XMB: INPUT_SELECT ' + item.kind + ':' + String(item.id || item.name));
    if (xmbWebEnter(item)) return true;
    if (item.kind === 'stock') {
      /* V83: PS3 system-confirmation overlay: Cross=Yes, Circle=Cancel. */
      xmbHome.confirmExit=true; xmbHome.exitError='';
      xmbFocusEnd(); xmbPlaySfx('ok'); xmbNotify(); return true; /* PS3 system-OK sound at dialog appearance */
    }
    if (item.kind === 'power') return xmbPowerPress(item);   /* V60 */
    if (item.kind === 'info') return true;                    /* V61: read-only information */
    if (/-toggle$/.test(item.kind)) xmbPlaySfx('ok');
    if (item.kind === 'anim-speed' || item.kind === 'hold-speed' || item.kind === 'bg-delay' || item.kind === 'start-delay' || item.kind === 'music-vol') {
      var spKey = item.kind === 'anim-speed' ? 'animSpeed' : item.kind === 'hold-speed' ? 'holdSpeed' : item.kind === 'bg-delay' ? 'bgDelay' : item.kind === 'music-vol' ? 'musicVol' : 'startDelay';
      xmbCycleSpeed(spKey);
      /* the open submenu holds its own entries: swap in a new object (new identity -> the renderer re-adapts the row and shows the value) */
      var spTop = xmbHome.webStack[xmbHome.webStack.length - 1];
      if (spTop) spTop.entries[spTop.cursor] = Object.assign({}, item, {value:xmbHome[spKey] + (spKey === 'startDelay' ? ' ms' : '%')});
      xmbPlaySfx('ok'); xmbNotify(); return true;
    }
    if (item.kind === 'music-status') {          /* X refreshes the shown status */
      xmbMusicStatusFetch();
      var msTop = xmbHome.webStack[xmbHome.webStack.length - 1], msIdx = msTop ? msTop.cursor : -1;
      setTimeout(function () { if (msTop && msTop.entries[msIdx] && msTop.entries[msIdx].kind === 'music-status') { msTop.entries[msIdx] = Object.assign({}, msTop.entries[msIdx], {value: xmbHome.musicStatus || 'not tried yet'}); xmbNotify(); } }, 400);
      xmbPlaySfx('ok'); return true;
    }
    if (item.kind === 'theme-toggle') {
      xmbHome.visualMode = xmbHome.visualMode === 'classic' ? 'seasonal' : 'classic';
      log('PS5XMB: COLOR_MODE ' + xmbHome.visualMode); xmbNotify(); return true;
    }
    if (item.kind === 'category-motion-toggle') {
      xmbHome.categoryMotionMode = xmbHome.categoryMotionMode === 'xmb-web' ? 'ps3-mode5' :
        xmbHome.categoryMotionMode === 'ps3-mode5' ? 'standard' : 'xmb-web';
      log('PS5XMB: CATEGORY_MOTION_MODE ' + xmbHome.categoryMotionMode);
      xmbNotify(); return true;
    }
    if (item.kind === 'vertical-motion-toggle') {
      xmbHome.verticalMotionMode = xmbHome.verticalMotionMode === 'xmb-web' ? 'ps3-mode5' :
        xmbHome.verticalMotionMode === 'ps3-mode5' ? 'standard' : 'xmb-web';
      log('PS5XMB: VERTICAL_MOTION_MODE ' + xmbHome.verticalMotionMode);
      xmbNotify(); return true;
    }
    if (item.kind === 'vertical-geometry-toggle') {
      xmbHome.verticalGeometryMode = xmbHome.verticalGeometryMode === 'preset0' ? 'designer' : 'preset0';
      log('PS5XMB: VERTICAL_GEOMETRY_MODE ' + xmbHome.verticalGeometryMode);
      xmbNotify(); return true;
    }
    if (item.kind === 'intro-toggle') {           /* V57: XMB5 boot intro on / off */
      xmbHome.bootIntro = xmbHome.bootIntro === 'off' ? 'on' : 'off';
      xmbPrefSave('bootIntro', xmbHome.bootIntro);
      var itTop = xmbHome.webStack && xmbHome.webStack[xmbHome.webStack.length - 1];
      if (itTop) itTop.entries[itTop.cursor] = Object.assign({}, item, {value:xmbHome.bootIntro === 'off' ? 'Off' : 'On'});
      log('PS5XMB: BOOT_INTRO ' + xmbHome.bootIntro); xmbPlaySfx('ok'); xmbNotify(); return true;
    }
    if (item.kind === 'motion-toggle') {          /* V52: PS3 Original (firmware curve) <-> XMB5 Smooth */
      xmbHome.motion = xmbHome.motion === 'smooth' ? 'ps3' : 'smooth';
      xmbPrefSave('motion', xmbHome.motion);
      var mtTop = xmbHome.webStack[xmbHome.webStack.length - 1];
      if (mtTop) mtTop.entries[mtTop.cursor] = Object.assign({}, item, {value:xmbHome.motion === 'smooth' ? 'XMB5 Smooth' : 'PS3 Original'});
      log('PS5XMB: MOTION ' + xmbHome.motion); xmbPlaySfx('ok'); xmbNotify(); return true;
    }
    if (item.kind === 'wave-month' || item.kind === 'wave-time') {   /* V51: the wave's colour / day-night */
      if (item.kind === 'wave-month') { xmbHome.waveMonth = item.month; xmbPrefSave('waveMonth', item.month); }
      else { xmbHome.waveTime = item.time; xmbPrefSave('waveTime', item.time); }
      log('PS5XMB: WAVE_CHOICE month=' + xmbHome.waveMonth + ' time=' + xmbHome.waveTime + ' -> ' + xmbWaveMonthName());
      xmbWaveMenus(); xmbPlaySfx('ok'); xmbNotify(); return true;
    }
    if (item.kind === 'sound-toggle') {
      xmbHome.soundMode = xmbHome.soundMode === 'ps3' ? 'system' : 'ps3';
      xmbPrefSave('soundMode', xmbHome.soundMode);
      xmbHome.sfxFailed = false;
      log('PS5XMB: SOUND_MODE ' + xmbHome.soundMode);
      xmbNotify(); return true;
    }
    if (typeof xmbHome.onLaunch === 'function' && xmbRoute(item)) {
      xmbPlaySfx('decide');
      xmbFocusEnd();                                 /* the title's music stops when it starts */
      xmbHome.musicHold = true;                      /* V48: and stays off while you are in the title (the XMB stays focused on it) */
      try { xmbHome.onLaunch(); } catch (e) { log('XMB: native launch failed: ' + e); }
    } else {
      xmbPlaySfx('ng');
      xmbHome.infoOpen = true;
      log('PS5XMB: NOT_AVAILABLE_YET ' + item.name);
      xmbNotify();
    }
    return true;
  }
  /* Returning false suppresses the stock move. Events are native ShellUI
   * focus events; this DOES NOT depend on browser Gamepad APIs. */
  /* V44: the PS5 loads a user's picture through its own "profilecache:" URIs. The stock Home draws the signed-in user's picture (top bar,
   * hidden behind the XMB): the first such URI it builds is kept (FACE_URI in the log) and re-used for every user of the Users category. */
  function xmbSniffFace(props) {
    if (xmbHome.faceUri || (xmbHome.faceScans = (xmbHome.faceScans || 0) + 1) > 40000) return;
    var src = props.source, u = src && typeof src === 'object' && !Array.isArray(src) ? src.uri : null;
    if (typeof u !== 'string') u = typeof props.uri === 'string' ? props.uri : typeof props.imageUri === 'string' ? props.imageUri : null;
    if (!u || u.indexOf('profilecache:') !== 0) return;
    xmbHome.faceUri = u;
    log('PS5XMB: FACE_URI ' + u.slice(0, 200));
    xmbNote('users: the PS5 draws the signed-in user picture with ' + u.slice(0, 300));
    if (xmbUsersCache.list) { xmbUsersCache.raw = null; xmbUsersFetch(true); }
  }
  /* V47: one line into the status file the user can send (/user/data/XMB5/PS5XMB_music_status.txt) */
  function xmbNote(text) {
    if (typeof globalThis.fetch !== 'function') return;
    try { globalThis.fetch('http://127.0.0.1:4444/xmb-music?op=note&text=' + encodeURIComponent(String(text).slice(0, 800)), {method:'POST'}).catch(function () {}); } catch (e) {}
  }
  /* V61: the PS5's own picture links first - the stock Home's (FACE_URI) for this user, then the other profilecache: forms - then the
   * ELF's copy and the file itself. (V44-V60 tried the ELF's copy first: it opened as a broken picture without an error, so the
   * working links were never reached.) The renderer moves on after 3 s without a picture, and shows one only once it has loaded. */
  function xmbFaceUris(uid, pic) {
    var hex = '0x' + ('00000000' + (uid >>> 0).toString(16)).slice(-8), out = [];
    /* V77: the ELF's copy first - it now comes from the payload's copy of the profile cache (the profilecache: links never showed) */
    if (pic) out.push(pic);
    var f = xmbHome.faceUri;
    if (f) {
      var m = /(userid(?:=|%3d))(0x[0-9a-f]+|\d+)/i.exec(f);
      if (m) out.push(f.slice(0, m.index) + m[1] + (/^0x/i.test(m[2]) ? hex : String(uid >>> 0)) + f.slice(m.index + m[0].length));
    }
    ['l', 'm', 's', ''].forEach(function (sz) { out.push('profilecache:image/face/' + sz + '?userId=' + hex); });
    out.push('profilecache:image/face/?userId=' + (uid >>> 0));
    if (pic) out.push(pic);
    out.push('file:///system_data/priv/cache/profile/' + hex + '/avatar.png');
    return out.filter(function (v, k) { return out.indexOf(v) === k; });
  }
  /* V64: every other button the Home listens to (R1 / L1 switch Games <-> Media and made the XMB blink, OPTIONS opened the Home's
   * tile menu, Square, R2 / L2 ...) does nothing while the XMB is on screen. The arrows, Circle and Triangle are the XMB's (below); X
   * goes through onPress / onItemPress and is never touched here. */
  var XMB_KEY_OWN = /^on(Left|Right|Up|Down|Back|Triangle)KeyDown$/, XMB_KEY_ANY = /^on[A-Z][A-Za-z0-9]*Key(Down|Up|Press)$/, XMB_KEY_KEEP = /Cross|Enter|Select|Decide|Ok[A-Z]/;
  var xmbKeyBlockedLog = {};
  function xmbBlockKeys(props) {
    /* V65: the arrows / Circle / Triangle are the XMB's only on the focusable views it wraps below; on every other view (the Home's
     * containers: a parent's Circle handler played the PS5 cancel sound under the XMB's) they are blocked like the other buttons */
    var own = props.focusable === true && typeof props.name === 'string';
    for (var name in props) {
      if (!XMB_KEY_ANY.test(name) || (own && XMB_KEY_OWN.test(name)) || XMB_KEY_KEEP.test(name)) continue;
      var prev = props[name];
      if (typeof prev !== 'function' || prev.__xmb) continue;
      (function (name, prev) {
        var h = function (e) {
          if (!xmbEnabled()) return prev.apply(this, arguments);
          take(e);
          if (!xmbKeyBlockedLog[name]) { xmbKeyBlockedLog[name] = true; log('PS5XMB: KEY_BLOCKED ' + name); }
          return false;
        };
        h.__xmb = true;
        props[name] = h;
      })(name, prev);
    }
  }
  /* V64: the Home's own system sounds (its psfx_cancel on Circle under the XMB's PS3 cancel, psfx_change_space ...) are silent while
   * the XMB is on screen; the XMB's own fallback (xmbSystemSound) still plays */
  /* V65: the same for the native sound modules the Home may call directly (NativeModules.*Sound*: every function of them) */
  function xmbMuteNativeSounds() {
    var nm = T.rn && T.rn.NativeModules, done = [];
    if (!nm) return;
    Object.keys(nm).forEach(function (mod) {
      if (!/sound|sfx|audio/i.test(mod) || /music|bgm|video|voice|mic/i.test(mod)) return;
      var m = nm[mod];
      if (!m || typeof m !== 'object') return;
      Object.keys(m).forEach(function (fnName) {
        var f = m[fnName];
        if (typeof f !== 'function' || f.__xmb || !/play|start|beep|sound|se$/i.test(fnName)) return;
        var w = function () {
          if (xmbEnabled() && !xmbHome.ownSysSound) {
            if ((xmbHome.mutedSysSounds = (xmbHome.mutedSysSounds || 0) + 1) <= 8) log('PS5XMB: HOME_SOUND_MUTED ' + mod + '.' + fnName + ' ' + String(arguments[0]));
            return undefined;
          }
          return f.apply(this, arguments);
        };
        w.__xmb = true;
        try { m[fnName] = w; } catch (e) {}
        if (m[fnName] === w) done.push(mod + '.' + fnName);
      });
    });
    log('PS5XMB: HOME_NATIVE_SOUNDS ' + (done.length ? done.join(',') : 'none found') + ' (modules: ' + Object.keys(nm).filter(function (k) { return /sound|sfx|audio/i.test(k); }).join(',') + ')');
  }
  /* V65: Circle may also reach the Home through React Native's BackHandler (not a view's onBackKeyDown): while the XMB is on screen
   * the XMB's listener (added last, so asked first) takes it */
  function xmbBackHandler() {
    var BH = T.rn && T.rn.BackHandler;
    if (!BH || typeof BH.addEventListener !== 'function') { if (!xmbHome.bhLogged) { xmbHome.bhLogged = true; log('PS5XMB: BACK_HANDLER none'); } return; }
    try { if (xmbHome.bhSub && typeof xmbHome.bhSub.remove === 'function') xmbHome.bhSub.remove(); } catch (e) {}
    xmbHome.bhSub = BH.addEventListener('hardwareBackPress', function () {
      if (!xmbEnabled()) return false;
      if ((xmbHome.bhHits = (xmbHome.bhHits || 0) + 1) <= 3) log('PS5XMB: BACK_HANDLER took Circle');
      return true;
    });
    if (!xmbHome.bhLogged) { xmbHome.bhLogged = true; log('PS5XMB: BACK_HANDLER added'); }
  }
  function xmbMuteSystemSounds() {
    try { xmbMuteNativeSounds(); } catch (e) { log('PS5XMB: HOME_NATIVE_SOUNDS ' + e); }
    var snd = T.rn && T.rn.SystemSoundPS;
    if (!snd || typeof snd.playByID !== 'function' || snd.playByID.__xmb) return;
    var orig = snd.playByID;
    var w = function (id) {
      if (xmbEnabled() && !xmbHome.ownSysSound) {
        if ((xmbHome.mutedSysSounds = (xmbHome.mutedSysSounds || 0) + 1) <= 8) log('PS5XMB: HOME_SOUND_MUTED ' + String(id));
        return undefined;
      }
      return orig.apply(this, arguments);
    };
    w.__xmb = true;
    try { snd.playByID = w; } catch (e) {}
    if (snd.playByID !== w) { try { Object.defineProperty(snd, 'playByID', {configurable:true, enumerable:true, get:function(){return w;}}); } catch (e) {} }
    log('PS5XMB: HOME_SOUNDS ' + (snd.playByID === w ? 'muted while the XMB is on screen' : 'NOT replaceable'));
  }
  /* V64: the PS5 focus frame is hidden only while the XMB is on screen (the ELF also needs the Home to have the focus): the frame of
   * Settings and the other system apps stays */
  function xmbFocusFrameSync() {
    /* V66: the PS button's menu shares the Home's focus layer (TopMenu, V65 log) but makes the Home 'inactive' (AppState): the frame
     * comes back for it, and goes again when the Home is active (AppState 'active' or an XMB key) */
    var on = !!(xmbHome.active && xmbHome.visible) && !/background|inactive/i.test(String(xmbHome.appState || 'active'));
    if (xmbHome.frameSent === on || !xmbSfxConsole()) return;
    xmbHome.frameSent = on;
    try { console.log('THEME-XMBFOCUS ' + (on ? '1' : '0')); log('PS5XMB: FOCUS_FRAME ' + (on ? 'hidden in the Home' : 'shown')); } catch (e) {}
  }
  /* V66: the other apps (game hub ...) of this console: their system sounds are logged while the XMB theme is on, to find who plays
   * the PS5 cancel sound under the XMB's PS3 one */
  function xmbSoundSpy() {
    var snd = T.rn && T.rn.SystemSoundPS;
    if (!snd || typeof snd.playByID !== 'function' || snd.playByID.__xmbSpy) return;
    T.xmbSpy = true;
    var orig = snd.playByID, n = 0;
    var w = function (id) { if (++n <= 20) log('PS5XMB: SOUND_IN_' + String(APP).toUpperCase() + ' ' + String(id)); return orig.apply(this, arguments); };
    w.__xmbSpy = true;
    try { snd.playByID = w; } catch (e) {}
    log('PS5XMB: SOUND_SPY ' + APP + ' ' + (snd.playByID === w ? 'on' : 'not replaceable'));
  }
  function xmbCapture(type, props) {
    if (!props || typeof props !== 'object') return;
    xmbBlockKeys(props);
    /* V67: the PS5 cancel sound under the PS3 one is the native view's own key sound (V66 log: the Home's views carry
     * soundEffectsEnabled / cursorEndSFXEnabledDirection; no script plays it). Every focusable view of the Home is silent while the XMB
     * is on screen; the stock Home renders them again with its own values once it is back. */
    if (xmbHome.visible) {
      if (props.focusable === true || 'soundEffectsEnabled' in props) props.soundEffectsEnabled = false;
      if (Array.isArray(props.cursorEndSFXEnabledDirection) && props.cursorEndSFXEnabledDirection.length) props.cursorEndSFXEnabledDirection = [];
    }
    if (!xmbHome.soundsHooked && T.rn && T.rn.SystemSoundPS) { xmbHome.soundsHooked = true; xmbMuteSystemSounds(); }
    if (!xmbHome.faceUri) { try { xmbSniffFace(props); } catch (e) {} }
    if (props.focusable === true && typeof props.name === 'string') {
      if (++xmbHome.captureCount <= 5) log('PS5XMB: PASSIVE_CONTROL_WRAPPED name=' + props.name);
      [ ['onLeftKeyDown', 'left'], ['onRightKeyDown', 'right'],
        ['onUpKeyDown', 'up'], ['onDownKeyDown', 'down'] ].forEach(function (pair) {
        var key = pair[0], dir = pair[1], prev = props[key];
        if (prev && prev.__xmb) return;
        var handler = function (e) {
          if (!xmbEnabled()) return typeof prev === 'function' ? prev.apply(this, arguments) : true;
          take(e);
          if (xmbShouldNavigate(e, dir)) xmbMove(dir);
          return false;
        };
        handler.__xmb = true; props[key] = handler;
      });
      var prevBack = props.onBackKeyDown;
      if (!prevBack || !prevBack.__xmb) {
        var back = function (e) {
          if (!xmbEnabled()) return typeof prevBack === 'function' ? prevBack.apply(this, arguments) : true;
          if ((xmbHome.backLogs = (xmbHome.backLogs || 0) + 1) <= 4) log('PS5XMB: CIRCLE ' + String(e && e.keyEventType) + ' on ' + String(props.name) + ' (muted so far ' + (xmbHome.mutedSysSounds || 0) + ')');
          take(e);
          if (pressed(e)) xmbBack();
          return false;
        };
        back.__xmb = true; props.onBackKeyDown = back;
      }
      var prevTriangle = props.onTriangleKeyDown;
      if (!prevTriangle || !prevTriangle.__xmb) {
        var triangle = function (e) {
          if (!xmbEnabled()) return typeof prevTriangle === 'function' ? prevTriangle.apply(this, arguments) : true;
          take(e);
          if (pressed(e)) xmbTriangle();
          return false;
        };
        triangle.__xmb = true; props.onTriangleKeyDown = triangle;
      }
      var prevPress = props.onPress;
      if (typeof prevPress === 'function' && !prevPress.__xmb) {
        var press = function (e) {
          if (!xmbEnabled()) return prevPress.apply(this, arguments);
          take(e); xmbSelect(); return false;
        };
        press.__xmb = true; props.onPress = press;
      }
    }
    /* XMB5 proves Home tiles create their X callback through
       onItemPress(experience, ...). Hook that factory, not only onPress. */
    if (props.experience && typeof props.onItemPress === 'function' && !props.onItemPress.__xmb) {
      var original = props.onItemPress;
      var factory = function () {
        if (xmbEnabled()) return function () { return xmbSelect(); };
        return original.apply(this, arguments);
      };
      factory.__xmb = true; props.onItemPress = factory;
    }
  }
  /* V34 wave background ---------------------------------------------------------------------------- */
  /* xmb-web's wave, rendered from its own WebGL shader (day and night palette) into two H.264 loops that the ELF installs into the
   * theme's wallpapers folder; XMB5's video server hands them to HomeUI's native video view. The colours behind the video are the
   * mean colour of its first frame, so nothing flashes while the player starts. */
  var XMB_WAVE_BACKDROP = {day:'#6d2422', night:'#391514'};
  function xmbWaveIsNight() {
    if (xmbHome.waveTime === 'day') return false;      /* V51: Theme Settings > Day/Night */
    if (xmbHome.waveTime === 'night') return true;
    /* V52: the PS3's own switch times (lines.qrc BACKGROUND.mnu): night -> day blends 00:00-05:10, day -> night 18:30-20:20; with one
     * day and one night loop the change happens half-way through each blend: day from 02:35, night from 19:25 */
    var d = new Date(), h = d.getHours() + d.getMinutes() / 60; return h < 2.583 || h >= 19.415;
  }
  /* V49: the PS3's wave for THIS month (day or night), rendered in full 1080p: XMB5_Wave_<01-12>_<Day|Night>.mp4 in
   * /user/data/XMB5/xmbwaves (made with the XMB5 wave kit). Checked once per name; until a file is known to be there (or when it is
   * missing) the built-in loop plays. */
  var xmbWaveHave = {};
  function xmbWaveMonthName() {
    var m = xmbHome.waveMonth || (new Date().getMonth() + 1);   /* V51: Theme Settings > Colour (0 = Original = this month) */
    return 'XMB5_Wave_' + (m < 10 ? '0' : '') + m + '_' + (xmbWaveIsNight() ? 'Night' : 'Day') + '.mp4';
  }
  /* V56: is this video on the PS5 (video server 4445)? true / false / undefined while asking; a missing one is asked again after 60 s */
  function xmbWaveProbe(want) {
    if (xmbWaveHave[want] === undefined && typeof globalThis.fetch === 'function') {
      xmbWaveHave[want] = 'checking';
      try {
        globalThis.fetch('http://127.0.0.1:4445/v/' + want, {method:'GET', headers:{Range:'bytes=0-0'}})
          .then(function (r) {
            var ok = !!r && (r.status === 200 || r.status === 206);
            xmbWaveHave[want] = ok;
            log('PS5XMB: WAVE_MONTH ' + want + (ok ? ' found' : ' not found (built-in wave)'));
            if (ok || xmbHome.waveShown) xmbNotify();   /* V68: also a missing one (a wave change waits for the answer) */
            if (!ok && want === XMB_INTRO_NAME) xmbIntroFinish('missing');   /* V57: no intro uploaded -> straight to the XMB */
            if (!ok && typeof setTimeout === 'function') setTimeout(function () { if (xmbWaveHave[want] === false) delete xmbWaveHave[want]; }, 60000);   /* V50: uploaded later -> picked up */
          })
          .catch(function () { xmbWaveHave[want] = false; if (want === XMB_INTRO_NAME) xmbIntroFinish('missing'); });
      } catch (e) { xmbWaveHave[want] = false; }
    }
    return xmbWaveHave[want] === true;
  }
  function xmbWaveName() {
    var want = xmbWaveMonthName();
    if (xmbWaveProbe(want)) return want;
    return xmbWaveIsNight() ? 'PS5XMB_XMBWEB_Wave_Night.mp4' : 'PS5XMB_XMBWEB_Wave_Day.mp4';
  }
  /* V68: changing the wave (Theme Settings > Colour / Day-Night, the day / night switch) no longer flashes the backdrop colour or the
   * built-in red wave. The PS5 has one video player, so the old wave cannot stay while the new one opens; instead:
   *   - while the PS5 is still being asked whether the new file exists, the current wave keeps playing (it never drops to the built-in
   *     loop for a moment);
   *   - the picture fades to black (native, 250 ms), the video is swapped under the black, and the new wave fades in (450 ms) as soon as
   *     it really plays (onPlaying; 1.8 s at the latest). */
  var XMB_WAVE_OUT_MS = 250, XMB_WAVE_IN_MS = 450, XMB_WAVE_WAIT_MS = 1800;
  function xmbWaveTarget() {
    var want = xmbWaveMonthName();
    if (xmbWaveProbe(want)) return want;
    if (xmbWaveHave[want] === 'checking' && xmbHome.waveShown) return xmbHome.waveShown;   /* not known yet: keep what plays */
    return xmbWaveName();
  }
  function xmbWaveCover() {
    var A = T.rn && T.rn.Animated;
    if (!xmbHome.waveCoverV && A && A.Value) xmbHome.waveCoverV = new A.Value(0);
    return xmbHome.waveCoverV || null;
  }
  function xmbWaveCoverTo(to, ms) {
    var v = xmbWaveCover();
    if (!v) return;
    try { v.stopAnimation(); T.rn.Animated.timing(v, {toValue:to, duration:ms, useNativeDriver:true}).start(); }
    catch (e) { try { v.setValue(to); } catch (e2) {} }
  }
  function xmbWaveSwapStart(target) {
    xmbHome.waveSwapTo = target;
    if (xmbHome.waveSwapping) return;               /* already on its way: the latest choice is taken */
    xmbHome.waveSwapping = 'out';
    log('PS5XMB: WAVE_SWAP ' + xmbHome.waveShown + ' -> ' + target);
    if (!xmbWaveCover() || typeof setTimeout !== 'function') { xmbHome.waveShown = target; xmbHome.waveSwapping = null; return; }
    xmbWaveCoverTo(1, XMB_WAVE_OUT_MS);
    setTimeout(function () {
      xmbHome.waveShown = xmbHome.waveSwapTo;
      xmbHome.waveSwapping = 'in';
      xmbNotify();                                  /* the new video under the black */
      xmbHome.waveSwapTimer = setTimeout(function () { xmbWavePlaying('late'); }, XMB_WAVE_WAIT_MS);
    }, XMB_WAVE_OUT_MS + 20);
  }
  function xmbWavePlaying(why) {
    if (xmbHome.waveSwapping !== 'in') return;
    if (xmbHome.waveSwapTimer) { clearTimeout(xmbHome.waveSwapTimer); xmbHome.waveSwapTimer = null; }
    xmbHome.waveSwapping = null;
    xmbWaveCoverTo(0, XMB_WAVE_IN_MS);
    if (why) log('PS5XMB: WAVE_SWAP shown (' + why + ')');
    if (xmbHome.waveSwapTo && xmbHome.waveSwapTo !== xmbHome.waveShown) xmbNotify();   /* changed again meanwhile */
  }
  /* V56: the blurred copy of the wave shown while a submenu is open (PS3), or '' when there is none for this wave */
  var XMB_BLUR_SECOND_PLAYER = false;
  function xmbWaveBlurName(waveName) {
    var b = String(waveName).replace(/\.mp4$/, '_Blur.mp4');
    return xmbWaveProbe(b) ? b : '';
  }
  /* V57: XMB5 boot intro. On a fresh load of the XMB (ELF start, /quit, reboot) the PS3-style cold boot plays once: black, the wave
   * streak emerges, the XMB5 mark reveals (xmb-web's firmware-derived coldboot timeline, background kept black, rendered on the PC
   * with the wave kit's RENDER_INTRO.bat to XMB5_Wave_Intro.mp4 and uploaded with the waves to XMB5/xmbwaves). No file = no intro.
   * V58: the PS5 plays ONE video at a time (V57 log: the intro's player never even asked for its file while the wave played), so:
   *   playing   - only the intro video is mounted (no wave video); at 6.4 s (logo gone) it fades to black (native)
   *   revealing - at 7.0 s the intro video is unmounted and the wave video mounted under the black cover; when the wave really plays
   *               (or 1.5 s later) the cover fades out over 2 s - the wave rises out of the black in whatever colour is set, as the
   *               PS3's background comes up - and the menus fade in 1.3 s after that
   * A press skips to the reveal. Settings > PS5 XMB Controls > Boot Animation turns it off (saved). */
  var XMB_INTRO_NAME = 'XMB5_Wave_Intro.mp4', XMB_INTRO_FADE_AT = 6400, XMB_INTRO_VID_FADE = 600, XMB_INTRO_SWAP_AT = 7000,
      XMB_INTRO_REVEAL_MS = 2000, XMB_INTRO_UI_MS = 900, XMB_INTRO_UI_AFTER = 1300, XMB_INTRO_WAVE_WAIT = 1500, XMB_INTRO_NO_START = 3500,
      XMB_INTRO_LIFE = 20000;
  function xmbIntroValues() {
    var A = T.rn && T.rn.Animated;
    if (!xmbHome.introOp && A && A.Value) { xmbHome.introOp = new A.Value(1); xmbHome.introVidOp = new A.Value(1); xmbHome.uiOp = new A.Value(0); }
    return !!xmbHome.introOp;
  }
  function xmbIntroAnim(v, to, ms, delay) {
    try { v.stopAnimation(); T.rn.Animated.timing(v, {toValue:to, duration:ms, delay:delay || 0, useNativeDriver:true}).start(); }
    catch (e) { try { v.setValue(to); } catch (e2) {} }
  }
  function xmbIntroTimer(fn, ms) {
    if (xmbHome.introTimer) clearTimeout(xmbHome.introTimer);
    xmbHome.introTimer = typeof setTimeout === 'function' ? setTimeout(function () { xmbHome.introTimer = null; fn(); }, ms) : null;
  }
  function xmbIntroStart() {
    if (xmbHome.introState) return;
    if (xmbHome.bootIntro === 'off' || !xmbIntroValues()) { xmbHome.introState = 'done'; return; }
    xmbHome.introState = 'playing'; xmbHome.introT0 = Date.now(); xmbHome.introPlayAt = 0; xmbHome.introWaveUp = false; xmbHome.introFast = false;
    xmbFocusEnd(); /* V82: stop any title soundtrack requested before the video begins */
    xmbWaveProbe(XMB_INTRO_NAME);   /* is XMB5_Wave_Intro.mp4 uploaded? (no -> finished at once) */
    if (!xmbHome.prefsAsked) { xmbHome.prefsAsked = true; xmbPrefsLoad(); }   /* V59: Boot Animation Off is known as early as possible */
    xmbIntroAnim(xmbHome.introVidOp, 0, XMB_INTRO_VID_FADE, XMB_INTRO_FADE_AT);
    /* if the intro video never starts, the wave comes anyway */
    xmbIntroTimer(function () { xmbIntroSwap('intro video did not start'); }, XMB_INTRO_NO_START);
    log('PS5XMB: BOOT_INTRO start');
  }
  /* the intro video really started (it can take a moment to open): its fade and the swap are timed from here */
  function xmbIntroPlaying() {
    if (xmbHome.introState !== 'playing' || xmbHome.introPlayAt) return;
    xmbHome.introPlayAt = Date.now();
    log('PS5XMB: BOOT_INTRO playing (+' + (xmbHome.introPlayAt - xmbHome.introT0) + ' ms)');
    xmbIntroAnim(xmbHome.introVidOp, 0, XMB_INTRO_VID_FADE, XMB_INTRO_FADE_AT);
    xmbIntroTimer(function () { xmbIntroSwap('time'); }, XMB_INTRO_SWAP_AT);
  }
  /* intro video off, wave video on (under the black cover) */
  function xmbIntroSwap(why) {
    if (xmbHome.introState !== 'playing') return;
    xmbHome.introState = 'revealing'; xmbHome.introSwapAt = Date.now();
    log('PS5XMB: BOOT_INTRO swap to the wave (' + why + ')');
    xmbIntroTimer(function () { xmbIntroWaveUp('no play event'); }, XMB_INTRO_WAVE_WAIT);
    xmbNotify();
  }
  /* the wave video plays: it rises out of the black, then the menus fade in */
  function xmbIntroWaveUp(why) {
    if (xmbHome.introState !== 'revealing' || xmbHome.introWaveUp) return;
    if (!xmbHome.active) {   /* V59: the XMB is not ready yet (or was given up: then the intro ends too) */
      if (!xmbHome.visible || /^DISABLED_/.test(String(xmbHome.stage || ''))) { xmbIntroFinish('xmb off'); return; }
      xmbIntroTimer(function () { xmbIntroWaveUp(why); }, 400); return;
    }
    xmbHome.introWaveUp = true;
    var fast = !!xmbHome.introFast, ms = fast ? 700 : XMB_INTRO_REVEAL_MS;
    log('PS5XMB: BOOT_INTRO wave up (' + (why || 'playing') + ')');
    xmbIntroAnim(xmbHome.introOp, 0, ms, 0);
    xmbIntroAnim(xmbHome.uiOp, 1, fast ? 500 : XMB_INTRO_UI_MS, fast ? 200 : XMB_INTRO_UI_AFTER);
    xmbIntroTimer(function () { xmbIntroFinish('shown'); }, ms + (fast ? 800 : XMB_INTRO_UI_AFTER + XMB_INTRO_UI_MS) + 200);
  }
  var XMB_INTRO_SKIPPABLE = false;
  function xmbIntroSkip() {
    var st = xmbHome.introState;
    if (st !== 'playing' && st !== 'revealing') return false;
    /* V83: the menu is already revealed; don't block keys through the trailing fade. */
    if (st === 'revealing' && xmbHome.introWaveUp) return false;
    /* V79: the boot video plays to its end: a key during it (even a scroll) is ignored, it no longer skips it */
    if (!XMB_INTRO_SKIPPABLE) { if (!xmbHome.introKeyLogged) { xmbHome.introKeyLogged = true; log('PS5XMB: BOOT_INTRO key ignored'); } return true; }
    xmbHome.introFast = true;
    log('PS5XMB: BOOT_INTRO skipped');
    if (st === 'playing') { xmbIntroAnim(xmbHome.introVidOp, 0, 150, 0); xmbIntroSwap('skip'); }
    else if (xmbHome.introWaveUp) xmbIntroFinish('skip');
    return true;
  }
  function xmbIntroFinish(why) {
    if (!xmbHome.introState || xmbHome.introState === 'done') return;
    xmbHome.introState = 'done';
    if (xmbHome.introTimer) { clearTimeout(xmbHome.introTimer); xmbHome.introTimer = null; }
    if (xmbHome.dwellAfterIntro && typeof setTimeout==='function') {
      var postIntro=xmbHome.dwellAfterIntro;
      xmbHome.dwellAfterIntro=null;
      setTimeout(function(){ if (xmbHome.active && xmbSelected()===postIntro) xmbFocusDwell(postIntro); },600);
    }
    try { xmbHome.introOp.stopAnimation(); xmbHome.introOp.setValue(0); xmbHome.uiOp.stopAnimation(); xmbHome.uiOp.setValue(1); } catch (e) {}
    log('PS5XMB: BOOT_INTRO done (' + why + ')');
    xmbNotify();
  }
  /* is the intro (or its black cover) still on screen? A render long after the start removes it even if every timer is late. */
  function xmbIntroOn() {
    var st = xmbHome.introState;
    if (st !== 'playing' && st !== 'revealing') return false;
    var quiet = function () {   /* inside a render: no notify */
      xmbHome.introState = 'done'; try { xmbHome.introOp.stopAnimation(); xmbHome.introOp.setValue(0); xmbHome.uiOp.stopAnimation(); xmbHome.uiOp.setValue(1); } catch (e) {}
    };
    if (st === 'playing' && xmbWaveHave[XMB_INTRO_NAME] === false) { quiet(); return false; }   /* not uploaded */
    if (Date.now() - (xmbHome.introT0 || 0) > XMB_INTRO_LIFE) { quiet(); return false; }
    return true;
  }
  /* V59: the boot cover - from the FIRST frame the XMB draws (before its layout check and activation) the screen is black with the
   * intro playing in it, so nothing of the PS5 Home or of the half-ready XMB is ever seen. Without an intro (off / not uploaded) it is
   * plain black until the XMB is active. */
  function xmbBootCover(el, rn) {
    var on = xmbIntroOn();
    if (!on && xmbHome.active) return null;
    var vid = on && xmbHome.introState === 'playing' && xmbWaveProbe(XMB_INTRO_NAME) && typeof VideoWallpaper === 'function';
    var A = rn.Animated && rn.Animated.View ? rn.Animated.View : rn.View;
    return el(A, {key:'xmb-intro', pointerEvents:'none', style:{position:'absolute',left:0,top:0,width:1920,height:1080,opacity:on ? xmbHome.introOp : 1}},
      el(rn.View, {key:'xmb-intro-black', style:{position:'absolute',left:0,top:0,width:1920,height:1080,backgroundColor:'#000000'}}),
      vid ? el(A, {key:'xmb-intro-vbox', pointerEvents:'none', style:{position:'absolute',left:0,top:0,width:1920,height:1080,opacity:xmbHome.introVidOp}},
        el(VideoWallpaper, {key:'xmb-intro-video', uri:'http://127.0.0.1:4445/v/' + XMB_INTRO_NAME, sound:true, suppressBgm:true, onPlaying:xmbIntroPlaying})) : null);
  }
  /* the wave video may play: not while the intro video has the PS5's one video player */
  function xmbIntroHoldsVideo() { return xmbHome.introState === 'playing' && xmbIntroOn(); }
  function xmbWaveBackdrop() { return xmbWaveIsNight() ? XMB_WAVE_BACKDROP.night : XMB_WAVE_BACKDROP.day; }
  /* V33 renderer glue ------------------------------------------------------------------------------ */
  /* glow: 'copies' = halo drawn as text copies (the PS5 engine ignores textShadow); 'native' = textShadow.
   * gameArt: per-game full-screen artwork behind the XMB (not part of xmb-web; off by default). */
  var XMB_NATIVE_OPTS = {glow:'copies', gameArt:false};
  var xmbNativeInstance = null, xmbNativeFailed = false;
  /* Focus dwell on a game / app of the Game category (the renderer swaps the wave for the title's picture): play the title's own music
   * (snd0 from the app database) through the same SceneControl.setSystemBgm the stock Home uses; stop it when the cursor moves on. */
  function xmbBgmPlay(obj) {
    var sc = xmbHome.bgmScene, fn = xmbHome.bgmOriginal;
    if (!sc || typeof fn !== 'function') { if (!xmbHome.bgmMissLogged) { xmbHome.bgmMissLogged = true; log('PS5XMB: FOCUS_BGM_UNAVAILABLE'); } return; }
    try { fn.call(sc, obj); if ((xmbHome.fbLogs = (xmbHome.fbLogs || 0) + 1) <= 12) log('PS5XMB: FOCUS_BGM ' + (obj ? JSON.stringify(obj).slice(0, 200) : 'stop')); }
    catch (e) { log('PS5XMB: FOCUS_BGM_ERROR ' + String(e)); }
  }
  /* V39 game music. What went wrong in V38: the wave video holds the system music down (suppressBgm) and was released in the SAME moment the
   * title's music was requested, so the system went back to the music it had before (the PS5 Home music when that setting is on) and the
   * request was lost. Now: release first, ask ~0.35 s later. The request is the stock Home's own object for that title when it was seen
   * (STOCK_BGM in the log), else one shaped like the stock ones, else {src, type:'AppSnd0'}. */
  var XMB_BGM_AFTER_RELEASE_MS = 350;
  function xmbBgmObject(id, src) {
    var seen = xmbHome.stockBgm && xmbHome.stockBgm[id];
    if (seen) return seen;
    var shape = xmbHome.stockBgmShape, o = {src:src, type:'AppSnd0'};
    if (shape && typeof shape === 'object') {
      o = {};
      Object.keys(shape).forEach(function (k) { o[k] = shape[k]; });
      var key = shape.src !== undefined ? 'src' : shape.uri !== undefined ? 'uri' : shape.path !== undefined ? 'path' : 'src';
      var was = String(shape[key] || '');
      o[key] = /^file:\/\//.test(was) && !/^file:\/\//.test(src) ? 'file://' + src : src;
    }
    return o;
  }
  /* V40: the XMB plays the title's music itself (snd0.at9 decoded by the ELF with the system's AT9 decoder, mixed into the XMB audio port).
   * The system music player is only the fallback (decoder unavailable / not ATRAC9): with it the PS5 Home music kept coming instead. */
  function xmbMusicNative(id, raw, token, fallback) {
    if (xmbIntroBusy() || xmbHome.exitPending) return;
    var req = typeof globalThis.fetch === 'function' ? globalThis.fetch : null;
    if (!req) { fallback(); return; }
    var c = [], db = String(raw.snd || '').replace(/^file:\/\//, '');
    if (db) c.push(db);
    if (/^[A-Z]{4}\d{5}$/.test(id)) { c.push('/user/app/' + id + '/sce_sys/snd0.at9'); c.push('/user/appmeta/' + id + '/snd0.at9'); }
    if (!c.length) return;
    try {
      req('http://127.0.0.1:4444/xmb-music?op=play&vol=' + xmbHome.musicVol + '&paths=' + encodeURIComponent(c.join('|')), {method:'POST'})
        .then(function (r) {
          var st = r ? r.status : 0;
          if (xmbIntroBusy() || xmbHome.exitPending) { xmbMusicStop(); return; }
          if ((xmbHome.fbLogs = (xmbHome.fbLogs || 0) + 1) <= 16) log('PS5XMB: FOCUS_MUSIC_NATIVE ' + id + ' ' + st);
          setTimeout(xmbMusicStatusFetch, 2500);
          if (st === 202) {
            if (token !== xmbHome.fbToken || xmbHome.fbKey !== id) { xmbMusicStop(); return; }
            xmbHome.fbNative = true; return;
          }
          if (st === 404) return;                                /* the title has no music */
          if (token === xmbHome.fbToken && xmbHome.fbKey === id) fallback();
        })
        .catch(function () { if (token === xmbHome.fbToken && xmbHome.fbKey === id) fallback(); });
    } catch (e) { fallback(); }
  }
  function xmbMusicStatusFetch() {
    if (typeof globalThis.fetch !== 'function') return;
    try {
      globalThis.fetch('http://127.0.0.1:4444/xmb-music?op=status', {method:'POST'})
        .then(function (r) { return r && r.ok ? r.text() : ''; })
        .then(function (t) { t = String(t || '').trim(); if (!t || t === xmbHome.musicStatus) return; xmbHome.musicStatus = t; log('PS5XMB: MUSIC_STATUS ' + t); })
        .catch(function () {});
    } catch (e) {}
  }
  function xmbMusicStop() {
    xmbHome.fbNative = false;
    if (typeof globalThis.fetch !== 'function') return;
    try { globalThis.fetch('http://127.0.0.1:4444/xmb-music?op=stop', {method:'POST'}).catch(function () {}); } catch (e) {}
  }
  function xmbIntroBusy() { return xmbHome.introState==='playing' || xmbHome.introState==='revealing'; }
  function xmbFocusDwell(raw) {
    if (!xmbEnabled() || !raw || raw.kind !== 'game') return;
    if (xmbIntroBusy()) { xmbHome.dwellAfterIntro=raw; return; }
    var id = String(raw.id || '');
    if (xmbHome.musicHold) return;               /* V48: a title was started: nothing plays until the XMB is used again */
    if (xmbHome.fbKey === id) return;            /* one dwell per title */
    xmbHome.fbKey = id;
    var token = ++xmbHome.fbToken;
    if (!xmbHome.musicVol) return;               /* Game Music Volume 0 % */
    /* V41: no fallback to the system music request any more: on this firmware it only ever produced the PS5 Home music */
    xmbMusicNative(id, raw, token, function () { if ((xmbHome.fbLogs = (xmbHome.fbLogs || 0) + 1) <= 16) log('PS5XMB: FOCUS_MUSIC_UNAVAILABLE ' + id); });
  }
  function xmbFocusDwellSystem(raw, id, token) {
    var start = function (src) {
      if (token !== xmbHome.fbToken || xmbHome.fbKey !== id) return;
      xmbHome.fbPlaying = true;
      xmbNotify();                               /* 1) the wave video stops holding the system music down */
      setTimeout(function () {                    /* 2) then the title's music is asked for */
        if (token !== xmbHome.fbToken || xmbHome.fbKey !== id) return;
        xmbBgmPlay(xmbBgmObject(id, src));
      }, XMB_BGM_AFTER_RELEASE_MS);
    };
    if (xmbHome.stockBgm && xmbHome.stockBgm[id]) { start(''); return; }
    /* the database value exactly as the stock Home passes it (it carries the timestamp), then the usual locations; the first file that exists plays */
    var c = [], db = String(raw.snd || '').replace(/^file:\/\//, '');
    if (db) c.push(db);
    if (/^[A-Z]{4}\d{5}$/.test(id)) { c.push('/user/app/' + id + '/sce_sys/snd0.at9'); c.push('/user/appmeta/' + id + '/snd0.at9'); }
    var pick = function (i) {
      if (i >= c.length) { if ((xmbHome.fbLogs = (xmbHome.fbLogs || 0) + 1) <= 12) log('PS5XMB: FOCUS_BGM_NONE ' + id); return; }
      xmbArtCheck(c[i], function (r) {
        if (token !== xmbHome.fbToken || xmbHome.fbKey !== id) return;
        if (r === 'missing') { pick(i + 1); return; }
        if (xmbHome.fbLogs < 12 && c[i] !== db) log('PS5XMB: FOCUS_BGM_GUESS ' + id);
        start(c[i]);
      });
    };
    pick(0);
  }
  function xmbFocusEnd() {
    xmbHome.fbToken++; xmbHome.fbKey = '';
    if (xmbHome.fbNative) xmbMusicStop();
    if (!xmbHome.fbPlaying) return;
    xmbHome.fbPlaying = false;
    /* 1) the wave video holds the system music down again. Called from inside the renderer's step handling: rendered on the next turn */
    if (typeof setTimeout === 'function' && globalThis.__ps5xmbHarness !== true) setTimeout(xmbNotify, 0); else xmbNotify();
    var token = xmbHome.fbToken;
    setTimeout(function () {                      /* 2) then the title's music is replaced by the (held down) default */
      if (token === xmbHome.fbToken && !xmbHome.fbPlaying) xmbBgmPlay(null);
    }, XMB_BGM_AFTER_RELEASE_MS);
  }
  function xmbNative() {
    if (xmbNativeInstance || xmbNativeFailed) return xmbNativeInstance;
    var React=T.React, rn=T.rn, A=rn&&rn.Animated;
    if (!React || !rn || !rn.View || !rn.Text || !rn.Image || !A || !A.Value || !A.View || !A.timing) return null;
    try {
      var probe=new A.Value(0);
      if (typeof probe.interpolate!=='function') throw new Error('Animated.Value.interpolate missing');
      xmbNativeInstance = ztXmbNative.create({React:React, rn:rn, log:function(m){log('PS5XMB: '+m);},
        fontSize:fontSize, glow:XMB_NATIVE_OPTS.glow, noPulse:!(A.loop&&A.sequence),
        assetUri:function(name){return 'file://'+ZT_ASSETS+'XMBUI/'+name+'.png';},
        onLayout:function(kind,e){xmbLayout(kind,e);}, playedLabel:xmbPlayedLabel, badge:xmbBadge, onDwell:xmbFocusDwell, onDwellEnd:xmbFocusEnd, artCheck:xmbArtCheck, glowFor:xmbGlowFor, iconLevels:xmbIconLevels});
      log('PS5XMB: V33_XMBWEB_EXACT_RENDERER_READY');
    } catch (e) { xmbNativeFailed = true; log('PS5XMB: V33_RENDERER_FAILED '+String(e)); }
    return xmbNativeInstance;
  }
  var xmbNativeCats = null;
  function xmbNativeModel() {
    if (!xmbNativeCats) xmbNativeCats = XMB_WEB_NATIVE_CATEGORIES.map(function(c,ci){
      return {id:c.id,name:c.name,asset:c.asset,getItems:function(){return xmbCategoryItems(ci);}};
    });
    return {speed:100/xmbHome.animSpeed, motion:xmbHome.motion, startDelay:xmbHome.startDelay, dwell:Math.round(1000*xmbHome.bgDelay/100), ci:xmbHome.category, sel:xmbHome.cursor, cats:xmbNativeCats,
      stack:xmbHome.webStack.map(function(f){return {entries:f.entries,cursor:f.cursor,name:f.name};}),
      /* V62: the PS3 Triangle panel and Information screen are drawn by the renderer (it slides the XMB with them) */
      opt:xmbHome.optionsOpen ? [{items:xmbOptionItems(), idx:xmbHome.optionsCursor}].concat(xmbHome.optionsSub ? [{items:xmbSubItems(xmbHome.optionsSub), idx:xmbHome.optionsSub.cursor, at:xmbHome.optionsSub.at}] : []) : [],
      info:xmbHome.infoOpen ? xmbInfoModel() : null};
  }
  /* React hook used by XMB5's own FolderLink component as well. When
   * the selected game changes, the link is prepared on a normal React render. */
  function XmbSelectedLink(props) {
    var open = null;
    try { open = T.useLink ? T.useLink(props.uri) : null; }
    catch (e) { log('PS5XMB: ROUTE_NOT_SUPPORTED ' + props.uri + ' ' + e); }
    xmbHome.onLaunch = typeof open === 'function' ? open : null;
    return null;
  }
  function XmbGameArtwork(props) {
    var React=T.React, rn=T.rn;
    var state=React.useState(0), index=state[0], setIndex=state[1];
    var loadedState=React.useState(false), loaded=loadedState[0], setLoaded=loadedState[1];
    var candidates=props.candidates || [];
    if (!rn || !rn.Image || index >= candidates.length) return null;
    var uri=candidates[index];
    return React.createElement(rn.Image, {
      key:'xmb-game-native-art',pointerEvents:'none',source:{uri:uri},resizeMode:'cover',
      onLoad:function(){setLoaded(true);if(index===0)log('PS5XMB: GAME_BG_IMAGE_LOADED '+props.id);},
      onError:function(){
        if(index < 3)log('PS5XMB: GAME_BG_IMAGE_FALLBACK '+props.id+' #'+index);
        setLoaded(false);setIndex(function(i){return i+1;});
      },
      style:{position:'absolute',left:0,top:0,width:1920,height:1080,
        opacity:loaded?.53:0}
    });
  }
  /* Host-only regression harness; never exposed on a normal PS5 session. */
  if (globalThis.__ps5xmbHarness === true)
    globalThis.__ps5xmbTest = { state: xmbHome, enabled: xmbEnabled, move: xmbMove,
      selected: xmbSelected, items: xmbItems, capture: xmbCapture, select: xmbSelect,
      options: xmbTriangle, back: xmbBack, rowY:xmbRowY, rowMetrics:xmbIconMetrics, designer:XMB_DESIGNER,
      sound:xmbPlaySfx, playedLabel:xmbPlayedLabel, photosApply:xmbPhotosApply, prefsApply:xmbPrefsApply, waveMonthName:xmbWaveMonthName, introOn:xmbIntroOn, introSkip:xmbIntroSkip, introFinish:xmbIntroFinish, sysApply:xmbSysSettingsApply, nativeModel:xmbNativeModel, folderData:xmbFolderKbData, folderCreate:xmbFolderCreate, columnCreate:xmbColumnCreate, columnsApply:xmbColumnsApply, gameCat:function(){return XMB_GAME_CAT;},
      bgmHook:xmbBgmHook, bgmRequest:xmbBgmRequest,
      seedGames:function(rowData,allGames){T.rowData=rowData;T.allGames=allGames;
        xmbGamesCache={row:null,all:null,at:0,items:null};},
      close: function () { xmbDeactivate('TEST'); },
      activateForTest: function () { xmbHome.mounted=true; xmbHome.viewLaidOut=true;
        xmbHome.textLaidOut=true; xmbHome.fullProbe=true;
        xmbHome.fullViewLaidOut=true; xmbHome.fullCatLaidOut=true;
        xmbHome.fullItemLaidOut=true; xmbHome.active=true; xmbNotify(); },
      renderForTest: XmbHomeLayer,
      nativeLayout: xmbLayout, tryActivate: xmbTryActivate, tryCommit: xmbTryCommit };
  /* PS3-like composition on the real PS5 Home: one fixed-focus icon, a clipped
   * vertical ribbon, animated category travel and a restrained clock. We use
   * only native RN Views, Text, Image, and (optionally) Animated nodes. */
  var xmbLayers = [];
  /* the copy mounted last draws; before any copy has mounted (first render of the first copy) that first copy draws */
  function xmbLayerOwner(m) { return !xmbLayers.length || !!(m && m.on && xmbLayers[xmbLayers.length - 1] === m); }
  /* V83.4: PS3 system confirmation. Keep the genuine PS3 controller
   * icons from the bundled particles assets, not Unicode text glyphs. */
  function xmbReturnDialog(el, rn, fade) {
    if (!xmbHome.confirmExit) return null;
    var txt=function(key,content,style){return el(rn.Text,{key:key,style:Object.assign({
      color:'#f1f1f1',fontSize:xmbFontSize(27)},style||{})},content);};
    var msg=xmbHome.exitPending
      ? 'Returning to PS5 Home...'
      : xmbHome.exitError
        ? 'Could not restore PS5 Home.\n' + xmbHome.exitError + '\nPress Circle to cancel or Cross to retry.'
        : 'Are you sure you want to return to PS5 Home?\nXMB5 will be unloaded and the original PS5 Home will be restored.';
    var Wrapper = rn.Animated && rn.Animated.View ? rn.Animated.View : rn.View;
    var prompt = function(key,icon,name) {
      return el(rn.View,{key:key,style:{
          width:360,height:48,flexDirection:'row',alignItems:'center',justifyContent:'center'}},
        rn.Image ? el(rn.Image,{key:'icon',source:{
          uri:'file://'+ZT_ASSETS+'XMBUI/'+icon+'.png'},
          resizeMode:'contain',style:{width:36,height:36,marginRight:14,tintColor:'#f5f5f5'}}) : null,
        txt('label',name,{fontSize:xmbFontSize(24)}));
    };
    return el(Wrapper,{key:'xmb-system-confirm',pointerEvents:'none',style:{
        position:'absolute',left:0,top:0,width:1920,height:1080,
        backgroundColor:'rgba(0,0,0,0.55)',opacity:fade || 1}},
      el(rn.View,{key:'confirm-top-rule',style:{position:'absolute',top:171,left:0,width:1920,height:1,backgroundColor:'rgba(190,190,190,0.65)'}}),
      el(rn.View,{key:'confirm-message-area',style:{
          position:'absolute',left:0,top:172,width:1920,height:583,
          justifyContent:'center',alignItems:'center'}},
        txt('confirm-message',msg,{
          width:1480,textAlign:'center',fontSize:xmbFontSize(28),
          lineHeight:42,includeFontPadding:false})),
      el(rn.View,{key:'confirm-bottom-rule',style:{position:'absolute',top:755,left:0,width:1920,height:1,backgroundColor:'rgba(190,190,190,0.65)'}}),
      el(rn.View,{key:'confirm-prompts',style:{
          position:'absolute',left:0,top:763,width:1920,height:56,
          flexDirection:'row',alignItems:'center',justifyContent:'center'}},
        prompt('confirm-yes','d_ps_cross','Yes'),
        prompt('confirm-cancel','d_ps_circle','Cancel')));
  }
  function XmbHomeLayer() {
    var React = T.React, rn = T.rn;
    if (++xmbHome.renderCalls <= 3)
      log('PS5XMB: COMPONENT_RENDER_ENTER call=' + xmbHome.renderCalls +
          ' React=' + !!React + ' Native=' + !!rn +
          ' View=' + !!(rn && rn.View) + ' Text=' + !!(rn && rn.Text) +
          ' useState=' + !!(React && React.useState) +
          ' useEffect=' + !!(React && React.useEffect));
    if (!React || !rn || !rn.View || !rn.Text ||
        typeof React.useState !== 'function' || typeof React.useEffect !== 'function') return null;
    var state = React.useState(0), update = state[1];
    /* V39: the Home root is mounted 2-3 times (loading screen + real Home: "layer copies"). Every copy used to draw a complete XMB
     * (3 x the rows, 3 x the animations, 2 wave videos decoding at once) and re-render on every D-pad step. Only the copy mounted
     * LAST draws now; the others render nothing. */
    var me = React.useRef(null);
    if (!me.current) me.current = {on:false};
    /* V83.6: faster 220 ms native-driver confirmation fade, using a
     * fifth-order smootherstep easing (zero slope and curvature at the ends).
     * The per-component Animated.Value survives clock-triggered rerenders. */
    var confirmFade = React.useRef(null);
    if (!confirmFade.current && rn.Animated && typeof rn.Animated.Value === 'function')
      confirmFade.current = new rn.Animated.Value(0);
    React.useEffect(function(){
      var a = confirmFade.current;
      if (!a) return;
      if (typeof a.stopAnimation === 'function') a.stopAnimation();
      a.setValue(0);
      if (xmbHome.confirmExit && rn.Animated && typeof rn.Animated.timing === 'function')
        rn.Animated.timing(a,{toValue:1,duration:220,
          easing:function(t){return t*t*t*(t*(t*6-15)+10);},
          useNativeDriver:true}).start();
    },[!!xmbHome.confirmExit]);
    var gameFocus = XMB_NATIVE_OPTS.gameArt && xmbHome.category === XMB_GAME_CAT ? xmbSelected() : null;
    var focusedId = gameFocus && gameFocus.kind === 'game' ? gameFocus.id : '';
    /* V28: avoid decoding a full-screen background image for every item
     * during rapid PS5 native Repeat callbacks. The original artwork
     * appears only after the selected game stays unchanged for 360 ms.
     * Game ICONS and native focus animations are not delayed. */
    var artworkState = React.useState('');
    var stableArtworkId = artworkState[0], setStableArtworkId = artworkState[1];
    React.useEffect(function () {
      if (!XMB_NATIVE_OPTS.gameArt) return undefined;     /* V39: unused (the renderer draws the focus background): no extra render 360 ms after every step */
      if (!focusedId) {
        setStableArtworkId('');
        return;
      }
      var artworkTimer = setTimeout(function () {
        setStableArtworkId(focusedId);
      },360);
      return function () {clearTimeout(artworkTimer);};
    },[focusedId]);
    /* Do NOT call SceneControl.setBackground on each d-pad step. That toggled the fullscreen frame to transparent *before*
       Sony's DDS art arrived, exposing the original PS5 Home for several frames.
       V34: the old 16-frame / 12-frame / 30-strip wave code is gone. The background is xmb-web's own wave rendered from its WebGL
       shader into an H.264 loop (installed by the ELF) and played by the system video view; category / row / submenu motion lives
       in the xmb-web-exact renderer (ztXmbNative). Nothing here animates per D-pad step. */
    React.useEffect(function () {
      var notify = function () { if (xmbLayerOwner(me.current)) update(function (n) { return n + 1; }); };
      var bump = function () { update(function (n) { return n + 1; }); };
      me.current.on = true; me.current.bump = bump;
      xmbLayers.push(me.current);
      xmbLayers.forEach(function (l) { if (l.bump) l.bump(); });     /* every copy re-checks who draws (this one included) */
      xmbHome.mounted = true;
      log('PS5XMB: COMPONENT_EFFECT_MOUNTED copies=' + xmbLayers.length);
      xmbHome.listeners.push(notify);
      xmbTryActivate();
      // Repaint the minute clock and selected game database periodically, not
      // the wave frames (which are animated on the native render thread).
      var timer = setInterval(notify, 20000);
      // V83.20: resync at the next real local minute boundary. This avoids
      // the clock showing the previous minute for up to 20 s after it changes.
      var minuteTimer = null, alive = true;
      function scheduleMinute() {
        if (!alive) return;
        var until = 60000 - (Date.now() % 60000) + 40;
        minuteTimer = setTimeout(function () {
          if (!alive) return;
          notify();
          scheduleMinute();
        }, until);
      }
      scheduleMinute();
      return function () {
        alive = false;
        if (minuteTimer !== null) clearTimeout(minuteTimer);
        var li = xmbLayers.indexOf(me.current);
        if (li >= 0) xmbLayers.splice(li, 1);
        me.current.on = false;
        xmbLayers.forEach(function (l) { if (l.bump) l.bump(); });     /* the next copy takes over drawing */
        log('PS5XMB: COMPONENT_EFFECT_UNMOUNTED copies=' + xmbLayers.length);
        if (xmbLayers.length) { var lj = xmbHome.listeners.indexOf(notify); if (lj >= 0) xmbHome.listeners.splice(lj, 1); clearInterval(timer); return; }
        xmbHome.mounted = false; xmbHome.active = false; xmbFocusFrameSync();
        if (xmbHome.probeTimer) { clearTimeout(xmbHome.probeTimer); xmbHome.probeTimer = null; }
        if (xmbHome.watchdog) { clearTimeout(xmbHome.watchdog); xmbHome.watchdog = null; }
        clearInterval(timer);
        var i = xmbHome.listeners.indexOf(notify);
        if (i >= 0) xmbHome.listeners.splice(i, 1);
        if (!xmbHome.listeners.length) xmbSfxPort(false);
      };
    }, []);
    if (!xmbHome.visible || !THEME.xmbHomeOn) return null;
    if (!xmbLayerOwner(me.current)) return null;
    xmbIntroStart();   /* V59: the intro starts with the very first frame (idempotent) */
    // Keep the v0.7-proven two-surface native layout gate untouched.
    if (!xmbHome.fullProbe) {
      return React.createElement(rn.View, {key:'ps5-xmb-probe-stage', pointerEvents:'none', focusable:false,
        style:{position:'absolute',left:0,top:0,width:1920,height:1080}},
       React.createElement(rn.View, {
        key:'ps5-xmb-probe', pointerEvents:'none', focusable:false,
        onLayout:function(e){xmbLayout('view',e);},
        style:{position:'absolute',left:32,top:140,width:440,minHeight:100,
               padding:18,backgroundColor:'rgba(0,25,65,0.85)',
               borderColor:'#7acbff',borderWidth:1,borderRadius:8}
      }, React.createElement(rn.Text, {
        onLayout:function(e){xmbLayout('text',e);},
        style:{color:'#ffffff',fontSize:xmbFontSize(27),fontWeight:'bold'}
      }, 'PS5 XMB - HomeUI check'),
      React.createElement(rn.Text,{style:{color:'#b9daff',fontSize:xmbFontSize(18)}},
        'Stock Home is preserved until XMB is ready.')),
       xmbBootCover(React.createElement, rn));   /* V59: under the boot cover */
    }
    try {
      var el = React.createElement, category = xmbHome.category, items = xmbItems();
      var index = Math.min(Math.max(0, xmbWebActiveIndex()), items.length - 1);
      var selected = items[index] || null, route = xmbRoute(selected);
      var frame = {position:'absolute',left:0,top:0,width:1920,height:1080,
                   backgroundColor:xmbHome.active ? xmbWaveBackdrop() : 'transparent'};
      var children = [];
      /* V34 background = xmb-web's wave: day / night palette exactly as xmb-web picks it (night before 06:00 and from 18:00). */
      if (xmbHome.active) {
        /* V68: the wave that plays changes only through xmbWaveSwapStart (fade to black, swap, fade in) */
        var waveTarget = xmbWaveTarget();
        if (!xmbHome.waveShown || xmbIntroOn()) xmbHome.waveShown = waveTarget;
        else if (waveTarget !== xmbHome.waveShown && !xmbHome.waveSwapping) xmbWaveSwapStart(waveTarget);
        else if (xmbHome.waveSwapping) xmbHome.waveSwapTo = waveTarget;
        var waveName = xmbHome.waveShown;
        var capPlaying = xmbHome.viewer && selected && selected.kind === 'video';   /* V78: one video at a time: the capture plays instead */
        if (typeof VideoWallpaper === 'function' && !xmbIntroHoldsVideo() && !capPlaying) {
          if (xmbHome.waveLogged !== waveName) { xmbHome.waveLogged = waveName; log('PS5XMB: XMBWEB_WAVE_VIDEO ' + waveName); }
          /* V56: PS3 submenu blur - the blurred copy of the same loop plays on top, faded in by the renderer while a submenu is open.
           * Both videos are (re)started in the same render (the sharp one's key changes when the blurred one is found), so they run in
           * step; without a _Blur file the wave simply stays sharp. */
          /* V58: the PS5 plays ONE video at a time - a second (blurred) player would take the player away from the wave. Off until the
           * blur comes from the same video (XMB_BLUR_SECOND_PLAYER). */
          var blurName = XMB_BLUR_SECOND_PLAYER ? xmbWaveBlurName(waveName) : '', xnb = blurName ? xmbNative() : null, bv = xnb && xnb.blurValue ? xnb.blurValue() : null;
          children.push(el(VideoWallpaper,{key:'xmbweb-wave-'+waveName+(blurName && bv ? '+blur' : ''),uri:'http://127.0.0.1:4445/v/'+waveName,sound:false,suppressBgm:!xmbHome.fbPlaying,
            onPlaying:function () { if (xmbHome.introState === 'revealing') xmbIntroWaveUp('playing'); xmbWavePlaying('playing'); }}));
          if (blurName && bv && rn.Animated && rn.Animated.View && !xmbIntroOn())
            children.push(el(rn.Animated.View,{key:'xmbweb-wave-blur-box',pointerEvents:'none',style:{position:'absolute',left:0,top:0,width:1920,height:1080,opacity:bv}},
              el(VideoWallpaper,{key:'xmbweb-wave-blur-'+blurName,uri:'http://127.0.0.1:4445/v/'+blurName,sound:false,suppressBgm:!xmbHome.fbPlaying})));
        } else if (!xmbHome.waveLogged) { xmbHome.waveLogged = 'missing'; log('PS5XMB: XMBWEB_WAVE_VIDEO_UNAVAILABLE'); }
        /* V68: the black the wave changes through (over the video, under the menus); always mounted, transparent at rest */
        var wcv = xmbWaveCover();
        if (wcv && rn.Animated && rn.Animated.View)
          children.push(el(rn.Animated.View,{key:'xmbweb-wave-cover',pointerEvents:'none',style:{position:'absolute',left:0,top:0,width:1920,height:1080,backgroundColor:'#000000',opacity:wcv}}));
      }
      // Prefer original title metadata (pic0PathWithTs) from app.db, then
      // common installed-metadata PNG/JPEG paths. Sony DDS artwork is handled
      // above by SceneControl rather than being sent into RN Image.
      if (XMB_NATIVE_OPTS.gameArt && xmbHome.active && selected && selected.kind==='game' &&
          selected.id===stableArtworkId &&
          /^[A-Z]{4}\d{5}$/.test(String(selected.id||'')) && rn.Image) {
        var nativeMetadata=(T.allGames && T.allGames[selected.id]) || {};
        var raw=[nativeMetadata.bg,selected.bg,
          '/user/appmeta/'+selected.id+'/pic0.png',
          '/user/appmeta/'+selected.id+'/pic0.jpg',
          '/user/appmeta/'+selected.id+'/pic0.jpeg',
          '/user/appmeta/'+selected.id+'/pic1.png',
          '/user/app/'+selected.id+'/sce_sys/pic1.png',
          '/user/app/'+selected.id+'/sce_sys/pic0.png',
          '/user/appmeta/'+selected.id+'/pic0.dds'];
        var choices=[];
        raw.forEach(function(v){
          if(typeof v!=='string' || !v) return;
          if (!/^(?:file:\/\/|https?:\/\/|\/)/.test(v)) return;
          var uri = v.charAt(0)==='/'?'file://'+v:v;
          if(choices.indexOf(uri)<0) choices.push(uri);
        });
        children.push(el(XmbGameArtwork,{key:'game-art-'+selected.id,
          id:selected.id,candidates:choices}));
      }
      /* V33: the whole XMB (category bar, item columns, submenu transition, descriptions, values, clock)
       * is drawn by the xmb-web-exact renderer. It needs the native Animated driver; without it the stock Home stays. */
      var xn = xmbNative();
      if (!xn) { setTimeout(function(){xmbDeactivate('NO_NATIVE_ANIMATED');},0); return null; }
      /* V57: the XMB in an opacity box (the boot intro fades it in; 1 otherwise) - always the same shape, so it never re-mounts */
      children.push(el(rn.Animated && rn.Animated.View ? rn.Animated.View : rn.View,{key:'xmb-native-box',pointerEvents:'box-none',
        style:{position:'absolute',left:0,top:0,width:1920,height:1080,
          opacity:xmbHome.confirmExit
            ? (confirmFade.current && typeof confirmFade.current.interpolate === 'function'
                ? confirmFade.current.interpolate({inputRange:[0,1],outputRange:[1,0]}) : 0)
            : (xmbHome.uiOp || 1)}},
        el(xn.View,{key:'xmb-native',model:xmbNativeModel(),now:new Date()})));
      if (xmbHome.confirmExit) children.push(xmbReturnDialog(el,rn,confirmFade.current));
      if(xmbHome.active&&route&&T.useLink)
        children.push(el(XmbSelectedLink,{key:'route-'+route,uri:route}));
      /* V62: the Triangle options panel is drawn by the renderer (model.opt) */
      /* V78: a captured video, full screen with its sound (the wave player is stopped meanwhile) */
      if(xmbHome.active&&xmbHome.viewer&&selected&&selected.kind==='video'&&typeof VideoWallpaper==='function'){
        var vvt=xmbHome.webStack[xmbHome.webStack.length-1], vvn=vvt?vvt.entries.length:1;
        if (xmbHome.videoLogged !== selected.vi) { xmbHome.videoLogged = selected.vi; log('PS5XMB: VIDEO_PLAY ' + selected.vi + ' ' + selected.name); }
        children.push(el(rn.View,{key:'video-viewer',pointerEvents:'none',
          style:{position:'absolute',left:0,top:0,width:1920,height:1080,backgroundColor:'#000000'}},
          el(VideoWallpaper,{key:'vv-'+selected.vi,uri:'http://127.0.0.1:4445/c/'+selected.vi+'.'+(selected.ext||'mp4'),sound:true,suppressBgm:true}),
          el(rn.Text,{key:'vv-name',style:{position:'absolute',left:96,top:996,color:'#ffffff',fontSize:xmbFontSize(24),
            textShadowColor:'rgba(0,0,0,.9)',textShadowRadius:6}},
            selected.name+'     '+(index+1)+' / '+vvn+'     \u25C0 \u25B6   \u25CB Back')));
      }
      if(xmbHome.active&&xmbHome.viewer&&selected&&selected.kind==='photo'&&rn.Image){
        var vtop=xmbHome.webStack[xmbHome.webStack.length-1], vcount=vtop?vtop.entries.length:1;
        children.push(el(rn.View,{key:'photo-viewer',pointerEvents:'none',
          style:{position:'absolute',left:0,top:0,width:1920,height:1080,backgroundColor:'#000000'}},
          el(rn.Image,{key:'pv-'+selected.path,source:{uri:'file://'+selected.path},resizeMode:'contain',
            style:{position:'absolute',left:0,top:0,width:1920,height:1080}}),
          el(rn.Text,{key:'pv-name',style:{position:'absolute',left:96,top:996,color:'#ffffff',fontSize:xmbFontSize(24),
            textShadowColor:'rgba(0,0,0,.9)',textShadowRadius:6}},
            selected.name+'     '+(index+1)+' / '+vcount+'     \u25C0 \u25B6   \u25CB Back')));
      }
      /* V62: the Information screen is drawn by the renderer (model.info) */
      /* V69: "Triangle: Options" (PS3 hint), bottom right; always mounted, transparent until xmbHintKick fades it in */
      var hv = xmbHintValue();
      if (hv && rn.Animated && rn.Animated.View && xmbHome.active && !xmbHome.confirmExit)
        children.push(el(rn.Animated.View,{key:'xmb-opt-hint',pointerEvents:'none',style:{position:'absolute',left:1920-96-196,top:1080-84-46,width:196,height:46,
            opacity:hv,flexDirection:'row',alignItems:'center',borderRadius:7,borderWidth:1,
            borderColor:'rgba(150,150,150,0.45)',backgroundColor:'rgba(52,52,52,0.88)',paddingLeft:14}},
          rn.Image ? el(rn.Image,{key:'tri',source:{uri:'file://'+ZT_ASSETS+'XMBUI/xmbweb_triangle_hint.png'},style:{width:30,height:30}}) : null,
          el(rn.Text,{key:'txt',style:{color:'rgb(232,232,232)',fontSize:xmbFontSize(24),marginLeft:8}},': Options')));
      /* V74: Move - the PS5 way: Up / Down, X to finish */
      if (xmbHome.active && xmbHome.moveMode)
        children.push(el(rn.View,{key:'xmb-move-hint',pointerEvents:'none',style:{position:'absolute',left:1920-96-330,top:1080-84-46,width:330,height:46,
            flexDirection:'row',alignItems:'center',justifyContent:'center',borderRadius:7,borderWidth:1,borderColor:'rgba(150,150,150,0.45)',backgroundColor:'rgba(52,52,52,0.88)'}},
          el(rn.Text,{key:'mt',style:{color:'rgb(232,232,232)',fontSize:xmbFontSize(24)}},'\u2191\u2193 Move'),
          /* V77: the cross button (a picture, as the Triangle hint) */
          rn.Image ? el(rn.Image,{key:'x',source:{uri:'file://'+ZT_ASSETS+'XMBUI/xmbweb_cross_hint.png'},style:{width:30,height:30,marginLeft:34}}) : null,
          el(rn.Text,{key:'md',style:{color:'rgb(232,232,232)',fontSize:xmbFontSize(24),marginLeft:8}},rn.Image ? 'Done' : '\u2715 Done')));
      /* V57-V59: the boot cover on top of everything (black + the intro), from the first frame until the wave is up */
      var bootCover = xmbBootCover(el, rn);
      if (bootCover) children.push(bootCover);
      return el(rn.View,{key:'ps5-xmb-home',pointerEvents:'none',focusable:false,
        onLayout:function(e){xmbLayout('full-view',e);},style:frame},children);
    } catch(error){
      log('PS5XMB: render failed '+String(error));
      setTimeout(function(){xmbDeactivate('RENDER_THROW');},0);
      return null;
    }
  }
