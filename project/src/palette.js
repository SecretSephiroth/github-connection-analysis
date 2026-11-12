// The one shared palette, light direction and shading rules. Every colour in
// the game is written here and nowhere else.

// Base colours. `lit: true` means the stepped light may brighten or darken it;
// lines, net and ball keep their colour so they stay readable.
export const BASE = {
  page: { hex: '#fafafa', lit: false },
  surround: { hex: '#c2410c', lit: true },
  court: { hex: '#2f7d6d', lit: true },
  courtAlt: { hex: '#2b7364', lit: true },
  line: { hex: '#ffffff', lit: false },
  net: { hex: '#f97316', lit: false },
  netShade: { hex: '#111827', lit: false },
  post: { hex: '#111827', lit: false },
  shadow: { hex: '#14332c', lit: false },
  ball: { hex: '#fde047', lit: false },
  playerA: { hex: '#2563eb', lit: true },
  playerB: { hex: '#dc2626', lit: true },
};

// Light comes from the upper left. The picture is cut into LIGHT_FACTORS.length
// diagonal bands: top-left lit, middle unchanged, bottom-right darker.
export const LIGHT_DIRECTION = { x: -1, y: -1 };
export const LIGHT_FACTORS = [1.12, 1.0, 0.88];

// Shader switch at start-up.
export const SHADER_DEFAULT_ON = true;

export function parseHex(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function toHex([r, g, b]) {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

export function lightColor(rgb, step) {
  const f = LIGHT_FACTORS[step];
  return rgb.map((v) => Math.min(255, Math.round(v * f)));
}

// Every colour the shader may output, as hex strings.
export function paletteColors() {
  const out = new Set();
  for (const { hex, lit } of Object.values(BASE)) {
    const rgb = parseHex(hex);
    if (!lit) out.add(hex);
    else LIGHT_FACTORS.forEach((_, i) => out.add(toHex(lightColor(rgb, i))));
  }
  return [...out];
}
