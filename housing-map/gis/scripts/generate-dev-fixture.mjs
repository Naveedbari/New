#!/usr/bin/env node
/**
 * Generates the DEVELOPMENT sample housing scheme used for local development and tests.
 *
 * !!! THIS IS NOT REAL DATA !!!
 * Every coordinate below is synthetic. The scheme is deliberately placed in the open ocean
 * next to 0°N 0°E ("Null Island") so it can never be mistaken for DHA Bahawalpur or any
 * other real place. See 09-codex-claude-code-instructions.md §2.
 *
 * Output CRS:        EPSG:4326 (WGS 84)
 * Coordinate order:  [longitude, latitude] (RFC 7946 GeoJSON order)
 * Precision:         7 decimal places (~1 cm). Layout is designed in metres on a local
 *                    plane and converted with a flat equatorial approximation
 *                    (1° ≈ 111 320 m in both axes near the equator), which is exact
 *                    enough for synthetic data.
 *
 * Usage: node gis/scripts/generate-dev-fixture.mjs
 * Writes GeoJSON files to gis/fixtures/dev-sample-scheme/.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUTPUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'fixtures', 'dev-sample-scheme');

const DATASET = {
  version: 'dev-sample-0.1',
  name: 'Development sample scheme (synthetic)',
  crs: 'EPSG:4326',
  isDevelopmentData: true,
  disclaimer:
    'SYNTHETIC DEVELOPMENT DATA. Not a real housing scheme. Located near 0°N 0°E on purpose. ' +
    'Must never be loaded into staging or production.',
};

// Origin of the local metre grid, in degrees. South-west corner of the scheme.
const ORIGIN_LON = 0.001;
const ORIGIN_LAT = 0.001;
const METRES_PER_DEGREE = 111_320;
const DECIMALS = 7;

// Layout (metres). Two sectors side by side, each split by the Main Boulevard into
// a south block (1) and a north block (2). Each block has 3 streets with 10 plots.
const SECTOR_WIDTH = 300;
const DIVIDE_ROAD_WIDTH = 20;
const BLOCK_HEIGHT = 240;
const BOULEVARD_WIDTH = 30;
const STREET_BAND_HEIGHT = 80;
const STREET_HALF_WIDTH = 5;
const PLOT_WIDTH = 25;
const PLOT_DEPTH = 25;
const PLOTS_PER_STREET = 10;
const STREETS_PER_BLOCK = 3;
const PLOT_ROW_OFFSET_X = 20;
const SCHEME_WIDTH = SECTOR_WIDTH * 2 + DIVIDE_ROAD_WIDTH;
const SCHEME_HEIGHT = BLOCK_HEIGHT * 2 + BOULEVARD_WIDTH;

const SECTORS = [
  { code: 'A', name: 'Sector A (sample)', x0: 0 },
  { code: 'B', name: 'Sector B (sample)', x0: SECTOR_WIDTH + DIVIDE_ROAD_WIDTH },
];
const BLOCKS = [
  { index: 1, y0: 0 },
  { index: 2, y0: BLOCK_HEIGHT + BOULEVARD_WIDTH },
];
// Deterministic status/type cycles so the dataset is stable between runs.
const STATUS_CYCLE = ['Allocated', 'Allocated', 'Available', 'Reserved', 'Allocated', 'Unknown'];
const COMMERCIAL_PLOT_POSITIONS = new Set([0, 9]);

const round = (value) => Number(value.toFixed(DECIMALS));
const toLonLat = ([x, y]) => [
  round(ORIGIN_LON + x / METRES_PER_DEGREE),
  round(ORIGIN_LAT + y / METRES_PER_DEGREE),
];
const rectangle = (x0, y0, x1, y1) => ({
  type: 'Polygon',
  coordinates: [
    [
      [x0, y0],
      [x1, y0],
      [x1, y1],
      [x0, y1],
      [x0, y0],
    ].map(toLonLat),
  ],
});
const line = (...points) => ({ type: 'LineString', coordinates: points.map(toLonLat) });
const point = (x, y) => ({ type: 'Point', coordinates: toLonLat([x, y]) });
const feature = (id, geometry, properties) => ({ type: 'Feature', id, geometry, properties: { id, ...properties } });
const collection = (layer, features) => ({
  type: 'FeatureCollection',
  name: layer,
  metadata: { ...DATASET, layer, coordinateOrder: 'lon,lat' },
  features,
});

function build() {
  const sectors = [];
  const blocks = [];
  const streets = [];
  const plots = [];

  for (const sector of SECTORS) {
    const x1 = sector.x0 + SECTOR_WIDTH;
    sectors.push(
      feature(`DEV-S-${sector.code}`, rectangle(sector.x0, 0, x1, SCHEME_HEIGHT), {
        code: sector.code,
        name: sector.name,
      }),
    );

    let plotNumber = 1; // Plot numbers restart in every sector, so "A-1" and "B-1" coexist.
    for (const block of BLOCKS) {
      const blockCode = `${sector.code}${block.index}`;
      blocks.push(
        feature(
          `DEV-B-${blockCode}`,
          rectangle(sector.x0, block.y0, x1, block.y0 + BLOCK_HEIGHT),
          { code: blockCode, name: `Block ${blockCode} (sample)`, sectorCode: sector.code },
        ),
      );

      for (let s = 1; s <= STREETS_PER_BLOCK; s++) {
        const streetCode = `${blockCode}-ST${s}`;
        const bandY0 = block.y0 + (s - 1) * STREET_BAND_HEIGHT;
        const centreY = bandY0 + STREET_HALF_WIDTH;
        streets.push(
          feature(`DEV-ST-${streetCode}`, line([sector.x0 + 10, centreY], [x1 - 10, centreY]), {
            code: streetCode,
            name: `Street ${s}`,
            blockCode,
          }),
        );

        for (let p = 0; p < PLOTS_PER_STREET; p++) {
          const px0 = sector.x0 + PLOT_ROW_OFFSET_X + p * PLOT_WIDTH;
          const py0 = bandY0 + STREET_HALF_WIDTH * 2;
          const isCommercial = COMMERCIAL_PLOT_POSITIONS.has(p);
          plots.push(
            feature(
              `DEV-P-${sector.code}-${plotNumber}`,
              rectangle(px0, py0, px0 + PLOT_WIDTH, py0 + PLOT_DEPTH),
              {
                plotNumber: String(plotNumber),
                sectorCode: sector.code,
                blockCode,
                streetCode,
                roadCode: null,
                plotType: isCommercial ? 'Commercial' : 'Residential',
                status: STATUS_CYCLE[(plotNumber - 1) % STATUS_CYCLE.length],
                areaSquareMetres: PLOT_WIDTH * PLOT_DEPTH,
                dimensions: `${PLOT_WIDTH} m x ${PLOT_DEPTH} m`,
                authorityReference: null,
              },
            ),
          );
          plotNumber++;
        }
      }
    }
  }

  const boulevardY = BLOCK_HEIGHT + BOULEVARD_WIDTH / 2;
  const divideX = SECTOR_WIDTH + DIVIDE_ROAD_WIDTH / 2;
  const roads = [
    feature('DEV-R-MB', line([0, boulevardY], [SCHEME_WIDTH, boulevardY]), {
      code: 'MB',
      name: 'Main Boulevard (sample)',
      roadType: 'Boulevard',
    }),
    feature('DEV-R-DR', line([divideX, 0], [divideX, SCHEME_HEIGHT]), {
      code: 'DR',
      name: 'Sector Divide Road (sample)',
      roadType: 'Main',
    }),
    feature(
      'DEV-R-PR',
      line([0, 0], [SCHEME_WIDTH, 0], [SCHEME_WIDTH, SCHEME_HEIGHT], [0, SCHEME_HEIGHT], [0, 0]),
      { code: 'PR', name: 'Perimeter Road (sample)', roadType: 'Perimeter' },
    ),
  ];

  // Points placed in the empty strip behind the third plot row of each block.
  const poiY = (blockY0) => blockY0 + STREET_BAND_HEIGHT * 2 + 60;
  const pointsOfInterest = [
    feature('DEV-POI-PARK-A', point(150, poiY(0)), { name: 'Sample Park A', category: 'Park' }),
    feature('DEV-POI-MOSQUE-A', point(150, poiY(BLOCKS[1].y0)), { name: 'Sample Mosque', category: 'Mosque' }),
    feature('DEV-POI-SCHOOL-B', point(470, poiY(0)), { name: 'Sample School', category: 'School' }),
    feature('DEV-POI-OFFICE-B', point(470, poiY(BLOCKS[1].y0)), {
      name: 'Sample Authority Office',
      category: 'Office',
    }),
  ];

  return { sectors, blocks, streets, roads, plots, pointsOfInterest };
}

function main() {
  const layers = build();
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(join(OUTPUT_DIR, 'dataset.json'), `${JSON.stringify(DATASET, null, 2)}\n`);
  for (const [layer, features] of Object.entries(layers)) {
    writeFileSync(join(OUTPUT_DIR, `${layer}.geojson`), `${JSON.stringify(collection(layer, features), null, 2)}\n`);
  }
  const summary = Object.entries(layers).map(([layer, f]) => `${layer}=${f.length}`).join(', ');
  console.log(`Wrote ${OUTPUT_DIR}: ${summary}`);
}

main();
