-- ChainBrief contact requests migration
-- Run this if your Supabase project was created before project website validation.
-- It adds a nullable project_website field without changing existing rows.

alter table contact_requests
  add column if not exists project_website text;
