"""Offline checks for the logic that must not break. Run: python tests/test_core.py"""
import sys
import tempfile
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))
from common import channel, check_permission  # noqa: E402
from pipeline import MAX_LEN, MIN_LEN, apply_fixes, pick_moments  # noqa: E402
from publish import make_metadata  # noqa: E402
from render import build_ass, keep_intervals, remap  # noqa: E402

PERMS = """| Creator | Channel URL | Permission |
|---|---|---|
| Good Streamer | https://www.youtube.com/@GoodStreamer | email 2026-11-01 |
| Twitch Pal | https://twitch.tv/twitchpal/ | DM screenshot |
"""


def test_permissions():
    with tempfile.TemporaryDirectory() as d:
        f = Path(d) / "permissions.md"
        f.write_text(PERMS)
        yt = {"channel": "Good Streamer", "uploader_url": "https://www.youtube.com/@goodstreamer",
              "channel_url": "https://www.youtube.com/channel/UC123", "webpage_url": "https://www.youtube.com/watch?v=x"}
        assert check_permission(yt, f)["creator"] == "Good Streamer"
        tw = {"uploader_id": "TwitchPal", "webpage_url": "https://www.twitch.tv/videos/1"}
        assert check_permission(tw, f)["creator"] == "Twitch Pal"
        stranger = {"channel": "Random", "uploader_url": "https://www.youtube.com/@random",
                    "channel_url": "https://www.youtube.com/channel/UC999", "webpage_url": "https://www.youtube.com/watch?v=y"}
        for info in (stranger, {"uploader_id": "goodstreamer", "webpage_url": "https://www.twitch.tv/videos/2"}):
            try:
                check_permission(info, f)
                raise AssertionError("unlisted creator was allowed")
            except PermissionError:
                pass


def test_fixes():
    w = lambda t, s: {"word": t, "start": s, "end": s + 0.4}
    out = apply_fixes([w("gta", 0), w("six", 1), w("in", 2), w("vice", 3), w("city!", 4)], channel()["word_fixes"])
    assert [x["word"] for x in out] == ["GTA 6", "in", "Vice City!"], out
    assert out[0]["end"] == 1.4


def test_moments():
    rng = np.random.default_rng(0)
    scores = rng.normal(size=600)
    words = [{"word": "word.", "start": t, "end": t + 0.5} for t in np.arange(0, 600, 3.0)]
    clips = pick_moments(scores, words, 605.0, 5)
    assert len(clips) == 5
    for c in clips:
        assert MIN_LEN <= c["end"] - c["start"] <= MAX_LEN, c
        assert c["start"] <= c["peak"] and c["peak"] + 5 <= c["end"], c
    for a, b in zip(clips, clips[1:]):
        assert a["end"] <= b["start"], "clips overlap"


def test_silence_and_remap():
    energy = np.full(100, 60.0)
    energy[20:30] = 20.0                      # quiet gap from 20 s to 30 s, no words there
    words = [{"word": "x", "start": t, "end": t + 0.5} for t in [*range(0, 20), *range(30, 40)]]
    keep = keep_intervals(words, energy, 0, 40, protect=(32, 38))
    assert len(keep) == 2 and 19 < keep[0][1] < 21 and 29 < keep[1][0] < 30, keep
    assert remap(35, keep) < 35 and remap(5, keep) == 5
    assert keep_intervals(words, energy, 0, 40, protect=(15, 35)) == [(0.0, 40)]   # never cut the reaction


def test_metadata():
    cfg = channel()
    clip = {"start": 100.0, "end": 140.0, "peak": 110.0}
    words = [{"word": x, "start": 110 + i, "end": 110.5 + i} for i, x in enumerate("no way he actually jumped that bridge".split())]
    info = {"channel": "Good Streamer", "webpage_url": "https://www.youtube.com/watch?v=abc"}
    m = make_metadata(clip, info, words, [{"start": 109, "end": 116, "text": "No way he actually jumped that bridge"}], cfg, 0)
    assert len(m["title"]) <= 70 and "no way" in m["title"]
    assert "#Shorts" in m["hashtags"] and 5 <= len(m["hashtags"]) <= 12
    assert "Used with permission from Good Streamer" in m["description"]
    assert "watch?v=abc&t=100s" in m["description"]
    assert sum(len(t) + 3 for t in m["tags"]) <= 500
    ass = build_ass([{"word": "hi", "start": 0, "end": 1}], 20, "Hook", "Q?", "Clip from X", "Arial")
    assert "{\\c&H00FFFF&}hi" in ass and "Clip from X" in ass


if __name__ == "__main__":
    for name, fn in list(globals().items()):
        if name.startswith("test_"):
            fn()
            print("ok", name)
