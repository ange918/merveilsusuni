-- ==========================================
-- MODULE 1 : AURAPLAN (Rétroplanning)
-- ==========================================

-- Table des événements
create table if not exists evenements (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references profils(id) on delete cascade not null,
    nom text not null,
    description text,
    date_evenement date not null,
    lieu text,
    statut text default 'actif' check (statut in ('actif', 'termine', 'annule')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create trigger evenements_updated_at
    before update on evenements
    for each row execute procedure public.update_updated_at();

-- Table des tâches du plan d'action
create table if not exists taches_plan_action (
    id uuid default uuid_generate_v4() primary key,
    evenement_id uuid references evenements(id) on delete cascade not null,
    titre text not null,
    description text,
    date_butoir date not null,
    statut text default 'À faire' check (statut in ('À faire', 'En cours', 'Terminé')),
    notification_envoyee boolean default false,
    priorite text default 'normale' check (priorite in ('basse', 'normale', 'haute', 'urgente')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create trigger taches_updated_at
    before update on taches_plan_action
    for each row execute procedure public.update_updated_at();

-- Index pour le cron J-7 (performances)
create index idx_taches_date_butoir on taches_plan_action(date_butoir, statut, notification_envoyee);
create index idx_evenements_user on evenements(user_id);

-- RLS evenements
alter table evenements enable row level security;

create policy "Accès à ses propres événements"
    on evenements for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- RLS taches
alter table taches_plan_action enable row level security;

create policy "Accès aux tâches de ses événements"
    on taches_plan_action for all
    using (
        exists (
            select 1 from evenements e
            where e.id = taches_plan_action.evenement_id
            and e.user_id = auth.uid()
        )
    )
    with check (
        exists (
            select 1 from evenements e
            where e.id = taches_plan_action.evenement_id
            and e.user_id = auth.uid()
        )
    );
