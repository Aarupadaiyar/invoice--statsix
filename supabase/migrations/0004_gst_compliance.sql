-- Run this in the Supabase SQL Editor if your database predates GST compliance fields.
-- (Also included idempotently in schema.sql.) Note: schema.sql is always the safest option
-- to re-run in full, since every statement in it is idempotent.
alter table public.business_profiles add column if not exists state text not null default '';
alter table public.business_profiles add column if not exists signature_data_url text not null default '';
alter table public.business_profiles add column if not exists authorized_signatory text not null default '';
alter table public.documents add column if not exists place_of_supply text not null default '';
