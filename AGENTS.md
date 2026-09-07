# FitBox

AI-powered fitness & nutrition web app: React 18 + TypeScript SPA on Vite 5, Supabase (Postgres/Auth/Realtime/Storage/Edge Functions), shadcn/ui + Radix, TanStack Query, React Router 6, Zod. Deploys to Vercel. No tests, no Python code (despite the misleading `requirements.txt`).

## Branch / repo state

- Branch: `main`, 7 commits ahead of `origin/main` (unpushed, all from 2026-09-02 work session).
- Untracked in repo root: `.hermes/`, `AGENTS.md` (this file).
- Last build: `tsconfig.app.tsbuildinfo` regenerated `Sep 2 10:04`; `dist/` exists.

### Unpushed commits (origin/main..HEAD)

| sha       | message                                                                  |
| --------- | ------------------------------------------------------------------------ |
| `6a1984b` | fix(auth): correct misleading "Username already taken" error → reference email |
| `220629a` | fix(auth): rewrite forgot-password to use email + Supabase `resetPasswordForEmail` |
| `5ac2f1a` | feat(auth): add `resetPassword` wrapper to `AuthContext`                 |
| `60a1b26` | fix(onboarding): persist preferences to Supabase + localStorage (not dev-only mock API) |
| `9892f16` | chore(db): add `profiles.preferences` jsonb for onboarding wizard         |
| `a8a154d` | fix(muscle-map): wrap `ExerciseVideoPlayer` in `ErrorBoundary` in `ExerciseResults` |
| `b639c5f` | fix(video): replace `throw` with inline fallback in `ExerciseVideoPlayer` |

Files touched by these commits: `src/components/exercise/ExerciseVideoPlayer.tsx`, `src/components/muscle-map/ExerciseResults.tsx`, `src/contexts/AuthContext.tsx`, `src/integrations/supabase/types.ts`, `src/pages/Auth.tsx`, `src/pages/Onboarding.tsx`, `supabase/migrations/20260902024538_add_profiles_preferences.sql`.

## Recent history (chronological)

- 2026-09-02: Auth + onboarding hardening, muscle-map video crash fix (the 7 commits above).
- 2026-08-03: Docs — FitBox PRD & Synopsis refreshed for dual-identity architecture + gateway AI (`53a55c8`); user-id / profile-id schema alignment (`b546637`).
- 2026-07-22: Comprehensive bug fixes, type safety, production remediation (`8a3902b`).
- 2026-04-27: GymBuddy matchmaking system schema + realtime (`233af57` + migrations `20260427000000_gymbuddy_schema.sql`, `20260427000001_gymbuddy_realtime.sql`).
- Earlier: fitness-chat + trainer-contact edge functions, exercise media bucket migration, auth/guest routing, ErrorBoundary, YouTube video support, SEO fixes.

## Dev environment

Node 18+ (no engine pinned in `package.json`); npm is the documented toolchain — `bun.lockb` exists but scripts and `VERCEL_DEPLOYMENT.md` use `npm`.

```sh
npm install
npm run dev          # vite dev server, http://localhost:5173 (auto-opens)
```

Required env vars in `.env` (validated at runtime by `src/lib/env.ts` — missing values throw):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

For `scripts/upload-exercise-media.mjs` add `SUPABASE_SERVICE_ROLE_KEY`. Edge functions need `LOVABLE_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` set in the Supabase project.

## Build & test

```sh
npm run build        # tsc -b && vite build        → dist/
npm run build:dev    # vite build --mode development
npm run preview      # serve the production build locally
npm run lint         # eslint .   (config: eslint.config.js; ignores dist/)
npm run upload:exercise-media
```

No test runner, no `test` script. CI is not configured in this repo. `package.json` has no `typecheck` script — `npm run build` runs `tsc -b` against `tsconfig.app.json` + `tsconfig.node.json` (references in `tsconfig.json`).

## Layout

```
src/
  App.tsx (112), main.tsx (5), index.css, App.css, vite-env.d.ts
  components/   ui/ shadcn primitives; + subdirs:
                exercise/        ExerciseVideoPlayer, ExercisePoster
                workout/         AddExerciseDrawer, ExerciseLogCard,
                                StartWorkoutCard, WorkoutHeader
                muscle-map/      ExerciseResults, ExerciseResultCard,
                                MuscleMapContainer, MuscleMapSVG,
                                InteractiveBodyDiagram, EquipmentFilter, index.ts
                gymbuddy/        GymBuddyCard, GymBuddyEmpty,
                                GymBuddyMatchOverlay, GymBuddyRadar,
                                GymBuddySessionModal, GymBuddySettings,
                                WorkoutStreak
                layout/          (empty — reserved)
                + flat: AnalyticsTracker, BodyDiagram, ErrorBoundary,
                        exercise/ExerciseCard.tsx, ExerciseModal,
                        FitnessChat, GymTrainerChat, Header,
                        HeroSection, MuscleGroupFilter, MuscleMap,
                        TrainerContactButton
  pages/        one file per route (17 pages):
                LandingPage, Index, Auth (363), Onboarding (929),
                Exercises, ExerciseDetail, GenerateWorkout, ActiveWorkout,
                Nutrition, NutritionQuestionnaire, NutritionRoadmap,
                GymBuddyDiscover, GymBuddyMatches, GymBuddyChat,
                GymBuddyProfileSetup, NotFound
  contexts/     AuthContext (320), WorkoutContext, GymBuddyNotificationContext
  hooks/        useGymBuddy, useGymBuddyChat, useGymBuddyStreak,
                useWorkoutSave, useTrainerContact, use-toast, use-mobile
  lib/          env, authSchemas, muscleMapping, onboarding,
                compatibilityScore, exerciseMedia, gymBuddyTypes,
                analytics, utils
  data/, constants/, types/, utils/, integrations/supabase/types.ts, assets/
supabase/
  config.toml   project_id = "xmbardirxjhdamaeiuhx"
  migrations/   timestamped SQL (do not rename) — see list below
  functions/    fitness-chat/, get-trainer-contact/   (Deno, SSE stream + audit)
public/         favicons, robots.txt, demo videos, preset images
scripts/        upload-exercise-media.mjs (Node, uses node:fs/promises)
```

