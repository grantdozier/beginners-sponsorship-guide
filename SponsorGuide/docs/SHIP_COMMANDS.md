# Ship Commands — iOS & Android

Every command you need to build and publish the app, with the order you run
them and what each one does. All commands run from inside `SponsorGuide/`.

---

## One-time setup (already done for v1)

```bash
npx eas login
```
Logs into your Expo account. Prompts for username + password (from
`credentials.local`). If you have 2FA, also prompts for a code. Credentials
are cached locally — you won't be asked again unless you log out.

```bash
npx eas init
```
Creates an EAS project under your Expo account and writes
`extra.eas.projectId` into `app.json`. Only run once per repo. Already
done — the project ID is `c02a011f-0f1e-4a96-9d4c-badb0a5a5735`.

---

## The ship cycle (every release)

### 1. Bump the version (for user-facing releases)

Edit `SponsorGuide/app.json`:
- Bump `version` (e.g. `"1.0.0"` → `"1.1.0"`). This is what users see.
- **Don't** manually touch `buildNumber` or `versionCode` — `autoIncrement: true`
  in `eas.json` handles those automatically per build.

### 2. Build

```bash
npx eas build --platform ios --profile production
```
Kicks off an iOS build on Expo's Mac servers. Takes ~12–18 min. Produces a
signed `.ipa` ready for the App Store. EAS auto-increments `buildNumber`
before each run.

Watch progress at: <https://expo.dev/accounts/grantdozier/projects/beginners-sponsorship-guide/builds>

For Android later:
```bash
npx eas build --platform android --profile production
```

### 3. Upload to App Store Connect

```bash
npx eas submit --platform ios
```
Pushes the finished `.ipa` to App Store Connect. Prompts:
- "Which build to submit?" → pick the latest (`1.0.0 (N)` where N is the
  highest build number).
- Apple ID + app-specific password (generate at <https://appleid.apple.com>
  → Sign-In and Security → App-Specific Passwords if you use 2FA).

Takes 2–3 min to upload. Apple then spends 5–20 min "Processing" the build
before it appears in App Store Connect.

For Android:
```bash
npx eas submit --platform android
```

### 4. Finish in App Store Connect (web UI, not a command)

<https://appstoreconnect.apple.com/apps/6762534776/distribution/ios/version/inflight>

- **Build section** → click `+` → pick the new build → Save
- Top-right → **Add for Review** → **Submit for Review**

Apple review takes 1–3 days.

---

## Maintenance commands

### Validate project config
```bash
npx expo-doctor
```
Runs 17 checks on dependencies, Expo config, and native setup. Catches
version drift and missing peer deps. Run this before every build — fail
fast locally instead of waiting 15 min for EAS to fail the same check.

### Fix dependency version drift
```bash
npx expo install --fix
```
Aligns every Expo-managed package to the versions your current Expo SDK
expects. Safe to run any time packages feel "off."

### Install a new Expo-compatible package
```bash
npx expo install <package-name>
```
Unlike plain `npm install`, this picks the version that matches your Expo
SDK. Always use this for anything from the `expo-*` family or any native
module.

### Regenerate the app icons
```bash
node scripts/generate-icons.mjs
```
Re-renders `icon.png`, `adaptive-icon.png`, `splash-icon.png`, and
`favicon.png` from the SVG definitions inside the script. Edit the SVG
strings in the script to change the icon.

---

## Local dev (not release)

### Run the app with hot-reload
```bash
npx expo start
```
Press `a` to open on Android emulator, `i` on iOS simulator (Mac only), or
scan the QR code in Expo Go on your phone.

### Same but via tunnel (for phones not on same WiFi)
```bash
npx expo start --tunnel
```
Routes through Expo's servers. Slower but works everywhere.

### Reload the running app
Press `r` in the Expo terminal.

---

## Rollback / re-try commands

### See all your builds
<https://expo.dev/accounts/grantdozier/projects/beginners-sponsorship-guide/builds>

### Cancel a build in progress
Click the build in the dashboard → top-right → **Cancel build**. Or just
let it finish — no cost either way.

### Re-submit a previous build
```bash
npx eas submit --platform ios
```
Pick the older build from the list. Works as long as its version number
is higher than anything Apple already has.

### Download the `.ipa` directly
From the build page → **Download** button. Useful for sideloading with
`cfgutil` or sharing with a Mac-equipped tester.

---

## Credentials & secrets

Stored locally in `SponsorGuide/credentials.local` — gitignored, never in
the repo. Contains:
- Expo username + password
- Apple ID + app-specific password
- Apple Team ID (`67NB48YDBQ`)
- Bundle identifier (`com.grantdozier.sponsorguide`)

EAS also stores managed credentials (certs, provisioning profiles) in
Expo's cloud. To view/manage:
```bash
npx eas credentials
```

---

## Version bump cheat sheet

| What changed | iOS `buildNumber` | iOS `version` | Android `versionCode` | Android `version` |
|---|---|---|---|---|
| Any rebuild (bug fix, icon, same feature set) | auto-bumps | unchanged | auto-bumps | unchanged |
| User-visible feature release (1.0.0 → 1.1.0) | auto-bumps | **edit manually** | auto-bumps | **edit manually** |
| Major release (1.x → 2.0.0) | auto-bumps | **edit manually** | auto-bumps | **edit manually** |

Both platforms share the same `version` field in `app.json` (`"version": "1.1.0"`).

---

## Quick reference — the golden path

```bash
# 1. Validate
npx expo-doctor

# 2. Build
npx eas build --platform ios --profile production

# 3. Upload
npx eas submit --platform ios

# 4. Go to App Store Connect → attach build → Submit for Review
```

That's it. Four steps. Everything else is just filling in listing fields
in the web UI (one-time) or waiting on Apple (1–3 days).
