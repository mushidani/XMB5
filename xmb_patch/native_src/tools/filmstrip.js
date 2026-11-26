// node filmstrip.js <outPrefix> <setupKeys> <actionKey> <t1,t2,...>  -- steps the preview's fake clock through one action
const { chromium } = require('playwright');
(async () => {
  const [out, setup = '', action, ts = '0,60,120,180,260'] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('http://localhost:8766/index.html?nopulse&snap=24,28,32,44&fakeglow&bg=bg.png&time=1763474400000'); await p.waitForTimeout(1500);
  await p.evaluate(() => { window.__fakeNow = 10000; window.__tick(); });
  const key = async (k, adv) => { await p.evaluate((k) => window.xmb.press(k), k); for (let t = 0; t <= adv; t += 50) { await p.evaluate((t) => { window.__fakeNow += 50; window.__tick(); }, t); } await p.waitForTimeout(150); };
  for (const k of setup.split(',').filter(Boolean)) await key(k, 400);
  await p.evaluate((k) => window.xmb.press(k), action);
  let last = 0, i = 0;
  for (const t of ts.split(',').map(Number)) {
    await p.evaluate((d) => { window.__fakeNow += d; window.__tick(); }, t - last); last = t; await p.waitForTimeout(250);
    await p.screenshot({ path: `${out}_${i++}.png` });
  }
  await b.close();
})();
