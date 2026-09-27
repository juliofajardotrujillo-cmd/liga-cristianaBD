-- Ejecutar UNA sola vez en el SQL Editor de Supabase para arreglar
-- los datos duplicados (jugadores repetidos y partidos repetidos por
-- jornada) y evitar que vuelva a pasar en el futuro.

-- ============ 1. BORRAR JUGADORES DUPLICADOS ============
-- Si un mismo equipo tiene dos (o mas) jugadores con exactamente el
-- mismo nombre, se queda con uno solo. Si por casualidad ya se le
-- habian cargado goles/asistencias a la copia que se borra, esos
-- goles se pierden (es lo esperado: eran datos de un jugador
-- duplicado por error).
with duplicados as (
  select id,
         row_number() over (partition by team_id, name order by id) as rn
  from public.players
)
delete from public.players
where id in (select id from duplicados where rn > 1);

-- ============ 2. BORRAR PARTIDOS DUPLICADOS ============
-- Identifica partidos duplicados por jornada + quienes juegan (sin
-- importar el orden/horario que tengan asignado en este momento).
-- Si alguna de las copias duplicadas ya tiene un resultado cargado,
-- esa es la que se conserva (para no perder resultados ya guardados).
with duplicados as (
  select m.id,
         row_number() over (
           partition by
             m.jornada_numero,
             coalesce(m.local_team_id, ''), coalesce(m.local_label, ''),
             coalesce(m.visitante_team_id, ''), coalesce(m.visitante_label, '')
           order by (case when mr.match_id is not null then 0 else 1 end), m.id
         ) as rn
  from public.matches m
  left join public.match_results mr on mr.match_id = m.id
)
delete from public.matches
where id in (select id from duplicados where rn > 1);

-- ============ 3. EVITAR QUE VUELVA A PASAR ============
-- De ahora en adelante, la base de datos no va a permitir dos
-- jugadores con el mismo nombre en el mismo equipo, ni dos partidos
-- entre los mismos equipos en la misma jornada.
create unique index if not exists players_team_name_unique
  on public.players (team_id, name);

create unique index if not exists matches_unique_pairing
  on public.matches (
    jornada_numero,
    coalesce(local_team_id, ''), coalesce(local_label, ''),
    coalesce(visitante_team_id, ''), coalesce(visitante_label, '')
  );

-- ============ 4. IMPORTANTE ============
-- Despues de correr esto, vuelve a correr tambien el archivo
-- migracion_turnos_parejos.sql (aunque ya lo hayas corrido antes: es
-- seguro repetirlo). Esto asegura que el partido que quedo vivo de
-- cada jornada tenga el turno y horario correctos, sin importar cual
-- de las copias duplicadas se haya conservado arriba.
