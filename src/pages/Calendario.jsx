import { useLigaData } from "../lib/useLigaData";

const TrophyIcon = () => (
  <svg className="w-4 h-4 text-emerald-700 fill-current" viewBox="0 0 24 24">
    <path d="M19 4h-3V2H8v2H5a2 2 0 00-2 2v2c0 3.08 2.22 5.65 5.17 5.95A6.002 6.002 0 0011 17.9V20H8v2h8v-2h-3v-2.1c2.12-.39 3.84-2 4.83-4.05C20.78 13.65 23 11.08 23 8V6a2 2 0 00-2-2zM5 8V6h3v4.82A4.01 4.01 0 015 8zm14 0c0 1.95-1.41 3.57-3.25 3.92V6h3.25v2z" />
  </svg>
);

function EquipoBadge({ nombre, getTeamByName }) {
  const equipo = getTeamByName(nombre);

  if (equipo) {
    return (
      <img
        alt={nombre}
        className="w-7 h-7 object-contain flex-shrink-0"
        src={equipo.logo}
      />
    );
  }

  return (
    <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-forest-800 text-[11px] border border-emerald-600/25 bg-emerald-50/70 flex-shrink-0 shadow-xs">
      {nombre.includes("Ganador") ? <TrophyIcon /> : nombre.slice(0, 2)}
    </div>
  );
}

function PartidoRow({ partido, resultado, getTeamByName }) {
  const esFinal = partido.local.includes("Ganador");
  const jugado =
    !!resultado && resultado.golesLocal !== null && resultado.golesVisitante !== null;

  return (
    <div className="flex items-center justify-between p-2 rounded-xl shadow-xs">
      <div className="flex items-center space-x-2 w-[43%] min-w-0">
        <EquipoBadge nombre={partido.local} getTeamByName={getTeamByName} />
        <span
          className={`${
            esFinal ? "font-bold" : "font-semibold"
          } text-xs text-forest-900 whitespace-normal leading-tight`}
        >
          {partido.local}
        </span>
      </div>
      <div className="w-[14%] flex flex-col items-center flex-shrink-0">
        {jugado ? (
          <span className="text-sm font-bold text-forest-900 tracking-wide">
            {resultado.golesLocal} - {resultado.golesVisitante}
          </span>
        ) : (
          <>
            <span className="text-[10px] font-bold text-moss-muted">VS</span>
            <span className="text-[10px] font-semibold text-emerald-700">
              {partido.hora}
            </span>
          </>
        )}
      </div>
      <div className="flex items-center justify-end space-x-2 w-[43%] text-right min-w-0">
        <span
          className={`${
            esFinal ? "font-bold" : "font-semibold"
          } text-xs text-forest-900 whitespace-normal leading-tight`}
        >
          {partido.visitante}
        </span>
        <EquipoBadge nombre={partido.visitante} getTeamByName={getTeamByName} />
      </div>
    </div>
  );
}

export default function Calendario() {
  const { jornadas, resultados, getTeamByName, cargando } = useLigaData();

  if (cargando) {
    return (
      <div className="mt-10 text-center text-xs text-moss-muted">Cargando…</div>
    );
  }

  return (
    <>
      {/* BEGIN: HeroCard */}
      <div className="mt-3 mb-2" style={{ paddingLeft: 20, paddingRight: 20 }}>
        <div className="flex flex-col">
          <h2 className="font-serif text-2xl font-bold text-forest-900 tracking-tight mt-1">
            Calendario de Partidos
          </h2>
          <p className="text-xs text-moss-muted leading-tight">
            <span style={{ fontSize: 11 }}>{jornadas.length} Jornadas&nbsp;</span>
          </p>
        </div>
      </div>
      {/* END: HeroCard */}

      <div className="space-y-6 mt-2" style={{ paddingLeft: 20, paddingRight: 20 }}>
        {jornadas.map((jornada) => (
          <div key={jornada.numero} className={jornada.numero === jornadas.length ? "mb-6" : ""}>
            <div className="flex justify-between items-baseline mb-2 px-1">
              <div>
                <h3 className="font-serif text-lg font-bold text-forest-900 tracking-tight">
                  {jornada.titulo}
                </h3>
                <p className="text-[11px] text-moss-muted font-medium">
                  {jornada.fecha}
                </p>
              </div>
              {(jornada.badge || jornada.esProxima) && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600/15 text-emerald-800 border border-emerald-500/25">
                  {jornada.badge || "Próxima"}
                </span>
              )}
            </div>
            <section
              className="glass-card rounded-2xl p-3.5 border border-white/90 shadow-xs"
              id={`j${jornada.numero}`}
              style={{
                background: "rgba(255, 255, 255, 0.65)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="space-y-2.5">
                {jornada.partidos.map((partido) => (
                  <PartidoRow
                    key={partido.id}
                    partido={partido}
                    resultado={resultados[partido.id]}
                    getTeamByName={getTeamByName}
                  />
                ))}
              </div>
            </section>
          </div>
        ))}
      </div>
    </>
  );
}
