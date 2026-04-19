# App Store Submission Status

**Version:** 1.0.0 (build 1)
**Platforms:** iOS primary · Android later
**Last updated:** 2026-04-18

This is the running checklist for shipping to the App Store and Google Play.
Anything with `✅` is done. Anything with `⏳` is in progress or waiting on
something external. Anything with `❌` is missing.

---

## App identity

| Field | Value | Status |
|---|---|---|
| App name | Beginners Sponsorship Guide | ✅ |
| Subtitle | Step 4 with your sponsor | ✅ |
| Bundle identifier | `com.grantdozier.sponsorguide` | ✅ in `app.json` |
| Version | `1.0.0` | ✅ in `app.json` |
| iOS build number | `1` | ✅ in `app.json` |
| Android versionCode | `1` | ✅ in `app.json` |
| Copyright | `© 2026 Grant Dozier` | ✅ in App Store Connect |

---

## Public URLs (GitHub Pages)

All live at `https://grantdozier.github.io/beginners-sponsorship-guide/`

| URL | Purpose | Status |
|---|---|---|
| `/` | Landing page, points to privacy & age suitability | ✅ live |
| `/PRIVACY` | Privacy policy (required by Apple) | ✅ live |
| `/AGE_SUITABILITY` | Explains 18+ rating (Age Suitability URL field) | ✅ live |

---

## App Store Connect — what's filled in

### App Information tab

| Field | Value | Status |
|---|---|---|
| Name | Beginners Sponsorship Guide | ✅ |
| Subtitle | Step 4 with your sponsor | ✅ |
| Bundle ID | Selected from dropdown | ✅ |
| SKU | `sponsor-guide-ios-1` | ✅ |
| Primary language | English (U.S.) | ✅ |
| Primary category | Health & Fitness | ✅ |
| Secondary category | Reference | ✅ |
| Privacy Policy URL | `.../PRIVACY` | ✅ |
| Age Suitability URL | `.../AGE_SUITABILITY` | ✅ |
| Content Rights | Contains third-party content, attested we have rights | ✅ *(see risk note below)* |

### Age Rating

Final rating: **18+** (Apple's 2025 renamed system — formerly 17+)

Rationale:
- Alcohol / drug references: **Frequent/Intense** (recovery is the whole topic)
- Mature / suggestive themes: **Infrequent/Mild** (Sex Conduct Inventory prompts)
- Medical/treatment info: **Infrequent/Mild** (Doctor's Opinion excerpts)
- Everything else: **None**
- Age assurance methods: **None**
- User-generated content: **Yes** — shared only with paired partner, block via Unpair, report via support email

### 1.0 Prepare for Submission tab

| Field | Status |
|---|---|
| Promotional text | ✅ filled |
| Description | ✅ filled |
| Keywords | ✅ filled |
| Support URL | ✅ (GitHub Pages root) |
| Marketing URL | ⬜ (optional, left blank) |
| What's New (1.0) | ✅ filled |
| Screenshots — 6.9" / 6.5" iPhone | ❌ **required before submit** |
| App icon (1024×1024) | ✅ bundled in `assets/icon.png` |
| App Review Notes + contact | ⬜ to fill at submit time |

### Agreements / banking

| Item | Status |
|---|---|
| Apple Developer Program License Agreement | ✅ signed on enrollment |
| Free Apps Agreement | ⬜ confirm signed in "Agreements, Tax, and Banking" |
| Paid Apps / Banking / Tax forms | N/A — app is free |

### App Encryption

| Declaration | Value | Status |
|---|---|---|
| `ITSAppUsesNonExemptEncryption` | `false` | ✅ in `app.json` infoPlist |
| Uses only standard OS encryption (HTTPS / TLS) | ✅ no custom crypto |
| French export docs required | No |

---

## EAS / build setup

| File | Status |
|---|---|
| `SponsorGuide/app.json` | ✅ bundle ID, version, splash, plugins configured |
| `SponsorGuide/eas.json` | ✅ development / preview / production profiles |
| `credentials.local` | ⏳ waiting on `APPLE_TEAM_ID` |
| `extra.eas.projectId` in `app.json` | ❌ **still `REPLACE_AFTER_EAS_INIT`** — populated by `npx eas init` |
| EAS login from local machine | ❌ not done yet |
| Distribution certificate & provisioning profile | ❌ EAS auto-generates on first iOS build |

---

## Backend (Railway)

| Item | Value | Status |
|---|---|---|
| Project | `eloquent-charm` | ✅ |
| Postgres service | running, 5 tables migrated | ✅ |
| API service | auto-deploy from `main` branch, root dir `api/` | ✅ |
| Production URL | `https://beginners-sponsorship-guide-production.up.railway.app` | ✅ healthy |
| Healthcheck | `/healthz` returns `{"ok":true}` | ✅ |

---

## What's missing (blockers for submission)

1. ❌ **Apple Team ID** — 10-char string from developer.apple.com → Account → Membership Details. Needed for EAS build signing.
2. ❌ **Screenshots** — minimum 3 iPhone screenshots (6.9" recommended). Take via Expo Go on physical iPhone (side button + volume up).
3. ❌ **EAS project initialization** — run `npx eas init` inside `SponsorGuide/`. Commits the generated `projectId`.
4. ❌ **First iOS build** — `npx eas build --platform ios --profile preview` to get a TestFlight-installable `.ipa`.
5. ⏳ **Content rights verification** — ethically and legally we should have:
   - Written permission from Bobby (short email reply saved)
   - Decision on bundled workshop audio:
     - Get permission from bbaworks rightsholders, OR
     - Remove audio before production build
   - Big Book excerpts are short quotations, defensible as fair use

---

## Risk notes

| Risk | Severity | Mitigation |
|---|---|---|
| No written permission from Bobby yet | Medium | Email him — one-paragraph "I built this for the fellowship, you're good?" note. Screenshot the reply. |
| Bundled 98MB of workshop audio without rights | **High** | Either get permission from bbaworks, or strip before submitting. The audio is not required for the app to function. |
| App name / description uses "AA" and "Big Book" | Low | Privacy/About section already states "not affiliated with Alcoholics Anonymous World Services, Inc." |
| 98MB download is large for an app | Medium | Move audio to CDN later; won't block v1 launch. |

---

## The exact command sequence to build & submit

Once the above blockers are cleared, in a terminal inside `SponsorGuide/`:

```bash
# One-time
npx eas login            # use Expo credentials
npx eas init             # writes projectId into app.json — commit it

# Every time you want a new build
npx eas build --platform ios --profile preview   # TestFlight-installable
# (test on your iPhone via TestFlight → fix anything broken → bump build number)
npx eas build --platform ios --profile production

# When ready to ship
npx eas submit --platform ios    # uploads to App Store Connect
# then in App Store Connect: Submit for Review
```

---

## After v1 ships (not blockers)

- Move audio files off the bundle, serve from CDN or backend
- Push notifications when sponsee shares new inventory
- Step-level progress badges on home inventory cards
- "Delete my account" flow in Settings UI
- PDF export of inventory
- Google Play parallel track (`--platform android`, $25 Play Console registration)

---

## Useful links

- App Store Connect: https://appstoreconnect.apple.com
- Apple Developer Portal: https://developer.apple.com
- Expo dashboard: https://expo.dev
- Railway dashboard: https://railway.com
- GitHub Pages: https://grantdozier.github.io/beginners-sponsorship-guide/
- Live API: https://beginners-sponsorship-guide-production.up.railway.app/healthz
