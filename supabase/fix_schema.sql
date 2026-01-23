-- Fix Products Table Schema to match Frontend Types

-- 1. Add missing columns to products table if they don't exist
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'products' and column_name = 'stock') then
        alter table public.products add column stock integer default 0;
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'products' and column_name = 'visible') then
        alter table public.products add column visible boolean default true;
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'products' and column_name = 'sale_price') then
        alter table public.products add column sale_price numeric;
    end if;
end $$;

-- 2. Ensure Realtime is enabled for products (Supabase specific, usually done via Dashboard but we can try setting replica identity)
alter table public.products replica identity full;

-- 3. Verify Policies (Already good in schema.sql, but ensuring here)
-- Allow public read access
drop policy if exists "Public read access" on public.products;
create policy "Public read access" on public.products for select using (true);

-- Allow authenticated (admin) full access
drop policy if exists "Authenticated admin access" on public.products;
create policy "Authenticated admin access" on public.products for all using (true) with check (true);

-- 4. Fix Orders Table if needed (just in case)
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'sale_items' and column_name = 'product_snapshot') then
        -- Add snapshot column for historical data integrity if needed later
        alter table public.sale_items add column product_snapshot jsonb;
    end if;
end $$;

