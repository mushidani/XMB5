#!/usr/bin/env python3
"""Preview server: static files + /xmb-glow (host build of zt_xmb_glow.cpp) + /xmb-art (stub: names containing 'blank' are blank, 'missing' missing)."""
import http.server, json, subprocess, os, sys, urllib.parse
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'preview')
CLI = os.environ.get('GLOW_CLI', '/tmp/glow_cli')
FONT = os.path.join(ROOT, 'assets', 'ps3-rodin-regular.ttf')
OUT = os.path.join(ROOT, 'assets', 'glowtxt')
class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k): super().__init__(*a, directory=ROOT, **k)
    def do_POST(self):
        u = urllib.parse.urlparse(self.path); q = urllib.parse.parse_qs(u.query)
        if u.path == '/xmb-glow':
            r = subprocess.run([CLI, FONT, OUT, q['text'][0], q['px'][0], q['lh'][0]], capture_output=True, text=True)
            f = r.stdout.split()
            if r.returncode or len(f) < 5: self.send_response(503); self.end_headers(); return
            body = json.dumps({'p': '/assets/glowtxt/' + os.path.basename(f[0]), 'w': int(f[1]), 'h': int(f[2]), 'tw': int(f[3]), 'pad': int(f[4])}).encode()
        elif u.path == '/xmb-art':
            p = q['path'][0]; body = (b'blank' if 'blank' in p else b'missing' if 'missing' in p else b'ok')
        else: self.send_response(404); self.end_headers(); return
        self.send_response(200); self.send_header('Content-Length', str(len(body))); self.end_headers(); self.wfile.write(body)
    def log_message(self, *a): pass
if __name__ == '__main__':
    http.server.ThreadingHTTPServer(('127.0.0.1', int(sys.argv[1]) if len(sys.argv) > 1 else 8766), H).serve_forever()
