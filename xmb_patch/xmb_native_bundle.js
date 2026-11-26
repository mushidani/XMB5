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
