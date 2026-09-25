-- Ejecutar esto en Supabase: Dashboard > SQL Editor > New query.
-- Si ya habias creado la tabla match_results con el esquema anterior
-- (version sin equipos/calendario editables), borrala primero:
--   drop table if exists public.match_results;
-- y luego corre todo este archivo.

-- ================= EQUIPOS =================
create table if not exists public.teams (
  id text primary key,
  name text not null,
  logo_url text not null default '',
  sort_order integer not null default 0
);

-- ================= JUGADORES =================
create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  team_id text not null references public.teams(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0
);

-- ================= JORNADAS =================
create table if not exists public.matchdays (
  numero integer primary key,
  titulo text not null,
  fecha text not null,
  badge text,
  es_proxima boolean not null default false
);

-- ================= PARTIDOS =================
-- local_team_id / visitante_team_id: se usan cuando el rival ya es un
-- equipo real. local_label / visitante_label: se usan para partidos
-- que todavia no tienen equipo definido (ej. "1° Clasificado",
-- "Ganador Semifinal 1"). Solo uno de los dos (team_id o label) debe
-- tener valor en cada lado.
create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  jornada_numero integer not null references public.matchdays(numero) on delete cascade,
  orden integer not null default 0,
  local_team_id text references public.teams(id) on delete set null,
  local_label text,
  visitante_team_id text references public.teams(id) on delete set null,
  visitante_label text,
  hora text not null default ''
);

-- ================= RESULTADOS =================
create table if not exists public.match_results (
  match_id uuid primary key references public.matches(id) on delete cascade,
  goles_local integer,
  goles_visitante integer,
  eventos jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ================= SEGURIDAD (RLS) =================
alter table public.teams enable row level security;
alter table public.players enable row level security;
alter table public.matchdays enable row level security;
alter table public.matches enable row level security;
alter table public.match_results enable row level security;

-- Lectura publica (la pagina la ve cualquiera, sin sesion) en todas
-- las tablas.
create policy "Lectura publica" on public.teams for select using (true);
create policy "Lectura publica" on public.players for select using (true);
create policy "Lectura publica" on public.matchdays for select using (true);
create policy "Lectura publica" on public.matches for select using (true);
create policy "Lectura publica" on public.match_results for select using (true);

-- Escritura (insertar/actualizar/borrar) solo para el administrador
-- logueado (usuario creado en Authentication > Users).
create policy "Admin puede escribir equipos" on public.teams
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Admin puede escribir jugadores" on public.players
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Admin puede escribir jornadas" on public.matchdays
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Admin puede escribir partidos" on public.matches
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Admin puede escribir resultados" on public.match_results
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ================= TIEMPO REAL =================
-- Para que los cambios del administrador se vean al instante en la
-- pantalla de todo el mundo, sin recargar la pagina.
alter publication supabase_realtime add table public.teams;
alter publication supabase_realtime add table public.players;
alter publication supabase_realtime add table public.matchdays;
alter publication supabase_realtime add table public.matches;
alter publication supabase_realtime add table public.match_results;

-- ================= ESCUDOS (STORAGE) =================
-- Bucket publico para poder subir fotos como escudo de un equipo
-- directamente desde el panel de administrador.
insert into storage.buckets (id, name, public)
values ('team-logos', 'team-logos', true)
on conflict (id) do nothing;

create policy "Lectura publica de escudos"
  on storage.objects for select
  using (bucket_id = 'team-logos');

create policy "Admin puede subir escudos"
  on storage.objects for insert
  with check (bucket_id = 'team-logos' and auth.role() = 'authenticated');

create policy "Admin puede actualizar escudos"
  on storage.objects for update
  using (bucket_id = 'team-logos' and auth.role() = 'authenticated')
  with check (bucket_id = 'team-logos' and auth.role() = 'authenticated');

create policy "Admin puede borrar escudos"
  on storage.objects for delete
  using (bucket_id = 'team-logos' and auth.role() = 'authenticated');
