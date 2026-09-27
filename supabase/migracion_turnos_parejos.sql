-- Ejecutar UNA sola vez en el SQL Editor de Supabase.
-- Reparte los turnos de juego (1er, 2do y 3er partido de cada
-- jornada) de forma pareja entre los 6 equipos a lo largo de las
-- 10 jornadas regulares, en vez de que Sinai siempre jugara primero.
-- No cambia quien juega contra quien, solo A QUE HORA le toca.

-- Jornada 1
update public.matches set orden = 0, hora = '3:30 pm' where jornada_numero = 1 and local_team_id = 'corderito' and visitante_team_id = 'pedro';
update public.matches set orden = 1, hora = '4:20 pm' where jornada_numero = 1 and local_team_id = 'bautista' and visitante_team_id = 'ligaevangelica';
update public.matches set orden = 2, hora = '5:10 pm' where jornada_numero = 1 and local_team_id = 'sinai' and visitante_team_id = 'rocafuerte';

-- Jornada 2
update public.matches set orden = 0, hora = '3:30 pm' where jornada_numero = 2 and local_team_id = 'sinai' and visitante_team_id = 'ligaevangelica';
update public.matches set orden = 1, hora = '4:20 pm' where jornada_numero = 2 and local_team_id = 'rocafuerte' and visitante_team_id = 'pedro';
update public.matches set orden = 2, hora = '5:10 pm' where jornada_numero = 2 and local_team_id = 'bautista' and visitante_team_id = 'corderito';

-- Jornada 3
update public.matches set orden = 0, hora = '3:30 pm' where jornada_numero = 3 and local_team_id = 'rocafuerte' and visitante_team_id = 'bautista';
update public.matches set orden = 1, hora = '4:20 pm' where jornada_numero = 3 and local_team_id = 'sinai' and visitante_team_id = 'pedro';
update public.matches set orden = 2, hora = '5:10 pm' where jornada_numero = 3 and local_team_id = 'ligaevangelica' and visitante_team_id = 'corderito';

-- Jornada 4
update public.matches set orden = 0, hora = '3:30 pm' where jornada_numero = 4 and local_team_id = 'ligaevangelica' and visitante_team_id = 'rocafuerte';
update public.matches set orden = 1, hora = '4:20 pm' where jornada_numero = 4 and local_team_id = 'sinai' and visitante_team_id = 'corderito';
update public.matches set orden = 2, hora = '5:10 pm' where jornada_numero = 4 and local_team_id = 'pedro' and visitante_team_id = 'bautista';

-- Jornada 5
update public.matches set orden = 0, hora = '3:30 pm' where jornada_numero = 5 and local_team_id = 'corderito' and visitante_team_id = 'rocafuerte';
update public.matches set orden = 1, hora = '4:20 pm' where jornada_numero = 5 and local_team_id = 'sinai' and visitante_team_id = 'bautista';
update public.matches set orden = 2, hora = '5:10 pm' where jornada_numero = 5 and local_team_id = 'pedro' and visitante_team_id = 'ligaevangelica';

-- Jornada 6
update public.matches set orden = 0, hora = '3:30 pm' where jornada_numero = 6 and local_team_id = 'ligaevangelica' and visitante_team_id = 'bautista';
update public.matches set orden = 1, hora = '4:20 pm' where jornada_numero = 6 and local_team_id = 'pedro' and visitante_team_id = 'corderito';
update public.matches set orden = 2, hora = '5:10 pm' where jornada_numero = 6 and local_team_id = 'rocafuerte' and visitante_team_id = 'sinai';

-- Jornada 7
update public.matches set orden = 0, hora = '3:30 pm' where jornada_numero = 7 and local_team_id = 'ligaevangelica' and visitante_team_id = 'sinai';
update public.matches set orden = 1, hora = '4:20 pm' where jornada_numero = 7 and local_team_id = 'corderito' and visitante_team_id = 'bautista';
update public.matches set orden = 2, hora = '5:10 pm' where jornada_numero = 7 and local_team_id = 'pedro' and visitante_team_id = 'rocafuerte';

-- Jornada 8
update public.matches set orden = 0, hora = '3:30 pm' where jornada_numero = 8 and local_team_id = 'pedro' and visitante_team_id = 'sinai';
update public.matches set orden = 1, hora = '4:20 pm' where jornada_numero = 8 and local_team_id = 'bautista' and visitante_team_id = 'rocafuerte';
update public.matches set orden = 2, hora = '5:10 pm' where jornada_numero = 8 and local_team_id = 'corderito' and visitante_team_id = 'ligaevangelica';

-- Jornada 9
update public.matches set orden = 0, hora = '3:30 pm' where jornada_numero = 9 and local_team_id = 'bautista' and visitante_team_id = 'pedro';
update public.matches set orden = 1, hora = '4:20 pm' where jornada_numero = 9 and local_team_id = 'rocafuerte' and visitante_team_id = 'ligaevangelica';
update public.matches set orden = 2, hora = '5:10 pm' where jornada_numero = 9 and local_team_id = 'corderito' and visitante_team_id = 'sinai';

-- Jornada 10
update public.matches set orden = 0, hora = '3:30 pm' where jornada_numero = 10 and local_team_id = 'rocafuerte' and visitante_team_id = 'corderito';
update public.matches set orden = 1, hora = '4:20 pm' where jornada_numero = 10 and local_team_id = 'ligaevangelica' and visitante_team_id = 'pedro';
update public.matches set orden = 2, hora = '5:10 pm' where jornada_numero = 10 and local_team_id = 'bautista' and visitante_team_id = 'sinai';
