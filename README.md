# 🗃️ XMA Eve Filter — *hide anti-Eve mods from search*

Tired of searching [XIV Mod Archive](https://www.xivmodarchive.com) (XMA) for `"eve"` and getting buried in irrelevant mods that mention Eve only to say *"no Eve ports allowed"*? This userscript greys those out (or hides them entirely) automatically, so you only see mods that actually support Eve.

## 🙈 What it does

- Scans each result on xivmodarchive.com
- Greys out mods whose description excludes Eve *(e.g. "no Eve", "except Eve", "do not port to Eve", bulleted body blocklists, etc.)*
- Keeps mods made for Eve — *can optionally ignore non-gear mods (hair, minions, etc.) since their Eve stance doesn't affect a gear search (tweakable)*
- Supports an author whitelist (always show) and blacklist (always hide)

## 💽 Install

1. Install the [Tampermonkey](https://www.tampermonkey.net) extension (Chrome/Firefox/Edge)
2. Click the install link: **[xma-eve-filter.user.js](https://raw.githubusercontent.com/goosemasseuse/xma-eve-filter/main/xma-eve-filter.user.js)**
3. Tampermonkey opens an install prompt — confirm it
4. Go to XMA, search `eve`, done — flagged mods show dimmed with a *"Hidden: excludes Eve"* label

Installed this way, it updates itself automatically when a new version is published. ✨

## 🔧 Tweaking it — *(optional)*

I'd recommend not messing with it unless you understand what you're doing, but you're free to, by editing these values at the top of the script:

| Setting | What it does |
|---|---|
| `REMOVE` | `true` deletes flagged cards entirely instead of dimming them *(default `false`)* |
| `AUTHOR_WHITELIST` | Eve creators to **always show**. Add a name exactly as it appears after "By:" on the mod card, in quotes, e.g. `'Nyaughty',` |
| `AUTHOR_BLACKLIST` | Known anti-Eve authors to **hide instantly**. Same format. |
| `GEAR_ONLY` | `false` (default) filters every mod type; `true` only filters gear mods |
| `ENABLE_AUTHOR_BLACKLIST` / `ENABLE_PATTERN_BLOCKING` | should both remain on; flip either to `false` to turn that part off in special cases, note that this will weaken filtering |

## ℹ️ Good to know

- It dims rather than deletes by default, so you can spot-check it
- It caches results, so repeat searches are fast and it stays light on the site, we want to be good neighbours
- Any mods with authors on the whitelist or blacklist are automatically filtered without an additional background fetch and mod description check - for the sake of efficiency and good neighbourliness to XMA
- ⚠️ **Updating overwrites your edits** — if you customise the lists, keep a copy of your additions to re-paste after an update
- It's not perfect — a few oddly-worded ones may slip through *(just blacklist that author)*, and if a good Eve mod ever gets wrongly greyed, drop the author in the whitelist

## License

[MIT](LICENSE) — free to use, modify, and share.
