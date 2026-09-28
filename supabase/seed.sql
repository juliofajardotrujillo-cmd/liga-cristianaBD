-- Datos iniciales (seed) para un proyecto NUEVO y vacio: los 6 equipos
-- y el calendario de las 13 jornadas.
--
-- ES SEGURO EJECUTARLO MAS DE UNA VEZ: cada bloque solo carga datos si
-- su tabla esta completamente vacia. Si ya tienes equipos o calendario
-- (por ejemplo porque los editaste desde el panel de administrador),
-- este archivo NO toca nada y NO vuelve a poner datos viejos.
--
-- Los jugadores NO se cargan aqui a proposito: las plantillas oficiales
-- de cada equipo se agregan desde el panel de administrador
-- (Equipos y jugadores).

do $$
begin
  -- Equipos
  if not exists (select 1 from public.teams) then
    insert into public.teams (id, name, logo_url, sort_order) values
      ('sinai', 'Sinaí', '/images/escudo_sinai.png', 0),
      ('bautista', '3ra Bautista', '/images/3ra_bautista.png', 1),
      ('corderito', 'El Corderito', '/images/el_cordero.png', 2),
      ('pedro', 'Pedro', '/images/pedro.png', 3),
      ('ligaevangelica', 'Liga Evangélica', '/images/liga_evangelica.png', 4),
      ('rocafuerte', 'Roca Fuerte', '/images/roca_fuerte.png', 5);
  end if;

  -- Calendario (jornadas y partidos). Los partidos de cada jornada se
  -- muestran ordenados por su hora, sea cual sea el orden en que esten
  -- guardados aqui.
  if not exists (select 1 from public.matchdays) then
    insert into public.matchdays (numero, titulo, fecha, badge, es_proxima) values
      (1, 'Jornada 1', 'Domingo 20/09/2026', null, true),
      (2, 'Jornada 2', 'Domingo 27/09/2026', null, false),
      (3, 'Jornada 3', 'Domingo 04/10/2026', null, false),
      (4, 'Jornada 4', 'Domingo 11/10/2026', null, false),
      (5, 'Jornada 5', 'Domingo 18/10/2026', null, false),
      (6, 'Jornada 6', 'Domingo 25/10/2026', null, false),
      (7, 'Jornada 7', 'Domingo 01/11/2026', null, false),
      (8, 'Jornada 8', 'Domingo 08/11/2026', null, false),
      (9, 'Jornada 9', 'Domingo 15/11/2026', null, false),
      (10, 'Jornada 10', 'Domingo 22/11/2026', null, false),
      (11, 'Jornada 11', 'Domingo 29/11/2026 • (Ida)', 'Semifinales', false),
      (12, 'Jornada 12', 'Domingo 06/12/2026 •  (Vuelta)', 'Semifinales', false),
      (13, 'Jornada 13', 'Domingo 13/12/2026 • Gran Final', 'Gran Final 🏆', false);

    insert into public.matches (jornada_numero, orden, local_team_id, local_label, visitante_team_id, visitante_label, hora) values
      (1, 0, 'corderito', null, 'pedro', null, '3:30 pm'),
      (1, 1, 'bautista', null, 'ligaevangelica', null, '4:20 pm'),
      (1, 2, 'sinai', null, 'rocafuerte', null, '5:10 pm'),
      (2, 0, 'sinai', null, 'ligaevangelica', null, '3:30 pm'),
      (2, 1, 'rocafuerte', null, 'pedro', null, '4:20 pm'),
      (2, 2, 'bautista', null, 'corderito', null, '5:10 pm'),
      (3, 0, 'rocafuerte', null, 'bautista', null, '3:30 pm'),
      (3, 1, 'sinai', null, 'pedro', null, '4:20 pm'),
      (3, 2, 'ligaevangelica', null, 'corderito', null, '5:10 pm'),
      (4, 0, 'ligaevangelica', null, 'rocafuerte', null, '3:30 pm'),
      (4, 1, 'sinai', null, 'corderito', null, '4:20 pm'),
      (4, 2, 'pedro', null, 'bautista', null, '5:10 pm'),
      (5, 0, 'corderito', null, 'rocafuerte', null, '3:30 pm'),
      (5, 1, 'sinai', null, 'bautista', null, '4:20 pm'),
      (5, 2, 'pedro', null, 'ligaevangelica', null, '5:10 pm'),
      (6, 0, 'ligaevangelica', null, 'bautista', null, '3:30 pm'),
      (6, 1, 'pedro', null, 'corderito', null, '4:20 pm'),
      (6, 2, 'rocafuerte', null, 'sinai', null, '5:10 pm'),
      (7, 0, 'ligaevangelica', null, 'sinai', null, '3:30 pm'),
      (7, 1, 'corderito', null, 'bautista', null, '4:20 pm'),
      (7, 2, 'pedro', null, 'rocafuerte', null, '5:10 pm'),
      (8, 0, 'pedro', null, 'sinai', null, '3:30 pm'),
      (8, 1, 'bautista', null, 'rocafuerte', null, '4:20 pm'),
      (8, 2, 'corderito', null, 'ligaevangelica', null, '5:10 pm'),
      (9, 0, 'bautista', null, 'pedro', null, '3:30 pm'),
      (9, 1, 'rocafuerte', null, 'ligaevangelica', null, '4:20 pm'),
      (9, 2, 'corderito', null, 'sinai', null, '5:10 pm'),
      (10, 0, 'rocafuerte', null, 'corderito', null, '3:30 pm'),
      (10, 1, 'ligaevangelica', null, 'pedro', null, '4:20 pm'),
      (10, 2, 'bautista', null, 'sinai', null, '5:10 pm'),
      (11, 0, null, '1° Clasificado', null, '4° Clasificado', '3:30 pm'),
      (11, 1, null, '2° Clasificado', null, '3° Clasificado', '4:30 pm'),
      (12, 0, null, '4° Clasificado', null, '1° Clasificado', '3:30 pm'),
      (12, 1, null, '3° Clasificado', null, '2° Clasificado', '4:30 pm'),
      (13, 0, null, 'Ganador Semifinal 1', null, 'Ganador Semifinal 2', '4:00pm');
  end if;
end $$;
