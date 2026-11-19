"""Stages 5-7: cut, reframe to 9:16, burn captions, hook, zoom and progress bar. One ffmpeg pass per clip."""
from pathlib import Path

import numpy as np

from common import log, run, setting

# 1080x1920 layout, top to bottom
W, H = 1080, 1920
CREDIT_Y = 200                 # "Clip from ..." (first seconds)
HOOK_Y = 330                   # hook line (first 2.5 s) and closing question (last 3 s)
EMOJI_X, EMOJI_Y, EMOJI_SIZE = 465, 470, 150
GAME_Y, GAME_H = 656, 608      # gameplay band, 16:9
CAPTION_Y = 1180               # lower-middle, clear of the Shorts buttons
BAR_Y = GAME_Y + GAME_H        # progress bar under the gameplay
CAM_Y, CAM_H = 1290, 340       # facecam band
HOOK_SECONDS, QUESTION_SECONDS, CREDIT_SECONDS = 2.5, 3.0, 4.0
ZOOM = 0.15                    # slow zoom-in on the peak, +15 %

EMOJI_FONTS = [("C:/Windows/Fonts/seguiemj.ttf", 136),
               ("/System/Library/Fonts/Apple Color Emoji.ttc", 160),
               ("/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf", 109),
               ("/usr/share/fonts/noto/NotoColorEmoji.ttf", 109)]


# ---------- silence removal ----------

def keep_intervals(words, energy, start, dur, protect):
    """Clip-local (start, end) spans to keep, dropping gaps over 1 s with no speech and quiet audio.
    Never cuts inside `protect` (the main reaction). Keeps everything if the result would be under 15 s."""
    if not setting("REMOVE_SILENCE", True):
        return [(0.0, dur)]
    quiet = np.median(energy[int(start):int(start + dur) + 1]) - 6
    cuts, last = [], 0.0
    for ws, we in sorted((w["start"], w["end"]) for w in words) + [(dur, dur)]:
        if ws - last > 1.0 and not (last < protect[1] and protect[0] < ws):
            gap = energy[int(start + last):int(start + ws) + 1]
            if len(gap) and gap.mean() < quiet:
                cuts.append((last + 0.3, ws - 0.3))
        last = max(last, we)
    keep, t = [], 0.0
    for a, b in cuts:
        keep.append((t, a))
        t = b
    keep = [(a, b) for a, b in keep + [(t, dur)] if b - a > 0.05]
    return keep if sum(b - a for a, b in keep) >= 15 else [(0.0, dur)]


def remap(t, keep):
    """Time in the original clip -> time after silent gaps are removed."""
    out = 0.0
    for a, b in keep:
        if t <= a:
            return out
        if t < b:
            return out + t - a
        out += b - a
    return out


# ---------- captions and text ----------

def ass_time(t):
    t = max(0.0, t)
    return f"{int(t // 3600)}:{int(t % 3600 // 60):02}:{t % 60:05.2f}"


def _esc(text):
    return text.replace("\\", "/").replace("{", "(").replace("}", ")")


def caption_chunks(words, size=3):
    """Groups of 2-4 words, broken at pauses and punctuation."""
    out, cur = [], []
    for w in words:
        if cur and (len(cur) == size or w["start"] - cur[-1]["end"] > 0.6 or cur[-1]["word"].endswith((".", "?", "!", ","))):
            out.append(cur)
            cur = []
        cur.append(w)
    return out + ([cur] if cur else [])


def build_ass(words, dur, hook, question, credit, font):
    style = "{name},{font},{size},&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,{outline},0,5,60,60,0,1"
    lines = ["[Script Info]", "ScriptType: v4.00+", f"PlayResX: {W}", f"PlayResY: {H}", "WrapStyle: 0", "",
             "[V4+ Styles]",
             "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, "
             "Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, "
             "Alignment, MarginL, MarginR, MarginV, Encoding",
             "Style: " + style.format(name="Caption", font=font, size=86, outline=7),
             "Style: " + style.format(name="Hook", font=font, size=80, outline=6),
             "Style: " + style.format(name="Credit", font=font, size=40, outline=3), "",
             "[Events]", "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text"]

    def add(a, b, style_name, y, text):
        lines.append(f"Dialogue: 0,{ass_time(a)},{ass_time(b)},{style_name},,0,0,0,,{{\\pos({W // 2},{y})}}{text}")

    add(0, HOOK_SECONDS, "Hook", HOOK_Y, _esc(hook))
    add(0, CREDIT_SECONDS, "Credit", CREDIT_Y, _esc(credit))
    add(max(HOOK_SECONDS, dur - QUESTION_SECONDS), dur, "Hook", HOOK_Y, _esc(question))
    for chunk in caption_chunks(words):
        for i, w in enumerate(chunk):
            end = chunk[i + 1]["start"] if i + 1 < len(chunk) else w["end"]
            text = " ".join("{\\c&H00FFFF&}" + _esc(x["word"]) + "{\\c&HFFFFFF&}" if x is w else _esc(x["word"])
                            for x in chunk)   # current word in yellow
            add(w["start"], max(end, w["start"] + 0.05), "Caption", CAPTION_Y, text)
    return "\n".join(lines) + "\n"


def emoji_png(char, path):
    """Draw a colour emoji to a PNG with the system emoji font. Returns None if no emoji font exists."""
    from PIL import Image, ImageDraw, ImageFont
    for font_path, size in EMOJI_FONTS:
        if not Path(font_path).exists():
            continue
        try:
            img = Image.new("RGBA", (size * 2, size * 2))
            ImageDraw.Draw(img).text((0, 0), char, font=ImageFont.truetype(font_path, size), embedded_color=True)
            if box := img.getbbox():
                img.crop(box).resize((EMOJI_SIZE, EMOJI_SIZE)).save(path)
                return path
        except OSError:
            continue
    log.info("No colour emoji font found; the hook shows without its emoji (the title still has it).")
    return None


