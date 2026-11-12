import { RENDER_WIDTH, RENDER_HEIGHT } from './config.js';
import { pickScale } from './scale.js';
import { drawScene } from './render.js';
import { SHADER_DEFAULT_ON } from './palette.js';
import { createEntities, raiseBall } from './entities.js';

const view = document.getElementById('court');
const toggle = document.getElementById('shader-toggle');
const small = document.createElement('canvas');
small.width = RENDER_WIDTH;
small.height = RENDER_HEIGHT;
const sctx = small.getContext('2d', { willReadFrequently: true });
sctx.imageSmoothingEnabled = false;

const entities = createEntities();
let shaderOn = SHADER_DEFAULT_ON;

function redraw() {
  drawScene(sctx, entities, shaderOn);
  toggle.setAttribute('aria-pressed', String(shaderOn));
  toggle.textContent = shaderOn ? 'Pixel shader: on' : 'Pixel shader: off';
  view.dataset.shader = shaderOn ? 'on' : 'off';
  view.dataset.ballHeight = String(entities.ball.z);
  show();
}

function show() {
  // leave room for the page padding, border, heading and controls
  const scale = pickScale(window.innerWidth - 24, window.innerHeight - 110);
  view.width = RENDER_WIDTH * scale;
  view.height = RENDER_HEIGHT * scale;
  view.style.width = `${view.width}px`;
  view.style.height = `${view.height}px`;
  const ctx = view.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(small, 0, 0, view.width, view.height);
  view.dataset.scale = String(scale);
}

function flip() {
  shaderOn = !shaderOn;
  redraw();
}

toggle.addEventListener('click', flip);
window.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const k = e.key.toLowerCase();
  if (k === 's') flip();
  else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    e.preventDefault();
    raiseBall(entities, e.key === 'ArrowUp' ? 0.25 : -0.25);
    redraw();
  }
});
window.addEventListener('resize', show);
redraw();
