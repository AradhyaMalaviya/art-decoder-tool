# FitBox Requirements

This file is the Markdown version of the project requirements analysis. It was
prepared by reviewing the project folders `public`, `scripts`, `src`, and
`supabase`, plus the root project files such as `.env`, `.gitignore`,
`bun.lockb`, `components.json`, `eslint-report.txt`, `eslint.config.js`,
`index.html`, `new_one.zip`, `package-lock.json`, `package.json`,
`postcss.config.js`, `README.md`, `tailwind.config.ts`, the TypeScript configs,
`vercel.json`, `VERCEL_DEPLOYMENT.md`, `vite.config.ts`, `FitBox_PRD.md`, and
`FitBox_Synopsis.md`.

## Python Requirements

There are no Python source files, notebooks, Python lock files, Python package
manifests, or Python import statements in this project. `requirements.txt` is
therefore intentionally comments-only and safe for Python tooling to consume.

Use Node/npm for this repository:

```sh
npm install
npm run dev
npm run build
```

## Runtime Requirements

- Node.js and npm for the Vite React application and local scripts.
- Supabase project for authentication, database, storage, realtime, and Edge
  Functions.
- Supabase CLI or dashboard workflow for applying migrations under
  `supabase/migrations`.
- Vercel or another static hosting platform capable of serving the Vite build
  output from `dist`.
- Deno runtime for Supabase Edge Functions. Supabase normally provides this
  runtime; it is not installed through npm or pip.

No Node engine is declared in `package.json`, so this project does not currently
pin a specific Node.js version in its manifest.

## Environment Variables

The values below are required by code or deployment docs. Secret values from
`.env` were not copied into this file.

### Frontend Vite App

- `VITE_SUPABASE_URL` - required by `src/lib/env.ts`.
- `VITE_SUPABASE_PUBLISHABLE_KEY` - required by `src/lib/env.ts`.
- `VITE_SUPABASE_PROJECT_ID` - declared as optional in `src/vite-env.d.ts`.

### Media Upload Script

- `VITE_SUPABASE_URL` - used by `scripts/upload-exercise-media.mjs`.
- `SUPABASE_SERVICE_ROLE_KEY` - used by `scripts/upload-exercise-media.mjs`.

### Supabase Edge Functions

- `LOVABLE_API_KEY` - used by `supabase/functions/fitness-chat/index.ts`.
- `SUPABASE_URL` - used by
  `supabase/functions/get-trainer-contact/index.ts`.
- `SUPABASE_ANON_KEY` - used by
  `supabase/functions/get-trainer-contact/index.ts`.
- `SUPABASE_SERVICE_ROLE_KEY` - used by
  `supabase/functions/get-trainer-contact/index.ts`.

## npm Runtime Dependencies

These come from `package.json` dependencies and are also reflected by imports in
`src`, `scripts`, or Supabase-adjacent code where applicable.

