-- Запусти это в Supabase → SQL Editor → New query

-- Таблица профилей пользователей
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  created_at timestamp with time zone default now()
);

-- Таблица покупок
create table if not exists public.purchases (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  product_id integer not null,
  product_title text not null,
  amount integer not null,
  status text default 'paid',
  download_url text,
  created_at timestamp with time zone default now()
);

-- Таблица заявок
create table if not exists public.requests (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status text default 'new',
  created_at timestamp with time zone default now()
);

-- Автоматически создаём профиль при регистрации
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS — каждый видит только свои данные
alter table public.profiles enable row level security;
alter table public.purchases enable row level security;
alter table public.requests enable row level security;

create policy "Свой профиль" on public.profiles
  for all using (auth.uid() = id);

create policy "Свои покупки" on public.purchases
  for all using (auth.uid() = user_id);

create policy "Заявки — только запись" on public.requests
  for insert with check (true);
