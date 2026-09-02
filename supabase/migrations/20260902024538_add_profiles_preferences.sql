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
