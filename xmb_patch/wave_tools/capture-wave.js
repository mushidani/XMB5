// node capture-wave.js <outDir> [seconds=109] [fps=10] [month=-1] [hour=14]
// Deterministic REAL-TIME capture of xmb-web's wave + gradient (UI layers hidden).
// The clock is PAUSED (clock.pauseAt) so every frame advances exactly 1/fps seconds of page time; with a running clock
// the slow screenshots let the page time race ahead and the wave came out 10x+ too fast (V34).
// xmb-web plays its cloth keyframes at 0.8 kf/s over 85 keyframes = a 106.25 s cycle; the capture starts at phase 0.
const { chromium } = require(process.env.PW || 'playwright'), fs = require('fs');
(async () => {
  const [outDir, secs = '109', fps = '10', month = '-1', hour = '14'] = process.argv.slice(2);
  fs.mkdirSync(outDir, { recursive: true });
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: +(process.env.VW || 960), height: +(process.env.VH || 540) } });
  const t0d = new Date(2026, +month >= 0 ? +month : 10, 18, +hour, 0, 0);
  await p.clock.install({ time: t0d });
  await p.addInitScript(([m, h]) => { const d = new Date(2026, m >= 0 ? m : 10, 18, h, 0, 0).getTime(); window.PIN_TIME = d; if (m >= 0) window._monthOverride = m; }, [+month, +hour]);
  await p.goto('http://localhost:' + (process.env.PORT || 8765) + '/index.html?noboot');
  await p.waitForTimeout(3000); await p.clock.fastForward(1000); await p.clock.runFor(100);
  await p.addStyleTag({ content: '#xmb,#bootCanvas,canvas#xmb{display:none!important}' });
  await p.clock.pauseAt(new Date(t0d.getTime() + 60000));
  await p.evaluate(() => { waveSeqStartT = performance.now(); });          // phase 0 of the 85-keyframe cycle
  await p.clock.runFor(17);
  const n = Math.round(+secs * +fps), step = 1000 / +fps; const t0 = Date.now();
  let last = await p.evaluate(() => performance.now());
  for (let f = 0; f < n; f++) {
    await p.clock.fastForward(step - 17); await p.clock.runFor(17);              // exactly 'step' ms, one drawn frame
    await p.screenshot({ path: `${outDir}/f${String(f).padStart(4, '0')}.png` });
    if (f === 3) { const now = await p.evaluate(() => performance.now()); console.log('sim ms/frame', ((now - last) / 4).toFixed(1), 'wall s/frame', ((Date.now() - t0) / 4000).toFixed(2), 'phase kf', (await p.evaluate(() => ((performance.now() - waveSeqStartT) / 1000) * 0.8)).toFixed(3)); }
    if (f % 100 === 0) console.log('frame', f, '/', n);
  }
  await b.close(); console.log('done');
})();
