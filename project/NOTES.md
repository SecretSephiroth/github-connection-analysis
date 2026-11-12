# Project notes

- Engine: plain browser JavaScript with an HTML canvas (2D), ES modules, no libraries and no build step.
- Test command: `node --test` (Node's built-in runner, run from this folder).
- Run: `./run.sh` (uses `PORT`, default 8000, and `HOST`, default 127.0.0.1).
- Camera: fixed 2:1 isometric, never rotates. The one conversion is `worldToScreen` in `src/iso.js`.
- Pixel scale: the scene is drawn at `RENDER_WIDTH` x `RENDER_HEIGHT` (set only in `src/config.js`) and enlarged by a whole number with smoothing off.
- Note: the `courtside_brd` document was not in the repo, so these choices are assumptions.

## Art direction (shader, light, shadows)
- All colours, the light direction and the shadow colour live in `src/palette.js` only; `config.js`, `render.js` and `shader.js` read from it.
- Palette: page #fafafa, surround #c2410c, court #2f7d6d, courtAlt #2b7364, line #ffffff, net #f97316, netShade/post #111827, shadow #14332c, ball #fde047, playerA #2563eb, playerB #dc2626.
- Light: from the upper left (`LIGHT_DIRECTION`). Three diagonal bands, factors 1.12 / 1.0 / 0.88 (`LIGHT_FACTORS`). Only court, surround and players are lit; lines, net and ball never change.
- Shader: `src/shader.js` snaps each pixel to the palette, then applies the light band. It runs on the 320x180 picture, so the look is the same at any window size. Switch: button or `S` key (`SHADER_DEFAULT_ON`).
- Shadows: `src/shadow.js`. A shadow is always at the object's ground position (z = 0); only height makes the gap (z x TILE pixels). Demo ball/players are in `src/entities.js`; up/down arrows move the ball.
