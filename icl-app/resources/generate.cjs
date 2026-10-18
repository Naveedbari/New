// Renders the ICL launcher icons and splash screens for Android from brand.cjs.
// Usage: node resources/generate.cjs  (needs Playwright with Chromium)
const path = require('path');
const fs = require('fs');
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');
const brand = require('./brand.cjs');

const app = path.resolve(__dirname, '..');
const res = path.join(app, 'android/app/src/main/res');
const font = fs.readFileSync(path.join(app, 'node_modules/@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-800-normal.woff2')).toString('base64');
const DENSITIES = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  async function render(svg, w, h, out, transparent = false) {
    await page.setViewportSize({ width: w, height: h });
    await page.setContent(`<style>@font-face{font-family:'Plus Jakarta Sans';font-weight:800;src:url(data:font/woff2;base64,${font}) format('woff2')}
      html,body{margin:0;background:transparent}svg{display:block;width:${w}px;height:${h}px}</style>${svg}`);
    await page.evaluate(() => document.fonts.ready);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    await page.screenshot({ path: out, omitBackground: transparent, clip: { x: 0, y: 0, width: w, height: h } });
  }

  for (const [d, k] of Object.entries(DENSITIES)) {
    const dir = path.join(res, `mipmap-${d}`);
    await render(brand.icon('square'), 48 * k, 48 * k, path.join(dir, 'ic_launcher.png'), true);
    await render(brand.icon('circle'), 48 * k, 48 * k, path.join(dir, 'ic_launcher_round.png'), true);
    // Adaptive icon foreground: 108dp canvas, keep the mark inside the 66dp safe zone.
    await render(brand.markOnly(0.66), 108 * k, 108 * k, path.join(dir, 'ic_launcher_foreground.png'), true);
    await render(brand.iconBackground(), 108 * k, 108 * k, path.join(dir, 'ic_launcher_background.png'));
    // Android 12+ splash icon: 288dp canvas, visible inside a 192dp circle.
    await render(brand.markOnly(0.56, true), 288 * k, 288 * k, path.join(res, `drawable-${d}`, 'splash_icon.png'), true);
  }
  // Full-screen splash for Android 11 and older.
  const port = { mdpi: [320, 480], hdpi: [480, 800], xhdpi: [720, 1280], xxhdpi: [960, 1600], xxxhdpi: [1280, 1920] };
  for (const [d, [w, h]] of Object.entries(port)) {
    await render(brand.splash(w, h), w, h, path.join(res, `drawable-port-${d}`, 'splash.png'));
    await render(brand.splash(h, w), h, w, path.join(res, `drawable-land-${d}`, 'splash.png'));
  }
  await render(brand.splash(480, 320), 480, 320, path.join(res, 'drawable', 'splash.png'));
  // Web favicon and the mark for the in-app start-up screen. An SVG used as an <img> can't see the
  // page's fonts, so the font is embedded in the file.
  const withFont = (svg) =>
    svg.replace('<defs>', `<defs><style>@font-face{font-family:'Plus Jakarta Sans';font-weight:800;src:url(data:font/woff2;base64,${font}) format('woff2')}</style>`).replace(/\s+/g, ' ');
  fs.writeFileSync(path.join(app, 'public/assets/icon/icon.svg'), withFont(brand.icon('square')));
  fs.writeFileSync(path.join(app, 'public/assets/icon/mark.svg'), withFont(brand.markOnly(1)));
  await browser.close();
  console.log('Generated launcher icons and splash screens');
})();
