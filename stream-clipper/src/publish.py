"""Stages 8 and 10: titles/descriptions/hashtags, review, and private upload through the YouTube Data API."""
import csv
import json
import re
from datetime import datetime

from common import LOGS, OUTPUT, ROOT, log

SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]
PRIVACY = "private"            # never anything else: the user publishes by hand in YouTube Studio


def source_link(info, offset):
    """Link to the original, at the clip's time for a finished YouTube video (a live recording's clock may differ)."""
    url = info.get("webpage_url") or ""
    if info.get("is_live") or "youtube.com/watch" not in url:
        return url
    return f"{url}&t={int(offset)}s"


def make_metadata(clip, info, words, segments, cfg, idx, offset=0.0):
    streamer = info.get("channel") or info.get("uploader") or "the streamer"
    game = cfg["game"]
    emoji = cfg["emojis"][idx % len(cfg["emojis"])]
    quote_words = [w["word"] for w in words if clip["peak"] <= w["start"] < clip["peak"] + 5][:6]

    def title_for(q):
        tpl = cfg["title_templates"] if q else cfg["title_fallbacks"]
        return tpl[idx % len(tpl)].format(quote=q, emoji=emoji, game=game, streamer=streamer)

    title = title_for(" ".join(quote_words).strip(" ,.!?"))
    while len(title) > 70 and quote_words:      # shorten the quote, never invent anything
        quote_words.pop()
        title = title_for(" ".join(quote_words).strip(" ,.!?") + ("…" if quote_words else ""))
    title = title[:70]

    handle_tag = "#" + re.sub(r"\W", "", streamer)
    hashtags = list(dict.fromkeys(["#Shorts", *cfg["hashtags"][:2], handle_tag, *cfg["hashtags"][2:]]))[:12]

    peak_seg = next((s["text"] for s in segments if s["start"] <= clip["peak"] + 2.5 <= s["end"] + 1), "")
    moment = (f'{streamer} in {game}: "{peak_seg[:100]}"' if peak_seg else f"{streamer}'s {game} stream highlight")
    link = source_link(info, offset + clip["start"])
    description = (f"{moment} {' '.join(hashtags[:3])}\n\n"
                   f"Clip from {streamer}'s stream: {link}\n"
                   f"Used with permission from {streamer}.\n\n"
                   f"{' '.join(hashtags)}")

    tags, total = [], 0
    for t in [*cfg["tags"], streamer, f"{streamer} {game}", *(h[1:] for h in hashtags)]:
        if t not in tags and total + len(t) + 3 <= 450:    # YouTube allows 500 characters of tags
            tags.append(t)
            total += len(t) + 3
    return {"title": title, "description": description, "tags": tags, "hashtags": hashtags,
            "emoji": emoji, "streamer": streamer, "source_link": link, "category_id": "20"}


# ---------- review ----------

def all_clips():
    return sorted(OUTPUT.glob("*/clip_*/metadata.json"))


def clip_id(path):
    return f"{path.parent.parent.name}/{path.parent.name}"


def review(approve=(), approve_all=False):
    paths = all_clips()
    if not paths:
        print("No clips yet. Run: python clip.py clip <stream URL>")
    for p in paths:
        m = json.loads(p.read_text(encoding="utf-8"))
        if (approve_all or clip_id(p) in approve) and not m.get("approved"):
            m["approved"] = True
            p.write_text(json.dumps(m, indent=1, ensure_ascii=False), encoding="utf-8")
        status = "uploaded" if m.get("video_id") else "approved" if m.get("approved") else "needs review"
        print(f"{clip_id(p)}  {m['duration']:4.0f}s  {status:12}  {m['title']}")
    if paths:
        print(f"\nWatch the clips in {OUTPUT}, then approve: python clip.py review --approve <id> [<id> ...]")


# ---------- upload ----------

def youtube():
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from googleapiclient.discovery import build
    token, secret = ROOT / "token.json", ROOT / "client_secret.json"
    creds = Credentials.from_authorized_user_file(str(token), SCOPES) if token.exists() else None
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not secret.exists():
                raise SystemExit("client_secret.json is missing. Follow 'Google Cloud setup' in README.md.")
            creds = InstalledAppFlow.from_client_secrets_file(str(secret), SCOPES).run_local_server(port=0)
        token.write_text(creds.to_json(), encoding="utf-8")
    return build("youtube", "v3", credentials=creds)


def _log_upload(row):
    LOGS.mkdir(exist_ok=True)
    path = LOGS / "uploads.csv"
    new = not path.exists()
    with path.open("a", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(row))
        if new:
            w.writeheader()
        w.writerow(row)


def upload():
    from googleapiclient.errors import HttpError
    from googleapiclient.http import MediaFileUpload
    todo = [(p, m) for p in all_clips()
            if (m := json.loads(p.read_text(encoding="utf-8"))).get("approved") and not m.get("video_id")]
    if not todo:
        print("Nothing approved to upload. Approve clips first: python clip.py review --approve <id>")
        return
    yt = youtube()
    for p, m in todo:
        body = {"snippet": {"title": m["title"], "description": m["description"], "tags": m["tags"],
                            "categoryId": m["category_id"]},
                "status": {"privacyStatus": PRIVACY, "selfDeclaredMadeForKids": False}}
        log.info("Uploading %s as private ...", clip_id(p))
        try:
            req = yt.videos().insert(part="snippet,status", body=body,
                                     media_body=MediaFileUpload(str(p.parent / "clip.mp4"), chunksize=-1, resumable=True))
            resp = None
            while resp is None:
                _, resp = req.next_chunk()
        except HttpError as e:
            if any(r in str(e) for r in ("quotaExceeded", "uploadLimitExceeded", "rateLimitExceeded")):
                log.warning("YouTube's daily upload limit is reached. The rest stay approved; run upload again tomorrow.")
                return
            raise
        vid, privacy = resp["id"], resp.get("status", {}).get("privacyStatus")
        m["video_id"] = vid
        p.write_text(json.dumps(m, indent=1, ensure_ascii=False), encoding="utf-8")
        _log_upload({"time": datetime.now().isoformat(timespec="seconds"), "clip": clip_id(p), "video_id": vid,
                     "privacy": privacy, "link": f"https://youtu.be/{vid}", "title": m["title"]})
        if privacy != PRIVACY:
            raise SystemExit(f"WARNING: YouTube reports {vid} as '{privacy}', not private. Stopped. "
                             f"Check it in YouTube Studio now: https://studio.youtube.com/video/{vid}/edit")
        log.info("  done: https://youtu.be/%s (private)", vid)
