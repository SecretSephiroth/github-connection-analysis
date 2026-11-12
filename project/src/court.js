// Standard court, metres. x runs across the court, y along it, net at y = 0,
// z is height. Camera looks from +y (near end) toward -y (far end).
export const HALF_LENGTH = 11.885; // 23.77 / 2
export const HALF_WIDTH = 5.485; // doubles 10.97 / 2
export const HALF_SINGLES = 4.115; // singles 8.23 / 2
export const SERVICE_LINE = 6.4; // from the net
export const NET_HEIGHT_CENTRE = 0.914;
export const NET_HEIGHT_POST = 1.07;
export const NET_HALF_SPAN = 6.4; // posts stand 0.915 m outside the doubles lines

// Each line is [x1, y1, x2, y2] on the ground.
export const LINES = [
  [-HALF_WIDTH, -HALF_LENGTH, HALF_WIDTH, -HALF_LENGTH], // far baseline
  [-HALF_WIDTH, HALF_LENGTH, HALF_WIDTH, HALF_LENGTH], // near baseline
  [-HALF_WIDTH, -HALF_LENGTH, -HALF_WIDTH, HALF_LENGTH], // doubles sidelines
  [HALF_WIDTH, -HALF_LENGTH, HALF_WIDTH, HALF_LENGTH],
  [-HALF_SINGLES, -HALF_LENGTH, -HALF_SINGLES, HALF_LENGTH], // singles sidelines
  [HALF_SINGLES, -HALF_LENGTH, HALF_SINGLES, HALF_LENGTH],
  [-HALF_SINGLES, -SERVICE_LINE, HALF_SINGLES, -SERVICE_LINE], // service lines
  [-HALF_SINGLES, SERVICE_LINE, HALF_SINGLES, SERVICE_LINE],
  [0, -SERVICE_LINE, 0, SERVICE_LINE], // centre service line
];
