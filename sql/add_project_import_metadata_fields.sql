-- ChainBrief project import metadata migration
-- Run this after the project import migration if your crypto_projects table
-- was created before CoinGecko detail metadata support.
-- These fields are for admin review and attribution; they should not auto-publish projects.

alter table crypto_projects
  add column if not exists website_url text,
  add column if not exists twitter_url text,
  add column if not exists telegram_url text,
  add column if not exists chain text,
  add column if not exists discord_url text,
  add column if not exists github_url text,
  add column if not exists whitepaper_url text,
  add column if not exists explorer_url text,
  add column if not exists contract_address text,
  add column if not exists imported_description text,
  add column if not exists imported_links_json jsonb;

create index if not exists crypto_projects_contract_address_idx
  on crypto_projects (contract_address)
  where contract_address is not null;
