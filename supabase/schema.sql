-- Invoice & Receipt Generator: database schema and Row Level Security policies.
-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query) after project creation.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- business_profiles: one row per user, holds company/branding/payment defaults
-- ---------------------------------------------------------------------------
create table if not exists public.business_profiles (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null unique references auth.users(id) on delete cascade,
  business_name         text not null default '',
  logo_data_url         text not null default '',
  address               text not null default '',
  phone                 text not null default '',
  email                 text not null default '',
  website               text not null default '',
  tax_id                text not null default '',
  default_currency      text not null default 'USD',
  default_payment_terms text not null default 'Due on receipt',
  invoice_prefix        text not null default 'INV-',
  receipt_prefix        text not null default 'REC-',
  default_notes         text not null default '',
  default_terms         text not null default '',
  bank_name             text not null default '',
  account_holder_name   text not null default '',
  account_number        text not null default '',
  ifsc_code             text not null default '',
  swift_code            text not null default '',
  upi_id                text not null default '',
  payment_link          text not null default '',
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- customers: address book scoped per user
-- ---------------------------------------------------------------------------
create table if not exists public.customers (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  name             text not null,
  company          text not null default '',
  email            text not null default '',
  phone            text not null default '',
  billing_address  text not null default '',
  shipping_address text not null default '',
  tax_id           text not null default '',
  logo_data_url    text not null default '',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Safe to re-run: adds the column for databases created before customer logos existed.
alter table public.customers add column if not exists logo_data_url text not null default '';

create index if not exists customers_user_id_idx on public.customers(user_id);

-- ---------------------------------------------------------------------------
-- counters: atomic per-user, per-type, per-prefix document numbering
-- ---------------------------------------------------------------------------
create table if not exists public.counters (
  id      uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type    text not null check (type in ('invoice', 'receipt')),
  prefix  text not null,
  value   integer not null default 0,
  unique (user_id, type, prefix)
);

-- ---------------------------------------------------------------------------
-- documents: invoices and receipts
-- ---------------------------------------------------------------------------
create table if not exists public.documents (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  customer_id      uuid references public.customers(id) on delete set null,
  document_type    text not null check (document_type in ('invoice', 'receipt')),
  document_title   text not null default '',
  document_number  text not null,
  status           text not null,
  issue_date       date not null,
  due_date         date,
  payment_date     date,
  payment_method   text,
  currency         text not null default 'USD',
  business_details jsonb not null default '{}'::jsonb,
  customer_details jsonb not null default '{}'::jsonb,
  line_items       jsonb not null default '[]'::jsonb,
  extra_charge     jsonb not null default '{}'::jsonb,
  subtotal         numeric(14, 2) not null default 0,
  discount_total   numeric(14, 2) not null default 0,
  tax_total        numeric(14, 2) not null default 0,
  shipping_total   numeric(14, 2) not null default 0,
  total            numeric(14, 2) not null default 0,
  amount_paid      numeric(14, 2) not null default 0,
  notes            text not null default '',
  terms            text not null default '',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (user_id, document_type, document_number)
);

-- Safe to re-run: adds the column for databases created before document_title existed.
alter table public.documents add column if not exists document_title text not null default '';

create index if not exists documents_user_id_idx on public.documents(user_id);
create index if not exists documents_user_type_idx on public.documents(user_id, document_type);
create index if not exists documents_user_status_idx on public.documents(user_id, status);

-- ---------------------------------------------------------------------------
-- updated_at maintenance trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.business_profiles;
create trigger set_updated_at before update on public.business_profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.customers;
create trigger set_updated_at before update on public.customers
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.documents;
create trigger set_updated_at before update on public.documents
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security: every table is scoped strictly to auth.uid()
-- ---------------------------------------------------------------------------
alter table public.business_profiles enable row level security;
alter table public.customers enable row level security;
alter table public.counters enable row level security;
alter table public.documents enable row level security;

drop policy if exists "business_profiles_select_own" on public.business_profiles;
drop policy if exists "business_profiles_insert_own" on public.business_profiles;
drop policy if exists "business_profiles_update_own" on public.business_profiles;
drop policy if exists "business_profiles_delete_own" on public.business_profiles;

create policy "business_profiles_select_own" on public.business_profiles
  for select using (auth.uid() = user_id);
create policy "business_profiles_insert_own" on public.business_profiles
  for insert with check (auth.uid() = user_id);
create policy "business_profiles_update_own" on public.business_profiles
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "business_profiles_delete_own" on public.business_profiles
  for delete using (auth.uid() = user_id);

drop policy if exists "customers_select_own" on public.customers;
drop policy if exists "customers_insert_own" on public.customers;
drop policy if exists "customers_update_own" on public.customers;
drop policy if exists "customers_delete_own" on public.customers;

create policy "customers_select_own" on public.customers
  for select using (auth.uid() = user_id);
create policy "customers_insert_own" on public.customers
  for insert with check (auth.uid() = user_id);
create policy "customers_update_own" on public.customers
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "customers_delete_own" on public.customers
  for delete using (auth.uid() = user_id);

drop policy if exists "counters_select_own" on public.counters;
drop policy if exists "counters_all_own" on public.counters;

create policy "counters_select_own" on public.counters
  for select using (auth.uid() = user_id);
create policy "counters_all_own" on public.counters
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "documents_select_own" on public.documents;
drop policy if exists "documents_insert_own" on public.documents;
drop policy if exists "documents_update_own" on public.documents;
drop policy if exists "documents_delete_own" on public.documents;

create policy "documents_select_own" on public.documents
  for select using (auth.uid() = user_id);
create policy "documents_insert_own" on public.documents
  for insert with check (auth.uid() = user_id);
create policy "documents_update_own" on public.documents
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "documents_delete_own" on public.documents
  for delete using (auth.uid() = user_id);
