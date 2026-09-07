# Plan — Fix 3 Critical FitBox Auth-Flow Bugs

**Workspace**: `C:\Users\deepa\Downloads\musclewebsite test 2\art-decoder-tool`
**Created**: 2026-09-02
**Scope**: Three production-blocking issues from `bugsanderrors/newerror.md`:
1. **LOGIC-01** — Uncaught video player crash in muscle-map modal
2. **LOGIC-02** — Onboarding 404 in production (dev-only middleware)
3. **LOGIC-03** — Forgot-password asks for non-existent phone field

The "Username already taken" misleading error (LOGIC-04) is bundled into #3 because it lives in the same `AuthContext` and the same audit cycle — a one-line copy fix added at the end.

---

## Goal

Eliminate the three production-blocking bugs in the FitBox auth/onboarding/video flow so that a deployed Vercel build works for real users, with no regression to the currently-passing `tsc -b` and `npm run lint` baselines.

---

## Current context / assumptions

**Verified facts (from live source, today):**
- `tsc -b --noEmit` returns **0 errors** — do not break this.
- The `ErrorBoundary` component exists at `src/components/ErrorBoundary.tsx` and is already imported in `App.tsx`.
- `src/components/exercise/ExerciseVideoPlayer.tsx:25-27` does `throw new Error("Media failed to load")` inside the render body — any `<video onError>` or `<iframe onError>` will crash the whole React tree.
- `src/components/muscle-map/ExerciseResults.tsx:127-134` renders `<ExerciseVideoPlayer>` inside a `<Dialog>` with **no** `ErrorBoundary` wrapping it (zero matches for `ErrorBoundary` in `src/components/muscle-map/`).
- `src/pages/Onboarding.tsx:207-218` calls `fetch("/api/onboarding/preferences", { method: "POST", ... })`. That endpoint exists only as Vite dev middleware in `vite.config.ts:55-87` (`configureServer` block). On Vercel it returns 404.
- `src/pages/Auth.tsx:301-352` renders a "Reset Password" form with a single `<Input id="recovery-phone" type="tel">`. The submit handler shows a hard-coded "Twilio not configured" toast and does nothing else. Signup form (`Auth.tsx:159-220`) collects only email + full name + username + password — no phone ever exists in the system.
- `src/contexts/AuthContext.tsx:166-167` and `:181` map Supabase's "User already registered" (which is an **email** error) to the string `"Username already taken"`.
- `src/contexts/AuthContext.tsx:25` already destructures `signUp` and `signIn` from `useAuth()`. The Auth context does **not** currently expose a `resetPassword` method.
- `public.profiles` table already has `auth_user_id uuid REFERENCES auth.users(id)` (migration `20251107094626_…sql`) but **no** `preferences` JSONB column and **no** `full_name` column.
- The `use-toast` hook is `useToast` and is the standard toast primitive.
- `npx tsc -b --noEmit` was run inside the workspace and returned empty output (success).

**Assumptions to confirm with the user before executing (one quick `clarify` call is acceptable; if no answer, default to the safer choice):**
- The Onboarding save plan targets a `preferences` JSONB column. The user can either (a) apply a new migration adding `preferences jsonb` to `public.profiles`, **or** (b) keep saving to `localStorage` only and skip the DB write. This plan picks **(a) new migration** as the default because the schema already has `auth_user_id` and the RLS policy `auth.uid() = auth_user_id` already permits the row to be updated by the owning user; the column is the only thing missing. If the user objects, swap Task 3.1's migration for a `localStorage` fallback.
- The migration in this plan is written but **not** applied locally (the project has no local Postgres). The implementer should commit the file and tell the user to run `supabase db push` in their environment.
- No test runner exists. This plan therefore uses **TDD-without-test-runner**: every task ends with a manual verification command and an exact expected output. This matches the project's actual capability (zero tests today) and the AGENTS.md note "no test runner."

---

## Architecture / proposed approach

Three small, isolated changes — one file each for #1 and #3, two files for #2 — with no new dependencies, no new packages, and no API surface change for callers of `useAuth()`. The pattern for each is: **eliminate the throw / dead-end / wrong-input entirely, then add the smallest possible replacement (an inline UI fallback, a Supabase update, an email input).** Every change keeps the existing public types and context shape so no caller needs to be touched.

