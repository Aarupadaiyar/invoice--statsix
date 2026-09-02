-- Run this in the Supabase SQL Editor if your database predates customer logos.
-- (Also included idempotently in schema.sql.)
alter table public.customers add column if not exists logo_data_url text not null default '';
