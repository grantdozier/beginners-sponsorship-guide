# Sponsor Guide App — To Do

## Ship to App Store (in order)

### 1. Before anything else
- [ ] **Change your Expo password** — it was shared in chat earlier
- [ ] **Change your Apple ID password** — same reason
- [ ] **Rotate Railway Postgres password** — also shared earlier (Railway → Postgres → Variables → `PGPASSWORD` → Regenerate)

### 2. Host the privacy policy
Apple requires a publicly-visible URL for your privacy policy.

**Easiest option — GitHub Pages (free):**
- [ ] Go to `https://github.com/grantdozier/beginners-sponsorship-guide/settings/pages`
- [ ] Source: Deploy from a branch → `main` → `/ (root)` → Save
- [ ] Wait ~1 minute for the site to build
- [ ] Your policy will be live at `https://grantdozier.github.io/beginners-sponsorship-guide/PRIVACY`
- [ ] Verify the URL opens in a browser

### 3. Apple Developer setup
- [ ] **Apple Developer membership active** ($99/yr) → developer.apple.com/account
- [ ] **Find your Team ID** (developer.apple.com → Account → Membership Details) — copy to `credentials.local`
- [ ] **App Store Connect record:**
  - Go to appstoreconnect.apple.com → Apps → `+`
  - Platform: iOS
  - Name: `Beginners Sponsorship Guide`
  - Primary language: English (US)
  - Bundle ID: `com.grantdozier.sponsorguide` (matches `app.json`)
  - SKU: anything unique, e.g. `sponsor-guide-ios-1`

### 4. EAS login + project init (once)
Run in a terminal inside `SponsorGuide/`:

```bash
npx eas login
```

Enter your Expo credentials.

```bash
npx eas init
```

This creates an EAS project and writes a project ID into `app.json`
under `extra.eas.projectId`. Commit that change.

### 5. Build for iOS
```bash
npx eas build --platform ios --profile production
```

EAS will ask to log into your Apple account and generate certificates
automatically. Takes ~15-25 minutes. You get a `.ipa` download link when done.

### 6. Upload to App Store Connect
```bash
npx eas submit --platform ios
```

This uploads the `.ipa` to App Store Connect. Takes ~5 min.

### 7. App Store Connect — finish the listing
- [ ] **App Information** (left sidebar)
  - Category: `Health & Fitness` (primary), `Reference` (secondary optional)
  - Content rights: `Does your app contain, show, or access third-party content?` → No
  - Age rating: Answer the questionnaire honestly (the inventory content is
    "infrequent/mild" sexual content references since Step 4 sex inventory
    discusses relationships)
  - Privacy Policy URL: your GitHub Pages URL from step 2
- [ ] **Pricing & Availability** → Free, All countries
- [ ] **1.0 Prepare for Submission**
  - Screenshots (required, see step 8 below)
  - Description, keywords, support URL (your GitHub repo), promotional text
  - App Review Information: your contact email + short note
  - Version release: Automatically or Manually (your call)

### 8. Screenshots
Apple requires screenshots at specific sizes. Easiest way:
- Open the app in **Xcode iOS Simulator** (you have Android Studio but iOS needs Simulator — alternative is running in Expo Go on a physical iPhone and using AssistiveTouch screenshots)
- Alternatively, use a screenshot generator like `fastlane snapshot` or just take screenshots on a physical device

Required sizes for iPhone:
- 6.7" (iPhone 15 Pro Max / 14 Pro Max): 1290 × 2796 pixels
- 6.5" (iPhone 11 Pro Max / XS Max): 1242 × 2688 or 1284 × 2778
- 5.5" (iPhone 8 Plus): 1242 × 2208

Minimum 3 screenshots per size. Suggestions:
- Home / cover hero
- A step screen with a diagram (e.g. The Problem triangle)
- Resentment Inventory in edit mode
- Pair screen with a generated code
- Settings / your pairs list

### 9. Submit for review
Click **Submit for Review** in App Store Connect. Apple review typically
takes 1–3 days. If rejected, the reason is specific; fix and resubmit.

### 10. Google Play (parallel track)
- [ ] **Register** at play.google.com/console ($25 one-time)
- [ ] `npx eas build --platform android --profile production`
- [ ] `npx eas submit --platform android` (you'll need to create the Play Console app record first)
- [ ] Fill in listing: screenshots, short/long description, privacy policy URL, target age

---

## Known follow-ups (post-launch, not blockers)

- Move the 98MB workshop audio to CDN (Cloudflare R2 / S3) and stream instead
  of bundling
- Add step-level progress badges on Home inventory cards
- Add push notifications when sponsee shares (Phase 4.5 in PLAN.md)
- "Delete my account" flow in Settings (API endpoint exists, UI not built yet)
- Onboarding polish — maybe an intro screen explaining what the app does

---

## Useful links

- Expo dashboard: expo.dev
- Apple developer portal: developer.apple.com
- App Store Connect: appstoreconnect.apple.com
- Google Play Console: play.google.com/console
- EAS Build docs: docs.expo.dev/build/introduction
- Railway dashboard: railway.com
