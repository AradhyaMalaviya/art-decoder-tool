# Vercel Deployment

## 1. Upload exercise media to Supabase Storage

Add a `SUPABASE_SERVICE_ROLE_KEY` to your shell or `.env.local`, then run:

```sh
npm run upload:exercise-media
```

This creates or updates the public `exercise-media` bucket and uploads:

- `videos/*.mp4`
- `posters/*.svg`

## 2. Apply Supabase migrations

Run your normal Supabase migration flow so the new storage bucket policy is created:

```sh
supabase db push
```

If you manage migrations in the Supabase dashboard instead, apply the SQL from the new migration there.

## 3. Deploy the frontend to Vercel

Import the GitHub repository into Vercel and use:

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

Set these environment variables in Vercel:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## 4. Verify the production site

- Refresh a deep link like `/exercise/1` to confirm SPA rewrites work.
- Open `/exercises` and confirm the page loads poster images only.
- Open an exercise detail and confirm the video loads only in the focused view.
