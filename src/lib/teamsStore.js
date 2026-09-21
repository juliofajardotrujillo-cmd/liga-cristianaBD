import { supabase } from "./supabaseClient";

// Convierte un nombre de equipo en un id de texto simple y unico
// (ej. "Roca Fuerte 2" -> "roca-fuerte-2"), para usarlo como primary
// key legible en la tabla teams.
function slugify(nombre) {
  const base = nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return base || "equipo";
}

// Devuelve todos los equipos con sus jugadores, en el mismo orden en
// que se crearon. Cada jugador incluye su id (para poder editarlo o
// borrarlo despues) y su nombre.
export async function getEquipos() {
  const [{ data: teams, error: errTeams }, { data: players, error: errPlayers }] =
    await Promise.all([
      supabase.from("teams").select("*").order("sort_order", { ascending: true }),
      supabase.from("players").select("*").order("sort_order", { ascending: true }),
    ]);

  if (errTeams) console.error("Error leyendo equipos:", errTeams.message);
  if (errPlayers) console.error("Error leyendo jugadores:", errPlayers.message);

  return (teams || []).map((t) => ({
    id: t.id,
    name: t.name,
    logo: t.logo_url,
    players: (players || [])
      .filter((p) => p.team_id === t.id)
      .map((p) => ({ id: p.id, name: p.name })),
  }));
}

export function getTeamByName(equipos, nombre) {
  return equipos.find((t) => t.name === nombre);
}

export async function crearEquipo({ name, logo }) {
  let id = slugify(name);

  // Si el id ya existe, le agrega un numero al final hasta que sea unico.
  const { data: existentes } = await supabase.from("teams").select("id").like("id", `${id}%`);
  const usados = new Set((existentes || []).map((e) => e.id));
  let idFinal = id;
  let n = 2;
  while (usados.has(idFinal)) {
    idFinal = `${id}-${n}`;
    n += 1;
  }

  const { data: maxOrden } = await supabase
    .from("teams")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("teams").insert({
    id: idFinal,
    name,
    logo_url: logo || "",
    sort_order: (maxOrden?.sort_order ?? -1) + 1,
  });

  if (error) {
    console.error("Error creando equipo:", error.message);
    return { ok: false, mensaje: error.message };
  }
  return { ok: true, id: idFinal };
}

export async function actualizarEquipo(id, { name, logo }) {
  const { error } = await supabase
    .from("teams")
    .update({ name, logo_url: logo })
    .eq("id", id);

  if (error) {
    console.error("Error actualizando equipo:", error.message);
    return { ok: false, mensaje: error.message };
  }
  return { ok: true };
}

export async function borrarEquipo(id) {
  const { error } = await supabase.from("teams").delete().eq("id", id);
  if (error) {
    // Lo mas comun: el equipo todavia tiene partidos en el calendario.
    return {
      ok: false,
      mensaje:
        "No se pudo borrar: este equipo todavia tiene partidos programados en el calendario. Quitalo del calendario primero.",
    };
  }
  return { ok: true };
}

export async function crearJugador(teamId, nombre) {
  const { data: maxOrden } = await supabase
    .from("players")
    .select("sort_order")
    .eq("team_id", teamId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("players").insert({
    team_id: teamId,
    name: nombre,
    sort_order: (maxOrden?.sort_order ?? -1) + 1,
  });

  if (error) {
    console.error("Error creando jugador:", error.message);
    return { ok: false, mensaje: error.message };
  }
  return { ok: true };
}

export async function actualizarJugador(playerId, nombre) {
  const { error } = await supabase.from("players").update({ name: nombre }).eq("id", playerId);
  if (error) {
    console.error("Error actualizando jugador:", error.message);
    return { ok: false, mensaje: error.message };
  }
  return { ok: true };
}

export async function borrarJugador(playerId) {
  const { error } = await supabase.from("players").delete().eq("id", playerId);
  if (error) {
    console.error("Error borrando jugador:", error.message);
    return { ok: false, mensaje: error.message };
  }
  return { ok: true };
}

export function suscribirseACambiosEquipos(callback) {
  const canal = supabase
    .channel("equipos-cambios")
    .on("postgres_changes", { event: "*", schema: "public", table: "teams" }, callback)
    .on("postgres_changes", { event: "*", schema: "public", table: "players" }, callback)
    .subscribe();

  return () => supabase.removeChannel(canal);
}
