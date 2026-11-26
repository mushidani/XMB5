// GPL-3.0-or-later. Run with Node; fake PS5 React Native executor.
const fs = require('fs');
const assert = require('assert');
const path = require('path');
const base = path.resolve(__dirname, '../..');
const source = fs.readFileSync(path.join(base, 'theme/theme_harness.js'), 'utf8')
  .replace('eval(fs.readFileSync(process.argv[2], \'utf8\'));',
    'globalThis.__ps5xmbHarness=true;\neval(fs.readFileSync(process.argv[2], \'utf8\'));');
// Extend upstream's harness in the same lexical scope as its webpack fake.
const suite = `
  const test = globalThis.__ps5xmbTest;
  assert(test, 'XMB source did not register in Home');
  assert(!test.enabled(), 'XMB must NOT intercept Sony Home before native layout');
  assert.strictEqual(test.state.stage, 'WAITING_FOR_NATIVE_LAYOUT');
  assert.strictEqual(test.state.category, 5, 'Exact nine-category xmb-web Game starts at index 5');
  assert.strictEqual(test.state.cats.length,9,'xmb-web has exactly nine original categories');
  assert(test.state.cats.every(c=>!!c.asset),'Every category uses native PNG asset, not unsupported glyph');
  // Test actual category and game models, not only a screenshot or source text.
  test.seedGames([
    {id:'PPSA01234',experienceName:'Alpha Test',iconPath:{uri:'file:///user/app/PPSA01234/icon.png'}},
    {id:'PPSA05678',experienceName:'Beta Test',iconPath:{uri:'file:///user/app/PPSA05678/icon.png'}},
    {id:'PPSA09999',experienceName:'Gamma Test',iconPath:{uri:'file:///user/app/PPSA09999/icon.png'}}
  ],{});
  const gameEntries = test.items();
  assert.equal(gameEntries.filter(i=>i.kind==='game').length,3,'Actual installed PS5 game entries retained alongside clone utility rows');
  assert(gameEntries.some(i=>i.name==='Game Data Utility'),'Exact xmb-web Game utilities retained');
  const largeGame = test.rowMetrics(gameEntries.find(i=>i.kind==='game'),true,5);
  const smallGame = test.rowMetrics(gameEntries.find(i=>i.kind==='game'),false,5);
  assert.equal(largeGame.center,smallGame.center,'Focused and small game icons remain on the same vertical center');
  assert.equal(largeGame.left+largeGame.width/2,smallGame.left+smallGame.width/2);
  assert.equal(largeGame.width,312);assert.equal(largeGame.height,176);
  assert.equal(smallGame.width,108);assert.equal(smallGame.height,61);
  const largeUtil = test.rowMetrics({kind:'route'},true,1);
  const smallUtil = test.rowMetrics({kind:'route'},false,1);
  assert.equal(largeUtil.center,smallUtil.center,'Focused and small Settings icons stay on same axis');
  assert.equal(largeUtil.left+largeUtil.width/2,smallUtil.left+smallUtil.width/2);

  // Home root receives the new layer inside the upstream front-layer gate.
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
  // Regression: native PS5 Text crashes/reloads ShellUI when handed raw fontSize
  // numbers not present in RN's FontSizePS enum table.
  const jsText = fs.readFileSync(process.argv[2], 'utf8');
  const xmbPart = jsText.split('/* PS5XMB HOME V1.4 MEDIA FOCUS FIX')[1].split('  function wrapJsx(fn) {')[0];
  assert(xmbPart.includes('function xmbFontSize('));
  assert(!xmbPart.includes('fontSize: 23') && !xmbPart.includes('fontSize: 28') && !xmbPart.includes('fontSize: active ?') && !xmbPart.includes('fontSize: chosen ?'),
    'XMB source contains unsafe raw fontSize: only use xmbFontSize()');
  assert(!jsText.includes('Direct Home probe'), 'Debug marker must be removed for full Home takeover');
  function auditFonts(v) {
    if (!v) return;
    if (Array.isArray(v)) return v.forEach(auditFonts);
    if (typeof v !== 'object') return;
    if (v.props && v.type === 'Text') {
      const style = v.props.style || {};
      const f = style.fontSize;
      assert(f == null || [24, 28, 32, 44].includes(f),
         'PS5 Text uses unsupported native FontSizePS value: '+f);
    }
    if (v.props) auditFonts(v.props.children);
  }

  /* Test both layout gates, not just the injected input callbacks. */
  const timers = [];
  globalThis.setTimeout = function(cb, delay) { timers.push({cb, delay}); return timers.length; };
  globalThis.clearTimeout = function() {};
  test.state.mounted = true; // fake React useEffect does not run in this harness
  auditFonts(entry.root); // full Home layer is the last direct-root child
  const small = test.renderForTest();
  auditFonts(small);
  assert.equal(small.props.style.width, 440, 'initial native probe is compact');
  assert.notEqual(small.props.style.backgroundColor, '#09235a', 'initial probe must not cover Home');
  assert.equal(test.enabled(), false);
  small.props.onLayout({nativeEvent:{layout:{width:440,height:100}}});
  assert.equal(test.state.fullProbe, false, 'one native layout callback is insufficient');
  const probeText = small.props.children[0];
  probeText.props.onLayout({nativeEvent:{layout:{width:300,height:36}}});
  assert.equal(test.state.fullProbe, true, 'both native layouts unlock transparent XMB rendering');
  assert.equal(test.enabled(), false, 'no stock key capture while full XMB text unverified');
  const transparent = test.renderForTest();
  auditFonts(transparent);
  assert.equal(transparent.props.style.backgroundColor, 'transparent',
    'full XMB must be transparent before selected-item text is measured');
  transparent.props.onLayout({nativeEvent:{layout:{width:1920,height:1080}}});
  let seenLayouts = 0;
  function scanLayouts(el) {
    if (!el) return;
    if (Array.isArray(el)) return el.forEach(scanLayouts);
    if (typeof el !== 'object') return;
    if (el.props && typeof el.props.onLayout === 'function' && el !== transparent) {
      el.props.onLayout({nativeEvent:{layout:{width:210,height:40}}});seenLayouts++;
    }
    if (el.props) scanLayouts(el.props.children);
  }
  scanLayouts(transparent.props.children);
  assert(seenLayouts >= 2, 'category and item text have onLayout callbacks');
  assert(!test.enabled(), 'still no key capture until post-layout commit');
  const commitment = timers.find(x => x.delay === 400);
  assert(commitment, 'full text layout schedules delayed input activation');
  commitment.cb();
  assert(test.enabled(), 'XMB becomes active only after both layout gates');
  const activeTree = test.renderForTest();
  // V16: Never mount the older video background. Verify the genuine
  // VSH palette remains visible and the live native path produces 30 strips
  // when the native RN Animated primitives are present.
  const findNodes=(v,test,out=[])=>{
    if(!v)return out;
    if(Array.isArray(v)){v.forEach(x=>findNodes(x,test,out));return out;}
    if(typeof v!=='object')return out;
    if(test(v))out.push(v);
    if(v.props)findNodes(v.props.children,test,out);
    return out;
  };
  const legacyVideo=findNodes(activeTree,v=>v.type&&v.type.name==='VideoWallpaper');
  assert.equal(legacyVideo.length,0,'No MP4 wallpaper component may mount');
  assert.equal(activeTree.props.style.backgroundColor,'#07152e','XMB must never reveal Sony Home while scrolling');
  const dateLabel=test.playedLabel({id:'PPSA01234',kind:'game',lastPlayed:Date.UTC(2026,0,24,5,37)});
  assert(dateLabel.includes('1/24/2026'),'Real Sony play timestamps used');
  assert.equal(test.playedLabel({id:'PPSA01234',kind:'game',lastPlayed:0}),'');
  const initialAnimated=req(1).Animated;
  function fakeVal(v){this.setValue=function(){};this.interpolate=function(){return '__native_interpolated__';};}
  req(1).Animated={View:'Animated.View',Image:'Animated.Image',Value:fakeVal,
    timing:()=>({start(){},stop(){}}),sequence:()=>({start(){},stop(){}}),loop:()=>({start(){},stop(){}})};
  const nativeTree=test.renderForTest();
  const strips=findNodes(nativeTree,v=>v.type==='Animated.Image'&&v.props&&v.props.source&&
    /xmb_(?:native|vsh)_silk_/.test(String(v.props.source.uri||'')));
  const upstreamReady=jsText.includes('XMB_LINK_EV_AVAILABLE = true;');
  assert.equal(strips.length,upstreamReady?0:30,'Native VSH strips when no linkev frames, else upstream layers');
  const palettes=findNodes(nativeTree,v=>v.props&&v.props.source&&
    /xmb_vsh_month_[0-9][0-9]_(?:day|night)[.]png/.test(String(v.props.source.uri||'')));
  assert.equal(palettes.length,upstreamReady?0:1,'VSH palette only needed when not using genuine linkev frames');
  assert.equal(findNodes(nativeTree,v=>v.type&&v.type.name==='VideoWallpaper').length,0);
  // When the original linkev WebGL2 output has been captured, the PS5
  // mounts 12 native composited PNG frames, never a VideoWallpaper.
  const rendererSrc=jsText;
  if (rendererSrc.includes('XMB_LINK_EV_AVAILABLE = true;')) {
    const nativeReal=test.renderForTest();
    const upstreamImages=findNodes(nativeReal,v=>v.type==='Animated.Image'&&v.props&&v.props.source&&
       /xmb_linkev_frame_[0-9][0-9][.]png/.test(String(v.props.source.uri||'')));
    assert.equal(upstreamImages.length,12,'Native upstream wave uses 12 actual shader frames');
    assert.equal(findNodes(nativeReal,v=>v.type&&v.type.name==='VideoWallpaper').length,0);
  }
  req(1).Animated=initialAnimated;
  const noDriver=test.renderForTest();
  assert.equal(findNodes(noDriver,v=>v.type&&v.type.name==='VideoWallpaper').length,0,
    'No driver => static VSH palette, NOT video');
  const alignedGame=test.rowMetrics({kind:'game'},true,6);
  const alignedOther=test.rowMetrics({kind:'route'},true,1);
  assert.equal(alignedGame.center,alignedOther.center,'Category and all items follow one axis');
  // Home music is isolated from PCM sound effects: the wrapper transforms a
  // Home background-music request into null only while XMB is active.
  const bgmArgs=[];
  const bgmScene={setSystemBgm:function(v){bgmArgs.push(v);return 'ok';}};
  test.bgmHook(bgmScene);
  assert(bgmScene.setSystemBgm.__xmbMute,'BGM hook installed in SceneControl');
  bgmScene.setSystemBgm({src:'file:///user/snd0.at9'});
  assert.equal(bgmArgs[bgmArgs.length-1],null,'XMB suppresses Home BGM, not system effects');
  test.bgmRequest(true);
  assert.equal(bgmArgs[bgmArgs.length-1],null,'XMB actively requests BGM stop');
  test.state.active=false;
  bgmScene.setSystemBgm({src:'stock.mp3'});
  assert.equal(bgmArgs[bgmArgs.length-1].src,'stock.mp3','Stock BGM passes after XMB deactivation');
  test.state.active=true;

  assert.equal(before.props.onLeftKeyDown({keyEventType:'Down'}), false, 'Already-mounted Home input must switch to XMB without rebuilding Sony UI');
  assert.equal(test.state.category, 4, 'Preinstalled handler moves Game to Video');
  assert.equal(before.props.onRightKeyDown({keyEventType:'Down'}), false, 'Preinstalled handler can move back');
  assert.equal(test.state.category, 5);
  auditFonts(activeTree);
  let pngIcons = [];
  const searchImages = (v) => {
    if (!v) return;
    if (Array.isArray(v)) return v.forEach(searchImages);
    if (typeof v !== 'object') return;
    if(v.type === 'Image' && v.props && v.props.source && v.props.source.uri &&
       v.props.source.uri.includes('xmbweb_xmb_icon_')) pngIcons.push(v.props.source.uri);
    if (v.props) searchImages(v.props.children);
  };
  searchImages(activeTree);
  assert(pngIcons.length >= 9,'All category icons must be PNGs, no Unicode placeholders');
  assert.equal(activeTree.props.style.backgroundColor, '#07152e', 'opaque XMB only after commit');
  // Game shows ONLY the chosen name. Other categories show ALL item names.
  const getStrings=(v,arr=[])=>{
    if (!v) return arr;
    if (Array.isArray(v)){v.forEach(x=>getStrings(x,arr));return arr;}
    if (typeof v==='string'){arr.push(v);return arr;}
    if (typeof v==='object' && v.props) getStrings(v.props.children,arr);
    return arr;
  };
  test.state.category=5; test.state.cursor[5]=10;
  let focusedNames=getStrings(test.renderForTest());
  assert(focusedNames.includes('Beta Test'),'Selected game title is shown');
  assert(!focusedNames.includes('Alpha Test') && !focusedNames.includes('Gamma Test'),
    'Unfocused game names must be hidden');
  test.state.category=1;test.state.cursor[1]=0;
  let settingsNames=getStrings(test.renderForTest());
  assert(settingsNames.includes('System Update') && settingsNames.includes('Game Settings'),
    'Clone Settings menu items must be visible');
  test.state.category=7;test.state.cursor[7]=0;
  let psnNames=getStrings(test.renderForTest());
  assert(psnNames.includes('Sign Up') && psnNames.some(v=>v.includes('Store')),
    'PSN must display Sign Up and Store labels, including unfocused titles');
  assert(psnNames.some(v => v.includes('PlayStation') && v.includes('Network')),'PSN category label must wrap into two lines');
  test.state.category=5;test.state.cursor[5]=10;

  const item = req(2).jsx('View', { focusable: true, name: 'PPSA22567', onLeftKeyDown: () => true,
    onBackKeyDown: () => true });
  const event = { keyEventType: 'Down' };
  assert.equal(item.props.onLeftKeyDown(event), false, 'XMB should own directional keys');
  assert.equal(test.state.category, 4, 'Left moves Game to Video');
  assert(test.state.sfxToken>0,'Tab movement triggers native PCM sound request');
  assert.equal(item.props.onRightKeyDown(event), false);
  assert.equal(test.state.category, 5, 'Right returns to Game');
  const p = req(2).jsx('Tile', { experience: { id:'PPSA22567' }, onItemPress: () => () => { throw Error('Stock title should not launch'); } });
  assert.equal(typeof p.props.onItemPress, 'function');
  assert.equal(p.props.onItemPress()(event), true, 'Cross is captured by XMB');
  assert.equal(item.props.onBackKeyDown(event), false);
  assert(test.enabled(), 'First Circle dismisses the selected info panel');
  assert(!test.state.infoOpen);
  assert.equal(item.props.onTriangleKeyDown(event), false);
  assert(test.state.optionsOpen, 'Triangle opens PS3-style options');
  assert.equal(item.props.onBackKeyDown(event), false);
  assert(!test.state.optionsOpen,'Circle closes options without dismissing XMB');
  // The user supplied TWO actual PS3 scroll recordings, and a guarded
  // sound-settings toggle lets the PS5 fall back if an extra decoder fails.
  test.state.category=1; test.state.cursor[1]=test.items().length-1;
  assert.equal(test.selected().name, 'PS5 XMB Controls');
  assert.equal(test.select(),true);
  assert.equal(test.state.webStack.length,1);
  test.state.webStack[0].cursor=test.items().findIndex(x=>x.kind==='sound-toggle');
  assert.equal(test.selected().kind, 'sound-toggle');
  assert.equal(test.state.soundMode, 'ps3');
  assert.equal(test.select(), true);
  assert.equal(test.state.soundMode, 'system');
  assert.equal(test.select(), true);
  assert.equal(test.state.soundMode, 'ps3');
  assert.equal(test.rowY(-1),309);
  assert.equal(test.rowY(-2),229);
  assert.equal(test.rowY(0),425);
  assert.equal(test.rowY(1),643);
  assert.equal(test.rowY(-1)<425,true,'Previous item remains above focused item');
  assert.equal(test.rowY(0)>195+168,true,'Selected item is beneath active category');
  test.state.category=5;
  test.state.webStack=[];
  assert.equal(item.props.onBackKeyDown(event), false);
  assert(!test.enabled(), 'Circle returns XMB to stock Home after panels are closed');
  assert(item.props.onLeftKeyDown({keyEventType:'Down'})===true, 'Stock directional keys restored after dismiss');
  const target = globalThis.__theme;
  assert.equal(target.errors, 0, 'No JS errors from Home wrapper');
  process.stdout.write('PASS: PS5XMB real Home direct-root takeover, passive input prehooks, native layout, X and Circle return\\n');
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
