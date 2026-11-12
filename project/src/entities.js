// Demo objects, world metres (x across, y along, z up). Real ball and player
// stories can replace these as long as they keep { x, y, z }.
export function createEntities() {
  return {
    ball: { x: 1, y: 3, z: 1, shadowRx: 2, shadowRy: 1 },
    players: [
      { x: -2, y: 10, z: 0, color: 'playerA' },
      { x: 2.5, y: -9, z: 0, color: 'playerB' },
    ],
  };
}

export const BALL_MAX_HEIGHT = 5;

// Moves the demo ball up or down, kept between the ground and BALL_MAX_HEIGHT.
export function raiseBall(entities, dz) {
  const z = entities.ball.z + dz;
  entities.ball.z = Math.max(0, Math.min(BALL_MAX_HEIGHT, Math.round(z * 100) / 100));
}
