import { star, trophy } from 'ionicons/icons';

export interface ChampionFrameData {
  teamName: string;
  /** Winners' group photo (preferred). */
  photo?: string | null;
  /** Team logo, used when there is no photo. */
  logo?: string | null;
  tournamentName: string;
  /** e.g. "14 Oct 2026" */
  dateLabel: string;
  mvpName?: string | null;
}

const W = 1080;
/** Height of a frame without a photo (portrait 4:5). */
const H_DEFAULT = 1350;
/** Title block height, from the trophy's top edge to the bottom of the frame. */
const TITLE_BLOCK = 578;
/** The photo keeps its own shape between these heights (panoramas / very tall shots are cropped). */
const PHOTO_MIN_H = 540;
const PHOTO_MAX_H = 1620;
const GREEN = '#22c55e';
const MINT = '#4ade80';
const GOLD = '#f5b700';
const BLACK = '#050807';
const FONT = "'Plus Jakarta Sans', system-ui, sans-serif";

/** Vertical centre of the emblem (logo / initials) when there is no photo. */
const EMBLEM_Y = 430;

/**
 * Frame geometry. With a photo, the frame takes the photo's shape: the whole photo is shown at full
 * width and the title block overlaps only its lower part, so the frame grows taller for portrait
 * shots and shorter for landscape group photos.
 */
interface Layout {
  /** Canvas height */
  h: number;
  /** Height of the photo area (0 without a photo) */
  photoH: number;
  /** Top of the title block (trophy) */
  titleTop: number;
}

/** Where the photo starts fading/greening towards the title (shorter ramp on wide photos). */
function fadeStart({ titleTop }: Layout): number {
  return titleTop - Math.min(250, Math.round(titleTop * 0.45));
}

function layoutFor(photo: HTMLImageElement | null): Layout {
  if (!photo) return { h: H_DEFAULT, photoH: 0, titleTop: H_DEFAULT - TITLE_BLOCK };
  const photoH = Math.round(Math.min(PHOTO_MAX_H, Math.max(PHOTO_MIN_H, (W * photo.height) / photo.width)));
  // The title overlaps up to 30% of the photo (max 300px) so faces stay clear.
  const titleTop = photoH - Math.min(300, Math.round(photoH * 0.3));
  return { h: titleTop + TITLE_BLOCK, photoH, titleTop };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Image failed to load'));
    img.src = src;
  });
}

/** ionicons SVG data URL recoloured (the `#` must be URL-encoded inside a data URL). */
function tintedIcon(svg: string, color: string): Promise<HTMLImageElement> {
  return loadImage(svg.replace('<svg ', `<svg fill='${color.replace('#', '%23')}' `));
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Draws `img` to fill the box, cropping the overflow (like CSS object-fit: cover). */
function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number): void {
  const scale = Math.max(w / img.width, h / img.height);
  const sw = w / scale;
  const sh = h / scale;
  // Bias the crop towards the top so heads stay in a group photo.
  ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) * 0.35, sw, sh, x, y, w, h);
}

// Canvas letterSpacing is not available everywhere, so characters are spaced manually.
function spacedWidth(ctx: CanvasRenderingContext2D, text: string, spacing: number): number {
  const chars = [...text];
  return chars.reduce((sum, c) => sum + ctx.measureText(c).width, 0) + spacing * (chars.length - 1);
}

function spaced(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  spacing: number,
  align: 'left' | 'center' | 'right' = 'center',
): void {
  const total = spacedWidth(ctx, text, spacing);
  let cx = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x;
  const prev = ctx.textAlign;
  ctx.textAlign = 'left';
  for (const c of text) {
    ctx.fillText(c, cx, y);
    cx += ctx.measureText(c).width + spacing;
  }
  ctx.textAlign = prev;
}

