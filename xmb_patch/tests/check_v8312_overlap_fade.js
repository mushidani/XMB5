// V83.12: fade begins during last 150ms of the visible submenu movement.
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const bundle = fs.readFileSync(path.resolve(__dirname, '../xmb_native_bundle.js'), 'utf8');
const a = bundle.indexOf('        function MountedReveal(p) {');
const b = bundle.indexOf('        function Label(p) {', a);
assert(a !== -1 && b > a);
const def = bundle.slice(a,b);
let effects=[], timings=[], clock=10000;
const Animated={
  View: 'Animated.View',
  Value: class {constructor(val) {this.val=val;} stopAnimation(){} setValue(v){this.val=v;}},
  timing: (value,cfg) => {
    const entry={value,cfg,started:false}; timings.push(entry);
    return {start(){entry.started=true;}, stop(){entry.stopped=true;}};
  },
};
const sandbox={React:{useRef:init=>({current:init}),useEffect:cb=>effects.push(cb)},
  Animated,nativeDriver:true,core:{ease:{smooth:t=>t}},
  FILL:{position:'absolute',width:1920,height:1080},
  h:(type,props,...children)=>({type,props,children}), Date:{now:()=>clock},Math};
const Reveal=vm.runInNewContext('('+def+')',sandbox);
function check({openedAt,settleMs=250,expectedDelay,speed=1,expectedDuration=245}) {
  effects=[];timings=[];
  const view=Reveal({epoch:1,openedAt,settleMs,speed,children:'rows'});
  assert.strictEqual(view.type,'Animated.View');
  assert.strictEqual(view.props.style.opacity.val,0);
  assert.strictEqual(timings.length,0,'start fade only on component mount');
  assert.strictEqual(effects.length,1);
  const cleanup=effects[0]();
  assert.strictEqual(timings.length,1);
  assert.strictEqual(timings[0].cfg.duration,expectedDuration);
  assert.strictEqual(timings[0].cfg.delay,expectedDelay);
  assert.strictEqual(timings[0].cfg.useNativeDriver,true);
  assert.strictEqual(timings[0].started,true);
  cleanup();assert.strictEqual(timings[0].stopped,true);
}
check({openedAt:10000, expectedDelay:100}); // start 100ms into 250ms panel motion
check({openedAt:9990, expectedDelay:90}); // row mounts 10ms after opening
check({openedAt:9950, expectedDelay:50}); // 50ms after opening
check({openedAt:9900, expectedDelay:0}); // at scheduled fade start
check({openedAt:9700, expectedDelay:0}); // past settle: fade immediately
check({openedAt:0, expectedDelay:0}); // preexisting/restored frame
check({openedAt:10000, settleMs:80, expectedDelay:0}); // shorter than overlap
check({openedAt:10000, settleMs:180, expectedDelay:30});
check({openedAt:10000, settleMs:350, expectedDelay:200}); // longer opening
check({openedAt:10000, speed:1.2, expectedDelay:100, expectedDuration:294});
for(const needle of [
  'key: "frame-reveal-" + f.mountEpoch',
  'key: "opt-content-" + k + "-" + (st.optEpoch[k] || 0)',
  'key: "info-content-" + st.infoEpoch',
  'openedAt: f.openedAt',
  'openedAt: st.optOpenedAt[k] || 0',
  'openedAt: st.infoOpenedAt || 0',
  'api.revealSettleMs = revealSettleMs;',
]) assert(bundle.includes(needle),needle);
assert(!bundle.includes('opacity: A.mul(ref.current, gate)'), 'no second opacity gate');
console.log('PASS V83.12: fade starts 150ms before visible settle; 245ms fade; no callback/double gate');
