import { useEffect, useState } from "react";
import { getResultadoPartido, guardarResultadoPartido } from "../lib/resultsStore";
import { actualizarHoraPartido } from "../lib/scheduleStore";

function NumberBox({ value, onChange, ariaLabel }) {
  return (
    <input
      type="number"
      min="0"
      inputMode="numeric"
      aria-label={ariaLabel}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-12 h-8 text-center text-xs font-semibold rounded-lg border border-emerald-600/25 bg-white/80 text-forest-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
      placeholder="0"
    />
  );
}

// Convierte lo que hay en un input (puede quedar vacio) a un numero
// entero valido, usando 0 si esta vacio o no es un numero.
function aEntero(valor) {
  const n = parseInt(valor, 10);
  return Number.isNaN(n) ? 0 : n;
}

function HoraField({ hora, horaGuardada, onChange, onBlurGuardar }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] font-semibold text-moss-muted">Hora:</span>
      <input
        type="text"
        value={hora}
        onChange={onChange}
        onBlur={onBlurGuardar}
        placeholder="3:30 pm"
        className="w-20 h-7 px-2 text-[11px] text-center rounded-md border border-emerald-600/25 bg-white/80 text-forest-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
      />
      {!horaGuardada && <span className="text-[10px] text-emerald-700">●</span>}
    </div>
  );
}