/** Largest font size (stepping down from `start`) at which the spaced text fits `maxWidth`. */
function fitSpaced(ctx: CanvasRenderingContext2D, text: string, weight: number, start: number, min: number, spacing: number, maxWidth: number): number {
  let size = start;
  for (; size > min; size -= 4) {
    ctx.font = `${weight} ${size}px ${FONT}`;
    if (spacedWidth(ctx, text, spacing * (size / start)) <= maxWidth) break;
  }
  ctx.font = `${weight} ${size}px ${FONT}`;
  return size;
}

function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const letters = words.length > 1 ? words[0]![0]! + words[1]![0]! : (words[0] ?? '?').slice(0, 2);
  return letters.toUpperCase();
}

/** Fine film grain so the flat blacks don't look digital. */
function grain(ctx: CanvasRenderingContext2D, h: number): void {
  const tile = document.createElement('canvas');
  tile.width = tile.height = 160;
  const t = tile.getContext('2d')!;
  const img = t.createImageData(160, 160);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  t.putImageData(img, 0, 0);
  ctx.save();
  ctx.globalAlpha = 0.035;
  ctx.fillStyle = ctx.createPattern(tile, 'repeat')!;
  ctx.fillRect(0, 0, W, h);
  ctx.restore();
}

/**
 * A green-toned copy of the photo that is transparent at the top and fully green behind the
 * title block, so the faces keep their natural colour and the tint only rises behind the text.
 */
function greenGrade(photo: HTMLImageElement, layout: Layout): HTMLCanvasElement {
  const { photoH, titleTop } = layout;
  const layer = document.createElement('canvas');
  layer.width = W;
  layer.height = photoH;
  const g = layer.getContext('2d')!;
  drawCover(g, photo, 0, 0, W, photoH);
  // Shift the hue towards green, keeping light and shade.
  g.globalCompositeOperation = 'color';
  g.fillStyle = 'rgba(34, 197, 94, 0.6)';
  g.fillRect(0, 0, W, photoH);
  g.globalCompositeOperation = 'soft-light';
  g.fillStyle = 'rgba(74, 222, 128, 0.45)';
  g.fillRect(0, 0, W, photoH);
  // Mask: clear above the content, ramp in towards the trophy.
  g.globalCompositeOperation = 'destination-in';
  const mask = g.createLinearGradient(0, fadeStart(layout), 0, titleTop + 8);
  mask.addColorStop(0, 'rgba(0, 0, 0, 0)');
  mask.addColorStop(1, 'rgba(0, 0, 0, 1)');
  g.fillStyle = mask;
  g.fillRect(0, 0, W, photoH);
  return layer;
}

/** Group photo across the top in natural colour, turning green and fading into black behind the title. */
function drawPhotoHero(ctx: CanvasRenderingContext2D, photo: HTMLImageElement, layout: Layout): void {
  const { photoH, titleTop } = layout;
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, W, photoH);
  ctx.clip();
  drawCover(ctx, photo, 0, 0, W, photoH);
  ctx.drawImage(greenGrade(photo, layout), 0, 0);
  // Side vignette
  const side = ctx.createLinearGradient(0, 0, W, 0);
  side.addColorStop(0, 'rgba(5, 8, 7, 0.55)');
  side.addColorStop(0.22, 'rgba(5, 8, 7, 0)');
  side.addColorStop(0.78, 'rgba(5, 8, 7, 0)');
  side.addColorStop(1, 'rgba(5, 8, 7, 0.55)');
  ctx.fillStyle = side;
  ctx.fillRect(0, 0, W, photoH);
  ctx.restore();

  // Top fade keeps the brand bar legible; bottom fade melts the photo into the title area.
  const top = ctx.createLinearGradient(0, 0, 0, 240);
  top.addColorStop(0, 'rgba(5, 8, 7, 0.85)');
  top.addColorStop(1, 'rgba(5, 8, 7, 0)');
  ctx.fillStyle = top;
  ctx.fillRect(0, 0, W, 240);
  const fadeTop = fadeStart(layout);
  const bottom = ctx.createLinearGradient(0, fadeTop, 0, photoH);
  bottom.addColorStop(0, 'rgba(5, 8, 7, 0)');
  bottom.addColorStop(0.55, 'rgba(5, 8, 7, 0.8)');
  bottom.addColorStop(1, BLACK);
  ctx.fillStyle = bottom;
  ctx.fillRect(0, fadeTop, W, photoH - fadeTop);
}

