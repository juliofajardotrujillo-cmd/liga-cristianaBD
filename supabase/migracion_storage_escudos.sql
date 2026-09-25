-- Ejecutar UNA sola vez en el SQL Editor de Supabase (proyecto que ya
-- tienes funcionando), para poder subir fotos como escudo de un
-- equipo directamente desde el panel de administrador, en vez de
-- tener que pegar una URL a mano.

-- Bucket publico donde se guardan los escudos subidos.
insert into storage.buckets (id, name, public)
values ('team-logos', 'team-logos', true)
on conflict (id) do nothing;

-- Cualquiera puede VER los escudos (la pagina publica los muestra).
drop policy if exists "Lectura publica de escudos" on storage.objects;
create policy "Lectura publica de escudos"
  on storage.objects for select
  using (bucket_id = 'team-logos');

-- Solo el administrador logueado puede subir escudos nuevos.
drop policy if exists "Admin puede subir escudos" on storage.objects;
create policy "Admin puede subir escudos"
  on storage.objects for insert
  with check (bucket_id = 'team-logos' and auth.role() = 'authenticated');

-- Solo el administrador logueado puede reemplazar un escudo existente.
drop policy if exists "Admin puede actualizar escudos" on storage.objects;
create policy "Admin puede actualizar escudos"
  on storage.objects for update
  using (bucket_id = 'team-logos' and auth.role() = 'authenticated')
  with check (bucket_id = 'team-logos' and auth.role() = 'authenticated');

-- Solo el administrador logueado puede borrar un escudo.
drop policy if exists "Admin puede borrar escudos" on storage.objects;
create policy "Admin puede borrar escudos"
  on storage.objects for delete
  using (bucket_id = 'team-logos' and auth.role() = 'authenticated');
