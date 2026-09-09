-- Run this in the Supabase SQL Editor if your database predates business shipping addresses.
-- (Also included idempotently in schema.sql.)
alter table public.business_profiles add column if not exists shipping_address text not null default '';
