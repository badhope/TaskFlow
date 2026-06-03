# Changelog

Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## v1.2.0 — 2026-06-03

- ESLint v9 flat config (`eslint.config.js`) replaces the old `.eslintrc.*`.
  Type-aware checks are off by default to keep CI fast; we re-evaluate
  on a per-file basis when the project grows.
- `verify.yml` now exits 0 with the new config (warnings only, on
  pre-existing `any` sprawl from the prototype phase).
- Added an `ErrorBoundary` wrapper in `App.tsx` so a render error in one
  screen doesn't blank the navigator.
- `TaskCard` and `Button` now expose `accessibilityLabel` / `accessibilityRole`
  / `accessibilityState` so screen readers announce task titles,
  priorities, and the disabled/loading state.
- `DraggableList` now keeps a local visual order during a drag and only
  pushes the final order to the store on drop, so the moving row can
  animate without re-rendering the whole list.
- `types/index.ts` lost its ASCII-art section dividers. The file is
  still grouped, just not shouting about it.
- A few real "why" comments added in `store/index.ts` (flat vs normalised
  tasks) and `DraggableList.tsx` (local order during drag).

## v1.1.0 — 2026-06-02

The "polish for the portfolio" release.

- App icon (1024×1024), splash (1284×1284), favicon, Apple touch icon
- 3 SVG preview images for the README
- AI suggestions: time-of-day, priority, category, merge, split
  (all local-statistical, no model)
- White-noise player: white / pink / brown + rain / ocean / forest
  (Web Audio API; on native, a Vibration fallback with a tip)
- @-mentions in comments with live member suggestions
- Draggable list reordering (PanResponder + LayoutAnimation)
- Focus mode: Forest-style full-screen + Pomodoro
- Multi-select bulk actions (Things 3 style bottom bar)
- Task dependencies (blockedBy / blocks)
- Voice input via Web Speech API (web only)
- Global keyboard shortcuts (Cmd/Ctrl+N to add, Esc to cancel selection)

## v1.0.0 — 2025-06-01

Initial feature-complete build.

- 15 screens, 20 reusable components, 6 non-list views
- Zustand store with AsyncStorage persistence
- Categories, tags, projects, goals, habits, notes, templates, automations
- Undo (last delete) via a custom hook
- Search with history
- Light / dark theme + custom color tokens
- Data export / import (JSON)
