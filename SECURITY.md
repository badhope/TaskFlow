# Security

This project is a local-first single-user app, so the threat model is
mostly "don't accidentally leak the user's tasks to a third party".
Most of the below is already done; the rest is documented for honesty.

## Reporting a vulnerability

Please don't open a public GitHub Issue for security stuff. Use one
of:

- **GitHub Security Advisories** (preferred): the "Security" tab on
  the repo, then "Advisories" → "New draft security advisory". This
  gives us a private channel and lets us coordinate a fix before
  public disclosure.
- **Email**: see the GitHub profile of the maintainer for a current
  address. (I won't put it in plaintext here to keep scrapers away.)

Please include:
- What you found and how to reproduce it.
- The version affected.
- Your assessment of impact.
- Whether you'd like to be credited when we ship the fix.

I try to acknowledge within a few days. Realistic fix timeline depends
on severity, but a critical issue gets a patch in days, not weeks.

## Current posture

**Data storage.** All persisted data lives in AsyncStorage on the
device. No server, no telemetry, no third-party SDKs that phone home.
On web, that's `localStorage`; on mobile, the platform-native
AsyncStorage.

**Network.** The app does not initiate outbound requests in normal
operation. The web bundle makes no XHR/fetch calls. Expo's dev-time
hot-reload websocket is the only network traffic in development.

**No auth.** No login, no tokens, no account. There is nothing to
phish.

**Dependencies.** `npm audit` is run regularly. The known Expo SDK 50
transitive vulnerabilities (mostly `tar`, `uuid`, `cacache`) are
documented in the README's "Known caveats" — fixing them requires
upgrading to Expo SDK 56, which is a breaking change tracked
separately.

**No `dangerouslySetInnerHTML`, no `eval`, no `new Function`.** I
checked. The codebase doesn't render user-supplied HTML or evaluate
dynamic code anywhere.

## Things you should know as a user

- Clearing browser/site data will delete the local store. **Export
  first** (Settings → Data → Export) if you care about it.
- The web bundle is served over whatever HTTPS your hosting provider
  gives you. GitHub Pages, Netlify, and Vercel all default to HTTPS.
- Don't run the dev server on a network you don't trust. Metro's
  dev-time websocket has no auth.

## Scope

This policy covers the source in this repository. It does not cover
the Expo runtime, the React Native runtime, or any host platform's
own security guarantees. Those are the upstream projects'
responsibility.
