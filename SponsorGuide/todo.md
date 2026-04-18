# Sponsor Guide App — To Do

## Before You Can Publish

### Apple (iOS App Store)

- [ ] **Change your Expo and Apple passwords** — they were shared in plain text in chat
- [ ] **Find your Apple Team ID**
  - Go to developer.apple.com → Account → Membership Details
  - Copy the Team ID (looks like: `A1B2C3D4E5`)
  - Paste it into `credentials.local` under `APPLE_TEAM_ID`
- [ ] **Apple Developer account** — $99/year subscription
  - Already have an account at developer.apple.com
  - Make sure your membership is active before submitting

### Android (Google Play Store)

- [ ] **Register for Google Play Console** — one-time $25 fee
  - Go to play.google.com/console
  - Sign up with a Google account
  - Pay the $25 registration fee
  - Fill in `credentials.local` with your Google Play email
- [ ] **Create a Google Service Account key** for automated submissions (EAS handles this — it will prompt you when the time comes)

---

## When You're Ready to Build & Submit

### Step 1 — Set up EAS (Expo Application Services)

Run this once inside the `SponsorGuide` folder:

```bash
npx eas login
```

Enter your Expo username and password from `credentials.local`.

Then initialize EAS for the project:

```bash
npx eas build:configure
```

This creates an `eas.json` file in your project. Commit that file — it's not sensitive.

### Step 2 — Build for iOS

```bash
npx eas build --platform ios
```

EAS will walk you through:
- Connecting your Apple Developer account
- Creating certificates and provisioning profiles automatically
- Building on Expo's cloud servers (no Mac needed)

The build takes about 15–20 minutes. You'll get a download link when done.

### Step 3 — Submit to App Store

```bash
npx eas submit --platform ios
```

This uploads your build to App Store Connect. You'll then go to appstoreconnect.apple.com to:
- Add screenshots
- Write the app description
- Set the category (Health & Fitness or Books)
- Submit for Apple review (takes 1–3 days)

### Step 4 — Build for Android

```bash
npx eas build --platform android
```

### Step 5 — Submit to Google Play

```bash
npx eas submit --platform android
```

---

## App Development To Do

- [ ] Test the app on iOS with `npx expo start --tunnel` (fixes QR code issues on different networks)
- [ ] Add the app icon (`assets/icon.png` — 1024x1024px)
- [ ] Add the splash screen (`assets/splash.png`)
- [ ] Update `app.json` with the app name, bundle ID, and version
- [ ] Consider adding a `Step 12` screen (currently using generic screen)
- [ ] Consider adding the QR code link to bbaworks.com as a tappable link in the Step 4 screen

---

## Useful Links

- Expo dashboard: expo.dev
- Apple developer portal: developer.apple.com
- App Store Connect: appstoreconnect.apple.com
- Google Play Console: play.google.com/console
- EAS Build docs: docs.expo.dev/build/introduction