/** Stadium-light backdrop used when there is no photo. */
function drawStadium(ctx: CanvasRenderingContext2D): void {
  const glow = ctx.createRadialGradient(W / 2, EMBLEM_Y, 40, W / 2, EMBLEM_Y, 640);
  glow.addColorStop(0, 'rgba(34, 197, 94, 0.28)');
  glow.addColorStop(0.5, 'rgba(34, 197, 94, 0.08)');
  glow.addColorStop(1, 'rgba(34, 197, 94, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H_DEFAULT);

  // Floodlight beams from the top corners
  for (const [sx, tx] of [
    [140, W / 2 - 140],
    [W - 140, W / 2 + 140],
  ] as const) {
    const beam = ctx.createLinearGradient(0, -40, 0, 900);
    beam.addColorStop(0, 'rgba(220, 255, 230, 0.10)');
    beam.addColorStop(1, 'rgba(220, 255, 230, 0)');
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(sx - 30, -40);
    ctx.lineTo(sx + 30, -40);
    ctx.lineTo(tx + 220, 900);
    ctx.lineTo(tx - 220, 900);
    ctx.closePath();
    ctx.fill();
  }

  // Faint diagonal hatching for texture
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
  ctx.lineWidth = 2;
  for (let x = -H_DEFAULT; x < W; x += 28) {
    ctx.beginPath();
    ctx.moveTo(x, H_DEFAULT);
    ctx.lineTo(x + H_DEFAULT, 0);
    ctx.stroke();
  }
  ctx.restore();
}

/** Team logo (or initials) in a ringed medallion. */
async function drawEmblem(ctx: CanvasRenderingContext2D, data: ChampionFrameData): Promise<void> {
  const cx = W / 2;
  const cy = EMBLEM_Y;
  const r = 180;

  const halo = ctx.createRadialGradient(cx, cy, r * 0.8, cx, cy, r * 1.9);
  halo.addColorStop(0, 'rgba(34, 197, 94, 0.35)');
  halo.addColorStop(1, 'rgba(34, 197, 94, 0)');
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.9, 0, Math.PI * 2);
  ctx.fill();

  // Concentric rings + two accent arcs
  ctx.strokeStyle = 'rgba(74, 222, 128, 0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r + 34, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(74, 222, 128, 0.14)';
  ctx.beginPath();
  ctx.arc(cx, cy, r + 70, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = GREEN;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  for (const start of [-0.35, Math.PI - 0.35]) {
    ctx.beginPath();
    ctx.arc(cx, cy, r + 34, start, start + 0.9);
    ctx.stroke();
  }
  ctx.lineCap = 'butt';

  let drewLogo = false;
  if (data.logo) {
    try {
      const logo = await loadImage(data.logo);
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = '#0b120e';
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      drawCover(ctx, logo, cx - r, cy - r, r * 2, r * 2);
      ctx.restore();
      drewLogo = true;
    } catch {
      drewLogo = false;
    }
  }
  if (!drewLogo) {
    const disc = ctx.createLinearGradient(0, cy - r, 0, cy + r);
    disc.addColorStop(0, '#123222');
    disc.addColorStop(1, '#06120b');
    ctx.fillStyle = disc;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    const ink = ctx.createLinearGradient(0, cy - 80, 0, cy + 80);
    ink.addColorStop(0, '#ffffff');
    ink.addColorStop(1, MINT);
    ctx.fillStyle = ink;
    ctx.font = `800 150px ${FONT}`;
    ctx.textBaseline = 'middle';
    ctx.fillText(initials(data.teamName), cx, cy + 6);
    ctx.textBaseline = 'alphabetic';
  }
  ctx.strokeStyle = GREEN;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx, cy, r + 3, 0, Math.PI * 2);
  ctx.stroke();
}

