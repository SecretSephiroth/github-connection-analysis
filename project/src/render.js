import { RENDER_WIDTH, RENDER_HEIGHT, COLORS } from './config.js';
import { worldToScreen } from './iso.js';
import {
  HALF_LENGTH, HALF_WIDTH, LINES, NET_HALF_SPAN, NET_HEIGHT_CENTRE, NET_HEIGHT_POST,
} from './court.js';

// Centre of the picture; the net centre lands here.
const OX = RENDER_WIDTH / 2;
const OY = RENDER_HEIGHT / 2 + 6;

function pt(x, y, z = 0) {
  const s = worldToScreen(x, y, z);
  return [Math.round(s.x + OX), Math.round(s.y + OY)];
}

function polygon(ctx, points, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
  ctx.fill();
}

// Aliasing is wanted: 1-pixel lines, whole-pixel coordinates, no smoothing.
function line(ctx, a, b, color) {
  ctx.fillStyle = color;
  let [x0, y0] = a;
  const [x1, y1] = b;
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    ctx.fillRect(x0, y0, 1, 1);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
}

export function drawScene(ctx) {
  ctx.fillStyle = COLORS.surround;
  ctx.fillRect(0, 0, RENDER_WIDTH, RENDER_HEIGHT);

  const m = 2.5; // run-off area around the court
  polygon(ctx, [
    pt(-HALF_WIDTH - m, -HALF_LENGTH - m), pt(HALF_WIDTH + m, -HALF_LENGTH - m),
    pt(HALF_WIDTH + m, HALF_LENGTH + m), pt(-HALF_WIDTH - m, HALF_LENGTH + m),
  ], COLORS.courtAlt);
  polygon(ctx, [
    pt(-HALF_WIDTH, -HALF_LENGTH), pt(HALF_WIDTH, -HALF_LENGTH),
    pt(HALF_WIDTH, HALF_LENGTH), pt(-HALF_WIDTH, HALF_LENGTH),
  ], COLORS.court);

  for (const [x1, y1, x2, y2] of LINES) line(ctx, pt(x1, y1), pt(x2, y2), COLORS.line);

  // Net last, in a different colour, so it stays apart from the white lines.
  const l = [-NET_HALF_SPAN, 0], r = [NET_HALF_SPAN, 0];
  polygon(ctx, [
    pt(l[0], 0, 0), pt(r[0], 0, 0), pt(r[0], 0, NET_HEIGHT_POST), pt(l[0], 0, NET_HEIGHT_POST),
  ], COLORS.netShade);
  // mesh: lighter body between the ground-clear band and the tape
  for (let x = -NET_HALF_SPAN; x <= NET_HALF_SPAN; x += 0.5) {
    line(ctx, pt(x, 0, 0), pt(x, 0, NET_HEIGHT_CENTRE), COLORS.net);
  }
  line(ctx, pt(l[0], 0, NET_HEIGHT_POST), pt(0, 0, NET_HEIGHT_CENTRE), COLORS.line);
  line(ctx, pt(0, 0, NET_HEIGHT_CENTRE), pt(r[0], 0, NET_HEIGHT_POST), COLORS.line);
  for (const p of [l, r]) line(ctx, pt(p[0], 0, 0), pt(p[0], 0, NET_HEIGHT_POST + 0.1), COLORS.post);
}
