#!/usr/bin/env python3
"""Embed the XMB Designer website into ZhiThemes' existing port 4444 editor.

No extra web server, no PS5 native backend changes. The designer uses the
existing GET/POST /theme.js and POST /reload ZhiThemes endpoints.
"""
from pathlib import Path
import json
import re
import sys
ROOT=Path(__file__).resolve().parents[1]
EDITOR=ROOT/'theme/editor.html'
DESIGNER=ROOT/'xmb_patch/XMB_Designer.html'
OPEN='<div id="xmbDesignerOverlay"'
BEGIN='<!-- PS5XMB_DESIGNER_INTEGRATION_BEGIN -->'
END='<!-- PS5XMB_DESIGNER_INTEGRATION_END -->'
BTN='<button id="btnXmbDesigner" class="btn primary" title="Edit PS3 XMB positions and sizes visually">XMB Designer</button>'

def main():
    s=EDITOR.read_text(encoding='utf-8')
    html=DESIGNER.read_text(encoding='utf-8')
    assert '<script>' in html and 'XMB_DESIGNER_BEGIN' in html
    if BEGIN in s:
        assert END in s
        s=s[:s.index(BEGIN)] + s[s.index(END)+len(END):]
    if BTN not in s:
        assert '<button id="btnApply"' in s
        s=s.replace('<button id="btnApply"',BTN+'\n  <button id="btnApply"',1)
    # Use unicode escapes for < to prevent accidentally closing the parent script.
    encoded=json.dumps(html,ensure_ascii=True).replace('<','\\u003c')
    widget='''\n'''+BEGIN+'''\n<div id="xmbDesignerOverlay" role="dialog" aria-modal="true" aria-label="XMB Designer" style="display:none;position:fixed;inset:0;z-index:2147483000;background:#070e1b">
 <iframe id="xmbDesignerFrame" title="XMB Visual Designer" style="width:100%;height:100%;border:0;display:block" allow="clipboard-write"></iframe>
 <button id="xmbDesignerClose" aria-label="Close XMB Designer" title="Close designer" style="position:fixed;top:11px;right:10px;z-index:2147483001;border:1px solid #98c9ff;background:#0e2444;color:white;padding:8px 12px;border-radius:7px">✕ Close</button>
</div>
<script>
(function(){'use strict';
  var html='''+encoded+''';
  var open=document.getElementById('btnXmbDesigner');
  var overlay=document.getElementById('xmbDesignerOverlay');
  var frame=document.getElementById('xmbDesignerFrame');
  var close=document.getElementById('xmbDesignerClose');
  if (!open || !overlay || !frame || !close) return;
  open.addEventListener('click',function(){overlay.style.display='block';frame.srcdoc=html;});
  close.addEventListener('click',function(){
    if (!confirm('Close XMB Designer? Any unapplied layout changes will be lost.')) return;
    frame.removeAttribute('srcdoc');overlay.style.display='none';
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&overlay.style.display!=='none')close.click();});
})();
</script>
'''+END+'''\n'''
    assert '</body>' in s
    s=s.replace('</body>',widget+'</body>',1)
    assert s.count(BTN)==1 and s.count(BEGIN)==1
    EDITOR.write_text(s,encoding='utf-8')
    print('PASS: ZhiThemes editor includes XMB Designer with built-in GET/POST /theme.js + /reload')
if __name__=='__main__': main()
