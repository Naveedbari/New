"""Stages 2-4: download, transcribe, find the best moments."""
import bisect
import json
import re
import subprocess
import wave

import numpy as np

from common import channel, log, run, setting, ytdlp

WINDOW = 5                     # seconds per scored window
WEIGHTS = {"energy": 1.0, "rate": 0.7, "hype": 1.2, "visual": 0.6}
MIN_LEN, MAX_LEN = 15, 55      # clip length limits, seconds
LEAD, TAIL = 6, 8              # build-up before the peak, reaction after it
CHUNK_SECONDS = 30 * 60        # live recording chunk size


def fetch_info(url):
    return json.loads(run([*ytdlp(), "-J", "--no-playlist", url]))


# ---------- download ----------

def download(url, info, work, start=None, end=None):
    src = work / "source.mkv"
    if src.exists():
        return src
    h = setting("MAX_HEIGHT", 1080)
    fmt = f"bv*[height<={h}]+ba/b[height<={h}]/b"
    if info.get("is_live"):
        chunks = record_live(url, fmt, work)
        lst = work / "chunks.txt"
        lst.write_text("".join(f"file '{c.resolve().as_posix()}'\n" for c in chunks), encoding="utf-8")
        run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", lst,
             "-c", "copy", work / "source.tmp.mkv"])
    else:
        cmd = [*ytdlp(), "-f", fmt, "--merge-output-format", "mkv", "--no-playlist",
               "-o", str(work / "source.tmp.%(ext)s"), url]
        if start is not None or end is not None:
            cmd += ["--download-sections", f"*{start or 0}-{end if end is not None else 'inf'}",
                    "--force-keyframes-at-cuts"]
        subprocess.run(cmd, check=True)   # not captured, so yt-dlp shows its progress bar
    (work / "source.tmp.mkv").rename(src)
    return src


def record_live(url, fmt, work):
    """Record a running stream into 30-minute chunks, so a crash loses little.
    Ctrl+C stops recording and keeps everything saved so far. Re-running resumes with new chunks."""
    folder = work / "chunks"
    folder.mkdir(exist_ok=True)
    done = len(list(folder.glob("chunk_*.ts")))
    yt_cmd = [*ytdlp(), "-f", fmt, "-o", "-", url]
    if not done and setting("LIVE_FROM_START", True):
        yt_cmd[-1:-1] = ["--live-from-start"]
    ff_cmd = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", "pipe:0", "-map", "0:v", "-map", "0:a?",
              "-c", "copy", "-f", "segment", "-segment_time", str(CHUNK_SECONDS),
              "-segment_start_number", str(done), "-reset_timestamps", "1", str(folder / "chunk_%04d.ts")]
    log.info("Recording live stream. Press Ctrl+C once to stop recording and start clipping.")
    yt = subprocess.Popen(yt_cmd, stdout=subprocess.PIPE)
    ff = subprocess.Popen(ff_cmd, stdin=yt.stdout)
    yt.stdout.close()
    try:
        ff.wait()
    except KeyboardInterrupt:
        log.info("Stopping recording, keeping saved chunks.")
        yt.terminate()
        ff.wait()
    yt.wait()
    chunks = sorted(folder.glob("chunk_*.ts"))
    if not chunks:
        raise RuntimeError("Live recording saved no video. Run `python clip.py update-tools` and try again.")
    return chunks


# ---------- transcribe ----------

def extract_audio(src, work):
    wav = work / "audio.wav"
    if not wav.exists():
        run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-vn", "-ac", "1", "-ar", "16000", work / "audio.tmp.wav"])
        (work / "audio.tmp.wav").rename(wav)
    return wav


def transcribe(wav, work):
    out = work / "transcript.json"
    if out.exists():
        return json.loads(out.read_text(encoding="utf-8"))
    from faster_whisper import WhisperModel
    model = WhisperModel(setting("WHISPER_MODEL", "small"), device=setting("WHISPER_DEVICE", "auto"),
                         compute_type=setting("WHISPER_COMPUTE", "default"))
    task = "translate" if setting("CAPTION_LANGUAGE", "original").lower() == "english" else "transcribe"
    segments, meta = model.transcribe(str(wav), task=task, word_timestamps=True, vad_filter=True,
                                      initial_prompt=", ".join(sorted(set(channel()["word_fixes"].values()))))
    log.info("Transcribing (%s, language %s). Long streams take a while.", task, meta.language)
    data, shown = {"language": meta.language, "segments": []}, 0
    for s in segments:
        data["segments"].append({"start": s.start, "end": s.end, "text": s.text.strip(),
                                 "words": [{"start": w.start, "end": w.end, "word": w.word.strip()}
                                           for w in s.words or []]})
        if s.end - shown > 600:
            shown = s.end
            log.info("  transcribed %d min", s.end // 60)
    out.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
    return data


def _token(w):
    return re.sub(r"[^\w']", "", w.lower())


def apply_fixes(words, fixes):
    """Fix game names Whisper gets wrong, e.g. 'vice' 'city' -> 'Vice City' (merges up to 3 words)."""
    fixes = {k.lower(): v for k, v in fixes.items()}
    out, i = [], 0
    while i < len(words):
        for n in (3, 2, 1):
            part = words[i:i + n]
            key = " ".join(_token(w["word"]) for w in part)
            if len(part) == n and key in fixes:
                tail = re.search(r"[^\w']*$", part[-1]["word"]).group()   # keep trailing punctuation
                out.append({"start": part[0]["start"], "end": part[-1]["end"], "word": fixes[key] + tail})
                i += n
                break
        else:
            out.append(dict(words[i]))
            i += 1
    return out


# ---------- find moments ----------

def audio_energy(wav):
    """Loudness (dB) of every second of audio."""
    out = []
    with wave.open(str(wav)) as w:
        rate = w.getframerate()
        while frames := w.readframes(rate):
            x = np.frombuffer(frames, np.int16).astype(np.float32)
            out.append(20 * np.log10(np.sqrt(np.mean(x * x)) + 1))
    return np.array(out)


def visual_change(src, work, n):
    """How much the picture changes from one second to the next (cached)."""
    cache = work / "visual.npy"
    if not cache.exists():
        raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(src), "-vf",
                              "fps=1,scale=64:36,format=gray", "-f", "rawvideo", "-"],
                             capture_output=True, check=True).stdout
        frames = np.frombuffer(raw, np.uint8).reshape(-1, 64 * 36).astype(np.float32)
        np.save(cache, np.r_[0, np.abs(np.diff(frames, axis=0)).mean(axis=1)])
    return _fit(np.load(cache), n)


