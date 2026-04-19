# How to re-enable Workshop Audio (post-v1)

This document describes everything needed to put the Step 4 workshop audio
back into the app. The audio was disabled before the first App Store
submission to keep v1 small and remove audio-rights uncertainty.

---

## Status as of v1 submission

- 4 recordings currently sit in `SponsorGuide/.audio-staging/` (gitignored, ~98MB total)
- `SponsorGuide/assets/audio/` directory does **not** exist
- `WorkshopAudioPlayer.js` is in the code but its `RECORDINGS` array is empty
- The Workshop card in `Step4OverviewScreen.js` is commented out
- No references to `bbaworks.com`, presenter names, or the original source remain in the UI, data, or code
- `expo-audio` is still listed as a plugin in `app.json`

---

## Before you re-enable — checklist

- [ ] Audio rights fully cleared for every bundled track. Options:
   - Original recordings produced by you, with talent release on file; OR
   - Written permission from the original speaker/distributor, saved as a PDF/screenshot in a private folder
- [ ] Decide on hosting strategy:
   - **Bundled in app** (current approach) — simple but adds ~100MB to the install. Users download once; works offline forever.
   - **Streamed from CDN** — Railway volume, Cloudflare R2, or a public bucket. ~5MB install; audio streams on tap. Better UX, requires a hosted-file endpoint.
- [ ] Bump the app version (see version bump section below)

---

## Path A — bundle audio back in (fastest)

### 1. Move the files back

```bash
cd SponsorGuide
mkdir -p assets/audio
mv .audio-staging/*.m4a assets/audio/
```

### 2. Restore the `RECORDINGS` array

Open `SponsorGuide/src/components/WorkshopAudioPlayer.js` and replace the
empty `RECORDINGS = []` with the original:

```js
const RECORDINGS = [
  {
    title: 'Step 4 — First Column',
    subtitle: 'Listing resentments',
    file: require('../../assets/audio/STEP4_first_column_audio.m4a'),
  },
  {
    title: 'Step 4 — Second & Third Columns',
    subtitle: 'The cause & areas of self',
    file: require('../../assets/audio/STEP4_second_and_third_column_audio.m4a'),
  },
  {
    title: 'Step 4 — The Realization',
    subtitle: 'Seeing the other person as spiritually sick',
    file: require('../../assets/audio/STEP4_the_realization.m4a'),
  },
  {
    title: 'Step 4 — Fourth Column',
    subtitle: 'My part: self-seeking, selfish, dishonest, afraid',
    file: require('../../assets/audio/STEP4_fourth_column.m4a'),
  },
];
```

### 3. Re-enable the Step 4 card

Open `SponsorGuide/src/screens/Step4OverviewScreen.js`.

- Uncomment the import line at the top:
  ```diff
  - // import WorkshopAudioPlayer from '../components/WorkshopAudioPlayer'; // disabled for v1
  + import WorkshopAudioPlayer from '../components/WorkshopAudioPlayer';
  ```
- Remove the `{/* */}` wrapper around the Workshop card lower in the file.

### 4. Stop gitignoring the audio (optional)

If you want the audio files committed to git (not recommended — repo bloats fast), edit `.gitignore` at repo root and remove:

```
SponsorGuide/.audio-staging/
```

If you leave that line, git will keep ignoring `.audio-staging/` but will happily track the new `assets/audio/` copies. Recommended: leave gitignore alone. In CI/Railway-style builds you can restore audio via a pre-build script that pulls them from a private bucket.

### 5. Bump the version (see "version bump" section below)

### 6. Rebuild + ship

```bash
cd SponsorGuide
npx eas build --platform ios --profile production
npx eas submit --platform ios
```

TestFlight first, then submit for review.

---

## Path B — stream audio from a CDN (recommended long-term)

Bundled audio is simple but bloats the install and makes every update download the whole 100MB again. Streaming is better UX.

### 1. Upload the 4 files to a hosting service

Options in order of simplicity:
- **Railway volume** — mount a volume on your existing API service, serve `/audio/<file>.m4a` endpoints. Stays in your infrastructure.
- **Cloudflare R2** — free 10GB storage, free egress to Cloudflare, $0.015/GB egress otherwise. Fast, simple, no AWS pain.
- **AWS S3 + CloudFront** — the textbook answer, most complex.

### 2. Update `WorkshopAudioPlayer.js` to use URLs instead of `require`

```js
const RECORDINGS = [
  {
    title: 'Step 4 — First Column',
    subtitle: 'Listing resentments',
    url: 'https://cdn.yourdomain.com/audio/STEP4_first_column_audio.m4a',
  },
  // ...
];
```

And change the `useAudioPlayer` call to accept the URL instead of a local asset:
```js
const player = useAudioPlayer(item.url);
```

### 3. Handle offline / loading states

- Show a "Downloading…" indicator while the audio loads
- Optionally use `expo-file-system` to cache downloaded audio so repeat plays are instant

### 4. Rebuild as above (steps 5 and 6 from Path A)

---

## Version bump (required for every re-submission)

Every new build you upload must have a higher version than the last. Two fields to update in `SponsorGuide/app.json`:

| For | Field | Rule |
|---|---|---|
| iOS | `ios.buildNumber` | Increment every build (`"1"` → `"2"` → `"3"`) even if the user-facing version hasn't changed |
| iOS | `version` | Increment for user-facing releases (`"1.0.0"` → `"1.1.0"` when you add audio back) |
| Android | `android.versionCode` | Integer, increment every build (`1` → `2` → …) |
| Android | `version` | Same as iOS `version` |

If you used `eas.json`'s `"autoIncrement": true` in the production profile, build numbers auto-bump. You still need to manually bump `version` for user-visible releases.

---

## App Store listing "What's New" for the audio release

```
v1.1 adds the Step 4 workshop audio recordings — four tracks walking you
through the resentment inventory column by column. Tap a track on the Step
4 overview screen to listen while you work.
```

---

## Quick decision guide

| Situation | Path |
|---|---|
| You want to ship audio fast and the speaker rights are clean | Path A (bundle) |
| You have >2 recordings totaling >30MB, or you might add more later | Path B (CDN) |
| You want it to work offline forever with zero infra | Path A |
| You want small app downloads and can afford ~$5/mo hosting | Path B |

For this app, I'd do **Path A for v1.1** (ship audio fast, low effort) and **migrate to Path B for v1.2** (infrastructure improvement, invisible to users).
