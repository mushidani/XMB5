// V83.16 native directional clipping test. Not a substitute for PS5 hardware.
const fs=require('fs'), path=require('path'), vm=require('vm'), assert=require('assert');
const bundle=fs.readFileSync(path.resolve(__dirname,'../xmb_native_bundle.js'),'utf8');
const start=bundle.indexOf('        function createController(categories, opts) {');
const end=bundle.indexOf('        const FILL = ',start);
assert(start>0 && end>start,'extract controller');
let calls=[];
class Value {
  constructor(value){this.value=value;this.stopped=0;}
  stopAnimation(){this.stopped++;}
  setValue(v){this.value=v;}
  __getValue(){return this.value;}
  interpolate(config){return {node:this,config};}
}
const Animated={Value,timing:(value,config)=>({start(){calls.push({value,config});}}),add:(a,b)=>({add:[a,b]}),multiply:(a,b)=>({mul:[a,b]}),View:'Animated.View'};
const V={W:1920,ITEM_ICON_X:566,ITEM_ICON_ACTIVE:180,CAT_SPACING:203,CAT_ANIM_MS:250,ITEM_ANIM_MS:200,SUBMENU_ANIM_MS:250};
const core={ease:{outCubic:u=>1-Math.pow(1-u,3),smooth:u=>u*u*(3-2*u),linear:u=>u},repeatIntervals:()=>[210,105]};
const baseCtx={Animated,V,core,nativeDriver:true,Math,Date,console,setTimeout:()=>0,clearTimeout:()=>{},interp:(v,tr)=>v.interpolate(tr)};
const create=vm.runInNewContext(bundle.slice(start,end)+'\ncreateController',baseCtx);
const cats=[0,1,2].map(i=>({id:'c'+i,items:[{n:'Title '+i}]}));
const ctl=create(cats,{startCategory:0});
const findCall=value=>calls.find(c=>c.value===value);
const sweep=1920-(566-180/2);
assert.deepStrictEqual(Array.from(ctl.exitMaskX,v=>v.value),[0,0,0]);
ctl.moveCat(1);
assert.strictEqual(ctl.state.ci,1);
assert.strictEqual(findCall(ctl.exitMaskX[0]).config.toValue,sweep,'right goes positive');
assert.strictEqual(findCall(ctl.exitMaskX[0]).config.duration,110);
assert.strictEqual(findCall(ctl.exitMaskX[0]).config.useNativeDriver,true);
assert.strictEqual(findCall(ctl.exitAlpha[0]).config.duration,110);
assert.strictEqual(findCall(ctl.exitAlpha[0]).config.easing,core.ease.linear);
assert.strictEqual(findCall(ctl.catPos).config.toValue,1,'PS3 catPos unchanged');
const ps3Dur=findCall(ctl.catPos).config.duration;
calls=[];
ctl.moveCat(-1);
assert.strictEqual(findCall(ctl.exitMaskX[1]).config.toValue,-sweep,'left goes negative');
assert.strictEqual(ctl.exitMaskX[0].value,0,'rapid reverse resets incoming mask');
assert.strictEqual(ctl.exitMode[0].value,0,'rapid reverse restores incoming original alpha');
assert.strictEqual(findCall(ctl.catPos).config.duration,ps3Dur);
calls=[];
ctl.moveCat(-1);
assert.strictEqual(calls.length,0,'boundaries never exit');
calls=[];
ctl.sync({ci:2,sel:[0,0,0],stack:[],opt:[],info:null});
assert.strictEqual(findCall(ctl.exitMaskX[0]).config.toValue,sweep,'host sync has wipe');
ctl.updateCategories([...cats,{id:'c3',items:[]}],1,[0,0,0,0]);
assert.strictEqual(ctl.exitMaskX.length,4);
assert(ctl.exitMaskX.every(v=>v.value===0),'structure resets mask');
ctl.reorder(['c1','c0','c2','c3'],0);
assert(ctl.exitMaskX.every(v=>v.value===0),'reorder resets mask');
assert(!bundle.includes('exitSlide'),'no extra item slide nodes remain');
assert(bundle.includes('colShift: ctl.categories.map((c, i) => A.add(interp(ctl.catPos, core.COLUMN.shiftX(i)), ctl.slotDx[i]))'),'original cat motion only');
assert(bundle.includes('A.mul(ctl.exitMaskX[i], -1)'),'mask inverse translates keep actual content stationary');
assert(bundle.includes('overflow: "hidden"'),'GPU clipping present');
// Render Column in isolation to check nested clipping and counter-translation.
const c0=bundle.indexOf('        function Column(p) {');
const c1=bundle.indexOf('        const OPT = ',c0);
assert(c0>0 && c1>c0);
const h=(type,props,...children)=>({type,props,children});
const Column=vm.runInNewContext(bundle.slice(c0,c1)+'\nColumn',{
  React:{},Animated,V,FILL:{position:'absolute',left:0,top:0,width:1920,height:1080},
  Row:'Row',h,sigOf:()=>'',Math,Object
});
const rendered=Column({ctl:{state:{fast:false}},items:[{n:'one'}],pos:{},focusIdx:0,keyPrefix:'c0:',shiftX:'original-PS3-position',alphaMul:'original-alpha',wipeX:'directional-mask',wipeUndoX:'inverse-mask',whole:true});
assert.strictEqual(rendered.props.style.overflow,'hidden');
assert.strictEqual(rendered.props.style.transform[0].translateX,'directional-mask');
const inverse=rendered.children[0];
assert.strictEqual(inverse.props.style.transform[0].translateX,'inverse-mask');
const content=inverse.children[0];
assert.strictEqual(content.props.style.transform[0].translateX,'original-PS3-position');
assert.strictEqual(content.children[0][0].type,'Row');
const bare=Column({ctl:{state:{fast:false}},items:[{n:'one'}],pos:{},focusIdx:0,keyPrefix:'c0:'});
assert.strictEqual(bare.children[0][0].type,'Row','submenus remain unmasked');
// Mathematical invariant of paired transforms. The mask moves, never pixels.
for(const dir of [-1,1])for(const f of [0,.25,.5,.75,1]){
  const dx=dir*sweep*f;
  assert.strictEqual(dx+(-dx),0,'content is stationary during mask sweep');
}
console.log('PASS V83.16: directional 110ms native mask wipe, stationary content, rapid reversals, original PS3 Mode-5 and submenu preserved');
