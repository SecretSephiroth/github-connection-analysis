// Physics settings, metres and seconds. Court size and net height are in court.js.
export const GRAVITY = 9.81; // m/s^2, pulls z down
export const FIXED_STEP = 1 / 120; // s, the only time step the ball ever uses
export const BOUNCE_LOSS = 0.7; // share of vertical speed kept after a bounce
export const GROUND_FRICTION = 0.85; // share of ground speed kept after a bounce
export const BALL_RADIUS = 0.033; // m
export const REST_SPEED = 0.5; // m/s, a bounce slower than this ends the ball's motion
export const MAX_STEPS_PER_FRAME = 10; // stops a long frame from running away
export const LINE_HALF_WIDTH = 0.025; // m, a line is about 5 cm wide
