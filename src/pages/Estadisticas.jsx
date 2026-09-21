import { useLigaData } from "../lib/useLigaData";

const SwapIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path
      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UpDownIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path
      d="M7 16V4m0 0L3 8m4-4l4 4m6 4v12m0 0l4-4m-4 4l-4-4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Estadisticas() {
  const { standings, goleadores, cargando } = useLigaData();

  if (cargando) {
    return (
      <div className="mt-10 text-center text-xs text-moss-muted">Cargando…</div>
    );
  }

  return (
    <>
      <section
        className="pt-2 pb-1"
        data-purpose="screen-title-banner"
        style={{ paddingLeft: 20, paddingRight: 20 }}
      >
        <h2 className="text-2xl font-serif font-bold text-forest-950 tracking-tight">
          Estadísticas del Torneo
        </h2>
      </section>

      <main className="space-y-6 flex-1 mt-4">
        {/* BEGIN: TablaPosicionesSection */}
        <section
          aria-labelledby="tabla-posiciones-title"
          style={{ paddingLeft: 20, paddingRight: 20 }}
        >
          <div className="flex justify-between items-baseline mb-3">
            <div>
              <h3
                className="font-serif text-xl font-bold text-forest-950 tracking-tight"
                id="tabla-posiciones-title"
              >
                Tabla de Posiciones
              </h3>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50/80 px-2.5 py-0.5 rounded-full border border-emerald-200/60 shadow-xs">
              <SwapIcon />
              Deslizar
            </span>
          </div>

          <div className="glass-card rounded-2xl p-4 overflow-hidden border border-white/90">
            <div className="overflow-x-auto smooth-scroll custom-scrollbar pb-1">
              <table className="w-full text-left text-xs min-w-[360px] whitespace-nowrap">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wider font-bold text-moss-muted border-b border-forest-900/10 pb-2">
                    <th className="py-2 pl-1 pr-2 w-6 text-center">#</th>
                    <th className="py-2 px-2">Equipo</th>
                    <th className="py-2 px-2 text-center">PJ</th>
                    <th className="py-2 px-2 text-center">PG</th>
                    <th className="py-2 px-2 text-center">PE</th>
                    <th className="py-2 px-2 text-center">PP</th>
                    <th className="py-2 px-2 text-center">DG</th>
                    <th className="py-2 pr-1 pl-2 text-right font-bold text-forest-900">
                      PTS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-900/5 text-slate-700">
                  {standings.map((row, idx) => (
                    <tr key={row.team.id} className="hover:bg-emerald-50/40 transition-colors">
                      <td className="py-2.5 pl-1 pr-2 text-center font-medium text-forest-850">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-2 font-medium text-forest-900 flex items-center space-x-2.5">
                        <img
                          alt={row.team.name}
                          className="w-6 h-6 object-contain flex-shrink-0"
                          src={row.team.logo}
                        />
                        <span className="truncate font-medium">{row.team.name}</span>
                      </td>
                      <td className="py-2.5 px-2 text-center text-moss-muted font-medium">
                        {row.pj}
                      </td>
                      <td className="py-2.5 px-2 text-center text-moss-muted font-medium">
                        {row.pg}
                      </td>
                      <td className="py-2.5 px-2 text-center text-moss-muted font-medium">
                        {row.pe}
                      </td>
                      <td className="py-2.5 px-2 text-center text-moss-muted font-medium">
                        {row.pp}
                      </td>
                      <td className="py-2.5 px-2 text-center text-moss-muted font-medium">
                        {row.dg}
                      </td>
                      <td className="py-2.5 pr-1 pl-2 text-right font-bold text-forest-900">
                        {row.pts}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 pt-2.5 border-t border-forest-900/10 flex items-center justify-between text-[11px] text-moss-muted">
              <span>* Clasifican los 4 mejores equipos a semifinales</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shadow-xs"></span>
            </div>
          </div>
        </section>
        {/* END: TablaPosicionesSection */}

        {/* BEGIN: GoleadoresAsistenciasSection */}
        <section
          aria-labelledby="goleadores-asist-title"
          id="goles-asistencia"
          className="mb-4"
          style={{ paddingLeft: 20, paddingRight: 20 }}
        >
          <div className="flex justify-between items-baseline mb-3">
            <div>
              <h3
                className="font-serif text-xl font-bold text-forest-950 tracking-tight"
                id="goleadores-asist-title"
              >
                Goleadores y Asistencias
              </h3>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50/80 px-2.5 py-0.5 rounded-full border border-emerald-200/60 shadow-xs">
              <UpDownIcon />
              Deslizar
            </span>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-white/90">
            <div className="overflow-x-auto overflow-y-auto smooth-scroll custom-scrollbar max-h-[480px] relative rounded-xl">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="sticky top-0 bg-white/95 backdrop-blur-md z-10 shadow-xs">
                  <tr className="text-[11px] uppercase tracking-wider font-bold text-moss-muted border-b border-forest-900/10 pb-2">
                    <th className="py-2 pl-1 pr-2 w-6 text-center">#</th>
                    <th className="py-2 px-2">Jugador</th>
                    <th className="py-2 px-2 text-center">Equipo</th>
                    <th className="py-2 px-2 text-center">Goles</th>
                    <th className="py-2 pr-1 pl-2 text-center">Asist</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-900/5 text-slate-700">
                  {goleadores.map((g, idx) => (
                    <tr key={g.jugadorId} className="hover:bg-emerald-50/40 transition-colors">
                      <td className="py-2 pl-1 pr-2 text-center font-medium text-moss-muted">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-2 font-medium text-forest-900">
                        {g.jugador}
                      </td>
                      <td className="py-2 px-2 text-center">
                        <div className="flex justify-center">
                          <img
                            alt={g.equipo.name}
                            className="w-6 h-6 object-contain"
                            src={g.equipo.logo}
                          />
                        </div>
                      </td>
                      <td className="py-2 px-2 text-center text-forest-900 font-medium">
                        {g.goles}
                      </td>
                      <td className="py-2 pr-1 pl-2 text-center text-moss-muted font-medium">
                        {g.asistencias}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        {/* END: GoleadoresAsistenciasSection */}
      </main>
    </>
  );
}