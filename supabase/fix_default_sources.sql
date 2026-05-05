-- Run this in Supabase SQL Editor to fix the new user trigger
-- Removes personal sample sources (Retro Camera Land, Uniqbee, Onnoshot) from default set

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');

  insert into public.sources (user_id, name, emoji, color, type, is_default) values
    (new.id, 'Freelance', '💻', '#EAB308', 'income', true),
    (new.id, 'Maaş', '💼', '#22C55E', 'income', true),
    (new.id, 'Yatırım', '📈', '#3B82F6', 'income', true),
    (new.id, 'Kira', '🏠', '#8B5CF6', 'expense', true),
    (new.id, 'Market', '🛒', '#F97316', 'expense', true),
    (new.id, 'Ulaşım', '🚗', '#06B6D4', 'expense', true),
    (new.id, 'Yeme-İçme', '🍽️', '#EF4444', 'expense', true),
    (new.id, 'Abonelikler', '📺', '#14B8A6', 'expense', true),
    (new.id, 'Eğlence', '🎬', '#A855F7', 'expense', true);

  return new;
end;
$$;
