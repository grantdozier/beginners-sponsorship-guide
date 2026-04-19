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
| Apple Team ID | `67NB48YDBQ` | ✅ in `app.json` + `credentials.local` |
| Apple Developer enrollment | Individual (Apple Developer Program) | ✅ |
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
| Screenshots — 6.9" / 6.5" iPhone | ✅ 3 screenshots in `SponsorGuide/store-assets/screenshots/` (IMG_9415, 9416, 9417) |
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

1. ✅ **Apple Team ID** — `67NB48YDBQ`, enrolled as Individual
2. ✅ **Screenshots** — 3 captured, in `SponsorGuide/store-assets/screenshots/`
3. ✅ **Bobby's approval** — verbal approval obtained (recorded here as attestation)
4. ❌ **EAS project initialization** — run `npx eas init` inside `SponsorGuide/`. Commits the generated `projectId`.
5. ❌ **First iOS build** — `npx eas build --platform ios --profile preview` to get a TestFlight-installable `.ipa`.
6. ⏳ **Workshop audio decision** — still bundled in the app. Either get permission from bbaworks rightsholders, or remove before production build. Not required for app functionality.
7. ⏳ **Listing copy pasted into App Store Connect** — see section below

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

## Listing copy (paste-ready)

### Name (max 30 chars)
```
Beginners Sponsorship Guide
```

### Subtitle (max 30 chars)
```
Step 4 with your sponsor
```

### Promotional Text (max 170 chars — can be changed later without review)
```
A digital companion for Bobby's Beginners Sponsorship Guide. Work Step 4 with your sponsor — writable inventories, share when you're ready, private by default.
```

### Description (max 4000 chars)
```
A free digital companion to the paper Beginners Sponsorship Guide by Bobby. Built for the AA community — for people who have completed the 12 steps and are now ready to sponsor others.

THE GUIDE
The full 60-page guide, digitized. Big Book passages for each step with tap-to-read excerpts. The Problem and Solution diagrams, Step One through Step Twelve illustrations, the Spiritual Arch, and the "Our Way of Life" diagram — all redrawn as crisp vector graphics.

WRITABLE INVENTORIES
The Resentment Inventory, Fear Inventory, and Sex Conduct Inventory are fully writable, laid out the way Bobby designed them:
• Resentment Inventory — four columns, seven areas of self, three belief/fear pairs per area, and the full column four (Realization, Self-Seeking, Selfish, Dishonest, Afraid, Harm).
• Fear Inventory — chain the fears underneath your fears until you reach the root.
• Sex Conduct Inventory — relationship history plus the nine questions from the Big Book, page 69.
• Future Sex Ideal — build your "God, in the future I would like to be…" list.

SPONSOR + SPONSEE
Link with your sponsor (or sponsee) using a simple 6-character code — no email, no passwords. When the sponsee is ready, they tap "Share" and the sponsor can read the inventory from their own phone. Mark resentments and relationships as "Reviewed together" so you always know where you left off between sessions.

PRIVACY
Your inventory content is private by default. It only becomes visible to a sponsor after you tap Share. No ads. No analytics. No email or phone number required. You can delete your account and all data from Settings at any time.

ACKNOWLEDGMENT
This app is not affiliated with, endorsed by, or sponsored by Alcoholics Anonymous World Services, Inc. The 12 Steps and the Big Book are the property of A.A.W.S.

The Beginners Sponsorship Guide was written by Bobby as a service to the fellowship. This app is a community effort to make it more accessible. See ya in the trenches.
```

### Keywords (max 100 chars total, comma-separated, no spaces)
```
sponsorship,aa,sobriety,step 4,inventory,recovery,sponsor,sponsee,12 steps,big book,alcoholic
```

### Support URL
```
https://grantdozier.github.io/beginners-sponsorship-guide/
```

### Marketing URL (optional — leave blank)

### What's New in This Version (release notes for 1.0)
```
Welcome to the first release. The complete Beginners Sponsorship Guide by Bobby, with writable Step 4 inventories and sponsor/sponsee sharing.
```

### Copyright
```
© 2026 Grant Dozier
```

### App Review Notes
```
This app is a free, community-service tool built for members of Alcoholics Anonymous. It digitizes a paper workbook by an AA member ("Bobby") for taking a sponsee through Step Four of the 12-step program.

No sign-in is required. On first launch the user picks a display name; an anonymous device UUID is used as identity.

Two users can optionally link via a 6-character code to share Step Four inventory content between sponsor and sponsee. Pairing, inventories, and progress markers live on our Railway-hosted backend (beginners-sponsorship-guide-production.up.railway.app) over HTTPS only.

No ads, no third-party SDKs, no tracking.

The original author of the paper Beginners Sponsorship Guide ("Bobby") has given verbal approval for this app as a free, non-commercial service to the fellowship.
```

### App Review Contact
- **First name:** Grant
- **Last name:** Dozier
- **Phone:** _(your phone)_
- **Email:** `operator@doziertechgroup.com`

### Demo account
Not required — no sign-in in the app.

---

## Useful links

- App Store Connect: https://appstoreconnect.apple.com
- Apple Developer Portal: https://developer.apple.com
- Expo dashboard: https://expo.dev
- Railway dashboard: https://railway.com
- GitHub Pages: https://grantdozier.github.io/beginners-sponsorship-guide/
- Live API: https://beginners-sponsorship-guide-production.up.railway.app/healthz
