import test from 'node:test';
import assert from 'node:assert/strict';
import { HALF_LENGTH, HALF_SINGLES, HALF_WIDTH } from '../src/court.js';
import { classifyLanding, netHeightAt } from '../src/rules.js';
import { createBall, hit, stepBall } from '../src/ball.js';

const EDGE = 0.025 + 0.033; // LINE_HALF_WIDTH + BALL_RADIUS

function shoot(opts, from = { x: 0, y: 8, z: 1 }) {
  const b = createBall(from);
  hit(b, opts);
  for (let i = 0; i < 20000 && !b.resting; i++) stepBall(b);
  return b;
}

test('net height is lower in the centre than at the posts', () => {
  assert.equal(netHeightAt(0), 0.914);
  assert.equal(netHeightAt(6.4), 1.07);
  assert.equal(netHeightAt(-6.4), 1.07);
  assert.ok(netHeightAt(3) > 0.914 && netHeightAt(3) < 1.07);
});

test('baseline: inside, on the line and just outside', () => {
  assert.equal(classifyLanding(0, HALF_LENGTH - 0.5), 'in');
  assert.equal(classifyLanding(0, HALF_LENGTH), 'in');
  assert.equal(classifyLanding(0, -HALF_LENGTH), 'in');
  assert.equal(classifyLanding(0, HALF_LENGTH + EDGE - 0.001), 'in');
  assert.equal(classifyLanding(0, HALF_LENGTH + EDGE + 0.01), 'out');
  assert.equal(classifyLanding(0, -HALF_LENGTH - EDGE - 0.01), 'out');
});

test('sideline: inside, on the line and just outside (singles)', () => {
  assert.equal(classifyLanding(HALF_SINGLES - 0.5, 3), 'in');
  assert.equal(classifyLanding(HALF_SINGLES, 3), 'in');
  assert.equal(classifyLanding(-HALF_SINGLES, 3), 'in');
  assert.equal(classifyLanding(HALF_SINGLES + EDGE + 0.01, 3), 'out');
  assert.equal(classifyLanding(-HALF_SINGLES - EDGE - 0.01, 3), 'out');
});

test('doubles court uses the wider sidelines', () => {
  assert.equal(classifyLanding(HALF_SINGLES + 0.5, 3, { doubles: true }), 'in');
  assert.equal(classifyLanding(HALF_WIDTH, 3, { doubles: true }), 'in');
  assert.equal(classifyLanding(HALF_WIDTH + EDGE + 0.01, 3, { doubles: true }), 'out');
});

test('service line: a ball on it is in, a ball beyond it is a ball in the court', () => {
  assert.equal(classifyLanding(0, 6.4, { box: 'service' }), 'in');
  assert.equal(classifyLanding(0, 6.4 + EDGE - 0.001, { box: 'service' }), 'in');
  assert.equal(classifyLanding(0, 6.4 + EDGE + 0.01, { box: 'service' }), 'out');
  assert.equal(classifyLanding(0, 6.0, { box: 'service' }), 'in');
  assert.equal(classifyLanding(0, 3, { box: 'service' }), 'in');
});

test('a ball hit over the net is in on either side', () => {
  const near = shoot({ speed: 14, angleDeg: 25, directionDeg: 270 }, { x: 0, y: 11, z: 1 });
  assert.equal(near.result, 'in');
  assert.ok(near.landings[0].y < 0);
  const far = shoot({ speed: 14, angleDeg: 25, directionDeg: 90 }, { x: 0, y: -11, z: 1 });
  assert.equal(far.result, 'in');
  assert.ok(far.landings[0].y > 0);
});

test('a ball hit into the net says net and drops on its own side', () => {
  const b = shoot({ speed: 20, angleDeg: 0, directionDeg: 270 }, { x: 0, y: 6, z: 1 });
  assert.equal(b.result, 'net');
  assert.ok(b.y > -0.1 && b.y < 0.1);
  assert.equal(b.landings.length >= 1, true);
  const c = shoot({ speed: 20, angleDeg: 0, directionDeg: 90 }, { x: 0, y: -6, z: 1 });
  assert.equal(c.result, 'net');
});

test('a ball that lands out says out, and the result is set only once', () => {
  const b = shoot({ speed: 30, angleDeg: 25, directionDeg: 270 }, { x: 0, y: 11, z: 1 });
  assert.equal(b.result, 'out');
  assert.equal(b.landings.length >= 1, true);
  const first = b.result;
  for (let i = 0; i < 100; i++) stepBall(b);
  assert.equal(b.result, first);
});

test('a ball passing the net beyond the posts is not a net', () => {
  const b = shoot({ speed: 20, angleDeg: 0, directionDeg: 270 }, { x: 7, y: 6, z: 1 });
  assert.notEqual(b.result, 'net');
});
