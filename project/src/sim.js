import { FIXED_STEP, MAX_STEPS_PER_FRAME } from './physics-config.js';
import { stepBall } from './ball.js';

export function createSim(ball) {
  return { ball, accumulator: 0 };
}

// Feed the real time of one rendered frame; the ball moves in whole FIXED_STEPs only.
export function advance(sim, dtSeconds) {
  sim.accumulator += dtSeconds;
  let n = 0;
  while (sim.accumulator >= FIXED_STEP - 1e-9 && n < MAX_STEPS_PER_FRAME) {
    stepBall(sim.ball);
    sim.accumulator -= FIXED_STEP;
    n += 1;
  }
  if (n === MAX_STEPS_PER_FRAME) sim.accumulator = 0; // drop the backlog
  else if (sim.accumulator < 0) sim.accumulator = 0;
  return n;
}
