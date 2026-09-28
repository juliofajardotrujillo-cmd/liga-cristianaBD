-- Agrega la columna que permite marcar cual jornada es "la proxima".
-- Es seguro correrlo mas de una vez: NO cambia la jornada que ya hayas
-- marcado desde el panel de administrador.

alter table public.matchdays
  add column if not exists es_proxima boolean not null default false;

-- Solo marca la Jornada 1 como proxima si NINGUNA jornada esta marcada
-- todavia (o sea, la primera vez). Si ya elegiste una, no la toca.
update public.matchdays
set es_proxima = true
where numero = 1
  and not exists (select 1 from public.matchdays where es_proxima);

-- Quita el texto fijo "Próxima" (ahora ese indicador se calcula solo).
update public.matchdays set badge = null where badge = 'Próxima';
