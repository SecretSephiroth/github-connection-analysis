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

## Physics (ball flight, bounce, net, lines)
- Units: metres and seconds. x across the court, y along it, net at y = 0, z up. Court and net sizes are in `src/court.js` (net 0.914 m centre, 1.07 m posts).
- Settings, all named in `src/physics-config.js`: `GRAVITY` 9.81, `FIXED_STEP` 1/120 s, `BOUNCE_LOSS` 0.7, `GROUND_FRICTION` 0.85, `BALL_RADIUS` 0.033, `REST_SPEED` 0.5, `MAX_STEPS_PER_FRAME` 10, `LINE_HALF_WIDTH` 0.025.
- The ball (`src/ball.js`) only moves in `FIXED_STEP` steps; `src/sim.js` turns frame time into whole steps. Result is `in`, `out` or `net` (`src/rules.js`); a ball touching a line counts as in. Singles court by default.
