import { TILE } from './config.js';

// The one world-to-screen conversion. World: x across the court, y along it
// (net at 0), z up, all in metres. Screen: pixels of the small picture, origin
// at the net centre on the ground, y growing downward. Fixed 2:1 isometric.
export function worldToScreen(x, y, z = 0) {
  return {
    x: (x - y) * TILE,
    y: ((x + y) * TILE) / 2 - z * TILE,
  };
}

// Inverse for a point at known height z (ground by default).
export function screenToWorld(sx, sy, z = 0) {
  const a = sx / TILE; // x - y
  const b = ((sy + z * TILE) * 2) / TILE; // x + y
  return { x: (a + b) / 2, y: (b - a) / 2 };
}
