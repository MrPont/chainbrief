-- Run this once in Supabase SQL Editor if your crypto_projects table was
-- created before admin project management was added.

alter table crypto_projects
  add column if not exists telegram_url text,
  add column if not exists logo_url text,
  add column if not exists rank integer,
  add column if not exists score integer,
  add column if not exists highlights text[] not null default '{}',
  add column if not exists risks text[] not null default '{}',
  add column if not exists source_name text,
  add column if not exists source_url text,
  add column if not exists imported_at timestamptz,
  add column if not exists review_status text not null default 'approved';

create index if not exists crypto_projects_rank_idx on crypto_projects (rank);
create index if not exists crypto_projects_imported_at_idx on crypto_projects (imported_at desc);
create index if not exists crypto_projects_review_status_idx on crypto_projects (review_status);
create index if not exists crypto_projects_source_url_idx on crypto_projects (source_url);
