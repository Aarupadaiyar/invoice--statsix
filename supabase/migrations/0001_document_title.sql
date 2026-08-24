-- Run this in the Supabase SQL Editor if your database was created before
-- document_title existed. (Also included idempotently in schema.sql.)
alter table public.documents add column if not exists document_title text not null default '';