// local y visitante son equipos completos ({ id, name, logo, players:
// [{id,name}] }) o null si ese lado del partido todavia no tiene
// equipo definido (ej. "1° Clasificado").
export default function PartidoAdminCard({ matchId, partido, local, visitante }) {
  const [cargado, setCargado] = useState(false);
  const [golesLocal, setGolesLocal] = useState("");
  const [golesVisitante, setGolesVisitante] = useState("");
  const [eventos, setEventos] = useState({});
  const [expandido, setExpandido] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [hora, setHora] = useState(partido.hora);
  const [horaGuardada, setHoraGuardada] = useState(true);

  useEffect(() => {
    setHora(partido.hora);
    setHoraGuardada(true);
  }, [matchId, partido.hora]);

  const guardarHora = async () => {
    if (hora === partido.hora) return;
    await actualizarHoraPartido(matchId, hora);
    setHoraGuardada(true);
  };

  // Carga el resultado guardado de ESTE partido especifico, cada vez
  // que cambia matchId (cambia de jornada).
  useEffect(() => {
    let activo = true;
    setCargado(false);

    if (!local || !visitante) {
      setCargado(true);
      return;
    }

    getResultadoPartido(matchId).then((inicial) => {
      if (!activo) return;

      setGolesLocal(inicial.golesLocal === null ? "" : String(inicial.golesLocal));
      setGolesVisitante(
        inicial.golesVisitante === null ? "" : String(inicial.golesVisitante)
      );

      const base = {};
      [local, visitante].forEach((equipo) => {
        base[equipo.id] = {};
        equipo.players.forEach((jugador) => {
          const previo = inicial.eventos?.[equipo.id]?.[jugador.id];
          base[equipo.id][jugador.id] = {
            goles: previo?.goles ?? 0,
            asistencias: previo?.asistencias ?? 0,
          };
        });
      });

      setEventos(base);
      setExpandido(false);
      setGuardado(false);
      setCargado(true);
    });

    return () => {
      activo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId]);

  if (!local || !visitante) {
    // Partidos de semifinal/final aun sin equipo definido: no se
    // pueden cargar resultados todavia, pero si se puede editar la
    // hora.
    return (
      <div className="rounded-xl p-3 bg-white/60 border border-white/80 text-xs text-moss-muted space-y-2">
        <div>
          <span className="font-semibold text-forest-900">
            {partido.local} vs {partido.visitante}
          </span>{" "}
          — se definira mas adelante.
        </div>
        <HoraField
          hora={hora}
          horaGuardada={horaGuardada}
          onChange={(e) => {
            setHora(e.target.value);
            setHoraGuardada(false);
          }}
          onBlurGuardar={guardarHora}
        />
      </div>
    );
  }

  if (!cargado) {
    return (
      <div className="rounded-2xl p-3.5 bg-white/60 border border-white/80 text-xs text-moss-muted animate-pulse">
        Cargando resultado…
      </div>
    );
  }

  const actualizarEvento = (teamId, jugadorId, campo, valor) => {
    setEventos((prev) => ({
      ...prev,
      [teamId]: {
        ...prev[teamId],
        [jugadorId]: {
          ...prev[teamId][jugadorId],
          [campo]: valor,
        },
      },
    }));
    setGuardado(false);
  };

  const guardar = async () => {
    setGuardando(true);

    const eventosNormalizados = {};
    Object.entries(eventos).forEach(([teamId, jugadores]) => {
      eventosNormalizados[teamId] = {};
      Object.entries(jugadores).forEach(([jugadorId, datos]) => {
        eventosNormalizados[teamId][jugadorId] = {
          goles: aEntero(datos.goles),
          asistencias: aEntero(datos.asistencias),
        };
      });
    });

    const ok = await guardarResultadoPartido(matchId, {
      golesLocal: golesLocal === "" ? null : aEntero(golesLocal),
      golesVisitante: golesVisitante === "" ? null : aEntero(golesVisitante),
      eventosPorEquipo: eventosNormalizados,
    });

    setGuardando(false);
    setGuardado(ok);
  };

  return (
    <div className="rounded-2xl p-3.5 bg-white/70 border border-white/90 shadow-xs space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 w-[38%] min-w-0">
          <img src={local.logo} alt={local.name} className="w-7 h-7 object-contain flex-shrink-0" />
          <span className="text-xs font-semibold text-forest-900 truncate">{local.name}</span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <NumberBox
            value={golesLocal}
            onChange={(v) => {
              setGolesLocal(v);
              setGuardado(false);
            }}
            ariaLabel={`Goles de ${local.name}`}
          />
          <span className="text-[10px] font-bold text-moss-muted">-</span>
          <NumberBox
            value={golesVisitante}
            onChange={(v) => {
              setGolesVisitante(v);
              setGuardado(false);
            }}
            ariaLabel={`Goles de ${visitante.name}`}
          />
        </div>

        <div className="flex items-center gap-2 w-[38%] min-w-0 justify-end text-right">
          <span className="text-xs font-semibold text-forest-900 truncate">{visitante.name}</span>
          <img src={visitante.logo} alt={visitante.name} className="w-7 h-7 object-contain flex-shrink-0" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <HoraField
          hora={hora}
          horaGuardada={horaGuardada}
          onChange={(e) => {
            setHora(e.target.value);
            setHoraGuardada(false);
          }}
          onBlurGuardar={guardarHora}
        />
        <button
          type="button"
          onClick={() => setExpandido((v) => !v)}
          className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1"
        >
          <svg
            className={`w-3.5 h-3.5 stroke-current transition-transform ${expandido ? "rotate-180" : ""}`}
            fill="none"
            strokeWidth="2.2"
            viewBox="0 0 24 24"
          >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {expandido ? "Ocultar" : "Jugadores"}
        </button>

        <button
          type="button"
          onClick={guardar}
          disabled={guardando}
          className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white active:scale-95 transition disabled:opacity-60"
        >
          {guardando ? "Guardando…" : guardado ? "Guardado ✓" : "Guardar"}
        </button>
      </div>

      {expandido && (
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-forest-900/10">
          {[local, visitante].map((equipo) => (
            <div key={equipo.id} className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-moss-muted mb-1">
                {equipo.name}
              </p>
              {equipo.players.map((jugador) => (
                <div
                  key={jugador.id}
                  className="flex items-center justify-between gap-1.5 bg-white/60 rounded-lg px-2 py-1"
                >
                  <span className="text-[11px] text-forest-900 truncate flex-1">
                    {jugador.name}
                  </span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <input
                      type="number"
                      min="0"
                      inputMode="numeric"
                      aria-label={`Goles de ${jugador.name}`}
                      title="Goles"
                      value={eventos[equipo.id][jugador.id].goles}
                      onChange={(e) =>
                        actualizarEvento(equipo.id, jugador.id, "goles", e.target.value)
                      }
                      className="w-9 h-7 text-center text-[11px] font-semibold rounded-md border border-emerald-600/25 bg-white text-forest-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                      placeholder="0"
                    />
                    <input
                      type="number"
                      min="0"
                      inputMode="numeric"
                      aria-label={`Asistencias de ${jugador.name}`}
                      title="Asistencias"
                      value={eventos[equipo.id][jugador.id].asistencias}
                      onChange={(e) =>
                        actualizarEvento(equipo.id, jugador.id, "asistencias", e.target.value)
                      }
                      className="w-9 h-7 text-center text-[11px] font-semibold rounded-md border border-emerald-600/25 bg-white/70 text-forest-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                      placeholder="0"
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
