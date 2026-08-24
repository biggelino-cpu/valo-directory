-- Shared community submissions. Unowned rows (no user_id): anyone can submit,
-- listings stay pending until a reviewer approves them into the catalog.
create table if not exists submissions (
  id text primary key,
  slug text not null unique,
  name text not null,
  website_url text not null,
  category text not null,
  short_description text not null,
  description text not null default '',
  platforms text not null,
  pricing text not null,
  review_status text not null default 'pending',
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create unique index if not exists submissions_website_url_lower_idx
  on submissions (lower(website_url));

create index if not exists submissions_review_status_idx
  on submissions (review_status, created_at desc);
