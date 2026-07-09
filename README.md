This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Supabase Setup

ChainBrief is still a static MVP. Supabase files are included for the future admin/content system, but the live pages are not connected to Supabase yet.

1. Create a new project at [Supabase](https://supabase.com).
2. Open the Supabase project dashboard.
3. Go to **SQL Editor**.
4. Open `sql/schema.sql` in this repository.
5. Paste the full SQL file into the Supabase SQL Editor.
6. Run the SQL to create the ChainBrief tables.
7. In Supabase, go to **Project Settings** -> **API**.
8. Copy the project URL and anon public key.
9. Create a local `.env.local` file based on `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_STORAGE_BUCKET=chainbrief-media
SITE_URL=https://your-domain.example
SITE_NAME=ChainBrief
```

10. Later, add the same values to Vercel Environment Variables before deploying Supabase-connected features.

Important: keep `SUPABASE_SERVICE_ROLE_KEY` private. It is only for server/admin code and must never be exposed in public client components.

## Supabase Storage Setup

ChainBrief admin image uploads use Supabase Storage.

1. Go to Supabase -> Storage.
2. Create a public bucket called `chainbrief-media`.
3. Enable file size restriction.
4. Set the bucket max file size to 5 MB.
5. Enable MIME type restriction.
6. Allow these MIME types:
   - `image/jpeg`
   - `image/png`
   - `image/webp`
   - `image/gif`
   - `image/svg+xml`
7. Uploaded admin images are saved to Supabase Storage.
8. Public image URLs are stored in article, banner, and project records.

If `SUPABASE_STORAGE_BUCKET` is missing, the app falls back to `chainbrief-media`.

## News Import Setup

ChainBrief can import RSS items into an admin review queue. Imported stories are saved as `pending` articles and are not visible on the public news pages until an admin reviews, edits, and publishes them.

If your Supabase database was created before RSS import support, run the migration first:

1. Open Supabase -> SQL Editor.
2. Open `sql/add_news_import_fields.sql` in this repository.
3. Paste the SQL into Supabase.
4. Run it once.

Then use the admin workflow:

1. Go to `/admin/sources`.
2. Add RSS sources with a name, slug, website URL, feed URL, category, and active status.
3. Go to `/admin/import`.
4. Click **Import Latest News**.
5. Imported items appear in `/admin/articles` with `Pending` and `Imported` badges.
6. Review and edit each imported article before publishing.

Important: RSS import should only store attribution, title, source URL, original article URL, published date, and a short RSS-provided excerpt when available. Do not copy full copyrighted articles into ChainBrief.
