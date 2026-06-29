-- Extensions nécessaires
create extension if not exists "uuid-ossp";
create extension if not exists "btree_gist";

-- Table des profils (liée à Supabase Auth)
create table if not exists profils (
    id uuid references auth.users on delete cascade primary key,
    nom_complet text not null,
    role text not null check (role in ('promoteur', 'gerant_salle', 'admin')),
    email text,
    telephone text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger: auto-créer un profil lors de l'inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profils (id, nom_complet, email, role)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'nom_complet', ''),
        new.email,
        coalesce(new.raw_user_meta_data->>'role', 'promoteur')
    );
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- Trigger: updated_at automatique
create or replace function public.update_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

create trigger profils_updated_at
    before update on profils
    for each row execute procedure public.update_updated_at();

-- RLS
alter table profils enable row level security;

create policy "Un utilisateur voit uniquement son profil"
    on profils for select
    using (auth.uid() = id);

create policy "Un utilisateur modifie uniquement son profil"
    on profils for update
    using (auth.uid() = id);
