# GitHub Actions

Four workflows under `.github/workflows/`.

## `verify.yml`

Runs on every push and PR. Does:
- `npm ci` (uses the lockfile, fast)
- `npm run typecheck`
- `npm run lint`

If this is red, the PR isn't getting merged. Should take ~1 minute.

## `build-android.yml`

Builds a debug APK on every push to `main` and uploads it as an
artifact. Doesn't need any secrets. Useful for grabbing a recent
build without setting up Android Studio locally.

Note: this builds a **debug** APK, which is signed with the default
debug key and won't pass Play Store review. For a release build, use
EAS.

## `eas-build.yml`

Thin wrapper around `eas build`. Needs the `EXPO_TOKEN` secret set
in the repo settings. By default it builds the `preview` profile for
Android on every push to `main`. Override the profile in the
workflow's `with:` block if you need production.

## `deploy-web.yml`

This is the one with the workaround. Steps:

1. `npm ci`
2. `npm run typecheck` (catches broken builds early)
3. `npm run build:web` → produces `dist/`
4. Inject no-cache meta tags + a `?v=<timestamp>` query parameter on
   every `/_expo/*` and `/assets/*` URL in `dist/index.html`
5. Upload `dist/` as the Pages artifact
6. Deploy via `actions/deploy-pages@v4`

**Why step 4 exists.** GitHub Pages sits behind Fastly's CDN with a
default `cache-control: max-age=600`. On the very first deploy, the
SPA shell `index.html` returns 404 for a few seconds, the CDN caches
that 404, and then refreshing the page keeps showing the cached 404
even after the real `index.html` is live. The `?v=<timestamp>`
parameter forces a cache miss on every deploy because the URLs are
new. The no-cache meta tags make the browser revalidate aggressively.

This is ugly and PRs with a cleaner answer are very welcome. A
proper fix probably involves either (a) a custom domain with a
configurable CDN, or (b) splitting the SPA shell and the asset URLs
so only the shell needs the cache-buster. (a) costs money, (b) is a
real refactor of the build output.

## Triggering manually

Any of the above can be triggered from the Actions tab → select the
workflow → "Run workflow". The `deploy-web.yml` workflow is also
safe to re-run after fixing a deploy; it produces a new URL each
time.

## Local equivalent of the verify workflow

```bash
npm ci
npm run typecheck
npm run lint
```

If you can run those three, the verify job will be green.
