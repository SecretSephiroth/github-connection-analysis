import { BASE } from './palette.js';

// The pixel scale is derived from these two numbers: the small picture is
// RENDER_WIDTH x RENDER_HEIGHT and is enlarged by a whole number.
export const RENDER_WIDTH = 320;
export const RENDER_HEIGHT = 180;
export const MIN_SCALE = 1;

// Screen pixels (in the small picture) per metre along the court's x axis.
export const TILE = 8;

// Colours come from the one shared palette.
export const COLORS = Object.fromEntries(
  Object.entries(BASE).map(([name, { hex }]) => [name, hex]),
);
