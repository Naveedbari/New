function svgToDataUri(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export const heroPortraitDataUri = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640">
  <defs>
    <linearGradient id="blob" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#646973" />
      <stop offset="100%" stop-color="#BBCCD7" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="7%" stop-color="#18011F" />
      <stop offset="37%" stop-color="#B600A8" />
      <stop offset="72%" stop-color="#7621B0" />
      <stop offset="100%" stop-color="#BE4C00" />
    </linearGradient>
  </defs>
  <circle cx="320" cy="320" r="300" fill="url(#blob)" opacity="0.12" />
  <circle cx="320" cy="320" r="230" fill="none" stroke="url(#blob)" stroke-width="2" opacity="0.5" />
  <circle cx="320" cy="320" r="170" fill="none" stroke="url(#accent)" stroke-width="3" opacity="0.7" />
  <text x="320" y="300" text-anchor="middle" font-family="Kanit, sans-serif" font-weight="900" font-size="150" fill="url(#blob)">&lt;/&gt;</text>
  <text x="320" y="420" text-anchor="middle" font-family="Kanit, sans-serif" font-weight="900" font-size="120" letter-spacing="6" fill="url(#accent)">NB</text>
</svg>
`);

function decorIcon(inner: string): string {
  return svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#646973" />
      <stop offset="100%" stop-color="#BBCCD7" />
    </linearGradient>
  </defs>
  <circle cx="150" cy="150" r="140" fill="none" stroke="url(#g)" stroke-width="2" opacity="0.35" />
  ${inner}
</svg>
`);
}

export const codeBracketsIcon = decorIcon(
  `<text x="150" y="185" text-anchor="middle" font-family="Kanit, sans-serif" font-weight="900" font-size="120" fill="url(#g)">&lt;/&gt;</text>`
);

export const terminalIcon = decorIcon(`
  <rect x="60" y="90" width="180" height="120" rx="16" fill="none" stroke="url(#g)" stroke-width="4" />
  <path d="M90 130 L120 150 L90 170" fill="none" stroke="url(#g)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
  <line x1="135" y1="170" x2="190" y2="170" stroke="url(#g)" stroke-width="6" stroke-linecap="round" />
`);

export const layersIcon = decorIcon(`
  <rect x="80" y="90" width="140" height="34" rx="8" fill="none" stroke="url(#g)" stroke-width="4" />
  <rect x="80" y="133" width="140" height="34" rx="8" fill="none" stroke="url(#g)" stroke-width="4" opacity="0.75" />
  <rect x="80" y="176" width="140" height="34" rx="8" fill="none" stroke="url(#g)" stroke-width="4" opacity="0.5" />
`);

export const gearIcon = decorIcon(`
  <circle cx="150" cy="150" r="42" fill="none" stroke="url(#g)" stroke-width="6" />
  <circle cx="150" cy="150" r="14" fill="url(#g)" />
  ${[0, 45, 90, 135, 180, 225, 270, 315]
    .map(
      (deg) =>
        `<rect x="146" y="90" width="8" height="26" rx="4" fill="url(#g)" transform="rotate(${deg} 150 150)" />`
    )
    .join('')}
`);

const MOCKUP_BG = '#0C0C0C';
const MOCKUP_LINE = '#2A2E33';
const MOCKUP_LINE_SOFT = '#1A1C1F';

export function dashboardMockup(accent: string): string {
  const bars = [80, 140, 100, 170, 60, 130]
    .map((h, i) => `<rect x="${480 + i * 42}" y="${420 - h}" width="28" height="${h}" rx="4" fill="${i % 2 === 0 ? accent : MOCKUP_LINE}" opacity="${i % 2 === 0 ? 0.9 : 0.5}" />`)
    .join('');
  return svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="${MOCKUP_BG}" />
  <rect x="40" y="40" width="720" height="60" rx="14" fill="${MOCKUP_LINE_SOFT}" />
  <circle cx="72" cy="70" r="10" fill="${accent}" />
  <rect x="100" y="60" width="180" height="20" rx="6" fill="${MOCKUP_LINE}" />
  <rect x="40" y="130" width="220" height="140" rx="16" fill="${MOCKUP_LINE_SOFT}" />
  <rect x="64" y="156" width="120" height="16" rx="4" fill="${accent}" opacity="0.8" />
  <rect x="64" y="196" width="160" height="36" rx="6" fill="${MOCKUP_LINE}" />
  <rect x="280" y="130" width="220" height="140" rx="16" fill="${MOCKUP_LINE_SOFT}" />
  <rect x="304" y="156" width="120" height="16" rx="4" fill="${accent}" opacity="0.5" />
  <rect x="304" y="196" width="160" height="36" rx="6" fill="${MOCKUP_LINE}" />
  <rect x="40" y="300" width="460" height="260" rx="16" fill="${MOCKUP_LINE_SOFT}" />
  <rect x="480" y="130" width="280" height="430" rx="16" fill="${MOCKUP_LINE_SOFT}" />
  ${bars}
</svg>
`);
}

export function editorMockup(accent: string): string {
  const lines = [0.9, 0.6, 0.75, 0.4, 0.8, 0.5, 0.65, 0.3]
    .map((w, i) => `<rect x="220" y="${120 + i * 44}" width="${w * 500}" height="18" rx="4" fill="${i === 2 ? accent : MOCKUP_LINE}" opacity="${i === 2 ? 0.9 : 0.55}" />`)
    .join('');
  const sidebar = [0, 1, 2, 3, 4, 5, 6]
    .map((i) => `<rect x="40" y="${120 + i * 40}" width="130" height="14" rx="4" fill="${MOCKUP_LINE}" opacity="0.5" />`)
    .join('');
  return svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="${MOCKUP_BG}" />
  <rect x="0" y="0" width="800" height="56" fill="${MOCKUP_LINE_SOFT}" />
  <circle cx="30" cy="28" r="8" fill="${accent}" opacity="0.9" />
  <circle cx="56" cy="28" r="8" fill="${MOCKUP_LINE}" />
  <circle cx="82" cy="28" r="8" fill="${MOCKUP_LINE}" />
  <rect x="0" y="56" width="200" height="544" fill="${MOCKUP_LINE_SOFT}" opacity="0.5" />
  ${sidebar}
  ${lines}
</svg>
`);
}

export function mobileMockup(accent: string): string {
  const dots = [0, 1, 2, 3]
    .map((i) => `<circle cx="${340 + i * 40}" cy="500" r="8" fill="${i === 1 ? accent : MOCKUP_LINE}" opacity="${i === 1 ? 0.9 : 0.5}" />`)
    .join('');
  return svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="${MOCKUP_BG}" />
  <rect x="300" y="40" width="200" height="520" rx="36" fill="${MOCKUP_LINE_SOFT}" stroke="${MOCKUP_LINE}" stroke-width="3" />
  <rect x="320" y="70" width="160" height="26" rx="8" fill="${accent}" opacity="0.85" />
  <rect x="320" y="112" width="160" height="70" rx="10" fill="${MOCKUP_LINE}" opacity="0.6" />
  <rect x="320" y="196" width="160" height="70" rx="10" fill="${MOCKUP_LINE}" opacity="0.4" />
  <rect x="320" y="280" width="160" height="70" rx="10" fill="${MOCKUP_LINE}" opacity="0.4" />
  <rect x="320" y="364" width="76" height="76" rx="10" fill="${accent}" opacity="0.5" />
  <rect x="404" y="364" width="76" height="76" rx="10" fill="${MOCKUP_LINE}" opacity="0.5" />
  ${dots}
</svg>
`);
}
