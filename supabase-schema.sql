-- Запусти это в Supabase → SQL Editor → New query → Run

-- Профили пользователей
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  created_at timestamp with time zone default now()
);

-- Цифровые продукты (Conclave Digital)
create table if not exists public.products (
  id serial primary key,
  title text not null,
  description text,
  price integer not null,
  tag text default 'Промты',
  color text default '#2997ff',
  count text,
  unit text,
  file_url text,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Услуги (Conclave Tech)
create table if not exists public.services (
  id serial primary key,
  title text not null,
  description text,
  price_from integer,
  price_label text,
  tag text default 'Разработка',
  color text default '#2997ff',
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Покупки
create table if not exists public.purchases (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  product_id integer references public.products,
  product_title text not null,
  amount integer not null,
  status text default 'paid',
  created_at timestamp with time zone default now()
);

-- Заявки из поддержки
create table if not exists public.requests (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status text default 'new',
  created_at timestamp with time zone default now()
);

-- Отзывы
create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  product_title text,
  rating integer check (rating between 1 and 5),
  text text,
  is_published boolean default false,
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

-- RLS
alter table public.profiles enable row level security;
alter table public.purchases enable row level security;
alter table public.requests enable row level security;
alter table public.reviews enable row level security;
alter table public.products enable row level security;
alter table public.services enable row level security;

-- Политики
create policy "Свой профиль" on public.profiles for all using (auth.uid() = id);
create policy "Свои покупки" on public.purchases for all using (auth.uid() = user_id);
create policy "Заявки — только запись" on public.requests for insert with check (true);
create policy "Отзывы — своя запись" on public.reviews for insert with check (auth.uid() = user_id);
create policy "Продукты — все читают" on public.products for select using (is_active = true);
create policy "Услуги — все читают" on public.services for select using (is_active = true);

-- Начальные данные — продукты
insert into public.products (title, description, price, tag, color, count, unit) values
  ('Промт-пак для ChatGPT', '50 проверенных промтов для бизнеса, копирайтинга и маркетинга.', 490, 'Промты', '#2997ff', '50', 'промтов'),
  ('SEO-промты для контента', 'Шаблоны для написания SEO-статей с нуля через нейросеть.', 390, 'Промты', '#30d158', '30', 'шаблонов'),
  ('AI-ассистент для продаж', 'Готовый набор скриптов и промтов для отдела продаж.', 790, 'Продукт', '#bf5af2', '40', 'скриптов'),
  ('Промты для Midjourney', '100 визуальных промтов для генерации профессиональных изображений.', 590, 'Промты', '#ff9f0a', '100', 'промтов')
on conflict do nothing;

-- Начальные данные — услуги
insert into public.services (title, description, price_label, tag, color) values
  ('Сайт под ключ', 'Корпоративный сайт или лендинг. Дизайн, вёрстка, хостинг — без вашего участия.', 'от 15 000 ₽', 'Разработка', '#2997ff'),
  ('Telegram-бот', 'Бот для бизнеса: автоответы, каталог, оплата, уведомления.', 'от 8 000 ₽', 'Автоматизация', '#30d158'),
  ('AI-интеграция', 'Внедрение нейросети в ваш бизнес: чат-бот, генерация контента, анализ данных.', 'от 12 000 ₽', 'AI', '#bf5af2'),
  ('Промт-инжиниринг', 'Системные промты под ваши задачи и обучение команды работе с AI.', 'от 5 000 ₽', 'AI', '#ff9f0a')
on conflict do nothing;
