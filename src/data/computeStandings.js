// Funciones puras: reciben los equipos, jornadas y resultados ya
// cargados (de Supabase) y devuelven la tabla de posiciones y el
// ranking de goleadores/asistencias. No hacen ninguna consulta ellas
// mismas, para poder recalcularse en el momento sin async.

export function computeStandings(teams, jornadas, resultados) {
  const stats = Object.fromEntries(
    teams.map((t) => [
      t.id,
      { team: t, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    ])
  );

  const nombrePorId = Object.fromEntries(teams.map((t) => [t.id, t.name]));

  jornadas.forEach((jornada) => {
    jornada.partidos.forEach((partido) => {
      const r = resultados[partido.id];
      if (!r || r.golesLocal === null || r.golesVisitante === null) return;

      // El partido guarda nombres para mostrar; hay que encontrar el
      // equipo real (si lo hay) para sumarle las estadisticas.
      const localTeam = teams.find((t) => t.name === partido.local);
      const visitanteTeam = teams.find((t) => t.name === partido.visitante);
      if (!localTeam || !visitanteTeam) return; // ej. "1° Clasificado" sin definir

      const gl = Number(r.golesLocal);
      const gv = Number(r.golesVisitante);
      const el = stats[localTeam.id];
      const ev = stats[visitanteTeam.id];

      el.pj += 1;
      ev.pj += 1;
      el.gf += gl;
      el.gc += gv;
      ev.gf += gv;
      ev.gc += gl;

      if (gl > gv) {
        el.pg += 1;
        el.pts += 3;
        ev.pp += 1;
      } else if (gl < gv) {
        ev.pg += 1;
        ev.pts += 3;
        el.pp += 1;
      } else {
        el.pe += 1;
        ev.pe += 1;
        el.pts += 1;
        ev.pts += 1;
      }
    });
  });

  const resultado = Object.values(stats).map((s) => ({
    ...s,
    dg: s.gf - s.gc,
  }));

  resultado.sort((a, b) => b.pts - a.pts || b.dg - a.dg || b.gf - a.gf);

  return resultado;
}

// Goleadores y asistencias, ordenados de mayor a menor. Los eventos se
// guardan por id de jugador, asi que un cambio de nombre no pierde el
// historial.
export function computeGoleadores(teams, resultados) {
  const acumulado = {};

  teams.forEach((t) => {
    t.players.forEach((jugador) => {
      acumulado[jugador.id] = {
        jugadorId: jugador.id,
        jugador: jugador.name,
        equipo: t,
        goles: 0,
        asistencias: 0,
      };
    });
  });

  Object.values(resultados).forEach((r) => {
    const eventos = r.eventos || {};
    Object.values(eventos).forEach((jugadoresEventos) => {
      Object.entries(jugadoresEventos).forEach(([jugadorId, datos]) => {
        if (!acumulado[jugadorId]) return;
        acumulado[jugadorId].goles += Number(datos.goles) || 0;
        acumulado[jugadorId].asistencias += Number(datos.asistencias) || 0;
      });
    });
  });

  return Object.values(acumulado).sort(
    (a, b) => b.goles - a.goles || b.asistencias - a.asistencias
  );
}
