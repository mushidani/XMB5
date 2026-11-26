#!/usr/bin/env python3
"""Render *original user-provided* xmb-web #wave WebGL canvas for native PS5 frame playback.

All renderer JS/GLSL is read UNCHANGED from user-supplied xmb-web-main.zip.
This does NOT run WebGL live in PS5 HomeUI; PNG crossfades are sampled output.
No source, fonts, or shader binaries are bundled in this distribution.
"""
import argparse
import hashlib
import http.server
import io
import json
import os
from pathlib import Path, PurePosixPath
import shutil
import stat
import sys
import tempfile
import threading
from zipfile import ZipFile

HTML_SHA='cbf9ff941f432c5e6ca84f835cb40a822e554150c2070d7d593ebef63109368d'
FRAME_COUNT=16
CYCLE_MS=6970
VERSION='V32-xmb-web-WebGL-canvas-capture-v1'


def sha(b):return hashlib.sha256(b).hexdigest()


def safe_extract(archive, dest):
    dest=Path(dest)
    with ZipFile(archive) as zipf:
        src=zipf.read('xmb-web-main/index.html')
        if sha(src)!=HTML_SHA:
            raise ValueError('xmb-web index.html SHA mismatch: wrong ZIP or source revision')
        copy=[];total=0
        for info in zipf.infolist():
            parts=PurePosixPath(info.filename).parts
            if not parts or parts[0]!='xmb-web-main' or info.is_dir():continue
            if '..' in parts or stat.S_ISLNK(info.external_attr>>16):
                raise ValueError('Unsafe archive path or symlink: '+info.filename)
            rel=parts[1:]
            if not rel:continue
            leaf=rel[-1].lower()
            good_ext=leaf.endswith(('.html','.js','.bin','.json','.png','.ttf','.woff','.mp3','.jpg','.jpeg','.gif','.css','.webp','.svg'))
            useful=(len(rel)==1 and good_ext) or (rel[0] in ('icons','images','normalmaps','backgrounds','boot','fonts') and good_ext)
            if not useful:continue
            total+=info.file_size
            if info.file_size>20_000_000 or total>120_000_000:
                raise ValueError('Asset extraction size limit reached')
            copy.append((info,rel))
        # Only the selected user-supplied assets are copied to the user's workspace.
        # No fonts or copyrighted binary files are distributed in the V32 patch ZIP.
        dest.mkdir(parents=True,exist_ok=True)
        for info,parts in copy:
            f=dest.joinpath(*parts)
            f.parent.mkdir(parents=True,exist_ok=True)
            if f.is_file() and f.stat().st_size==info.file_size:continue
            with zipf.open(info) as rd, f.open('wb') as wr:shutil.copyfileobj(rd,wr)
    required=['index.html','particle_cloud.js','wave_geo.bin','wave_seq.bin','wave_seq2.bin','wave_boot.bin','wave_seq.json']
    for name in required:
        if not (dest/name).is_file():raise ValueError('Missing original web renderer asset: '+name)
    return {'source_index_sha256':HTML_SHA,'source_file_count':len(copy),'source_uncompressed_bytes':total}


def validate_frames(particles, manifest):
    try:
        m=json.loads(Path(manifest).read_text(encoding='utf-8'))
        if m.get('version')!=VERSION or m.get('index_sha256')!=HTML_SHA or m.get('count')!=FRAME_COUNT or m.get('cycle_ms')!=CYCLE_MS:return False
        if len(m.get('frames',{}))!=FRAME_COUNT:return False
        from PIL import Image
        digests=[]
        for i in range(FRAME_COUNT):
            name=f'xmbweb_wave_frame_{i:02d}.png';path=Path(particles)/name
            if not path.is_file() or sha(path.read_bytes())!=m['frames'].get(name):return False
            with Image.open(path) as im:
                if im.size!=tuple(m['size']) or im.width < 640 or im.height < 360:return False
            digests.append(m['frames'][name])
        if len(set(digests)) < FRAME_COUNT // 2:return False
        return True
    except (OSError,ValueError,KeyError,ImportError,TypeError):return False