---

## Step-by-step tasks

Each task ends with a **Verification** block — an exact command and the exact output to look for. The implementer should NOT proceed to the next task until the previous verification passes.

Frequent commits: one commit per numbered task. Use the existing Conventional-Commits style (already in git log: `fix:`, `feat:`, `chore:`, `docs:`).

---

### Task 1 — `fix(video): replace throw with inline fallback in ExerciseVideoPlayer`

**File**: `src/components/exercise/ExerciseVideoPlayer.tsx`

**Background**: Lines 25-27 throw an `Error` during render when the `<video>` or `<iframe>` fires `onError`. Throwing during render is the React idiom for "trigger the nearest `ErrorBoundary`" — but `ExerciseResults.tsx` (the modal in the muscle map) does not wrap the player in one, so the whole dashboard crashes. The fix is to **not throw at all** and render an inline visual fallback instead. The `ExerciseDetail.tsx` page still has its own `ErrorBoundary`; we keep that for defense-in-depth but stop depending on it.

**Change 1.1** — Replace the `throw` block (lines 25-27) with an inline JSX fallback that mirrors the visual treatment the project already uses elsewhere (see `logic_and_runtime_bugs.md` §LOGIC-01 for the diff).

In `src/components/exercise/ExerciseVideoPlayer.tsx`, replace:

```tsx
  if (hasError) {
    throw new Error("Media failed to load");
  }
```

with:

```tsx
  if (hasError) {
    return (
      <div
        className="flex h-full w-full flex-col items-center justify-center bg-muted p-4 text-center text-muted-foreground"
        role="img"
        aria-label="Video preview unavailable"
      >
        <PlayCircle className="mb-2 h-10 w-10 opacity-50" />
        <p className="text-xs font-medium">Video preview unavailable</p>
        <p className="mt-1 text-[11px] opacity-70">
          Check your connection or try a different exercise.
        </p>
      </div>
    );
  }
```

**Change 1.2** — Add the missing `PlayCircle` import from `lucide-react`. The file currently only imports `useEffect`, `useRef`, `useState`, `cn`, `Exercise` type, and `ExercisePoster`. Change line 1 to:

```tsx
import { useEffect, useRef, useState } from "react";
import { PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/data/exercises";
import { ExercisePoster } from "@/components/exercise/ExercisePoster";
```

