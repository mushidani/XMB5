import React from 'react';
import { createRoot } from 'react-dom/client';
import { rn } from './rn-web-shim.js';
import spec from '../spec/xmb-spec.json';
import { createCore } from '../core/xmb-core.js';
import createXmb from '../rn/xmb-rn.js';

const core = createCore(spec);
const q = new URLSearchParams(location.search);
const iconSource = (id) => ({ uri: 'assets/icons/' + (id && !id.startsWith('asset:') ? id : 'xmb_icon_022') + '.png' });
const assetSource = (f) => ({ uri: 'assets/' + f });
// ?snap=24,28,32,44 emulates the PS5's FontSizePS table (nearest size + transform scale); ?fakeglow draws the halo as text copies
const table = (q.get('snap') || '').split(',').map(Number).filter(Boolean);
const fontSnap = table.length ? (px) => { let b = table[0]; for (const t of table) if (Math.abs(t - px) < Math.abs(b - px)) b = t; const k = px / b; return { size: b, scale: Math.abs(k - 1) <= 0.08 ? 1 : k }; } : undefined;
const mipOn = q.has('mip');
const { Xmb, createController } = createXmb({ React, rn, core, spec, iconSource, assetSource, iconMip: mipOn ? (id, suf) => (id && !id.startsWith('asset:') ? { uri: 'assets/icons/' + id + suf + '.png' } : null) : undefined, glowImg: q.has('copyglow') ? undefined : { l: { uri: 'assets/glow/glow_l.png' }, m: { uri: 'assets/glow/glow_m.png' }, r: { uri: 'assets/glow/glow_r.png' } }, clockBox: { uri: 'assets/clock/clock_box.png' }, clockRing: { uri: 'assets/clock/clock_ring.png' }, subArrow: { uri: 'assets/clock/arrow_sub.png' }, optBg: { uri: 'assets/clock/optmenu_bg.png' }, optLine: { uri: 'assets/clock/optmenu_line.png' }, optArrowR: { uri: 'assets/clock/optmenu_arrow_r.png' }, optArrowD: { uri: 'assets/clock/optmenu_arrow_d.png' }, fontFamily: 'PS3', useNativeDriver: true, fontSnap, glowFor: q.has('hostglow') ? (t, sz, lh, cb) => fetch('/xmb-glow?px=' + sz + '&lh=' + lh + '&text=' + encodeURIComponent(t), { method: 'POST' }).then((r) => r.json()).then(cb).catch(() => cb(null)) : undefined, artCheck: q.has('hostart') ? (u, cb) => fetch('/xmb-art?path=' + encodeURIComponent(u), { method: 'POST' }).then((r) => r.text()).then((t) => cb(t.trim())).catch(() => cb('ok')) : undefined, fakeGlow: !q.has('noglow') ? { n: +(q.get('gn') || 0) || undefined, rings: q.get('rings') ? q.get('rings').split(',').map((x) => { const [r, a] = x.split(':'); return { r: +r, a: +a }; }) : undefined } : undefined });
// ?games=1 : the Game category holds fake installed titles with their own pictures (focus-background + vanishing names demo)
const cats = q.has('games') ? spec.categories.map((c) => c.id !== 'game' ? c : Object.assign({}, c, { items: (q.has('many') ? Array.from({ length: 40 }, (_, k) => 'Game Title ' + (k + 1)) : ['Alpha Quest', 'Beta Racer', 'Gamma Arena', 'Delta Tactics', 'Epsilon Run', 'Zeta Strike']).map((n, k0) => { const k = k0 % 6; return ({ n, i: 'xmb_icon_022', ns: true, d: '11/22/2026  1:52 PM', b: 'xmbweb_badge_' + ['ps5', 'ps4', 'ps3'][k % 3] + '_d', gid: 'T' + k, art: q.has('arttest') && k === 3 ? ['assets/backgrounds/blank-x.jpg', 'assets/backgrounds/cinfo-bg-storevideo.jpg'] : q.has('arttest') && k === 4 ? ['assets/backgrounds/blank-y.jpg', 'assets/backgrounds/missing-z.jpg'] : ['assets/backgrounds/cinfo-bg-' + ['storegame', 'storemain', 'whatsnew', 'storevideo', 'signup', 'photogallery'][k] + '.jpg'] }); }) })) : spec.categories;
// ?nest=1 : Theme Settings > Colour gets its own sub-list (a submenu inside a submenu, as the PS5 Colour / Day-Night menus)
if (q.has('nest')) { const st = cats.find((c) => c.id === 'settings'); const th = st && st.items.find((it) => it.n === 'Theme Settings');
  if (th && th.ch && th.ch[1]) th.ch[1] = Object.assign({}, th.ch[1], { ch: ['Original', 'January', 'February', 'March', 'April', 'May'].map((n) => ({ n, i: 'xmb_icon_022' })) }); }
