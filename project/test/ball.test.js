import test from 'node:test';
import assert from 'node:assert/strict';
import * as cfg from '../src/physics-config.js';
import { createBall, hit, stepBall } from '../src/ball.js';

const G = cfg.GRAVITY;

function run(ball, steps) {
  for (let i = 0; i < steps && !ball.resting; i++) stepBall(ball);
}

test('every physics setting is a finite number', () => {
  for (const [name, value] of Object.entries(cfg)) {
    assert.ok(Number.isFinite(value), name);
  }
  assert.equal(cfg.FIXED_STEP, 1 / 120);
});

test('a shot lands where the closed-form range says', () => {
  const speed = 20;
  const angle = 30;
  const ball = createBall({ x: 0, y: 5, z: 0 });
  hit(ball, { speed, angleDeg: angle, directionDeg: 270 }); // 270 = toward -y (the net)
  run(ball, 10000);
  const range = (speed * speed * Math.sin((2 * angle * Math.PI) / 180)) / G;
  const first = ball.landings[0];
  assert.ok(Math.abs(first.y - (5 - range)) < 0.05, `landed at ${first.y}`);
  assert.ok(Math.abs(first.x) < 1e-9);
});

test('a bounce is lower than the flight before it and each landing is recorded', () => {
  const ball = createBall({ x: 0, y: 8, z: 0 });
  hit(ball, { speed: 15, angleDeg: 40, directionDeg: 90 });
  let apex = 0;
  const apexes = [];
  let lands = 0;
  while (!ball.resting && ball.step < 20000) {
    stepBall(ball);
    apex = Math.max(apex, ball.z);
    if (ball.landings.length > lands) {
      lands = ball.landings.length;
      apexes.push(apex);
      apex = 0;
    }
  }
  assert.ok(apexes.length >= 2);
  assert.ok(apexes[1] < apexes[0]);
  assert.ok(apexes[1] > 0);
  assert.equal(ball.landings.length, lands);
  assert.ok(ball.landings[1].y > ball.landings[0].y);
});

test('the ball comes to rest below REST_SPEED', () => {
  const ball = createBall({ x: 0, y: 8, z: 0 });
  hit(ball, { speed: 10, angleDeg: 30, directionDeg: 90 });
  run(ball, 100000);
  assert.equal(ball.resting, true);
  assert.equal(ball.z, 0);
  const y = ball.y;
  stepBall(ball);
  assert.equal(ball.y, y);
});

test('the same shot always gives the same result', () => {
  const make = () => {
    const b = createBall({ x: 1, y: 9, z: 0 });
    hit(b, { speed: 22, angleDeg: 12, directionDeg: 250 });
    run(b, 5000);
    return b.landings;
  };
  assert.deepEqual(make(), make());
});