(`PlayCircle` is already in the project's icon set — `lucide-react` is a direct dependency in `package.json:54`. No new package needed.)

**Commit**: `fix(video): replace throw with inline fallback in ExerciseVideoPlayer`

**Verification**:
```sh
cd "C:/Users/deepa/Downloads/musclewebsite test 2/art-decoder-tool"
npx tsc -b --noEmit
```
Expected: command exits 0, no output.

```sh
cd "C:/Users/deepa/Downloads/musclewebsite test 2/art-decoder-tool"
grep -n "throw new Error" src/components/exercise/ExerciseVideoPlayer.tsx
```
Expected: no matches.

---

### Task 2 — `fix(muscle-map): wrap ExerciseVideoPlayer in ErrorBoundary in ExerciseResults`

**File**: `src/components/muscle-map/ExerciseResults.tsx`

**Background**: Task 1 removes the `throw`, but a future regression (or a different rendering exception inside the player) could still crash the modal. Add a defense-in-depth `ErrorBoundary` around the `<ExerciseVideoPlayer>` only, scoped to the video region, with a small inline fallback so the rest of the exercise detail (badges, description) still renders. The `ErrorBoundary` at `src/components/ErrorBoundary.tsx` already accepts an optional `fallback` prop, so use a tight one.

**Change 2.1** — At the top of `src/components/muscle-map/ExerciseResults.tsx`, add the import after the existing `ExerciseVideoPlayer` import (line 7):

```tsx
import { ExerciseVideoPlayer } from "@/components/exercise/ExerciseVideoPlayer";
import { ErrorBoundary } from "@/components/ErrorBoundary";
```

**Change 2.2** — Wrap the video block. Replace lines 127-134 (the `{/* Video */}` JSX) with:

```tsx
              {/* Video — wrapped in ErrorBoundary so a media failure can never crash the whole modal */}
              {selectedExercise.video && (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <ErrorBoundary
                    fallback={
                      <div
                        className="flex h-full w-full flex-col items-center justify-center bg-muted p-4 text-center text-muted-foreground"
                        role="img"
                        aria-label="Video preview unavailable"
                      >
                        <PlayCircle className="mb-2 h-10 w-10 opacity-50" />
                        <p className="text-xs font-medium">Video preview unavailable</p>
                      </div>
                    }
                  >
                    <ExerciseVideoPlayer
                      exercise={selectedExercise}
                      className="h-full w-full object-cover"
                    />
                  </ErrorBoundary>
                </div>
              )}
```

**Change 2.3** — Add `PlayCircle` to the existing `lucide-react` import on line 3. Change:

```tsx
import { Search, Target, Dumbbell } from "lucide-react";
```

to:

```tsx
import { Search, Target, Dumbbell, PlayCircle } from "lucide-react";
```

**Commit**: `fix(muscle-map): wrap ExerciseVideoPlayer in ErrorBoundary in ExerciseResults`

**Verification**:
```sh
cd "C:/Users/deepa/Downloads/musclewebsite test 2/art-decoder-tool"
npx tsc -b --noEmit
```
Expected: exit 0, no output.

```sh
cd "C:/Users/deepa/Downloads/musclewebsite test 2/art-decoder-tool"
grep -n "ErrorBoundary" src/components/muscle-map/ExerciseResults.tsx
```
Expected: 2 matches (the import + the JSX usage).

---

### Task 3 — Onboarding 404: write preferences to Supabase + keep a localStorage fallback

**Files**:
- New: `supabase/migrations/20260902024538_add_profiles_preferences.sql`
- Edit: `src/pages/Onboarding.tsx`

**Background**: The current `handleSubmit` (lines 164-231) calls `fetch("/api/onboarding/preferences", ...)`. The endpoint is a Vite-only middleware (`vite.config.ts:55-87`) and does not exist in production. The `public.profiles` table already has `auth_user_id` (FK to `auth.users(id)`) but no `preferences` JSONB column. We need (a) a migration that adds the column, and (b) a `handleSubmit` rewrite that writes to Supabase for logged-in users and to `localStorage` for guests.

**Change 3.1** — Create a new migration file. `supabase/migrations/20260902024538_add_profiles_preferences.sql`:

```sql
-- 2026-09-02
-- Store onboarding wizard output (inspiration, diet, meals, workout prefs) on the user profile.
-- RLS already permits the owning user to UPDATE their own row via
--   USING (auth.uid() = auth_user_id)
-- so no new policy is needed for the owning user. We add one for INSERT so a row
-- can be created on the fly if a signup edge case skipped the original insert.

BEGIN;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS preferences jsonb;

-- Allow a user to INSERT a row that maps back to their auth.uid (defense in depth).
-- Existing RLS for SELECT/UPDATE on auth_user_id already covers the wizard.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can insert their own profile row'
  ) THEN
    CREATE POLICY "Users can insert their own profile row"
      ON public.profiles
      FOR INSERT
      WITH CHECK (auth.uid() = auth_user_id);
  END IF;
END $$;

COMMIT;
```

The migration is idempotent (`ADD COLUMN IF NOT EXISTS`, policy existence check). The implementer should NOT run `supabase db push` — the project has no local Postgres. Commit the file and tell the user to run `supabase db push` from their environment.

**Commit**: `chore(db): add profiles.preferences jsonb for onboarding wizard`

**Change 3.2** — Rewrite `handleSubmit` in `src/pages/Onboarding.tsx` (lines 164-231). The new version:
- Builds the same `payload`.
- For logged-in users: `supabase.from('profiles').update({ preferences: payload }).eq('auth_user_id', user.id)`.
- For guests: `localStorage.setItem('fitbox:onboarding', JSON.stringify(payload))`.
- Always shows the success toast; never calls `fetch("/api/...")`.
- Keeps the `setSubmitting`/`setSubmitError`/`finally` structure.

Replace lines 164-231 (the entire `handleSubmit` arrow function) with:

```tsx
  const handleSubmit = async () => {
    setSubmitError(null);
    setSubmitSuccess(null);
    setSubmitting(true);

    try {
      const now = new Date().toISOString();
      const userId = user?.id ?? "guest";

      const payload: UserPreferencePayload = {
        userId,
        inspiration: {
          images: inspirationImages.map((img) => img.src),
          preset: selectedPreset ?? null,
          tags: inspirationTags,
          notes: inspirationNotes.trim(),
        },
        diet: {
          type: dietType as UserPreferencePayload["diet"]["type"],
          calorieTarget: calorieTarget ? Number(calorieTarget) || null : null,
        },
        meals: {
          routine: mealRoutine as UserPreferencePayload["meals"]["routine"],
          eatingWindow:
            mealRoutine === "intermittent-fasting"
              ? { start: eatingWindowStart, end: eatingWindowEnd }
              : null,
          allergies: parsedAllergies,
          avoidAllergens: parsedAllergies.length > 0 ? avoidAllergens : false,
        },
        workout: {
          preferredTime: preferredWorkoutTime as UserPreferencePayload["workout"]["preferredTime"],
          timeRange:
            preferredWorkoutTime === "flexible"
              ? null
              : {
                  start: workoutTimeStart,
                  end: workoutTimeEnd,
                },
        },
        createdAt: now,
      };

      // Always keep a local copy so the wizard result survives even if the
      // user is a guest or the network write fails.
      try {
        localStorage.setItem("fitbox:onboarding", JSON.stringify(payload));
      } catch (storageErr) {
        console.warn("Could not persist preferences to localStorage:", storageErr);
      }

      if (user && !user.isGuest) {
        // Logged-in user: persist to the profile row.
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ preferences: payload })
          .eq("auth_user_id", user.authUserId);

        if (updateError) {
          throw new Error(updateError.message);
        }
      }

      setSubmitSuccess(
        "Nice. Plan saved. Time to actually lift something heavier than your phone. 🏋️‍♂️"
      );
      console.log("Onboarding saved", payload, { inspirationScore });
    } catch (error) {
      console.error(error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong saving your preferences."
      );
    } finally {
      setSubmitting(false);
    }
  };
```

**Change 3.3** — Add the `supabase` import at the top of `src/pages/Onboarding.tsx`. Insert after line 9 (the `useAuth` import):

```tsx
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
```

**Commit**: `fix(onboarding): persist preferences to Supabase + localStorage instead of dev-only API`

**Verification**:
```sh
cd "C:/Users/deepa/Downloads/musclewebsite test 2/art-decoder-tool"
npx tsc -b --noEmit
```
Expected: exit 0, no output.

```sh
cd "C:/Users/deepa/Downloads/musclewebsite test 2/art-decoder-tool"
grep -n "/api/onboarding/preferences" src/pages/Onboarding.tsx
```
Expected: no matches.

```sh
cd "C:/Users/deepa/Downloads/musclewebsite test 2/art-decoder-tool"
grep -n "supabase" src/pages/Onboarding.tsx | head -5
```
Expected: at least 2 matches (the import + the `.from('profiles')` call).

```sh
cd "C:/Users/deepa/Downloads/musclewebsite test 2/art-decoder-tool"
ls supabase/migrations | tail -1
```
Expected: `20260902024538_add_profiles_preferences.sql`.

```sh
cd "C:/Users/deepa/Downloads/musclewebsite test 2/art-decoder-tool"
npm run build
```
Expected: exit 0, output ends with `dist/index.html` and a `dist/assets/` folder created.

---

### Task 4 — Add `resetPassword` to the Auth context

**File**: `src/contexts/AuthContext.tsx`

**Background**: The forgot-password flow (Task 5) will call a real Supabase password-reset endpoint. We need a small wrapper in the auth context so the page calls `useAuth().resetPassword(email)`, not `supabase.auth.resetPasswordForEmail(email)` directly — keeps the pattern consistent with `signUp` / `signIn`.

**Change 4.1** — Extend the `AuthContextType` interface (lines 15-25). Add a new field after `signIn`:

```tsx
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
```

**Change 4.2** — Add the implementation inside the `AuthProvider` (after the `signIn` function, before `continueAsGuest`). Insert:

```tsx
  const resetPassword = async (email: string) => {
    try {
      // redirectTo must match a configured Supabase redirect URL.
      // For local dev the Auth page navigates the user back to /auth
      // where they can sign in with the new password they set via the
      // email link Supabase sends.
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth`,
      });
      if (error) {
        if (error.message === "Failed to fetch") {
          return {
            success: false,
            error:
              "Network Error: Cannot connect to Supabase. Your project might be paused due to inactivity, or an adblocker (like Brave Shields) is blocking the request. Please check your Supabase dashboard to unpause it.",
          };
        }
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send reset email";
      return { success: false, error: errorMessage };
    }
  };
