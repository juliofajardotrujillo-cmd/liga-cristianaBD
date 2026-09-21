import { useEffect, useState } from "react";
import { getEquipos, suscribirseACambiosEquipos } from "./teamsStore";
import { getJornadas, suscribirseACambiosJornadas } from "./scheduleStore";
import { getTodosLosResultados, suscribirseACambios as suscribirseACambiosResultados } from "./resultsStore";
import { computeStandings, computeGoleadores } from "../data/computeStandings";

// Hook central: carga equipos, calendario y resultados desde
// Supabase, y se recalcula solo cuando CUALQUIERA de esos datos
// cambia (edite quien edite, desde cualquier dispositivo), gracias a
// Supabase Realtime.
export function useLigaData() {
  const [teams, setTeams] = useState([]);
  const [jornadas, setJornadas] = useState([]);
  const [resultados, setResultados] = useState({});
  const [cargando, setCargando] = useState(true);

  const cargarTodo = async () => {
    const equiposData = await getEquipos();
    const [jornadasData, resultadosData] = await Promise.all([
      getJornadas(equiposData),
      getTodosLosResultados(),
    ]);
    setTeams(equiposData);
    setJornadas(jornadasData);
    setResultados(resultadosData);
    setCargando(false);
  };

  useEffect(() => {
    let activo = true;

    const recargar = async () => {
      const equiposData = await getEquipos();
      const [jornadasData, resultadosData] = await Promise.all([
        getJornadas(equiposData),
        getTodosLosResultados(),
      ]);
      if (!activo) return;
      setTeams(equiposData);
      setJornadas(jornadasData);
      setResultados(resultadosData);
      setCargando(false);
    };

    recargar();

    const un1 = suscribirseACambiosEquipos(recargar);
    const un2 = suscribirseACambiosJornadas(recargar);
    const un3 = suscribirseACambiosResultados(recargar);

    return () => {
      activo = false;
      un1();
      un2();
      un3();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    teams,
    jornadas,
    resultados,
    cargando,
    standings: computeStandings(teams, jornadas, resultados),
    goleadores: computeGoleadores(teams, resultados),
    getTeamByName: (nombre) => teams.find((t) => t.name === nombre),
    recargar: cargarTodo,
  };
}
