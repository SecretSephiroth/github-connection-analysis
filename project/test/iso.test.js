import test from 'node:test';
import assert from 'node:assert/strict';
import { worldToScreen, screenToWorld } from '../src/iso.js';
import { TILE } from '../src/config.js';
import { HALF_LENGTH, HALF_WIDTH, NET_HEIGHT_CENTRE } from '../src/court.js';

const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} != ${b}`);

test('origin maps to the screen origin', () => {
  const p = worldToScreen(0, 0, 0);
  near(p.x, 0);
  near(p.y, 0);
});

test('net centre: x=0,y=0 sits at the origin and the net top is straight above', () => {
  const base = worldToScreen(0, 0, 0);
  const top = worldToScreen(0, 0, NET_HEIGHT_CENTRE);
  near(top.x, base.x);
  near(top.y, base.y - NET_HEIGHT_CENTRE * TILE);
});

test('court corners use a 2:1 diamond and mirror each other', () => {
  const far = worldToScreen(HALF_WIDTH, -HALF_LENGTH, 0);
  const near_ = worldToScreen(-HALF_WIDTH, HALF_LENGTH, 0);
  near(far.x, -near_.x);
  near(far.y, -near_.y);
  // 2:1 ratio: moving along x by 1 shifts 2*k across and k down
  const a = worldToScreen(0, 0, 0);
  const b = worldToScreen(1, 0, 0);
  near((b.x - a.x) / (b.y - a.y), 2);
});

test('height raises a point straight up the screen', () => {
  const a = worldToScreen(3, 4, 0);
  const b = worldToScreen(3, 4, 2);
  near(b.x, a.x);
  assert.ok(b.y < a.y);
});

test('moving toward the viewer (larger y) moves down the screen', () => {
  assert.ok(worldToScreen(0, 5, 0).y > worldToScreen(0, -5, 0).y);
});

test('round trip returns the original court position', () => {
  const pts = [[0, 0], [HALF_WIDTH, HALF_LENGTH], [-HALF_WIDTH, HALF_LENGTH],
    [HALF_WIDTH, -HALF_LENGTH], [-2.5, 6.4], [3.3, -1.7]];
  for (const [x, y] of pts) {
    for (const z of [0, 1.2]) {
      const s = worldToScreen(x, y, z);
      const w = screenToWorld(s.x, s.y, z);
      near(w.x, x);
      near(w.y, y);
    }
  }
});