```

**Change 4.3** — Add `resetPassword` to the `useMemo`-less provider `value` (line 280). The current line is:

```tsx
    <AuthContext.Provider value={{ user, session, authUserId, profileId, signUp, signIn, continueAsGuest, signOut, loading }}>
```

Change to:

```tsx
    <AuthContext.Provider value={{ user, session, authUserId, profileId, signUp, signIn, resetPassword, continueAsGuest, signOut, loading }}>
```

**Commit**: `feat(auth): add resetPassword wrapper to AuthContext`

**Verification**:
```sh
cd "C:/Users/deepa/Downloads/musclewebsite test 2/art-decoder-tool"
npx tsc -b --noEmit
```
Expected: exit 0, no output.

```sh
cd "C:/Users/deepa/Downloads/musclewebsite test 2/art-decoder-tool"
grep -n "resetPassword" src/contexts/AuthContext.tsx
```
Expected: 3 matches (interface field, function body, provider value).

---

### Task 5 — `fix(auth): rewrite forgot-password flow to use email + Supabase reset`

**File**: `src/pages/Auth.tsx`

**Background**: The current `mode === 'forgot'` block (lines 301-352) asks for a phone number that the user never registered. Replace the input + handler with an email input that calls the new `resetPassword` from `useAuth()`. Also delete the now-unreachable `mode === 'otp'` form and the `otp`/`newPassword`/`recoveryPhone` state — they only existed for the dead Twilio path. Keep `mode === 'otp'` as a valid `AuthMode` so the type still compiles even though no UI renders it (alternative: remove `'otp'` from the union and the two header lines that mention it; that's safer — see below).

**Change 5.1** — Destructure `resetPassword` from `useAuth()`. Line 25:

```tsx
  const { signUp, signIn, continueAsGuest } = useAuth();
