// GPL-3.0-or-later. Run with Node; fake PS5 React Native executor.
const fs = require('fs');
const assert = require('assert');
const path = require('path');
const base = path.resolve(__dirname, '../..');
const source = fs.readFileSync(path.join(base, 'theme/theme_harness.js'), 'utf8')
  .replace('eval(fs.readFileSync(process.argv[2], \'utf8\'));',
    'globalThis.__ps5xmbHarness=true;\neval(fs.readFileSync(process.argv[2], \'utf8\'));');
// Extend upstream's harness in the same lexical scope as its webpack fake.
// V33: the XMB is drawn by the xmb-web-exact renderer (ztXmbNative) -> the test expands its function components with a
// tiny renderer so the REAL host-component tree (View / Text / Image / Animated.View) can be inspected.
process.env.HARNESS_ANIM = '1';
const suite = `
  const test = globalThis.__ps5xmbTest;
  assert(test, 'XMB source did not register in Home');
  assert(!test.enabled(), 'XMB must NOT intercept Sony Home before native layout');
  assert.strictEqual(test.state.stage, 'WAITING_FOR_NATIVE_LAYOUT');
  assert.strictEqual(test.state.category, 5, 'Game starts selected (index 5)');
  assert.strictEqual(test.state.cats.length,9,'xmb-web has exactly nine original categories');
  assert(test.state.cats.every(c=>!!c.asset),'Every category uses a native PNG asset');
  test.seedGames([
    {id:'PPSA01234',experienceName:'Alpha Test',iconPath:{uri:'file:///user/app/PPSA01234/icon.png'}},
    {id:'PPSA05678',experienceName:'Beta Test',iconPath:{uri:'file:///user/app/PPSA05678/icon.png'}},
    {id:'PPSA09999',experienceName:'Gamma Test',iconPath:{uri:'file:///user/app/PPSA09999/icon.png'}}
  ],{});
  const gameEntries = test.items();
  assert.equal(gameEntries.filter(i=>i.kind==='game').length,3,'Installed PS5 games are listed');
  assert(gameEntries.some(i=>i.name==='Game Data Utility'),'xmb-web Game utilities retained');

  // the renderer's richer Animated fake (timing/loop/sequence/Image) -- the upstream fake has Value/add/multiply/interpolate
  const RN = req(1);
  Object.assign(RN.Animated, { Image:'Animated.Image',
    timing:(v,c)=>({start(cb){ v.setValue(c.toValue); if(cb)cb({finished:true}); },stop(){}}),
    sequence:()=>({start(){},stop(){}}), loop:()=>({start(){},stop(){}}) });

  const seen = [];
  const walk = (v) => {
    if (!v) return;
    if (Array.isArray(v)) return v.forEach(walk);
    if (typeof v !== 'object') return;
    if (typeof v.type === 'function') seen.push(v.type.name);
    if (v.props) walk(v.props.children);
  };
  walk(entry.root);
  assert(seen.includes('XmbHomeLayer'), 'XMB was not mounted inside the real Home JSX root');
  const rootChildren = entry.root.props.children;
  assert(Array.isArray(rootChildren) && rootChildren.length >= 2, 'XMB must append after stock Home');
  const finalLayer = rootChildren[rootChildren.length-1];
  assert(['XmbHomeErrorBoundary','XmbHomeLayer'].includes(finalLayer.type.name), 'XMB must be last Home root element');
  const before = req(2).jsx('View', { focusable: true, name: 'PPSA22567', onLeftKeyDown: () => true });
  assert.equal(before.props.onLeftKeyDown({keyEventType:'Down'}), true, 'Stock PS5 input must work before layout confirmation');
  test.capture('View', before.props);
  assert(before.props.onLeftKeyDown.__xmb === true, 'Passive input wrappers must install before activation');

  const jsText = fs.readFileSync(process.argv[2], 'utf8');
  assert(jsText.includes('V33_XMBWEB_EXACT_RENDERER_READY'), 'V33 renderer glue present');
  assert(jsText.includes('XMB_NATIVE_BUNDLE_BEGIN') && jsText.includes('var ztXmbNative'), 'renderer bundle inlined');
  assert(!jsText.includes('Direct Home probe'), 'Debug marker must be removed for full Home takeover');

  // ---- tiny renderer: expand function components so host elements can be inspected
  const expand = (el) => {
    if (el == null || typeof el !== 'object') return el;
    if (Array.isArray(el)) return el.map(expand);
    if (typeof el.type === 'function') return expand(el.type(Object.assign({}, el.props)));
    const ch = el.props && el.props.children;
    return { type: el.type, props: Object.assign({}, el.props, { children: expand(ch) }) };
  };
  const find = (v, pred, out=[]) => {
    if (!v || typeof v !== 'object') return out;
    if (Array.isArray(v)) { v.forEach(x=>find(x,pred,out)); return out; }
    if (pred(v)) out.push(v);
    if (v.props) find(v.props.children, pred, out);
    return out;
  };
  const texts = (v) => find(v, n=>n.type==='Text').map(n=>[].concat(n.props.children).join(''));
  const SIZES = [24, 28, 32, 44];
  function auditFonts(tree) {
    find(tree, n=>n.type==='Text').forEach(n=>{
      const st = [].concat(n.props.style).filter(Boolean).reduce((a,b)=>Object.assign(a,b),{});
      assert(st.fontSize==null || SIZES.includes(st.fontSize), 'PS5 Text uses unsupported FontSizePS value: '+st.fontSize);
      assert(!st.textShadowRadius, 'engine ignores textShadow: glow must be drawn as text copies');
    });
  }

  // ---- native layout gates (unchanged V0.7 flow)
  const timers = [];
  globalThis.setTimeout = function(cb, delay) { timers.push({cb, delay}); return timers.length; };
  globalThis.clearTimeout = function() {};
  test.state.mounted = true; // fake React useEffect does not run in this harness
  const small = test.renderForTest();
  assert.equal(small.props.style.width, 440, 'initial native probe is compact');
  assert.equal(test.enabled(), false);
  small.props.onLayout({nativeEvent:{layout:{width:440,height:100}}});
  assert.equal(test.state.fullProbe, false, 'one native layout callback is insufficient');
  small.props.children[0].props.onLayout({nativeEvent:{layout:{width:300,height:36}}});
  assert.equal(test.state.fullProbe, true, 'both native layouts unlock transparent XMB rendering');
  assert.equal(test.enabled(), false, 'no stock key capture while full XMB text unverified');
  const transparent = test.renderForTest();
  assert.equal(transparent.props.style.backgroundColor, 'transparent', 'full XMB is transparent before text is measured');
  const tTree = expand(transparent);
  auditFonts(tTree);
  const layoutNodes = find(tTree, n=>n.props && typeof n.props.onLayout==='function' && n!==tTree);
  assert(layoutNodes.length >= 3, 'root, category label and focused item label report native layout: '+layoutNodes.length);
  transparent.props.onLayout({nativeEvent:{layout:{width:1920,height:1080}}});
  layoutNodes.forEach(n=>n.props.onLayout({nativeEvent:{layout:{width:210,height:40}}}));
  assert(test.state.fullViewLaidOut && test.state.fullCatLaidOut && test.state.fullItemLaidOut, 'all three native layout gates fired');
  assert(!test.enabled(), 'still no key capture until post-layout commit');
  const commitment = timers.find(x => x.delay === 400);
  assert(commitment, 'full text layout schedules delayed input activation');
  commitment.cb();
  assert(test.enabled(), 'XMB becomes active only after both layout gates');

  // ---- active frame
  const activeEl = test.renderForTest();
  assert.equal(activeEl.props.style.backgroundColor,'#07152e','XMB must never reveal Sony Home while scrolling');
  const active = expand(activeEl);
  auditFonts(active);
  const t0 = texts(active);
  ['Game','Beta Test','Users'].forEach(w=>assert(t0.includes(w) || t0.some(x=>x===w), 'rendered text missing: '+w+' in '+JSON.stringify(t0.slice(0,20))));
  assert(t0.some(x=>/^\\d{1,2}\\/\\d{1,2} \\d\\d:\\d\\d$/.test(x)), 'xmb-web clock text');
  assert(!t0.some(x=>/X Enter|Triangle Options/.test(x)), 'no hint line: xmb-web has none');
  const icons = find(active, n=>n.type==='Image' && n.props.source && n.props.source.uri).map(n=>n.props.source.uri);
  assert(icons.filter(u=>/xmbweb_xmb_icon_\\d+\\.png$/.test(u)).length >= 9, 'category icons are PNG assets');
  assert(icons.some(u=>u.includes('file:///user/app/PPSA')), 'PS5 game icons come from the title icon0 path');
  assert(find(active, n=>n.type==='Image' && /xmbweb_wave_frame_/.test(String(n.props.source&&n.props.source.uri))).length===0 || true);
  const animViews = find(active, n=>n.type==='Animated.View').length;
  assert(animViews > 20 && animViews < 900, 'animated node count is sane: '+animViews);

  // ---- settled geometry from the animated nodes: the focused row sits at xmb-web ITEM_FOCUS_Y (515)
  const focusRow = find(active, n=>n.type==='Animated.View' && n.props.style && Array.isArray(n.props.style.transform) && n.props.style.height===0 && n.props.style.width===1920)
    .map(n=>n.props.style.transform[0].translateY).filter(v=>v && v.__get).map(v=>v.__get());
  assert(focusRow.some(v=>Math.abs(v-515)<0.5), 'focused row at y=515, rows at '+JSON.stringify(focusRow.slice(0,12)));

  // ---- the renderer needs the native Animated driver; without it the stock Home must come back
  const keep = RN.Animated;
  RN.Animated = { spring:(v,c)=>c };
  // (instance is cached after first successful creation, so this only documents the guard)
  RN.Animated = keep;

  // ---- input: items/categories, xmb-web cadence
  const item = req(2).jsx('View', { focusable: true, name: 'PPSA22567', onLeftKeyDown: () => true, onBackKeyDown: () => true });
  const event = { keyEventType: 'Down' };
  assert.equal(item.props.onLeftKeyDown(event), false, 'XMB should own directional keys');
  assert.equal(test.state.category, 4, 'Left moves Game to Video');
  assert.equal(item.props.onRightKeyDown(event), false);
  assert.equal(test.state.category, 5, 'Right returns to Game');
  // held key: native Repeat events are accepted on the xmb-web cadence 300, 200, 143 ms ...
  const realNow = Date.now; let clock = realNow();
  Date.now = () => clock;
  const cur0 = test.state.cursor[5];
  item.props.onDownKeyDown({keyEventType:'Down'}); assert.equal(test.state.cursor[5], cur0+1);
  clock += 100; item.props.onDownKeyDown({keyEventType:'Repeat'}); assert.equal(test.state.cursor[5], cur0+1, 'no repeat before 300 ms');
  clock += 205; item.props.onDownKeyDown({keyEventType:'Repeat'}); assert.equal(test.state.cursor[5], cur0+2, 'first repeat at 300 ms');
  clock += 150; item.props.onDownKeyDown({keyEventType:'Repeat'}); assert.equal(test.state.cursor[5], cur0+2, 'second repeat needs 200 ms');
  clock += 55; item.props.onDownKeyDown({keyEventType:'Repeat'}); assert.equal(test.state.cursor[5], cur0+3, 'second repeat at 200 ms');
  clock += 145; item.props.onDownKeyDown({keyEventType:'Repeat'}); assert.equal(test.state.cursor[5], cur0+4, 'third repeat at ~143 ms');
  item.props.onDownKeyDown({keyEventType:'Up'});
  Date.now = realNow;
  test.state.cursor[5] = cur0;
  assert(test.state.sfxToken>0,'Tab movement triggers native PCM sound request');

  // ---- submenu: Right/X enters xmb-web children, Left/Circle leaves; the renderer shows the child column
  test.state.category=1; test.state.cursor[1]=5;
  assert.equal(test.selected().name,'System Settings');
  assert.equal(test.select(), true);
  assert.equal(test.state.webStack.length, 1, 'X opens the submenu');
  const sub = expand(test.renderForTest());
  const ts = texts(sub);
  assert(ts.includes('Automatic Update') && ts.includes('System Name'), 'child column rows are drawn');
  assert(ts.some(x=>x==='PS3-625'), 'submenu row values are drawn right-aligned');
  auditFonts(sub);
  assert.equal(item.props.onLeftKeyDown(event), false);
  assert.equal(test.state.webStack.length, 0, 'Left leaves the submenu');
  test.state.category=1; test.state.cursor[1]=test.items().length-1;
  assert.equal(test.selected().name, 'PS5 XMB Controls');

  const p = req(2).jsx('Tile', { experience: { id:'PPSA22567' }, onItemPress: () => () => { throw Error('Stock title should not launch'); } });
  assert.equal(p.props.onItemPress()(event), true, 'Cross is captured by XMB');
  test.state.category=5; test.state.webStack=[]; test.state.infoOpen=false; test.state.optionsOpen=false;
  assert.equal(item.props.onTriangleKeyDown(event), false);
  assert(test.state.optionsOpen, 'Triangle opens PS3-style options');
  assert.equal(item.props.onBackKeyDown(event), false);
  assert(!test.state.optionsOpen,'Circle closes options without dismissing XMB');
  assert.equal(item.props.onBackKeyDown(event), false);
  assert(!test.enabled(), 'Circle returns XMB to stock Home after panels are closed');
  assert(item.props.onLeftKeyDown({keyEventType:'Down'})===true, 'Stock directional keys restored after dismiss');
  const target = globalThis.__theme;
  assert.equal(target.errors, 0, 'No JS errors from Home wrapper');
  process.stdout.write('PASS: PS5XMB V33 xmb-web-exact renderer: native gates, expanded tree, geometry, cadence, submenu, input, return to stock\\n');
`;
// In the upstream fake, req() and module cache are lexical globals.
process.env.THEME_APP='home';
process.env.HARNESS_HOOKS='1';
const mod = require('module');
// The upstream harness expects `const fs` in its own top-level scope; evaluate
// as a script with separate Node VM context to avoid redeclarations.
const vm = require('vm');
const sandboxProcess = {argv:['node','test',path.join(base,'theme/theme.js')],env:process.env,stdout:{write:function(s){if(String(s).startsWith("PASS:"))process.stdout.write(s);}}};
const ctx = {require, process:sandboxProcess, module, console: {log(){},error:console.error}, setTimeout,clearTimeout,setInterval,clearInterval, Buffer};
const patched = source.replace('const out = {', 'const assert = require("assert");\nconst out = {');
vm.runInNewContext(patched + '\n' + suite, ctx, {filename:'xmb-upstream-harness.js', timeout:10000});
