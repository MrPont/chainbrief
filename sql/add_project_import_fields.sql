-- ChainBrief project import migration
-- Run this after sql/schema.sql if your crypto_projects table was created
-- before draft-based project import support.
-- It adds attribution and review fields without deleting existing project data.

alter table crypto_projects
  add column if not exists source_name text,
  add column if not exists source_url text,
  add column if not exists imported_at timestamptz,
  add column if not exists review_status text not null default 'approved';

create index if not exists crypto_projects_imported_at_idx
  on crypto_projects (imported_at desc);

create index if not exists crypto_projects_review_status_idx
  on crypto_projects (review_status);

create index if not exists crypto_projects_source_url_idx
  on crypto_projects (source_url);