```

becomes:

```tsx
  const { signUp, signIn, resetPassword, continueAsGuest } = useAuth();
```

**Change 5.2** — Delete the dead state. Remove these three lines (20-22):

```tsx
  const [recoveryPhone, setRecoveryPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
```

**Change 5.3** — Remove the `'otp'` mode from the union and from the two header text strings. Line 11:

```tsx
type AuthMode = 'welcome' | 'signup' | 'signin' | 'guest' | 'forgot' | 'otp';
```

becomes:

```tsx
type AuthMode = 'welcome' | 'signup' | 'signin' | 'guest' | 'forgot';
```

Line 121 (the `mode === 'otp'` title):

```tsx
            {mode === 'otp' && 'Verify OTP'}
```

→ delete the line.

Line 129 (the `mode === 'otp'` description):

```tsx
            {mode === 'otp' && 'Enter the code sent to your phone'}
```

→ delete the line.

**Change 5.4** — Rewrite the `mode === 'forgot'` form (lines 301-352). Replace the entire block (the `<form onSubmit={…}>` through the closing `</form>`) with:

```tsx
          {mode === 'forgot' && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!email.trim()) {
                  toast({
                    title: 'Error',
                    description: 'Please enter your email',
                    variant: 'destructive',
                  });
                  return;
                }
                setLoading(true);
                const result = await resetPassword(email.trim());
                setLoading(false);
                if (result.success) {
                  toast({
                    title: 'Check your inbox',
                    description: `We sent a password reset link to ${email.trim()}.`,
                  });
                  setMode('signin');
                } else {
                  toast({
                    title: 'Error',
                    description: result.error ?? 'Could not send reset email.',
                    variant: 'destructive',
                  });
                }
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="recovery-email">Email</Label>
                <Input
                  id="recovery-email"
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                We&apos;ll email you a link to choose a new password.
              </p>
              <div className="space-y-2 pt-2">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending...' : 'Send reset link'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setMode('signin')}
                  disabled={loading}
                >
                  Back to Sign In
                </Button>
              </div>
            </form>
          )}