const ctl = createController(cats, { startCategory: +(q.get('cat') || 0), noPulse: q.has('nopulse'), onActivate: (it) => console.log('activate', it.n) });
window.xmb = ctl;
const bg = q.get('bg') ? React.createElement('img', { src: q.get('bg'), style: { position: 'absolute', left: 0, top: 0, width: 1920, height: 1080 } }) : null;
const fixed = q.get('time') ? new Date(+q.get('time')) : undefined;
createRoot(document.getElementById('root')).render(React.createElement(Xmb, { controller: ctl, background: bg, now: fixed }));
const KEYS = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', Enter: 'enter', Escape: 'back', Backspace: 'back' };
// ?defer=1: the V39 host behaviour. A step only calls sync() (native animation starts), the rows re-render 110 ms after the last step or
// at most every 220 ms while a key is held.
if (q.has('defer')) {
  const m = { ci: ctl.state.ci, sel: ctl.state.sel.slice(), stack: [], speed: 1 / 1.15 };
  let timer = null, first = 0;
  addEventListener('keydown', (e) => {
    const k = KEYS[e.key]; if (!k) return; e.preventDefault();
    if (k === 'up' || k === 'down') { const n = (cats[m.ci].items || []).length; m.sel[m.ci] = Math.max(0, Math.min(n - 1, m.sel[m.ci] + (k === 'up' ? -1 : 1))); }
    else if (k === 'left' || k === 'right') m.ci = Math.max(0, Math.min(cats.length - 1, m.ci + (k === 'left' ? -1 : 1)));
    else { ctl.press(k); return; }
    ctl.sync(m);
    const t = performance.now(); if (!first) first = t;
    clearTimeout(timer); timer = setTimeout(() => { first = 0; ctl.refresh(); }, Math.max(0, Math.min(110, first + 220 - t)));
  });
} else addEventListener('keydown', (e) => { const k = KEYS[e.key]; if (k) { e.preventDefault(); ctl.press(k); } });

// V62: t = the Triangle options panel (n = open a nested level when the focused option has options), as the PS5 host drives it
{
  let opt = [];
  const OPTS = [{ items: [{ n: 'Sort By', ch: true, head: true }, { n: 'Rename Column', grp: true }, { n: 'Column Icon', ch: true, grp: true }, { n: 'Move Column Left', grp: true }, { n: 'Move Column Right', grp: true }, { n: 'Delete Column', grp: true }, { n: 'Start' }, { n: 'Move to Column', ch: true }, { n: 'Move App' }, { n: 'Information' }], idx: 6 }];
  const push = () => { const s0 = ctl.state; ctl.sync({ ci: s0.ci, sel: s0.sel.slice(), stack: s0.stack.map((f) => ({ items: f.items, idx: f.idx, title: f.title })), opt }); ctl.refresh(); };
  window.xmbOpt = (o) => { opt = o; push(); };
  addEventListener('keydown', (e) => {
    if (e.key === 't') { opt = opt.length ? [] : JSON.parse(JSON.stringify(OPTS)); push(); }
    else if (e.key === 'm' && opt.length === 1) { opt[0].idx = 3; opt = opt.concat([{ items: ['PS3 Folder','Controller','PlayStation','Game Folder','Folder','Memory Card','PSP','Media','Video','Music','Photo','Network','Friends','Trophy','Store','Tools','Search','Home'].map((n) => ({ n })), idx: 15, at: 15 }]); push(); }
    else if (e.key === 'n' && opt.length === 1) { opt[0].idx = 0; opt = opt.concat([{ items: [{ n: 'Creation Date' }, { n: 'Format' }, { n: 'A to Z', mark: true }, { n: 'Z to A' }], idx: 2, at: 2 }]); push(); }
    else if (e.key === 'i') { const s0 = ctl.state; ctl.sync({ ci: s0.ci, sel: s0.sel.slice(), stack: [], opt: [], info: s0.info ? null : { icon: { uri: 'assets/icons/xmb_icon_022.png' }, rows: [['Title', 'Astro Bot'], ['Title ID', 'PPSA01234'], ['Last Played', '11/21/2026  11:02 PM'], ['Description', 'Update the PS3\u2122 system software.']] } }); ctl.refresh(); }
    else if (e.key === 'r') { const ids = ctl.categories.map((c) => c.id), ci = ctl.state.ci; if (ci > 0) { const t = ids[ci]; ids[ci] = ids[ci - 1]; ids[ci - 1] = t; ctl.reorder(ids, ci - 1); } }
    else if (e.key === 'j' && opt.length) { const l = opt[opt.length - 1]; l.idx = Math.min(l.items.length - 1, l.idx + 1); push(); }
  }, true);
}
