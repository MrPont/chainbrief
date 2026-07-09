-- Run this once in Supabase SQL Editor if your crypto_projects table was
-- created before admin project management was added.

alter table crypto_projects
  add column if not exists telegram_url text,
  add column if not exists logo_url text,
  add column if not exists rank integer,
  add column if not exists score integer,
  add column if not exists highlights text[] not null default '{}',
  add column if not exists risks text[] not null default '{}';

create index if not exists crypto_projects_rank_idx on crypto_projects (rank);