```

**Change 5.5** — Delete the `mode === 'otp'` JSX block (lines 354-413 in the original). The whole `<form>` for OTP should be removed because no UI transitions to `'otp'` anymore (Task 5.3 removed the mode). After this change, the only remaining consumer of `setOtp` and `setNewPassword` is gone, which is why Task 5.2 removed those state lines.

**Commit**: `fix(auth): rewrite forgot-password to use email and Supabase resetPasswordForEmail`

**Verification**:
```sh
cd "C:/Users/deepa/Downloads/musclewebsite test 2/art-decoder-tool"
npx tsc -b --noEmit
```
Expected: exit 0, no output.

```sh
cd "C:/Users/deepa/Downloads/musclewebsite test 2/art-decoder-tool"
grep -n "recovery-phone\|recoveryPhone\|'otp'\|Twilio" src/pages/Auth.tsx
```
Expected: no matches.

```sh
cd "C:/Users/deepa/Downloads/musclewebsite test 2/art-decoder-tool"
grep -n "resetPassword\|resetPasswordForEmail" src/pages/Auth.tsx
```
Expected: at least 2 matches (the destructure and the call site).

---

### Task 6 — `fix(auth): correct misleading "Username already taken" error`

**File**: `src/contexts/AuthContext.tsx`

**Background**: Supabase's "already registered" / "already been registered" error is raised when the **email** is already in `auth.users`, not when the username is. The current code (lines 166-167 and 181) tells the user their username is taken, which is confusing and wrong. One-line copy fix in two places.

**Change 6.1** — Line 167. Replace:

```tsx
          return { success: false, error: 'Username already taken. Please try a different one.' };
```

with:

```tsx
          return { success: false, error: 'An account with that email already exists. Please sign in or use a different email.' };
```

**Change 6.2** — Line 181. Replace:

```tsx
        return { success: false, error: 'Username already taken. Please try a different one.' };
```

with:

```tsx
        return { success: false, error: 'An account with that email already exists. Please sign in or use a different email.' };