| Package | Version range |
| --- | --- |
| `@hookform/resolvers` | `^3.10.0` |
| `@radix-ui/react-accordion` | `^1.2.11` |
| `@radix-ui/react-alert-dialog` | `^1.1.14` |
| `@radix-ui/react-aspect-ratio` | `^1.1.7` |
| `@radix-ui/react-avatar` | `^1.1.10` |
| `@radix-ui/react-checkbox` | `^1.3.2` |
| `@radix-ui/react-collapsible` | `^1.1.11` |
| `@radix-ui/react-context-menu` | `^2.2.15` |
| `@radix-ui/react-dialog` | `^1.1.14` |
| `@radix-ui/react-dropdown-menu` | `^2.1.15` |
| `@radix-ui/react-hover-card` | `^1.1.14` |
| `@radix-ui/react-label` | `^2.1.7` |
| `@radix-ui/react-menubar` | `^1.1.15` |
| `@radix-ui/react-navigation-menu` | `^1.2.13` |
| `@radix-ui/react-popover` | `^1.1.14` |
| `@radix-ui/react-progress` | `^1.1.7` |
| `@radix-ui/react-radio-group` | `^1.3.7` |
| `@radix-ui/react-scroll-area` | `^1.2.9` |
| `@radix-ui/react-select` | `^2.2.5` |
| `@radix-ui/react-separator` | `^1.1.7` |
| `@radix-ui/react-slider` | `^1.3.5` |
| `@radix-ui/react-slot` | `^1.2.3` |
| `@radix-ui/react-switch` | `^1.2.5` |
| `@radix-ui/react-tabs` | `^1.1.12` |
| `@radix-ui/react-toast` | `^1.2.14` |
| `@radix-ui/react-toggle` | `^1.1.9` |
| `@radix-ui/react-toggle-group` | `^1.1.10` |
| `@radix-ui/react-tooltip` | `^1.2.7` |
| `@supabase/supabase-js` | `^2.58.0` |
| `@tanstack/react-query` | `^5.83.0` |
| `class-variance-authority` | `^0.7.1` |
| `clsx` | `^2.1.1` |
| `cmdk` | `^1.1.1` |
| `date-fns` | `^3.6.0` |
| `embla-carousel-react` | `^8.6.0` |
| `input-otp` | `^1.4.2` |
| `lucide-react` | `^0.462.0` |
| `next-themes` | `^0.3.0` |
| `react` | `^18.3.1` |
| `react-day-picker` | `^8.10.1` |
| `react-dom` | `^18.3.1` |
| `react-hook-form` | `^7.61.1` |
| `react-resizable-panels` | `^2.1.9` |
| `react-router-dom` | `^6.30.1` |
| `recharts` | `^2.15.4` |
| `sonner` | `^1.7.4` |
| `tailwind-merge` | `^2.6.0` |
| `tailwindcss-animate` | `^1.0.7` |
| `vaul` | `^0.9.9` |
| `zod` | `^3.25.76` |

## npm Development Dependencies

| Package | Version range |
| --- | --- |
| `@eslint/js` | `^9.32.0` |
| `@tailwindcss/typography` | `^0.5.16` |
| `@types/node` | `^22.16.5` |
| `@types/react` | `^18.3.23` |
| `@types/react-dom` | `^18.3.7` |
| `@vitejs/plugin-react-swc` | `^3.11.0` |
| `autoprefixer` | `^10.4.21` |
| `eslint` | `^9.32.0` |
| `eslint-plugin-react-hooks` | `^5.2.0` |
| `eslint-plugin-react-refresh` | `^0.4.20` |
| `globals` | `^15.15.0` |
| `lovable-tagger` | `^1.1.10` |
| `postcss` | `^8.5.6` |
| `tailwindcss` | `^3.4.17` |
| `typescript` | `^5.8.3` |
| `typescript-eslint` | `^8.38.0` |
| `vite` | `^5.4.19` |

## Supabase Edge Function URL Imports

Supabase Edge Functions import these remote modules directly in Deno:

| Import | Used by |
| --- | --- |
| `https://deno.land/std@0.168.0/http/server.ts` | `fitness-chat`, `get-trainer-contact` |
| `https://esm.sh/@supabase/supabase-js@2` | `get-trainer-contact` |

## Native and Local Imports

The upload script uses Node built-ins only:

- `node:fs/promises`
- `node:path`
- `node:url`

The app uses the `@/*` TypeScript/Vite path alias configured in
`tsconfig.json`, `tsconfig.app.json`, and `vite.config.ts`.

## Static Assets and Archive Notes

- `public` contains favicons, `robots.txt`, preview imagery, preset images, and
  exercise demo videos.
- `src/assets` contains app images used by React components.
- `new_one.zip` contains an exported static HTML mockup and screenshot:
  `stitch_exercise_and_muscle_group_directory/exercise_and_muscle_group_directory/code.html`
  and `screen.png`. It does not contain Python dependencies.

## Lock and Tooling Files

- `package-lock.json` is the npm lockfile and should be committed with
  `package.json`.
- `bun.lockb` is present, but npm scripts and docs use npm commands.
- `components.json` configures shadcn/ui aliases and Tailwind integration.
- `eslint.config.js` configures ESLint, TypeScript ESLint, React Hooks, and React
  Refresh rules.
- `tailwind.config.ts` and `postcss.config.js` configure Tailwind CSS,
  `tailwindcss-animate`, and Autoprefixer.
- `vercel.json` rewrites SPA routes to `index.html`.

## Install Summary

Use this command for project dependencies:

```sh
npm install
```

Do not add npm packages to `requirements.txt`. If Python code is added later,
only then should pip dependencies be listed in `requirements.txt`.
