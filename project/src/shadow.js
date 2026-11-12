import { worldToScreen } from './iso.js';
import { TILE } from './config.js';

// Shadows are pure data: where on the small picture, and how big. A shadow is
// always at the object's ground position (z = 0). Height never moves it and
// neither does draw order or light direction.
export function groundShadow(obj) {
  const g = worldToScreen(obj.x, obj.y, 0);
  return { x: g.x, y: g.y, rx: obj.shadowRx ?? 3, ry: obj.shadowRy ?? 1 };
}

// Picture pixels between an object and its shadow: only height makes a gap.
export function shadowGap(obj) {
  return (obj.z ?? 0) * TILE;
}