```

**Commit**: `fix(auth): correct misleading "Username already taken" error to reference email`

**Verification**:
```sh
cd "C:/Users/deepa/Downloads/musclewebsite test 2/art-decoder-tool"
npx tsc -b --noEmit
```
Expected: exit 0, no output.

```sh
cd "C:/Users/deepa/Downloads/musclewebsite test 2/art-decoder-tool"
grep -n "Username already taken" src/contexts/AuthContext.tsx
```
Expected: no matches.

```sh
cd "C:/Users/deepa/Downloads/musclewebsite test 2/art-decoder-tool"
grep -n "An account with that email already exists" src/contexts/AuthContext.tsx
```
Expected: 2 matches.

---

### Task 7 — Full regression sweep

**Files**: none (verification only)

**Verification** (run all of these in order; all should pass):

```sh
cd "C:/Users/deepa/Downloads/musclewebsite test 2/art-decoder-tool"
npx tsc -b --noEmit
```
Expected: exit 0.

```sh
cd "C:/Users/deepa/Downloads/musclewebsite test 2/art-decoder-tool"
npm run lint
```
Expected: exit 0. Pre-existing warnings about `react-refresh/only-export-components` are OK — the baseline already had them and the project's `eslint.config.js` only treats them as warnings.

```sh
cd "C:/Users/deepa/Downloads/musclewebsite test 2/art-decoder-tool"
npm run build
```
Expected: exit 0, `dist/index.html` exists, `dist/assets/` populated.

```sh
cd "C:/Users/deepa/Downloads/musclewebsite test 2/art-decoder-tool"
grep -rn "throw new Error(\"Media failed to load\"\|/api/onboarding/preferences\|recoveryPhone\|Username already taken" src/ supabase/
```
Expected: no matches.

```sh
cd "C:/Users/deepa/Downloads/musclewebsite test 2/art-decoder-tool"
git log --oneline -7
```
Expected: 7 new commits, all using the conventional prefixes `fix:` / `feat:` / `chore:`.

If any of these fail, do **not** merge the work — fix the regression first.

---

## Tests / validation

The project has no test runner. Validation is the manual verification block at the end of each task. The full project post-state is verified in Task 7.

If the user wants a test runner added in a follow-up, the highest-leverage tests to write first would be:
- `Onboarding.handleSubmit` writes to `localStorage` and calls `supabase.from('profiles').update({ preferences })` — would need a Supabase mock.
- `AuthContext.signUp` returns the email-correct error for an existing-email conflict — would need a Supabase mock.
- `ExerciseVideoPlayer` renders the inline fallback when `<video onError>` fires — would need a DOM/Video mock.

Out of scope for this plan.

---

## Risks, tradeoffs, and open questions

**Risks**
- **Migration not applied locally.** The project has no local Postgres, so `supabase db push` must be run by the user in their environment. If the column does not exist when `Onboarding` is deployed, the save will throw and the user will see the inline error toast — they will NOT lose the `localStorage` write (the localStorage write is wrapped in its own `try/catch` and runs *before* the Supabase call).
- **Removed `mode === 'otp'` UI** in Task 5. If a future feature plans to bring back phone-OTP, this plan makes that harder. Mitigation: a `git log -S "'otp'"` finds the deletion in 5.3 / 5.5.
- **Video fallback uses the same `PlayCircle` icon** in two places (Task 1 and Task 2). If the icon is renamed in `lucide-react`, both must be updated. Mitigation: Task 1 and Task 2 land together.
- **`auth_user_id` lookup in `Onboarding.handleSubmit`** uses `user.authUserId` (the new field exposed by the `b546637` refactor). If that field is ever dropped from `useAuth()` again, the save silently targets the wrong row. The TypeScript compiler will catch this — there is no `any` — but the implementer should not refactor the `User` shape during this plan.

**Tradeoffs**
- We add a new Supabase migration instead of `localStorage`-only because the schema already has `auth_user_id` and RLS that lets the owning user update their own row. Adding a `preferences jsonb` column is the minimal change that gives logged-in users a server-side record. The alternative (localStorage only) was rejected because it does not survive a device switch and breaks any future server-side personalization.
- We delete the OTP UI rather than keeping it as dead code. The alternative (keeping `'otp'` in the union as a never-rendered mode) adds noise to the file. Deleting is cleaner and the implementation is recoverable from git history.

**Open questions for the user before execution**
1. Confirm the new migration name `20260902024538_add_profiles_preferences.sql` is acceptable (the project uses `<timestamp>_<uuid>.sql`, but `uuid` is a Postgres concern — for our local file, timestamp-only is fine and already used by some migrations like `20260427000000_gymbuddy_schema.sql`).
2. Confirm the redirect URL for the Supabase password-reset email is `${window.location.origin}/auth`. Alternative: set up a dedicated `/reset-password` route. The plan defaults to the simpler option (use the existing `/auth` page) — if a dedicated page is required, add it as a small follow-up.
3. Confirm `supabase db push` will be run by the user; the implementer cannot do it from this environment.

---

## Execution order (if delegating to a subagent)

Tasks 1 → 2 → 3 → 4 → 5 → 6 → 7, in that order, one commit per task. Do not start a task until the previous task's verification block passes. The implementer should run `git status` and `git diff --stat` after every task to confirm the diff scope matches this plan.

Estimated wall time: 60–90 minutes for a careful implementer with no prior context. Lower bound with a fast implementer: 30 minutes.
