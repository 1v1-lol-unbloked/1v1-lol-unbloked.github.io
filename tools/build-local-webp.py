#!/usr/bin/env python3
from pathlib import Path
import io,json,urllib.request
from PIL import Image,ImageOps
ROOT=Path(__file__).resolve().parents[1]
data_path=ROOT/'data/games.json'
data=json.loads(data_path.read_text(encoding='utf-8'))
out=ROOT/'assets/game-covers'; out.mkdir(parents=True,exist_ok=True)
ok=fail=0
for i,g in enumerate(data['games'],1):
    url=(g.get('link') or '')+(g.get('thumb') or '')
    dest=out/(g['slug']+'.webp')
    try:
        req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
        raw=urllib.request.urlopen(req,timeout=30).read()
        im=Image.open(io.BytesIO(raw)).convert('RGB')
        im=ImageOps.fit(im,(320,320),method=Image.Resampling.LANCZOS)
        im.save(dest,'WEBP',quality=80,method=6)
        g['localThumb']='assets/game-covers/'+g['slug']+'.webp'
        ok+=1
        print(f'[{i}/{len(data["games"])}] OK {g["name"]}')
    except Exception as e:
        fail+=1; print(f'[{i}/{len(data["games"])}] FAIL {g["name"]}: {e}')
data_path.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
print('done',ok,'ok',fail,'failed')
