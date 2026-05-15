drop function if exists public.factory_file(integer);

create or replace function public.factory_file(i integer)
returns table(
  path text,
  mime_type text,
  size text,
  created_at timestamptz
)
language sql
as $$
  select
    format('/uploads/generated/file_%s.dat', i),
    (array['application/pdf', 'application/zip', 'text/plain'])[(i % 3) + 1],
    ((i * 137) % 100000 + 100)::text,
    now() - ((i % 365) || ' days')::interval;
$$;
