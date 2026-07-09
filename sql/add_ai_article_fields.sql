-- ChainBrief AI rewrite migration
-- Run this after sql/schema.sql if your Supabase project was created before AI rewrite support.
-- It adds editorial review metadata without changing existing article content.

alter table articles
  add column if not exists ai_rewritten_at timestamptz,
  add column if not exists ai_model text,
  add column if not exists ai_status text,
  add column if not exists ai_notes text,
  add column if not exists needs_review boolean not null default true;

create index if not exists articles_ai_status_idx on articles (ai_status);
create index if not exists articles_needs_review_idx on articles (needs_review);
