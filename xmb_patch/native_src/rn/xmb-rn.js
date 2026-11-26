'use strict';
/*
 * xmb-rn: the PS3 XMB as React Native components. Only View / Text / Image / Animated are used, and
 * every animated property is a transform or opacity, so everything runs on the native driver.
 *
 *   const { Xmb, createController } = createXmb({ React, rn, core, spec, iconSource, fontFamily });
 *   const ctl = createController(categories, { onActivate(item, path) {...} });
 *   <Xmb controller={ctl} />            // 1920x1080 coordinate space (like the rest of the PS5 Home)
 *   ctl.press('left'|'right'|'up'|'down'|'enter'|'back')   // feed from the pad
 *
 * Item titles are ONE text layer laid out at the focused size (34px) and scaled with a transform between 30px (inactive)
 * and 34px (focused), so the size change animates natively. On the PS5 Text only accepts FontSizePS table sizes, so
 * env.fontSnap(px) -> {size, scale} picks the nearest table size and the remaining ratio goes into the same transform.
 * The PS5 engine ignores textShadow, so env.fakeGlow draws the focused label's halo as offset copies of the text.
 */
module.exports = function createXmb(env) {
  const { React, rn, core, spec } = env;
  const { View, Text, Image, Animated } = rn;
  const h = React.createElement;
  const V = core.V, font = env.fontFamily || 'PS3';
  const PULSE_MS = 2000, PULSE_MIN = 0.2;   // V38: the focused title's glow swells to full, fades to PULSE_MIN, swells again ...
  // V39: the pulse value runs 0 -> 1 natively in a loop; this table turns it into a smooth cosine 1 -> PULSE_MIN -> 1 (no JS per cycle)
  const PULSE_TR = (() => { const ir = [], or = []; for (let k = 0; k <= 16; k++) { const x = k / 16; ir.push(x); or.push(PULSE_MIN + (1 - PULSE_MIN) * (0.5 + 0.5 * Math.cos(2 * Math.PI * x))); } return { inputRange: ir, outputRange: or }; })();
  const nativeDriver = env.useNativeDriver !== false;
  const snap = env.fontSnap || ((px) => ({ size: px, scale: 1 }));
  const layout = (kind) => (env.onLayout ? (e) => env.onLayout(kind, e) : undefined);
  const iconSrc = (it) => (it && it.src ? { uri: it.src } : env.iconSource(it && it.i));
  // hand-made mip levels of the glass icons (xmbweb_xmb_icon_NNN_s = 96 px for list rows, _m = 136 px for inactive categories): the PS5
  // samples bilinearly without mipmaps, so a 256 px icon minified to 78 px aliases. env.iconMip(id, suffix) -> source or null.
  const iconMip = (id, suf) => (env.iconMip && id ? env.iconMip(id, suf) : null);
  const scaleKey = (it) => (it && (it.sk || it.i)) || '';
  // V40 optical centring: what an icon DRAWS is not always centred in its picture (the Settings icons carry a wrench badge on the left, the
  // magnifier leans right ...). tools/make-icon-offsets.py measured each one; the glyph is moved so it sits exactly on the column / category
  // centre line. Applied INSIDE the scaled box, so it stays exact at every size.
  const OFFS = spec.iconOffsetX || {};
  const iconShift = (id, box) => { const k = String(id || '').replace(/^xmbweb_/, ''); const f = OFFS[k]; return f ? Math.round(-f * box * 10) / 10 : 0; };
  const shifted = (id, box, kids) => { const dx = iconShift(id, box); return dx ? h(View, { pointerEvents: 'none', style: { position: 'absolute', left: 0, top: 0, width: box, height: box, transform: [{ translateX: dx }] } }, kids) : kids; };
  const INACTIVE_K = V.ITEM_TEXT_SIZE / V.ITEM_TEXT_ACTIVE_SIZE;   // 30 / 34

  // React.memo / useMemo exist in every React that has hooks; the fallbacks only keep a stripped-down React working (they just never skip)
  const memo = React.memo || ((c) => c);
  const useMemo = React.useMemo || ((fn, deps) => {
    const r = React.useRef(null), c = r.current;
    if (c && c.d.length === deps.length && c.d.every((x, k) => x === deps[k])) return c.v;
    const v = fn(); r.current = { d: deps, v }; return v;
  });

  const A = {
    mul: (a, b) => (b === undefined || b === null ? a : a === undefined || a === null ? b : Animated.multiply(a, b)),
    add: (a, b) => (b === undefined || b === null ? a : a === undefined || a === null ? b : Animated.add(a, b)),
  };
  const interp = (val, tr, delta) => val.interpolate({ inputRange: tr.inputRange, outputRange: delta ? tr.outputRange.map((v) => v + delta) : tr.outputRange, extrapolate: tr.extrapolate || 'clamp' });
  const constTr = (v) => ({ inputRange: [0, 1], outputRange: [v, v], extrapolate: 'clamp' });

  // ------------------------------------------------------------------ controller
  function createController(categories, opts) {
    opts = opts || {};
    const listeners = new Set();
    const cats = categories;
    const st = {
      ci: Math.min(cats.length - 1, opts.startCategory || 0),
      // V55: the host's cursor wins (opts.sel). The old xmb-web default (Settings -> item 5) put the list on the LAST row of the trimmed
      // Settings at start while the host's cursor was on the first one.
      sel: cats.map((c, i) => Math.min(Math.max(0, (c.items || []).length - 1), Math.max(0, opts.sel ? (opts.sel[i] || 0) : 0))),
      stack: [],            // frames: { items, idx, pos: Animated.Value, parentIdx }
      leaving: false,
      startDelay: 0,        // V38: live 'scroll start delay' (ms) before a cursor move starts animating (host: model.startDelay)
      dwell: -1,            // V38: live focus-background delay (ms); 0 = spec value (host: model.dwell)
      speed: 1,             // live animation-speed factor (host sets it: model.speed); durations = spec value x speed
      motion: 'ps3',        // V52: 'ps3' = the PS3's own curve (PAF mode 5, 200 ms) | 'smooth' = the V39-V51 glide (host: model.motion)
      fast: false,          // held / rapid D-pad: halo + descriptions are dropped until the cursor rests (no per-step mount churn)
      version: 0,
      opt: [],              // V62: the Triangle options panel, one entry per open level: [{ items: [{ n, ch }], idx }] (host: model.opt)
      optLast: null,        //      the last shown level: kept drawn (faded out by optV) so closing fades the panel with its labels
      info: null, infoLast: null,   // V62: the PS3 Information screen ({ icon, pic, rows: [[label, value]] }, host: model.info)
    };
    const catPos = new Animated.Value(st.ci);
    const rootPos = cats.map((c, i) => new Animated.Value(st.sel[i]));
    const slotDx = cats.map(() => new Animated.Value(0));   // V76: per bar slot - the slide of a category that moved into this slot
    const catSub = new Animated.Value(0);   // 0 root, 1 inside a submenu (category bar pulled up-left)
    const colT = new Animated.Value(0);     // parent/child pair transition (0 full list .. 1 collapsed + child)
    // V53 (PS3 recording): what is not a plain function of colT. Names of the list under the category vanish at once when a submenu opens
    // and fade in with the move when it closes; the arrow appears at once and vanishes at once; the child list fades in after 150 ms.
    const subText = new Animated.Value(1), arrowV = new Animated.Value(0), childV = new Animated.Value(0);
    // V55: the arrow's slide-in (px) is its own value: every open slides it in from the right, closing to a submenu leaves it in place
    const arrowX = new Animated.Value(0);
    // V56: the PS3 blurs the background while a submenu is open (RPCS3 recording: ~15 px at 1080p, the stars vanish; in over ~4 frames,
    // out over ~6 = the same 200 ms mode-5 move). The host fades a pre-blurred copy of the wave video in with this value.
    const blurV = opts.blurV || new Animated.Value(0);
    const pulse = new Animated.Value(0);
    const zero = new Animated.Value(0);     // constant source for animated-but-constant style values
    const dimV = new Animated.Value(0);     // 0..1: the other rows' names fade away while a game / app picture is shown (Game category only)
    // V62: the PS3 Triangle options panel (RPCS3 4.93 frames): 0 closed, 1 open, 2 one of its options opened. The XMB slides left with it
    // (192 px, then 180 px more), the clock goes, the focused name loses its glow and dims (0.43, nested 0.24). The same 200 ms mode-5 move.
    const optV = new Animated.Value(0);
    const optTxt = interp(optV, { inputRange: [0, 1, 2], outputRange: [1, 0.43, 0.24] });
    const optGlow = interp(optV, { inputRange: [0, 1], outputRange: [1, 0] });
    // V62: the Information screen replaces the XMB (category bar, lists, clock, options panel); the wave stays
    const infoV = new Animated.Value(0);

    // V45: with the native driver the JS side of an Animated.Value never learns where the animation ended. Any view created later (a row
    // that mounts when a submenu closes, a column that mounts on a category switch) got its FIRST frame from that stale JS value - the
    // rows jumped to old positions / sizes, or were off screen, until the next animation moved them ("snaps"). The JS value is now set to
    // the end value when an animation finishes.
    const settle = (val, to) => { try { if (typeof val._value === 'number') val._value = to; } catch (e) {} };
    const run = (val, to, ms, fn, cb, delay) => {
      if (val.stopAnimation) val.stopAnimation();
      Animated.timing(val, { toValue: to, duration: ms, easing: fn, delay: delay || 0, useNativeDriver: nativeDriver }).start((r) => {
        if (!r || r.finished !== false) settle(val, to);
        if (cb) cb(r);
      });
    };
    const D = (k) => Math.max(30, Math.round(V[k] * st.speed));
    // V39: velocity-continuous retargeting. A single step from rest eases out (outCubic, as xmb-web). A step that arrives while the previous one
    // is still moving starts with the CURRENT speed of that motion (cubic Hermite: slope s at the start, 0 at the end), so a held D-pad is
    // one continuous glide that brakes only after the last step - no burst + brake per step (what made held scrolling look jerky).
    const motion = new Map();
    const outCubic = { f: core.ease.outCubic, d: (u) => 3 * (1 - u) * (1 - u) };
    const hermite = (sl) => ({ f: (u) => (u <= 0 ? 0 : u >= 1 ? 1 : sl * u + (3 - 2 * sl) * u * u + (sl - 2) * u * u * u), d: (u) => sl + 2 * (3 - 2 * sl) * u + 3 * (sl - 2) * u * u });
    // V52: the PS3's own motion, from the decrypted vsh.elf (PAF animation engine: initialiser 0x3981EC, curve selector 0x398748, mode-5
    // update 0x3984F8). Every XMB move (category scroll, list step, icon focus grow / shrink, focus / other alpha) is a mode-5 request of
    // 200 ms: N = trunc(ms x 0.001 x 60) frames; gain g = 1 / ((N - 5) x 0.333333 + 2.2) (N <= 4: 0.9615 / 0.78125 / 0.6369 / 0.5291); each
    // 60 Hz frame v = (v + (1 - v) x g) x 1.00000095 until v >= 1 (200 ms: g = 0.2206 -> 95 % at 200 ms, 99 % at 308 ms, done at 50 frames).
    // A new request starts again from where the motion is (PAF kills the old timer and starts a new one), so a held D-pad chases the cursor.
    const PS3_MS = 200, ps3Cache = {};
    const ps3Curve = (ms) => {
      const key = Math.round(ms);
      if (ps3Cache[key]) return ps3Cache[key];
      const fr = Math.fround || ((x) => x);
      const N = Math.trunc(fr(fr(key * fr(0.001)) * 60));
      const g = N > 4 ? fr(1 / fr(fr((N - 5) * 0.33333298563957214) + 2.200000047683716)) : ([1, 0.9615384936332703, 0.78125, 0.6369426250457764, 0.5291005373001099][N] || 1);
      const tab = [0]; let v = 0;
      while (v < 1 && tab.length < 240) { v = fr(fr(v + fr((1 - v) * g)) * 1.0000009536743164); tab.push(Math.min(1, v)); }
      tab[tab.length - 1] = 1;
      const K = tab.length - 1;
      const f = (u) => { if (u <= 0) return 0; if (u >= 1) return 1; const x = u * K, k = Math.floor(x); return tab[k] + (tab[k + 1] - tab[k]) * (x - k); };
      return (ps3Cache[key] = { f, dur: Math.round(K * 1000 / 60), N, g, K });
    };
    const stepPs3 = (val, to, m0, now) => {
      const c = ps3Curve(PS3_MS * st.speed);
      let from, delay = 0;
      if (m0 && now < m0.t0 + m0.dur) {
        const u = (now - m0.t0) / m0.dur;
        from = u <= 0 ? m0.from : m0.from + (m0.to - m0.from) * m0.c.f(u);
      } else {
        from = m0 ? m0.to : (typeof val.__getValue === 'function' ? val.__getValue() : to);
        delay = st.startDelay || 0;
      }
      motion.set(val, { t0: now + delay, dur: c.dur, from, to, c });
      run(val, to, c.dur, c.f, null, delay);
    };
    // submenu transition: the PS3 curve (the same 200 ms mode-5 request, measured on the recording) or the V39-V52 smoothstep
    const subRun = (val, to, cb, delay) => {
      if (st.motion !== 'smooth') { const c = ps3Curve(PS3_MS * st.speed); run(val, to, c.dur, c.f, cb, delay); }
      else run(val, to, D('SUBMENU_ANIM_MS'), core.ease.smooth, cb, delay);
    };
    // V55: every level of the stack carries its own collapse. Frame k = the list opened from level k (level 0 = the category lists):
    //   lvT(k)   0..1  the level-k list collapses into the parent column (colT for the category lists, stack[k-1].t for a submenu list)
    //   lvTxt(k) 1..0  its names (gone at once on open, back with the move on close)
    //   f.cv     0..1  frame k fades in after 160 ms (PS3)
    // Opening and closing never wait for a timer or an animation-end callback: on the PS5 those only arrive with the NEXT input, which
    // left a submenu unopened after its sound (V54) and a closed sub-submenu stuck half way. The stack changes at once; only native
    // animations follow.
    const lvT = (k) => (k === 0 ? colT : st.stack[k - 1].t);
    const lvTxt = (k) => (k === 0 ? subText : st.stack[k - 1].txt);
    const newFrame = (items, idx, title, parentIdx) => ({ items, idx, pos: new Animated.Value(idx), parentIdx: parentIdx || 0, title,
      t: new Animated.Value(0), txt: new Animated.Value(1), cv: new Animated.Value(0) });
    const stopV = (v) => { if (v.stopAnimation) v.stopAnimation(); };
    // frame n has just been pushed; `animate` false = put it straight into its end state (several levels restored at once)
    const openFx = (n, animate) => {
      const T = lvT(n), X = lvTxt(n), f = st.stack[n];
      stopV(X); X.setValue(0);
      arrowV.setValue(1);
      if (!animate) { stopV(T); T.setValue(1); f.cv.setValue(1); if (n === 0) { stopV(catSub); catSub.setValue(1); stopV(blurV); blurV.setValue(1); } return; }
      stopV(arrowX); arrowX.setValue(core.SUB.PS3.arrowFrom); subRun(arrowX, 0);
      f.cv.setValue(0);
      subRun(T, 1);
      if (n === 0) { subRun(catSub, 1); subRun(blurV, 1); }
      subRun(f.cv, 1, null, st.motion !== 'smooth' ? core.SUB.PS3.childDelay * st.speed : 0);
    };
    // frame n (the top one) is popped NOW; its list vanishes at once (PS3), the level below expands back with the move
    const closeFx = (n, animate) => {
      const T = lvT(n), X = lvTxt(n);
      st.stack.length = n;
      if (n === 0) { arrowV.setValue(0); if (animate) { subRun(catSub, 0); subRun(blurV, 0); } else { stopV(catSub); catSub.setValue(0); stopV(blurV); blurV.setValue(0); } }
      if (animate) { subRun(T, 0); subRun(X, 1); } else { stopV(T); T.setValue(0); stopV(X); X.setValue(1); }
    };
    const step = (val, to, key) => {
      const now = Date.now(), T = D(key), m0 = motion.get(val);
      if (st.motion !== 'smooth') { stepPs3(val, to, m0, now); return; }
      let curve = outCubic;
      if (m0 && m0.c && m0.c.d) {
        const u = (now - m0.t0) / m0.dur;
        if (u > 0 && u < 1 && m0.to !== m0.from) {
          // V40: a held step lasts ~1.8 x the gap between steps (not the full single-step time): the list trails the cursor by less than a
          // row, so each scroll sound lands as its row arrives, while the speed stays even (+-10 %)
          const gap = now - m0.t0, Th = Math.max(60, Math.min(T, Math.round(gap * 1.8)));
          const p = m0.from + (m0.to - m0.from) * m0.c.f(u), v = (m0.to - m0.from) * m0.c.d(u) / m0.dur, dist = to - p;
          if (Math.abs(dist) > 1e-3) curve = hermite(Math.max(0, Math.min(3, v * Th / dist)));
          motion.set(val, { t0: now, dur: Th, from: p, to, c: curve });
          run(val, to, Th, curve.f, null, 0);
          return;
        }
      }
      const from = typeof val.__getValue === 'function' ? val.__getValue() : (m0 ? m0.to : to);
      motion.set(val, { t0: now + (st.startDelay || 0), dur: T, from, to, c: curve });
      run(val, to, T, curve.f, null, st.startDelay);
    };
    const notify = () => { st.version++; listeners.forEach((f) => f(st.version)); };
    // rapid-move detector: two cursor moves < FAST_GAP ms apart = scrolling fast; calm again FAST_REST ms after the last move
    const FAST_GAP = 0, FAST_REST = 240;   // V37: fast mode is OFF (the halo is two cheap images now; flipping it re-rendered every row)
    let lastMove = 0, fastTimer = null;
    const markMove = () => {
      if (st.dim) api.setDim(false);                        // names come back FAST as soon as the cursor moves
      if (api.bgRetarget) { try { api.bgRetarget(); } catch (e) {} }   // V39: focus background follows the step itself (no render needed)
      const t = Date.now();
      if (t - lastMove < FAST_GAP) st.fast = true;
      lastMove = t;
      if (fastTimer) clearTimeout(fastTimer);
      fastTimer = setTimeout(() => { fastTimer = null; if (st.fast) { st.fast = false; notify(); } }, FAST_REST);
    };

    // glow breathing (focused label): V38 full bright -> dim -> bright -> dim, PULSE_MS per cycle
    if (Animated.loop && !opts.noPulse) {
      Animated.loop(Animated.timing(pulse, { toValue: 1, duration: PULSE_MS, easing: core.ease.linear || ((x) => x), useNativeDriver: nativeDriver }), { iterations: -1 }).start();
    }

    const frame = () => (st.stack.length ? st.stack[st.stack.length - 1] : null);
    const curItems = () => (frame() ? frame().items : cats[st.ci].items || []);
    const curIdx = () => (frame() ? frame().idx : st.sel[st.ci]);

    const api = {
      state: st, catPos, slotDx, catSub, colT, subText, arrowV, arrowX, childV, blurV, pulse, zero, dimV, rootPos, categories: cats, optV, optTxt, optGlow, infoV,
      setDim(on) {
        if (st.dim === on) return; st.dim = on;
        run(dimV, on ? 1 : 0, on ? 680 : 110, on ? core.ease.smooth : core.ease.outCubic);
      },
      subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
      // V76: the host moved a category (a custom column, left / right): the same category objects, lists and positions in the new order;
      // the focus stays where it is and the categories that changed sides slide over to their new places (PS3 mode-5 move)
      reorder(ids, ci) {
        // every animated node stays bound to its slot (icon, column, list position): only values and pictures change - no node is rebuilt
        const byId = {}, oldCi = st.ci;
        cats.forEach((c, k) => { stopV(rootPos[k]); byId[c.id] = { c, sel: st.sel[k], old: k }; });
        if (ids.length !== cats.length || ids.some((id) => !byId[id])) return;
        ids.forEach((id, k) => { const e = byId[id]; cats[k] = e.c; st.sel[k] = e.sel; rootPos[k].setValue(e.sel); motion.delete(rootPos[k]); e.nw = k; });
        st.ci = ci;
        stopV(catPos); catPos.setValue(ci); motion.delete(catPos);
        ids.forEach((id) => {
          const e = byId[id], d = ((e.old - oldCi) - (e.nw - ci)) * V.CAT_SPACING, v = slotDx[e.nw];
          stopV(v); v.setValue(d); if (d) subRun(v, 0);
        });
        notify();
      },
      refresh() { notify(); },             // V39: re-render the rows now (the host calls sync() per step and renders when the cursor rests)
      current() { return { item: curItems()[curIdx()], index: curIdx(), depth: st.stack.length, category: cats[st.ci] }; },

      // ---- driver mode: the host owns the navigation state (category, per-category cursor, submenu stack) and calls
      // sync(model) on every render; the controller only derives the animations from the differences. model:
      //   { ci, sel: [index per category], stack: [{ items, idx, title }] }   (items already in {n,i,d,v,ch,src,sk} form)
      sync(m) {
        if (m.speed && m.speed !== st.speed) st.speed = m.speed;
        if (m.motion === 'ps3' || m.motion === 'smooth') st.motion = m.motion;
        if (typeof m.startDelay === 'number') st.startDelay = Math.max(0, m.startDelay);
        if (typeof m.dwell === 'number') st.dwell = Math.max(0, m.dwell);
        // V62: options panel levels (changes at once; only optV animates, so a fast open / close never waits for an animation end)
        const ol = Array.isArray(m.opt) ? m.opt.filter((l) => l && Array.isArray(l.items)) : [];   // V69: an empty list is still a panel (Add to Folder with no folders)
        if (ol.length !== st.opt.length) subRun(optV, ol.length);
        st.opt = ol;
        if (ol.length) st.optLast = ol;
        // V70: the strip a level becomes is as wide as its longest name needs (PS3: 213 px; "Remove from Folder" needs more), so the
        // names never run under the list on its right; the XMB slides that much further
        if (ol.length >= 2) {
          const longest = Math.max.apply(null, ol[0].items.map((it) => String(it.n || '').length));
          st.optNest = Math.max(OPT.nest, Math.min(400, Math.round(longest * OPT.size * 0.62) + OPT.textX + 50));   // V74: the PS5's font is wider
        }
        const inf = m.info && Array.isArray(m.info.rows) ? m.info : null;
        if (!!inf !== !!st.info) subRun(infoV, inf ? 1 : 0);
        st.info = inf;
        if (inf) st.infoLast = inf;
        const lastDepth = st.stack.length;
        if (m.ci !== st.ci) { st.ci = m.ci; step(catPos, m.ci, 'CAT_ANIM_MS'); markMove(); }
        for (let c = 0; c < cats.length; c++) {
          const n = Math.max(0, m.sel[c] || 0);
          if (n !== st.sel[c]) {
            const jump = Math.abs(n - st.sel[c]) > 1 || c !== st.ci;
            st.sel[c] = n;
            if (jump) { rootPos[c].stopAnimation && rootPos[c].stopAnimation(); rootPos[c].setValue(n); }
            else { step(rootPos[c], n, 'ITEM_ANIM_MS'); markMove(); }
          }
        }
        const want = m.stack.length;
        if (want > lastDepth) {
          for (let k = lastDepth; k < want; k++) { st.stack.push(newFrame(m.stack[k].items, m.stack[k].idx, m.stack[k].title)); openFx(k, k === want - 1); }
        } else if (want < lastDepth) {
          for (let k = lastDepth - 1; k >= want; k--) closeFx(k, k === want);
        }
        for (let k = 0; k < Math.min(m.stack.length, st.stack.length); k++) {
          const f = st.stack[k], mf = m.stack[k];
          f.items = mf.items;
          if (mf.idx !== f.idx) { f.idx = mf.idx; step(f.pos, mf.idx, 'ITEM_ANIM_MS'); markMove(); }
        }
      },

      moveCat(dir) {
        if (st.stack.length) return;
        const n = st.ci + dir; if (n < 0 || n >= cats.length) return;
        st.ci = n; step(catPos, n, 'CAT_ANIM_MS'); markMove(); notify();
      },
      moveItem(dir) {
        const items = curItems(), n = curIdx() + dir; if (n < 0 || n >= items.length) return;
        const f = frame();
        if (f) { f.idx = n; step(f.pos, n, 'ITEM_ANIM_MS'); }
        else { st.sel[st.ci] = n; step(rootPos[st.ci], n, 'ITEM_ANIM_MS'); }
        markMove(); notify();
      },
      enter() {
        const items = curItems(), it = items[curIdx()]; if (!it) return;
        if (Array.isArray(it.ch) && it.ch.length) {
          st.stack.push(newFrame(it.ch, 0, it.n, curIdx()));
          openFx(st.stack.length - 1, true); notify();
        } else if (opts.onActivate) opts.onActivate(it, api.path());
      },
      back() {
        if (!st.stack.length) return;
        closeFx(st.stack.length - 1, true); notify();
      },
      path() { return [cats[st.ci].id].concat(st.stack.map((f) => f.title)); },

      // D-pad semantics of xmb-web: left/right = categories, or back/enter inside a submenu
      press(key) {
        switch (key) {
          case 'left': return st.stack.length ? api.back() : api.moveCat(-1);
          case 'right': return st.stack.length ? ((curItems()[curIdx()] || {}).ch ? api.enter() : undefined) : api.moveCat(1);
          case 'up': return api.moveItem(-1);
          case 'down': return api.moveItem(1);
          case 'enter': return api.enter();
          case 'back': return api.back();
        }
      },
    };

    // held D-pad: 300 ms, 200 ms, then x1/1.4 down to 50 ms (firmware cadence)
    const held = {};
    api.keyDown = (key) => {
      if (held[key]) return; api.press(key);
      if (key === 'enter' || key === 'back') { held[key] = { t: 0 }; return; }
      const iv = core.repeatIntervals(40); let k = 0; const h2 = (held[key] = { t: null });
      const tick = () => { k++; if (!held[key]) return; api.press(key); h2.t = setTimeout(tick, iv[Math.min(k, iv.length - 1)]); };
      h2.t = setTimeout(tick, iv[0]);
    };
    api.keyUp = (key) => { if (held[key]) { clearTimeout(held[key].t); delete held[key]; } };

    // ---- ShellUI adapter. Focusable Views on the PS5 Home take on<Dir>KeyDown props that get
    // { keyEventType: 'Down' | 'Repeat' | ... } and return false when the key was taken (see ZhiThemes theme.js).
    // Native 'Repeat' events are throttled to the firmware XMB cadence (300 ms, 200 ms, then /1.4 down to 50 ms).
    const rep = {}; const iv = core.repeatIntervals(40);
    const handle = (key) => (e) => {
      const type = e && e.keyEventType, t = Date.now();
      if (!type || type === 'Down') { rep[key] = { n: 0, t }; api.press(key); }
      else if (type === 'Repeat' && (key === 'left' || key === 'right' || key === 'up' || key === 'down')) {
        const r = rep[key] || (rep[key] = { n: 0, t });
        if (t - r.t >= iv[Math.min(r.n + 1, iv.length - 1)]) { r.n++; r.t = t; api.press(key); }
      }
      if (e && typeof e === 'object') { try { e.__xmb = true; } catch (x) {} }
      return false;
    };
    api.keyProps = () => ({
      onLeftKeyDown: handle('left'), onRightKeyDown: handle('right'), onUpKeyDown: handle('up'), onDownKeyDown: handle('down'),
      onBackKeyDown: handle('back'), onPress: () => api.press('enter'),
    });
    api.ps3Curve = ps3Curve;
    return api;
  }

  // ------------------------------------------------------------------ pieces
  const FILL = { position: 'absolute', left: 0, top: 0, width: V.W, height: V.H };
  const lh = (px) => Math.round(px * 1.25);

  function useVersion(ctl) {
    const [v, setV] = React.useState(0);
    React.useEffect(() => ctl.subscribe(setV), [ctl]);
    return v;
  }

  // one static text line, vertically centred on y=0 of its row. Opacity lives on an Animated.View (Animated.Text may not exist on the PS5).
  // On the PS5 only FontSizePS sizes are allowed: the nearest one is used and the leftover ratio is a plain-View scale about the anchor.
  function Label(p) {
    const sn = snap(p.size), L = p.lh ? Math.round(p.lh * sn.size / p.size) : lh(sn.size), lines = p.lines || 1, W = p.width || 900;
    const k = sn.scale, al = p.align || 'left';
    const tx = al === 'right' ? W / 2 * (1 - k) : al === 'center' ? 0 : -W / 2 * (1 - k);   // scale is about the centre; pin the anchored edge
    const text = h(Text, { onLayout: p.onLayout, numberOfLines: lines, style: Object.assign({ fontFamily: font, fontSize: sn.size, lineHeight: L, color: p.color, textAlign: al }, env.fakeGlow ? {} : (p.shadow || {})) }, p.text);
    const box = Math.abs(k - 1) > 0.02
      ? h(View, { pointerEvents: 'none', style: { width: W, height: L * lines, transform: [{ translateX: tx }, { scale: k }] } }, text)
      : text;
    return h(Animated.View, { pointerEvents: 'none', style: { position: 'absolute', left: p.left, top: (p.top || 0) - L / 2, width: W, height: L * lines, opacity: p.opacity } }, box);
  }

  // item title: TWO crisp text layers, one at the inactive size (30) and one at the focused size (34), cross-faded by the animated
  // position. Neither is ever bitmap-scaled at rest (a scaled text layer is what made the labels soft); when the PS5 size table has no
  // size within 8% the leftover ratio falls back to a transform for that layer only. The halo (env.fakeGlow: copies of the focused
  // layer; the engine ignores textShadow) belongs to the focused layer. Everything animated is built ONCE per row (useMemo) and the
  // component is memoised: a D-pad step must not rebuild native nodes.
  const GLOW_RINGS = env.fakeGlow ? (env.fakeGlow.rings || [{ r: 3, a: 0.05, n: 8 }, { r: 6, a: 0.04, n: 10 }, { r: 10, a: 0.025, n: 12 }]) : null;
  const GLOW_N = env.fakeGlow ? (env.fakeGlow.n || 6) : 0;
  // V37: the halo is three static images (left cap / stretchable middle / right cap, see make_glow_assets.py) sized to the measured text width
  // (cached per text + size), instead of 30 text copies: it mounts with the row, costs three nodes and has a smooth falloff.
  const GLOW_IMG = env.glowImg || null, GLOW_H = 110, GLOW_CAP = 80, GLOW_PAD = 48;
  const glowW = {}, glowMeta = {}, glowOk = {}, glowRetry = {};
  // V81: the host's glow picture is shown only once it has really loaded (a picture that is missing - the ELF's cache was cleared -
  // drew the PS5's "picture not found" box behind the name, pulsing with the halo). A missing one is asked for again once (the ELF
  // makes it anew), then the row falls back to the plain halo.
  const GlowPic = memo(function GlowPic(p) {
    const [ok, setOk] = React.useState(!!glowOk[p.path]);
    return h(View, { pointerEvents: 'none', style: { position: 'absolute', left: p.left, top: p.top, width: p.w, height: p.h, opacity: ok ? 1 : 0 } },
      h(Image, { source: { uri: 'file://' + p.path }, resizeMode: 'stretch', style: { width: p.w, height: p.h },
        onLoad: () => { glowOk[p.path] = true; setOk(true); }, onError: () => { delete glowOk[p.path]; setOk(false); if (p.onFail) p.onFail(); } }));
  }, (a, b) => a.path === b.path && a.left === b.left && a.top === b.top && a.w === b.w && a.h === b.h);
  const glowAgain = (gkey, ask, set) => {
    if (glowRetry[gkey]) { glowMeta[gkey] = false; set(false); return; }
    glowRetry[gkey] = true;
    ask((info) => { glowMeta[gkey] = info || false; set(glowMeta[gkey] ? Object.assign({}, glowMeta[gkey], { again: 1 }) : false); });
  };
  const TitleLabel = memo(function TitleLabel(p) {
    const sa = snap(V.ITEM_TEXT_SIZE), sb = snap(V.ITEM_TEXT_ACTIVE_SIZE), W = p.width || 900;
    const two = sa.size !== sb.size || sa.scale !== sb.scale;
    const La = lh(sa.size), Lb = lh(sb.size);
    const tr = useMemo(() => {
      if (two && !p.pos) {
        // V43: a parent column (submenu open / closing) uses the SAME layered structure with fixed values: when the submenu closes and the
        // column turns back into a normal list, only values change - nothing is re-created, so nothing blinks
        const K = (sb.size * sb.scale) / (sa.size * sa.scale), f = !!p.focusedStatic;
        return { a: f ? 0 : 1, b: f ? 1 : 0, K, k: f ? K : 1, tx: f ? -W / 2 * (1 - K) : 0 };
      }
      if (p.pos && two) {
        // V42: both layers are drawn at the SAME apparent size at every position (the wrapper grows 30 -> 34 smoothly, the 34 px layer is
        // pre-shrunk by 30/34 inside it): the cross-fade only swaps which one is crisp - no doubled / overlapping text while the list moves.
        const K = (sb.size * sb.scale) / (sa.size * sa.scale);
        return { a: interp(p.pos, core.forElement(p.i, [[-1, 1], [-0.6, 1], [0, 0], [0.6, 1], [1, 1]])), b: interp(p.pos, core.forElement(p.i, [[-1, 0], [-0.6, 0], [0, 1], [0.6, 0], [1, 0]])),
          K, k: interp(p.pos, core.forElement(p.i, [[-1, 1], [0, K], [1, 1]])), tx: interp(p.pos, core.forElement(p.i, [[-1, 0], [0, -W / 2 * (1 - K)], [1, 0]])) };
      }
      return null;
    }, [p.pos, p.i, two, !!p.focusedStatic]);
    const baseB = { fontFamily: font, fontSize: sb.size, lineHeight: Lb, width: W };
    const [gw, setGw] = React.useState(glowW[p.text + '|' + sb.size] || 0);
    // V38: the letter-hugging glow picture made by the host (env.glowFor); null until it is ready, false when the host cannot make it (slices are used)
    const gkey = p.text + '|' + sb.size + '|' + Lb;
    const [gi, setGi] = React.useState(glowMeta[gkey] === undefined ? null : glowMeta[gkey]);
    React.useEffect(() => {
      if (!p.glow || !env.glowFor) return undefined;
      if (glowMeta[gkey] !== undefined) { if (glowMeta[gkey] !== gi) setGi(glowMeta[gkey]); return undefined; }
      let live = true;
      env.glowFor(p.text, sb.size, Lb, (info) => { glowMeta[gkey] = info || false; if (live) setGi(glowMeta[gkey]); });
      return () => { live = false; };
    }, [!!p.glow, gkey]);
    const onGlowLayout = (probe) => (e) => {
      if (probe) probe(e);
      const w = Math.round(e && e.nativeEvent && e.nativeEvent.layout ? e.nativeEvent.layout.width : 0);
      if (w > 0 && w < W - 2 && Math.abs(w - gw) > 2) { glowW[p.text + '|' + sb.size] = w; setGw(w); }
    };
    const estW = Math.min(W, Math.round(String(p.text).length * sb.size * 0.52));
    const copies = useMemo(() => {
      if (env.glowFor && p.glow && gi) {
        const sx = gw && gi.tw ? Math.min(1.12, Math.max(0.88, gw / gi.tw)) : 1;
        return [h(GlowPic, { key: 'gt' + (gi.again ? 'r' : ''), path: gi.p, left: -Math.round(gi.pad * sx), top: -gi.pad, w: Math.round(gi.w * sx), h: gi.h,
          onFail: () => glowAgain(gkey, (cb) => env.glowFor(p.text, sb.size, Lb, cb), setGi) })];
      }
      if (env.glowFor && p.glow && gi === null) return null;      // waiting for the picture: no band flashes first
      if (GLOW_IMG && p.glow) {
        const tw = gw || estW, top = Lb / 2 - GLOW_H / 2, mid = Math.max(0, tw - 64);
        const img = (key, src, left, width) => h(Image, { key, source: src, resizeMode: 'stretch', style: { position: 'absolute', left, top, width, height: GLOW_H } });
        return [img('gl', GLOW_IMG.l, -GLOW_PAD, GLOW_CAP), mid ? img('gm', GLOW_IMG.m, 32, mid) : null, img('gr', GLOW_IMG.r, tw - 32, GLOW_CAP)];
      }
      if (!(p.glow && GLOW_RINGS)) return null;
      const cop = [];
      GLOW_RINGS.forEach((ring, ri) => { const cnt = ring.n || GLOW_N; for (let q = 0; q < cnt; q++) {
        const ang = (q / cnt) * Math.PI * 2 + ri * 0.5;
        cop.push(h(Text, { key: 'g' + ri + '_' + q, numberOfLines: 1, style: Object.assign({ position: 'absolute', left: Math.cos(ang) * ring.r, top: Math.sin(ang) * ring.r, color: 'rgba(255,255,255,' + ring.a + ')' }, baseB) }, p.text));
      } });
      return cop;
    }, [!!p.glow, p.text, sb.size, gw, gi]);
    // one text layer (size s, line height L); a non-exact size keeps a transform pinned at the left edge
    const layer = (key, sn, L, opacity, probe, glowKids, shadow) => {
      const k = sn.scale;
      const measure = !!(key === 'b' && p.glow && (GLOW_IMG || env.glowFor));
      const text = h(Text, { key: 't', onLayout: measure ? onGlowLayout(probe ? layout(probe) : null) : probe ? layout(probe) : undefined, numberOfLines: 1,
        style: Object.assign({ color: '#fff', fontFamily: font, fontSize: sn.size, lineHeight: L }, measure ? { alignSelf: 'flex-start', maxWidth: W } : { width: W }, shadow) }, p.text);
      const inner = glowKids ? [glowKids, text] : text;
      const box = k !== 1 ? h(View, { pointerEvents: 'none', style: { width: W, height: L, transform: [{ translateX: -W / 2 * (1 - k) }, { scale: k }] } }, inner) : inner;
      return h(Animated.View, { key, pointerEvents: 'none', style: { position: 'absolute', left: p.left, top: (p.top || 0) - L / 2, width: W, height: L, opacity } }, box);
    };
    const glowKids = copies ? h(Animated.View, { key: 'glow', pointerEvents: 'none', style: { position: 'absolute', left: 0, top: 0, width: W, height: Lb, opacity: p.glowOpacity } }, copies) : null;
    const shB = env.fakeGlow ? null : (p.glow ? SH_GLOW : SH_INACTIVE), shA = env.fakeGlow ? null : SH_INACTIVE;
    const wrapOp = p.opacity;           // collapse: the whole title fades with the column transition
    const kids = [];
    if (!two) kids.push(layer('b', sb, Lb, null, p.probe, glowKids, shB));
    else {
      // a text layer inside the growing wrapper: left-pinned static scale k, vertically centred on the wrapper's centre line
      const inWrap = (key, sn, L, opacity, probe, gk, shadow, k, top) => {
        const measure = !!(key === 'b' && p.glow && (GLOW_IMG || env.glowFor));
        const text = h(Text, { key: 't', onLayout: measure ? onGlowLayout(probe ? layout(probe) : null) : probe ? layout(probe) : undefined, numberOfLines: 1,
          style: Object.assign({ color: '#fff', fontFamily: font, fontSize: sn.size, lineHeight: L }, measure ? { alignSelf: 'flex-start', maxWidth: W } : { width: W }, shadow) }, p.text);
        const inner = gk ? [gk, text] : text;
        const box = Math.abs(k - 1) > 1e-4 ? h(View, { pointerEvents: 'none', style: { width: W, height: L, transform: [{ translateX: -W / 2 * (1 - k) }, { scale: k }] } }, inner) : inner;
        return h(Animated.View, { key, pointerEvents: 'none', style: { position: 'absolute', left: 0, top, width: W, height: L, opacity } }, box);
      };
      kids.push(h(Animated.View, { key: 'w', pointerEvents: 'none', style: { position: 'absolute', left: p.left, top: (p.top || 0) - Lb / 2, width: W, height: Lb, transform: [{ translateX: tr.tx }, { scale: tr.k }] } },
        inWrap('a', sa, La, tr.a, null, null, shA, sa.scale, (Lb - La) / 2), inWrap('b', sb, Lb, tr.b, p.probe, glowKids, shB, sb.scale / tr.K, 0)));
    }
    return h(Animated.View, { pointerEvents: 'none', style: { position: 'absolute', left: 0, top: 0, width: V.W, height: 0, opacity: wrapOp } }, kids);
  }, (a, b) => a.text === b.text && a.i === b.i && a.pos === b.pos && a.focusedStatic === b.focusedStatic && a.left === b.left && a.top === b.top &&
    a.opacity === b.opacity && !!a.glow === !!b.glow && a.glowOpacity === b.glowOpacity && a.probe === b.probe);

  const SH_INACTIVE = { textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 };
  const SH_GLOW = { textShadowColor: 'rgba(255,255,255,0.85)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: V.TEXT_GLOW_RADIUS };
  const SH_GLOW_IN = { textShadowColor: 'rgba(255,255,255,0.5)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: V.TEXT_GLOW_INNER_RADIUS };

  // ---- focus background (PS3 XMB): after a dwell on a mapped item a full-screen picture replaces the wave:
  //   * Photo Gallery & co (xmb-web HOVER_BG): a fixed picture, alpha HOVER_BG_MAX_ALPHA
  //   * Game category (games and apps): the title's own background (pic0 / pic1 candidates tried in order), alpha 1, and every OTHER row's
  //     name fades away (ctl.setDim); they come back fast as soon as the cursor moves. The host is told about the dwell (env.onDwell(item.raw))
  //     so it can start the title's own music, and about its end (env.onDwellEnd()).
  // V38: every candidate picture is checked once by the host (env.artCheck: 'ok' | 'blank' | 'missing'); a title with no usable picture shows NO
  // background and its neighbours keep their names. Results are kept for the whole session.
  const artState = {};
  const checkArt = (uri, cb) => {
    if (!env.artCheck) { cb('ok'); return; }
    const c = artState[uri];
    if (c === 'ok' || c === 'bad') { cb(c); return; }
    if (Array.isArray(c)) { c.push(cb); return; }
    artState[uri] = [cb];
    env.artCheck(uri, (r) => { const q = artState[uri]; artState[uri] = r === 'ok' ? 'ok' : 'bad'; q.forEach((f) => f(artState[uri])); });
  };
  const resolveArt = (cands, cb) => {
    let i = 0;
    const next = () => { if (i >= cands.length) { cb(null); return; } const u = cands[i++]; checkArt(u, (r) => (r === 'ok' ? cb(u) : next())); };
    next();
  };
  function CinfoBg(p) {
    const ctl = p.ctl, T = spec.timings, map = spec.hoverBg || {};
    useVersion(ctl);
    // the target is worked out from the controller state at the moment it is needed: V39 renders React only once the cursor rests, so a
    // D-pad step calls ctl.bgRetarget() itself (the picture fades and the names come back on the step, not ~110 ms later at the render)
    const targetOf = () => {
      const cur = ctl.current(), item = cur.item;
      if (!item) return null;
      if (ctl.state.stack.length !== 0 && !(item.art && item.art.length)) return null;   // V69: a game inside a folder keeps its picture / music
      if (item.art && item.art.length) return { key: 'g:' + (item.gid || item.n), cands: item.art, item, game: true };
      if (map[item.n] && env.assetSource) return { key: 'p:' + map[item.n], cands: [env.assetSource(map[item.n]).uri], item };
      return null;
    };
    const a = React.useRef(null); if (!a.current) a.current = new Animated.Value(0);
    const shown = React.useRef(''), timer = React.useRef(null), tgt = React.useRef(null), curKey = React.useRef(null);
    const uriRef = React.useRef(null), loaded = React.useRef({}), res = React.useRef({ key: '', done: false, uri: null, waiters: [] });
    const [uri, setUriState] = React.useState(null);
    const setUri = (u) => { uriRef.current = u; setUriState(u); };
    const fadeIn = (t) => {
      Animated.timing(a.current, { toValue: t.game ? 1 : T.HOVER_BG_MAX_ALPHA, duration: T.HOVER_BG_FADE_IN_MS, useNativeDriver: nativeDriver }).start();
      if (t.game) ctl.setDim(true);
    };
    // show picture u for the current target. Re-focusing a title whose picture is already on screen / loaded gets no new Image onLoad, so the
    // fade is started directly (V37 waited for an onLoad that never came: the picture never came back until another title was visited).
    const reveal = (u, t) => {
      a.current.setValue(0);
      if (uriRef.current === u && loaded.current[u]) fadeIn(t); else setUri(u);
    };
    const retarget = () => {
      const target = targetOf(), key = target ? target.key : '';
      tgt.current = target;
      if (key === curKey.current) return;
      curKey.current = key;
      clearTimeout(timer.current);
      if (shown.current && shown.current !== key) {
        shown.current = '';
        Animated.timing(a.current, { toValue: 0, duration: T.HOVER_BG_FADE_OUT_MS, useNativeDriver: nativeDriver }).start();
        ctl.setDim(false);
        if (env.onDwellEnd) env.onDwellEnd();
      }
      if (target && shown.current !== key) {
        const r = res.current = { key, done: false, uri: null, waiters: [] };
        const dw = ctl.state.dwell >= 0 ? ctl.state.dwell : T.HOVER_BG_DWELL_MS;
        timer.current = setTimeout(() => {
          const t = tgt.current; if (!t || t.key !== key) return;
          shown.current = key;
          if (env.onDwell) env.onDwell(t.item.raw || t.item);      // the title's own music does not depend on its picture
          const go = (u) => { if (shown.current !== key || !u) return; reveal(u, t); };
          if (r.done) go(r.uri); else r.waiters.push(go);
        }, dw);
        // the picture check starts a moment into the dwell (not on every step of a held D-pad); its result is in long before the dwell ends
        setTimeout(() => {
          if (curKey.current !== key) return;
          (target.game ? resolveArt : (c, cb) => cb(c[0]))(target.cands, (u) => { r.done = true; r.uri = u; r.waiters.forEach((f) => f(u)); r.waiters = []; });
        }, Math.min(150, Math.max(0, dw - 60)));
      }
    };
    ctl.bgRetarget = retarget;
    React.useEffect(() => { retarget(); });
    React.useEffect(() => () => { clearTimeout(timer.current); ctl.bgRetarget = null; }, []);
    if (!uri) return null;
    const onLoad = () => {
      loaded.current[uriRef.current] = true;
      const t = tgt.current; if (!t || shown.current !== t.key || res.current.uri !== uriRef.current) return;
      fadeIn(t);
    };
    const onError = () => {
      const bad = uriRef.current; if (bad) artState[bad] = 'bad';
      const t = tgt.current; if (!t || shown.current !== t.key) { setUri(null); return; }
      resolveArt(t.cands, (u) => { if (tgt.current && tgt.current.key === t.key && shown.current === t.key && u && u !== bad) { res.current.uri = u; reveal(u, t); } else setUri(null); });
    };
    return h(Animated.View, { pointerEvents: 'none', style: Object.assign({}, FILL, { opacity: a.current }) },
      h(Image, { source: { uri }, resizeMode: 'cover', onLoad, onError, style: { width: V.W, height: V.H } }),
      h(View, { style: Object.assign({}, FILL, { backgroundColor: 'rgba(0,0,0,0.22)' }) }));   // keeps the white labels readable on bright pictures
  }

  // ---- category bar: one memoised component per category, its animated nodes built once (they only change when it gains/loses focus)
  const CatItem = memo(function CatItem(p) {
    const { ctl, c, i, act } = p;
    const sn = snap(V.CAT_LABEL_SIZE), CL = lh(sn.size), box = V.CAT_ICON_ACTIVE, half = box / 2;
    const n = useMemo(() => {
      const CS = core.CAT_SUB;   // V53: the focused category slides, the others barely move and fade
      const subScale = interp(ctl.catSub, act ? CS.scale : CS.otherScale), subA = interp(ctl.catSub, CS.alpha);
      const tx = A.add(A.add(interp(ctl.catPos, core.CAT.x(i)), interp(ctl.catSub, act ? CS.shiftX : CS.otherShiftX)), ctl.slotDx[i]);   // V76: + the slot's re-order slide
      const ty = A.add(interp(ctl.catPos, core.CAT.y(i), -half), interp(ctl.catSub, act ? CS.shiftY : CS.otherShiftY));
      let alpha = A.mul(interp(ctl.catPos, core.CAT.alpha(i)), subA);
      if (!act) alpha = A.mul(alpha, interp(ctl.catSub, core.CAT_SUB.otherAlpha));
      const scale = A.mul(interp(ctl.catPos, core.CAT.scale(i, c.sk || c.icon)), subScale);
      const labelA = A.mul(interp(ctl.catPos, core.CAT.labelAlpha(i)), act ? interp(ctl.catSub, core.CAT_SUB.labelAlpha) : null);
      const mid = iconMip(c.icon, '_m');
      const big = mid ? interp(ctl.catPos, core.forElement(i, [[-1, 0], [-0.7, 0], [0, 1], [0.7, 0], [1, 0]])) : null;
      const small = mid ? interp(ctl.catPos, core.forElement(i, [[-1, 1], [-0.7, 1], [0, 0], [0.7, 1], [1, 1]])) : null;
      return { tx, ty, alpha, scale, labelA, mid, big, small };
    }, [ctl, i, act, c.sk || c.icon]);
    const txt = h(Text, { onLayout: act ? layout('full-cat') : undefined, numberOfLines: 1, style: { width: 400, textAlign: 'center', fontFamily: font, fontSize: sn.size, lineHeight: CL, color: 'rgb(225,210,235)' } }, c.name);
    return h(React.Fragment, null,
      h(Animated.View, { pointerEvents: 'none', style: { position: 'absolute', left: -half, top: 0, width: box, height: box, opacity: n.alpha, transform: [{ translateX: n.tx }, { translateY: n.ty }, { scale: n.scale }] } },
        shifted(c.icon, box, n.mid
          ? [h(Animated.View, { key: 'b', pointerEvents: 'none', style: { position: 'absolute', left: 0, top: 0, width: box, height: box, opacity: n.big } }, h(Image, { source: env.iconSource(c.icon), resizeMode: 'contain', style: { width: box, height: box } })),
             h(Animated.View, { key: 's', pointerEvents: 'none', style: { position: 'absolute', left: 0, top: 0, width: box, height: box, opacity: n.small } }, h(Image, { source: n.mid, resizeMode: 'contain', style: { width: box, height: box } }))]
          : h(Image, { source: env.iconSource(c.icon), resizeMode: 'contain', style: { width: box, height: box } }))),
      h(Animated.View, { pointerEvents: 'none', style: { position: 'absolute', left: -200, top: 0, width: 400, height: 40, opacity: n.labelA, transform: [{ translateX: n.tx }] } },
        h(View, { style: { position: 'absolute', left: 0, top: V.CAT_LABEL_Y - 2, width: 400, height: CL, transform: Math.abs(sn.scale - 1) > 0.02 ? [{ scale: sn.scale }] : [] } }, txt)));
  }, (a, b) => a.ctl === b.ctl && a.c === b.c && a.i === b.i && a.act === b.act && a.name === b.name && a.icon === b.icon);

  function CategoryBar(p) {
    const { ctl } = p, st = ctl.state;
    return h(View, { style: FILL, pointerEvents: 'none' }, ctl.categories.map((c, i) => h(CatItem, { key: 's' + i, ctl, c, i, act: i === st.ci, name: c.name, icon: c.icon })));
  }

  // ---- one list row. mode: 'root' (category column) | 'child' (submenu column)
  // Memoised on a signature of what is drawn, with every animated node built once: moving the focus re-renders only the rows whose
  // focus-relative flags (focused / near) changed; the others keep their native nodes untouched.
  const K = (ctl, v) => interp(ctl.zero, constTr(v));
  // V46: a category list NEVER switches to a separate "parent column" when a submenu opens. Its rows always carry the submenu collapse as
  // extra terms driven by colT (0 = no submenu, 1 = submenu open) on top of their normal position: the same nodes before, during and after
  // the submenu - closing it cannot snap or re-create anything (V45: the focused name came back small and grew a moment later).
  // The terms depend on e = pos - i only (pos stays on the selected row while a submenu is open), as xmb-web's parent layout.
  const SUBD = (() => {
    // V53: PS3 values measured on the RPCS3 recording (core.SUB.PS3): opened item -262 / full size / 0.65, the others -110 / x0.94 / 0.12
    const P3 = core.SUB.PS3, E = [-30, -1, 0, 1, 30];
    const fullA = (d) => (d === 0 ? V.ALPHA_FOCUS : V.ALPHA_INACTIVE), setA = (d) => (d === 0 ? P3.parentAlpha : P3.sibAlpha);
    const ratio = []; for (let e = -14; e <= 14; e++) ratio.push([e, setA(Math.abs(e)) / fullA(Math.abs(e)) - 1]);
    return {
      dy: (i) => core.forElement(i, E.map((e) => [e, core.SUB.sibDy(e)])),
      dx: (i) => core.forElement(i, [[-1, core.SUB.SIB_X - V.ITEM_ICON_X], [0, V.PARENT_COL_X - V.ITEM_ICON_X], [1, core.SUB.SIB_X - V.ITEM_ICON_X]]),
      da: (i) => core.forElement(i, ratio),
      ds: (i, sk, compact) => { const sm = ((compact ? P3.childIconSmall : V.ITEM_ICON_SIZE) / V.ITEM_ICON_ACTIVE) * core.iconScale(sk), d = sm * (P3.sibScale - 1); return core.forElement(i, [[-1, d], [0, 0], [1, d]]); },
    };
  })();
  // V41: game / app icons. The PS5 shrinks a 512 px icon0 to 78 px with no mipmaps: it shimmered and flickered while the list moved. The host
  // makes properly filtered 96 px (rows) and 180 px (focus) copies once (env.iconLevels, cached on disk); they cross-fade like the mip
  // levels of the glass icons. Until they exist the original picture is used.
  const levels = {};
  const GameIcon = memo(function GameIcon(p) {
    const [lv, setLv] = React.useState(levels[p.src] || null);
    // V44: a picture with alternatives (user pictures: profile-cache URIs in several spellings) moves to the next one when it fails,
    // and to the item's own XMB icon when none loads
    const [alt, setAlt] = React.useState(0);
    const srcs = [p.src].concat(p.alts || []);
    // V61: a picture source that neither loads nor errors (the PS5 then shows a broken-picture mark) is left after 3 s; a user's picture
    // is invisible until it has really loaded, so the icon under it is never covered by a broken one
    const [shown, setShown] = React.useState(-1);
    const shownRef = React.useRef(-1); shownRef.current = shown;
    React.useEffect(() => {
      if (lv || !p.under || alt >= srcs.length || typeof setTimeout !== 'function') return undefined;
      const t = setTimeout(() => { if (shownRef.current !== alt) setAlt((a) => (a === alt ? alt + 1 : a)); }, 3000);
      return () => clearTimeout(t);
    }, [alt, lv, p.under, srcs.length]);
    React.useEffect(() => {
      if (!/^file:\/\//.test(p.src)) return undefined;   // only files on disk get filtered copies
      if (levels[p.src] !== undefined) { if (levels[p.src] !== lv) setLv(levels[p.src]); return undefined; }
      let live = true;
      env.iconLevels(p.src, (r) => { levels[p.src] = r || null; if (live && r) setLv(r); });
      return () => { live = false; };
    }, [p.src]);
    const img = (key, uri, op, onError, onLoad) => h(Animated.View, { key, pointerEvents: 'none', style: { position: 'absolute', left: 0, top: 0, width: p.box, height: p.box, opacity: op } },
      h(Image, { source: typeof uri === 'string' ? { uri } : uri, resizeMode: 'contain', onError, onLoad, style: { width: p.box, height: p.box } }));
    if (!lv) {
      if (alt >= srcs.length || p.thumb) return img('f', env.iconSource(p.fallback), null);   // V48: screenshots wait for their small copy
      // V47: a user picture sits ON the user icon: a picture the system draws empty (no error, nothing shown) still leaves the icon visible
      if (p.under) return [img('u', env.iconSource(p.fallback), null), img('o' + alt, srcs[alt], shown === alt ? null : 0, () => setAlt(alt + 1), () => setShown(alt))];
      return img('o' + alt, srcs[alt], null, () => setAlt(alt + 1));
    }
    return p.big ? [img('b', 'file://' + lv.b, p.big), img('s', 'file://' + lv.s, p.small)] : img('s', 'file://' + lv.s, null);
  }, (a, b) => a.src === b.src && a.big === b.big && a.small === b.small && a.box === b.box && (a.alts || []).join('|') === (b.alts || []).join('|'));
  const BADGE = { x: 560, w: 112, h: 25 };   // V79: from the PS3's own row; V80: closer to the date and a little smaller
  const Row = memo(function Row(p) {
    const { ctl, it, i, pos, near, focused, compact, collapse, collapseIdx, fast } = p;
    const item = it;
    const iconBox = V.ITEM_ICON_ACTIVE, half = iconBox / 2, sk = scaleKey(item);
    const textX = compact ? core.SUB.PS3.childTextX : V.ITEM_TEXT_X;   // V53: submenu rows: title at x 622 (PS3)
    const n = useMemo(() => {
      let ty, tx = null, alpha, iconScale, textMul = null, icBig = null, icSmall = null, dimMul = null;
      const mip = !item.src ? iconMip(item.i, '_s') : null, lv = !!(item.src && env.iconLevels);
      if (collapse) {
        // parent column while a submenu is open: everything driven by colT (the parent's index is frozen at collapseIdx)
        const P = core.SUB.parent(i, collapseIdx);
        ty = interp(ctl.colT, P.y);
        tx = interp(ctl.colT, { inputRange: [0, 1], outputRange: [0, (P.sel ? V.PARENT_COL_X : core.SUB.SIB_X) - V.ITEM_ICON_X] });
        alpha = interp(ctl.colT, P.iconAlpha);
        const s0 = (P.sel ? 1 : V.ITEM_ICON_SIZE / iconBox) * core.iconScale(sk), s1 = (P.sel ? 1 : (V.ITEM_ICON_SIZE / iconBox) * core.SUB.PS3.sibScale) * core.iconScale(sk);   // V53: the opened item keeps its size
        iconScale = interp(ctl.colT, { inputRange: [0, 1], outputRange: [s0, s1] });
        textMul = interp(ctl.colT, { inputRange: [0, 1], outputRange: [1, 0] });
        if ((mip || lv) && P.sel) { icBig = K(ctl, 1); icSmall = K(ctl, 0); }
      } else {
        // V54: submenu rows: rows above mirror the rows below (330 / 505 / 680), small 37 px icons and a 86 px focused icon (PS3)
        const so = compact ? { sub: true } : undefined;
        ty = interp(pos, core.ITEM.y(i, so));
        alpha = interp(pos, core.ITEM.alpha(i, so));
        iconScale = compact ? interp(pos, core.ITEM.iconScale(i, sk, { activeIcon: core.SUB.PS3.childIcon, inactiveIcon: core.SUB.PS3.childIconSmall }))
          : interp(pos, core.ITEM.iconScale(i, sk));
        if (compact) iconScale = A.mul(iconScale, core.SUB.PS3.childIcon / iconBox);
        if (p.shiftX) tx = p.shiftX;
        if (p.alphaMul) alpha = A.mul(alpha, p.alphaMul);
        if (p.sub) {   // V46: the submenu collapse, always present (0 while no submenu is open). V55: submenu lists too (their own level)
          const cf = p.subT || ctl.colT;
          ty = A.add(ty, A.mul(cf, interp(pos, SUBD.dy(i))));
          tx = A.mul(cf, interp(pos, SUBD.dx(i)));
          alpha = A.mul(alpha, A.add(A.mul(cf, interp(pos, SUBD.da(i))), K(ctl, 1)));
          iconScale = A.add(iconScale, A.mul(cf, interp(pos, SUBD.ds(i, sk, compact))));
          textMul = p.subTxt || ctl.subText;   // V53: gone at once when a submenu opens, back with the move when it closes (PS3)
        }
        // names of the rows other than the focused one fade out with ctl.dimV (never the focused row: inactiveOpacity is 0 at the focus)
        if (!compact) dimMul = interp(A.mul(ctl.dimV, interp(pos, core.ITEM.inactiveOpacity(i))), { inputRange: [0, 1], outputRange: [1, 0] });
        if ((mip || lv) && !compact) {   // big (256 px) layer at / near the focus, 96 px layer for the small rows
          icBig = interp(pos, core.forElement(i, [[-1, 0], [-0.7, 0], [0, 1], [0.7, 0], [1, 0]]));
          icSmall = interp(pos, core.forElement(i, [[-1, 1], [-0.7, 1], [0, 0], [0.7, 1], [1, 1]]));
        }
      }
      const ttlOp = A.mul(collapse ? textMul : A.mul(dimMul, textMul), ctl.optTxt);   // V62: names dim while the Triangle panel is open
      return { ty, tx, alpha, iconScale, textMul, mip, lv, icBig, icSmall, dimMul, ttlOp };
    }, [ctl, i, sk, pos, compact, collapse, collapse ? collapseIdx : 0, p.shiftX, p.alphaMul, !!p.sub, p.subT, p.subTxt]);
    // V43: in a collapsing / re-opening parent column the focused row keeps its glow and description, faded by the transition (p.fadeIn)
    const glowOn = (collapse ? focused && !!p.fadeIn : near) && !p.noGlow && !fast;
    const glowA = useMemo(() => (glowOn ? A.mul(A.mul(collapse ? p.fadeIn : interp(pos, core.ITEM.activeOpacity(i)), ctl.pulse ? interp(ctl.pulse, PULSE_TR) : null), A.mul(collapse ? null : n.textMul, ctl.optGlow)) : undefined),
      [glowOn, pos, i, ctl, collapse, p.fadeIn, n.textMul]);
    const wantDesc = !!((item.d || item.b) && (collapse ? focused && !!p.fadeIn : near) && !fast);
    const descA = useMemo(() => {
      if (!wantDesc) return null;
      if (collapse) return { a: A.mul(interp(p.fadeIn, { inputRange: [0, 1], outputRange: [0, 0.7] }), ctl.optTxt), b: null };
      const b = interp(pos, core.ITEM.descInactive(i));
      return { a: A.mul(A.mul(interp(pos, core.ITEM.descActive(i)), n.textMul), ctl.optTxt), b: A.mul(A.mul(n.dimMul ? A.mul(b, n.dimMul) : b, n.textMul), ctl.optTxt) };
    }, [wantDesc, pos, i, n.dimMul, collapse, p.fadeIn, n.textMul]);
    const pulseA = useMemo(() => (focused && !collapse && ctl.pulse && !env.fakeGlow ? interp(ctl.pulse, { inputRange: [0, 1], outputRange: [V.PULSE_INNER_MIN, V.PULSE_INNER_MAX] }) : null), [focused && !collapse, ctl]);

    const rowStyle = { position: 'absolute', left: 0, top: 0, width: V.W, height: 0, opacity: n.alpha, transform: [{ translateY: n.ty }].concat(n.tx ? [{ translateX: n.tx }] : []) };
    const text = item.n;
    const kids = [];
    const bigImg = (op) => h(Animated.View, { key: 'ib', pointerEvents: 'none', style: { position: 'absolute', left: 0, top: 0, width: iconBox, height: iconBox, opacity: op } },
      h(Image, { source: iconSrc(item), resizeMode: 'contain', style: { width: iconBox, height: iconBox } }));
    const smallImg = (op) => h(Animated.View, { key: 'is', pointerEvents: 'none', style: { position: 'absolute', left: 0, top: 0, width: iconBox, height: iconBox, opacity: op } },
      h(Image, { source: n.mip, resizeMode: 'contain', style: { width: iconBox, height: iconBox } }));
    const iconKids = n.lv ? h(GameIcon, { key: 'gi', src: item.src, alts: item.alts, under: !!item.alts, thumb: !!item.thumb, fallback: item.i, big: n.icBig, small: n.icSmall, box: iconBox })
      : !n.mip ? bigImg(null) : n.icBig ? [bigImg(n.icBig), smallImg(n.icSmall)] : smallImg(null);   // static small rows only need the 96 px level
    kids.push(h(Animated.View, { key: 'ic', pointerEvents: 'none', style: { position: 'absolute', left: V.ITEM_ICON_X - half, top: -half, width: iconBox, height: iconBox, transform: [{ scale: n.iconScale }] } }, item.src ? iconKids : shifted(item.i, iconBox, iconKids)));
    // title: one layer, size 30 <-> 34 by transform, white; halo only for rows next to the focus
    kids.push(h(TitleLabel, { key: 'ttl', text, i, pos: collapse ? null : pos, zero: ctl.zero, focusedStatic: collapse && focused, left: textX, top: focused || !collapse ? -1 : 1,
      opacity: n.ttlOp, glow: glowOn, glowOpacity: glowA, probe: focused ? 'full-item' : null }));
    // pulse breathing inner halo for engines that do native textShadow
    if (pulseA) kids.push(h(Label, { key: 'glow', text, size: V.ITEM_TEXT_ACTIVE_SIZE, left: textX, top: -1, color: '#fff', shadow: SH_GLOW_IN, opacity: A.mul(A.mul(pulseA, n.textMul), ctl.optGlow) }));
    // descriptions: long help under the focused row, short status under the others
    if (descA && item.b) {
      // V79: the PS3's format badge (a picture: see-through letters, white by day / black by night) far right on the date line, as on the
      // PS3 (Call of Duty 3 ... [PS3]); the date line itself stays as it was
      if (item.d) kids.push(h(Label, { key: 'dsc', text: item.d, size: V.ITEM_DESC_SIZE, lh: V.ITEM_DESC_SIZE + 4, lines: 1, width: BADGE.x - 20, left: textX, top: V.ITEM_DESC_OFFSET + 4,
        color: 'rgb(235,235,235)', opacity: descA.a, shadow: SH_INACTIVE }));
      kids.push(h(Animated.View, { key: 'dsb', pointerEvents: 'none', style: { position: 'absolute', left: textX + BADGE.x, top: V.ITEM_DESC_OFFSET + 4 - BADGE.h / 2, width: BADGE.w, height: BADGE.h, opacity: descA.a } },
        h(Image, { source: env.iconSource(item.b), resizeMode: 'stretch', style: { width: BADGE.w, height: BADGE.h } })));
    }
    if (descA && !item.b) {
      kids.push(h(Label, { key: 'dsc', text: item.d, size: V.ITEM_DESC_SIZE, lh: V.ITEM_DESC_SIZE + 4, lines: 3, width: V.W - textX - 200, left: textX, top: V.ITEM_DESC_OFFSET + 4,
        color: 'rgb(235,235,235)', opacity: descA.a, shadow: SH_INACTIVE }));
      if (descA.b && item.d && item.d.length < 20 && !item.ns) kids.push(h(Label, { key: 'dsi', text: item.d, size: V.ITEM_TEXT_SIZE - 8, left: textX, top: 22, color: 'rgb(235,235,235)', opacity: descA.b, shadow: SH_INACTIVE }));
    }
    // value, right aligned (submenu rows)
    // V53: value column as on the PS3: left-aligned at x 1301, 20 px
    if (compact && item.v) kids.push(h(Label, { key: 'val', text: item.v, size: core.SUB.PS3.valueSize, left: core.SUB.PS3.valueX, top: 2, width: V.W - core.SUB.PS3.valueX - 40, align: 'left', color: 'rgb(245,240,250)', opacity: A.mul(n.textMul, ctl.optTxt), shadow: SH_INACTIVE }));
    return h(Animated.View, { style: rowStyle, pointerEvents: 'none' }, kids);
  }, (a, b) => a.sig === b.sig && a.i === b.i && a.ctl === b.ctl && a.pos === b.pos && a.near === b.near && a.focused === b.focused && a.compact === b.compact &&
    a.collapse === b.collapse && a.collapseIdx === b.collapseIdx && a.shiftX === b.shiftX && a.alphaMul === b.alphaMul && a.noGlow === b.noGlow && a.fast === b.fast && a.fadeIn === b.fadeIn && a.sub === b.sub && a.subT === b.subT && a.subTxt === b.subTxt);

  // rows that can be on screen: 3 above the focus (the 2nd is already off the top), 8 below (the 7th is at the bottom edge) + 1 for travel
  const sigOf = (it) => (it.n || '') + '|' + (it.i || '') + '|' + (it.src || '') + '|' + (it.alts ? it.alts.join(',') : '') + '|' + (it.d || '') + '|' + (it.v || '') + '|' + (it.ns ? 1 : 0) + '|' + (it.b || '');
  function Column(p) {
    const { ctl, items, pos, focusIdx } = p, up = p.up == null ? 12 : p.up, down = p.down == null ? 18 : p.down;
    // V41: a list of up to 80 rows is mounted WHOLE: fast scrolling never mounts a row (or decodes an icon) while it moves - it is pure native
    // motion, like xmb-web's canvas. Longer lists keep a wide window around the focus.
    const all = !!p.whole && items.length <= 80 && !p.collapse;
    const lo = all ? 0 : Math.max(0, focusIdx - up), hi = all ? items.length - 1 : Math.min(items.length - 1, focusIdx + down), rows = [];
    for (let i = lo; i <= hi; i++) {
      const it = items[i], e0 = focusIdx - i;
      rows.push(h(Row, { key: p.keyPrefix + i, ctl, it, sig: sigOf(it), i, pos, near: Math.abs(e0) <= 1, focused: e0 === 0, compact: p.compact, collapse: p.collapse, collapseIdx: p.collapse ? focusIdx : 0,
        noGlow: p.noGlow, fast: !!ctl.state.fast, fadeIn: p.collapse ? p.fadeIn : undefined, sub: !!p.sub, subT: p.subT, subTxt: p.subTxt }));
    }
    // V44: the column's slide + fade (category switch, submenu) is ONE transform / opacity on the column, not one per row
    const colStyle = Object.assign({}, FILL, p.alphaMul ? { opacity: p.alphaMul } : null, p.shiftX ? { transform: [{ translateX: p.shiftX }] } : null);
    return h(Animated.View, { style: colStyle, pointerEvents: 'none' }, rows);
  }

  // ------------------------------------------------------------------ V62: the PS3 Triangle options panel
  // From the 4.93 system_plugin.rco textures (tex_optionmenu_bg / _line, make_optmenu_asset.py) and RPCS3 1080p frames: a soft grey band
  // from x 1320 (536 px, fading out by ~1770) with a thin white edge line, the options at x 1335 from y 551, 40 px apart, 26 px text; the
  // focused one white with the halo, the others light grey. An option with options of its own shows a small right arrow at x 1515; when it
  // is opened its panel moves 213 px left (a strip, the opened option marked with a left arrow at x 1296) and the new panel takes x 1320.
  // V63: items marked `head` (the PS3's "Sort By") form their own group at the top (y 270); `mark` = the active sort's down arrow after the name
  const OPT = { x: 1320, w: 536, lineW: 4, textX: 15, y0: 551, headY: 270, pitch: 40, size: 26, slide: 192, nest: 213, arrowX: 188, markX: 176, markGap: 10, shift: [0, -192, -372] };
  const OptLabel = memo(function OptLabel(p) {
    // V70: a level that has become the strip (a list opened to its right) keeps its names inside the strip: a long one ends in "..."
    // instead of running under the list on its right ("Remove from Folder" under "New Folder")
    const sn = snap(OPT.size), L = lh(sn.size), W = p.clip || 440, k = sn.scale;
    const gkey = p.text + '|' + sn.size + '|' + L;
    const [gi, setGi] = React.useState(glowMeta[gkey] === undefined ? null : glowMeta[gkey]);
    React.useEffect(() => {
      if (!p.glow || !env.glowFor) return undefined;
      if (glowMeta[gkey] !== undefined) { if (glowMeta[gkey] !== gi) setGi(glowMeta[gkey]); return undefined; }
      let live = true;
      env.glowFor(p.text, sn.size, L, (info) => { glowMeta[gkey] = info || false; if (live) setGi(glowMeta[gkey]); });
      return () => { live = false; };
    }, [!!p.glow, gkey]);
    let halo = null;
    if (p.glow && env.glowFor && gi) halo = h(GlowPic, { key: 'g' + (gi.again ? 'r' : ''), path: gi.p, left: -gi.pad, top: -gi.pad, w: gi.w, h: gi.h,
      onFail: () => glowAgain(gkey, (cb) => env.glowFor(p.text, sn.size, L, cb), setGi) });
    else if (p.glow && GLOW_IMG && !(env.glowFor && gi === null)) {
      const tw = Math.round(String(p.text).length * sn.size * 0.5), gh = Math.round(GLOW_H * 0.8), top = L / 2 - gh / 2, mid = Math.max(0, tw - 64);
      const img = (key, src, left, width) => h(Image, { key, source: src, resizeMode: 'stretch', style: { position: 'absolute', left, top, width, height: gh } });
      halo = [img('gl', GLOW_IMG.l, -GLOW_PAD, GLOW_CAP), mid ? img('gm', GLOW_IMG.m, 32, mid) : null, img('gr', GLOW_IMG.r, tw - 32, GLOW_CAP)];
    }
    // the sort mark sits 10 px after the name: the name's real width once it is laid out (an estimate until then)
    const [tw, setTw] = React.useState(0);
    const onTw = p.mark || p.arrow || p.back ? (e) => { const w = Math.round(e && e.nativeEvent && e.nativeEvent.layout ? e.nativeEvent.layout.width : 0); if (w > 0 && w <= W && Math.abs(w - tw) > 1) setTw(w); } : undefined;
    const text = h(Text, { key: 't', numberOfLines: 1, ellipsizeMode: 'tail', onLayout: onTw, style: Object.assign({ fontFamily: font, fontSize: sn.size, lineHeight: L, color: p.glow ? '#fff' : 'rgb(229,229,229)' },
      p.mark || p.arrow || p.back || p.clip ? { alignSelf: 'flex-start', maxWidth: W } : { width: W }, env.fakeGlow ? {} : (p.glow ? SH_GLOW : SH_INACTIVE)) }, p.text);
    const markEl = p.mark && env.optArrowD ? h(Image, { key: 'mk', source: env.optArrowD, resizeMode: 'stretch',
      style: { position: 'absolute', left: (tw || Math.round(String(p.text).length * sn.size * 0.52)) + OPT.markGap, top: L / 2 - 7, width: 22, height: 15 } }) : null;
    // V69: the right arrow of an option with a list of its own sits in the PS3's arrow column, or after a longer name (it was inside the
    // "r" of "Add to Folder")
    const estW = Math.round(String(p.text).length * sn.size * 0.52);
    const arrowEl = p.arrow && env.optArrowR ? h(Image, { key: 'ar', source: env.optArrowR, resizeMode: 'stretch',
      style: { position: 'absolute', left: Math.max(OPT.arrowX - OPT.textX, (tw || estW) + 22), top: L / 2 - 7, width: 16, height: 14 } }) : null;
    const backEl = p.back && env.subArrow ? h(Image, { key: 'bk', source: env.subArrow, resizeMode: 'stretch',
      style: { position: 'absolute', left: Math.max(OPT.markX - OPT.textX, Math.min(W, tw || estW) + 10), top: L / 2 - 7, width: 16, height: 14 } }) : null;
    const inner = [halo ? h(View, { key: 'h', pointerEvents: 'none', style: { position: 'absolute', left: 0, top: 0, width: W, height: L } }, halo) : null, text, markEl, arrowEl, backEl];
    const box = Math.abs(k - 1) > 0.02 ? h(View, { pointerEvents: 'none', style: { width: W, height: L, transform: [{ translateX: -W / 2 * (1 - k) }, { scale: k }] } }, inner) : inner;
    return h(View, { pointerEvents: 'none', style: { position: 'absolute', left: p.left, top: p.top - L / 2, width: W, height: L, opacity: p.dim ? 0.8 : 1 } }, box);
  }, (a, b) => a.text === b.text && a.glow === b.glow && a.dim === b.dim && a.left === b.left && a.top === b.top && !!a.mark === !!b.mark && !!a.arrow === !!b.arrow && !!a.back === !!b.back && a.clip === b.clip);
  function OptPanel(p) {
    const ctl = p.ctl, st = ctl.state, lvls = (st.opt.length ? st.opt : st.optLast || []).slice(0, 2);
    const nest = st.optNest || OPT.nest;
    const nodes = useMemo(() => [0, 1].map((k) => ({
      x: interp(ctl.optV, { inputRange: [k, k + 1, k + 2], outputRange: [OPT.slide, 0, -nest] }),
      a: interp(ctl.optV, { inputRange: [k, k + 1], outputRange: [0, 1] }),
    })), [ctl, nest]);
    if (!lvls.length) return null;
    // row centres of one level: its `head` items from y 270, the others from `y0`
    // V76: a second group (grp: the column options) sits between the top group and the title's own options, one empty row from each
    const rowsY = (lv, y0) => {
      const nh = lv.items.filter((it) => it.head).length, ng = lv.items.filter((it) => it.grp).length;
      const gStart = y0 - 2 * OPT.pitch - (ng - 1) * OPT.pitch;
      const hStart = ng ? Math.min(OPT.headY, gStart - 2 * OPT.pitch - (nh - 1) * OPT.pitch) : OPT.headY;
      let hd = 0, gp = 0, rest = 0;
      return lv.items.map((it) => (it.head ? hStart + (hd++) * OPT.pitch : it.grp ? gStart + (gp++) * OPT.pitch : y0 + (rest++) * OPT.pitch));
    };
    let ys = null;
    const out = lvls.map((lv, k) => {
      const top = k === lvls.length - 1, kids = [];
      // a sub-list is placed so that its entry focused at opening (`at`) sits on its parent's row (PS3: Sort By > Format on the Sort By row)
      if (k === 0) ys = rowsY(lv, OPT.y0);
      else {
        // V74: kept on the screen (a long list - Column Icon - started above the top edge); a list longer than the screen follows the
        // cursor (the rows off the screen are not drawn)
        const n = lv.items.length, idx = lv.idx || 0, TOPY = 70, BOTY = V.H - 70;
        let y0 = (ys[lvls[k - 1].idx || 0] || OPT.y0) - (lv.at || 0) * OPT.pitch;
        if (y0 + (n - 1) * OPT.pitch > BOTY) y0 = BOTY - (n - 1) * OPT.pitch;
        if (y0 < TOPY) y0 = TOPY;
        if (y0 + idx * OPT.pitch > BOTY) y0 = BOTY - idx * OPT.pitch;
        ys = rowsY(lv, y0);
      }
      kids.push(env.optBg ? h(Image, { key: 'bg', source: env.optBg, resizeMode: 'stretch', style: { position: 'absolute', left: 0, top: 0, width: OPT.w, height: V.H } })
        : h(View, { key: 'bg', style: { position: 'absolute', left: 0, top: 0, width: 420, height: V.H, backgroundColor: 'rgba(79,79,84,0.55)' } }));
      kids.push(env.optLine ? h(Image, { key: 'ln', source: env.optLine, resizeMode: 'stretch', style: { position: 'absolute', left: 0, top: 0, width: OPT.lineW, height: V.H } })
        : h(View, { key: 'ln', style: { position: 'absolute', left: 1, top: 0, width: 2, height: V.H, backgroundColor: 'rgba(255,255,255,0.25)' } }));
      lv.items.forEach((it, j) => {
        const y = ys[j], foc = j === lv.idx;
        if (y < 40 || y > V.H - 40) return;   // V74: off the screen
        kids.push(h(OptLabel, { key: 'o' + j, text: it.n, left: OPT.textX, top: y, glow: top && foc, dim: !top, mark: !!it.mark, arrow: top && !!it.ch, back: !top && foc, clip: top ? 0 : nest - OPT.textX - 34 }));
      });
      return h(Animated.View, { key: 'lv' + k, pointerEvents: 'none', style: { position: 'absolute', left: OPT.x, top: 0, width: OPT.w, height: V.H, opacity: nodes[k].a, transform: [{ translateX: nodes[k].x }] } }, kids);
    });
    return h(View, { pointerEvents: 'none', style: FILL }, out);
  }

  // V62: the PS3 Information screen (RPCS3 4.93, 1080p): thin grey lines across the screen at y 199 and 879, the icon in a dark framed box
  // (190 px, x 729..918, from y 257), the fields as right-aligned labels ending at x 804 and values from x 844, from y 508, 40 px apart,
  // 24 px text, and "O Back" at x 1155 / y 906. The wave stays; the XMB fades out with infoV.
  const INFO = { line1: 199, line2: 879, fx: 729, fy: 257, fs: 190, labR: 804, valX: 844, y0: 508, pitch: 40, size: 24, backX: 1155, backY: 906 };
  function InfoScreen(p) {
    const ctl = p.ctl, st = ctl.state, inf = st.info || st.infoLast;
    if (!inf) return null;
    const kids = [];
    kids.push(h(View, { key: 'l1', style: { position: 'absolute', left: 0, top: INFO.line1, width: V.W, height: 1, backgroundColor: 'rgb(174,174,174)' } }));
    kids.push(h(View, { key: 'l2', style: { position: 'absolute', left: 0, top: INFO.line2, width: V.W, height: 1, backgroundColor: 'rgb(174,174,174)' } }));
    const pad = inf.pic ? 7 : 25;
    kids.push(h(View, { key: 'fr', style: { position: 'absolute', left: INFO.fx, top: INFO.fy, width: INFO.fs, height: INFO.fs, backgroundColor: 'rgba(36,36,36,0.85)', borderWidth: 1, borderColor: 'rgb(96,96,96)', borderRadius: 2 } },
      inf.icon ? h(Image, { source: inf.icon, resizeMode: 'contain', style: { position: 'absolute', left: pad - 1, top: pad - 1, width: INFO.fs - 2 * pad, height: INFO.fs - 2 * pad } }) : null));
    let y = INFO.y0;
    inf.rows.forEach((r, k) => {
      const lines = Math.min(3, r[2] || 1);
      kids.push(h(Label, { key: 'k' + k, text: String(r[0]), size: INFO.size, left: INFO.labR - 400, top: y, width: 400, align: 'right', color: 'rgb(229,229,229)', shadow: SH_INACTIVE }));
      kids.push(h(Label, { key: 'v' + k, text: String(r[1]), size: INFO.size, left: INFO.valX, top: y + (lines - 1) * 15, width: 820, lines, lh: 30, color: '#fff', shadow: SH_INACTIVE }));
      y += INFO.pitch + (lines - 1) * 30;
    });
    kids.push(h(Label, { key: 'back', text: '\u25CB  Back', size: INFO.size, left: INFO.backX, top: INFO.backY, width: 300, color: '#fff', shadow: SH_INACTIVE }));
    return h(Animated.View, { pointerEvents: 'none', style: Object.assign({}, FILL, { opacity: ctl.infoV }) }, kids);
  }

  const Chevron = memo(function Chevron(p) {
    const c = core.SUB.chevron, hgt = c.h / 2;
    // V53: the PS3 arrow shows at once and slides in from 80 to the right with the move
    const a = p.ctl.arrowV, dx = p.ctl.arrowX;   // V55: its own slide value (every open slides it in, closing to a submenu keeps it)
    // V54: the PS5 renderer does not draw border triangles, so the arrow is a PNG (env.subArrow: 28 x 24, tip at x 2.5 / y 11.5, white
    // fading toward its base like the PS3's); the border triangle stays for hosts without the asset (the preview)
    if (env.subArrow) return h(Animated.View, { pointerEvents: 'none', style: { position: 'absolute', left: c.tipX - 2.5, top: c.cy - 11.5, width: 28, height: 24, opacity: a, transform: [{ translateX: dx }] } },
      h(Image, { source: env.subArrow, style: { width: 28, height: 24 } }));
    return h(Animated.View, { pointerEvents: 'none', style: { position: 'absolute', left: c.tipX, top: c.cy - hgt, opacity: a, transform: [{ translateX: dx }] } },
      h(View, { style: { width: 0, height: 0, borderTopWidth: hgt, borderBottomWidth: hgt, borderRightWidth: c.baseX - c.tipX, borderTopColor: 'transparent', borderBottomColor: 'transparent', borderRightColor: 'rgb(240,240,240)' } }));
  }, (a, b) => a.ctl === b.ctl);

  // clock: xmb-web drawClock(): a dark wash + open-right outline with a 5-step inner glow (one PNG, env.clockBox), the ring with its glow / drop
  // shadow (env.clockRing), two white hands and "D/M H:MM" in light 26 px text, right-aligned 18 px left of the ring.
  const Clock = memo(function Clock(p) {
    const d = p.now || new Date(), two = (n) => (n < 10 ? '0' : '') + n;
    const txt = d.getDate() + '/' + (d.getMonth() + 1) + ' ' + d.getHours() + ':' + two(d.getMinutes());
    const R = V.CLOCK_ICON_R, cx = V.CLOCK_ICON_CX, cy = V.CLOCK_FRAME_Y + V.CLOCK_FRAME_H / 2;
    const hand = (len, w, deg, key) => h(View, { key, style: { position: 'absolute', left: cx - w / 2, top: cy - len, width: w, height: len, backgroundColor: 'rgba(255,255,255,0.96)', borderRadius: w / 2, transform: [{ translateY: len / 2 }, { rotate: deg + 'deg' }, { translateY: -len / 2 }] } });
    const minDeg = d.getMinutes() * 6, hourDeg = (d.getHours() % 12) * 30 + d.getMinutes() / 2;
    const HW = Math.max(2.4, R * 0.25);
    const frameW = V.W - V.CLOCK_FRAME_X;
    return h(View, { pointerEvents: 'none', style: FILL },
      env.clockBox ? h(Image, { key: 'box', source: env.clockBox, resizeMode: 'stretch', style: { position: 'absolute', left: V.CLOCK_FRAME_X, top: V.CLOCK_FRAME_Y, width: frameW, height: V.CLOCK_FRAME_H + 1 } })
        : h(View, { key: 'box', style: { position: 'absolute', left: V.CLOCK_FRAME_X, top: V.CLOCK_FRAME_Y, width: frameW, height: V.CLOCK_FRAME_H, backgroundColor: 'rgba(0,0,0,0.18)', borderTopLeftRadius: V.CLOCK_FRAME_CORNER, borderBottomLeftRadius: V.CLOCK_FRAME_CORNER } }),
      h(Label, { key: 'txt', text: txt, size: V.CLOCK_SIZE, left: cx - R - 18 - 300, top: V.CLOCK_Y + 3, width: 300, align: 'right', color: 'rgba(255,255,255,0.92)' }),
      env.clockRing ? h(Image, { key: 'ring', source: env.clockRing, style: { position: 'absolute', left: cx - 24, top: cy - 24, width: 48, height: 48 } })
        : h(View, { key: 'ring', style: { position: 'absolute', left: cx - R, top: cy - R, width: R * 2, height: R * 2, borderRadius: R, borderWidth: 2.6, borderColor: 'rgba(255,255,255,0.96)' } }),
      hand(R * 0.47, HW, hourDeg, 'hh'), hand(R * 0.69, HW, minDeg, 'mh'));
  }, (a, b) => { const x = a.now || new Date(), y = b.now || new Date(); return x.getMinutes() === y.getMinutes() && x.getHours() === y.getHours() && x.getDate() === y.getDate(); });

  // V39: an always-mounted, invisible consumer of the glow pulse. React Native STOPS a native animation when its value loses its last
  // child node: every time the glow rows were re-mounted during a scroll the pulse lost all consumers for a moment and stopped for good.
  const KeepAlive = memo(function KeepAlive(p) {
    const a = useMemo(() => interp(p.ctl.pulse, { inputRange: [0, 1], outputRange: [0, 0.001] }), [p.ctl]);
    return h(Animated.View, { pointerEvents: 'none', style: { position: 'absolute', left: 0, top: 0, width: 1, height: 1, opacity: a } });
  }, (a, b) => a.ctl === b.ctl);

  // ------------------------------------------------------------------ root
  function Xmb(p) {
    const ctl = p.controller, st = ctl.state;
    useVersion(ctl);
    // column / submenu transition nodes: built once for the controller, never per render
    const nodes = useMemo(() => ({
      colShift: ctl.categories.map((c, i) => A.add(interp(ctl.catPos, core.COLUMN.shiftX(i)), ctl.slotDx[i])),
      colAlpha: ctl.categories.map((c, i) => interp(ctl.catPos, core.COLUMN.alpha(i))),
      childX: interp(ctl.colT, core.SUB.childX), childA: interp(ctl.colT, core.SUB.childAlpha),
      parentFade: interp(ctl.colT, { inputRange: [0, 1], outputRange: [1, 0] }),
      clockA: A.mul(interp(ctl.optV, { inputRange: [0, 1], outputRange: [1, 0] }), interp(ctl.infoV, { inputRange: [0, 1], outputRange: [1, 0] })),
      shown: interp(ctl.infoV, { inputRange: [0, 1], outputRange: [1, 0] }),
    }), [ctl]);
    // V70: the slide with the Triangle panel (its second step follows the strip's width)
    // V78: a list opened from the panel (Sort By, Column Icon, Move to Column...) no longer pushes the XMB further left (it went off the
    // screen with a wide strip): the XMB stays where the panel put it, only the panel's first level slides into the strip
    const optShift = useMemo(() => interp(ctl.optV, { inputRange: [0, 1, 2], outputRange: [OPT.shift[0], OPT.shift[1], OPT.shift[1]] }), [ctl]);
    const depth = st.stack.length, cols = [];
    // V46: every category's list stays mounted and is rendered with the SAME props at depth 0 and 1 - opening / closing a submenu only
    // moves colT (their rows carry the collapse themselves). Inside a submenu of a submenu the category lists are hidden.
    const rootCols = [];
    for (let c = 0; c < ctl.categories.length; c++) {
      // V76: keyed by bar slot (a re-ordered bar keeps every node; the slot's rows take the moved category's items)
      rootCols.push(h(Column, { key: 'cat' + c, keyPrefix: 'c' + c + ':', ctl, items: ctl.categories[c].items || [], pos: ctl.rootPos[c], focusIdx: st.sel[c],
        shiftX: nodes.colShift[c], alphaMul: nodes.colAlpha[c], noGlow: false, whole: true, sub: true }));   // V61: every category's focused row keeps its glow ready (no glow popping in ~1 s after a category switch); the column's own fade hides the others
    }
    // V55: every list of the stack stays mounted while it is in the stack and carries its own collapse (frame.t / frame.txt), exactly like
    // the category lists with colT: opening or closing any level only moves values, nothing is swapped at the end of an animation.
    // A list is hidden while the level above its child is open (two levels up): roots by stack[0].t, frame k by stack[k+1].t.
    const fadeOf = (f) => f.fade || (f.fade = interp(f.t, { inputRange: [0, 1], outputRange: [1, 0] }));
    cols.push(h(Animated.View, { key: 'roots', pointerEvents: 'none', style: Object.assign({}, FILL, { opacity: depth >= 1 ? fadeOf(st.stack[0]) : 1 }) }, rootCols));
    for (let k = 0; k < depth; k++) {
      const f = st.stack[k], next = k + 1 < depth ? st.stack[k + 1] : null;
      if (!f.an || f.anNext !== next) { f.an = next ? A.mul(f.cv, fadeOf(next)) : f.cv; f.anNext = next; }
      cols.push(h(Column, { key: 'f' + k, keyPrefix: 'f' + k + ':', ctl, items: f.items, pos: f.pos, focusIdx: f.idx, compact: true, whole: true,
        alphaMul: f.an, sub: true, subT: f.t, subTxt: f.txt }));
    }
    if (depth >= 1) cols.push(h(Chevron, { key: 'chev', ctl }));
    // V62: the category bar and the lists slide left with the Triangle panel (the background and the focus picture stay), the clock fades
    const moving = h(Animated.View, { key: 'xmbmove', pointerEvents: 'none', style: Object.assign({}, FILL, { opacity: nodes.shown, transform: [{ translateX: optShift }] }) }, h(CategoryBar, { key: 'bar', ctl }), cols);
    const clock = p.clock === false ? null : h(Animated.View, { key: 'clk', pointerEvents: 'none', style: Object.assign({}, FILL, { opacity: nodes.clockA }) }, h(Clock, { now: p.now }));
    return h(View, { style: FILL, pointerEvents: 'none', onLayout: layout('full-view') }, p.background || null, h(CinfoBg, { ctl }), moving, clock,
      h(Animated.View, { key: 'optbox', pointerEvents: 'none', style: Object.assign({}, FILL, { opacity: nodes.shown }) }, h(OptPanel, { ctl })), h(InfoScreen, { key: 'info', ctl }), h(KeepAlive, { ctl }));
  }

  return { Xmb, createController, Clock };
};
