// Minimal DOM implementation of the React Native primitives xmb-rn.js uses (View, Text, Image, Animated).
// Preview/test only -- on the console the real React Native runtime is used.
import React from 'react';

const now = () => (window.__fakeNow !== undefined ? window.__fakeNow : performance.now());

// ---------------- Animated nodes (lazy-attach so re-created interpolations don't leak)
class Node {
  constructor() { this.ls = new Set(); }
  addListener(f) { if (!this.ls.size) this._attach(); this.ls.add(f); return () => { this.ls.delete(f); if (!this.ls.size) this._detach(); }; }
  emit() { this.ls.forEach((f) => f()); }
  _attach() {} _detach() {}
  interpolate(cfg) { window.__interps = (window.__interps || 0) + 1; return new Interp(this, cfg); }
}
class Value extends Node {
  constructor(v) { super(); this._v = v; this._anim = null; }
  setValue(v) { this._v = v; this.emit(); }
  getValue() { return this._v; }
  stopAnimation() { if (this._anim) { this._anim.stopped = true; this._anim = null; } }
}
class Interp extends Node {
  constructor(p, cfg) { super(); this.p = p; this.cfg = cfg; this._u = null; }
  _attach() { this._u = this.p.addListener(() => this.emit()); } _detach() { this._u && this._u(); }
  getValue() {
    const x = this.p.getValue(), a = this.cfg.inputRange, b = this.cfg.outputRange, n = a.length, ext = this.cfg.extrapolate === 'extend';
    const lin = (k0, k1) => b[k0] + (b[k1] - b[k0]) * (x - a[k0]) / (a[k1] - a[k0]);
    if (x <= a[0]) return ext ? lin(0, 1) : b[0];
    if (x >= a[n - 1]) return ext ? lin(n - 2, n - 1) : b[n - 1];
    let k = 1; while (x > a[k]) k++; return lin(k - 1, k);
  }
}
class Op extends Node {
  constructor(a, b, fn) { super(); this.a = a; this.b = b; this.fn = fn; this._u = []; }
  _attach() { [this.a, this.b].forEach((n) => n instanceof Node && this._u.push(n.addListener(() => this.emit()))); }
  _detach() { this._u.forEach((u) => u()); this._u = []; }
  getValue() { return this.fn(val(this.a), val(this.b)); }
}
const val = (n) => (n instanceof Node ? n.getValue() : n);

// ---------------- animations
const running = new Set();
function tickAll() { running.forEach((a) => a.tick()); }
function raf() { tickAll(); requestAnimationFrame(raf); } requestAnimationFrame(raf);
window.__tick = tickAll;

function timing(value, cfg) {
  const a = { stopped: false, from: 0, t0: 0, cb: null, value,
    start(cb) { a.cb = cb; a.from = value.getValue(); a.t0 = now(); value.stopAnimation(); value._anim = a; running.add(a); a.tick(); return a; },
    stop() { a.stopped = true; running.delete(a); },
    tick() {
      if (a.stopped) { running.delete(a); a.cb && a.cb({ finished: false }); a.cb = null; return; }
      const t = Math.min(1, (now() - a.t0) / Math.max(1, cfg.duration)), e = cfg.easing ? cfg.easing(t) : t;
      value.setValue(a.from + (cfg.toValue - a.from) * e);
      if (t >= 1) { running.delete(a); if (value._anim === a) value._anim = null; const cb = a.cb; a.cb = null; cb && cb({ finished: true }); }
    } };
  return a;
}
const sequence = (list) => ({ start(cb) { let i = 0; const next = (r) => { if (i >= list.length) return cb && cb({ finished: true }); list[i++].start(next); }; next(); }, stop() { list.forEach((x) => x.stop && x.stop()); } });
const loop = (anim) => ({ start() { const v0 = anim.value ? anim.value.getValue() : null; const go = () => { if (anim.value && v0 !== null) anim.value.setValue(v0); anim.start(go); }; go(); }, stop() { anim.stop && anim.stop(); } });  // RN resets the value before every iteration

// ---------------- style -> css
const PX = new Set(['left', 'top', 'right', 'bottom', 'width', 'height', 'fontSize', 'lineHeight', 'borderRadius', 'borderTopWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderRightWidth', 'borderWidth']);
function toCss(style, o) {
  const css = { boxSizing: 'border-box' }; const s = Array.isArray(style) ? Object.assign({}, ...style.filter(Boolean)) : style || {};
  let sh = {};
  for (const k in s) {
    let v = val(s[k]); if (v === undefined || v === null) continue;
    if (k === 'transform') css.transform = v.map((t) => { const [n, x] = Object.entries(t)[0]; const xv = val(x); return n === 'scale' ? `scale(${xv})` : `${n}(${xv}px)`; }).join(' ');
    else if (k.startsWith('textShadow')) sh[k] = v;
    else if (PX.has(k)) css[k] = typeof v === 'number' ? v + 'px' : v;
    else css[k] = v;
  }
  if (/^border(Top|Bottom|Left|Right)?Width$/.test(Object.keys(s).join(' ')) || Object.keys(s).some((k) => /^border.*Width$/.test(k))) css.borderStyle = 'solid';
  if (sh.textShadowColor) css.textShadow = `${(sh.textShadowOffset || {}).width || 0}px ${(sh.textShadowOffset || {}).height || 0}px ${sh.textShadowRadius || 0}px ${sh.textShadowColor}`;
  return css;
}
const hasNode = (v) => v instanceof Node || (Array.isArray(v) ? v.some(hasNode) : v && typeof v === 'object' && Object.values(v).some(hasNode));
function nodesOf(v, out) { if (v instanceof Node) out.push(v); else if (Array.isArray(v)) v.forEach((x) => nodesOf(x, out)); else if (v && typeof v === 'object') Object.values(v).forEach((x) => nodesOf(x, out)); return out; }

const base = { display: 'flex', flexDirection: 'column', position: 'relative' };
function make(tag, animated) {
  return function Comp(props) {
    const ref = React.useRef(null), style = props.style;
    React.useEffect(() => {
      if (!animated) return;
      const nodes = nodesOf(style, []); let pend = false;
      const apply = () => { pend = false; if (ref.current) Object.assign(ref.current.style, toCss(style)); };
      const us = nodes.map((n) => n.addListener(() => { if (!pend) { pend = true; requestAnimationFrame(apply); } }));
      return () => us.forEach((u) => u());
    });
    let css = Object.assign({}, tag === 'div' ? base : null, toCss(style));
    if (props.numberOfLines === 1) Object.assign(css, { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' });
    else if (props.numberOfLines > 1) Object.assign(css, { overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: props.numberOfLines, WebkitBoxOrient: 'vertical' });
    if (tag === 'img') { const src = props.source && props.source.uri && String(props.source.uri).replace(/^file:\/\/\/assets\//, '/assets/'); return React.createElement('img', { ref, src, onLoad: props.onLoad, onError: props.onError, style: Object.assign({ objectFit: props.resizeMode === 'contain' ? 'contain' : props.resizeMode === 'cover' ? 'cover' : 'fill' }, css), draggable: false }); }
    return React.createElement('div', { ref, style: css, 'data-t': props.testID }, props.children);
  };
}
export const rn = {
  View: make('div', false), Text: make('div', false), Image: make('img', false),
  Animated: { Value, View: make('div', true), Text: make('div', true), Image: make('img', true),
    multiply: (a, b) => new Op(a, b, (x, y) => x * y), add: (a, b) => new Op(a, b, (x, y) => x + y), timing, sequence, loop },
};
