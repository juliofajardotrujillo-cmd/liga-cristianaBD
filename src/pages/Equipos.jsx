import { useLigaData } from "../lib/useLigaData";

export default function Equipos() {
  const { teams, cargando } = useLigaData();

  if (cargando) {
    return (
      <div className="mt-10 text-center text-xs text-moss-muted">Cargando…</div>
    );
  }

  return (
    <>
      <div className="mt-2 mb-3" style={{ paddingLeft: 20, paddingRight: 20 }}>
        <div className="flex flex-col">
          <h2 className="font-serif text-2xl font-bold text-forest-900 tracking-tight mt-1">
            Plantillas de Equipos
          </h2>
          <p className="text-xs text-moss-muted leading-tight">
            <span style={{ fontSize: 11 }}>Jugadores inscritos por club</span>
          </p>
        </div>
      </div>

      <main
        className="space-y-4"
        data-purpose="team-rosters"
        style={{ paddingLeft: 20, paddingRight: 20 }}
      >
        {teams.map((team) => {
          const mitad = Math.ceil(team.players.length / 2);
          const col1 = team.players.slice(0, mitad);
          const col2 = team.players.slice(mitad);

          return (
            <section
              key={team.id}
              className="glass-card rounded-2xl p-4 border border-white/90"
              id={team.id}
              style={{
                background: "rgba(255, 255, 255, 0.65)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-forest-900/10">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={team.logo}
                    alt={team.name}
                    className="w-8 h-8 object-contain"
                  />
                  <div>
                    <h3 className="font-serif text-base font-bold text-forest-900 leading-tight">
                      {team.name}
                    </h3>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600/15 text-emerald-800 border border-emerald-500/25">
                  {team.players.length} Jugadores
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  {col1.map((player, idx) => (
                    <div
                      key={player.id}
                      className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl"
                    >
                      <span className="text-[10px] font-bold text-moss-muted w-4 text-center">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-xs text-forest-900 truncate">
                        {player.name}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5">
                  {col2.map((player, idx) => (
                    <div
                      key={player.id}
                      className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl"
                    >
                      <span className="text-[10px] font-bold text-moss-muted w-4 text-center">
                        {mitad + idx + 1}
                      </span>
                      <span className="font-semibold text-xs text-forest-900 truncate">
                        {player.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </main>
    </>
  );
}
