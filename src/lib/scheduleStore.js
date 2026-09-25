import { supabase } from "./supabaseClient";

// Devuelve las jornadas con sus partidos, con el nombre de cada
// equipo ya resuelto (busca el equipo por su id en la lista de
// equipos que se le pasa, para no tener que volver a consultar la
// base de datos aqui). Si un lado del partido todavia no tiene equipo
// definido, usa su "label" (ej. "1° Clasificado").
export async function getJornadas(equipos) {
  const [{ data: matchdays, error: err1 }, { data: matches, error: err2 }] =
    await Promise.all([
      supabase.from("matchdays").select("*").order("numero", { ascending: true }),
      supabase.from("matches").select("*").order("orden", { ascending: true }),
    ]);

  if (err1) console.error("Error leyendo jornadas:", err1.message);
  if (err2) console.error("Error leyendo partidos:", err2.message);

  const nombrePorId = Object.fromEntries(equipos.map((e) => [e.id, e.name]));

  const resolverNombre = (teamId, label) =>
    teamId ? nombrePorId[teamId] ?? label ?? "Equipo eliminado" : label;

  return (matchdays || []).map((j) => ({
    numero: j.numero,
    titulo: j.titulo,
    fecha: j.fecha,
    badge: j.badge,
    esProxima: j.es_proxima,
    partidos: (matches || [])
      .filter((m) => m.jornada_numero === j.numero)
      .map((m) => ({
        id: m.id,
        local: resolverNombre(m.local_team_id, m.local_label),
        visitante: resolverNombre(m.visitante_team_id, m.visitante_label),
        hora: m.hora,
      })),
  }));
}

export async function actualizarFechaJornada(numero, fecha) {
  const { error } = await supabase.from("matchdays").update({ fecha }).eq("numero", numero);
  if (error) {
    console.error("Error actualizando fecha:", error.message);
    return { ok: false, mensaje: error.message };
  }
  return { ok: true };
}

export async function actualizarHoraPartido(matchId, hora) {
  const { error } = await supabase.from("matches").update({ hora }).eq("id", matchId);
  if (error) {
    console.error("Error actualizando hora:", error.message);
    return { ok: false, mensaje: error.message };
  }
  return { ok: true };
}

// Marca la jornada indicada como "la proxima" (la que se muestra en
// Inicio y se etiqueta en Calendario), y le quita esa marca a
// cualquier otra jornada que la tuviera.
export async function marcarJornadaProxima(numero) {
  const { error: err1 } = await supabase
    .from("matchdays")
    .update({ es_proxima: false })
    .neq("numero", numero);

  const { error: err2 } = await supabase
    .from("matchdays")
    .update({ es_proxima: true })
    .eq("numero", numero);

  if (err1 || err2) {
    console.error("Error marcando proxima jornada:", (err1 || err2).message);
    return { ok: false, mensaje: (err1 || err2).message };
  }
  return { ok: true };
}

export function suscribirseACambiosJornadas(callback) {
  const canal = supabase
    .channel("jornadas-cambios")
    .on("postgres_changes", { event: "*", schema: "public", table: "matchdays" }, callback)
    .on("postgres_changes", { event: "*", schema: "public", table: "matches" }, callback)
    .subscribe();

  return () => supabase.removeChannel(canal);
}