def _fit(x, n):
    return np.pad(x, (0, max(0, n - len(x))))[:n]


def speech_signals(words, n, hype_words):
    """Words per second, and hype phrases / laughter / '!' per second."""
    rate, hype = np.zeros(n), np.zeros(n)
    tokens = [_token(w["word"]) for w in words]
    phrases = [[_token(t) for t in p.split()] for p in hype_words]
    for i, w in enumerate(words):
        sec = min(int(w["start"]), n - 1)
        rate[sec] += 1
        hype[sec] += w["word"].endswith("!") + sum(tokens[i:i + len(p)] == p for p in phrases)
    return rate, hype


def window_scores(signals):
    """score[i] rates the window [i, i+5) seconds: sum of weighted z-scores."""
    total = 0
    for name, x in signals.items():
        win = np.convolve(x, np.ones(WINDOW), "valid") / WINDOW
        total = total + WEIGHTS[name] * (win - win.mean()) / (win.std() or 1)
    return total


def sentence_bounds(words):
    """Times where sentences start and end (punctuation or a pause over 0.7 s)."""
    starts, ends = [], []
    for i, w in enumerate(words):
        prev = words[i - 1] if i else None
        if prev is None or prev["word"].endswith((".", "?", "!")) or w["start"] - prev["end"] > 0.7:
            starts.append(w["start"])
            if prev:
                ends.append(prev["end"])
    if words:
        ends.append(words[-1]["end"])
    return sorted(starts), sorted(ends)


def _latest(xs, lo, hi):
    i = bisect.bisect_right(xs, hi) - 1
    return xs[i] if i >= 0 and xs[i] >= lo else None


def _earliest(xs, lo, hi):
    i = bisect.bisect_left(xs, lo)
    return xs[i] if i < len(xs) and xs[i] <= hi else None


def _first(*xs):
    return next(x for x in xs if x is not None)


def expand(p0, p1, starts, ends, duration):
    """Grow the peak window into a clip that starts at a sentence start and ends after the reaction."""
    want_s, want_e = max(0.0, p0 - LEAD), min(duration, p1 + TAIL)
    s = _first(_latest(starts, want_s - 4, want_s), _earliest(starts, want_s, p0), want_s)
    e = _first(_earliest(ends, want_e, want_e + 4), _latest(ends, p1, want_e), want_e)
    if e - s > MAX_LEN:
        e = _first(_latest(ends, p1, s + MAX_LEN), s + MAX_LEN)
    if e - s < MIN_LEN:
        e = _first(_earliest(ends, s + MIN_LEN, s + MIN_LEN + 4), s + MIN_LEN)
    e = min(e, duration)
    s = max(0.0, min(s, e - MIN_LEN))
    return round(s, 2), round(e, 2)


def pick_moments(scores, words, duration, count):
    starts, ends = sentence_bounds(words)
    clips = []
    for i in np.argsort(scores)[::-1]:
        if len(clips) >= count:
            break
        s, e = expand(float(i), float(i + WINDOW), starts, ends, duration)
        if any(s < c["end"] + 2 and c["start"] - 2 < e for c in clips):
            continue
        clips.append({"start": s, "end": e, "peak": float(i), "score": round(float(scores[i]), 2)})
    return sorted(clips, key=lambda c: c["start"])


def find_moments(src, work, words, energy, count):
    n = len(energy)
    if n < MIN_LEN:
        raise RuntimeError("The video is shorter than 15 seconds, too short for a clip.")
    rate, hype = speech_signals(words, n, channel()["hype_words"])
    scores = window_scores({"energy": energy, "rate": rate, "hype": hype,
                            "visual": visual_change(src, work, n)})
    clips = pick_moments(scores, words, float(n), count)
    (work / "moments.json").write_text(json.dumps(clips, indent=1), encoding="utf-8")
    return clips
