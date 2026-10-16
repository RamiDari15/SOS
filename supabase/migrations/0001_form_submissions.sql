-- Form submissions for the Students Organize For Syria website (app/api/forms/route.ts).
-- Written only by the site's server with the service-role key, which bypasses RLS.
-- RLS is enabled with NO policies, so the anon/authenticated keys can neither read nor write.

create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  type text not null check (type in ('contact', 'member', 'chapter', 'newsletter')),
  fields jsonb not null,
  page text,
  ip_hash text
);

create index if not exists form_submissions_type_created_at_idx
  on public.form_submissions (type, created_at desc);

alter table public.form_submissions enable row level security;

-- Belt and braces: remove the default grants from the public API roles.
revoke all on table public.form_submissions from anon, authenticated;

comment on table public.form_submissions is
  'Website form submissions (contact, member, chapter, newsletter). Service role only; no public RLS policies.';
