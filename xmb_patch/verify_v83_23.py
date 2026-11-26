from pathlib import Path
base=Path(__file__).resolve().parents[1]
checks=[base/'theme'/'theme.js', base/'theme'/'theme_factory.js', base/'xmb_patch'/'xmb_native_bundle.js']
for p in checks:
    t=p.read_text()
    assert 'run(exitGhostX[oldCi], direction * 34' not in t, f"ghost run still present in {p.name}"
    assert 'return h(View, { pointerEvents: "none", style: FILL }, [ghostLayer, content]);' not in t, f"ghost layer render still present in {p.name}"
print('PASS: V83.23 horizontal ghost afterimage removed from source and bundle.')
