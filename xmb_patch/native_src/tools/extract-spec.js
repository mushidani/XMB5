// Extracts the XMB spec from the xmb-web index.html (read-only; evals only literal blocks in a vm sandbox).
const fs = require('fs'), vm = require('vm'), path = require('path');
const src = fs.readFileSync(process.argv[2], 'utf8');
const out = process.argv[3];

function block(startRe, open, close) {
  const m = startRe.exec(src); if (!m) throw new Error('not found ' + startRe);
  let i = m.index + m[0].length - 1, depth = 0, j = i, inStr = null, esc = false;
  for (; j < src.length; j++) {
    const c = src[j];
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === inStr) inStr = null; continue; }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === '/' && src[j + 1] === '/') { j = src.indexOf('\n', j); continue; }
    if (c === '/' && src[j + 1] === '*') { j = src.indexOf('*/', j) + 1; continue; }
    if (c === open) depth++; else if (c === close) { depth--; if (!depth) break; }
  }
  return src.slice(i, j + 1);
}
const ev = (code) => vm.runInNewContext('(' + code + ')', {}, { timeout: 2000 });

const V = ev(block(/const V = \{/, '{', '}'));
const ICON_SCALE = ev(block(/const ICON_SCALE = \{/, '{', '}'));
const HOVER_BG = ev(block(/const HOVER_BG = \{/, '{', '}'));
const DEFAULT_ITEM_INDEX = ev(block(/const DEFAULT_ITEM_INDEX = \{/, '{', '}'));
let DATA;
try { DATA = ev(block(/const DATA = \[/, '[', ']')); } catch (e) { console.error('DATA eval failed:', e.message); process.exit(1); }

// consts declared with plain literals
const num = (name) => Number(new RegExp('const ' + name + '\\s*=\\s*([0-9.]+)').exec(src)[1]);
const timings = { ITEM_DESC_FADE_MS: num('ITEM_DESC_FADE_MS'), HOVER_BG_DWELL_MS: num('HOVER_BG_DWELL_MS'),
  HOVER_BG_FADE_IN_MS: num('HOVER_BG_FADE_IN_MS'), HOVER_BG_FADE_OUT_MS: num('HOVER_BG_FADE_OUT_MS'), HOVER_BG_MAX_ALPHA: num('HOVER_BG_MAX_ALPHA') };

// strip bulky content trees (music tracks / photos / video) to counts; keep structure of menus
function slim(items, depth) {
  return (items || []).map(it => {
    const o = { n: it.n, i: it.i };
    for (const k of ['d', 'v', 'action', 'wiz', 'mtype']) if (it[k] !== undefined) o[k] = it[k];
    if (it.ch) o.ch = it.mtype ? { count: it.ch.length } : slim(it.ch, depth + 1);
    return o;
  });
}
const categories = DATA.map(c => ({ id: c.id, name: c.name, icon: c.icon, content: c.content || null, groupModes: c.groupModes || null, items: slim(c.items, 0) }));

fs.writeFileSync(out, JSON.stringify({
  _provenance: 'Extracted from TheGammaSqueeze/xmb-web index.html. Each constant in index.html carries a firmware vaddr or "measured" tag; see layout.provenance.',
  layout: V, iconScale: ICON_SCALE, defaultItemIndex: DEFAULT_ITEM_INDEX, timings, hoverBg: HOVER_BG, categories
}, null, 1));
console.log('layout keys', Object.keys(V).length, '| categories', categories.map(c => c.id + ':' + c.items.length).join(' '));
