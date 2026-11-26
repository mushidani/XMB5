'use strict';
/*
 * ps5xmb-native: the xmb-web-exact XMB renderer, packaged for the PS5XMB Home build (xmb_extension.js).
 *
 * The extension keeps owning the navigation state (category, per-category cursor, submenu stack), the game list, the launch
 * route, key handling and audio. This module only DRAWS it: every frame is a function of the animated positions that
 * rn/xmb-rn.js derives from the differences between two renders (controller.sync).
 *
 *   var N = ztXmbNative.create({ React, rn, log, fontSize, assetUri, onLayout, glow, playedLabel });
 *   <N.View model={{ ci, sel, cats:[{id,name,asset,getItems}], stack:[{entries,cursor,name}] }} now={Date} background={...} />
 */
const spec = require('../spec/xmb-spec-lite.json');
const { createCore } = require('../core/xmb-core.js');
const createXmb = require('../rn/xmb-rn.js');

exports.spec = spec;
exports.repeatIntervals = (n) => createCore(spec).repeatIntervals(n);
exports.create = function create(host) {
  const { React, rn } = host, log = host.log || function () {};
  const core = createCore(spec);
  const snapCache = {};
  // the PS5 Text only takes FontSizePS table sizes: nearest table size + the ratio as a transform scale
  const fontSnap = (px) => {
    if (snapCache[px]) return snapCache[px];
    let best = 0;
    try { best = host.fontSize ? host.fontSize(px) : 0; } catch (e) { best = 0; }
    // within 8% of a table size the table size is used as is: text is NEVER bitmap-scaled at rest, a scaled layer is what looked soft
    const k = best > 0 ? px / best : 1;
    return (snapCache[px] = best > 0 ? { size: best, scale: Math.abs(k - 1) <= 0.08 ? 1 : k } : { size: px, scale: 1 });
  };
  const hoverAsset = (f) => 'xmbweb_cinfo_' + String(f).replace(/^.*\//, '').replace(/\.[a-z]+$/i, '').replace(/^cinfo-/, '').replace(/[^a-z0-9]+/gi, '_').toLowerCase();
  const env = {
    React, rn, core, spec, fontFamily: host.fontFamily,
    // V73: a custom column's icon can be a PNG of its own (file:///user/data/ZhiThemes/xmbicons/<name>.png)
    iconSource: (id) => ({ uri: /^(file|https?):/.test(id || '') ? id : String(id || '').charAt(0) === '/' ? 'file://' + id : host.assetUri(id || 'xmbweb_xmb_icon_022') }),
    assetSource: (f) => ({ uri: host.assetUri(hoverAsset(f)) }),
    // hand-made mip levels exist for the glass icons only (install_xmbnative_assets.py): xmbweb_xmb_icon_NNN / _psn / playstation_store
    iconMip: (id, suf) => (/^xmbweb_(xmb_icon_(\d{3}|psn)|playstation_store)$/.test(id || '') ? { uri: host.assetUri(id + suf) } : null),
    glowImg: host.glow === 'native' ? undefined : { l: { uri: host.assetUri('xmbweb_glow_l') }, m: { uri: host.assetUri('xmbweb_glow_m') }, r: { uri: host.assetUri('xmbweb_glow_r') } },
    clockBox: { uri: host.assetUri('xmbweb_clock_box') }, clockRing: { uri: host.assetUri('xmbweb_clock_ring') }, subArrow: { uri: host.assetUri('xmbweb_arrow_sub') },
    optBg: { uri: host.assetUri('xmbweb_optmenu_bg') }, optLine: { uri: host.assetUri('xmbweb_optmenu_line') }, optArrowR: { uri: host.assetUri('xmbweb_optmenu_arrow_r') }, optArrowD: { uri: host.assetUri('xmbweb_optmenu_arrow_d') },   // V62: the PS3 Triangle panel
    fontSnap, onLayout: host.onLayout,
    fakeGlow: host.glow === 'native' ? undefined : {}, useNativeDriver: true, noPulse: host.noPulse,
    artCheck: host.artCheck, glowFor: host.glowFor, iconLevels: host.iconLevels,   // V41: filtered small copies of game icons           // V38: host helpers (blank-picture check, letter-hugging glow picture)
    onDwell: host.onDwell, onDwellEnd: host.onDwellEnd,       // focus-background dwell (the host starts / stops the title's own music)
  };
  const { Xmb, createController } = createXmb(env);

  // ---- host menu items -> renderer items {n, i, d, v, ch, src, sk, ns}
  const cache = typeof WeakMap === 'function' ? new WeakMap() : null;
  const scaleKeyOf = (asset) => (/(^|_)psn$/.test(asset || '') ? 'psn' : /playstation_store$/.test(asset || '') ? 'playstation_store' : '');
  const game0 = (r) => r && r.kind === 'game';
  function adapt(raw) {
    if (!raw) return { n: '', i: 'xmbweb_xmb_icon_022' };
    const hit = cache && !game0(raw) && cache.get(raw); if (hit) return hit;
    const game = raw.kind === 'game';
    if (game && cache) { const g = cache.get(raw); if (g && Date.now() - g.t < 4000) return g.it; }
    const pic = (game || raw.kind === 'user' || raw.kind === 'photo') && typeof raw.icon === 'string' && raw.icon;   // V43: users carry their own picture too; V48: screenshots
    const icon = pic ? (raw.icon.charAt(0) === '/' ? 'file://' + raw.icon : raw.icon)
      : game && /^[A-Z]{4}\d{5}$/.test(raw.id || '') ? 'file:///user/app/' + raw.id + '/sce_sys/icon0.png' : '';
    const it = { n: raw.name, i: raw.iconAsset || 'xmbweb_xmb_icon_022', sk: scaleKeyOf(raw.iconAsset), src: icon || undefined, raw };
    if (game) { const lab = host.playedLabel ? host.playedLabel(raw) : ''; if (lab) it.d = lab; it.ns = true; } else if (raw.subtitle) it.d = raw.subtitle;
    if (game && host.badge) { const b = host.badge(raw); if (b) it.b = b; }   // V78: the PS3's format badge (PS5 / PS4 / PS3) after the date
    if (game) {
      it.gid = raw.id;
      // the title's own background: the DB path first, then the usual appmeta / sce_sys pictures
      const c = [];
      [raw.bg, '/user/appmeta/' + raw.id + '/pic0.png', '/user/appmeta/' + raw.id + '/pic0.jpg', '/user/appmeta/' + raw.id + '/pic1.png',
        '/user/app/' + raw.id + '/sce_sys/pic1.png', '/user/app/' + raw.id + '/sce_sys/pic0.png'].forEach((v) => {
        if (typeof v !== 'string' || !v || !/^(?:file:\/\/|\/)/.test(v)) return;
        const u = v.charAt(0) === '/' ? 'file://' + v : v; if (c.indexOf(u) < 0) c.push(u);
      });
      if (/^[A-Z]{4}\d{5}$/.test(raw.id || '') && c.length) it.art = c;
    }
    if (raw.ns) it.ns = true;   // V71: the description only under the focused row (the XMB's game folders: "3 items")
    if (raw.kind === 'photo') it.thumb = true;   // V48: a screenshot is shown from its small copy only (never the 4K original in a row)
    if (raw.kind === 'user' && Array.isArray(raw.alts)) it.alts = raw.alts.slice();   // V44: other spellings of the user's picture
    if (raw.value) it.v = String(raw.value);
    if (Array.isArray(raw.children) && raw.children.length) it.ch = raw.children.map(adapt);
    if (cache) cache.set(raw, game ? { t: Date.now(), it } : it);   // games: the played-time label can change, so it expires after 4 s
    return it;
  }
  // V39: the same host list (same array, same entries) adapts to the SAME array: a render no longer re-adapts every game of 3 columns
  const listMemo = typeof WeakMap === 'function' ? new WeakMap() : null;
  const adaptList = (list) => {
    if (!list) return [];
    const m = listMemo && listMemo.get(list);
    if (m && m.raw.length === list.length && m.raw.every((r, k) => r === list[k]) && Date.now() - m.t < 4000) return m.out;
    const out = list.map(adapt);
    if (listMemo) listMemo.set(list, { raw: list.slice(), out, t: Date.now() });
    return out;
  };

  const infoIcon = (v) => (typeof v !== 'string' || !v ? null : v.charAt(0) === '/' ? { uri: 'file://' + v } : /^(file|https?):/.test(v) ? { uri: v } : { uri: host.assetUri(v) });
  // V76: the host's categories by id (a reordered bar keeps the renderer's category objects; their lists are always the host's current ones)
  let hostCats = {};
  const toSync = (m) => (hostCats = {}, m.cats.forEach((c) => { hostCats[c.id] = c; }), {
    speed: m.speed, startDelay: m.startDelay, dwell: m.dwell, motion: m.motion,
    // only the ACTIVE category's list length is needed (the host already clamps the others): building every category's list on every key press was wasted work
    ci: m.ci, sel: m.cats.map((c, i) => (i === m.ci ? Math.min(Math.max(0, m.sel[i] || 0), Math.max(0, (c.getItems() || []).length - 1)) : Math.max(0, m.sel[i] || 0))),
    stack: m.stack.map((f) => ({ items: adaptList(f.entries), idx: f.cursor || 0, title: f.name })),
    // V62: the Triangle options panel: [{ items: [{ n, ch }], idx }] per open level (plain labels from the host)
    opt: Array.isArray(m.opt) ? m.opt.map((l) => ({ items: (l.items || []).map((o) => (typeof o === 'string' ? { n: o } : { n: o.n || o.name || '', ch: !!(o.ch || o.children), head: !!o.head, grp: !!o.grp, mark: !!o.mark })), idx: l.idx || 0, at: l.at || 0 })) : [],
    // V62: the Information screen: { icon: '/path' | 'file://..' | asset id, pic: true for a picture that fills the frame, rows: [[label, value, lines]] }
    info: m.info && Array.isArray(m.info.rows) ? Object.assign({}, m.info, { icon: infoIcon(m.info.icon) }) : null,
  });
  let live = null;     // the mounted view's controller
  let gen = 0;         // V76: one per controller (the view is re-mounted only for a new one)
  // V56: the background blur of an open submenu (0..1), shared with the host so it can fade the blurred wave video in. One value for the
  // life of the renderer: the host can wrap its video in an Animated.View before the XMB view has even mounted.
  const blurV = new rn.Animated.Value(0);
  // V77: a changed bar on the SAME categories (a column moved left / right, renamed, given another icon) is applied to the live controller:
  // the order with a slide, a name / icon in place. Done before the first sync() of the new model (preSync runs before React renders: a
  // sync() of the new focus index on the old order started a category switch, and the move looked like a snap).
  const catSig = (m) => m.cats.map((c) => c.id + '|' + c.name + '|' + c.asset).join(',');
  let cur = null;      // the mounted view's { ctl, cats, sig, gen }
  function adopt(m) {
    const r = cur;
    if (!r || r.sig === (r.sig2 = catSig(m))) return true;
    const ids = m.cats.map((c) => c.id), have = r.ctl.categories.map((c) => c.id);
    if (!r.ctl.reorder || ids.length !== have.length || ids.slice().sort().join(',') !== have.slice().sort().join(',')) return false;
    hostCats = {}; m.cats.forEach((c) => { hostCats[c.id] = c; });
    if (ids.join(',') !== have.join(',')) { r.ctl.reorder(ids, m.ci); log('xmb renderer: categories re-ordered'); }
    let changed = false;
    m.cats.forEach((c) => {
      const rc = r.ctl.categories.find((x) => x.id === c.id);
      if (rc && (rc.name !== c.name || rc.icon !== c.asset)) { rc.name = c.name; rc.icon = c.asset; rc.sk = scaleKeyOf(c.asset); changed = true; }
    });
    if (changed) { log('xmb renderer: category name / icon updated'); r.ctl.refresh(); }
    r.sig = r.sig2;
    return true;
  }
  function View(p) {
    const m = p.model;
    const ref = React.useRef(null);
    // V73: the category bar changes (a custom column made or deleted): a new controller for the new bar.
    if (ref.current && ref.current !== cur) ref.current = null;
    if (ref.current && !adopt(m)) { log('xmb renderer: categories changed (' + m.cats.length + ')'); ref.current = null; }
    if (!ref.current) {
      hostCats = {}; m.cats.forEach((c) => { hostCats[c.id] = c; });
      const cats = m.cats.map((c) => ({ id: c.id, name: c.name, icon: c.asset, sk: scaleKeyOf(c.asset), get items() { const hc = hostCats[c.id]; return adaptList(hc ? hc.getItems() : []); } }));
      gen++;
      ref.current = cur = { ctl: createController(cats, { startCategory: m.ci, sel: m.sel, noPulse: host.noPulse, blurV }), cats, sig: catSig(m), gen };
      ref.current.ctl.state.sel = m.cats.map((c, i) => m.sel[i] || 0);
      log('xmb renderer ready: ' + cats.length + ' categories, glow=' + (host.glow || 'copies'));
    }
    const ctl = ref.current.ctl; live = ctl;
    ctl.sync(toSync(m));
    return React.createElement(Xmb, { key: 'g' + ref.current.gen, controller: ctl, background: p.background, now: p.now });
  }
  // Start the animations the moment the host's state changes, BEFORE React renders: the native animation is already running when the
  // rows are updated (press -> motion no longer waits for a render). The render's own sync() then finds nothing left to start.
  function preSync(model) { if (live) { try { if (adopt(model)) live.sync(toSync(model)); } catch (e) { log('preSync: ' + e); } } }
  return { View, core, repeatIntervals: core.repeatIntervals, adapt, preSync, blurValue: () => blurV };
};
