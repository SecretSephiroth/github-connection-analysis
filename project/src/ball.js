import { BOUNCE_LOSS, FIXED_STEP, GRAVITY, GROUND_FRICTION, REST_SPEED } from './physics-config.js';
import { classifyLanding, crossesNet } from './rules.js';

// result is one of null (still flying), 'in', 'out' or 'net'; it is set once.
export function createBall({ x = 0, y = 0, z = 0 } = {}) {
  return { x, y, z, vx: 0, vy: 0, vz: 0, step: 0, landings: [], result: null, resting: false };
}

// directionDeg is the ground heading: 0 = +x, 90 = +y (toward the viewer), 270 = toward the net from the near end.
export function hit(ball, { speed, angleDeg, directionDeg }) {
  const a = (angleDeg * Math.PI) / 180;
  const d = (directionDeg * Math.PI) / 180;
  ball.vx = speed * Math.cos(a) * Math.cos(d);
  ball.vy = speed * Math.cos(a) * Math.sin(d);
  ball.vz = speed * Math.sin(a);
  ball.resting = false;
  ball.result = null;
  ball.landings = [];
}

export function stepBall(ball, rules) {
  if (ball.resting) return;
  const { x: x0, y: y0, z: z0 } = ball;
  ball.step += 1;
  // Constant gravity, so this step is exact (no drift from the step size).
  ball.x += ball.vx * FIXED_STEP;
  ball.y += ball.vy * FIXED_STEP;
  ball.z += ball.vz * FIXED_STEP - 0.5 * GRAVITY * FIXED_STEP * FIXED_STEP;
  ball.vz -= GRAVITY * FIXED_STEP;

  if (ball.result === null && crossesNet(ball.x, y0, z0, ball.y, ball.z)) {
    ball.result = 'net';
    ball.y = y0 === 0 ? 0 : Math.sign(y0) * 1e-3; // stops at the net on its own side
    ball.vx = 0;
    ball.vy = 0;
  }

  if (ball.z <= 0) {
    // Find where the path met the ground inside this step.
    const f = z0 / (z0 - ball.z);
    const lx = x0 + (ball.x - x0) * f;
    const ly = y0 + (ball.y - y0) * f;
    ball.landings.push({ x: lx, y: ly, step: ball.step });
    if (ball.result === null) ball.result = classifyLanding(lx, ly, rules);
    ball.z = 0;
    if (-ball.vz < REST_SPEED) {
      ball.vx = 0;
      ball.vy = 0;
      ball.vz = 0;
      ball.resting = true;
    } else {
      ball.vz = -ball.vz * BOUNCE_LOSS;
      ball.vx *= GROUND_FRICTION;
      ball.vy *= GROUND_FRICTION;
    }
  }
}
