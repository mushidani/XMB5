// node compare.js <name> <keys,comma,separated> [settleMs=900]
// Screenshots xmb-web (ground truth) and the RN preview with identical key presses, UI layers only (transparent bg), and diffs them.
const { chromium } = require('playwright'), fs = require('fs'), path = require('path');
const [name, keys = '', settle = '900'] = process.argv.slice(2);
const out = path.join(process.env.OUT || '/tmp', name);
const T = new Date(2026, 10, 18, 14, 0, 0).getTime();
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  async function shot(url, hide, file, pin) {
    const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 } }); const p = await ctx.newPage();
    if (pin) await p.addInitScript((t) => { window.PIN_TIME = t; }, T);
    await p.goto(url); await p.waitForTimeout(3500);
    if (hide) await p.addStyleTag({ content: hide });
    for (const k of keys.split(',').filter(Boolean)) { await p.keyboard.press(k); await p.waitForTimeout(+settle); }
    await p.waitForTimeout(+(process.env.FINAL || 300));
    await p.screenshot({ path: file, omitBackground: true }); await ctx.close();
  }
  await shot('http://localhost:8765/index.html?noboot', '#bg,#wave{visibility:hidden!important}body,html,#scr{background:transparent!important}', out + '_ref.png', true);
  await shot('http://localhost:8766/index.html?nopulse&time=' + T, 'body,html,#root{background:transparent!important}', out + '_mine.png', false);
  await b.close();
})();
