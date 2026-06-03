# Quick start

Three paths. Pick the one that matches your patience and machine.

## Web (fastest)

```bash
npm install
npm run web
```

Open the URL it prints (usually `http://localhost:8081`). Done. Full
feature set, no emulator, no signing.

For a deployable bundle:

```bash
npm run build:web   # writes dist/
```

The `dist/` directory is a static SPA. Drop it on any host (GitHub
Pages, Netlify, Vercel, S3 + CloudFront). See the deploy workflow
under `.github/workflows/deploy-web.yml` for how I ship it to GitHub
Pages.

## Mobile, no build (Expo Go)

Install [Expo Go](https://expo.dev/client) on your phone (Android or
iOS). Make sure the phone is on the same Wi-Fi as your dev machine.

```bash
npm install
npm start
```

Scan the QR code from the terminal with Expo Go. The app boots with
hot reload. Good enough for testing on real hardware.

## Native binary (APK / IPA)

Two options.

**EAS Build (cloud, no local toolchain).** Sign up at expo.dev, then:

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
```

You'll get a download link when the build finishes. ~10 minutes.
Needs an Expo account but not a developer account.

**Local Gradle / Xcode.** Run `npx expo prebuild --platform android`
once to materialise the `android/` directory, then `cd android &&
./gradlew assembleDebug`. APK lands at
`android/app/build/outputs/apk/debug/app-debug.apk`. For iOS the
equivalent needs Xcode and a developer signing identity.

Local builds need:
- JDK 17 (Android)
- Xcode 15+ (iOS, macOS only)
- Android Studio is optional but the SDK manager is convenient

## Verifying your install

```bash
npm run typecheck   # 0 errors expected
npm run lint        # 0 errors expected
npm run build:web   # should complete in ~30s
```

If any of these fail on a fresh install, see [FAQ.md](FAQ.md).
