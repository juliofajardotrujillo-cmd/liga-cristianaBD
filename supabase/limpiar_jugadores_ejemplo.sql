-- Quita los jugadores de EJEMPLO que volvieron a aparecer al correr el
-- seed antiguo, para que solo queden los que agregaste tu desde el
-- panel de administrador.
--
-- Afecta a los equipos con id 'bautista' (ahora "Buenas Nuevas'),
-- 'corderito' (ahora "El Cordero"), 'pedro' (ahora "El Parque") y
-- 'rocafuerte' — eran los equipos cuyas plantillas eran de relleno.
-- NO toca a Sinai ni a Liga Evangelica.
--
-- PROTECCION: los ejemplos de un equipo SOLO se borran si ese equipo
-- ya tiene al menos un jugador que NO es de ejemplo (o sea, uno de
-- los oficiales que tu agregaste). Asi nunca te deja un equipo vacio
-- si todavia no le habias puesto su plantilla oficial.
--
-- UNICO CASO A REVISAR: si algun jugador OFICIAL tuyo se llama
-- exactamente igual (nombre y apellido) que uno de los ejemplos de
-- abajo, este script tambien lo borra; en ese caso, vuelve a
-- agregarlo desde el panel.
--
-- Es seguro correrlo mas de una vez.

with ejemplos(team_id, name) as (
  values
    ('bautista', 'Diego Ramírez'), ('bautista', 'Miguel Vargas'), ('bautista', 'Cristian León'),
    ('bautista', 'José Martínez'), ('bautista', 'Adrián Torres'), ('bautista', 'Kevin Salazar'),
    ('bautista', 'Luis Paredes'), ('bautista', 'Ángel Rojas'), ('bautista', 'Sergio Fuentes'),
    ('bautista', 'Pablo Jiménez'), ('bautista', 'Ricardo Soto'), ('bautista', 'Emanuel Reyes'),
    ('bautista', 'Óscar Luna'), ('bautista', 'Iván Delgado'), ('bautista', 'Gabriel Peña'),

    ('corderito', 'Juan Pérez'), ('corderito', 'David Suárez'), ('corderito', 'Josías Herrera'),
    ('corderito', 'Moisés Aguilar'), ('corderito', 'Eliezer Campos'), ('corderito', 'Santiago Cruz'),
    ('corderito', 'Daniel Flores'), ('corderito', 'Caleb Ortiz'), ('corderito', 'Aarón Ramírez'),
    ('corderito', 'Esteban Silva'), ('corderito', 'Joel García'), ('corderito', 'Samuel Rivas'),
    ('corderito', 'Mateo Torres'), ('corderito', 'Josué Luna'), ('corderito', 'Isaac Mendoza'),

    ('pedro', 'Pedro Hernández'), ('pedro', 'Lucas Morales'), ('pedro', 'Andrés Castillo'),
    ('pedro', 'Daniel Gómez'), ('pedro', 'Josué Ramírez'), ('pedro', 'David Torres'),
    ('pedro', 'Samuel Vargas'), ('pedro', 'Elías Cruz'), ('pedro', 'Jonathan Reyes'),
    ('pedro', 'Marcos Jiménez'), ('pedro', 'Isaac Rojas'), ('pedro', 'Caleb Herrera'),
    ('pedro', 'Joel Martínez'), ('pedro', 'Rubén Salazar'), ('pedro', 'Esteban López'),

    ('rocafuerte', 'David Gómez'), ('rocafuerte', 'Josué Torres'), ('rocafuerte', 'Samuel Ramírez'),
    ('rocafuerte', 'Daniel Herrera'), ('rocafuerte', 'Elías Cruz'), ('rocafuerte', 'Jonathan Vargas'),
    ('rocafuerte', 'Mateo Castillo'), ('rocafuerte', 'Caleb Jiménez'), ('rocafuerte', 'Andrés Rojas'),
    ('rocafuerte', 'Joel Mendoza'), ('rocafuerte', 'Isaac Pérez'), ('rocafuerte', 'Rubén Martínez'),
    ('rocafuerte', 'Marcos Luna'), ('rocafuerte', 'Esteban Salazar'), ('rocafuerte', 'Aarón Reyes')
)
delete from public.players p
using ejemplos e
where p.team_id = e.team_id
  and p.name = e.name
  and exists (
    select 1
    from public.players oficial
    where oficial.team_id = p.team_id
      and not exists (
        select 1 from ejemplos e2
        where e2.team_id = oficial.team_id and e2.name = oficial.name
      )
  );
