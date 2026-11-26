#!/usr/bin/env python3
"""V33: keep the xmb-web-exact renderer bundle (xmb_native_bundle.js) inlined in xmb_extension.js AND theme.js.

First run on a tree that still has the V32 extension inside theme.js: the old extension text (xmb_extension.js.before_V33_*.bak)
is replaced by the new extension. Later runs only refresh the text between the XMB_NATIVE_BUNDLE markers in both files.
Idempotent. No network, no Node needed.
"""
from pathlib import Path
import re, sys
root = Path(__file__).resolve().parents[1]
ext_p = root / 'xmb_patch/xmb_extension.js'
thm_p = root / 'theme/theme.js'
bundle = (root / 'xmb_patch/xmb_native_bundle.js').read_text(encoding='utf-8').strip()
B, E = '/* XMB_NATIVE_BUNDLE_BEGIN */', '/* XMB_NATIVE_BUNDLE_END */'
block = B + '\n' + bundle + '\n' + E
pat = re.compile(re.escape(B) + r'.*?' + re.escape(E), re.S)

def refresh(text, name):
    if text.count(B) != 1 or text.count(E) != 1:
        sys.exit('ERROR: bundle markers missing/duplicated in ' + name)
    return pat.sub(lambda m: block, text, count=1)

ext = refresh(ext_p.read_text(encoding='utf-8'), 'xmb_extension.js')
ext_p.write_text(ext, encoding='utf-8')
thm = thm_p.read_text(encoding='utf-8')
if B in thm:
    thm = refresh(thm, 'theme.js')
else:
    old_p = root / 'xmb_patch/xmb_extension.js.before_V33_xmbweb_exact_renderer.bak'
    if not old_p.exists():
        sys.exit('ERROR: theme.js has no V33 markers and the V32 backup is missing')
    old = old_p.read_text(encoding='utf-8').strip()
    if thm.count(old) != 1:
        sys.exit('ERROR: V32 extension text not found exactly once in theme.js (already modified?)')
    thm = thm.replace(old, ext.strip())
if thm.count(ext.strip()) != 1:
    # V35: the extension was edited after the last sync: replace the extension region of theme.js (found by its first / last 160 characters)
    e = ext.strip(); head, tail = e[:160], e[-160:]
    if thm.count(head) != 1 or thm.count(tail) != 1:
        sys.exit('ERROR: cannot locate the extension region in theme.js (head %d, tail %d)' % (thm.count(head), thm.count(tail)))
    a = thm.index(head); b = thm.index(tail) + len(tail)
    if b <= a: sys.exit('ERROR: extension region markers out of order in theme.js')
    thm = thm[:a] + e + thm[b:]
thm_p.write_text(thm, encoding='utf-8')
assert thm.count(ext.strip()) == 1, 'theme.js does not contain the extension exactly once'
print('embedded renderer bundle: %d bytes; theme.js contains the V33 extension once' % len(bundle))
