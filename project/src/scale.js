import { RENDER_WIDTH, RENDER_HEIGHT, MIN_SCALE } from './config.js';

export function pickScale(windowW, windowH) {
  const fit = Math.floor(Math.min(windowW / RENDER_WIDTH, windowH / RENDER_HEIGHT));
  return Math.max(MIN_SCALE, Number.isFinite(fit) ? fit : MIN_SCALE);
}
