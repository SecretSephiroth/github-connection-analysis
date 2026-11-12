import {
  HALF_LENGTH,
  HALF_SINGLES,
  HALF_WIDTH,
  NET_HALF_SPAN,
  NET_HEIGHT_CENTRE,
  NET_HEIGHT_POST,
  SERVICE_LINE,
} from './court.js';
import { BALL_RADIUS, LINE_HALF_WIDTH } from './physics-config.js';

const MARGIN = LINE_HALF_WIDTH + BALL_RADIUS; // touching a line counts as in
const EPS = 1e-9;

// Net height at across-court position x, or 0 beyond the posts.
export function netHeightAt(x) {
  const t = Math.abs(x) / NET_HALF_SPAN;
  if (t > 1) return 0;
  return NET_HEIGHT_CENTRE + (NET_HEIGHT_POST - NET_HEIGHT_CENTRE) * t;
}

// True when a step from (y0, z0) to (y1, z1) passes through the net plane below the net top.
export function crossesNet(x, y0, z0, y1, z1) {
  if ((y0 > 0 && y1 > 0) || (y0 < 0 && y1 < 0)) return false;
  if (y0 === y1) return false;
  const f = (0 - y0) / (y1 - y0);
  const z = z0 + (z1 - z0) * f;
  return z < netHeightAt(x);
}

// 'in' or 'out' for a ground landing. Options: { doubles, box: 'service' }.
export function classifyLanding(x, y, { doubles = false, box } = {}) {
  const halfX = (doubles ? HALF_WIDTH : HALF_SINGLES) + MARGIN + EPS;
  const halfY = (box === 'service' ? SERVICE_LINE : HALF_LENGTH) + MARGIN + EPS;
  return Math.abs(x) <= halfX && Math.abs(y) <= halfY ? 'in' : 'out';
}
