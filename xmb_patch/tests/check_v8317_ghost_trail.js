'use strict';
// Host-side native graph and render tree checks. Not a PS5 GPU rendering test.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const b=fs.readFileSync(path.resolve(__dirname,'../xmb_native_bundle.js'),'utf8');
const start=b.indexOf('        function createController(categories, opts) {');
const end=b.indexOf('        const FILL = ',start);
assert(start>0&&end>start);
let calls=[];
class Value {
  constructor(value){this.value=value;this.stopped=0;}
  stopAnimation(){this.stopped++;}
  setValue(x){this.value=x;}
  __getValue(){return this.value;}
  interpolate(config){return {node:this,config};}
}
const Animated={Value,timing:(value,config)=>({start(){calls.push({value,config});}}),add:(a,c)=>({add:[a,c]}),multiply:(a,c)=>({mul:[a,c]}),View:'Animated.View'};
const V={W:1920,ITEM_ICON_X:566,ITEM_ICON_ACTIVE:180,CAT_SPACING:203,CAT_ANIM_MS:250,ITEM_ANIM_MS:200,SUBMENU_ANIM_MS:250};
const core={ease:{outCubic:u=>1-Math.pow(1-u,3),smooth:u=>u*u*(3-2*u),linear:u=>u},repeatIntervals:()=>[210,105]};
const create=vm.runInNewContext(b.slice(start,end)+'\ncreateController', {Animated,V,core,nativeDriver:true,Math,Date,console,setTimeout:()=>0,clearTimeout:()=>{},interp:(v,tr)=>v.interpolate(tr)});
const cats=Array.from({length:4},(_,i)=>({id:'c'+i,items:[{n:'Name '+i}]}));
const ctl=create(cats,{startCategory:0});
const findCall=v=>calls.find(c=>c.value===v);
assert.equal(ctl.exitGhostX.length,4);
assert.equal(ctl.exitGhostT.length,4);
ctl.moveCat(1);
assert.equal(ctl.state.ci,1);
assert.equal(findCall(ctl.exitAlpha[0]).config.duration,110,'base disappears in 110ms');
assert.equal(findCall(ctl.exitGhostX[0]).config.toValue,34,'echo drifts right');
assert.equal(findCall(ctl.exitGhostX[0]).config.duration,100);
assert.equal(findCall(ctl.exitGhostT[0]).config.duration,100);
assert.equal(findCall(ctl.exitGhostX[0]).config.useNativeDriver,true);
assert.equal(findCall(ctl.catPos).config.toValue,1,'Mode-5 unchanged');
let catMs=findCall(ctl.catPos).config.duration;
calls=[];
ctl.moveCat(-1);
assert.equal(findCall(ctl.exitGhostX[1]).config.toValue,-34,'echo drifts left');
assert.equal(findCall(ctl.exitGhostX[1]).config.duration,100);
assert.equal(ctl.exitGhostX[0].value,0,'re-entered old category gets reset');
assert.equal(ctl.exitGhostT[0].value,0);
assert.equal(ctl.exitMode[0].value,0);
assert.equal(findCall(ctl.catPos).config.duration,catMs);
calls=[];
ctl.moveCat(-1);
assert.equal(calls.length,0,'boundary no spurious effect');
calls=[];
ctl.sync({ci:2,sel:[0,0,0,0],stack:[],opt:[],info:null});
assert.equal(findCall(ctl.exitGhostX[0]).config.toValue,34,'host sync also drives ghost');
ctl.updateCategories([...cats,{id:'c4',items:[]}],1,[0,0,0,0,0]);
assert.equal(ctl.exitGhostX.length,5);
assert(ctl.exitGhostX.every(v=>v.value===0));
ctl.reorder(['c1','c0','c2','c3','c4'],0);
assert(ctl.exitGhostX.every(v=>v.value===0));
assert(!b.includes('exitSlide'));
assert(!b.includes('exitMaskX'));
assert(!b.includes('overflow: "hidden", transform: [{ translateX: p.wipeX }]'));
assert(b.includes('colShift: ctl.categories.map((c, i) => A.add(interp(ctl.catPos, core.COLUMN.shiftX(i)), ctl.slotDx[i]))'));
assert(b.includes('inputRange: [0, 0.08, 0.32, 0.72, 1], outputRange: [0, 0.24, 0.19, 0.07, 0]'));
const c0=b.indexOf('        function Column(p) {'), c1=b.indexOf('        const OPT = ',c0);
assert(c0>0&&c1>c0);
const h=(type,props,...children)=>({type,props,children});
const Column=vm.runInNewContext(b.slice(c0,c1)+'\nColumn',{
  Animated,V,View:'View',FILL:{position:'absolute',left:0,top:0,width:1920,height:1080},Row:'Row',h,sigOf:()=>'',Math,Object
});
const items=Array.from({length:24},(_,i)=>({n:'Row '+i}));
const p={ctl:{state:{fast:false}},items,pos:{},focusIdx:12,keyPrefix:'c0:',shiftX:'ps3-native',alphaMul:'base-alpha',ghostXNear:'echo-near-x',ghostXFar:'echo-far-x',ghostAlphaNear:'echo-near-alpha',ghostAlphaFar:'echo-far-alpha',whole:true};
const result=Column(p);
assert.equal(result.type,'View');
const echo=result.children[0][0], main=result.children[0][1];
assert.equal(echo.props.style.transform[0].translateX,'ps3-native','echo inherits base PS3 movement');
assert.equal(main.props.style.transform[0].translateX,'ps3-native','real items only move via native PS3 graph');
assert.equal(main.props.style.opacity,'base-alpha');
assert.equal(main.children[0].length,24);
const far=echo.children[0][0], near=echo.children[0][1];
assert.equal(far.props.style.transform[0].translateX,'echo-far-x');
assert.equal(near.props.style.transform[0].translateX,'echo-near-x');
assert.equal(far.props.style.opacity,'echo-far-alpha');
assert.equal(near.props.style.opacity,'echo-near-alpha');
assert.equal(far.children[0].length,11,'echoes duplicate just 11 nearby rows, not 24');
assert(far.children[0].every(r=>r.props.ghostOnly===true&&r.props.noGlow===true),'shadow rows skip glow');
assert(!main.children[0].some(r=>r.props.ghostOnly),'original rows unmodified');
const bare=Column({ctl:{state:{fast:false}},items:[{n:'one'}],pos:{},focusIdx:0,keyPrefix:'sub:'});
assert.equal(bare.type,'Animated.View','submenus have no echo');
console.log('PASS V83.17: 110ms original fade + 100ms native ghost echoes; left/right, rapid reversals, host sync, reorder, stationary originals, bounded shadow rows');
