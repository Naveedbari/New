# stream-clipper

Turns a permitted livestream or VOD into vertical YouTube Shorts with captions, a hook and credit, and uploads them to your channel as **private**. You review them and publish them yourself in YouTube Studio.

**Run it on your own computer, not a cloud server.** YouTube blocks most data-center IP addresses.

## 1. Install (once)

You need Python 3.11+, Git, ffmpeg and at least 50 GB of free disk space.

| | ffmpeg |
|---|---|
| Windows | `winget install Gyan.FFmpeg` (then open a new terminal) |
| Mac | `brew install ffmpeg` |
| Linux | `sudo apt install ffmpeg` |

Check it with `ffmpeg -version`. Then, in this folder:

```bash
python -m venv .venv
# Windows:      .venv\Scripts\activate
# Mac / Linux:  source .venv/bin/activate
pip install -r requirements.txt
copy .env.example .env        # Mac / Linux: cp .env.example .env
python tests/test_core.py     # should print "ok" five times
```

## 2. Permissions (before every new creator)

Add a row to `config/permissions.md` for each creator who has given you written permission to clip their streams. The tool refuses any stream whose channel is not listed there.

## 3. Google Cloud setup (once, for uploading)

1. Go to <https://console.cloud.google.com/>, sign in with the Google account that owns your channel, and create a project (e.g. "stream-clipper").
2. **APIs & Services → Library** → search **YouTube Data API v3** → **Enable**.
3. **APIs & Services → OAuth consent screen** → External → fill in the app name and your email. Under **Test users**, add your own Google account.
4. **APIs & Services → Credentials → Create credentials → OAuth client ID** → application type **Desktop app**.
5. Download the JSON file, rename it `client_secret.json`, and put it in this folder. It is in `.gitignore`, so never commit it.

The first `upload` opens your browser once so you can approve access. After that the tool keeps a `token.json` file, which is also git-ignored.

Note that Google keeps uploads from a new, unaudited API project private. That is fine here, because uploads are always private anyway.

## 4. Use it

```bash
python clip.py clip "https://www.youtube.com/watch?v=..."                     # whole VOD, 5 clips
python clip.py clip "https://www.youtube.com/watch?v=..." --start 1:00:00 --end 1:30:00 --clips 8
python clip.py clip "https://www.youtube.com/@creator/live"                   # live: Ctrl+C once to stop recording and clip
python clip.py review                                  # list clips; watch them in output/
python clip.py review --approve Stream-abc/clip_00h12m05s Stream-abc/clip_00h31m40s
python clip.py upload                                  # uploads approved clips as PRIVATE, logs to logs/uploads.csv
python clip.py update-tools                            # run this whenever downloads start failing
python clip.py clean --days 3                          # delete downloads older than 3 days
```

Each clip folder in `output/` holds `clip.mp4`, `metadata.json` (title, description, hashtags, tags), `cover.jpg` (a 1080x1920 frame you can pick in YouTube Studio) and `preview.jpg`. You can edit the title or description in `metadata.json` before approving.

If a run stops partway, run the same command again. It picks up where it stopped, because every stage saves its result in `downloads/<stream>/`.

## What each clip gets

- A 1080x1920 frame, 15–55 seconds long: blurred fill, gameplay in the middle, and the facecam in its own band below the gameplay (when one is detected).
- The original audio with only gentle loudness normalization: no music, no muting.
- Word-by-word captions with the spoken word highlighted in yellow. Game names are fixed through `word_fixes` in `config/channel.json`.
- A hook line and emoji for the first 2.5 s, a "Clip from <streamer>" credit, a slow zoom on the peak moment, a progress bar, and a closing question.
- Silent gaps longer than 1 s are cut, but never inside the main reaction.
- A title built from what is actually said in the clip, a description that credits the creator and links the source, #Shorts plus your channel hashtags (12 at most), and tags.

You can change the niche, hashtags, hooks, questions, title templates and font in `config/channel.json` without touching code. Settings such as the Whisper model, caption language and clip count are in `.env`.

## Testing checklist (run on your PC)

- [ ] `python clip.py update-tools` prints the yt-dlp and ffmpeg versions; `python tests/test_core.py` passes.
- [ ] `python clip.py clip <permitted VOD> --start 0:10:00 --end 0:12:00 --clips 1` downloads a 2-minute section. This also downloads the Whisper model the first time.
- [ ] Captions line up with the speech, and the audio sounds like the original.
- [ ] The clip is 1080x1920, under 60 s, and plays in a normal video player.
- [ ] `metadata.json` has a title, a description and the hashtags.
- [ ] Approve that clip, run `upload`, and check that `logs/uploads.csv` says `private` and that YouTube Studio shows it as Private.
- [ ] A stream from a creator who is not in `permissions.md` is refused.

## Troubleshooting

- **"Sign in to confirm you're not a bot" or 403 errors:** run `update-tools`, then set `COOKIES_FROM_BROWSER=chrome` (or edge or firefox) in `.env`.
- **Urdu or Hindi captions show boxes:** set `"font"` in `config/channel.json` to a font that supports the script, e.g. `"Noto Nastaliq Urdu"` or `"Nirmala UI"` (Windows).
- **Transcription is slow:** use `WHISPER_MODEL=small` and `WHISPER_COMPUTE=int8`, or clip a shorter `--start/--end` range.
- **Upload limit reached:** the remaining clips stay approved. Run `upload` again the next day.
