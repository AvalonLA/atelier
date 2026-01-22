-- Create config table
create table public.config (
  id serial primary key,
  site_name text default 'ATELIER',
  site_description text default 'Iluminación de Vanguardia',
  contact_email text default 'contact@atelier.com',
  contact_phone text default '+54 9 11 1234 5678',
  opening_hours text default 'Lun - Vie: 10:00 - 19:00',
  ai_active boolean default true,
  use_mock_data boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.config enable row level security;

-- Allow public read
create policy "Public config is viewable by everyone"
  on config for select
  using ( true );

-- Allow authenticated (or anon for now per project style) to update
-- Ideally this should be restricted to admin only
create policy "Allow updates to config"
  on config for update
  using ( true )
  with check ( true );

create policy "Allow inserts to config"
  on config for insert
  with check ( true );
