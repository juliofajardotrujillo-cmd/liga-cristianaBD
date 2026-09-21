import { supabase } from "./supabaseClient";

const TABLA = "match_results";

function vacio() {
  return { golesLocal: null, golesVisitante: null, eventos: {} };
}

function filaAObjeto(fila) {
  return {
    golesLocal: fila.goles_local,
    golesVisitante: fila.goles_visitante,
    eventos: fila.eventos || {},
  };
}

// matchId es el id real del partido (uuid de la tabla matches).
export async function getResultadoPartido(matchId) {
  const { data, error } = await supabase
    .from(TABLA)
    .select("*")
    .eq("match_id", matchId)
    .maybeSingle();

  if (error) {
    console.error("Error leyendo resultado:", error.message);
    return vacio();
  }
  return data ? filaAObjeto(data) : vacio();
}

// Devuelve TODOS los resultados guardados como { [matchId]: {...} }.
export async function getTodosLosResultados() {
  const { data, error } = await supabase.from(TABLA).select("*");

  if (error) {
    console.error("Error leyendo resultados:", error.message);
    return {};
  }

  const mapa = {};
  (data || []).forEach((fila) => {
    mapa[fila.match_id] = filaAObjeto(fila);
  });
  return mapa;
}

// eventosPorEquipo: { [teamId]: { [playerId]: { goles, asistencias } } }
// Se guarda por id de jugador (no por nombre) para que si el
// administrador le cambia el nombre a un jugador despues, sus goles
// y asistencias ya guardados no se pierdan.
export async function guardarResultadoPartido(
  matchId,
  { golesLocal, golesVisitante, eventosPorEquipo }
) {
  const { error } = await supabase.from(TABLA).upsert(
    {
      match_id: matchId,
      goles_local: golesLocal,
      goles_visitante: golesVisitante,
      eventos: eventosPorEquipo,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "match_id" }
  );

  if (error) {
    console.error("Error guardando resultado:", error.message);
    return false;
  }
  return true;
}

// Se llama automaticamente cuando CUALQUIER usuario, en cualquier
// dispositivo, guarda un resultado (gracias a Supabase Realtime), para
// que la tabla de posiciones y goleadores se actualicen solas.
export function suscribirseACambios(callback) {
  const canal = supabase
    .channel("match_results-cambios")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: TABLA },
      callback
    )
    .subscribe();

  return () => {
    supabase.removeChannel(canal);
  };
}
