-- ChainBrief Supabase schema
-- Run this file in the Supabase SQL Editor when you are ready to create the database.
-- The current website remains static; these tables are for future admin/content workflows.

create extension if not exists pgcrypto;

-- Profiles store admin/editor account metadata linked to Supabase Auth users.
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'editor',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Categories organize articles and future content by desk or topic.
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Sources store attribution details for imported, syndicated, or partner content.
create table if not exists sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  website_url text,
  feed_url text,
  category text,
  is_active boolean not null default true,
  source_type text not null default 'editorial',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Articles power future news, sponsored articles, imported stories, and editorial pages.
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  category text,
  category_id uuid references categories(id) on delete set null,
  author text,
  author_id uuid references profiles(id) on delete set null,
  source_name text,
  source_id uuid references sources(id) on delete set null,
  source_url text,
  original_source_url text,
  featured_image text,
  status text not null default 'draft' check (status in ('draft', 'pending', 'published', 'rejected')),
  is_imported boolean not null default false,
  is_sponsored boolean not null default false,
  sponsor_name text,
  imported_at timestamptz,
  external_id text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  seo_title text,
  seo_description text,
  ai_rewritten_at timestamptz,
  ai_model text,
  ai_status text,
  ai_notes text,
  needs_review boolean not null default true
);

-- Banner ads manage future display placements across header, homepage, sidebar, and articles.
create table if not exists banner_ads (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  advertiser_name text,
  image_url text,
  target_url text,
  placement text not null,
  is_active boolean not null default false,
  start_date date,
  end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Crypto projects store future directory/profile data for ranking and discovery pages.
create table if not exists crypto_projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  symbol text,
  category text,
  short_description text,
  full_description text,
  chain text,
  website_url text,
  twitter_url text,
  telegram_url text,
  discord_url text,
  github_url text,
  whitepaper_url text,
  explorer_url text,
  contract_address text,
  imported_description text,
  imported_links_json jsonb,
  logo_url text,
  rank integer,
  score integer,
  tags text[] not null default '{}',
  highlights text[] not null default '{}',
  risks text[] not null default '{}',
  is_sponsored boolean not null default false,
  sponsor_label text,
  source_name text,
  source_url text,
  imported_at timestamptz,
  review_status text not null default 'approved',
  status text not null default 'draft' check (status in ('draft', 'pending', 'published', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Rankings define named ranking lists, such as "Top Crypto Projects".
create table if not exists rankings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ranking projects connect projects to a ranking with rank, score, notes, and metrics.
create table if not exists ranking_projects (
  id uuid primary key default gen_random_uuid(),
  ranking_id uuid not null references rankings(id) on delete cascade,
  project_id uuid not null references crypto_projects(id) on delete cascade,
  rank integer not null,
  score numeric(5, 2),
  note text,
  market_position text,
  ecosystem_strength text,
  developer_activity text,
  liquidity_profile text,
  highlights text[] not null default '{}',
  risks text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (ranking_id, project_id),
  unique (ranking_id, rank)
);

-- Contact requests store future messages from the Contact page.
create table if not exists contact_requests (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null,
  company_project text,
  project_website text,
  inquiry_type text,
  messenger_contact text,
  message text,
  status text not null default 'new' check (status in ('new', 'in_review', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Project submissions mirror the static /submit-project form for future review workflows.
create table if not exists project_submissions (
  id uuid primary key default gen_random_uuid(),
  project_name text not null,
  website text,
  category text,
  chain text,
  token_symbol text,
  contact_email text not null,
  telegram text,
  twitter text,
  short_description text,
  campaign_interests text[] not null default '{}',
  status text not null default 'new' check (status in ('new', 'in_review', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_status_published_at_idx on articles (status, published_at desc);
create index if not exists articles_slug_idx on articles (slug);
create index if not exists articles_imported_status_idx on articles (is_imported, status);
create index if not exists articles_original_source_url_idx on articles (original_source_url);
create index if not exists articles_external_id_idx on articles (external_id);
create index if not exists articles_ai_status_idx on articles (ai_status);
create index if not exists articles_needs_review_idx on articles (needs_review);
create index if not exists sources_active_idx on sources (is_active);
create index if not exists banner_ads_placement_active_idx on banner_ads (placement, is_active);
create index if not exists crypto_projects_slug_idx on crypto_projects (slug);
create index if not exists crypto_projects_rank_idx on crypto_projects (rank);
create index if not exists crypto_projects_imported_at_idx on crypto_projects (imported_at desc);
create index if not exists crypto_projects_review_status_idx on crypto_projects (review_status);
create index if not exists crypto_projects_source_url_idx on crypto_projects (source_url);
create index if not exists crypto_projects_contract_address_idx
  on crypto_projects (contract_address)
  where contract_address is not null;
create index if not exists project_submissions_status_idx on project_submissions (status, created_at desc);
