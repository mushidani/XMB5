'use strict';
/*
 * xmb-core: pure layout/animation math for the PS3 XMB, ported from xmb-web (TheGammaSqueeze/xmb-web).
 * No React / React Native / DOM dependency, so it runs (and is unit-tested) in plain node.
 *
 * MODEL
 *   The XMB is a carousel. Everything on screen is a function of two float "positions":
 *     catPos  = which category is focused (float; integer when settled)
 *     itemPos = which item of the current column is focused (float; integer when settled)
 *   For one element, a property is a piecewise-linear function of  e = pos - index.
 *   A "track" {inputRange, outputRange} is exactly what Animated.Value.interpolate() takes, so the
 *   renderer animates ONE Animated.Value per column and each element derives its x/y/scale/opacity
 *   from it on the native thread. Interrupting an animation (held D-pad) just retargets the value.
 *
 *   Settled states reproduce xmb-web's drawXMB()/drawItemList() layout exactly (verified in test/).
 *   Values come from spec.layout (= xmb-web `V`, each tagged there with a firmware vaddr or "measured").
 */

function createCore(spec) {
  const V = Object.assign({}, spec.layout);
  // V53: PS3 4.93 values. List: PhXmList layout 1 (grid table) = rows 80 apart, 305 extra above / 95 extra below the focus: the focused row
  // sits 385 below the row above and 175 above the row below. Confirmed on the RPCS3 recording: focused title centre y 505 (was 515),
  // rows above / below unchanged (120 / 680). Submenu values measured frame by frame on the same recording (see SUB / CAT_SUB).
  V.ITEM_FOCUS_Y = 505; V.ITEM_ACTIVE_PAD = 95;
  V.PARENT_COL_X = V.ITEM_ICON_X - 262;
  const ICON_SCALE = spec.iconScale || {};

  // ---------- easing (xmb-web) ----------
  const ease = {
    // default firmware smoothstep (submenu slide)
    smooth: (t) => (t >= 1 ? 1 : t <= 0 ? 0 : t * t * (3 - 2 * t)),
    // used by xmb-web navCat / navItem
    outCubic: (t) => { if (t >= 1) return 1; if (t <= 0) return 0; const u = 1 - t; return 1 - u * u * u; },
    outQuad: (t) => { if (t >= 1) return 1; if (t <= 0) return 0; const u = 1 - t; return 1 - u * u; },
    linear: (t) => t,
  };

  // ---------- track helpers ----------
  // A track is a list of [x, y] breakpoints; extrapolation is clamped unless `extend` is set.
  function track(points, extend) {
    return { inputRange: points.map((p) => p[0]), outputRange: points.map((p) => p[1]), extrapolate: extend ? 'extend' : 'clamp' };
  }
  // sample a track at x (same semantics as Animated interpolate with clamp/extend)
  function sample(tr, x) {
    const a = tr.inputRange, b = tr.outputRange, n = a.length;
    if (x <= a[0]) return tr.extrapolate === 'extend' && n > 1 ? b[0] + (b[1] - b[0]) * (x - a[0]) / (a[1] - a[0]) : b[0];
    if (x >= a[n - 1]) return tr.extrapolate === 'extend' && n > 1 ? b[n - 1] + (b[n - 1] - b[n - 2]) * (x - a[n - 1]) / (a[n - 1] - a[n - 2]) : b[n - 1];
    let k = 1; while (x > a[k]) k++;
    return b[k - 1] + (b[k] - b[k - 1]) * (x - a[k - 1]) / (a[k] - a[k - 1]);
  }
  // Re-express a function of e = pos - i as a track over pos for element i.
  const forElement = (i, pts, extend) => track(pts.map(([e, v]) => [i + e, v]), extend);

  const iconScale = (id) => ICON_SCALE[id] || 1;

  // ---------- PS3 4.93 originals (decrypted vsh.elf + layout_factor_table_1080.txt) ----------
  // Category bar (PhXmBar 0x3ACDEC / ctor 0x3AEE84, factor table entries 10/11/12 = 200/10/10): categories are 200 apart and the
  // selected one gets 10 extra on each side -> neighbours at 210, then 410, 610 ... (xmb-web used a uniform measured 203).
  const BAR_STEP = 200, BAR_GAP = 10;
  const barPts = (c, sign) => { const pts = []; for (let k = -3; k <= 3; k++) pts.push([c + k, sign * (k === 0 ? 0 : k * BAR_STEP + (k > 0 ? BAR_GAP : -BAR_GAP))]); return pts; };

  // ---------- CATEGORY BAR ----------
  // e = catPos - i  (e>0: category is left of focus)
  const CAT = {
    // icon centre x, relative to CAT_X; negative e = to the right
    x: (i) => track(barPts(i, -1).map(([e, d]) => [e, V.CAT_X + d]), true),   // e = catPos - i: e > 0 -> left of focus
    // icon centre y
    y: (i) => forElement(i, [[-1, V.CAT_Y], [0, V.CAT_Y + V.CAT_Y_ACTIVE_OFFSET], [1, V.CAT_Y]]),
    // scale relative to the ACTIVE icon size (so the view is laid out once at 168px)
    scale: (i, id) => { const s = iconScale(id), r = V.CAT_ICON_INACTIVE / V.CAT_ICON_ACTIVE; return forElement(i, [[-1, r * s], [0, s], [1, r * s]]); },
    // opacity: 1 active, 0.9 for the 1..2 neighbours, 0.25 beyond (xmb-web catDist tiers)
    alpha: (i) => forElement(i, [[-3, V.CAT_FAR_ALPHA], [-2, V.CAT_INACTIVE_ALPHA], [-1, V.CAT_INACTIVE_ALPHA], [0, 1], [1, V.CAT_INACTIVE_ALPHA], [2, V.CAT_INACTIVE_ALPHA], [3, V.CAT_FAR_ALPHA]]),
    labelAlpha: (i) => forElement(i, [[-1, 0], [0, 0.9], [1, 0]]),
    iconBox: V.CAT_ICON_ACTIVE,
  };

  // submenu factor subT (0 = full XMB, 1 = settled inside a submenu); category bar pulled up-left
  // V53 (PS3 recording): the focused category icon slides 262 left at full size and opacity, its name fades out with the move; the other
  // categories move only 29 left / 7.5 down, shrink to 0.95 and fade out.
  const CAT_SUB = {
    shiftX: track([[0, 0], [1, -262]]),
    shiftY: track([[0, 0], [1, 0]]),
    scale: track([[0, 1], [1, 1]]),
    alpha: track([[0, 1], [1, 1]]),
    otherShiftX: track([[0, 0], [1, -29]]),
    otherShiftY: track([[0, 0], [1, 7.5]]),
    otherScale: track([[0, 1], [1, 0.95]]),
    otherAlpha: track([[0, 1], [1, 0]]),          // non-active categories fade away
    labelAlpha: track([[0, 1], [1, 0]]),
  };

  // ---------- ITEM COLUMN ----------
  // e = itemPos - i. e>0: item is ABOVE focus. xmb-web itemSlotY():
  //   focus -> ITEM_FOCUS_Y ; above -> ABOVE_BASE_Y - (k-1)*SPACING ; below -> FOCUS_Y + PAD + k*SPACING
  const ABOVE_BASE_Y = 120; // xmb-web ITEM_ABOVE_BASE_Y (measured)
  function slotY(e, o) {
    o = o || {};
    const fy = o.focusY != null ? o.focusY : V.ITEM_FOCUS_Y, pad = o.pad != null ? o.pad : V.ITEM_ACTIVE_PAD;
    // V54: inside a submenu nothing sits above the list, so the rows above mirror the rows below (PS3: focus 505, above 330, below 680)
    const ab = o.sub ? fy - pad - V.ITEM_SPACING : ABOVE_BASE_Y;
    if (e >= 1) return ab - (e - 1) * V.ITEM_SPACING;
    if (e >= 0) return fy + (ab - fy) * e;
    const d = -e; // below
    if (d <= 1) return fy + (fy + pad + V.ITEM_SPACING - fy) * d;
    return fy + pad + d * V.ITEM_SPACING;
  }
  const ITEM = {
    y: (i, o) => forElement(i, [[-30, slotY(-30, o)], [-1, slotY(-1, o)], [0, slotY(0, o)], [1, slotY(1, o)], [30, slotY(30, o)]]),
    // opacity incl. xmb-web's edge fades (top 40px, bottom 20px)
    alpha: (i, o) => {
      const A = V.ALPHA_INACTIVE, fTop = 0, fBot = V.H;
      const ab = o && o.sub ? V.ITEM_FOCUS_Y - V.ITEM_ACTIVE_PAD - V.ITEM_SPACING : ABOVE_BASE_Y;
      const eAbove0 = 1 + (ab - fTop) / V.ITEM_SPACING;      // y == 0 (alpha 0)
      const eAbove40 = 1 + (ab - fTop - 40) / V.ITEM_SPACING; // y == 40 (alpha full)
      const base = (V.ITEM_FOCUS_Y + V.ITEM_ACTIVE_PAD);
      const dBot20 = (fBot - 20 - base) / V.ITEM_SPACING, dBot0 = (fBot - base) / V.ITEM_SPACING;
      return forElement(i, [[-dBot0, 0], [-dBot20, A], [-1, A], [0, V.ALPHA_FOCUS], [1, A], [eAbove40, A], [eAbove0, 0]]);
    },
    // active-style text/glow layer crossfade vs inactive-style layer
    activeOpacity: (i) => forElement(i, [[-1, 0], [0, 1], [1, 0]]),
    inactiveOpacity: (i) => forElement(i, [[-1, 1], [0, 0], [1, 1]]),
    // icon scale relative to the focused icon size
    iconScale: (i, id, o) => {
      const act = (o && o.activeIcon) || V.ITEM_ICON_ACTIVE, small = (o && o.inactiveIcon) || V.ITEM_ICON_SIZE, s = iconScale(id);
      return forElement(i, [[-1, small / act * s], [0, s], [1, small / act * s]]);
    },
    iconBoxActive: V.ITEM_ICON_ACTIVE,
    // description under the active item (0.7) and short status line under inactive items (0.6)
    descActive: (i) => forElement(i, [[-1, 0], [0, 0.7], [1, 0]]),
    descInactive: (i) => forElement(i, [[-1, 0.6], [0, 0], [1, 0.6]]),
  };

  // Category switch: the whole item column rides along with the bar (xmb-web catAnim).
  // column c: shift = (c - catPos) * CAT_SPACING; opacity falls off quickly (xmb-web: old 1-p/0.4, new (p-.5)/.5; symmetrised)
  const COLUMN = {
    shiftX: (c) => track(barPts(c, -1), true),   // the column rides with its category icon (PS3 bar spacing 200 + 10 beside the focus)
    alpha: (c) => track([[c - 1, 0], [c - 0.45, 0], [c, 1], [c + 0.45, 0], [c + 1, 0]]),
  };

  // ---------- SUBMENU (parent column collapses, children slide in) ----------
  const SLIDE_DIST = V.ITEM_ICON_X - V.PARENT_COL_X; // 262
  // V53 (PS3 recording): parent column inside a submenu. The opened item slides 262 left at FULL size, opacity 0.65; the other items of
  // that list slide 110 left, shrink to 0.94, opacity 0.2 (V54: measured on the still PS3 frame), and close up toward the focus (above: +23.5 then +4 per row, below: -21 then -4).
  // Their names vanish at once when the submenu opens and fade back in with the move when it closes.
  const SIB_X = V.ITEM_ICON_X - 110;
  const PS3SUB = { parentAlpha: 0.65, sibAlpha: 0.2, sibScale: 0.94, aboveDy: 23.5, belowDy: -21, rowShrink: 4, arrowX: 444, arrowFrom: 80, childTextX: 622, childIcon: 86, childIconSmall: 37, childDelay: 160, valueX: 1301, valueSize: 20 };
  const sibDy = (e) => (e === 0 ? 0 : e > 0 ? PS3SUB.aboveDy + (e - 1) * PS3SUB.rowShrink : PS3SUB.belowDy - (-e - 1) * PS3SUB.rowShrink);
  const SUB = {
    SLIDE_DIST, SIB_X,
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
        sel,
      };
    },
    childX: track([[0, 0], [1, 0]]),                 // V53: the PS3 child list does not slide, it fades in (see PS3SUB.childDelay)
    childAlpha: track([[0, 0], [1, 1]]),
    chevronAlpha: track([[0, 0], [1, 0.95]]),
    chevron: { tipX: 433, baseX: 447, cy: V.ITEM_FOCUS_Y, h: 16 },   // V53: PS3 arrow measured: tip x 433, 14 wide, 16 high, white
    PS3: PS3SUB, sibDy,
  };

  // ---------- INPUT (firmware key-repeat cadence) ----------
  // 300 ms initial delay, then 200 ms, each following interval divided by INPUT_ACCEL_MULT, floored at 50 ms.
  function repeatIntervals(n) {
    const out = []; let cur = V.INPUT_REPEAT_MS;
    for (let k = 0; k < n; k++) { out.push(k === 0 ? V.INPUT_INITIAL_DELAY_MS : Math.max(V.INPUT_MIN_REPEAT_MS, cur)); if (k > 0) cur /= V.INPUT_ACCEL_MULT; }
    return out;
  }

  // ---------- text glow (breathing halo on the focused label) ----------
  const GLOW = {
    periodMs: V.PULSE_PERIOD_MS,
    outer: { radius: V.TEXT_GLOW_RADIUS, min: V.PULSE_ALPHA_MIN, max: V.PULSE_ALPHA_MAX },
    inner: { radius: V.TEXT_GLOW_INNER_RADIUS, min: V.PULSE_INNER_MIN, max: V.PULSE_INNER_MAX },
  };

  return { V, BAR_STEP, BAR_GAP, ease, track, sample, forElement, slotY, CAT, CAT_SUB, ITEM, COLUMN, SUB, GLOW, repeatIntervals, iconScale, ABOVE_BASE_Y };
}

// Sample N points of an easing function into a track over [0,1] (for engines without Easing support).
function sampledEasing(fn, n) {
  n = n || 12; const pts = [];
  for (let k = 0; k <= n; k++) pts.push([k / n, fn(k / n)]);
  return { inputRange: pts.map((p) => p[0]), outputRange: pts.map((p) => p[1]) };
}

module.exports = { createCore, sampledEasing };
