-- Ejecutar UNA sola vez en el SQL Editor de Supabase.
--
-- Cambia el nombre y el escudo de 3 equipos. El "id" interno de cada
-- equipo NO cambia (sigue siendo 'bautista', 'corderito', 'pedro'),
-- asi que todos los partidos, jugadores y resultados que ya tenias
-- cargados para esos equipos se quedan exactamente igual, solo cambia
-- como se muestran (nombre y escudo).
--
-- Es seguro correrlo mas de una vez.

-- El Corderito -> El Cordero (el escudo ya estaba bien puesto)
update public.teams set name = 'El Cordero'
where id = 'corderito';

-- Pedro -> El Parque (equipo nuevo, sustituye a Pedro)
update public.teams
set name = 'El Parque', logo_url = '/images/el_parque.png'
where id = 'pedro';

-- 3ra Bautista -> Buenas Nuevas (equipo nuevo, sustituye a 3ra Bautista)
update public.teams
set name = 'Buenas Nuevas', logo_url = '/images/buenas_nuevas.png'
where id = 'bautista';

-- IMPORTANTE: como "El Parque" y "Buenas Nuevas" son equipos distintos
-- a los que jugaban antes, revisa la pestaña "Equipos y jugadores" del
-- panel de administrador y actualiza sus jugadores (quita los que no
-- correspondan y agrega la plantilla real de cada equipo nuevo). Este
-- script NO toca los jugadores, solo el nombre y el escudo del equipo.
