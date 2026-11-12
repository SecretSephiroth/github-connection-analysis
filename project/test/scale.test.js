import test from 'node:test';
import assert from 'node:assert/strict';
import { pickScale } from '../src/scale.js';
import { RENDER_WIDTH, RENDER_HEIGHT } from '../src/config.js';

test('exact multiple of the render size', () => {
  assert.equal(pickScale(RENDER_WIDTH * 3, RENDER_HEIGHT * 3), 3);
});

test('in-between sizes round down to a whole number', () => {
  assert.equal(pickScale(RENDER_WIDTH * 3 + 100, RENDER_HEIGHT * 3 + 50), 3);
});

test('the tighter side decides', () => {
  assert.equal(pickScale(RENDER_WIDTH * 10, RENDER_HEIGHT * 2), 2);
});

test('windows smaller than the render size still give 1', () => {
  assert.equal(pickScale(100, 50), 1);
  assert.equal(pickScale(0, 0), 1);
});

test('always a whole number', () => {
  for (let w = 100; w < 2500; w += 37) {
    assert.ok(Number.isInteger(pickScale(w, w * 0.6)));
  }
});