### Supabase migrations (apply order)

1. `20251007065544_5c736262-…sql`
2. `20251101134400_5da3b141-…sql`
3. `20251101134431_3364976a-…sql`
4. `20251102102612_ac2dee1f-…sql`
5. `20251103054711_7d8f9601-…sql`
6. `20251104092224_cc02532f-…sql`
7. `20251104092451_46219c0c-…sql`
8. `20251107094626_51a3f036-…sql`
9. `20251225085149_ae0eeca2-…sql`
10. `20251225093343_a0379854-…sql`
11. `20260320000100_create_exercise_media_bucket.sql`
12. `20260427000000_gymbuddy_schema.sql`
13. `20260427000001_gymbuddy_realtime.sql`
14. `20260902024538_add_profiles_preferences.sql` ← unpushed, local only

Path alias: `@/*` → `src/*` (set in `tsconfig.json`, `tsconfig.app.json`, `vite.config.ts`). shadcn aliases live in `components.json` (`ui` → `src/components/ui`, `lib` → `src/lib`, `hooks` → `src/hooks`).

## Conventions

- Routing: routes defined in `src/App.tsx` with `lazy(() => import("./pages/…"))`; new pages go in `src/pages/` and are wired with a `Route` inside the existing `<Routes>` block **above** the catch-all `*` → `NotFound` (see comment in `App.tsx`).
- Auth gating: wrap protected pages in `<ProtectedRoute>`; auth-only pages in `<PublicRoute>`. Both read from `useAuth()`.
- State: server state via TanStack Query; cross-tree state via `src/contexts/*`. Forms use `react-hook-form` + Zod resolvers (e.g. `src/lib/authSchemas.ts`).
- Supabase: client + env validation in `src/lib/env.ts`; never read `import.meta.env` directly elsewhere.
- Edge functions: Deno, `import { serve } from "https://deno.land/std@0.168.0/http/server.ts"`. Both functions have `verify_jwt = true` in `supabase/config.toml`.
- Migrations: filename pattern `<timestamp>_<uuid>.sql` — keep the timestamp prefix for ordering.
- Commit style (from `git log`): `fix: …`, `feat: …`, `chore(config): …`, `docs: …` — Conventional Commits, often in quotes for the older WIP commits.

## Pitfalls

- `requirements.txt` is comments-only on purpose — do **not** add Python deps here. `requirements.md` documents this explicitly.
- `src/lib/env.ts` throws on startup if `VITE_SUPABASE_URL` or `VITE_SUPABASE_PUBLISHABLE_KEY` are missing. The dev server won't render without them; copy from a teammate or the Supabase dashboard.
- `eslint-report.txt` is a 9 KB binary blob in the repo root, not source — do not open or edit it; it appears to be a captured terminal log.
- `vercel.json` rewrites every non-asset path to `/index.html` for SPA routing — when adding static assets under a new path, update the regex or serve them from `public/` so the rewrite doesn't shadow them.
- Vite dev server has a mock `/api/onboarding/preferences` POST endpoint hard-coded in `vite.config.ts` (in-memory only, lost on restart). It existed only for local onboarding UX; **as of `60a1b26` the onboarding page bypasses it** and persists to Supabase + localStorage directly. Do not reintroduce a dependency on the dev mock.
- `npm run upload:exercise-media` requires `SUPABASE_SERVICE_ROLE_KEY` in env — this key bypasses RLS; never log it or commit it.
- TypeScript is intentionally loose: `noImplicitAny: false`, `strictNullChecks: false`, `noUnusedLocals: false`, `noUnusedParameters: false` (see `tsconfig.json`). `eslint` has `@typescript-eslint/no-unused-vars` turned off. Don't tighten these without coordinating with the team — many existing files rely on the lax settings.
- `bun.lockb` is checked in alongside `package-lock.json`. Prefer `npm` for installs to match docs and CI; running `bun install` will drift the lockfile.
- Don't hand-edit `dist/`, `*.tsbuildinfo`, or `node_modules/` — all are gitignored and regenerated by `build`.
- **Auth error wording**: the Auth page previously surfaced a generic "Username already taken" toast on sign-up failures (`6a1984b` fixed it). When touching `src/pages/Auth.tsx`, keep the error message routed to the actual Supabase error and reference *email* when the failure is a duplicate-account / auth error.
- **`resetPassword`** flow is `useAuth().resetPassword(email)` → Supabase `resetPasswordForEmail` (redirect handled in `src/contexts/AuthContext.tsx`). Do not introduce a username-based reset path.
- **`profiles.preferences`** is a jsonb column added by `20260902024538`. `Onboarding.tsx` reads/writes it via TanStack Query + `localStorage` fallback. Schema for the JSON lives in the migration file; any new preference key must be added there first or onboarding will silently drop it.
- **`ExerciseVideoPlayer` must not throw.** It now degrades to an inline fallback (poster + message) on failure and is wrapped in `ErrorBoundary` from `ExerciseResults`. New video sources should plug into the existing error path, not `throw`.