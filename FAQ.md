# FAQ

Stuff I or other people have actually run into. Not a marketing page.

## Running it

**`npm run web` opens on which port?**
8081 by default (Expo Metro). If that's taken, the terminal will show
the actual port. Just click whatever link it prints.

**The dev server says "EMFILE: too many open files" on macOS.**
Bump the file descriptor limit:
```bash
ulimit -n 65536
```
Then restart `npm run web`.

**TypeScript complains about missing types after `npm install`.**
`npm run typecheck` should be the only thing that knows. If it fails
on a fresh install, `rm -rf node_modules package-lock.json && npm install`
usually fixes it.

**Does the dev server work offline?**
Yes, once the first install is done. Web Audio and other browser APIs
still need the browser to be online the first time they fetch.

## Building

**APK is taking forever.**
First build downloads Gradle + Android dependencies. ~20 minutes on a
good connection. Subsequent builds are ~3 minutes.

**iOS build fails with "No code signing identities found".**
EAS handles this with its own credentials; for local builds, you need
an Apple Developer account. Use EAS Build if you can.

**EAS Build keeps timing out.**
The free tier has a 30-minute limit. If your first build includes
`expo prebuild`, you might hit it. Run prebuild once locally to
materialise the `android/` directory, commit it, then `eas build` will
just be the gradle step.

## Data

**Where is my data?**
AsyncStorage, keyed under a single root. On web that's
`localStorage["taskflow-storage"]`. Don't clear site data unless you
mean it.

**I cleared my browser data and lost everything. Help.**
Sorry, that one is on me not shipping export-by-default yet. Open
Settings → Data → Export before you do anything destructive, and
import on the other end.

**Can two devices sync?**
Not yet. The data model is set up for it (every persisted object has
`updatedAt`), but no server side. It's the next big thing.

## Things that look like bugs but aren't

**Search history disappears when I close the app.**
This is a known UX gap — search history lives in component state
because the store doesn't have a `searchHistory` slice yet. It's on
the list. Workaround: don't close the app, or live with it.

**TaskCard shows "今天" / "明天" on a date that's clearly in the past.**
The overdue logic only fires if the task has a `dueTime` and the
current time is past it. Date-only tasks don't trigger the overdue
state. I think this is the right call (a task "due today" isn't
overdue at 9am) but it surprises people.

**Voice input is greyed out on mobile.**
Voice input uses the Web Speech API, which is Web-only. Native would
need `@react-native-voice/voice` or similar, and I don't want to
balloon the APK for a feature most people use once. If you need it,
PRs welcome.
