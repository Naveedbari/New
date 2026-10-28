# Postiz + n8n: schedule videos to YouTube / TikTok / Instagram

Free, self-hosted alternative to Buffer/Blotato. n8n downloads a video, uploads it to your
Postiz instance, and schedules it to every connected channel you pick.

`Start → Config → Download Video → Upload Video to Postiz → Get Integrations → Build Post → Schedule Post`

## Setup
1. Self-host Postiz (e.g. via Coolify on a VPS: https://docs.postiz.com) and connect your
   YouTube / TikTok / Instagram channels in its UI.
2. Postiz → **Settings → Public API** → reveal and copy the API key.
3. n8n → **Import from file** → `postiz-schedule-video.json`.
4. Create a **Header Auth** credential named `Postiz API`:
   - Name: `Authorization`
   - Value: your API key (no `Bearer` prefix)
   Select it in the 3 Postiz HTTP nodes.
5. Edit the **Config** node:
   | field | meaning |
   |---|---|
   | `postizUrl` | your Postiz domain, no trailing slash |
   | `videoUrl` | public URL of the .mp4 |
   | `title` | YouTube title |
   | `caption` | post text / description |
   | `platforms` | comma list of Postiz identifiers: `youtube`, `tiktok`, `instagram`, `instagram-standalone` |
   | `delayHours` | schedule this many hours from now (24 = tomorrow) |
   | `youtubeVisibility` | `public`, `unlisted` or `private` |
6. Run it. The post appears in the Postiz calendar.

## Using it in a real automation
Replace **Start** with a Schedule / Webhook / Google Sheets trigger and set the Config fields
from expressions (e.g. `{{ $json.videoUrl }}`).

## Adding platforms
Add an entry to the `settings` map in the **Build Post** node keyed by the Postiz
identifier (e.g. `linkedin`, `x`, `bluesky`). If Postiz rejects a post, check that
provider's settings fields in the Postiz public API docs — they change between versions.

## Editing
`build.cjs` generates the workflow JSON and self-tests the Build Post code:
`node build.cjs` (prints `ok`).