def capture(source, width, height):
    try:
        from playwright.sync_api import sync_playwright
        from PIL import Image, ImageChops, ImageStat
    except ImportError as e:
        raise RuntimeError('Install dependencies: python3 -m pip install playwright Pillow; python3 -m playwright install chromium') from e
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def __init__(self,*a,**kw):super().__init__(*a,directory=str(source),**kw)
        def log_message(self,*args):pass
    class Server(http.server.ThreadingHTTPServer):daemon_threads=True
    with Server(('127.0.0.1',0),Quiet) as server:
        t=threading.Thread(target=server.serve_forever,daemon=True);t.start()
        url=f'http://127.0.0.1:{server.server_address[1]}/index.html?noboot'
        errors=[]
        with sync_playwright() as pw:
            bins=[os.getenv('XMB_CHROMIUM_BIN'),shutil.which('chromium'),shutil.which('chromium-browser'),None]
            settings=[['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--ignore-gpu-blocklist'],
                      ['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']]
            for browser_binary in dict.fromkeys(bins):
                for flags in settings:
                    browser=None
                    try:
                        kwargs={'headless':True,'args':flags}
                        if browser_binary:kwargs['executable_path']=browser_binary
                        browser=pw.chromium.launch(**kwargs)
                        page=browser.new_page(viewport={'width':width,'height':height},device_scale_factor=1)
                        errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
                        page.goto(url,wait_until='domcontentloaded',timeout=45000)
                        page.wait_for_function("() => typeof webglAvailable!=='undefined' && webglAvailable && typeof waveCapReady!=='undefined' && waveCapReady",timeout=70000)
                        page.wait_for_timeout(2100)
                        cv=page.locator('canvas#wave')
                        if cv.count()!=1:raise RuntimeError('Exact original #wave canvas not found')
                        captured=[];thumbs=[]
                        for i in range(FRAME_COUNT):
                            if i:page.wait_for_timeout(round(CYCLE_MS/FRAME_COUNT))
                            data=cv.screenshot(type='png',animations='allow',timeout=45000)
                            im=Image.open(io.BytesIO(data)).convert('RGBA')
                            if im.size!=(width,height):raise RuntimeError('Unexpected canvas dimensions: '+str(im.size))
                            thumbs.append(im.convert('RGB').resize((120,68)))
                            captured.append(im)
                            print(f'Captured original WebGL wave {i+1}/{FRAME_COUNT}',flush=True)
                        unique={sha(im.tobytes()) for im in thumbs}
                        contrasts=[sum(ImageStat.Stat(im).var)/3 for im in thumbs]
                        if len(unique)<FRAME_COUNT//2 or max(contrasts)<1:
                            raise RuntimeError('Wave screenshots are blank/static (not authentic motion)')
                        if errs:
                            print('NOTE: page raised runtime warnings/errors (first two):',errs[:2],file=sys.stderr)
                        return captured
                    except Exception as e:
                        errors.append((browser_binary or 'Playwright chromium',str(e)[:350]))
                    finally:
                        if browser:
                            try:browser.close()
                            except Exception:pass
        raise RuntimeError('Cannot capture exact xmb-web WebGL canvas. No fake frames will be created.\n'+
                           '\n'.join(str(a)+': '+b for a,b in errors[-5:]))


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--zip',required=True,type=Path,help='your xmb-web-main.zip')
    parser.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[1])
    parser.add_argument('--width',type=int,default=1280)
    parser.add_argument('--height',type=int,default=720)
    parser.add_argument('--force',action='store_true')
    parser.add_argument('--source-only',action='store_true',help='Check SHA and stage original source without browser capture')
    args=parser.parse_args()
    root=args.root.resolve();zip_path=args.zip.resolve()
    if not zip_path.is_file():raise ValueError('Missing uploaded xmb-web ZIP: '+str(zip_path))
    if (args.width,args.height) not in [(1280,720),(1920,1080)]:
        raise ValueError('Use native source canvas at either 1280x720 or 1920x1080')
    target=root/'theme/particles';target.mkdir(parents=True,exist_ok=True)
    manifest=root/'xmb_research/xmbweb_webgl_wave_manifest.json';manifest.parent.mkdir(parents=True,exist_ok=True)
    source=root/'xmb_research/xmbweb_capture_source'
    info=safe_extract(zip_path,source)
    print('Original xmb-web source SHA verified:',info['source_index_sha256'])
    print('Assets staged locally from user ZIP:',info['source_file_count'])
    if args.source_only:return
    if not args.force and validate_frames(target,manifest):
        print('PASS: 16 WebGL-rendered frames already present with verified hashes');return
    frames=capture(source,args.width,args.height)
    with tempfile.TemporaryDirectory(dir=str(manifest.parent),prefix='v32_capture_') as temp:
        stage=Path(temp)
        hashes={}
        for i,im in enumerate(frames):
            name=f'xmbweb_wave_frame_{i:02d}.png'
            im.save(stage/name,format='PNG',optimize=True)
            hashes[name]=sha((stage/name).read_bytes())
        m={'version':VERSION,'source':'unchanged user-provided TheGammaSqueeze/xmb-web index.html WebGL #wave canvas',
           'index_sha256':HTML_SHA,'frame_count_note':'16 sampled frames, NOT live PS5 WebGL',
           'frames':hashes,'count':FRAME_COUNT,'cycle_ms':CYCLE_MS,'size':[args.width,args.height],
           'runtime_webgl_on_ps5':False,'browser_capture_glsl_unmodified':True}
        for name in hashes:shutil.copy2(stage/name,target/name)
        manifest.write_text(json.dumps(m,indent=2)+'\n',encoding='utf-8')
    if not validate_frames(target,manifest):raise ValueError('Frames failed post-write validation')
    print('PASS: exact xmb-web WebGL wave output sampled into 16 verified PNGs; native PS5 bridge ready')

if __name__=='__main__':
    try:main()
    except Exception as e:print('ERROR:',str(e),file=sys.stderr);sys.exit(2)
