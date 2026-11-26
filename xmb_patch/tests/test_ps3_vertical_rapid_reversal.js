'use strict';
const assert=require('assert'),fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..','..');
const source=fs.readFileSync(path.join(root,'xmb_patch','xmb_extension.js'),'utf8');
function sliceFunction(name,following){
  const start=source.indexOf('  function '+name+'(');
  const end=source.indexOf('  function '+following+'(',start);
  assert(start>=0 && end>start, name+' not found');
  return source.slice(start,end);
}
const functions=[
  sliceFunction('xmbPs3VerticalEase','xmbRowMotionAnchors'),
  sliceFunction('xmbRowMotionAnchors','xmbEnabled'),
  sliceFunction('xmbRowY','xmbMove')
].join('\n')+'\n({xmbPs3VerticalEase,xmbRowMotionAnchors,xmbRowY});';
const context={xmbHome:{verticalGeometryMode:'designer'},XMB_DESIGNER:{
  itemFocusY:419,itemAboveY:146,itemBelowY:635,itemGap:78,
  gameFocusHeight:178,gameIdleHeight:74,otherFocusSize:87,otherIdleSize:65
}};
const {xmbPs3VerticalEase:ease,xmbRowMotionAnchors:anchors,xmbRowY:y}=vm.runInNewContext(functions,context);
const almost=(a,b,msg)=>assert(Math.abs(a-b)<1e-7,`${msg}: ${a} != ${b}`);
function sampled(curve,x){
  const {ix}=curve,values=curve.y,scale=curve.focus;
  if(ix.length===1)return {y:values[0],peak:scale[0]};
  let at=0;
  while(at+1<ix.length && ix[at+1]<x)at++;
  if(at+1>=ix.length)return {y:values[at],peak:scale[at]};
  const t=(x-ix[at])/(ix[at+1]-ix[at]);
  return {y:values[at]+(values[at+1]-values[at])*t,
    peak:scale[at]+(scale[at+1]-scale[at])*t};
}
for(const t of [0,.001,.01,.1,.2,.49,.5,.501,.8,.9,.99,1]) {
  assert(ease(t)>=0 && ease(t)<=1);
  almost(ease(t),1-ease(1-t),'direction-symmetric easing');
}
almost(ease(0),0,'start');almost(ease(1),1,'end');
assert(source.includes('var XMB_PS3_VERTICAL_DURATION_MS = 200;'));
assert(source.includes('var XMB_PS3_BAR_SETTLE_MS = 850;'));
assert(source.includes('easing:xmbPs3VerticalEase,useNativeDriver:true'));
assert(source.includes('easing:xmbPs3CategoryEase,useNativeDriver:true'));
for(const mode of ['designer','preset0'])for(const category of [1,6])for(const count of [1,2,3,9,35]) {
  context.xmbHome.verticalGeometryMode=mode;
  const focusH=category===6?178:87,idleH=category===6?74:65;
  const curves=Array.from({length:count},(_,j)=>anchors(j,count,category,focusH,idleH));
  for(let j=0;j<count;j++) {
    const curve=curves[j];
    assert(curve.ix[0]===0 && curve.ix[curve.ix.length-1]===count-1);
    for(let q=1;q<curve.ix.length;q++)assert(curve.ix[q]>curve.ix[q-1]);
    for(let k=0;k<count;k++) {
      const v=sampled(curve,k), selected=k===j;
      const actualSize=idleH+(focusH-idleH)*v.peak;
      almost(actualSize,selected?focusH:idleH,'size at rest');
      const actualTop=v.y+(focusH-actualSize)/2;
      almost(actualTop,y(j-k,category),`original image top mode=${mode} cat=${category} j=${j} k=${k}`);
    }
  }
  // Simulate arbitrary fast input and direction reversals at fractional visual cursor states.
  // The visible icon geometry must remain coherent even when the logical cursor
  // has moved several entries ahead of the actual native driver.
  for(let step=0;step<=(count-1)*20;step++) {
    const visual=step/20;
    for(let j=0;j<count-1;j++) {
      const a=sampled(curves[j],visual),b=sampled(curves[j+1],visual);
      const hA=idleH+(focusH-idleH)*a.peak,hB=idleH+(focusH-idleH)*b.peak;
      const centerA=a.y+focusH/2,centerB=b.y+focusH/2;
      const gap=centerB-centerA - (hA+hB)/2;
      assert(gap>=-1e-5,`image collision: mode=${mode} cat=${category} n=${count} visual=${visual} rows=${j}/${j+1} gap=${gap}`);
    }
  }
}
console.log('PASS: stable whole-list interpolation, no rapid-input image collision, pixel-identical resting Designer/Preset0 geometry, full-size image scaling, 200ms VSH input, category motion preserved');
