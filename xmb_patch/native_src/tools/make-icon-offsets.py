#!/usr/bin/env python3
"""V40: optical centring of the XMB icons. For every icon the horizontal centre of what is DRAWN (alpha > 40) is measured and the
fraction of the box it is off-centre is written to spec/xmb-spec.json "iconOffsetX" (renderer: translateX = -offset * box).
The small wrench badge of the Settings icons (top-left circle) is ignored: the main glyph is what gets centred, as on the PS3."""
import json, os, sys, glob
import numpy as np
from PIL import Image
from scipy import ndimage
here = os.path.dirname(os.path.abspath(__file__))
MODE = os.environ.get('ICON_CENTRE', 'centroid')
icons = sys.argv[1] if len(sys.argv) > 1 else os.path.join(here, '..', 'preview', 'assets', 'icons')
spec_p = os.path.join(here, '..', 'spec', 'xmb-spec.json')
out = {}
for f in sorted(glob.glob(os.path.join(icons, '*.png'))):
    name = os.path.basename(f)[:-4]
    if name.endswith('_s') or name.endswith('_m'): continue
    a = np.asarray(Image.open(f).convert('RGBA'))[:, :, 3] > 40
    h, w = a.shape
    lab, n = ndimage.label(a)
    if n == 0: continue
    objs = ndimage.find_objects(lab)
    keep = np.zeros_like(a)
    for k, sl in enumerate(objs):
        y0, y1, x0, x1 = sl[0].start, sl[0].stop, sl[1].start, sl[1].stop
        bw, bh = x1 - x0, y1 - y0
        # the wrench badge: a ~85 px circle hugging the top-left corner (x0 < 6 % of the width)
        if x0 < 0.06 * w and y0 < 0.2 * h and 0.25 * w < bw < 0.4 * w and abs(bw - bh) < 0.08 * w and n > 1: continue
        keep |= lab == (k + 1)
    if not keep.any(): keep = a
    if MODE == 'centroid':
        # V41: optical centre = centre of mass of everything drawn (alpha-weighted, badge included): the eye balances the whole icon
        al = np.asarray(Image.open(f).convert('RGBA'))[:, :, 3].astype(float)
        al[al < 8] = 0
        colw = al.sum(axis=0)
        cx = float((colw * (np.arange(w) + 0.5)).sum() / colw.sum()) / w - 0.5
    else:
        xs = np.where(keep.any(axis=0))[0]
        cx = (xs[0] + xs[-1] + 1) / 2 / w - 0.5
    if abs(cx) >= 0.004: out[name] = round(float(cx), 4)
spec = json.load(open(spec_p))
spec['iconOffsetX'] = out
json.dump(spec, open(spec_p, 'w'), indent=1)
print('icon offsets:', len(out), json.dumps(dict(sorted(out.items(), key=lambda kv: -abs(kv[1]))[:12])))
