"""Paths, settings, the permission check and small helpers shared by every stage."""
import json
import logging
import os
import re
import subprocess
import sys
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
CONFIG, DOWNLOADS, OUTPUT, LOGS = (ROOT / d for d in ("config", "downloads", "output", "logs"))
load_dotenv(ROOT / ".env")
log = logging.getLogger("clipper")


def setting(name, default):
    """Read a value from .env, typed like its default."""
    raw = os.getenv(name, "").strip()
    if not raw:
        return default
    if isinstance(default, bool):
        return raw.lower() in ("1", "true", "yes", "on")
    return type(default)(raw)


def channel():
    return json.loads((CONFIG / "channel.json").read_text(encoding="utf-8"))


def run(cmd, **kw):
    """Run a program; on failure raise with the end of its error output."""
    p = subprocess.run([str(c) for c in cmd], capture_output=True, text=True,
                       encoding="utf-8", errors="replace", **kw)
    if p.returncode:
        raise RuntimeError(f"{Path(str(cmd[0])).name} failed:\n{p.stderr[-3000:]}")
    return p.stdout


def ytdlp():
    browser = setting("COOKIES_FROM_BROWSER", "")
    return [sys.executable, "-m", "yt_dlp", *(["--cookies-from-browser", browser] if browser else [])]


def to_seconds(t):
    """'1:02:03', '62:03' or '3723' -> 3723.0; None stays None."""
    if t in (None, ""):
        return None
    total = 0.0
    for part in str(t).split(":"):
        total = total * 60 + float(part)
    return total


def slug(text, n=40):
    return re.sub(r"[^A-Za-z0-9]+", "-", text or "").strip("-")[:n] or "stream"


def setup_logging():
    LOGS.mkdir(exist_ok=True)
    logging.basicConfig(level=logging.INFO, format="%(asctime)s  %(message)s", datefmt="%H:%M:%S",
                        handlers=[logging.StreamHandler(),
                                  logging.FileHandler(LOGS / "clipper.log", encoding="utf-8")])


# ---------- permissions ----------

def _norm_url(u):
    u = re.sub(r"^https?://", "", (u or "").strip().lower())
    u = re.sub(r"^(www\.|m\.)", "", u).rstrip("/")
    return re.sub(r"/(videos|streams|live|featured|about)$", "", u)


def permitted_creators(path=None):
    rows = []
    for line in Path(path or CONFIG / "permissions.md").read_text(encoding="utf-8").splitlines():
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if not line.lstrip().startswith("|") or len(cells) < 3:
            continue
        if cells[0].lower() == "creator" or not cells[1] or set(line) <= set("|-: "):
            continue
        rows.append({"creator": cells[0], "url": cells[1], "permission": cells[2]})
    return rows


def check_permission(info, path=None):
    """Return the permissions.md row for this stream's channel, or raise PermissionError."""
    urls = {_norm_url(info.get(k)) for k in ("channel_url", "uploader_url") if info.get(k)}
    ids = {str(info[k]).lower().lstrip("@") for k in ("channel_id", "uploader_id") if info.get(k)}
    site = _norm_url(info.get("webpage_url")).split("/")[0]
    for row in permitted_creators(path):
        u = _norm_url(row["url"])
        if u in urls or (u.split("/")[0] == site and u.rsplit("/", 1)[-1].lstrip("@") in ids):
            return row
    who = info.get("channel") or info.get("uploader") or "this creator"
    raise PermissionError(f"{who} ({info.get('channel_url') or info.get('uploader_url')}) is not in "
                          f"config/permissions.md. Add them only once you have their written permission.")
