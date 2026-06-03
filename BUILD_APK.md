# Building an APK

Two paths. Pick by how much setup you want to do.

## EAS Build (cloud)

This is what I use. No local toolchain needed.

```bash
npm install -g eas-cli
eas login
eas build:configure          # one-time, creates eas.json
eas build --platform android --profile preview
```

The first command does a one-time Expo CLI install and login. The
`build:configure` step generates an `eas.json` if you don't have one
(you do, the repo includes one). The `build` step uploads your
source to Expo's build farm, runs Gradle, and gives you a download
link when it finishes. ~10 minutes.

You need an Expo account (free) but not a paid Apple/Google
developer account for Android preview builds.

## Local Gradle

If you'd rather build on your own machine:

**Prereqs:** JDK 17, Android SDK (any version ≥ 34), and optionally
Android Studio. On macOS, `brew install --cask zulu@17` plus Android
Studio handles it.

```bash
npm install
npx expo prebuild --platform android    # one-time, writes android/
cd android
./gradlew assembleDebug
```

The APK lands at `android/app/build/outputs/apk/debug/app-debug.apk`.
This is a **debug** build signed with the default debug key — fine
for sideloading, won't pass Play Store review. For a release build
you'll need to set up a signing config in `android/app/build.gradle`
and run `assembleRelease` instead.

The first build downloads Gradle, the Android Gradle Plugin, and all
the dependency packages, so it can take 15-20 minutes on a cold
cache. Subsequent builds are much faster.

## iOS

Same idea but Xcode required (macOS only). `eas build --platform
ios --profile preview` is the path of least resistance. Local
builds need a real Apple Developer signing identity.

## Verifying the build before you commit to it

```bash
npm run typecheck
npm run lint
npm run build:web     # web bundle as a smoke test for the Metro config
```

If those pass locally, the EAS build will pass too.

## Troubleshooting

**`expo prebuild` regenerates files I had hand-edited.**
That's expected. `expo prebuild` is meant to be re-runnable. If you
need persistent native changes, use a config plugin instead of
editing `android/` directly.

**Gradle download times out.**
Either try again on a better connection, or use EAS Build, which
sidesteps this entirely.

**`adb: no devices/emulators found`.**
The APK was built; you just don't have a device to install it on.
Connect an Android phone with USB debugging enabled, or start an
emulator from Android Studio.
