#!/usr/bin/env python3
"""Makes update/latest.json for ZhiThemes' own updates (Options menu >
ZhiThemes > Updates, the editor's update button).

The PS5 reads this file from the repo (raw.githubusercontent.com), checks its
Ed25519 signature with the public key built into ZhiThemes
(src/source/shellui/src/zt_update.cpp, kUpdateKey) and then downloads the
release's ZhiThemes.elf, checking its size and SHA-256.

Usage (needs the openssl command, 3.0 or newer):
  python3 scripts/make_update_manifest.py --elf release/ZhiThemes.elf \
      --version 0.1.1-alpha --key /path/to/update_ed25519.pem \
      --notes "One line about what changed"

Writes update/latest.json. Publish the release (tag v<version>, asset
ZhiThemes.elf) FIRST, then commit and push latest.json: consoles start
downloading as soon as the file is on GitHub.

The private key never goes into the repo.
"""
import argparse
import base64
import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile

REPO = 'itsRealZhi/ZhiThemes'
HERE = os.path.dirname(os.path.abspath(__file__))
BRAND = os.path.join(HERE, '..', 'src', 'source', 'shellui', 'include', 'zt_brand.hpp')


def signed_text(m):
    """the same text as signed_text() in zt_update.cpp"""
    return '\n'.join(['ZhiThemes-update', m['version'], str(m['build']), str(m['size']), m['sha256'],
                      m['url'], m['notes']])


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--elf', required=True)
    ap.add_argument('--version', required=True, help='public version, e.g. 0.1.1-alpha (the tag is v<version>)')
    ap.add_argument('--build', type=int, help='ZT_BUILD of that ELF (default: read from zt_brand.hpp)')
    ap.add_argument('--key', required=True, help='Ed25519 private key (PEM)')
    ap.add_argument('--notes', default='', help='one short line (at most 600 characters)')
    ap.add_argument('--out', default=os.path.join(HERE, '..', 'update', 'latest.json'))
    a = ap.parse_args()

    build = a.build
    if not build:
        m = re.search(r'#define\s+ZT_BUILD\s+(\d+)', open(BRAND, encoding='utf-8').read())
        build = int(m.group(1))
    data = open(a.elf, 'rb').read()
    if data[:4] != b'\x7fELF':
        sys.exit('not an ELF: ' + a.elf)
    if '\n' in a.notes or len(a.notes) > 600:
        sys.exit('notes: one line, at most 600 characters')
    if not re.fullmatch(r'[0-9A-Za-z.\-]{1,40}', a.version):
        sys.exit('version: letters, digits, . and - only')
    m = {
        'version': a.version,
        'build': build,
        'url': 'https://github.com/%s/releases/download/v%s/ZhiThemes.elf' % (REPO, a.version),
        'size': len(data),
        'sha256': hashlib.sha256(data).hexdigest(),
        'notes': a.notes,
    }
    with tempfile.TemporaryDirectory() as tmp:
        msg = os.path.join(tmp, 'msg')
        sig = os.path.join(tmp, 'sig')
        pub = os.path.join(tmp, 'pub.pem')
        open(msg, 'wb').write(signed_text(m).encode('utf-8'))
        subprocess.run(['openssl', 'pkeyutl', '-sign', '-inkey', a.key, '-rawin', '-in', msg, '-out', sig], check=True)
        subprocess.run(['openssl', 'pkey', '-in', a.key, '-pubout', '-out', pub], check=True)
        subprocess.run(['openssl', 'pkeyutl', '-verify', '-pubin', '-inkey', pub, '-rawin', '-in', msg,
                        '-sigfile', sig], check=True, stdout=subprocess.DEVNULL)
        m['sig'] = base64.b64encode(open(sig, 'rb').read()).decode()
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    with open(a.out, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(m, f, indent=2, ensure_ascii=False)
        f.write('\n')
    print('wrote %s: %s (build %d), %d bytes, sha256 %s' % (a.out, m['version'], build, m['size'], m['sha256']))


if __name__ == '__main__':
    main()