# ---------- facecam ----------

def find_facecam(src, start, dur):
    """Return (x, y, w, h) of a webcam overlay if the same face sits in the same spot across the clip."""
    import cv2
    cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    cap, boxes, size = cv2.VideoCapture(str(src)), [], None
    for k in range(6):
        cap.set(cv2.CAP_PROP_POS_MSEC, (start + dur * (k + 0.5) / 6) * 1000)
        ok, frame = cap.read()
        if not ok:
            continue
        size = frame.shape[1], frame.shape[0]
        faces = [f for f in cascade.detectMultiScale(cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY), 1.1, 6,
                                                     minSize=(size[0] // 30,) * 2) if f[2] < size[0] * 0.2]
        if faces:
            boxes.append(max(faces, key=lambda f: f[2]))
    cap.release()
    if len(boxes) < 4:
        return None
    b = np.array(boxes, float)
    x, y, w, h = np.median(b, axis=0)
    if b[:, 0].std() > w * 0.5 or b[:, 1].std() > h * 0.5:   # the face moves around: gameplay, not a webcam
        return None
    cw = min(w * 3.2, size[0])
    ch = min(cw * 3 / 4, size[1])
    cx = int(np.clip(x + w / 2 - cw / 2, 0, size[0] - cw)) // 2 * 2
    cy = int(np.clip(y + h / 2 - ch * 0.45, 0, size[1] - ch)) // 2 * 2
    return cx, cy, int(cw) // 2 * 2, int(ch) // 2 * 2


# ---------- render ----------

def render_clip(src, clip, words, energy, out_dir, texts, font):
    """Write clip.mp4, cover.jpg and preview.jpg into out_dir. Returns the final duration."""
    s, e = clip["start"], clip["end"]
    local = [dict(w, start=w["start"] - s, end=w["end"] - s) for w in words if s <= w["start"] and w["end"] <= e]
    peak = clip["peak"] - s
    keep = keep_intervals(local, energy, s, e - s, (peak - 1, peak + 8))
    dur = sum(b - a for a, b in keep)
    local = [dict(w, start=remap(w["start"], keep), end=remap(w["end"], keep)) for w in local]
    p = remap(peak + 2.5, keep)
    (out_dir / "captions.ass").write_text(build_ass(local, dur, texts["hook"], texts["question"],
                                                    texts["credit"], font), encoding="utf-8")

    sel = "+".join(f"between(t,{a:.3f},{b:.3f})" for a, b in keep)
    vsel = f",select='{sel}',setpts=N/30/TB" if len(keep) > 1 else ""
    asel = f"aselect='{sel}',asetpts=N/SR/TB," if len(keep) > 1 else ""
    zoom = f"1+{ZOOM}*(clip((it-{p - 1.5:.2f})/1.5,0,1)-clip((it-{p + 2:.2f})/1,0,1))"
    cam = find_facecam(src, s, e - s)
    g = [f"[0:v]fps=30{vsel},split={3 if cam else 2}[v0][v1]{'[v2]' if cam else ''}",
         "[v0]scale=270:480:force_original_aspect_ratio=increase,crop=270:480,boxblur=10:2,scale=1080:1920,setsar=1[bg]",
         f"[v1]scale=2160:1216,setsar=1,zoompan=z='{zoom}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=1080x{GAME_H}:fps=30[game]",
         f"[bg][game]overlay=0:{GAME_Y}[base]"]
    last = "base"
    if cam:
        x, y, w, h = cam
        g += [f"[v2]crop={w}:{h}:{x}:{y},scale=-2:{CAM_H}[cam]", f"[{last}][cam]overlay=(W-w)/2:{CAM_Y}[withcam]"]
        last = "withcam"
    g += [f"[{last}]ass=captions.ass[txt]",
          f"color=c=0xFFD400:s={W}x10:r=30:d={dur:.3f}[bar]",
          f"[txt][bar]overlay=x='-W+W*t/{dur:.3f}':y={BAR_Y}:shortest=1[barred]"]
    last = "barred"
    inputs = ["-ss", f"{s:.3f}", "-t", f"{e - s:.3f}", "-i", Path(src).resolve()]
    if emoji_png(texts["emoji"], out_dir / "emoji.png"):
        inputs += ["-loop", "1", "-t", str(HOOK_SECONDS), "-i", "emoji.png"]
        g.append(f"[{last}][1:v]overlay={EMOJI_X}:{EMOJI_Y}:eof_action=pass[emo]")
        last = "emo"
    # The only audio change allowed: gentle loudness normalisation. No music, no ducking.
    g.append(f"[0:a]{asel}loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[aout]")

    run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", *inputs, "-filter_complex", ";".join(g),
         "-map", f"[{last}]", "-map", "[aout]", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
         "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "clip.tmp.mp4"],
        cwd=out_dir)
    (out_dir / "clip.tmp.mp4").replace(out_dir / "clip.mp4")
    run(["ffmpeg", "-y", "-loglevel", "error", "-ss", "1.0", "-i", "clip.mp4", "-frames:v", "1", "-q:v", "2",
         "cover.jpg"], cwd=out_dir)
    run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{min(p, dur - 0.5):.2f}", "-i", "clip.mp4",
         "-frames:v", "1", "-vf", "scale=270:-2", "preview.jpg"], cwd=out_dir)
    return dur, bool(cam)
