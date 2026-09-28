import { supabase } from "./supabaseClient";

// Convierte una hora escrita como "3:30 pm", "4:00pm", "5 pm" o
// "15:30" en minutos desde medianoche, para poder ordenar los
// partidos por su hora real. Devuelve null si no se puede leer.
export function horaAMinutos(hora) {
  const texto = (hora || "").trim();

  const ampm = /^(\d{1,2})(?::(\d{2}))?\s*([ap])\.?\s*m\.?$/i.exec(texto);
  if (ampm) {
    let h = Number(ampm[1]) % 12;
    if (ampm[3].toLowerCase() === "p") h += 12;
    return h * 60 + Number(ampm[2] || 0);
  }

  const h24 = /^(\d{1,2}):(\d{2})$/.exec(texto);
  if (h24) return Number(h24[1]) * 60 + Number(h24[2]);

  return null;
}

// Ordena los partidos de una jornada por hora (el que empieza antes va
// primero). Si alguna hora no se puede leer, ese partido queda al
// final; y si dos empiezan a la misma hora, se respeta el orden que
// tenian.
function ordenarPorHora(partidos) {
  return [...partidos].sort((a, b) => {
    const ta = horaAMinutos(a.hora);
    const tb = horaAMinutos(b.hora);
    if (ta === null && tb === null) return a.orden - b.orden;
    if (ta === null) return 1;
    if (tb === null) return -1;
    return ta - tb || a.orden - b.orden;
  });
}

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
    partidos: ordenarPorHora(
      (matches || [])
        .filter((m) => m.jornada_numero === j.numero)
        .map((m) => ({
          id: m.id,
          orden: m.orden,
          local: resolverNombre(m.local_team_id, m.local_label),
          visitante: resolverNombre(m.visitante_team_id, m.visitante_label),
          hora: m.hora,
        }))
    ),
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
