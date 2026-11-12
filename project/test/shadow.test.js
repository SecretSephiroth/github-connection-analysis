import test from 'node:test';
import assert from 'node:assert/strict';
import { groundShadow, shadowGap } from '../src/shadow.js';
import { worldToScreen } from '../src/iso.js';
import { TILE } from '../src/config.js';

const HEIGHTS = [0, 0.5, 1, 2.5, 4];

test('ball shadow sits at the ball ground position for every height', () => {
  for (const z of HEIGHTS) {
    const ball = { x: 2, y: -3, z };
    const g = worldToScreen(2, -3, 0);
    const s = groundShadow(ball);
    assert.equal(s.x, g.x);
    assert.equal(s.y, g.y);
  }
});

test('shadow does not move when the ball rises', () => {
  const low = groundShadow({ x: 1, y: 1, z: 0.2 });
  const high = groundShadow({ x: 1, y: 1, z: 3 });
  assert.deepEqual(low, high);
});

test('gap between ball and shadow is height in pixels and grows with height', () => {
  let prev = -1;
  for (const z of HEIGHTS) {
    const gap = shadowGap({ x: 0, y: 5, z });
    assert.equal(gap, z * TILE);
    assert.ok(gap > prev);
    prev = gap;
  }
});

test('each player (z = 0) has a shadow at their feet and no gap', () => {
  for (const p of [{ x: -2, y: 9, z: 0 }, { x: 3, y: -8, z: 0 }]) {
    const s = groundShadow(p);
    const feet = worldToScreen(p.x, p.y, 0);
    assert.equal(s.x, feet.x);
    assert.equal(s.y, feet.y);
    assert.equal(shadowGap(p), 0);
  }
});

test('missing z counts as on the ground', () => {
  assert.equal(shadowGap({ x: 1, y: 1 }), 0);
});

test('shadow does not depend on other objects or order', () => {
  const a = { x: 1, y: 2, z: 1 }, b = { x: -1, y: 4, z: 0 };
  const first = [a, b].map(groundShadow);
  const second = [b, a].map(groundShadow).reverse();
  assert.deepEqual(first, second);
});
