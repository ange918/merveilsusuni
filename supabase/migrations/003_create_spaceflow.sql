-- ==========================================
-- MODULE 2 : SPACEFLOW (Gestion de Salles)
-- ==========================================

-- Table des espaces / salles
create table if not exists espaces (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references profils(id) on delete cascade not null,
    nom text not null,
    description text,
    capacite integer not null check (capacite > 0),
    tarif_base numeric(10, 2) not null check (tarif_base >= 0),
    adresse text,
    options jsonb default '{}',  -- ex: {"sono": 150, "chaises": 5, "traiteur": 200}
    actif boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create trigger espaces_updated_at
    before update on espaces
    for each row execute procedure public.update_updated_at();

-- Table des clients
create table if not exists clients (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references profils(id) on delete cascade not null,
    nom_complet text not null,
    telephone text not null,
    email text,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create trigger clients_updated_at
    before update on clients
    for each row execute procedure public.update_updated_at();

-- Table des réservations (avec contrainte anti-overlap native PostgreSQL)
create table if not exists reservations (
    id uuid default uuid_generate_v4() primary key,
    espace_id uuid references espaces(id) on delete cascade not null,
    client_id uuid references clients(id) on delete set null,
    date_debut timestamp with time zone not null,
    date_fin timestamp with time zone not null,
    statut_reservation text default 'Option' check (statut_reservation in ('Option', 'Confirme', 'Annule')),
    statut_paiement text default 'En attente' check (statut_paiement in ('En attente', 'Acompte verse', 'Solde')),
    montant_total numeric(10, 2) not null check (montant_total >= 0),
    acompte_verse numeric(10, 2) default 0.00 check (acompte_verse >= 0),
    options_selectionnees jsonb default '{}',  -- options choisies avec leurs prix
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

    -- Validation : date_fin > date_debut
    constraint reservation_dates_valides check (date_fin > date_debut),

    -- Contrainte anti-overlap au niveau BDD (nécessite btree_gist)
    constraint no_overlap_reservation exclude using gist (
        espace_id with =,
        tstzrange(date_debut, date_fin, '[)') with &&
    )
);

create trigger reservations_updated_at
    before update on reservations
    for each row execute procedure public.update_updated_at();

-- Index pour les requêtes calendrier
create index idx_reservations_espace_dates on reservations using gist (
    espace_id,
    tstzrange(date_debut, date_fin, '[)')
);
create index idx_reservations_statut on reservations(statut_reservation, statut_paiement);

-- Table des paiements / transactions financières
create table if not exists paiements (
    id uuid default uuid_generate_v4() primary key,
    reservation_id uuid references reservations(id) on delete cascade not null,
    montant numeric(10, 2) not null check (montant > 0),
    type_paiement text not null check (type_paiement in ('acompte', 'solde', 'remboursement')),
    mode_paiement text check (mode_paiement in ('especes', 'virement', 'cheque', 'mobile_money', 'carte')),
    date_paiement timestamp with time zone default timezone('utc'::text, now()) not null,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_paiements_reservation on paiements(reservation_id);

-- RLS espaces
alter table espaces enable row level security;
create policy "Gérant accède à ses salles"
    on espaces for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- RLS clients
alter table clients enable row level security;
create policy "Gérant accède à ses clients"
    on clients for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- RLS reservations
alter table reservations enable row level security;
create policy "Gérant accède aux réservations de ses salles"
    on reservations for all
    using (
        exists (
            select 1 from espaces e
            where e.id = reservations.espace_id
            and e.user_id = auth.uid()
        )
    )
    with check (
        exists (
            select 1 from espaces e
            where e.id = reservations.espace_id
            and e.user_id = auth.uid()
        )
    );

-- RLS paiements
alter table paiements enable row level security;
create policy "Gérant accède aux paiements de ses réservations"
    on paiements for all
    using (
        exists (
            select 1 from reservations r
            join espaces e on e.id = r.espace_id
            where r.id = paiements.reservation_id
            and e.user_id = auth.uid()
        )
    );
