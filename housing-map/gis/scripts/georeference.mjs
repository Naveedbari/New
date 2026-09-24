#!/usr/bin/env node
/**
 * Georeferences a raster map from ground control points (GCPs).
 *
 * Input:   CSV with columns id,pixel_x,pixel_y,longitude,latitude,description.
 *          pixel_x/pixel_y: image pixel coordinates, origin at the top-left corner, y down.
 *          longitude/latitude: WGS 84 (EPSG:4326) decimal degrees. Rows with an empty
 *          longitude or latitude are treated as "not yet collected" and skipped.
 * Method:  GCPs are projected to a local metric plane (equirectangular about their centroid;
 *          distortion < 0.01 % across a ~10 km scheme), then a least-squares transform
 *          pixel -> metres is fitted:
 *            affine (6 parameters, >= 3 GCPs; exact for a map that is only scaled/rotated/sheared)
 *            poly2  (12 parameters, >= 6 GCPs; absorbs mild bending in hand-drawn brochure maps)
 * Output:  Residuals in metres, including leave-one-out errors (each GCP predicted by a model
 *          fitted without it: the honest estimate of accuracy at unseen places).
 *          With --out: georeference.json (model + report), footprint.geojson (image outline in
 *          EPSG:4326, [lon, lat] order), and an ESRI world file (.jgw) for the affine model.
 *
 * Usage:   node georeference.mjs --gcp <file.csv> [--model affine|poly2] [--out <dir>]
 *                               [--width <px> --height <px>] [--max-rms <metres>]
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const EARTH_RADIUS_M = 6_371_008.8; // IUGG mean radius
const DEG = Math.PI / 180;
const MIN_POINTS = { affine: 3, poly2: 6 };
const DEFAULT_MAX_RMS_M = 25;
const FOOTPRINT_SEGMENTS_PER_EDGE = 16;
const REQUIRED_COLUMNS = ['id', 'pixel_x', 'pixel_y', 'longitude', 'latitude'];

/** Parses the GCP CSV. Returns { complete, pending } where pending rows lack lon/lat. */
export function parseGcpCsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== '' && !l.trimStart().startsWith('#'));
  const header = splitCsvLine(lines[0] ?? '').map((h) => h.trim());
  for (const column of REQUIRED_COLUMNS) {
    if (!header.includes(column)) throw new Error(`GCP CSV is missing column "${column}".`);
  }
  const complete = [];
  const pending = [];
  for (const line of lines.slice(1)) {
    const cells = splitCsvLine(line);
    const row = Object.fromEntries(header.map((h, i) => [h, (cells[i] ?? '').trim()]));
    const gcp = { id: row.id, px: toNumber(row.pixel_x, row.id, 'pixel_x'), py: toNumber(row.pixel_y, row.id, 'pixel_y') };
    if (row.longitude === '' || row.latitude === '') {
      pending.push(gcp);
      continue;
    }
    const lon = toNumber(row.longitude, row.id, 'longitude');
    const lat = toNumber(row.latitude, row.id, 'latitude');
    if (Math.abs(lon) > 180 || Math.abs(lat) > 90) throw new Error(`GCP ${row.id}: longitude/latitude out of range.`);
    complete.push({ ...gcp, lon, lat });
  }
  const ids = new Set();
  for (const { id } of [...complete, ...pending]) {
    if (ids.has(id)) throw new Error(`Duplicate GCP id "${id}".`);
    ids.add(id);
  }
  return { complete, pending };
}

