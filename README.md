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
ADMIN_PASSWORD=your-admin-password
CRON_SECRET=your-random-cron-secret
COINGECKO_API_KEY=your-coingecko-demo-api-key
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-5.4-mini
AI_REWRITE_ENABLED=false
```

10. Later, add the same values to Vercel Environment Variables before deploying Supabase-connected features.

Important: keep `SUPABASE_SERVICE_ROLE_KEY` and `CRON_SECRET` private. They are only for server/admin code and must never be exposed in public client components.

## CoinGecko Market Data Setup

ChainBrief uses CoinGecko market data on `/markets` and the homepage market sections. The data is fetched server-side, cached for a few minutes, and never exposes the API key to browser components.

Setup:

1. Create a CoinGecko Demo API key.
2. Add it to `.env.local`:

```bash
COINGECKO_API_KEY=your-coingecko-demo-api-key
```

3. Add the same `COINGECKO_API_KEY` to Vercel Environment Variables.
4. Restart the local dev server after changing `.env.local`.

If `COINGECKO_API_KEY` is missing, ChainBrief tries the public keyless CoinGecko endpoint. If CoinGecko is unavailable, rate-limited, or blocked, ChainBrief falls back to sample market data from `lib/siteData.ts`.

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

## AI Rewrite Setup

ChainBrief can generate an original admin-only draft from imported RSS metadata already stored in Supabase. AI rewrite is optional and disabled by default. The AI rewrite assistant does not scrape original article pages, does not publish content automatically, and does not expose the OpenAI API key to client components.

Database migration:

1. Open Supabase -> SQL Editor.
2. Open `sql/add_ai_article_fields.sql` in this repository.
3. Paste the SQL into Supabase.
4. Run it once.

OpenAI setup:

1. Create an OpenAI API key.
2. Add `OPENAI_API_KEY` to `.env.local`.
3. Add `OPENAI_API_KEY` to Vercel Environment Variables.
4. Optionally set `OPENAI_MODEL`. If omitted, ChainBrief uses `gpt-5.4-mini`.
5. Set `AI_REWRITE_ENABLED=true` only when OpenAI API billing/quota is available.

If `AI_REWRITE_ENABLED` is not exactly `true`, the admin UI will not show the Generate AI Rewrite button and will not call OpenAI. Manual article editing still works normally.

Editorial workflow:

1. Import RSS articles into the pending queue.
2. Open a pending imported article in `/admin/articles`.
3. Use **Generate AI Rewrite** only when AI rewrite is enabled.
4. Review and edit title, slug, excerpt, content, SEO title, SEO description, facts, and source attribution.
5. Save manually.
6. Publish manually only after review.

Do not publish generated text without checking facts, source attribution, and editorial tone. AI rewrite creates draft content only; the admin remains responsible for review.

## Automated RSS Import

ChainBrief includes a cron-ready RSS import endpoint for scheduled imports. It uses the same import logic as `/admin/import`, and imported articles remain `pending` until reviewed and published by an admin.

Vercel Cron is configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/import-news",
      "schedule": "0 9 * * *"
    }
  ]
}
```

Vercel Hobby supports daily cron only. Current schedule: daily at 09:00 UTC.

Setup:

1. Add RSS sources in `/admin/sources`.
2. Add `CRON_SECRET` to `.env.local`.
3. Add the same `CRON_SECRET` to Vercel Environment Variables.
4. Use this endpoint:

```bash
/api/cron/import-news
```

The endpoint will not run if `CRON_SECRET` is missing or incorrect. Call it with an authorization header:

```bash
curl -H "Authorization: Bearer YOUR_SECRET" http://localhost:3000/api/cron/import-news
```

For systems that cannot set headers, the endpoint also accepts `?secret=YOUR_SECRET`, but the `Authorization` header is preferred. Public `/news` still only shows articles with `status = published`.

Manual import is still available from `/admin/import`. More frequent import requires Vercel Pro or an external cron service.

After deployment, check Vercel dashboard cron logs to confirm scheduled runs. Imported articles remain pending; public `/news` only shows published articles.
