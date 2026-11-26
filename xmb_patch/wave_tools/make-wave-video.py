# python3 -I make-wave-video.py <framesDir> <out.mp4> [capFps=15] [outFps=30] [cycleSec=106.25] [xfadeSec=2]
# V35: encodes the REAL-TIME capture of capture-wave.js (frames f0000.. at capFps, clock paused so frame n is exactly n/capFps seconds of
# page time) as one exact xmb-web wave cycle: 85 cloth keyframes at 0.8 keyframes/s = 106.25 s, which is how long xmb-web takes to come
# back to phase 0, so the video plays at xmb-web's own speed. The page's other time-driven layers (silk shader, sparkles) do not recur
# with that period, so the first `xfadeSec` seconds are cross-faded with the frames that continue past the loop end (seamless repeat).
# H.264 yuv420p 1920x1080 (the PS5 video view is fed full HD), low CRF only to avoid banding in the smooth gradients.
import sys, glob, os, subprocess, numpy as np
from PIL import Image
d, out = sys.argv[1], sys.argv[2]
capfps = float(sys.argv[3]) if len(sys.argv) > 3 else 15
outfps = int(sys.argv[4]) if len(sys.argv) > 4 else 30
cycle = float(sys.argv[5]) if len(sys.argv) > 5 else 106.25
xf = float(sys.argv[6]) if len(sys.argv) > 6 else 2.0
files = sorted(glob.glob(d + '/f*.png')); N = len(files)
L = int(round(cycle * capfps)); K = int(round(xf * capfps))
assert N >= L + K, 'need %d frames (cycle + crossfade), have %d' % (L + K, N)
tmp = d + '/_loop'; os.makedirs(tmp, exist_ok=True)
for f in glob.glob(tmp + '/*.png'): os.remove(f)
for j in range(L):
    a = np.asarray(Image.open(files[j]).convert('RGB')).astype(np.float32)
    if j < K:                                      # head blends from the continuation past the loop end into the true start
        b = np.asarray(Image.open(files[L + j]).convert('RGB')).astype(np.float32); w = (j + 1) / (K + 1)
        a = b * (1 - w) + a * w
    Image.fromarray(a.clip(0, 255).astype(np.uint8)).save(f'{tmp}/l{j:04d}.png')
print(f'frames={N} loop={L} frames = {L / capfps:.2f}s @ {capfps:g} fps (xfade {K} frames) -> {outfps} fps')
# the blended 15 -> 30 fps conversion is smooth for this slow motion; crf 21 + aq-mode 3 keeps the flat gradients free of blocking
subprocess.check_call(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', f'{capfps:g}', '-i', tmp + '/l%04d.png',
                       '-vf', f'framerate=fps={outfps}:interp_start=0:interp_end=255:scene=100,scale=1920:1080:flags=lanczos',
                       '-c:v', 'libx264', '-preset', 'slow', '-crf', '21', '-x264-params', 'aq-mode=3:deblock=-1,-1', '-pix_fmt', 'yuv420p',
                       '-profile:v', 'high', '-level', '4.1', '-g', str(outfps * 2), '-movflags', '+faststart', '-an', out])
print('wrote', out, round(os.path.getsize(out) / 1e6, 1), 'MB')