/** Fits a pixel -> lon/lat model and reports residuals. */
export function fitGeoreference(gcps, model = 'affine') {
  if (!(model in MIN_POINTS)) throw new Error(`Unknown model "${model}". Use affine or poly2.`);
  if (gcps.length < MIN_POINTS[model]) {
    throw new Error(`${model} needs at least ${MIN_POINTS[model]} GCPs with coordinates; got ${gcps.length}.`);
  }
  const origin = {
    lon: gcps.reduce((s, g) => s + g.lon, 0) / gcps.length,
    lat: gcps.reduce((s, g) => s + g.lat, 0) / gcps.length,
  };
  const plane = createPlane(origin);
  const points = gcps.map((g) => ({ ...g, ...plane.toMetres(g.lon, g.lat) }));
  const coefficients = solveModel(points, model);
  const predict = (px, py) => evaluate(coefficients, model, px, py);

  const residuals = points.map((p) => {
    const fitted = predict(p.px, p.py);
    const others = points.filter((o) => o !== p);
    const looError =
      others.length >= MIN_POINTS[model] + 1
        ? distance(evaluate(solveModel(others, model), model, p.px, p.py), p)
        : null;
    return { id: p.id, residualM: round(distance(fitted, p), 2), leaveOneOutM: looError === null ? null : round(looError, 2) };
  });
  const rmsM = Math.sqrt(residuals.reduce((s, r) => s + r.residualM ** 2, 0) / residuals.length);
  const looValues = residuals.map((r) => r.leaveOneOutM).filter((v) => v !== null);

  return {
    model,
    crs: 'EPSG:4326',
    coordinateOrder: 'lon,lat',
    localPlane: { type: 'equirectangular', originLon: origin.lon, originLat: origin.lat, earthRadiusM: EARTH_RADIUS_M },
    coefficients,
    gcpCount: gcps.length,
    rmsM: round(rmsM, 2),
    maxResidualM: round(Math.max(...residuals.map((r) => r.residualM)), 2),
    leaveOneOutRmsM: looValues.length ? round(Math.sqrt(looValues.reduce((s, v) => s + v * v, 0) / looValues.length), 2) : null,
    residuals,
    pixelToLonLat: (px, py) => {
      const m = predict(px, py);
      return plane.toLonLat(m.x, m.y);
    },
  };
}

/** ESRI world file lines (pixel-centre convention). Only valid for the affine model. */
export function worldFile(result) {
  if (result.model !== 'affine') throw new Error('World files can only express the affine model.');
  const f = result.pixelToLonLat;
  const [lon0, lat0] = f(0.5, 0.5);
  const [lonX, latX] = f(1.5, 0.5);
  const [lonY, latY] = f(0.5, 1.5);
  return [lonX - lon0, latX - lat0, lonY - lon0, latY - lat0, lon0, lat0].map((v) => v.toFixed(12)).join('\n') + '\n';
}

/** Image outline as a GeoJSON Polygon in EPSG:4326 (edges densified so poly2 bending is visible). */
export function footprint(result, width, height) {
  const corners = [
    [0, 0],
    [width, 0],
    [width, height],
    [0, height],
  ];
  const ring = [];
  for (let i = 0; i < corners.length; i++) {
    const [ax, ay] = corners[i];
    const [bx, by] = corners[(i + 1) % corners.length];
    for (let s = 0; s < FOOTPRINT_SEGMENTS_PER_EDGE; s++) {
      const t = s / FOOTPRINT_SEGMENTS_PER_EDGE;
      ring.push(result.pixelToLonLat(ax + (bx - ax) * t, ay + (by - ay) * t).map((v) => round(v, 7)));
    }
  }
  ring.push(ring[0]);
  return { type: 'Polygon', coordinates: [ring] };
}

function createPlane(origin) {
  const kx = EARTH_RADIUS_M * DEG * Math.cos(origin.lat * DEG);
  const ky = EARTH_RADIUS_M * DEG;
  return {
    toMetres: (lon, lat) => ({ x: (lon - origin.lon) * kx, y: (lat - origin.lat) * ky }),
    toLonLat: (x, y) => [origin.lon + x / kx, origin.lat + y / ky],
  };
}

function terms(model, px, py) {
  return model === 'affine' ? [1, px, py] : [1, px, py, px * px, px * py, py * py];
}

function solveModel(points, model) {
  // Scale pixels to ~[0, 1] so the normal equations stay well conditioned for poly2.
  const scale = Math.max(...points.flatMap((p) => [Math.abs(p.px), Math.abs(p.py)]), 1);
  const rows = points.map((p) => terms(model, p.px / scale, p.py / scale));
  return { scale, x: leastSquares(rows, points.map((p) => p.x)), y: leastSquares(rows, points.map((p) => p.y)) };
}

