#!/usr/bin/env python3
"""Generate an ORIGINAL continuously changing PS3-style silk-wave video.

This is NOT Sony's shader or captured firmware data. Every frame synthesizes
new geometry and shading; it is not a still image panned over the screen.
Optional --audio: user-supplied soundtrack embedded as AAC (no audio bundled).
Outputs a seamless finite-length H.264 loop for the PS5's existing RCTVideoPS.
"""
import argparse, math, subprocess, sys, tempfile, shutil
from pathlib import Path
import numpy as np
from PIL import Image


def make_frame(w, h, frame, frames):
    u = np.linspace(0, 1, w, dtype=np.float32)[None, :]
    y = np.arange(h, dtype=np.float32)[:, None]
    z = y / np.float32(h)
    p = 2*np.pi*frame/frames
    # PS3-inspired dark blue atmospheric gradient; 2D spatially varying.
    base = (np.array([7., 18., 57.],dtype=np.float32)[None,None,:]
            + (1-z)[:,:,None]*np.array([13.,33.,69.],dtype=np.float32)[None,None,:]
            + np.exp(-((z-.50)/.40)**2)[:,:,None]*np.array([1.,5.,16.],dtype=np.float32)[None,None,:])
    base = np.broadcast_to(base, (h,w,3)).copy()
    # Each cloth sheet has a changing spline-like centerline, thickness, and
    # oscillating specular ridge. Harmonically commensurate for a clean loop.
    layers = [
      # center, major amplitude, width, phase, brightness
      (0.57, 23, 49, 0.0, 0.48),
      (0.63, 37, 63, 1.5, 0.65),
      (0.54, 19, 30, 3.4, 0.34),
    ]
    for idx,(baseline,amp,width,offset,lum) in enumerate(layers):
        centre = h*baseline + amp*np.sin(2*np.pi*(u*(1.08+.17*idx)) + p*(-1 if idx!=1 else 1) + offset) \
                 +amp*.38*np.sin(2*np.pi*(u*(2.23+.10*idx))-2*p+offset*.7)
        width_var = width*(.85 + .16*np.sin(2*np.pi*u*.73 + p + offset))
        sd = (y-centre) / width_var
        # Skin of the sheet, with inner fold and a bright shifting top edge.
        body=np.exp(-np.abs(sd)**2.6)
        fold=np.exp(-((sd + .33+.12*np.sin(2*np.pi*u*1.6+p+offset))/.25)**2)
        crease=np.exp(-((sd - .66)/.075)**2)
        ripple = .55 + .45*np.cos(sd*5.6 + 4*np.pi*u +p*(1+idx))
        light=np.clip((body*(.11+.13*ripple)+fold*.19+crease*.075)*lum*1.65,0,.5)
        base[:,:,0] += light*26
        base[:,:,1] += light*72
        base[:,:,2] += light*129
    # Fine moving electric filaments through the cloth, not a moving bitmap.
    filament_centre=h*.55 + 19*np.sin(2*np.pi*u*1.33-p)
    filament=np.exp(-((y-filament_centre)/1.8)**2)*(.35 + .18*np.sin(10*u+p))
    base[:,:,1]+=filament*26
    base[:,:,2]+=filament*57
    # Controlled tiny glints: fixed seed, dynamic coordinates + oscillation.
    for k in range(42):
        seed = (k*.6180339887)%1
        sx = int((seed + frame/frames*(.025 + (k%4)*.018))%1*w)
        sy = int(h*(.32+.39*((k*.342) %1))+9*np.sin(2*np.pi*seed+2*p))
        sparkle = .25+.75*max(0, np.sin(2*np.pi*(k*.127)+p*3))**10
        if 0<=sx<w and 1<=sy<h-1:
            base[sy-1:sy+2,max(0,sx-1):min(w,sx+2),:] += np.float32(18*sparkle)
    return np.ascontiguousarray(np.clip(base,0,255).astype(np.uint8))


def main():
    a=argparse.ArgumentParser()
    a.add_argument('--output',default='ps3_assets/ps5xmb_wave_live.mp4')
    a.add_argument('--audio',help='Optional personal, licensed background audio (MP3/WAV/M4A etc).')
    a.add_argument('--width',type=int,default=960)
    a.add_argument('--height',type=int,default=540)
    a.add_argument('--display-width',type=int,default=1920)
    a.add_argument('--display-height',type=int,default=1080)
    a.add_argument('--seconds',type=int,default=6)
    a.add_argument('--fps',type=int,default=24)
    a.add_argument('--preview',default='ps3_assets/live_wave_preview.png')
    opt=a.parse_args()
    root=Path(__file__).resolve().parents[1]
    output=root/opt.output
    output.parent.mkdir(parents=True,exist_ok=True)
    preview=root/opt.preview
    preview.parent.mkdir(parents=True,exist_ok=True)
    if opt.width%2 or opt.height%2 or not (320<=opt.width<=1920 and 180<=opt.height<=1080):
        raise SystemExit('Width and height must be even and within 320x180 to 1920x1080')
    frames=opt.seconds*opt.fps
    if not (3<=opt.seconds<=30 and 12<=opt.fps<=60):raise SystemExit('Unsupported duration/fps')
    if not shutil.which('ffmpeg'):raise SystemExit('ffmpeg is required to encode H.264 video')
    temp=output.with_name(output.stem+'.video.tmp.mp4') if opt.audio else output
    cmd=['ffmpeg','-hide_banner','-loglevel','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{opt.width}x{opt.height}',
         '-r',str(opt.fps),'-i','pipe:0','-vf',f'scale={opt.display_width}:{opt.display_height}:flags=bicubic','-an','-c:v','libx264','-preset','veryfast','-crf','22',
         '-pix_fmt','yuv420p','-movflags','+faststart','-t',str(opt.seconds),str(temp)]
    proc=subprocess.Popen(cmd,stdin=subprocess.PIPE)
    for t in range(frames):
        buf=make_frame(opt.width,opt.height,t,frames)
        if t==0:Image.fromarray(buf).save(preview)
        try:proc.stdin.write(buf.tobytes())
        except BrokenPipeError:raise SystemExit('ffmpeg failed while encoding')
        if t%max(1,opt.fps)==0:print('wave',t//opt.fps,'/',opt.seconds,'seconds',flush=True)
    proc.stdin.close()
    if proc.wait()!=0:raise SystemExit('ffmpeg encoding failed')
    if opt.audio:
        src=Path(opt.audio).resolve()
        if not src.is_file():raise SystemExit('Soundtrack not found: '+str(src))
        cmd=['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(temp),'-stream_loop','-1','-i',str(src),
             '-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','160k','-t',str(opt.seconds),'-movflags','+faststart',str(output)]
        subprocess.run(cmd,check=True)
        temp.unlink()
    print('DONE',output,output.stat().st_size,'bytes, preview',preview)
if __name__=='__main__': main()
