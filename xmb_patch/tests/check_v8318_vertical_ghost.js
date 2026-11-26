'use strict';
// Native animation graph simulation. Does not claim PS5 GPU verification.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(path.resolve(__dirname,'../xmb_native_bundle.js'),'utf8');
const first=src.indexOf('        function createController(categories, opts) {');
const last=src.indexOf('        const FILL = ',first);
assert(first>0&&last>first);
let calls=[];
class Value {
 constructor(value){this.value=value;this.stopped=0;}
 stopAnimation(){this.stopped++;}
 setValue(x){this.value=x;}
 __getValue(){return this.value;}
 interpolate(config){return {node:this,config};}
}
const Animated={Value,timing:(value,config)=>({start(){calls.push({value,config});}}),add:(a,b)=>({add:[a,b]}),multiply:(a,b)=>({mul:[a,b]}),View:'Animated.View'};
const A={mul:(a,b)=>b===undefined||b===null?a:a===undefined||a===null?b:Animated.multiply(a,b),add:(a,b)=>b===undefined||b===null?a:a===undefined||a===null?b:Animated.add(a,b)};
const V={W:1920,ITEM_ICON_X:566,ITEM_ICON_ACTIVE:180,CAT_SPACING:203,CAT_ANIM_MS:250,ITEM_ANIM_MS:200,SUBMENU_ANIM_MS:250};
const core={ease:{outCubic:u=>1-Math.pow(1-u,3),smooth:u=>u*u*(3-2*u),linear:u=>u},repeatIntervals:()=>[210,105],SUB:{PS3:{arrowFrom:80}}};
const create=vm.runInNewContext(src.slice(first,last)+'\ncreateController', {Animated,V,core,A,nativeDriver:true,Math,Date,console,setTimeout:()=>0,clearTimeout:()=>{},interp:(v,tr)=>v.interpolate(tr)});
const items=Array.from({length:25},(_,i)=>({n:'Row '+i}));
const cats=Array.from({length:4},(_,i)=>({id:'c'+i,items}));
const ctl=create(cats,{startCategory:0});
const call=v=>calls.find(c=>c.value===v);
assert.equal(ctl.scrollGhostMode.length,4);
assert.equal(ctl.scrollGhostY.length,4);
assert.equal(ctl.scrollGhostT.length,4);
assert.equal(ctl.state.sel[0],0);
ctl.moveItem(1);
assert.equal(ctl.state.sel[0],1);
assert.equal(ctl.scrollGhostMode[0].value,1);
assert.equal(call(ctl.scrollGhostY[0]).config.toValue,34,'down sends ghost behind rising list');
assert.equal(call(ctl.scrollGhostY[0]).config.duration,155);
assert.equal(call(ctl.scrollGhostY[0]).config.useNativeDriver,true);
assert.equal(call(ctl.scrollGhostT[0]).config.toValue,1);
assert.equal(call(ctl.rootPos[0]).config.toValue,1,'base row animation is unchanged');
assert.equal(call(ctl.rootPos[0]).config.useNativeDriver,true);
assert(!call(ctl.exitAlpha[0]),'vertical navigation never triggers horizontal exit fade');
calls=[];
ctl.moveItem(1); // hold/repeat step
assert.equal(ctl.state.sel[0],2);
assert.equal(call(ctl.scrollGhostY[0]).config.toValue,34);
assert(ctl.scrollGhostY[0].stopped>=2,'repeats cancel the prior echo instead of stacking animations');
calls=[];
ctl.moveItem(-1); // instant direction reversal
assert.equal(call(ctl.scrollGhostY[0]).config.toValue,-34);
assert.equal(call(ctl.rootPos[0]).config.toValue,1);
calls=[];
ctl.moveCat(1);
assert.equal(ctl.scrollGhostMode[0].value,0,'horizontal move clears vertical trail');
assert.equal(ctl.scrollGhostMode[1].value,0);
assert.equal(call(ctl.exitGhostX[0]).config.toValue,34,'horizontal V83.17 ghost preserved');
calls=[];
ctl.sync({ci:1,sel:[1,1,0,0],stack:[],opt:[],info:null});
assert.equal(call(ctl.scrollGhostY[1]).config.toValue,34,'host-owned navigation also starts echo');
assert.equal(ctl.scrollGhostMode[0].value,0);
calls=[];
ctl.sync({ci:1,sel:[1,0,0,0],stack:[],opt:[],info:null});
assert.equal(call(ctl.scrollGhostY[1]).config.toValue,-34,'host reverse direction');
assert(!call(ctl.exitAlpha[1]));
calls=[];
ctl.enter();
assert.equal(ctl.state.stack.length,0,'no unexpected submenu created');
const submenu=[{n:'a'},{n:'b'},{n:'c'},{n:'d'}];
ctl.sync({ci:1,sel:[1,0,0,0],stack:[{items:submenu,idx:0,title:'Nested'}],opt:[],info:null});
const f=ctl.state.stack[0];
assert(f&&f.verticalNodes,'submenu frame owns persistent native afterimage graph');
calls=[];
ctl.moveItem(1);
assert.equal(f.idx,1);
assert.equal(call(f.verticalY).config.toValue,34,'nested submenu scroll down');
assert.equal(call(f.pos).config.toValue,1);
assert(!call(ctl.exitAlpha[1]),'submenu vertical remains independent of horizontal exit');
calls=[];
ctl.sync({ci:1,sel:[1,0,0,0],stack:[{items:submenu,idx:0,title:'Nested'}],opt:[],info:null});
assert.equal(call(f.verticalY).config.toValue,-34,'nested host sync scroll up');
assert.equal(call(f.pos).config.toValue,0);
calls=[];
ctl.moveItem(-1);
assert.equal(calls.length,0,'no effect beyond first row');
ctl.updateCategories([...cats,{id:'c4',items}],1,[0,0,0,0,0]);
assert.equal(ctl.scrollGhostMode.length,5);
assert(ctl.scrollGhostMode.every(v=>v.value===0),'structure updates clear stale ghosts');
ctl.reorder(['c1','c0','c2','c3','c4'],0);
assert(ctl.scrollGhostMode.every(v=>v.value===0),'reordering clears trails');
// Confirm the renderer duplicates ONLY translucent echoes, not item movement.
const c0=src.indexOf('        function Column(p) {'),c1=src.indexOf('        const OPT = ',c0);
const h=(type,props,...children)=>({type,props,children});
const Column=vm.runInNewContext(src.slice(c0,c1)+'\nColumn',{Animated,V,View:'View',FILL:{position:'absolute',left:0,top:0,width:1920,height:1080},Row:'Row',h,sigOf:()=>'',Math,Object});
const vertical=Column({ctl:{state:{fast:false}},items,pos:{},focusIdx:12,keyPrefix:'sub:',ghostYNear:'echo-y-near',ghostYFar:'echo-y-far',ghostAlphaNear:'alpha-near',ghostAlphaFar:'alpha-far',whole:true,compact:true});
assert.equal(vertical.type,'View','vertical submenus get translucent ghost rows');
const [echo,main]=vertical.children[0];
assert(!main.props.style.transform,'real items gain no extra offset');
assert(!main.props.style.opacity,'real items gain no opacity fade');
const [far,near]=echo.children[0];
assert.deepEqual(JSON.parse(JSON.stringify(far.props.style.transform)),[{translateY:'echo-y-far'}]);
assert.deepEqual(JSON.parse(JSON.stringify(near.props.style.transform)),[{translateY:'echo-y-near'}]);
assert.equal(far.props.style.opacity,'alpha-far');
assert.equal(near.props.style.opacity,'alpha-near');
assert.equal(far.children[0].length,11,'bounded nearby items only');
assert(far.children[0].every(r=>r.props.ghostOnly&&r.props.noGlow));
const mixed=Column({ctl:{state:{fast:false}},items,pos:{},focusIdx:12,keyPrefix:'root:',ghostXNear:'h-near',ghostXFar:'h-far',ghostYNear:'v-near',ghostYFar:'v-far',ghostAlphaNear:'a-near',ghostAlphaFar:'a-far',whole:true});
const [mixedEcho,mixedMain]=mixed.children[0];
assert.equal(mixedEcho.children[0][0].props.style.transform[0].translateX,'h-far');
assert.equal(mixedEcho.children[0][0].props.style.transform[1].translateY,'v-far');
assert.equal(mixedMain.props.style.transform,undefined,'horizontal/vertical ghost cannot translate the base items');
console.log('PASS V83.18: vertical echoes root/submenu, Up/Down & repeat/reverse, host sync, no real-item opacity or translation, V83.17 horizontal preserved');
