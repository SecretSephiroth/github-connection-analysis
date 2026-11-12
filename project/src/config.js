// The pixel scale is derived from these two numbers: the small picture is
// RENDER_WIDTH x RENDER_HEIGHT and is enlarged by a whole number.
export const RENDER_WIDTH = 320;
export const RENDER_HEIGHT = 180;
export const MIN_SCALE = 1;

// Screen pixels (in the small picture) per metre along the court's x axis.
export const TILE = 8;

export const COLORS = {
  page: '#fafafa',
  surround: '#c2410c',
  court: '#2f7d6d',
  courtAlt: '#2b7364',
  line: '#ffffff',
  net: '#f97316',
  netShade: '#111827',
  post: '#111827',
};
