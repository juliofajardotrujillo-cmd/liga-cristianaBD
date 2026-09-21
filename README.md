# Liga de Fútbol Cristiana — App React

Conversión fiel a React de tu app hecha en Stitch (Inicio, Calendario,
Equipos, Estadísticas y Reglas), manteniendo exactamente los mismos
estilos (glassmorphism verde, tipografías Plus Jakarta Sans / Cormorant
Garamond, tarjetas de cristal, balón animado, etc.) y navegable con
react-router-dom.

## Cómo correr la app

1. Instala las dependencias (solo la primera vez):

   ```bash
   npm install
   ```

2. Levanta el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   Abre la URL que te muestre la terminal (normalmente
   http://localhost:5173).

3. Para generar la versión de producción (archivos listos para subir a
   un hosting):

   ```bash
   npm run build
   ```

   Los archivos quedan en la carpeta `dist/`.

## Cómo poner tus imágenes (escudos y balón)

Todas las imágenes se cargan desde la carpeta `public/images/`. Ahora
mismo esa carpeta tiene placeholders (círculos de color con siglas)
para que la app se vea completa desde ya.

Para poner tus imágenes reales, solo reemplaza cada archivo dentro de
`public/images/` **manteniendo el mismo nombre**:

| Archivo                       | Qué escudo/imagen va ahí     |
|--------------------------------|-------------------------------|
| `escudo_sinai.png`             | Escudo de Sinaí               |
| `3ra_bautista.png`             | Escudo de 3ra Bautista        |
| `el_cordero.png`               | Escudo de El Corderito        |
| `pedro.png`                    | Escudo de Pedro               |
| `liga_evangelica.png`          | Escudo de Liga Evangélica     |
| `roca_fuerte.png`              | Escudo de Roca Fuerte         |
| `trionda_5_photoroom.png`      | Balón Trionda (se anima en Inicio) |

No hay que tocar nada de código: en cuanto reemplaces los archivos con
esos mismos nombres, la app los mostrará automáticamente en todas las
pantallas (Inicio, Calendario, Equipos y Estadísticas usan las mismas
imágenes).

Si prefieres usar otros nombres de archivo, solo tendrías que editar
la propiedad `logo` de cada equipo en `src/data/teams.js` y la línea
`src="/images/..."` del balón en `src/pages/Inicio.jsx`.

## Estructura del proyecto

```
src/
  components/       -> TopBar, BottomNav, AmbientGlows, MobileShell (layout)
  data/             -> teams.js, schedule.js, standings.js, rules.js
  pages/            -> Inicio.jsx, Calendario.jsx, Equipos.jsx,
                        Estadisticas.jsx, Reglas.jsx
  index.css         -> estilos globales (glass-card, ambient-glow, etc.)
  App.jsx           -> rutas (react-router-dom)
public/
  images/           -> escudos y balón
```

## Navegación

La barra inferior (Inicio / Calendario / Equipos / Estadísticas /
Reglas) usa rutas reales de React Router (`/`, `/calendario`,
`/equipos`, `/estadisticas`, `/reglas`), así que la app es completamente
navegable, con el ítem activo resaltado igual que en el diseño
original.



## Panel de administrador + base de datos (Supabase)

Arriba a la derecha del encabezado hay un botón con ícono de persona
que lleva a `/admin`. Ahí se pide correo/contraseña y, una vez dentro,
hay dos pestañas:

- **Resultados y horarios**: elige la jornada, edita el día de esa
  jornada, y por cada partido puedes cambiar la hora, cargar el
  marcador, y desplegar los jugadores de ambos equipos para poner
  cuántos goles y asistencias hizo cada uno (lo que no se rellene
  queda en 0).
- **Equipos y jugadores**: crear equipos nuevos (nombre + escudo),
  editar el nombre/escudo de un equipo existente, eliminarlo, y dentro
  de cada equipo añadir, renombrar o quitar jugadores.

Todo esto vive en una base de datos real (Postgres, a través de
[Supabase](https://supabase.com)), así que cualquier cambio que haga
el administrador —un resultado, un jugador nuevo, un escudo distinto,
un horario editado— lo ve exactamente igual cualquier persona que
entre a la página, desde cualquier dispositivo, sin refrescar (se
actualiza solo gracias a Supabase Realtime).

### 1. Crear el proyecto en Supabase

1. Entra a [supabase.com](https://supabase.com) y crea una cuenta gratis.
2. Crea un proyecto nuevo (elige la región más cercana a tus usuarios).
3. Ve a **Project Settings → API** y copia dos valores: la **Project URL**
   y la **anon public key**.

### 2. Crear las tablas y las reglas de seguridad

1. En el panel de Supabase, ve a **SQL Editor → New query**.
2. Copia y pega todo el contenido de `supabase/schema.sql` y dale a
   **Run**. Esto crea las tablas `teams`, `players`, `matchdays`,
   `matches` y `match_results`, activa seguridad a nivel de fila
   (cualquiera puede leer, solo un admin logueado puede escribir), y
   habilita las actualizaciones en tiempo real.

### 3. Cargar los datos iniciales (los mismos que ya tenías)

1. Nueva query en el **SQL Editor**.
2. Copia y pega todo el contenido de `supabase/seed.sql` y dale a
   **Run**. Esto carga los 6 equipos, sus jugadores y las 13 jornadas
   con los mismos horarios que ya tenía la app, para que no se pierda
   nada al conectar la base de datos.

### 4. Crear el usuario administrador

1. Ve a **Authentication → Users → Add user**.
2. Crea el usuario con el correo y contraseña que va a usar el
   administrador de la liga (marca "Auto Confirm User" para no tener
   que verificar el correo).

No hay registro público: el único modo de crear administradores es
agregándolos ahí manualmente.

### 5. Conectar la app a Supabase

**En desarrollo local:**
1. Copia `.env.example` a un archivo nuevo llamado `.env`.
2. Pega ahí la Project URL y la anon key que copiaste en el paso 1.
3. `npm run dev`.

**En Vercel (producción):**
1. Ve a tu proyecto en Vercel → **Settings → Environment Variables**.
2. Agrega `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` con los mismos
   valores.
3. Vuelve a desplegar el proyecto (Vercel no aplica variables de
   entorno nuevas a despliegues ya existentes, hay que hacer un
   redeploy).

### Notas importantes

- Si ya habías configurado la tabla `match_results` con la versión
  anterior (sin equipos/calendario editables), bórrala antes de correr
  el nuevo `schema.sql`: `drop table if exists public.match_results;`
- Los escudos se siguen sirviendo desde `/public/images/`, así que si
  agregas un equipo nuevo con una imagen nueva, sube el archivo a esa
  carpeta y pon esa ruta (ej. `/images/nuevo-equipo.png`) en el campo
  del escudo. Más adelante se podría agregar subida de imágenes
  directamente desde el panel, pero por ahora se hace por URL/ruta.
- Los goles y asistencias se guardan por el **id** del jugador, no por
  su nombre. Esto significa que si el administrador le cambia el
  nombre a un jugador, sus goles y asistencias ya cargados **no se
  pierden**.
- Si el administrador intenta borrar un equipo que todavía tiene
  partidos programados en el calendario, la app se lo va a impedir con
  un mensaje (para no dejar partidos "huérfanos"); primero hay que
  quitarlo del calendario.
