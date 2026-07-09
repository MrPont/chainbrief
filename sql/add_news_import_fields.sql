-- ChainBrief news import migration
-- Run this after sql/schema.sql if your Supabase project was created before RSS import support.
-- It adds RSS source fields and import attribution fields without deleting existing data.

alter table sources
  add column if not exists slug text,
  add column if not exists feed_url text,
  add column if not exists category text,
  add column if not exists is_active boolean not null default true;

alter table articles
  add column if not exists original_source_url text,
  add column if not exists imported_at timestamptz,
  add column if not exists external_id text;

create unique index if not exists sources_slug_unique_idx
  on sources (slug)
  where slug is not null;

create index if not exists sources_active_idx on sources (is_active);
create index if not exists articles_original_source_url_idx on articles (original_source_url);
create index if not exists articles_external_id_idx on articles (external_id);
create index if not exists articles_imported_status_idx on articles (is_imported, status);
