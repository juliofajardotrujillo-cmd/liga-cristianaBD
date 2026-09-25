-- Ejecutar UNA sola vez en el SQL Editor de Supabase (proyecto que ya
-- tienes funcionando), para agregar la posibilidad de marcar cual
-- jornada es "la proxima" desde el panel de administrador.

alter table public.matchdays
  add column if not exists es_proxima boolean not null default false;

-- Deja marcada la Jornada 1 como la proxima por defecto (para no
-- perder el comportamiento que ya tenias), y quita el texto fijo
-- "Próxima" de esa jornada porque de ahora en adelante ese indicador
-- se calcula solo, segun cual jornada marque el administrador.
update public.matchdays set es_proxima = true where numero = 1;
update public.matchdays set badge = null where badge = 'Próxima';
