import { BASE, LIGHT_FACTORS, parseHex, lightColor } from './palette.js';

const BASES = Object.values(BASE).map(({ hex, lit }) => ({ rgb: parseHex(hex), lit }));

// Nearest base colour (as rgb) for any input colour; also reports if it is lit.
function nearest(rgb) {
  let best = BASES[0], bestD = Infinity;
  for (const b of BASES) {
    const d = (b.rgb[0] - rgb[0]) ** 2 + (b.rgb[1] - rgb[1]) ** 2 + (b.rgb[2] - rgb[2]) ** 2;
    if (d < bestD) { best = b; bestD = d; }
  }
  return best;
}

export function snapToPalette(rgb) {
  return nearest(rgb).rgb;
}

// Diagonal light band for a pixel: 0 = most lit (top-left), last = darkest.
export function lightStep(x, y, w, h) {
  const t = (x / w + y / h) / 2; // 0 at top-left, just under 1 at bottom-right
  return Math.min(LIGHT_FACTORS.length - 1, Math.floor(t * LIGHT_FACTORS.length));
}

// Works in place on RGBA bytes: snap to the palette, then apply stepped light.
export function shadePixels(data, w, h) {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const b = nearest([data[i], data[i + 1], data[i + 2]]);
      const rgb = b.lit ? lightColor(b.rgb, lightStep(x, y, w, h)) : b.rgb;
      data[i] = rgb[0]; data[i + 1] = rgb[1]; data[i + 2] = rgb[2];
    }
  }
}

export function applyPixelShader(ctx, w, h) {
  const img = ctx.getImageData(0, 0, w, h);
  shadePixels(img.data, w, h);
  ctx.putImageData(img, 0, 0);
}
