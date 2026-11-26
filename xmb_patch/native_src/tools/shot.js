// node shot.js <url> <out.png> [waitMs] -- screenshot xmb-web in headless chromium (software GL)
const { chromium } = require('playwright');
(async () => {
  const [url, out, wait = '6000', keys = ''] = process.argv.slice(2);
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('console', m => { if (m.type() === 'error') console.log('console.error:', m.text().slice(0, 200)); });
  await p.goto(url); await p.waitForTimeout(+wait);
  for (const k of keys.split(',').filter(Boolean)) { await p.keyboard.press(k); await p.waitForTimeout(700); }
  await p.screenshot({ path: out });
  const gl = await p.evaluate(() => { const c = document.createElement('canvas'); const g = c.getContext('webgl2') || c.getContext('webgl'); return g ? g.getParameter(g.VERSION) : 'no webgl'; });
  console.log('GL:', gl); await b.close();
})();
