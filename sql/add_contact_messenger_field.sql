-- ChainBrief contact requests migration
-- Run this if your Supabase project was created before the optional Telegram / WhatsApp field.
-- It adds a nullable messenger_contact field without changing existing rows.

alter table contact_requests
  add column if not exists messenger_contact text;