/** Brand mark (top-left) and date pill (top-right). */
function drawTopBar(ctx: CanvasRenderingContext2D, data: ChampionFrameData): void {
  roundRect(ctx, 72, 72, 112, 50, 12);
  ctx.fillStyle = GREEN;
  ctx.fill();
  ctx.fillStyle = '#04130a';
  ctx.font = `800 30px ${FONT}`;
  spaced(ctx, 'ICL', 128, 108, 2);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = `800 17px ${FONT}`;
  spaced(ctx, 'INDOOR', 202, 93, 4, 'left');
  spaced(ctx, 'CHAMPION LEAGUE', 202, 116, 4, 'left');

  const label = data.dateLabel.toUpperCase();
  ctx.font = `700 20px ${FONT}`;
  const tw = spacedWidth(ctx, label, 3);
  const pw = tw + 48;
  roundRect(ctx, W - 72 - pw, 74, pw, 46, 23);
  ctx.fillStyle = 'rgba(5, 8, 7, 0.55)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  spaced(ctx, label, W - 72 - pw / 2, 104, 3);
}

/** Trophy, season kicker, CHAMPION, team name and MVP. */
async function drawTitle(ctx: CanvasRenderingContext2D, data: ChampionFrameData, top: number): Promise<void> {
  // Trophy with a gold glow
  try {
    const cup = await tintedIcon(trophy, GOLD);
    ctx.save();
    ctx.shadowColor = 'rgba(245, 183, 0, 0.65)';
    ctx.shadowBlur = 36;
    ctx.drawImage(cup, W / 2 - 42, top, 84, 84);
    ctx.restore();
  } catch {
    /* decorative */
  }

  // Kicker: tournament name flanked by fading rules
  const kicker = data.tournamentName.toUpperCase();
  ctx.fillStyle = MINT;
  const kSize = fitSpaced(ctx, kicker, 800, 26, 16, 7, 640);
  const kw = spacedWidth(ctx, kicker, 7 * (kSize / 26));
  spaced(ctx, kicker, W / 2, top + 140, 7 * (kSize / 26));
  for (const dir of [-1, 1]) {
    const x0 = W / 2 + dir * (kw / 2 + 22);
    const x1 = x0 + dir * 120;
    const rule = ctx.createLinearGradient(x0, 0, x1, 0);
    rule.addColorStop(0, 'rgba(74, 222, 128, 0.9)');
    rule.addColorStop(1, 'rgba(74, 222, 128, 0)');
    ctx.fillStyle = rule;
    ctx.fillRect(Math.min(x0, x1), top + 130, 120, 3);
  }

  // CHAMPION
  const size = fitSpaced(ctx, 'CHAMPION', 800, 172, 100, 14, 920);
  const spacing = 14 * (size / 172);
  const baseline = top + 288;
  const ink = ctx.createLinearGradient(0, baseline - size * 0.75, 0, baseline);
  ink.addColorStop(0, '#ffffff');
  ink.addColorStop(1, '#c9f7d9');
  ctx.save();
  ctx.fillStyle = ink;
  ctx.shadowColor = 'rgba(34, 197, 94, 0.75)';
  ctx.shadowBlur = 50;
  spaced(ctx, 'CHAMPION', W / 2, baseline, spacing);
  ctx.shadowBlur = 0;
  spaced(ctx, 'CHAMPION', W / 2, baseline, spacing);
  ctx.restore();

  // Team name
  ctx.fillStyle = MINT;
  fitSpaced(ctx, data.teamName, 800, 70, 36, 1, W - 220);
  spaced(ctx, data.teamName, W / 2, top + 374, 1);

  if (data.mvpName) await drawMvp(ctx, data.mvpName, top + 410);
}

