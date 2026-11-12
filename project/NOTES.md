# Project notes

- Engine: plain browser JavaScript with an HTML canvas (2D), ES modules, no libraries and no build step.
- Test command: `node --test` (Node's built-in runner, run from this folder).
- Run: `./run.sh` (uses `PORT`, default 8000, and `HOST`, default 127.0.0.1).
- Camera: fixed 2:1 isometric, never rotates. The one conversion is `worldToScreen` in `src/iso.js`.
- Pixel scale: the scene is drawn at `RENDER_WIDTH` x `RENDER_HEIGHT` (set only in `src/config.js`) and enlarged by a whole number with smoothing off.
- Note: the `courtside_brd` document was not in the repo, so these choices are assumptions.
