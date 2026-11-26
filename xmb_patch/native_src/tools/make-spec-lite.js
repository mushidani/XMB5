// node tools/make-spec-lite.js -> spec/xmb-spec-lite.json: everything the renderer needs except the menu trees
// (the PS5 build keeps its own copy of the xmb-web menu data inside xmb_extension.js).
const fs = require('fs'), path = require('path');
const s = JSON.parse(fs.readFileSync(path.join(__dirname, '../spec/xmb-spec.json'), 'utf8'));
const lite = { layout: s.layout, iconScale: s.iconScale, timings: s.timings, hoverBg: s.hoverBg, defaultItemIndex: s.defaultItemIndex, iconOffsetX: s.iconOffsetX || {} };
fs.writeFileSync(path.join(__dirname, '../spec/xmb-spec-lite.json'), JSON.stringify(lite));
console.log('spec-lite', JSON.stringify(lite).length, 'bytes');
