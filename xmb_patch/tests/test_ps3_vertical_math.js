'use strict';
const fs=require('fs');
const vm=require('vm');
const assert=require('assert');
const path=require('path');
const root=path.resolve(__dirname,'..','..');
const text=fs.readFileSync(path.join(root,'xmb_patch','xmb_extension.js'),'utf8');
const a=text.indexOf('  function xmbRowY(delta, category) {');
const b=text.indexOf('  function xmbMove(dir) {',a);
assert(a>0 && b>a, 'cannot isolate exact source function');
const code=text.slice(a,b)+'\n xmbRowY;';
const context={
  xmbHome:{verticalGeometryMode:'designer'},
  XMB_DESIGNER:{itemFocusY:419,itemAboveY:146,itemBelowY:635,itemGap:78,
    gameFocusHeight:178,gameIdleHeight:74,otherFocusSize:87,otherIdleSize:65}
};
const y=vm.runInNewContext(code,context);
assert.strictEqual(y(-1,6),146);
assert.strictEqual(y(0,6),419);
assert.strictEqual(y(1,6),635);
assert.strictEqual(y(-3,6),-10);
assert.strictEqual(y(3,6),791);
context.xmbHome.verticalGeometryMode='preset0';
for (const cat of [6,1]) {
  const game=cat===6;
  const focus=game?178:87,idle=game?74:65;
  const px=78/80;
  assert.strictEqual(y(0,cat),419);
  const center=y(0,cat)+focus/2;
  const above=y(-1,cat)+idle/2;
  const below=y(1,cat)+idle/2;
  assert(Math.abs(above-(center-175*px))<1e-7);
  assert(Math.abs(below-(center+175*px))<1e-7);
  assert(Math.abs(y(-2,cat)-y(-1,cat)+80*px)<1e-7);
  assert(Math.abs(y(2,cat)-y(1,cat)-80*px)<1e-7);
  for(let i=-8;i<8;i++) assert(y(i,cat)<y(i+1,cat),`not ordered at ${i} cat=${cat}`);
}
context.XMB_DESIGNER.itemGap=0;
assert(Number.isFinite(y(-1,6)));
console.log('PASS: actual xmbRowY JS function, Sony Y-up -> PS5 Y-down, geometry toggles, row ordering');
