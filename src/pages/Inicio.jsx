import { Link } from "react-router-dom";
import { useLigaData } from "../lib/useLigaData";

const ChevronRight = () => (
  <svg
    className="w-3 h-3 stroke-current"
    fill="none"
    strokeWidth="2.5"
    viewBox="0 0 24 24"
  >
    <path
      d="M8.25 4.5l7.5 7.5-7.5 7.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Inicio() {
  const { jornadas, standings, goleadores, getTeamByName, cargando } = useLigaData();

  if (cargando || jornadas.length === 0) {
    return (
      <div className="mt-10 text-center text-xs text-moss-muted">Cargando…</div>
    );
  }

  const primeraJornada = jornadas[0];

  // Los 3 primeros de la tabla de Goleadores y Asistencias (misma que en
  // Estadísticas), convertidos al formato que usa el podio de esta sección.
  const topGoleadores = goleadores.slice(0, 3).map((g, idx) => ({
    nombre: g.jugador,
    equipo: g.equipo.name,
    goles: g.goles,
    puesto: idx + 1,
  }));

  return (
    <>
      {/* BEGIN: HeroCard */}
      <section
        aria-label="Destacado del Torneo"
        className="mt-5"
        style={{ paddingLeft: 20, paddingRight: 20 }}
      >
        <div className="glass-card p-6 relative overflow-hidden flex items-center justify-between min-h-[220px] border border-white/90 rounded-2xl">
          <div className="absolute -right-8 -top-8 w-44 h-44 bg-emerald-400/20 rounded-full filter blur-2xl pointer-events-none"></div>
          <div className="absolute -left-6 -bottom-6 w-36 h-36 bg-emerald-200/30 rounded-full filter blur-xl pointer-events-none"></div>

          <div className="z-10 max-w-[56%] flex flex-col justify-between space-y-3">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-600/10 text-emerald-800 border border-emerald-500/25 mb-1.5">
                Torneo Oficial 2026
              </span>
              <h2 className="font-serif text-2xl leading-tight font-bold text-forest-900">
                Liga de Fútbol Cristiana
              </h2>
              <p className="font-serif italic text-xs text-moss-muted mt-1.5 line-clamp-3 leading-snug">
                “Corred de tal manera que obtengáis el premio.”
                <span className="not-italic block text-[10px] text-emerald-700 font-sans tracking-wide mt-0.5 font-semibold">
                  1 Corintios 9:24
                </span>
              </p>
            </div>
            <div>
              <Link
                to="/calendario"
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 text-white font-semibold text-xs rounded-full shadow-md shadow-emerald-700/25 active:scale-95 transition hover:bg-emerald-700"
              >
                <span>Ver Calendario</span>
                <ChevronRight />
              </Link>
            </div>
          </div>

          <div className="relative w-[44%] flex flex-col items-center justify-center">
            <div className="relative z-10 w-[100px] h-[100px] flex items-center justify-center -mr-1 transition-transform duration-500 ease-out hover:scale-105">
              <img
                alt="Balón Trionda 2026"
                className="w-full h-full object-contain relative z-10 ball-3d-shadow drop-shadow-xl select-none pointer-events-none float-ball"
                src="/images/trionda_5_photoroom.png"
              />
            </div>
            <div
              style={{
                width: "82%",
                height: 14,
                background:
                  "radial-gradient(rgba(11, 43, 27, 0.35) 0%, rgba(16, 185, 129, 0.18) 45%, rgba(0, 0, 0, 0) 75%)",
                borderRadius: "50%",
                filter: "blur(5px)",
                margin: "-2px auto 0px",
              }}
            ></div>
          </div>
        </div>
      </section>
      {/* END: HeroCard */}

      {/* BEGIN: ProximaJornadaSection */}
      <section
        aria-labelledby="proxima-jornada-title"
        className="mt-5"
        style={{ paddingLeft: 20, paddingRight: 20 }}
      >
        <div className="flex justify-between items-baseline mb-3">
          <div>
            <h3
              className="font-serif text-xl font-bold text-forest-900 tracking-tight"
              id="proxima-jornada-title"
            >
              Próxima Jornada
            </h3>
            <p className="text-[11px] text-moss-muted">
              {primeraJornada.fecha.replace("Domingo ", "Domingo ")} • Jornada{" "}
              {primeraJornada.numero}
            </p>
          </div>
          <Link
            to="/calendario"
            className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center space-x-1 font-semibold"
          >
            <span>Ver Todo</span>
            <ChevronRight />
          </Link>
        </div>

        <div className="space-y-3">
          {primeraJornada.partidos.map((partido) => {
            const local = getTeamByName(partido.local);
            const visitante = getTeamByName(partido.visitante);
            return (
              <article
                key={partido.id}
                className="rounded-2xl p-4 transition duration-200 hover:shadow-md relative border border-white/70 shadow-sm"
                style={{
                  background: "rgba(255, 255, 255, 0.58)",
                  backdropFilter: "blur(16px)",
                  boxShadow:
                    "rgba(16, 185, 129, 0.08) 0px 8px 32px 0px, rgba(255, 255, 255, 0.8) 0px 1px 1px inset",
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center text-center w-[40%]">
                    <img
                      alt={`Escudo ${local?.name ?? partido.local}`}
                      className="drop-shadow-sm mb-1.5"
                      src={local?.logo}
                      style={{ width: 64, height: 64, objectFit: "contain" }}
                    />
                    <h4 className="font-semibold text-sm text-forest-900 truncate w-full">
                      {partido.local}
                    </h4>
                  </div>
                  <div className="w-[20%] flex flex-col items-center justify-center">
                    <span className="text-[11px] font-bold text-moss-muted tracking-wider">
                      VS
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 mt-0.5">
                      {partido.hora}
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center w-[40%]">
                    <img
                      alt={`Escudo ${visitante?.name ?? partido.visitante}`}
                      className="drop-shadow-sm mb-1.5"
                      src={visitante?.logo}
                      style={{ width: 64, height: 64, objectFit: "contain" }}
                    />
                    <h4 className="font-semibold text-sm text-forest-900 truncate w-full">
                      {partido.visitante}
                    </h4>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      {/* END: ProximaJornadaSection */}

      {/* BEGIN: TablaClasificacionSection */}
      <section
        aria-labelledby="tabla-clasificacion-title"
        className="mt-7 mb-4"
        style={{ paddingLeft: 20, paddingRight: 20 }}
      >
        <div className="flex justify-between items-baseline mb-3">
          <h3
            className="font-serif text-xl font-bold text-forest-900 tracking-tight"
            id="tabla-clasificacion-title"
          >
            Tabla de Clasificación
          </h3>
          <Link
            to="/estadisticas"
            className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center space-x-1 font-semibold"
          >
            <span>Ver Todo</span>
            <ChevronRight />
          </Link>
        </div>

        <div
          className="glass-card rounded-2xl p-4 overflow-hidden border border-white/90"
          style={{
            background: "rgba(255, 255, 255, 0.62)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.85)",
            boxShadow:
              "rgba(11, 43, 27, 0.08) 0px 12px 36px -8px, rgba(255, 255, 255, 0.9) 0px 1px 1px inset",
          }}
        >
          <div className="grid grid-cols-12 text-[11px] font-bold text-moss-muted pb-2.5 border-b border-forest-900/10 uppercase tracking-wider">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-7 pl-2">Equipo</div>
            <div className="col-span-2 text-center">DG</div>
            <div className="col-span-2 text-right pr-1">PTS</div>
          </div>
          <div className="divide-y divide-forest-900/5 text-xs">
            {standings.map((row, idx) => (
              <div
                key={row.team.id}
                className="grid grid-cols-12 items-center py-2.5 font-medium hover:bg-emerald-50/50 rounded-lg transition-colors"
              >
                <div className="col-span-1 text-center text-forest-850 font-medium">
                  {idx + 1}
                </div>
                <div className="col-span-7 pl-2 flex items-center space-x-2.5">
                  <img
                    alt={`Escudo ${row.team.name}`}
                    src={row.team.logo}
                    style={{ width: 24, height: 24, objectFit: "contain" }}
                  />
                  <span className="text-forest-900 font-medium">
                    {row.team.name}
                  </span>
                </div>
                <div className="col-span-2 text-center text-moss-muted font-medium">
                  {row.dg}
                </div>
                <div className="col-span-2 text-right pr-1 font-medium text-forest-900">
                  {row.pts}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-2.5 border-t border-forest-900/10 flex justify-between items-center text-[10px] text-moss-muted">
            <span>* Clasifican los 4 mejores equipos</span>
          </div>
        </div>
      </section>

      {/* BEGIN: GoleadoresSection */}
      <section aria-labelledby="goleadores-title" className="mt-7 mb-4" style={{ paddingLeft: 20, paddingRight: 20 }}>
        <div className="flex justify-between items-baseline mb-3">
          <div>
            <h3
              className="font-serif text-xl font-bold text-forest-900 tracking-tight"
              id="goleadores-title"
            >
              Máximos Goleadores
            </h3>
            <p className="text-[11px] text-moss-muted">
              Podio de líderes de goleo individual
            </p>
          </div>
          <Link
            to="/estadisticas#goles-asistencia"
            className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center space-x-1 font-semibold"
          >
            <span>Ver Todo</span>
            <ChevronRight />
          </Link>
        </div>

        <div
          className="glass-card rounded-2xl p-4 border border-white/90 relative overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.64)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.85)",
            boxShadow:
              "rgba(11, 43, 27, 0.09) 0px 14px 40px -10px, rgba(255, 255, 255, 0.95) 0px 1px 1px inset",
          }}
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at top, rgba(16, 185, 129, 0.25) 0%, rgba(255, 255, 255, 0.7) 40%, rgba(255, 255, 255, 0) 75%)",
              filter: "blur(12px)",
            }}
          ></div>

          <div className="relative z-10 grid grid-cols-3 gap-2.5 items-end pt-3 pb-2">
            {/* Puesto 2 */}
            <PodiumSpot
              persona={topGoleadores.find((p) => p.puesto === 2)}
              variant="second"
            />
            {/* Puesto 1 */}
            <PodiumSpot
              persona={topGoleadores.find((p) => p.puesto === 1)}
              variant="first"
            />
            {/* Puesto 3 */}
            <PodiumSpot
              persona={topGoleadores.find((p) => p.puesto === 3)}
              variant="third"
            />
          </div>

          <div
            className="w-4/5 mx-auto h-2 rounded-full mt-1"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(11, 43, 27, 0.22) 0%, rgba(16, 185, 129, 0.1) 45%, transparent 75%)",
              filter: "blur(3px)",
            }}
          ></div>
        </div>
      </section>
      {/* END: GoleadoresSection */}
    </>
  );
}

function PodiumSpot({ persona, variant }) {
  if (!persona) return null;

  const config = {
    first: {
      wrapClass: "flex flex-col items-center justify-end -mt-3",
      nameClass: "text-xs font-bold text-forest-900 truncate max-w-[95px] text-center",
      teamClass:
        "text-[9px] text-emerald-700 truncate max-w-[95px] font-semibold text-center",
      teamStyle: { color: "rgb(74, 107, 90)" },
      badgeClass:
        "mt-1 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-md shadow-emerald-600/30",
      barHeight: "h-24",
      barShadow: "shadow-lg",
      barBoxShadow:
        "inset 0 2px 4px rgba(255,255,255,0.8), 0 10px 20px -4px rgba(11,43,27,0.14)",
      numberClass: "font-serif text-4xl font-bold tracking-tight select-none text-forest-900",
      numberOpacity: 0.75,
      podHeight: "h-3.5",
    },
    second: {
      wrapClass: "flex flex-col items-center justify-end",
      nameClass: "text-[11px] font-bold text-forest-900 truncate max-w-[85px] text-center",
      teamClass: "text-[9px] text-moss-muted truncate max-w-[85px] font-medium text-center",
      teamStyle: {},
      badgeClass:
        "mt-1 px-2 py-0.5 rounded-full bg-white/90 text-forest-900 text-[10px] font-bold border shadow-xs border-emerald-600/20",
      barHeight: "h-16",
      barShadow: "shadow-md",
      barBoxShadow:
        "inset 0 2px 4px rgba(255,255,255,0.8), 0 8px 16px -4px rgba(11,43,27,0.12)",
      numberClass: "font-serif text-3xl font-bold tracking-tight select-none text-forest-900",
      numberOpacity: 0.65,
      podHeight: "h-3",
    },
    third: {
      wrapClass: "flex flex-col items-center justify-end",
      nameClass: "text-[11px] font-bold text-forest-900 truncate max-w-[85px] text-center",
      teamClass: "text-[9px] text-moss-muted truncate max-w-[85px] font-medium text-center",
      teamStyle: {},
      badgeClass:
        "mt-1 px-2 py-0.5 rounded-full bg-white/90 text-forest-900 text-[10px] font-bold border shadow-xs border-emerald-600/20",
      barHeight: "h-11",
      barShadow: "shadow-sm",
      barBoxShadow:
        "inset 0 2px 4px rgba(255,255,255,0.7), 0 6px 14px -4px rgba(11,43,27,0.1)",
      numberClass: "font-serif text-2xl font-bold tracking-tight select-none text-forest-900",
      numberOpacity: 0.65,
      podHeight: "h-3",
    },
  }[variant];

  return (
    <div className={config.wrapClass}>
      <div className="flex flex-col items-center mb-2">
        <div className="relative mb-1"></div>
        <span className={config.nameClass}>{persona.nombre}</span>
        <span className={config.teamClass} style={config.teamStyle}>
          {persona.equipo}
        </span>
        <span className={config.badgeClass}>{persona.goles} goles</span>
      </div>
      <div className="w-full flex flex-col items-center relative">
        <div
          className={`w-full ${config.podHeight} rounded-[50%] bg-gradient-to-r from-emerald-100 via-white to-emerald-100 border border-white shadow-xs z-10`}
        ></div>
        <div
          className={`w-full ${config.barHeight} -mt-1.5 rounded-b-xl flex flex-col items-center justify-center relative ${config.barShadow}`}
          style={{
            background:
              "linear-gradient(180deg, #edf6f1 0%, #d8eae0 60%, #c4ddcf 100%)",
            boxShadow: config.barBoxShadow,
          }}
        >
          <span
            className={config.numberClass}
            style={{
              textShadow: "rgba(255, 255, 255, 0.8) 0px 1px 1px",
              opacity: config.numberOpacity,
            }}
          >
            {persona.puesto}
          </span>
        </div>
      </div>
    </div>
  );
}
