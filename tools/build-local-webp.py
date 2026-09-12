#!/usr/bin/env python3
from pathlib import Path
import io, json, urllib.request
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "games.json"
OUT = ROOT / "assets" / "game-covers"
OUT.mkdir(parents=True, exist_ok=True)

data = json.loads(DATA.read_text(encoding="utf-8"))
ok = 0
fail = []

for i, g in enumerate(data["games"], 1):
    source = (g.get("link") or "") + (g.get("thumb") or "")
    dest = OUT / f"{g['slug']}.webp"
    g["localThumb"] = f"assets/game-covers/{g['slug']}.webp"

    try:
        req = urllib.request.Request(source, headers={"User-Agent": "Mozilla/5.0"})
        raw = urllib.request.urlopen(req, timeout=30).read()
        with Image.open(io.BytesIO(raw)) as im:
            im = im.convert("RGB")
            im = ImageOps.fit(im, (320, 320), method=Image.Resampling.LANCZOS)
            im.save(dest, "WEBP", quality=80, method=6)
        ok += 1
        print(f"[{i}/{len(data['games'])}] OK   {g['name']} -> {dest.name}")
    except Exception as e:
        fail.append((g["name"], source, str(e)))
        print(f"[{i}/{len(data['games'])}] FAIL {g['name']}: {e}")

DATA.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

print()
print("=" * 60)
print(f"Completed: {ok} WebP files")
print(f"Failed:    {len(fail)}")
print(f"Folder:    {OUT}")
if fail:
    print("\nFAILED FILES:")
    for name, source, err in fail:
        print(f"- {name}\n  {source}\n  {err}")
    raise SystemExit(1)