function evaluate(coefficients, model, px, py) {
  const t = terms(model, px / coefficients.scale, py / coefficients.scale);
  const dot = (c) => c.reduce((s, v, i) => s + v * t[i], 0);
  return { x: dot(coefficients.x), y: dot(coefficients.y) };
}

/** Solves min ||A c - b|| via normal equations and Gaussian elimination with partial pivoting. */
function leastSquares(a, b) {
  const n = a[0].length;
  const m = Array.from({ length: n }, (_, i) => [
    ...Array.from({ length: n }, (_, j) => a.reduce((s, row) => s + row[i] * row[j], 0)),
    a.reduce((s, row, k) => s + row[i] * b[k], 0),
  ]);
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) if (Math.abs(m[r][col]) > Math.abs(m[pivot][col])) pivot = r;
    if (Math.abs(m[pivot][col]) < 1e-12) {
      throw new Error('GCPs are degenerate (collinear or too close together). Spread them across the map.');
    }
    [m[col], m[pivot]] = [m[pivot], m[col]];
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = m[r][col] / m[col][col];
      for (let c = col; c <= n; c++) m[r][c] -= f * m[col][c];
    }
  }
  return m.map((row, i) => row[n] / row[i]);
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function round(value, digits) {
  return Number(value.toFixed(digits));
}

function toNumber(text, id, column) {
  const value = Number(text);
  if (text === '' || !Number.isFinite(value)) throw new Error(`GCP ${id}: ${column} "${text}" is not a number.`);
  return value;
}

function splitCsvLine(line) {
  const cells = [];
  let current = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else current += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') {
      cells.push(current);
      current = '';
    } else current += ch;
  }
  cells.push(current);
  return cells;
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 2) {
    if (!argv[i].startsWith('--')) throw new Error(`Unexpected argument "${argv[i]}".`);
    args[argv[i].slice(2)] = argv[i + 1];
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.gcp) throw new Error('Usage: node georeference.mjs --gcp <file.csv> [--model affine|poly2] [--out <dir>] [--width <px> --height <px>] [--max-rms <m>]');
  const model = args.model ?? 'affine';
  const maxRms = Number(args['max-rms'] ?? DEFAULT_MAX_RMS_M);
  const { complete, pending } = parseGcpCsv(readFileSync(args.gcp, 'utf8'));
  if (pending.length) console.log(`Skipping ${pending.length} GCP(s) without coordinates: ${pending.map((g) => g.id).join(', ')}`);

  const result = fitGeoreference(complete, model);
  console.log(`\nModel ${model}, ${result.gcpCount} GCPs`);
  console.table(result.residuals);
  console.log(`RMS ${result.rmsM} m | max ${result.maxResidualM} m | leave-one-out RMS ${result.leaveOneOutRmsM ?? 'n/a (add more GCPs)'} m`);

  if (args.out) {
    mkdirSync(args.out, { recursive: true });
    const { pixelToLonLat, ...report } = result;
    void pixelToLonLat;
    writeFileSync(join(args.out, 'georeference.json'), `${JSON.stringify(report, null, 2)}\n`);
    if (model === 'affine') writeFileSync(join(args.out, 'source.jgw'), worldFile(result));
    if (args.width && args.height) {
      const fc = { type: 'FeatureCollection', features: [{ type: 'Feature', properties: { name: 'source image footprint' }, geometry: footprint(result, Number(args.width), Number(args.height)) }] };
      writeFileSync(join(args.out, 'footprint.geojson'), `${JSON.stringify(fc, null, 2)}\n`);
    }
    console.log(`Wrote ${args.out}`);
  }

  const worst = Math.max(result.rmsM, result.leaveOneOutRmsM ?? 0);
  if (worst > maxRms) {
    console.error(`\nFAIL: error ${worst} m exceeds --max-rms ${maxRms} m. Check the GCPs with the largest residuals.`);
    process.exitCode = 1;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}
