#!/usr/bin/env python3
"""V35: draw xmb-web's clock box and clock ring as PNGs (4x supersampled, then LANCZOS down) into native_assets/clock/.
The PS5 renderer does not draw partial / rounded View borders reliably, so the box (dark wash + open-right 1px outline + the 5-step inner
glow) and the ring (2.6 px ring, white glow, dark drop shadow) are images. Geometry and alphas are copied from xmb-web drawClock():
  box: x 1329..1919 (open to the right), y 75..132 (57 high), corner 6, wash rgba(0,0,0,.18), outline rgba(255,255,255,.35),
  inner glow insets 1..5 px alpha .26 .19 .13 .07 .04.   ring: R 16, ring width 2.6 (R*.16 -> max(2,..)), hands drawn live."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
R = Path(__file__).resolve().parents[1]
OUT = R / 'xmb_patch/native_assets/clock'; OUT.mkdir(parents=True, exist_ok=True)
SS = 4
FX, FY, FW, FH, FR = 1329, 75, 590, 57, 6
W = 1920 - FX + 4           # the frame runs off the right edge
H = FH + 1

def rr_path(inset, w):
    """open-right rounded rectangle path points (left corners rounded), centreline offset `inset`, in 1x px (frame-local)."""
    import math
    x0, y0 = inset + 0.5, inset + 0.5
    ih = FH - 2 * inset - 1
    r = max(0.0, FR - inset)
    pts = [(w, y0), (x0 + r, y0)]
    for k in range(0, 9):                                    # top-left quadratic corner
        t = k / 8; pts.append(((1 - t) ** 2 * (x0 + r) + 2 * (1 - t) * t * x0 + t * t * x0, (1 - t) ** 2 * y0 + 2 * (1 - t) * t * y0 + t * t * (y0 + r)))
    pts.append((x0, y0 + ih - r))
    for k in range(0, 9):                                    # bottom-left
        t = k / 8; pts.append(((1 - t) ** 2 * x0 + 2 * (1 - t) * t * x0 + t * t * (x0 + r), (1 - t) ** 2 * (y0 + ih - r) + 2 * (1 - t) * t * (y0 + ih) + t * t * (y0 + ih)))
    pts.append((w, y0 + ih))
    return pts

def box():
    big = Image.new('RGBA', (W * SS, H * SS), (0, 0, 0, 0))
    # 1. dark wash (filled open-right rounded rect)
    wash = Image.new('RGBA', big.size, (0, 0, 0, 0)); d = ImageDraw.Draw(wash)
    poly = [(x * SS, y * SS) for x, y in rr_path(0, W)]
    poly = [(W * SS, 0)] + poly[1:-1] + [(W * SS, FH * SS)]
    d.polygon(poly, fill=(0, 0, 0, int(round(255 * 0.18))))
    big = Image.alpha_composite(big, wash)
    mask = wash.split()[3].point(lambda v: 255 if v else 0)
    # 2. inner glow: progressively dimmer strokes inset 1..5 px, clipped to the frame interior
    for inset, a in ((1, .26), (2, .19), (3, .13), (4, .07), (5, .04)):
        lay = Image.new('RGBA', big.size, (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
        d.line([(x * SS, y * SS) for x, y in rr_path(inset, W)], fill=(255, 255, 255, int(round(255 * a))), width=SS, joint='curve')
        lay.putalpha(Image.composite(lay.split()[3], Image.new('L', big.size, 0), mask))
        big = Image.alpha_composite(big, lay)
    # 3. outline
    lay = Image.new('RGBA', big.size, (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    d.line([(x * SS, y * SS) for x, y in rr_path(0, W)], fill=(255, 255, 255, int(round(255 * 0.35))), width=SS, joint='curve')
    big = Image.alpha_composite(big, lay)
    return big.resize((W, H), Image.Resampling.LANCZOS)

def ring():
    r_icon = 16; ring_w = max(2.0, r_icon * 0.16); pad = 8; S = (2 * r_icon + 2 * pad)
    def draw(col):
        im = Image.new('RGBA', (S * SS, S * SS), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
        rr = (r_icon - ring_w / 2 - 0.6) * SS; c = S * SS / 2
        d.ellipse([c - rr - ring_w * SS / 2, c - rr - ring_w * SS / 2, c + rr + ring_w * SS / 2, c + rr + ring_w * SS / 2], outline=col, width=int(round(ring_w * SS)))
        return im
    base = draw((255, 255, 255, 245))
    sh = draw((0, 0, 0, 255)).filter(ImageFilter.GaussianBlur(3 * SS / 2)); sh.putalpha(sh.split()[3].point(lambda v: int(v * .55)))
    sh = Image.composite(sh, sh, sh.split()[3]); sh2 = Image.new('RGBA', sh.size, (0, 0, 0, 0)); sh2.paste(sh, (0, 2 * SS))
    gl = draw((255, 255, 255, 255)).filter(ImageFilter.GaussianBlur(3.5 * SS / 2)); gl.putalpha(gl.split()[3].point(lambda v: int(v * .35)))
    out = Image.alpha_composite(Image.alpha_composite(sh2, gl), base)
    return out.resize((S, S), Image.Resampling.LANCZOS)

if __name__ == '__main__':
    b = box(); b.save(OUT / 'clock_box.png', optimize=True)
    g = ring(); g.save(OUT / 'clock_ring.png', optimize=True)
    print('clock_box', b.size, 'clock_ring', g.size)
