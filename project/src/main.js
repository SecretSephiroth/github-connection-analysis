import { RENDER_WIDTH, RENDER_HEIGHT } from './config.js';
import { pickScale } from './scale.js';
import { drawScene } from './render.js';

const view = document.getElementById('court');
const small = document.createElement('canvas');
small.width = RENDER_WIDTH;
small.height = RENDER_HEIGHT;
const sctx = small.getContext('2d');
sctx.imageSmoothingEnabled = false;
drawScene(sctx);

function show() {
  // leave room for the page padding, border and heading
  const scale = pickScale(window.innerWidth - 24, window.innerHeight - 64);
  view.width = RENDER_WIDTH * scale;
  view.height = RENDER_HEIGHT * scale;
  view.style.width = `${view.width}px`;
  view.style.height = `${view.height}px`;
  const ctx = view.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(small, 0, 0, view.width, view.height);
  view.dataset.scale = String(scale);
}

window.addEventListener('resize', show);
show();
