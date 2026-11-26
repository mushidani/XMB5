Source of xmb_patch/xmb_native_bundle.js (the xmb-web-exact renderer).
  core/xmb-core.js        layout / animation math from xmb-web (pure JS)
  rn/xmb-rn.js            React Native components (View/Text/Image/Animated only)
  integration/ps5xmb-native.js   adapter used by xmb_extension.js (global ztXmbNative)
  spec/xmb-spec.json      every constant + menu tree extracted from xmb-web index.html (sha256 cbf9ff94...)
  tools/ preview/ test/   extraction, browser comparison against xmb-web, filmstrips, unit tests
Rebuilding the bundle needs Node + esbuild:
  esbuild integration/ps5xmb-native.js --bundle --format=iife --global-name=ztXmbNative --target=es2017 \
          --outfile=../xmb_native_bundle.js --loader:.json=json
then:  python3 ../embed_native_bundle.py
(You do NOT need this to build the ELF: the built bundle is already inlined in xmb_extension.js and theme.js.)
