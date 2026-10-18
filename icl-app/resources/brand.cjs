// ICL brand marks as SVG strings (512×512 design space). Used by the asset generator.
const TROPHY = 'M464 80h-60.1a4 4 0 0 1-4-4V63.92a32 32 0 0 0-32-31.92l-223.79.26a32 32 0 0 0-31.94 31.930V76a4 4 0 0 1-4 4H48a16 16 0 0 0-16 16v16c0 54.53 30 112.45 76.52 125.35a7.820 7.820 0 0 1 5.55 5.9c5.77 26.89 23.52 52.5 51.41 73.61 20.91 15.83 45.85 27.5 68.27 32.48a8 8 0 0 1 6.25 7.8V444a4 4 0 0 1-4 4h-59.55c-8.61 0-16 6.62-16.43 15.23A16 16 0 0 0 176 480h159.55c8.61 0 16-6.62 16.43-15.23A16 16 0 0 0 336 448h-60a4 4 0 0 1-4-4v-86.86a8 8 0 0 1 6.25-7.8c22.42-5 47.36-16.65 68.27-32.48 27.89-21.11 45.64-46.72 51.41-73.61a7.820 7.820 0 0 1 5.55-5.9C450 224.45 480 166.53 480 112V96a16 16 0 0 0-16-16M112 198.22a4 4 0 0 1-6 3.45c-10.26-6.11-17.75-15.37-22.14-21.89-11.910-17.69-19-40.67-19.79-63.63a4 4 0 0 1 4-4.15h40a4 4 0 0 1 4 4c-.02 27.45-.07 58.87-.07 82.22m316.13-18.44c-4.39 6.52-11.87 15.78-22.13 21.89a4 4 0 0 1-6-3.46c0-26.51 0-56.63-.05-82.21a4 4 0 0 1 4-4h40a4 4 0 0 1 4 4.15c-.79 22.96-7.9 45.94-19.81 63.63Z';

const DEFS = `
  <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffe680"/><stop offset="0.45" stop-color="#f5b700"/><stop offset="1" stop-color="#b87900"/>
  </linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#6ee79b"/><stop offset="1" stop-color="#16a34a"/>
  </linearGradient>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#11261a"/><stop offset="1" stop-color="#060908"/>
  </linearGradient>
  <radialGradient id="glow" cx="0.5" cy="0.36" r="0.5">
    <stop offset="0" stop-color="#22c55e" stop-opacity="0.45"/><stop offset="1" stop-color="#22c55e" stop-opacity="0"/>
  </radialGradient>
  <filter id="shine" x="-30%" y="-30%" width="160%" height="160%">
    <feGaussianBlur in="SourceAlpha" stdDeviation="10"/><feOffset dy="6"/>
    <feComponentTransfer><feFuncA type="linear" slope="0.45"/></feComponentTransfer>
    <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>`;

/** Trophy over "ICL", centred in a 512 box (content spans roughly 64..448). */
const MARK = `
  <g filter="url(#shine)">
    <path d="${TROPHY}" fill="url(#gold)" transform="translate(141 52) scale(0.45)"/>
    <text x="256" y="420" text-anchor="middle" font-family="'Plus Jakarta Sans'" font-weight="800" font-size="128" letter-spacing="8" fill="url(#green)">ICL</text>
  </g>`;

/** Full icon (legacy launcher, web favicon): rounded square or circle background + mark. */
function icon(shape = 'square') {
  const clip = shape === 'circle' ? '<circle cx="256" cy="256" r="256"/>' : '<rect width="512" height="512" rx="112"/>';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs>${DEFS}<clipPath id="c">${clip}</clipPath></defs>
    <g clip-path="url(#c)"><rect width="512" height="512" fill="url(#bg)"/><rect width="512" height="512" fill="url(#glow)"/>
    <g transform="translate(256 256) scale(0.86) translate(-256 -256)">${MARK}</g></g></svg>`;
}

/** Mark alone on transparent, scaled into the middle `fraction` of the canvas. */
function markOnly(fraction, glow = false) {
  // A soft green halo that fades out before the canvas edge (used where the system masks to a circle).
  const halo = glow
    ? '<radialGradient id="halo" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#22c55e" stop-opacity="0.35"/><stop offset="0.6" stop-color="#22c55e" stop-opacity="0.12"/><stop offset="1" stop-color="#22c55e" stop-opacity="0"/></radialGradient>'
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs>${DEFS}${halo}</defs>
    ${glow ? '<circle cx="256" cy="256" r="200" fill="url(#halo)"/>' : ''}
    <g transform="translate(256 256) scale(${fraction}) translate(-256 -256)">${MARK}</g></svg>`;
}

/** Adaptive icon background layer: dark gradient with a green glow behind the mark. */
function iconBackground() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs>${DEFS}</defs>
    <rect width="512" height="512" fill="url(#bg)"/><rect width="512" height="512" fill="url(#glow)"/></svg>`;
}

/** Full-screen splash for Android 11 and older. */
function splash(w, h) {
  const s = Math.min(w, h) * 0.42;
  const cx = w / 2, cy = h / 2 - s * 0.08;
  const tag = Math.max(10, Math.round(s * 0.075));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${DEFS}
    <radialGradient id="sg" cx="0.5" cy="0.46" r="0.6"><stop offset="0" stop-color="#22c55e" stop-opacity="0.28"/><stop offset="1" stop-color="#22c55e" stop-opacity="0"/></radialGradient></defs>
    <rect width="${w}" height="${h}" fill="#0e1116"/><rect width="${w}" height="${h}" fill="url(#sg)"/>
    <g transform="translate(${cx - s / 2} ${cy - s / 2}) scale(${s / 512})">${MARK}</g>
    <text x="${cx}" y="${cy + s * 0.62}" text-anchor="middle" font-family="'Plus Jakarta Sans'" font-weight="800" font-size="${tag}" letter-spacing="${tag * 0.35}" fill="#9fb3a6">INDOOR CHAMPION LEAGUE</text></svg>`;
}

module.exports = { icon, iconBackground, markOnly, splash, MARK, DEFS };