async function drawMvp(ctx: CanvasRenderingContext2D, name: string, y: number): Promise<void> {
  const h = 62;
  ctx.font = `800 22px ${FONT}`;
  const labelW = spacedWidth(ctx, 'MVP', 4);
  ctx.font = `700 28px ${FONT}`;
  const nameW = Math.min(ctx.measureText(name).width, 520);
  const iconW = 26;
  const gap = 16;
  const pw = 36 + iconW + gap + labelW + gap * 2 + 2 + nameW + 36;
  const x = W / 2 - pw / 2;

  roundRect(ctx, x, y, pw, h, h / 2);
  ctx.fillStyle = 'rgba(34, 197, 94, 0.12)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(74, 222, 128, 0.55)';
  ctx.lineWidth = 2;
  ctx.stroke();

  let cx = x + 36;
  try {
    ctx.drawImage(await tintedIcon(star, GOLD), cx, y + (h - iconW) / 2, iconW, iconW);
  } catch {
    /* decorative */
  }
  cx += iconW + gap;
  ctx.fillStyle = MINT;
  ctx.font = `800 22px ${FONT}`;
  spaced(ctx, 'MVP', cx, y + 39, 4, 'left');
  cx += labelW + gap;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.fillRect(cx, y + 18, 2, h - 36);
  cx += 2 + gap;
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 28px ${FONT}`;
  ctx.textAlign = 'left';
  ctx.fillText(name, cx, y + 41, 520);
  ctx.textAlign = 'center';
}

/** Thin inset frame with green corner brackets, plus the footer tag. */
function drawFrame(ctx: CanvasRenderingContext2D, H: number): void {
  const inset = 28;
  ctx.strokeStyle = 'rgba(74, 222, 128, 0.4)';
  ctx.lineWidth = 2;
  roundRect(ctx, inset, inset, W - inset * 2, H - inset * 2, 26);
  ctx.stroke();

  ctx.strokeStyle = GREEN;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  const c = 64;
  const o = inset + 14;
  for (const [x, y, dx, dy] of [
    [o, o, 1, 1],
    [W - o, o, -1, 1],
    [o, H - o, 1, -1],
    [W - o, H - o, -1, -1],
  ] as const) {
    ctx.beginPath();
    ctx.moveTo(x, y + dy * c);
    ctx.lineTo(x, y);
    ctx.lineTo(x + dx * c, y);
    ctx.stroke();
  }
  ctx.lineCap = 'butt';

  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.font = `700 18px ${FONT}`;
  spaced(ctx, '#ICLCHAMPIONS', W / 2, H - 62, 5);
}

/**
 * Renders the champion frame as a PNG data URL, 1080px wide. Without a photo it is 1080×1350;
 * with a photo its height follows the photo's shape (see `layoutFor`).
 * Picture priority: group photo → team logo → team initials.
 */
export async function renderChampionFrame(data: ChampionFrameData): Promise<string> {
  await document.fonts?.ready;
  let photo: HTMLImageElement | null = null;
  if (data.photo) {
    try {
      photo = await loadImage(data.photo);
    } catch {
      photo = null;
    }
  }
  const layout = layoutFor(photo);
  const H = layout.h;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  ctx.fillStyle = BLACK;
  ctx.fillRect(0, 0, W, H);

  if (photo) {
    drawPhotoHero(ctx, photo, layout);
  } else {
    drawStadium(ctx);
    await drawEmblem(ctx, data);
  }

  // Green floor glow behind the title block
  const floor = ctx.createRadialGradient(W / 2, H + 140, 40, W / 2, H + 140, 760);
  floor.addColorStop(0, 'rgba(34, 197, 94, 0.22)');
  floor.addColorStop(1, 'rgba(34, 197, 94, 0)');
  ctx.fillStyle = floor;
  ctx.fillRect(0, 0, W, H);

  grain(ctx, H);
  drawTopBar(ctx, data);
  await drawTitle(ctx, data, layout.titleTop);
  drawFrame(ctx, H);

  return canvas.toDataURL('image/png');
}
