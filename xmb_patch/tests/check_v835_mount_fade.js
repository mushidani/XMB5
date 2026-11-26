// V83.9 focused unit test: exact shipped MountedReveal, native mounting and timing.
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const bundle = fs.readFileSync(path.resolve(__dirname, '../xmb_native_bundle.js'), 'utf8');
const begin = bundle.indexOf('        function MountedReveal(p) {');
const end = bundle.indexOf('        function Label(p) {', begin);
assert(begin >= 0 && end > begin);
const definition = bundle.slice(begin,end).trim();
let effects=[],timings=[];
const Animated={
  View:'Animated.View',
  Value: class {constructor(v){this.val=v;} stopAnimation(){} setValue(v){this.val=v;}},
  timing: (value,cfg) => {
    const entry={value,cfg,start:false};timings.push(entry);
    return {start(){entry.start=true;},stop(){entry.stopped=true;}};
  }
};
let clock=10000;
const ctx={
  React:{useRef:(init)=>({current:init}),useEffect:(cb)=>effects.push(cb)},
  Animated,nativeDriver:true,core:{ease:{smooth:(t)=>t}},
  FILL:{position:'absolute',width:1920,height:1080},
  h:(type,props,...children)=>({type,props,children}),
  Date:{now:()=>clock},Math
};
const Reveal=vm.runInNewContext('('+definition+')',ctx);
function check(openedAt, settleMs, expectedDelay){
  effects=[]; timings=[];
  const view=Reveal({epoch:1,openedAt,settleMs,speed:1,children:'rows'});
  assert.strictEqual(view.type,'Animated.View');
  assert.strictEqual(timings.length,0,'animation starts after mount');
  assert.strictEqual(view.props.style.opacity.val,0,'initial alpha 0');
  assert(!('gate' in view.props.style.opacity),'no secondary progress gate');
  const cleanup=effects[0]();
  assert.strictEqual(timings.length,1);
  assert.strictEqual(timings[0].cfg.delay,expectedDelay);
  assert.strictEqual(timings[0].cfg.duration,275);
  assert.strictEqual(timings[0].cfg.useNativeDriver,true);
  assert.strictEqual(timings[0].start,true);
  cleanup();assert.strictEqual(timings[0].stopped,true);
}
check(10000,250,250); // mounting immediately; fade starts at visual completion
check(9800,250,50); // mounted after most of panel motion
check(9700,250,0);  // mounted after panel finished -> no wait
check(0,250,0);     // restored nonanimated stack
for (const needle of [
  'key: "frame-reveal-" + f.mountEpoch',
  'key: "opt-content-" + k + "-" + (st.optEpoch[k] || 0)',
  'key: "info-content-" + st.infoEpoch',
  'openedAt: f.openedAt',
  'openedAt: st.optOpenedAt[k] || 0',
  'openedAt: st.infoOpenedAt || 0',
  'api.revealSettleMs = revealSettleMs;',
]) assert(bundle.includes(needle), 'required mount wiring: '+needle);
assert(!bundle.includes('opacity: A.mul(ref.current, gate)'), 'no double opacity gate');
console.log('PASS: no post-panel delay; 275ms native fade at mount; previous 2-stage gate removed');
