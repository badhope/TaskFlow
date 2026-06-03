# TaskFlow architecture

Notes for someone reading the code for the first time. If you want
the tour-guide version, read this top-to-bottom; if you want to
navigate, the table of contents below has the landmarks.

## Contents

1. Layering
2. State model
3. Types
4. Components
5. Theme
6. Navigation
7. Persistence

## Layering

The codebase has four rough layers, top-down:

```
screens/                 # one file per route, allowed to know about nav
src/shared/components/   # presentational, no nav, no store mutations
src/shared/hooks/        # reusable stateful logic
src/shared/store/        # Zustand store, the only place state lives
src/shared/types/        # TypeScript types for every persisted shape
```

The hard rule: `src/shared/components/` never imports from `screens/`,
and never imports from `@react-navigation`. The store is allowed to
be imported anywhere because it's the source of truth.

I keep `screens/` at the top level (not under `src/`) because Expo
template generators expect to find `App.tsx` next to `screens/`, and
fighting the template is more friction than it's worth.

## State model

Single Zustand store, persisted to AsyncStorage. The whole store is
~1100 lines in `src/shared/store/index.ts`.

Why a single store, not a slice-per-domain: the dataset is small
(<5k tasks for any realistic user) and there are no perf issues from
re-rendering on a slice change. A slice store would also need cross-slice
selectors for the views (Kanban, Gantt, Analytics), which gets fiddly.

The store keeps tasks as a flat array, not a normalised `Record<id, Task>`.
Flat matches the shape FlatList wants, and the lookup costs are fine at
this scale. If we ever ship a server-backed sync, that's the migration
point — re-derive the array in a selector on top of a normalised index.

Computed values (filtered/sorted tasks) live in components, not the
store, via `useMemo`. This keeps the store dumb and the component
the single source of "what does this view show".

## Types

Every persisted shape lives in `src/shared/types/index.ts`. The store
references the types; the components reference the types; nothing else
invented a parallel type system. (Earlier versions of this project did,
and we kept finding `Task`-shaped objects that didn't actually match
the Task type. The "one type file" rule is a hard-won lesson.)

The `Task` interface is the largest, at ~25 fields. Most are nullable
(`dueDate: Date | null`) because most tasks don't have a due date.
Optional fields (`?:`) are reserved for genuinely optional metadata
that is meaningful when present but rarely used.

## Components

Two directories under `src/shared/components/`:

- `common/` — generic UI primitives (Button, Card, Modal, ...). These
  have no domain knowledge.
- `views/` — the six non-list views (Kanban, Gantt, Timeline, Table,
  TimeBlock, MindMap). These know about tasks but not about navigation.

Everything is wrapped in `React.memo` where it makes sense. The
80/20 was on `TaskCard` (it appears in a FlatList with hundreds of
items) and the view cards.

## Theme

A single `Theme` object lives in the store. All components read it via
`useAppStore(s => s.theme)`. Token names follow a consistent prefix
scheme (`text`, `textSecondary`, `textTertiary`, `surface`, `surfaceElevated`,
`border`, `borderStrong`, `priorities.{level}`, `status.{status}`).

Adding a new color: add the token to both the light and dark theme
presets, then read it from the store. Don't hardcode hex anywhere.

## Navigation

React Navigation v6 with a bottom-tab navigator wrapped around four
native-stack navigators (Home, Calendar, Analytics, Search). The
Stack-on-top-of-Tabs pattern lets us push modal-y screens (TaskDetail,
Settings) from any tab without losing tab state.

The floating glass tab bar is just `tabBarStyle` with absolute
positioning and a translucent background — no custom tab bar component
needed.

## Persistence

Zustand's `persist` middleware writes the whole store to AsyncStorage
on every change. This is fine because the dataset is small and writes
are async. If we ever add a feature that produces rapid updates
(autosave while typing in a long description), debounce before letting
it hit the store.

Export/import is JSON, with a top-level version field. Bump the version
field whenever the shape changes incompatibly; the import code in
`SettingsScreen` is the migration point.

## Conventions

- No `any` outside `types/index.ts` and the store action signatures.
  ESLint enforces this as a warning; CI tolerates the legacy sprawl.
- All dates are `Date` in memory, ISO strings in storage. The store
  normalises on read.
- IDs are `nanoid`-style strings (`Date.now() + random`). Don't try
  to make them short — the storage cost is trivial.
- Comments explain *why*, not *what*. If the code is clear enough to
  read, no comment is fine.
