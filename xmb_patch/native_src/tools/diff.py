import sys, numpy as np
from PIL import Image
name = sys.argv[1]
def load(f):
    im = Image.open(f).convert('RGBA'); a = np.asarray(im).astype(float)
    # composite on mid-grey so both UI layers are visible & comparable
    bg = np.full(a.shape[:2] + (3,), 0.0); al = a[..., 3:4] / 255
    return (a[..., :3] * al + bg * (1 - al)).astype(np.uint8), a[..., 3]
r, ra = load(name + '_ref.png'); m, ma = load(name + '_mine.png')
d = np.abs(r.astype(int) - m.astype(int)).sum(2)
print(f'{name}: mean abs diff {d.mean()/3:.2f}/255, pixels differing >60: {(d>60).mean()*100:.2f}%')
# bounding boxes of visible UI in each
def bbox(a):
    ys, xs = np.where(a > 40); return (xs.min(), ys.min(), xs.max(), ys.max()) if len(xs) else None
pass
side = np.concatenate([r, m, np.clip(np.stack([d]*3, 2), 0, 255).astype(np.uint8)], axis=0)
Image.fromarray(side).resize((960, 1620)).save(name + '_cmp.png')
