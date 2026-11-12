import test from 'node:test';
import assert from 'node:assert/strict';
import { snapToPalette, lightStep, shadePixels } from '../src/shader.js';
import { BASE, LIGHT_FACTORS, paletteColors, parseHex, toHex } from '../src/palette.js';

const palette = new Set(paletteColors());

function image(w, h, hex) {
  const [r, g, b] = parseHex(hex);
  const data = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < w * h; i++) data.set([r, g, b, 255], i * 4);
  return data;
}

test('light has a small fixed number of steps', () => {
  const seen = new Set();
  for (let x = 0; x < 320; x++) for (let y = 0; y < 180; y++) seen.add(lightStep(x, y, 320, 180));
  assert.deepEqual([...seen].sort(), LIGHT_FACTORS.map((_, i) => i));
});

test('top-left is lit and bottom-right is darkest', () => {
  assert.equal(lightStep(0, 0, 320, 180), 0);
  assert.equal(lightStep(319, 179, 320, 180), LIGHT_FACTORS.length - 1);
});

test('snapToPalette maps an off-palette colour to the nearest base colour', () => {
  assert.equal(toHex(snapToPalette([250, 250, 252])), BASE.page.hex);
  assert.equal(toHex(snapToPalette([48, 126, 110])), BASE.court.hex);
});

test('every output colour is in the palette', () => {
  const w = 64, h = 36;
  const data = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < w * h; i++) data.set([(i * 37) % 256, (i * 91) % 256, (i * 53) % 256, 255], i * 4);
  shadePixels(data, w, h);
  for (let i = 0; i < w * h; i++) {
    assert.ok(palette.has(toHex([data[i * 4], data[i * 4 + 1], data[i * 4 + 2]])));
  }
});

test('same input gives same output', () => {
  const a = image(40, 20, BASE.court.hex), b = image(40, 20, BASE.court.hex);
  shadePixels(a, 40, 20);
  shadePixels(b, 40, 20);
  assert.deepEqual(a, b);
});

test('court is lit differently across the picture but lines never change', () => {
  const court = image(320, 180, BASE.court.hex);
  shadePixels(court, 320, 180);
  assert.notDeepEqual([...court.slice(0, 3)], [...court.slice(-4, -1)]);
  const lines = image(320, 180, BASE.line.hex);
  shadePixels(lines, 320, 180);
  assert.deepEqual(lines, image(320, 180, BASE.line.hex));
});
