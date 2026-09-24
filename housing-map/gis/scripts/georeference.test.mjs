// Tests for georeference.mjs. All coordinates here are SYNTHETIC test values near 0°N 0°E.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { fitGeoreference, footprint, parseGcpCsv, worldFile } from './georeference.mjs';

const METRES_PER_DEGREE = 6_371_008.8 * (Math.PI / 180);
const ORIGIN = { lon: 0.01, lat: 0.01 };

/** Known truth: 3.5 m per pixel, rotated 4°, image y axis pointing south. */
function truthAffine(px, py) {
  const scale = 3.5;
  const angle = 4 * (Math.PI / 180);
  const x = scale * (px * Math.cos(angle) + py * Math.sin(angle));
  const y = scale * (px * Math.sin(angle) - py * Math.cos(angle));
  return toLonLat(x, y);
}

/** Known truth with mild bending, as in a hand-drawn brochure. */
function truthBent(px, py) {
  const x = 3 * px + 0.0004 * px * px;
  const y = -3 * py + 0.0003 * px * py;
  return toLonLat(x, y);
}

function toLonLat(x, y) {
  return [ORIGIN.lon + x / (METRES_PER_DEGREE * Math.cos(ORIGIN.lat * (Math.PI / 180))), ORIGIN.lat + y / METRES_PER_DEGREE];
}

const PIXELS = [
  [271, 315],
  [755, 463],
  [1199, 516],
  [1487, 629],
  [1045, 746],
  [985, 906],
  [1228, 128],
  [644, 166],
];

function gcps(truth) {
  return PIXELS.map(([px, py], i) => {
    const [lon, lat] = truth(px, py);
    return { id: `T${i}`, px, py, lon, lat };
  });
}

function metresBetween([lonA, latA], [lonB, latB]) {
  const kx = METRES_PER_DEGREE * Math.cos(ORIGIN.lat * (Math.PI / 180));
  return Math.hypot((lonA - lonB) * kx, (latA - latB) * METRES_PER_DEGREE);
}

describe('fitGeoreference', () => {
  it('recovers an exact affine transform', () => {
    const result = fitGeoreference(gcps(truthAffine), 'affine');

    assert.ok(result.rmsM < 0.01, `rms ${result.rmsM}`);
    assert.ok(result.leaveOneOutRmsM < 0.01);
    const unseen = [400, 800];
    assert.ok(metresBetween(result.pixelToLonLat(...unseen), truthAffine(...unseen)) < 0.01);
  });

  it('returns [longitude, latitude] order', () => {
    const result = fitGeoreference(gcps(truthAffine), 'affine');
    const [lon, lat] = result.pixelToLonLat(0, 0);

    assert.ok(Math.abs(lon - ORIGIN.lon) < 1e-9 && Math.abs(lat - ORIGIN.lat) < 1e-9);
  });

  it('flags a GCP with a wrong coordinate through its leave-one-out error', () => {
    const points = gcps(truthAffine);
    points[4] = { ...points[4], lat: points[4].lat + 100 / METRES_PER_DEGREE }; // 100 m blunder

    const result = fitGeoreference(points, 'affine');
    const worst = result.residuals.reduce((a, b) => (b.leaveOneOutM > a.leaveOneOutM ? b : a));

    assert.equal(worst.id, 'T4');
    assert.ok(worst.leaveOneOutM > 80, `loo ${worst.leaveOneOutM}`);
  });

  it('poly2 absorbs bending that affine cannot', () => {
    const affine = fitGeoreference(gcps(truthBent), 'affine');
    const poly2 = fitGeoreference(gcps(truthBent), 'poly2');

    assert.ok(affine.rmsM > 20, `affine rms ${affine.rmsM}`);
    assert.ok(poly2.rmsM < 0.01, `poly2 rms ${poly2.rmsM}`);
  });

  it('rejects too few points', () => {
    assert.throws(() => fitGeoreference(gcps(truthAffine).slice(0, 5), 'poly2'), /at least 6/);
  });

  it('rejects collinear points', () => {
    const line = [0, 1, 2, 3].map((i) => {
      const [lon, lat] = truthAffine(i * 100, i * 100);
      return { id: `L${i}`, px: i * 100, py: i * 100, lon, lat };
    });
    assert.throws(() => fitGeoreference(line, 'affine'), /degenerate/);
  });
});

describe('worldFile and footprint', () => {
  it('world file maps the first pixel centre correctly', () => {
    const result = fitGeoreference(gcps(truthAffine), 'affine');
    const [a, d, b, e, c, f] = worldFile(result).trim().split('\n').map(Number);

    const [lon, lat] = [a * 10 + b * 20 + c, d * 10 + e * 20 + f]; // world file uses pixel centres
    assert.ok(metresBetween([lon, lat], truthAffine(10.5, 20.5)) < 0.01);
  });

  it('footprint is a closed ring', () => {
    const result = fitGeoreference(gcps(truthAffine), 'affine');
    const ring = footprint(result, 1536, 1075).coordinates[0];

    assert.deepEqual(ring[0], ring.at(-1));
  });
});

describe('parseGcpCsv', () => {
  it('separates collected and pending points and ignores comments', () => {
    const csv = [
      '# comment',
      'id,pixel_x,pixel_y,longitude,latitude,description',
      'A,10,20,0.011,0.012,"Roundabout, north"',
      'B,30,40,,,Not collected yet',
    ].join('\n');

    const { complete, pending } = parseGcpCsv(csv);

    assert.deepEqual(complete, [{ id: 'A', px: 10, py: 20, lon: 0.011, lat: 0.012 }]);
    assert.deepEqual(pending, [{ id: 'B', px: 30, py: 40 }]);
  });

  it('rejects a missing column', () => {
    assert.throws(() => parseGcpCsv('id,pixel_x,pixel_y,longitude\nA,1,2,3'), /latitude/);
  });

  it('rejects duplicate ids and out-of-range coordinates', () => {
    const head = 'id,pixel_x,pixel_y,longitude,latitude\n';
    assert.throws(() => parseGcpCsv(`${head}A,1,2,0,0\nA,3,4,0,0`), /Duplicate/);
    assert.throws(() => parseGcpCsv(`${head}A,1,2,200,0`), /out of range/);
  });
});
