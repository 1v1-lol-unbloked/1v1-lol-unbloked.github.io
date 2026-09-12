LOCAL WEBP COVER OPTIMIZATION

The site is already tuned for lazy/eager loading, async decoding, fixed image dimensions and preconnect.
To physically download all 450 remote covers and generate 320x320 WebP files, run once on a machine/server with Internet access:

  python3 -m pip install Pillow
  python3 tools/build-local-webp.py

The script writes assets/game-covers/<slug>.webp and adds localThumb to data/games.json. The JavaScript automatically prefers localThumb when present. Original game URLs remain unchanged.
