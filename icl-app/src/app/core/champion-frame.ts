import { trophy } from 'ionicons/icons';

export interface ChampionFrameData {
  teamName: string;
  /** Winners' group photo (preferred). */
  photo?: string | null;
  /** Team logo, used when there is no photo. */
  logo?: string | null;
  tournamentName: string;
  /** e.g. "Wed, 14 Oct 2026" */
  dateLabel: string;
  mvpName?: string | null;
}

const W = 1080;
const H = 1350;
const GREEN = '#22c55e';
const GREEN_DIM = 'rgba(34, 197, 94, 0.35)';
const BLACK = '#07090b';
const FONT = "'Plus Jakarta Sans', system-ui, sans-serif";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Image failed to load'));
    img.src = src;
  });
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
  ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, x, y, w, h);
}

/** Shrinks the font until `text` fits `maxWidth`. */
function fitText(ctx: CanvasRenderingContext2D, text: string, weight: number, start: number, min: number, maxWidth: number): number {
  let size = start;
  do {
    ctx.font = `${weight} ${size}px ${FONT}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 4;
  } while (size > min);
  return size;
}

function spaced(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, spacing: number): void {
  // Canvas letterSpacing is not available everywhere, so space characters manually (centred).
  const chars = [...text];
  const widths = chars.map((c) => ctx.measureText(c).width);
  const total = widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1);
  let cx = x - total / 2;
  ctx.textAlign = 'left';
  chars.forEach((c, i) => {
    ctx.fillText(c, cx, y);
    cx += widths[i]! + spacing;
  });
  ctx.textAlign = 'center';
}

/**
 * Renders the champion frame as a PNG data URL (1080×1350, portrait for social sharing).
 * Picture priority: group photo → team logo → team name.
 */
export async function renderChampionFrame(data: ChampionFrameData): Promise<string> {
  await document.fonts?.ready;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  // Background: near-black with a green floodlight glow at the top.
  ctx.fillStyle = BLACK;
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W / 2, -80, 40, W / 2, -80, 900);
  glow.addColorStop(0, 'rgba(34, 197, 94, 0.32)');
  glow.addColorStop(1, 'rgba(34, 197, 94, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  const glow2 = ctx.createRadialGradient(W / 2, H + 120, 40, W / 2, H + 120, 700);
  glow2.addColorStop(0, 'rgba(34, 197, 94, 0.18)');
  glow2.addColorStop(1, 'rgba(34, 197, 94, 0)');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, W, H);

  // Frame: outer green border, inner hairline, corner brackets.
  ctx.strokeStyle = GREEN;
  ctx.lineWidth = 10;
  roundRect(ctx, 30, 30, W - 60, H - 60, 36);
  ctx.stroke();
  ctx.strokeStyle = GREEN_DIM;
  ctx.lineWidth = 2;
  roundRect(ctx, 54, 54, W - 108, H - 108, 24);
  ctx.stroke();
  ctx.strokeStyle = GREEN;
  ctx.lineWidth = 8;
  const c = 70;
  for (const [x, y, dx, dy] of [
    [76, 76, 1, 1],
    [W - 76, 76, -1, 1],
    [76, H - 76, 1, -1],
    [W - 76, H - 76, -1, -1],
  ] as const) {
    ctx.beginPath();
    ctx.moveTo(x, y + dy * c);
    ctx.lineTo(x, y);
    ctx.lineTo(x + dx * c, y);
    ctx.stroke();
  }

  // Header
  ctx.fillStyle = GREEN;
  ctx.font = `800 26px ${FONT}`;
  spaced(ctx, 'ICL · INDOOR CHAMPION LEAGUE', W / 2, 136, 6);

  // Trophy icon (ionicons), tinted gold
  try {
    const svg = trophy.replace('<svg ', "<svg fill='%23f5b700' ");
    const icon = await loadImage(svg);
    ctx.drawImage(icon, W / 2 - 44, 162, 88, 88);
  } catch {
    /* icon is decorative */
  }

  ctx.fillStyle = '#ffffff';
  ctx.font = `800 128px ${FONT}`;
  ctx.shadowColor = 'rgba(34, 197, 94, 0.55)';
  ctx.shadowBlur = 40;
  spaced(ctx, 'CHAMPION', W / 2, 372, 10);
  ctx.shadowBlur = 0;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
  ctx.font = `600 32px ${FONT}`;
  ctx.fillText(`${data.tournamentName}  ·  ${data.dateLabel}`, W / 2, 428);

  // Picture panel
  const px = 120;
  const py = 470;
  const pw = W - 240;
  const ph = 560;
  ctx.save();
  roundRect(ctx, px, py, pw, ph, 28);
  ctx.fillStyle = '#10161b';
  ctx.fill();
  ctx.clip();
  let drew = false;
  if (data.photo) {
    try {
      drawCover(ctx, await loadImage(data.photo), px, py, pw, ph);
      // Fade the bottom of the photo into the frame for legibility.
      const fade = ctx.createLinearGradient(0, py + ph - 140, 0, py + ph);
      fade.addColorStop(0, 'rgba(7, 9, 11, 0)');
      fade.addColorStop(1, 'rgba(7, 9, 11, 0.55)');
      ctx.fillStyle = fade;
      ctx.fillRect(px, py, pw, ph);
      drew = true;
    } catch {
      drew = false;
    }
  }
  if (!drew && data.logo) {
    try {
      const logo = await loadImage(data.logo);
      const r = 200;
      const halo = ctx.createRadialGradient(W / 2, py + ph / 2, r * 0.6, W / 2, py + ph / 2, r * 1.8);
      halo.addColorStop(0, 'rgba(34, 197, 94, 0.3)');
      halo.addColorStop(1, 'rgba(34, 197, 94, 0)');
      ctx.fillStyle = halo;
      ctx.fillRect(px, py, pw, ph);
      ctx.save();
      ctx.beginPath();
      ctx.arc(W / 2, py + ph / 2, r, 0, Math.PI * 2);
      ctx.clip();
      drawCover(ctx, logo, W / 2 - r, py + ph / 2 - r, r * 2, r * 2);
      ctx.restore();
      ctx.strokeStyle = GREEN;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(W / 2, py + ph / 2, r + 4, 0, Math.PI * 2);
      ctx.stroke();
      drew = true;
    } catch {
      drew = false;
    }
  }
  if (!drew) {
    // No photo or logo: the team name fills the panel.
    const halo = ctx.createRadialGradient(W / 2, py + ph / 2, 20, W / 2, py + ph / 2, 420);
    halo.addColorStop(0, 'rgba(34, 197, 94, 0.25)');
    halo.addColorStop(1, 'rgba(34, 197, 94, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(px, py, pw, ph);
    ctx.fillStyle = '#ffffff';
    const size = fitText(ctx, data.teamName.toUpperCase(), 800, 150, 48, pw - 80);
    ctx.font = `800 ${size}px ${FONT}`;
    ctx.textBaseline = 'middle';
    ctx.fillText(data.teamName.toUpperCase(), W / 2, py + ph / 2);
    ctx.textBaseline = 'alphabetic';
  }
  ctx.restore();
  ctx.strokeStyle = GREEN;
  ctx.lineWidth = 6;
  roundRect(ctx, px, py, pw, ph, 28);
  ctx.stroke();

  // Team name + MVP
  ctx.fillStyle = GREEN;
  const nameSize = fitText(ctx, data.teamName, 800, 84, 40, W - 220);
  ctx.font = `800 ${nameSize}px ${FONT}`;
  ctx.fillText(data.teamName, W / 2, 1120);
  if (data.mvpName) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = `700 34px ${FONT}`;
    ctx.fillText(`★ MVP  ${data.mvpName}`, W / 2, 1176);
  }

  // Footer
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.font = `700 22px ${FONT}`;
  spaced(ctx, 'INDOOR CHAMPION LEAGUE', W / 2, H - 102, 8);

  return canvas.toDataURL('image/png');
}
