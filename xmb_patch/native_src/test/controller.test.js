// V55: the controller on a PS5-like runtime - timers and animation-end callbacks NEVER arrive (on the console they only come with the next
// input). Opening must start the animation inside sync(); closing must change the stack at once; the start cursor is the host's.
const assert = require('assert'), spec = require('../spec/xmb-spec.json');
const { createCore } = require('../core/xmb-core.js');
const createXmb = require('../rn/xmb-rn.js');
const started = [];
class Value { constructor(v) { this._value = v; } setValue(v) { this._value = v; } stopAnimation() {} __getValue() { return this._value; }
  interpolate() { return this; } }
const Animated = { Value, View: 'Animated.View', timing: (v, c) => ({ start: () => started.push({ v, to: c.toValue, delay: c.delay }) }),
  multiply: (a) => a, add: (a) => a, loop: null };
const React = { createElement: () => null, memo: (c) => c, useMemo: (f) => f(), useRef: () => ({}), useState: (v) => [v, () => {}], useEffect: () => {} };
global.setTimeout = () => { throw new Error('setTimeout used'); };   // nothing on the open / close path may depend on a timer
const core = createCore(spec);
const { createController } = createXmb({ React, rn: { View: 'View', Text: 'Text', Image: 'Image', Animated }, core, spec, iconSource: () => null });
const kids = (n) => Array.from({ length: n }, (_, k) => ({ n: 'c' + k }));
const cats = [{ id: 'user', items: kids(3) }, { id: 'settings', items: [{ n: 'A', ch: [{ n: 'A1', ch: kids(4) }, { n: 'A2' }] }, { n: 'B' }, { n: 'C' }] }];
let n = 0; const ok = (c, m) => { assert(c, m); n++; };

// 1. the host's cursor is where the list starts (was: xmb-web's Settings default 5, clamped to the LAST row)
const ctl = createController(cats, { startCategory: 1, sel: [0, 0], noPulse: true });
ok(ctl.rootPos[1].__getValue() === 0 && ctl.state.sel[1] === 0, 'settings list starts on its first row');
const m = { ci: 1, sel: [0, 0], stack: [] };
// 2. open from the category list: the collapse starts inside sync(), no timer
started.length = 0; m.stack = [{ items: cats[1].items[0].ch, idx: 0, title: 'A' }]; ctl.sync(m);
ok(started.some((s) => s.v === ctl.colT && s.to === 1), 'colT -> 1 started inside sync()');
ok(started.some((s) => s.v === ctl.state.stack[0].cv && s.to === 1 && s.delay > 0), 'child list fades in after its delay');
ok(ctl.arrowV._value === 1, 'arrow shown at once');
ok(started.some((s) => s.v === ctl.blurV && s.to === 1), 'V56: background blur fades in with the first submenu');
// 3. open a submenu inside the submenu: the first submenu collapses with ITS OWN value
started.length = 0; m.stack = m.stack.concat([{ items: kids(4), idx: 0, title: 'A1' }]); ctl.sync(m);
ok(ctl.state.stack.length === 2 && started.some((s) => s.v === ctl.state.stack[0].t && s.to === 1), 'level-1 list collapses (frame.t -> 1)');
// 4. close it: the stack is 1 deep at once (no end callback), the level-1 list expands back
const f0 = ctl.state.stack[0];
started.length = 0; m.stack = m.stack.slice(0, 1); ctl.sync(m);
ok(ctl.state.stack.length === 1 && started.some((s) => s.v === f0.t && s.to === 0) && started.some((s) => s.v === f0.txt && s.to === 1), 'closed at once, level 1 expands back');
ok(ctl.arrowV._value === 1, 'arrow stays for the level-1 list');
// 5. close to the category list
started.length = 0; m.stack = []; ctl.sync(m);
ok(ctl.state.stack.length === 0 && started.some((s) => s.v === ctl.colT && s.to === 0) && ctl.arrowV._value === 0, 'back on the category list at once');
ok(started.some((s) => s.v === ctl.blurV && s.to === 0), 'V56: background sharp again on the category list');
// 6. two levels restored at once (host state): only the top one animates
started.length = 0; m.stack = [{ items: cats[1].items[0].ch, idx: 0, title: 'A' }, { items: kids(4), idx: 2, title: 'A1' }]; ctl.sync(m);
ok(ctl.colT._value === 1 && ctl.blurV._value === 1 && ctl.state.stack[0].cv._value === 1 && started.some((s) => s.v === ctl.state.stack[0].t && s.to === 1), 'restore two levels');
console.log(n + ' controller assertions passed');
