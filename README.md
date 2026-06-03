<div align="center">

# TaskFlow

A local-first, cross-platform task manager built with React Native + Expo.

[Live web demo](https://badhope.github.io/TaskFlow/) · [Report a bug](https://github.com/badhope/TaskFlow/issues) · [Request a feature](https://github.com/badhope/TaskFlow/issues)

</div>

---

## Why this exists

I wanted a todo app I could actually use on the train (no network), on my
laptop (full keyboard), and on my phone (swipe to dismiss) without
maintaining three codebases. TaskFlow is the result. The interesting
parts, in my opinion:

- **One codebase, three targets.** Same React Native code runs on Web,
  Android, and iOS. Platform-specific code is only ever a feature
  detection (Web Audio, Vibration, etc.), never a fork.
- **Local-first.** All data lives in AsyncStorage. The app boots and
  works offline, with no account, no server, no tracking. Sync is on
  the roadmap, not in the codebase.
- **Draggable reordering without reanimated.** PanResponder +
  LayoutAnimation is enough for the kind of lists a todo app has, and
  the bundle is ~30% smaller for it.
- **AI suggestions are statistical, not magical.** They look at your
  completion history (which hours you actually work in, which category
  you default to, which tasks you keep deferring) and surface that as
  a one-tap action. No model weights, no API.

## Screens

| | | |
|---|---|---|
| Home — task list, AI suggestions, reorder | Task detail — subtasks, comments, deps, mentions | Calendar — week / month / time block |
| Analytics — completion trends, category mix | Goals + Habits — quantitative + streak tracking | Search — global, with history |
| Projects, Categories, Tags, Views, Templates, Automation | Notes — markdown | Settings — theme, data, export/import |

(Fifteen screens in total. See `screens/`.)

## Tech stack

- React Native 0.73 + Expo 50
- TypeScript 5 in strict mode
- Zustand 4 for state, with a custom AsyncStorage persistence layer
- React Navigation v6 (bottom tabs + nested stacks)
- Material Icons (no emoji in the UI)
- ESLint v9 flat config + typescript-eslint v8

## Running it

```bash
npm install
npm run web      # fastest path — opens http://localhost:8081
npm run android  # needs Android Studio or a device
npm run ios      # needs macOS + Xcode
```

To produce a deployable web bundle:

```bash
npm run build:web   # writes dist/, ready for GitHub Pages / Netlify / Vercel
```

## Project layout

```
App.tsx                          # entry, wraps everything in an ErrorBoundary
screens/                         # 15 screens, one file each
src/shared/
  components/common/             # ~20 reusable bits (Button, TaskCard, ...)
  components/views/              # the six non-list views (Kanban, Gantt, ...)
  hooks/                         # useBulkSelection, useKeyboardShortcuts, useUndo
  store/index.ts                 # Zustand store, ~1100 lines
  types/index.ts                 # every persisted shape lives here
  utils/                         # natural-language date parser
```

I kept the screens and components in separate top-level directories on
purpose — `screens/` is route-level (one screen per file, large, allowed
to know about navigation), `src/shared/components/` is leaf-level
(presentational, no nav imports).

## Quality bar

```bash
npm run typecheck   # tsc --noEmit, should be 0 errors
npm run lint        # ESLint v9 flat config, 0 errors expected
```

I aim for "0 errors" on both. Warnings are downgraded on the legacy `any`
sprawl that the prototype phase left behind — fixing them is an open
issue, not a blocker.

## Deployment

The repo ships four GitHub Actions:

- `verify.yml` — typecheck + lint on every push
- `build-android.yml` — APK build artifact
- `eas-build.yml` — EAS Cloud Build
- `deploy-web.yml` — exports the web bundle, injects cache-busting query
  params, and publishes to GitHub Pages

`deploy-web.yml` has a workaround for Fastly's CDN caching the first 404
response on a fresh deploy — see the `Inject no-cache meta + cache-buster`
step for the gory details. PRs welcome if anyone has a cleaner answer.

## Known caveats

- The web build is a single SPA bundle (~5.5 MB unminified) — fine for
  GitHub Pages, too big for anything that cares about TTFB.
- `npm audit` flags 29 transitive vulnerabilities in Expo SDK 50's deps
  (mostly `tar`, `uuid`, `cacache`). The fix is Expo SDK 56, which is a
  breaking change I haven't done yet. Tracked in a separate task.
- Voice input is Web-only. The native side would need a separate
  speech-recognition library, which would balloon the APK.

## License

MIT. See [LICENSE](LICENSE).

---

<div align="center">

If you're reviewing this for a job, the [ARCHITECTURE.md](ARCHITECTURE.md)
is the best place to start — it walks through the state model and the
rendering pipeline.

</div>
