# Contributing

I work on this in my spare time and welcome outside help.

## What I need

- Bug reports with a minimal reproduction (a screen recording goes a
  long way).
- Pull requests for clear bugs. For new features, open an issue first
  so we can argue about the design before you spend a weekend on it.
- Documentation fixes are always welcome. Typos, broken links, missing
  context — send them.

## What I don't need

- Rewrites in a different framework.
- Lint wars. If you find a real bug, fix it; don't open a PR with 47
  formatting changes.
- Drive-by refactors of files you touched for a one-line fix.

## Local setup

```bash
git clone https://github.com/badhope/TaskFlow
cd TaskFlow
npm install
npm run web        # fastest path — http://localhost:8081
npm run typecheck  # should be 0 errors
npm run lint       # should be 0 errors (warnings OK)
```

Node 18 or later. I develop on whatever the current LTS is, so older
versions are not tested.

## Commit messages

I don't enforce conventional commits. Write whatever you'd write if
nobody was watching. Some recent ones for the style:

- `polish: a11y, error boundary, and a less-AI-feeling README`
- `cache-buster was corrupting URLs in `src/` paths; switched to python`
- `add tasks with the same title at the same minute shouldn't crash`

No more than one short subject line, blank line, then a paragraph or
two if the diff is non-obvious. If the PR fixes an issue, the issue
number at the end is fine.

## Code style

TypeScript strict mode is on. The lint config is in `eslint.config.js`;
the rules are pragmatic, not the React/recommended set with every
warning turned into an error. If you want to add a rule, justify it
in the PR.

Components that render in a list should be wrapped in `React.memo`.
The rest is judgement.

## Where to put things

| New...                   | Goes in                                  |
|--------------------------|------------------------------------------|
| Route / page             | `screens/`                               |
| Generic UI primitive     | `src/shared/components/common/`          |
| New non-list view        | `src/shared/components/views/`           |
| Stateful reusable logic  | `src/shared/hooks/`                      |
| New persisted shape      | `src/shared/types/index.ts` + the store  |
| Theme color / token      | both light + dark presets in the store   |

## Pull request process

1. Branch from `main`. Name it whatever, I don't care.
2. Run `npm run typecheck && npm run lint` before pushing.
3. In the PR description, link the issue (if any) and a one-line
   summary of what changed and why.
4. Be patient. I'll get to it.

## Code of conduct

[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) — short version: be a decent
human.
