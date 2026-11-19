#!/usr/bin/env python3
"""stream-clipper: turn a permitted livestream or VOD into private YouTube Shorts.

  python clip.py clip URL [--start 1:00:00] [--end 1:30:00] [--clips 5]
  python clip.py review [--approve ID ...] [--approve-all]
  python clip.py upload
  python clip.py update-tools
  python clip.py clean [--days 3]
"""
import argparse
import json
import shutil
import subprocess
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "src"))

from common import DOWNLOADS, OUTPUT, channel, check_permission, log, setting, setup_logging, slug, to_seconds  # noqa: E402
from pipeline import apply_fixes, audio_energy, download, extract_audio, fetch_info, find_moments, transcribe  # noqa: E402
from publish import make_metadata, review, upload  # noqa: E402
from render import render_clip  # noqa: E402


def cmd_clip(a):
    cfg = channel()
    info = fetch_info(a.url)
    creator = check_permission(info)                                    # 1. permission check
    log.info("Permitted creator: %s (%s)", creator["creator"], creator["permission"])
    work = DOWNLOADS / f"{slug(info.get('title'))}-{info['id']}"
    work.mkdir(parents=True, exist_ok=True)
    (work / "info.json").write_text(json.dumps(info, ensure_ascii=False), encoding="utf-8")

    src = download(a.url, info, work, a.start, a.end)                   # 2. download
    wav = extract_audio(src, work)
    transcript = transcribe(wav, work)                                  # 3. transcribe
    words = apply_fixes([w for s in transcript["segments"] for w in s["words"]], cfg["word_fixes"])
    energy = audio_energy(wav)
    clips = find_moments(src, work, words, energy, a.clips)             # 4. find moments
    log.info("Found %d moments.", len(clips))

    offset = to_seconds(a.start) or 0.0
    for i, c in enumerate(clips):
        t = int(offset + c["start"])
        out = OUTPUT / work.name / f"clip_{t // 3600:02}h{t % 3600 // 60:02}m{t % 60:02}s"
        if (out / "metadata.json").exists():
            continue                                                    # already done on an earlier run
        out.mkdir(parents=True, exist_ok=True)
        meta = make_metadata(c, info, words, transcript["segments"], cfg, i, offset)   # 8. metadata
        texts = {"hook": cfg["hooks"][i % len(cfg["hooks"])].format(game=cfg["game"]),
                 "question": cfg["questions"][i % len(cfg["questions"])],
                 "credit": f"Clip from {meta['streamer']}", "emoji": meta["emoji"]}
        dur, facecam = render_clip(src, c, words, energy, out, texts, cfg["font"])     # 5-7. cut, reframe, edit
        meta.update(texts, duration=round(dur, 1), facecam=facecam, source_start=offset + c["start"],
                    source_end=offset + c["end"], creator=creator, approved=False, video_id=None)
        (out / "metadata.json").write_text(json.dumps(meta, indent=1, ensure_ascii=False), encoding="utf-8")
        log.info("Clip ready: %s  (%.0fs)  %s", out.name, dur, meta["title"])
    review()                                                            # 9. review folder


def cmd_update_tools(_):
    subprocess.run([sys.executable, "-m", "pip", "install", "-U", "yt-dlp"], check=True)
    subprocess.run([sys.executable, "-m", "yt_dlp", "--version"], check=True)
    out = subprocess.run(["ffmpeg", "-version"], capture_output=True, text=True, check=True).stdout
    print(out.splitlines()[0])


def cmd_clean(a):
    cutoff = time.time() - a.days * 86400
    for d in DOWNLOADS.glob("*"):
        if d.is_dir() and d.stat().st_mtime < cutoff:
            shutil.rmtree(d)
            log.info("Deleted %s", d.name)


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)
    c = sub.add_parser("clip", help="make Shorts from a stream URL")
    c.add_argument("url")
    c.add_argument("--start", help="only download from here, e.g. 1:05:00 (finished streams)")
    c.add_argument("--end", help="only download up to here, e.g. 1:35:00")
    c.add_argument("--clips", type=int, default=setting("CLIP_COUNT", 5), help="how many clips (default 5)")
    r = sub.add_parser("review", help="list finished clips, approve them for upload")
    r.add_argument("--approve", nargs="+", default=[], metavar="ID")
    r.add_argument("--approve-all", action="store_true")
    sub.add_parser("upload", help="upload approved clips as PRIVATE")
    sub.add_parser("update-tools", help="upgrade yt-dlp and check ffmpeg")
    cl = sub.add_parser("clean", help="delete old downloads")
    cl.add_argument("--days", type=float, default=3, help="delete downloads older than this (default 3, 0 = all)")
    a = p.parse_args()

    setup_logging()
    try:
        {"clip": cmd_clip, "review": lambda a: review(a.approve, a.approve_all), "upload": lambda a: upload(),
         "update-tools": cmd_update_tools, "clean": cmd_clean}[a.cmd](a)
    except PermissionError as e:
        log.error("REFUSED: %s", e)
        sys.exit(2)


if __name__ == "__main__":
    main()
