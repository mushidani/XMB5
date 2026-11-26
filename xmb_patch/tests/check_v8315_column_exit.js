// Host-side controller regression for V83.15. No PS5 runtime/SDK is assumed.
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const bundle = fs.readFileSync(path.resolve(__dirname,'../xmb_native_bundle.js'),'utf8');
const a = bundle.indexOf('        function createController(categories, opts) {');
const b = bundle.indexOf('        const FILL = ',a);
assert(a > 0 && b > a,'source controller location');
const src = bundle.slice(a,b);
let calls=[];
class Value {
  constructor(value){this.value=value;this.stopped=0;}
  stopAnimation(){this.stopped++;}
  setValue(v){this.value=v;}
  __getValue(){return this.value;}
  interpolate(config){return {value:this,config};}
}
const Animated={
  Value, timing(value,config){return {start(callback){calls.push({value,config});},stop(){}};},
  add:(a,b)=>({add:[a,b]}), multiply:(a,b)=>({multiply:[a,b]})
};
const V={CAT_SPACING:203,CAT_ANIM_MS:250,ITEM_ANIM_MS:200,SUBMENU_ANIM_MS:250};
const core={ease:{outCubic:u=>1-Math.pow(1-u,3),smooth:u=>u},repeatIntervals:()=>[200,100]};
const context={Animated, nativeDriver:true, V, core,
  interp:(v,config)=>v.interpolate(config),Math,Date,setTimeout,clearTimeout,
  console};
const create=vm.runInNewContext(src+'\ncreateController',context);
const cats=[0,1,2].map(i=>({id:'c'+i,items:[{n:'a'+i}]}));
const ctl=create(cats,{startCategory:0});
function exitFor(v){return calls.find(x=>x.value===v);}
assert.deepStrictEqual(ctl.exitAlpha.map(x=>x.value),[0,0,0]);
assert.deepStrictEqual(ctl.exitMode.map(x=>x.value),[0,0,0]);
ctl.moveCat(1);
assert.strictEqual(ctl.state.ci,1);
assert.strictEqual(ctl.exitAlpha[0].value,1,'outgoing starts visible');
assert.strictEqual(ctl.exitMode[0].value,1,'outgoing native mode enabled');
assert.strictEqual(ctl.exitMode[1].value,0,'destination uses unchanged original arrival');
assert.strictEqual(exitFor(ctl.exitAlpha[0]).config.toValue,0);
assert.strictEqual(exitFor(ctl.exitAlpha[0]).config.duration,110);
assert.strictEqual(exitFor(ctl.exitAlpha[0]).config.useNativeDriver,true);
assert.strictEqual(exitFor(ctl.exitSlide[0]).config.toValue,268,'press right -> travel right');
assert.strictEqual(exitFor(ctl.catPos).config.toValue,1,'original category PS3 move preserved');
const ps3Ms=exitFor(ctl.catPos).config.duration;
assert(ps3Ms>=200,'PS3 mode-5 curve unchanged');
calls=[];
ctl.moveCat(-1);
assert.strictEqual(ctl.state.ci,0);
assert.strictEqual(ctl.exitSlide[0].value,0,'reversal clears prior drift');
assert.strictEqual(ctl.exitMode[0].value,0,'reversal restores original entry fade');
assert.strictEqual(ctl.exitAlpha[0].value,0,'reversal clears old fade value');
assert.strictEqual(exitFor(ctl.exitSlide[1]).config.toValue,-268,'press left -> travel left');
assert.strictEqual(exitFor(ctl.exitAlpha[1]).config.duration,110);
assert.strictEqual(exitFor(ctl.catPos).config.duration,ps3Ms);
calls=[];
ctl.moveCat(-1);
assert.strictEqual(calls.length,0,'boundary move creates no animations');
// External host model sync is an alternative navigation path.
calls=[];
ctl.sync({ci:2,sel:[0,0,0],stack:[],opt:[],info:null});
assert.strictEqual(ctl.state.ci,2);
assert.strictEqual(exitFor(ctl.exitSlide[0]).config.toValue,268);
assert.strictEqual(exitFor(ctl.exitAlpha[0]).config.duration,110);
assert.strictEqual(ctl.exitMode[2].value,0);
// Structural mutations must not inherit outdated outgoing offsets.
ctl.updateCategories([...cats,{id:'c3',items:[]}],1,[0,0,0,0]);
assert.strictEqual(ctl.exitAlpha.length,4);
assert.deepStrictEqual(ctl.exitAlpha.map(x=>x.value),[0,0,0,0]);
assert.deepStrictEqual(ctl.exitMode.map(x=>x.value),[0,0,0,0]);
assert.deepStrictEqual(ctl.exitSlide.map(x=>x.value),[0,0,0,0]);
ctl.reorder(['c1','c0','c2','c3'],0);
assert.deepStrictEqual(ctl.exitAlpha.map(x=>x.value),[0,0,0,0]);
assert.deepStrictEqual(ctl.exitMode.map(x=>x.value),[0,0,0,0]);
assert.deepStrictEqual(ctl.exitSlide.map(x=>x.value),[0,0,0,0]);
// Verify outgoing opacity is not multiplied by the old fast catPos gate.
assert(bundle.includes('A.mul(ctl.exitAlpha[i], ctl.exitMode[i])'));
assert(bundle.includes('A.mul(interp(ctl.catPos, core.COLUMN.alpha(i)), interp(ctl.exitMode[i]'));
assert(bundle.includes('colShift: ctl.categories.map((c, i) => A.add(A.add(interp(ctl.catPos, core.COLUMN.shiftX(i)), ctl.slotDx[i]), ctl.exitSlide[i]))'));
assert(bundle.includes('shiftX: nodes.colShift[c]') && bundle.includes('alphaMul: nodes.colAlpha[c]'));
assert(bundle.includes('const ms = Math.max(50, Math.round(110 * st.speed));'));
assert(bundle.includes('step(catPos, m.ci, "CAT_ANIM_MS")') && bundle.includes('step(catPos, n, "CAT_ANIM_MS")'));
console.log('PASS V83.15: 110ms native outgoing fade/slide left and right; reversal, sync, reorder, resize; PS3 Mode-5 preserved');
