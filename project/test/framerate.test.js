import test from 'node:test';
import assert from 'node:assert/strict';
import { createBall, hit } from '../src/ball.js';
import { createSim, advance } from '../src/sim.js';

function fly(frames) {
  const ball = createBall({ x: 0, y: 10, z: 1 });
  hit(ball, { speed: 20, angleDeg: 25, directionDeg: 265 });
  const sim = createSim(ball);
  for (const dt of frames) advance(sim, dt);
  return sim;
}

const even = (fps, seconds) => Array(Math.round(fps * seconds)).fill(1 / fps);

test('30 fps and 144 fps give the same landing spot and step count', () => {
  const a = fly(even(30, 2));
  const b = fly(even(144, 2));
  assert.equal(a.ball.step, b.ball.step);
  assert.ok(a.ball.landings.length > 0);
  const la = a.ball.landings[0];
  const lb = b.ball.landings[0];
  assert.ok(Math.abs(la.x - lb.x) < 0.01);
  assert.ok(Math.abs(la.y - lb.y) < 0.01);
  assert.equal(a.ball.result, b.ball.result);
});

test('uneven frames give the same landing spot', () => {
  const pattern = [1 / 60, 1 / 30, 1 / 144, 1 / 24, 1 / 90];
  const frames = [];
  let total = 0;
  while (total < 2) {
    const dt = pattern[frames.length % pattern.length];
    frames.push(dt);
    total += dt;
  }
  const a = fly(frames);
  const b = fly(even(60, total));
  assert.ok(Math.abs(a.ball.step - b.ball.step) <= 1);
  assert.ok(Math.abs(a.ball.landings[0].y - b.ball.landings[0].y) < 0.01);
});

test('one long frame runs only a capped number of steps', () => {
  const ball = createBall({ x: 0, y: 5, z: 1 });
  const sim = createSim(ball);
  advance(sim, 5);
  assert.equal(ball.step, 10);
});
