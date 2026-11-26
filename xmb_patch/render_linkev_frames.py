#!/usr/bin/env python3
"""Render unmodified linkev/PlayStation-3-XMB WebGL2 source into native PNG frames.

The PS5 only receives PNG images; original WebGL2 shaders RUN ON THE BUILD PC,
never as a fictional PS5 WebGL integration. Failed captures never overwrite a
previous good frame set. Chrome may require GPU/SwiftShader access in WSL.

Source: user-supplied ZIP; LICENSE (MIT) retained in linkev_source.
"""
import argparse, hashlib, io, json, os, re, shutil, sys, time
from pathlib import Path
from PIL import Image, ImageChops, ImageStat

R=Path(__file__).resolve().parents[1]
SOURCE=R/'xmb_research/linkev_source/ps3xmbwave'
COUNT=12
OUT=R/'theme/particles'
MANIFEST=R/'xmb_research/linkev_frames_manifest.json'
PRESET=os.environ.get('XMB_WAVE_PRESET','01_night')
SCRIPTS=['background-gradients-night.js','background-gradients-day.js','spline-settings.js',
         'particles-settings.js','settings-panels.js','spline-reverse.js','spline.js','particles.js']


def source_hash():
    hash=hashlib.sha256()
    for n in ['index.html','styles.css']+SCRIPTS:
        p=SOURCE/n
        if not p.is_file():raise ValueError('Original upstream source missing: '+str(p))
        hash.update(n.encode()); hash.update(p.read_bytes())
    return hash.hexdigest()


def valid_manifest():
    try:
        obj=json.loads(MANIFEST.read_text())
        if obj.get('upstream_sha256')!=source_hash() or obj.get('frame_count')!=COUNT or obj.get('preset')!=PRESET: return False
        for n,sha in obj['frames'].items():
            f=OUT/n
            if not f.is_file() or hashlib.sha256(f.read_bytes()).hexdigest()!=sha: return False
        return len(obj['frames'])==COUNT
    except Exception:return False


def inline_document():
    # Inlines UNMODIFIED upstream JS in declared HTML order so it runs without
    # network/file:// access. Only script-src wrappers and CSS link are replaced.
    html=(SOURCE/'index.html').read_text()
    css=(SOURCE/'styles.css').read_text()
    html, count=re.subn(r'<link\s+rel="stylesheet"\s+href="styles.css">',
                       lambda _: '<style>\n'+css+'\n</style>',html,count=1)
    assert count==1,'Upstream HTML changed its CSS reference'
    for name in SCRIPTS:
        needle='<script src="'+name+'"></script>'
        if needle not in html: raise ValueError('Upstream HTML changed its script tag: '+name)
        html=html.replace(needle,'<script>\n'+(SOURCE/name).read_text()+'\n</script>')
    return html


def capture():
    try:from playwright.sync_api import sync_playwright
    except ImportError as ex:raise RuntimeError('Install Playwright in WSL: python3 -m pip install playwright') from ex
    OUT.mkdir(parents=True,exist_ok=True)
    html=inline_document()
    problems=[]
    browser_candidates=[]
    environment=os.environ.get('XMB_CHROMIUM_BIN')
    if environment:browser_candidates.append(environment)
    browser_candidates.extend([shutil.which('chromium'),shutil.which('chromium-browser'),None])
    # Try native, then SwiftShader; one can succeed when the other fails.
    argsets=[['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--ignore-gpu-blocklist'],
             ['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--enable-unsafe-swiftshader',
              '--use-gl=angle','--use-angle=swiftshader']]
    images=None
    with sync_playwright() as pw:
      for binary in dict.fromkeys(browser_candidates):
        for flags in argsets:
          browser=None
          try:
            kw=dict(headless=True,args=flags)
            if binary:kw['executable_path']=binary
            browser=pw.chromium.launch(**kw)
            page=browser.new_page(viewport={'width':1280,'height':720},device_scale_factor=1)
            errors=[]
            page.on('pageerror',lambda error: errors.append(str(error)))
            page.set_content(html,wait_until='domcontentloaded',timeout=30000)
            # Pick a real upstream PS3 monthly gradient preset through its public
            # settings API. Shader/source code remains completely unmodified.
            page.evaluate('(value)=>{window.SPLINE_SETTINGS.gradientPreset=value}',PRESET)
            cvs=page.locator('#wave-canvas')
            page.wait_for_timeout(2000)
            gl=cvs.evaluate('c=>!!c.getContext("webgl2")')
            if not gl:raise RuntimeError('WebGL2 unavailable in this Chromium session')
            if errors:raise RuntimeError('Upstream renderer JS error: '+str(errors[:2]))
            shots=[]; thumbs=[]
            # Capture ACTUAL shader frames without panels; canvas screenshot
            # excludes the on-screen UI controls, which are separate elements.
            for index in range(COUNT):
              if index:page.wait_for_timeout(1050)
              shot=cvs.screenshot(type='png',animations='allow',timeout=30000)
              im=Image.open(io.BytesIO(shot)).convert('RGB').resize((1280,720),Image.Resampling.LANCZOS)
              thumbs.append(im.resize((120,68)).convert('RGB'))
              shots.append(im)
              print(f'linkev WebGL2 capture {index+1}/{COUNT}',flush=True)
            # A renderer that returns black/unchanged frames is not accepted.
            unique={hashlib.sha256(im.tobytes()).hexdigest() for im in thumbs}
            contrast=max(sum(ImageStat.Stat(im).var)/3 for im in thumbs)
            if len(unique)<COUNT//3 or contrast<2:
              raise RuntimeError('Blank or static WebGL frames; capture was rejected')
            images=shots
            print('PASS: captured native PNG frames from actual linkev shader',flush=True)
            break
          except Exception as error:
            problems.append(f'{binary or "Playwright Chromium"} {flags[-1]}: {str(error)[:230]}')
          finally:
            if browser:
              try:browser.close()
              except Exception:pass
        if images is not None: break
    if images is None:
        raise RuntimeError('Failed to capture linkev WebGL2:\n'+'\n'.join(problems[-5:]))
    frames={}
    # Each frame PNG is written only after all frames were rendered/validated.
    for i,image in enumerate(images):
        n=f'xmb_linkev_frame_{i:02d}.png'
        tmp=OUT/(n+'.tmp')
        image.save(tmp,format='PNG',optimize=True)
        dest=OUT/n
        os.replace(tmp,dest)
        frames[n]=hashlib.sha256(dest.read_bytes()).hexdigest()
    info={'source':'linkev/PlayStation-3-XMB (MIT)', 'pipeline':'original WebGL2 screenshot -> native React Native Animated PNG layers',
          'upstream_sha256':source_hash(),'frames':frames,'frame_count':COUNT,'preset':PRESET,
          'size':[1280,720], 'runtime_webgl2_on_ps5':False,'runtime_mp4':False}
    MANIFEST.write_text(json.dumps(info,indent=2)+'\n')
    return info

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--force',action='store_true')
    args=parser.parse_args()
    try:
      if valid_manifest() and not args.force:print('CACHE OK: 12 genuine linkev PNG frames already available')
      else:capture()
    except Exception as error:
      print('WARNING: linkev shader capture unavailable; using VSH native wave fallback.\n'+str(error),file=sys.stderr)
      sys.exit(2)
