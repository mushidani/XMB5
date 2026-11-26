// Settled-state checks against numbers in xmb-web (drawXMB / itemSlotY) + easing / cadence checks.
const assert = require('assert'), spec = require('../spec/xmb-spec.json');
const { createCore } = require('../core/xmb-core.js');
const C = createCore(spec), S = C.sample, near = (a, b, m) => assert(Math.abs(a - b) < 0.01, `${m}: ${a} != ${b}`);
let n = 0; const ok = (a, b, m) => { near(a, b, m); n++; };

// category bar, focus on category 2 (settled catPos = 2)
for (let i = 0; i < 9; i++) {
  const e = 2 - i;
  ok(S(C.CAT.x(i), 2), 566 + (i === 2 ? 0 : (i - 2) * 200 + Math.sign(i - 2) * 10), `cat ${i} x (PS3 bar: 200 apart, +10 beside the focus)`);
  ok(S(C.CAT.y(i), 2), i === 2 ? 289 - 10 : 289, `cat ${i} y`);
  ok(S(C.CAT.scale(i, 'x'), 2) * 168, i === 2 ? 168 : 117, `cat ${i} size`);
  const d = Math.abs(i - 2); ok(S(C.CAT.alpha(i), 2), d === 0 ? 1 : d <= 2 ? 0.9 : 0.25, `cat ${i} alpha`);
  ok(S(C.CAT.labelAlpha(i), 2), d === 0 ? 0.9 : 0, `cat ${i} label`);
}
// item column, focus on item 3 (PS3 layout 1: focus 505, below 505+95+k*80, above 120-(k-1)*80)
const sel = 3;
for (let i = 0; i < 12; i++) {
  const k = i - sel, y = k === 0 ? 505 : k > 0 ? 505 + 95 + k * 80 : 120 - (-k - 1) * 80;
  ok(S(C.ITEM.y(i), sel), y, `item ${i} y`);
  ok(S(C.ITEM.iconScale(i, 'x'), sel) * 180, k === 0 ? 180 : 78, `item ${i} icon`);
  ok(S(C.ITEM.activeOpacity(i), sel), k === 0 ? 1 : 0, `item ${i} active text`);
}
// ground-truth screenshot (Turn Off System focused): next rows at 680?? xmb-web draws y=682 (text centre), screenshot text ~680
ok(S(C.ITEM.y(4), 3), 680, 'first below (PS3: focus + 175)'); ok(S(C.ITEM.y(5), 3), 760, 'second below');
// mid-transition linearity (sel 3 -> 4 at p=.5): item 4 sits halfway between 682 and 515
ok(S(C.ITEM.y(4), 3.5), (680 + 505) / 2, 'mid');
// easing
ok(C.ease.outCubic(0.3), 1 - 0.7 ** 3, 'easeOutCubic'); ok(C.ease.smooth(0.5), 0.5, 'smooth');
// key-repeat cadence (our own tuning, much faster than xmb-web's 300/200/143/...): 210, then 105 and /1.4 down to a 32 ms floor
const r = C.repeatIntervals(8).map(Math.round); assert.deepStrictEqual(r.slice(0, 7), [210, 105, 75, 54, 38, 32, 32]); n++;
assert(r[5] === 32 && r[6] === 32 && r[7] === 32); n++;
// category-switch column rides the bar: column 3 while catPos = 2 sits one spacing to the right
ok(S(C.COLUMN.shiftX(3), 2), 210, 'column shift (PS3 neighbour distance 210)'); ok(S(C.COLUMN.alpha(3), 2), 0, 'incoming column hidden at start'); ok(S(C.COLUMN.alpha(2), 2), 1, 'settled column visible');
console.log(n, 'assertions passed');
