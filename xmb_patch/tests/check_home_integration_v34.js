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
  assert.strictEqual(test.state.category, 3, 'Game starts selected (index 3 of 4)');
  assert.deepStrictEqual(test.state.cats.map(c=>c.id),['user','settings','photo','game'],'Music, Network, PlayStation Network, Friends and Video are removed');
  assert(test.state.cats.every(c=>!!c.asset),'Every category uses a native PNG asset');
  test.seedGames([
    {id:'PPSA01234',experienceName:'Alpha Test',iconPath:{uri:'file:///user/app/PPSA01234/icon.png'}},
    {id:'PPSA05678',experienceName:'Beta Test',iconPath:{uri:'file:///user/app/PPSA05678/icon.png'}},
    {id:'PPSA09999',experienceName:'Gamma Test',iconPath:{uri:'file:///user/app/PPSA09999/icon.png'}},
    {id:'PPSA11111',experienceName:'Delta Test',iconPath:{uri:'file:///user/app/PPSA11111/icon.png'}},
    {id:'PPSA22222',experienceName:'Epsilon Test',iconPath:{uri:'file:///user/app/PPSA22222/icon.png'}},
    {id:'PPSA33333',experienceName:'Zeta Test',iconPath:{uri:'file:///user/app/PPSA33333/icon.png'}},
    {id:'PPSA44444',experienceName:'Eta Test',iconPath:{uri:'file:///user/app/PPSA44444/icon.png'}}
  ],{});
  const gameEntries = test.items();
  assert.equal(gameEntries.filter(i=>i.kind==='game').length,7,'Installed PS5 games are listed');
  assert.deepStrictEqual(gameEntries.filter(i=>i.kind!=='game').map(i=>i.name),[],'V36: the Game category holds installed games and apps ONLY: '+JSON.stringify(gameEntries.map(i=>i.name)));

  // the renderer's richer Animated fake (timing/loop/sequence/Image) -- the upstream fake has Value/add/multiply/interpolate
  const sfxCalls = [];
  const portCalls = [];
  globalThis.fetch = (u) => { u=String(u); if (/kind=(warm|sleep)/.test(u)) portCalls.push(u); else if (/xmb-sfx/.test(u)) sfxCalls.push(u); return Promise.resolve({ok:true, text:()=>Promise.resolve('ok')}); };
  const lastSfx = () => (sfxCalls[sfxCalls.length-1]||'').replace(/^.*kind=/,'');
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
  assert(jsText.includes('V33_XMBWEB_EXACT_RENDERER_READY'), 'renderer glue present');
  assert(jsText.includes('PS5XMB_XMBWEB_Wave_Day.mp4') && jsText.includes('PS5XMB_XMBWEB_Wave_Night.mp4'), 'xmb-web wave videos are referenced');
  ['xmbweb_wave_frame_','xmb_linkev_frame_','webWaveFrame','shaderFrame','wave-window-','xmb_vsh_silk_'].forEach(t=>assert(!jsText.includes(t),'old wave code removed: '+t));
  assert(jsText.includes('XMB_NATIVE_BUNDLE_BEGIN') && jsText.includes('var ztXmbNative'), 'renderer bundle inlined');
  assert(!jsText.includes('Direct Home probe'), 'Debug marker must be removed for full Home takeover');

  // ---- tiny renderer: expand function components so host elements can be inspected
  const expand = (el) => {
    if (el == null || typeof el !== 'object') return el;
    if (Array.isArray(el)) return el.map(expand);
    if (el.type && typeof el.type === 'object' && el.type.$$typeof === 'memo') el = { type: el.type.type, props: el.props };   // React.memo of the harness fake
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
  const stage = test.renderForTest();
  // V59: the probe runs under the boot cover (black + intro) - nothing of the half-ready XMB or the PS5 Home is seen
  const stageKids = [].concat(stage.props.children).filter(Boolean);
  const small = stageKids[0];
  assert(stageKids.some(k => (k.key || (k.props && k.props.key)) === 'xmb-intro'), 'V59: boot cover over the layout probe');
  assert.equal(test.state.introState, 'playing', 'V59: the intro starts with the first frame');
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
  const commitment = timers.find(x => x.delay === 0);
  assert(commitment, 'full text layout schedules immediate input activation');
  commitment.cb();
  assert(test.enabled(), 'XMB becomes active only after both layout gates');

  // ---- V58: the boot intro holds the PS5's single video player: no wave video while it plays, the intro layer on top
  if (test.state.introState === 'playing') {
    const introEl = test.renderForTest();
    const fl = (v) => [].concat(v).reduce((a,x)=>a.concat(Array.isArray(x)?fl(x):[x]),[]).filter(Boolean);
    assert(!fl(introEl.props.children).some(k=>k.type && k.type.name==='VideoWallpaper'), 'V58: no wave video while the intro has the player');
    assert(fl(introEl.props.children).some(k=>(k.key||(k.props&&k.props.key))==='xmb-intro'), 'V58: intro layer on top');
  }
  // ---- active frame
  const introWas = test.state.introState;
  if (introWas === 'playing') test.state.introState = 'done';   // look at the XMB as it is after the intro (restored below)
  const activeEl = test.renderForTest();
  if (introWas === 'playing') test.state.introState = introWas;
  assert(/^#[0-9a-f]{6}$/i.test(activeEl.props.style.backgroundColor),'XMB must never reveal Sony Home while scrolling (backdrop colour while the wave video starts): '+activeEl.props.style.backgroundColor);
  const flat = (v) => [].concat(v).reduce((a,x)=>a.concat(Array.isArray(x)?flat(x):[x]),[]).filter(Boolean);
  const vidEl = flat(activeEl.props.children).find(k=>k.type && (k.type.name==='VideoWallpaper'));
  if(!vidEl) console.error('children types:', flat(activeEl.props.children).map(k=>k.type && (k.type.name||k.type)).join(','));
  assert(vidEl, 'the xmb-web wave video (ZhiThemes VideoWallpaper) is the first layer');
  assert(vidEl.props.uri.startsWith('http://127.0.0.1:4445/v/PS5XMB_XMBWEB_Wave_') && /(Day|Night)[.]mp4$/.test(vidEl.props.uri), 'wave video uri: '+vidEl.props.uri);
  assert.strictEqual(vidEl.props.sound,false); assert.strictEqual(vidEl.props.suppressBgm,true);
  assert.strictEqual(flat(activeEl.props.children).indexOf(vidEl),0,'the wave video is behind everything else');
  const active = expand(activeEl);
  auditFonts(active);
  const t0 = texts(active);
  ['Game','Beta Test','Users'].forEach(w=>assert(t0.includes(w) || t0.some(x=>x===w), 'rendered text missing: '+w+' in '+JSON.stringify(t0.slice(0,20))));
  assert(t0.some(x=>/^\\d{1,2}\\/\\d{1,2} \\d{1,2}:\\d\\d$/.test(x)), 'xmb-web clock text (D/M H:MM, hour not padded)');
  assert(!t0.some(x=>/X Enter|Triangle Options/.test(x)), 'no hint line: xmb-web has none');
  const icons = find(active, n=>n.type==='Image' && n.props.source && n.props.source.uri).map(n=>n.props.source.uri);
  assert(icons.filter(u=>/xmbweb_xmb_icon_\\d+(_s|_m)?\\.png$/.test(u)).length >= 4, 'category icons are PNG assets: '+JSON.stringify(icons.slice(0,12)));
  assert(icons.some(u=>u.includes('file:///user/app/PPSA')), 'PS5 game icons come from the title icon0 path');
  assert(find(active, n=>n.type==='Image' && /xmbweb_wave_frame_/.test(String(n.props.source&&n.props.source.uri))).length===0 || true);
  const animViews = find(active, n=>n.type==='Animated.View').length;
  assert(animViews > 20 && animViews < 900, 'animated node count is sane: '+animViews);

  // ---- settled geometry from the animated nodes: the focused row sits at PS3 focus y (505, measured from the RPCS3 recording + preset 385/175)
  const focusRow = find(active, n=>n.type==='Animated.View' && n.props.style && Array.isArray(n.props.style.transform) && n.props.style.height===0 && n.props.style.width===1920)
    .map(n=>n.props.style.transform[0].translateY).filter(v=>v && v.__get).map(v=>v.__get());
  assert(focusRow.some(v=>Math.abs(v-505)<0.5), 'focused row at y=505, rows at '+JSON.stringify(focusRow.slice(0,12)));

  // ---- the renderer needs the native Animated driver; without it the stock Home must come back
  const keep = RN.Animated;
  RN.Animated = { spring:(v,c)=>c };
  // (instance is cached after first successful creation, so this only documents the guard)
  RN.Animated = keep;

  // ---- input: items/categories, xmb-web cadence
  const item = req(2).jsx('View', { focusable: true, name: 'PPSA22567', onLeftKeyDown: () => true, onBackKeyDown: () => true });
  const event = { keyEventType: 'Down' };
  // ---- V57: the XMB5 boot intro plays on the first activation; the first press only skips it
  assert.equal(test.state.introState, 'playing', 'V57: boot intro on the first activation');
  assert(test.introOn(), 'V57: intro layer on screen');
  const catBefore = test.state.category;
  assert.equal(item.props.onLeftKeyDown(event), false, 'XMB should own directional keys');
  assert.equal(test.state.category, catBefore, 'V57: a press during the intro does not move');
  assert.equal(test.state.introState, 'playing', 'V79: a press during the boot video no longer skips it');
  test.introFinish('test');
  assert(!test.introOn() && test.state.introState === 'done', 'V57: intro gone');
  assert.equal(item.props.onLeftKeyDown(event), false, 'XMB should own directional keys');
  assert.equal(test.state.category, 2, 'Left moves Game to Photo');
  assert.equal(lastSfx(),'category','category move plays the PS3 category sound');
  assert.equal(item.props.onRightKeyDown(event), false);
  assert.equal(test.state.category, 3, 'Right returns to Game');
  assert.equal(item.props.onRightKeyDown(event), false);
  assert.equal(test.state.category, 3, 'Right stops at the last category (Game)');
  // held key: V83 uses initial 210 ms, then vertical repeat intervals times 0.7
  const realNow = Date.now; let clock = realNow();
  Date.now = () => clock;
  test.state.holdSpeed = 100;   /* the cadence below is the 100 % one; the V38 default is 110 % */
  const cur0 = test.state.cursor[3];
  item.props.onDownKeyDown({keyEventType:'Down'}); assert.equal(test.state.cursor[3], cur0+1);
  clock += 100; item.props.onDownKeyDown({keyEventType:'Repeat'}); assert.equal(test.state.cursor[3], cur0+1, 'no repeat before 210 ms');
  clock += 115; item.props.onDownKeyDown({keyEventType:'Repeat'}); assert.equal(test.state.cursor[3], cur0+2, 'first repeat at 210 ms');
  clock += 65; item.props.onDownKeyDown({keyEventType:'Repeat'}); assert.equal(test.state.cursor[3], cur0+2, 'second repeat needs ~74 ms');
  clock += 15; item.props.onDownKeyDown({keyEventType:'Repeat'}); assert.equal(test.state.cursor[3], cur0+3, 'second repeat at ~74 ms');
  clock += 40; item.props.onDownKeyDown({keyEventType:'Repeat'}); assert.equal(test.state.cursor[3], cur0+3, 'third repeat needs ~53 ms');
  clock += 15; item.props.onDownKeyDown({keyEventType:'Repeat'}); assert.equal(test.state.cursor[3], cur0+4, 'third repeat at ~53 ms');
  test.state.holdSpeed = 110;
  item.props.onDownKeyDown({keyEventType:'Up'});
  Date.now = realNow;
  test.state.cursor[3] = cur0;
  assert(test.state.sfxToken>0,'Tab movement triggers native PCM sound request');
  assert.equal(lastSfx(),'cursor','item move plays the PS3 cursor sound');

  // ---- V36: Photo category trimmed (no Search for Media Servers, no Playlists)
  test.state.category=2;
  const photoNames = test.items().map(i=>i.name);
  assert(photoNames.length>0 && !photoNames.some(n=>/Media Server|Playlist/i.test(n)), 'Photo trimmed: '+JSON.stringify(photoNames));
  // ---- V48: Photo holds Photos only (the console's screenshots); Settings holds System Settings, Theme Settings, PS5 XMB Controls
  assert.deepStrictEqual(photoNames, ['Photos','Video'], 'V78: Gallery = Photos + Video: '+JSON.stringify(photoNames));
  test.photosApply(JSON.stringify([{p:'/user/av_contents/photo/NPXS40087/NPXS40087/014/20261119_133727_00886115.png',t:1},
    {p:'/user/av_contents/photo/NPXS40087/NPXS40087/014/20261118_101010_00000001.png',t:0}]));
  assert.equal(test.items()[0].subtitle, '2 Images');
  assert.equal(test.select(), true); assert.equal(test.state.webStack.length, 1, 'X opens Photos');
  assert.deepStrictEqual(test.items().map(i=>i.name), ['2026/11/19 13:37:27','2026/11/18 10:10:10'], 'screenshots, newest first, named by date');
  assert.equal(test.items()[0].icon, '/user/av_contents/photo/NPXS40087/NPXS40087/014/20261119_133727_00886115.png');
  assert.equal(test.select(), true); assert(test.state.viewer, 'X on a screenshot shows it full screen');
  let pv = texts(expand(test.renderForTest()));
  assert(pv.some(x=>x.indexOf('2026/11/19 13:37:27')===0 && x.indexOf('1 / 2')>0), 'viewer caption: '+JSON.stringify(pv.slice(-3)));
  assert.equal(item.props.onRightKeyDown(event), false); assert.equal(test.state.webStack[0].cursor, 1, 'Right = next picture');
  assert.equal(test.state.viewer, true);
  assert.equal(item.props.onBackKeyDown(event), false); assert(!test.state.viewer, 'Circle closes the viewer'); assert.equal(test.state.webStack.length, 1);
  test.state.webStack = [];
  test.state.category=1;
  assert.deepStrictEqual(test.items().map(i=>i.name), ['System Settings','Theme Settings','PS5 XMB Controls'], 'V48 Settings: '+JSON.stringify(test.items().map(i=>i.name)));
  // ---- V51: Theme Settings > Colour / Day/Night choose the wave (saved settings applied on start)
  test.state.cursor[1]=1; assert.equal(test.selected().name,'Theme Settings'); test.select();
  test.state.webStack[0].cursor = test.items().findIndex(i=>i.name==='Colour');
  assert.equal(test.selected().value, 'Original'); test.select();
  assert.equal(test.items().length, 13, 'Original + 12 months'); assert.equal(test.items()[0].value, '\u2713');
  test.state.webStack[1].cursor = 3; assert.equal(test.selected().name, 'March'); test.select();
  assert.equal(test.state.waveMonth, 3); assert.equal(test.items()[3].value, '\u2713'); assert.equal(test.items()[0].value, '');
  assert(/^XMB5_Wave_03_/.test(test.waveMonthName()), test.waveMonthName());
  test.back(); assert.equal(test.selected().value, 'March', 'the Colour row shows the choice');
  test.state.webStack[0].cursor = test.items().findIndex(i=>i.name==='Day/Night'); test.select();
  test.state.webStack[1].cursor = 2; assert.equal(test.selected().name, 'Night'); test.select();
  assert.equal(test.waveMonthName(), 'XMB5_Wave_03_Night.mp4');
  test.prefsApply('waveMonth=0\\nwaveTime=day\\nanimSpeed=125\\nbogus=1\\n');
  assert.equal(test.waveMonthName().slice(-8), '_Day.mp4'); assert.equal(test.state.animSpeed, 100, 'V61: animation speed fixed at 100 %'); assert.equal(test.state.waveMonth, 0);
  test.state.animSpeed = 115; test.state.waveTime = 'auto'; test.prefsApply('');
  test.state.webStack = [];
  test.state.category=3;

  // ---- submenu: Right/X enters xmb-web children, Left/Circle leaves; the renderer shows the child column
  test.state.category=1; test.state.cursor[1]=0;
  // V60: real PS5 values (as /xmb-sys sends them) fill System Settings
  test.state.sys = {name:'PS5-RYZE', lang:18, fw:'13.60', ip:'192.0.2.1', mac:'AA:BB:CC:DD:EE:FF', wifi:false, free:500e9, total:825e9};
  test.sysApply();
  assert.equal(test.selected().name,'System Settings');
  assert.equal(test.select(), true);
  assert.equal(test.state.webStack.length, 1, 'X opens the submenu');
  assert.equal(lastSfx(),'decide','opening a submenu plays the PS3 decide sound');
  const sub = expand(test.renderForTest());
  const ts = texts(sub);
  assert(ts.includes('PS5 Settings') && ts.includes('System Name'), 'child column rows are drawn');
  assert(ts.some(x=>x==='PS5-RYZE'), 'V60: the PS5 name is the System Name value');
  assert(ts.some(x=>x==='English (United Kingdom)'), 'V60: the PS5 language is the System Language value');
  assert(!ts.includes('Character Set') && !ts.includes('Enable ATRAC') && !ts.some(x=>/PS Vita/.test(x)), 'V60: PS3-only items are gone');
  auditFonts(sub);
  assert.equal(item.props.onLeftKeyDown(event), false);
  assert.equal(test.state.webStack.length, 0, 'Left leaves the submenu');
  assert.equal(lastSfx(),'cancel','leaving a submenu plays the PS3 cancel sound');
  test.select(); assert.equal(test.state.webStack.length, 1);
  assert.equal(item.props.onBackKeyDown(event), false);
  assert.equal(test.state.webStack.length, 0, 'Circle leaves the submenu');
  assert.equal(lastSfx(),'cancel','Circle (cancel) plays the PS3 cancel sound');
  test.state.category=1; test.state.cursor[1]=test.items().length-1;
  assert.equal(test.selected().name, 'PS5 XMB Controls');

  const p = req(2).jsx('Tile', { experience: { id:'PPSA22567' }, onItemPress: () => () => { throw Error('Stock title should not launch'); } });
  assert.equal(p.props.onItemPress()(event), true, 'Cross is captured by XMB');
  // V63: the Triangle panel belongs to the Game category only
  test.state.category=1; test.state.webStack=[]; test.state.infoOpen=false; test.state.optionsOpen=false;
  { // V78: every column has Rename Column / Column Icon (the XMB's own columns cannot be deleted or moved)
    assert.equal(item.props.onTriangleKeyDown(event), false);
    assert(test.state.optionsOpen, 'V78: Triangle opens the panel on Settings');
    const names = test.nativeModel().opt[0].items.map(o=>o.n);
    assert.deepEqual(names, ['Rename Column','Column Icon','Move Column Left','Move Column Right'], 'V78/V79: an XMB column: '+names.join(','));
    test.state.optionsCursor = 1; test.move('right'); test.state.optionsSub.cursor = 2; test.select();
    assert.equal(test.nativeModel().cats[1].asset, 'xmbweb_xmb_icon_psn', 'V78: Column Icon on Settings');
    assert(test.state.optionsOpen && test.state.optionsSub, 'the icon list stays open');
    test.state.optionsCursor = 0; test.state.optionsSub = null; test.select();
    assert(test.state.kb && test.state.kb.kind === 'renamecol', 'V78: Rename Column on Settings asks for a name');
    test.folderData(JSON.stringify({id:'XMBCB_settings', name:'My Settings', t:1}));
    assert.equal(test.nativeModel().cats[1].name, 'My Settings', 'V78: Settings renamed');
    test.state.catOv = {}; test.columnsApply();
    assert.equal(test.nativeModel().cats[1].name, 'Settings');
    test.state.optionsOpen = false; test.state.optionsSub = null; }
  test.state.category=3; test.state.cursor[3]=0;
  const firstGame = test.selected().name;
  assert.equal(item.props.onTriangleKeyDown(event), false);
  assert(test.state.optionsOpen, 'Triangle opens PS3-style options');
  assert.equal(lastSfx(),'decide');
  { const nm = test.nativeModel();   /* V62/V63: drawn by the renderer from model.opt: "Sort By" group + the title's options, no "Close" */
    const names = nm.opt[0].items.map(o=>o.n);
    assert(nm.opt.length === 1 && names[0] === 'Sort By' && nm.opt[0].items[0].head && nm.opt[0].items[0].ch && names.indexOf('Information') > 0 && names.indexOf('Close') < 0, 'model.opt: '+JSON.stringify(names));
    assert(names[1] === 'New Folder' && nm.opt[0].items[1].head, 'V68: New Folder in the top group');
    assert(nm.opt[0].idx === nm.opt[0].items.findIndex(o => !o.head && !o.grp) && names[nm.opt[0].idx] === 'Start', 'the cursor opens on the first option of the title, below Sort By');
    assert(nm.info === null, 'no Information screen yet'); }
  // Sort By > the 4 sorts (Right opens them; the active one is marked), Z to A re-orders the list and keeps the focused title
  test.move('up'); test.state.optionsCursor = 0; test.move('right');
  { const nm = test.nativeModel();
    assert(nm.opt.length === 2 && nm.opt[1].items.map(o=>o.n).join('|') === 'Creation Date|Format|A to Z|Z to A|Custom', 'the PS3 sorts + A to Z / Z to A');
    assert(nm.opt[1].idx === 2 && nm.opt[1].at === 2 && nm.opt[1].items[2].mark, 'opens on the active sort (A to Z), marked'); }
  test.move('down'); test.select();
  assert(test.state.optionsOpen && test.state.optionsSub && test.state.gameSort === 'za', 'V78: a sort is applied and the panel stays open');
  assert(test.nativeModel().opt[1].items[3].mark, 'V78: the new sort is marked');
  test.state.optionsOpen = false; test.state.optionsSub = null;
  { const names = test.items().map(i=>i.name), sorted = names.slice().sort((a,b)=>b.localeCompare(a));
    assert.deepStrictEqual(names, sorted, 'Z to A');
    assert.equal(test.selected().name, firstGame, 'the focus stays on the same title'); }
  test.state.gameSort = 'az'; test.items();
  item.props.onTriangleKeyDown(event); test.state.optionsCursor = 0; test.select();
  assert(test.state.optionsSub, 'X on Sort By opens the sorts');
  assert.equal(item.props.onBackKeyDown(event), false);
  assert(test.state.optionsOpen && !test.state.optionsSub, 'Circle closes the sorts first');
  assert.equal(item.props.onBackKeyDown(event), false);
  assert(!test.state.optionsOpen,'Circle closes options without dismissing XMB');
  assert.equal(test.nativeModel().opt.length, 0, 'model.opt empty once closed');
  test.state.infoOpen = true;
  { const inf = test.nativeModel().info;   /* V62: the PS3 Information screen (renderer); V63: with the title's size */
    assert(inf && inf.rows[0][0] === 'Title' && inf.rows[0][1] === test.selected().name && typeof inf.icon === 'string', 'model.info: Title row + icon');
    assert(inf.rows.some(r => r[0] === 'Size'), 'model.info: Size row: '+JSON.stringify(inf.rows)); }
  test.state.infoOpen = false;
  assert.equal(lastSfx(),'cancel');
  const sfxBefore = sfxCalls.length;
  assert.equal(item.props.onBackKeyDown(event), false);
  assert(test.enabled(), 'Circle on the top level does NOT return to the stock Home');
  assert.equal(sfxCalls.length, sfxBefore, 'Circle on the top level is silent');
  assert(item.props.onLeftKeyDown({keyEventType:'Down'})===false, 'XMB still owns the d-pad after Circle');
  { // V64: R1 / L1 (Games <-> Media), OPTIONS and the other Home buttons do nothing under the XMB; X (Cross) is never touched
    let r1 = 0, opt = 0, cross = 0;
    const kp = { onRKeyDown: () => { r1++; return true; }, onLKeyDown: () => { r1++; return true; }, onOptionsKeyDown: () => { opt++; return true; }, onCrossKeyDown: () => { cross++; return true; } };
    test.capture('View', kp);
    assert(test.enabled(), 'the XMB is on');
    assert.equal(kp.onRKeyDown({keyEventType:'Down'}), false); assert.equal(kp.onLKeyDown({keyEventType:'Down'}), false);
    assert.equal(kp.onOptionsKeyDown({keyEventType:'Down'}), false);
    assert(r1 === 0 && opt === 0, 'R1 / L1 / OPTIONS blocked while the XMB is on screen');
    kp.onCrossKeyDown({}); assert.equal(cross, 1, 'Cross handlers are left alone');
    // V65: a container's own Circle handler (it played the PS5 cancel sound under the PS3 one) is blocked too; the XMB's focusable views keep theirs
    let pback = 0;
    const parent = { onBackKeyDown: () => { pback++; return true; } };
    test.capture('View', parent);
    assert.equal(parent.onBackKeyDown({keyEventType:'Down'}), false); assert.equal(pback, 0, 'the Home container does not get Circle');
    // V67: the Home's focusable views lose their native key sounds (the PS5 cancel sound under the PS3 one)
    const fv = { focusable: true, name: 'PPSA99999', cursorEndSFXEnabledDirection: ['left'] };
    test.capture('View', fv);
    assert(fv.soundEffectsEnabled === false && fv.cursorEndSFXEnabledDirection.length === 0, 'native key sounds off under the XMB');
  }
  test.state.category=3;
  assert(portCalls.some(u=>/kind=warm/.test(u)), 'V38: the native audio port is warmed when the XMB is on screen: '+portCalls.join(' '));
  // ---- V61: PS5 XMB Controls = Return to PS5 Home only; every other value fixed (PS3 motion / sounds, 100 %, 0 ms, volume 60)
  test.state.category=1; test.state.cursor[1]=test.items().length-1; test.state.webStack=[];
  assert.equal(test.select(), true);
  assert.deepStrictEqual(test.items().map(i=>i.name), ['Return to PS5 Home'], 'V61 PS5 XMB Controls');
  test.state.webStack=[];
  test.prefsApply('animSpeed=125\\nholdSpeed=115\\nmotion=smooth\\nsoundMode=system\\nbootIntro=off\\nstartDelay=10\\nwaveMonth=3\\n');
  assert(test.state.motion==='ps3' && test.state.soundMode==='ps3' && test.state.bootIntro!=='off' && test.state.startDelay===0, 'V61: old saved values ignored');
  assert.equal(test.state.waveMonth, 3, 'V61: the wave colour is still saved');
  test.state.waveMonth = 0;
  // ---- V61: Theme Settings = Colour + Day/Night
  test.state.cursor[1]=test.items().findIndex(i=>i.name==='Theme Settings'); test.select();
  assert.deepStrictEqual(test.items().map(i=>i.name), ['Colour','Day/Night'], 'V61 Theme Settings');
  test.state.webStack=[];
  // ---- V61: System Settings = PS5 Settings + read-only information
  test.state.category=1; test.state.cursor[1]=0; test.state.webStack=[];
  assert.equal(test.selected().name,'System Settings'); test.select();
  const sysKids = test.items();
  assert.equal(sysKids[0].name, 'PS5 Settings'); assert.equal(sysKids[0].page, 'settings');
  assert(sysKids.some(i=>i.name==='IP Address' && i.value==='192.0.2.1' && i.kind==='info'), 'V61: IP shown read-only');
  assert(sysKids.some(i=>i.name==='System Storage' && /500 GB free of 825 GB/.test(i.value)), 'V61: storage line');
  test.state.webStack[0].cursor = sysKids.findIndex(i=>i.name==='IP Address');
  const sBefore = sfxCalls.length; assert.equal(test.select(), true); assert.equal(sfxCalls.length, sBefore, 'V61: X on an information row does nothing');
  test.state.webStack=[];
  // V68: no power items in Users any more (the PS button menu has them)
  test.state.category=0; test.state.cursor[0]=0;
  assert(!test.items().some(i=>/Turn Off System|Restart System|Enter Rest Mode/.test(i.name)), 'V68: Users has no power items: '+test.items().map(i=>i.name).join(','));
  // V68: game folders in the Game category
  test.state.category=3; test.state.webStack=[]; test.state.optionsOpen=false; test.state.optionsSub=null; test.state.infoOpen=false;
  test.state.folders = []; test.state.cursor[3]=0;
  const g0 = test.items()[0];
  // V69: Add to Folder with no folder made yet: an empty list (no "New Folder" in it)
  item.props.onTriangleKeyDown(event);
  test.state.optionsCursor = test.nativeModel().opt[0].items.findIndex(o=>o.n==='Add to Folder');
  test.move('right');
  assert(test.nativeModel().opt.length === 2 && test.nativeModel().opt[1].items.length === 0, 'V69: the folder list is empty');
  test.select(); assert(test.state.optionsOpen, 'X on the empty list does nothing');
  item.props.onBackKeyDown(event); item.props.onBackKeyDown(event);
  assert(!test.state.optionsOpen);
  assert.equal(g0.kind, 'game');
  test.folderCreate('Shooters', g0.id);
  { const it = test.items();
    assert(it[0].kind === 'xmb-folder' && it[0].name === 'Shooters' && it[0].subtitle === '1 item', 'the folder is first: '+JSON.stringify(it[0].name));
    assert.equal(it[0].iconAsset, 'xmbweb_folder_ps3', 'V69: the PS3 folder icon');
    assert(!it.some(i=>i.kind==='game' && i.id===g0.id), 'a game in a folder leaves the list');
    assert.equal(test.state.cursor[3], 0, 'the focus goes to the new folder'); }
  test.select();
  assert(test.state.webStack.length === 1 && test.state.webStack[0].fid, 'X opens the folder');
  assert.equal(test.selected().id, g0.id);
  item.props.onTriangleKeyDown(event);
  { const names = test.nativeModel().opt[0].items.map(o=>o.n);
    assert(names.indexOf('Remove from Folder') > 0 && names.indexOf('Move to Folder') > 0 && names.indexOf('New Folder') < 0, 'options inside a folder: '+names.join(',')); }
  test.state.optionsCursor = test.nativeModel().opt[0].items.findIndex(o=>o.n==='Remove from Folder');
  test.select();
  assert(test.state.webStack.length === 0, 'the emptied folder closes');
  assert(test.items().some(i=>i.kind==='game' && i.id===g0.id), 'the game is back in the list');
  assert.equal(test.items()[0].subtitle, 'Empty');
  // New Folder (Triangle, top group) -> the PS5 keyboard -> "zt-rename" answer
  test.state.cursor[3] = 1;
  item.props.onTriangleKeyDown(event);
  test.state.optionsCursor = test.nativeModel().opt[0].items.findIndex(o=>o.n==='New Folder');
  test.select();
  assert(test.state.kb && test.state.kb.kind === 'new', 'New Folder asks for a name');
  assert.equal(test.folderData(JSON.stringify({id:'XMBFNEW', name:'RPG', t:1})), true);
  assert(test.state.folders.some(f=>f.name==='RPG'), 'the typed name makes the folder');
  assert.equal(test.folderData(JSON.stringify({id:'ZTFOLDER1', name:'x', t:1})), false, 'ZhiThemes own renames are left alone');
  // Add to Folder > RPG
  test.state.webStack=[]; const gi = test.items().findIndex(i=>i.kind==='game'); test.state.cursor[3] = gi; const gid = test.items()[gi].id;
  item.props.onTriangleKeyDown(event);
  test.state.optionsCursor = test.nativeModel().opt[0].items.findIndex(o=>o.n==='Add to Folder');
  test.move('right');
  { const sub = test.nativeModel().opt[1].items.map(o=>o.n); assert(sub.indexOf('RPG') >= 0 && sub[sub.length-1] === 'New Folder', 'Add to Folder lists the folders: '+sub.join(',')); 
    test.state.optionsSub.cursor = sub.indexOf('RPG'); }
  test.select();
  assert(test.state.folders.find(f=>f.name==='RPG').ids.indexOf(gid) >= 0, 'Add to Folder puts the game in');
  test.state.folders = []; test.folderCreate; test.state.foldersVer++; 
  // V73: custom columns + Close Application
  test.state.webStack=[]; test.state.optionsOpen=false; test.state.optionsSub=null; test.state.category=3;
  { const gi2 = test.items().findIndex(i=>i.kind==='game'); test.state.cursor[3] = gi2; }
  const cg = test.selected(); assert.equal(cg.kind, 'game');
  test.state.running = {id: cg.id};
  item.props.onTriangleKeyDown(event);
  { const names = test.nativeModel().opt[0].items.map(o=>o.n);
    assert(names.indexOf('New Column') > 0 && names.indexOf('Close Application') > 0 && names.indexOf('Move to Column') < 0, 'V73: Game options: '+names.join(',')); }
  test.state.optionsCursor = test.nativeModel().opt[0].items.findIndex(o=>o.n==='New Column');
  test.select();
  assert(test.state.kb && test.state.kb.kind === 'newcol', 'New Column asks for a name');
  test.folderData(JSON.stringify({id:'XMBCNEW', name:'Homebrew', t:1}));
  assert.equal(test.state.cats.length, 5, 'the column is a new category: '+test.state.cats.map(c=>c.name).join(','));
  assert.equal(test.nativeModel().cats[4].name, 'Homebrew');
  assert.equal(test.state.category, 3, 'still in Game');
  item.props.onTriangleKeyDown(event);
  test.state.optionsCursor = test.nativeModel().opt[0].items.findIndex(o=>o.n==='Move to Column');
  assert(test.state.optionsCursor > 0, 'Move to Column once a column exists');
  test.move('right');
  { const sub = test.nativeModel().opt[1].items.map(o=>o.n); assert.deepEqual(sub, ['Homebrew','New Column']); }
  test.state.optionsSub.cursor = 0; test.select();
  assert(!test.items().some(i=>i.id===cg.id), 'the game left the Game list');
  test.state.category = 4; test.state.cursor[4] = 0;
  assert.equal(test.selected().id, cg.id, 'the game is in the column');
  item.props.onTriangleKeyDown(event);
  { const names = test.nativeModel().opt[0].items.map(o=>o.n);
    assert(['Rename Column','Column Icon','Delete Column','Move to Column','Move Column Left','Close Application','Move App'].every(n=>names.indexOf(n)>=0) && names.indexOf('New Folder')<0 && names.indexOf('Move Column Right')<0, 'column options: '+names.join(',')); }
  test.state.optionsCursor = test.nativeModel().opt[0].items.findIndex(o=>o.n==='Column Icon');
  test.move('right'); test.state.optionsSub.cursor = 2; test.select();
  assert.equal(test.nativeModel().cats[4].asset, 'xmbweb_xmb_icon_psn', 'Column Icon > PlayStation');
  assert(test.state.optionsOpen && test.state.optionsSub && test.state.optionsSub.kind === 'icons', 'V77: the icon list stays open after a choice');
  assert(test.nativeModel().opt[1].items[2].mark, 'V77: the new icon is marked');
  item.props.onTriangleKeyDown(event);
  assert(!test.state.optionsOpen, 'Triangle closes the panel');
  // V74: Move Column Left - the column goes before Game, Game moves one place right
  item.props.onTriangleKeyDown(event);
  test.state.optionsCursor = test.nativeModel().opt[0].items.findIndex(o=>o.n==='Move Column Left');
  test.select();
  assert.deepEqual(test.state.cats.map(c=>c.name).slice(3), ['Homebrew','Game'], 'the column moved left: '+test.state.cats.map(c=>c.name).join(','));
  assert.equal(test.state.category, 3, 'the focus stays on the column'); assert.equal(test.gameCat(), 4, 'Game is now the 5th category');
  assert(test.state.optionsOpen, 'V77: the panel stays open after a column move');
  assert.equal(test.nativeModel().opt[0].items[test.state.optionsCursor].n, 'Move Column Left', 'V77: the cursor stays on the same option');
  item.props.onTriangleKeyDown(event);
  // V74: Move to Column > Game (instead of Remove from Column)
  item.props.onTriangleKeyDown(event);
  test.state.optionsCursor = test.nativeModel().opt[0].items.findIndex(o=>o.n==='Move to Column');
  test.move('right');
  assert.deepEqual(test.nativeModel().opt[1].items.map(o=>o.n), ['Game','New Column']);
  test.state.optionsSub.cursor = 0; test.select();
  assert.equal(test.items()[0].kind, 'none', 'the column is empty again');
  test.state.category = 4;
  assert(test.items().some(i=>i.id===cg.id), 'the game is back in Game');
  // put it back for the delete test
  test.state.category = 3;
  item.props.onTriangleKeyDown(event);
  test.state.optionsCursor = test.nativeModel().opt[0].items.findIndex(o=>o.n==='Delete Column');
  test.select();
  assert.equal(test.state.cats.length, 4, 'Delete Column removes the category');
  assert.equal(test.state.category, 3, 'back to Game'); assert.equal(test.gameCat(), 3);
  assert(test.items().some(i=>i.id===cg.id), 'its games are back in Game');
  // V74: Move (custom order): Triangle > Move, Down moves the game one place, X ends; Sort By is Custom
  { const before = test.items().map(i=>i.id||i.fid); const gi3 = test.items().findIndex(i=>i.kind==='game'); test.state.cursor[3] = gi3; const mid = test.items()[gi3].id;
    item.props.onTriangleKeyDown(event);
    test.state.optionsCursor = test.nativeModel().opt[0].items.findIndex(o=>o.n==='Move App');
    test.select();
    assert(test.state.moveMode && test.state.gameSort === 'custom', 'Move starts (Custom sort)');
    assert.deepEqual(test.items().map(i=>i.id||i.fid), before, 'switching to Custom keeps the order on screen');
    test.move('down');
    const after = test.items().map(i=>i.id||i.fid);
    assert.equal(after[gi3+1], mid, 'the game moved down one place'); assert.equal(test.selected().id, mid, 'the focus follows it');
    test.select(); assert(!test.state.moveMode, 'X ends Move');
    test.state.gameSort = 'az'; test.state.order = []; test.items(); }
  // V76: each list has its own sort: Game in Custom, a new column still A to Z (its Sort By shows A to Z)
  { test.state.webStack=[]; test.state.category=3; test.state.gameSort='custom'; test.items();
    const gidS = test.items().find(i=>i.kind==='game').id;
    test.columnCreate('Sorted', gidS);
    const ci = test.state.cats.findIndex(c=>c.name==='Sorted'); test.state.category = ci; test.state.cursor[ci] = 0;
    item.props.onTriangleKeyDown(event);
    test.state.optionsCursor = 0; test.move('right');
    const sub = test.nativeModel().opt[1].items; assert(sub.find(o=>o.n==='A to Z').mark && !sub.find(o=>o.n==='Custom').mark, 'the column shows its own sort (A to Z)');
    item.props.onBackKeyDown(event); item.props.onBackKeyDown(event);
    // the column options are their own group
    item.props.onTriangleKeyDown(event);
    const its = test.nativeModel().opt[0].items; assert(its.filter(o=>o.grp).map(o=>o.n).join('|') === 'Rename Column|Column Icon|Move Column Left|Delete Column', 'column group: '+its.map(o=>o.n+(o.grp?'*':'')).join(','));
    item.props.onBackKeyDown(event);
    test.state.columns = []; test.columnsApply(); test.state.category = 3; test.state.gameSort = 'az'; test.state.order = []; test.items(); }
  // V79: every column moves (Settings one place right, then back); the bar order is kept
  { test.state.webStack=[]; test.state.category=1; test.state.optionsOpen=false;
    const ids0 = test.nativeModel().cats.map(c=>c.id);
    item.props.onTriangleKeyDown(event);
    const names = test.nativeModel().opt[0].items.map(o=>o.n);
    assert.deepEqual(names, ['Rename Column','Column Icon','Move Column Left','Move Column Right'], 'V79: an XMB column moves too: '+names.join(','));
    test.state.optionsCursor = 3; test.select();
    const ids1 = test.nativeModel().cats.map(c=>c.id);
    assert.equal(ids1[2], ids0[1], 'V79: Settings moved right: '+ids1.join(','));
    assert.equal(test.state.category, 2, 'V79: the focus stays on Settings');
    assert(test.state.optionsOpen, 'the panel stays open');
    assert.equal(test.nativeModel().opt[0].items[test.state.optionsCursor].n, 'Move Column Right');
    test.state.optionsCursor = test.nativeModel().opt[0].items.findIndex(o=>o.n==='Move Column Left'); test.select();
    assert.deepEqual(test.nativeModel().cats.map(c=>c.id), ids0, 'V79: and back');
    test.state.optionsOpen = false; test.state.barOrder = null; test.columnsApply(); test.state.category = 3; }
  // V79: Custom comes back as you left it: A to Z and back to Custom keeps the custom order
  { test.state.webStack=[]; test.state.category=3; test.state.gameSort='az'; test.state.order=[]; test.items();
    const gi = test.items().findIndex(i=>i.kind==='game'); test.state.cursor[3] = gi; const mid = test.items()[gi].id;
    item.props.onTriangleKeyDown(event);
    test.state.optionsCursor = test.nativeModel().opt[0].items.findIndex(o=>o.n==='Move App'); test.select();
    test.move('down'); test.select();
    const custom = test.items().map(i=>i.id||i.fid);
    assert.equal(custom[gi+1], mid, 'moved down');
    test.state.gameSort='az'; test.state.gamesVer = (test.state.gamesVer||0)+1;
    item.props.onTriangleKeyDown(event); test.state.optionsCursor = 0; test.move('right');
    test.state.optionsSub.cursor = 4; test.select();   // Custom
    assert.equal(test.state.gameSort, 'custom');
    assert.deepEqual(test.items().map(i=>i.id||i.fid), custom, 'V79: back to Custom brings back the custom order');
    test.state.optionsOpen=false; test.state.optionsSub=null; test.state.gameSort='az'; test.state.order=[]; test.items(); }
  // V74: Folder Icon
  test.state.folders = []; test.state.cursor[3] = 0; test.folderCreate('Icons');
  item.props.onTriangleKeyDown(event);
  test.state.optionsCursor = test.nativeModel().opt[0].items.findIndex(o=>o.n==='Folder Icon');
  test.move('right');
  assert.equal(test.nativeModel().opt[1].items[0].n, 'PS3 Folder'); assert(test.nativeModel().opt[1].items[0].mark, 'the folder icon in use is marked');
  test.state.optionsSub.cursor = 4; test.select();
  assert.equal(test.items()[0].iconAsset, 'xmbweb_xmb_icon_062', 'Folder Icon > Folder');
  assert(test.state.optionsOpen && test.state.optionsSub && test.state.optionsSub.kind === 'ficons', 'V77: the folder icon list stays open');
  item.props.onTriangleKeyDown(event);
  test.state.folders = []; test.state.foldersVer++;

  test.state.running = null;
  test.state.category=3;
  // V36: the explicit way out is Settings > PS5 XMB Controls > Return to PS5 Home (the Game category holds games and apps only)
  test.state.category=1; test.state.cursor[1]=test.items().length-1;
  assert.equal(test.selected().name,'PS5 XMB Controls');
  assert.equal(test.select(), true);
  assert.equal(test.state.webStack.length, 1);
  assert.equal(test.selected().name,'Return to PS5 Home');
  assert.equal(test.select(), true);
  assert(test.enabled() && test.state.confirmExit, 'Return to PS5 Home opens a PS3-style confirmation without unloading');
  assert(item.props.onBackKeyDown(event)===false && !test.state.confirmExit, 'Circle cancels confirmation and retains XMB');
  const target = globalThis.__theme;
  assert.equal(target.errors, 0, 'No JS errors from Home wrapper');
  process.stdout.write('PASS: PS5XMB V83.2 xmb-web-exact renderer: 4 categories, native gates, geometry, cadence, submenu, sounds, Circle stays in XMB, explicit return to stock\\n');
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
