import { useState } from "react";
import {
  actualizarEquipo,
  borrarEquipo,
  crearJugador,
  actualizarJugador,
  borrarJugador,
} from "../lib/teamsStore";
import SubirEscudoBoton from "./SubirEscudoBoton";

function FilaJugador({ jugador }) {
  const [nombre, setNombre] = useState(jugador.name);
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const guardarNombre = async () => {
    if (!nombre.trim() || nombre === jugador.name) {
      setEditando(false);
      return;
    }
    setGuardando(true);
    await actualizarJugador(jugador.id, nombre.trim());
    setGuardando(false);
    setEditando(false);
  };

  const eliminar = async () => {
    if (!window.confirm(`¿Quitar a ${jugador.name} del equipo?`)) return;
    await borrarJugador(jugador.id);
  };

  return (
    <div className="flex items-center gap-1.5 bg-white/60 rounded-lg px-2 py-1">
      {editando ? (
        <input
          autoFocus
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onBlur={guardarNombre}
          onKeyDown={(e) => e.key === "Enter" && guardarNombre()}
          className="flex-1 h-7 px-1.5 text-[11px] rounded-md border border-emerald-600/30 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditando(true)}
          className="flex-1 text-left text-[11px] text-forest-900 truncate"
        >
          {guardando ? "Guardando…" : jugador.name}
        </button>
      )}
      <button
        type="button"
        onClick={eliminar}
        aria-label={`Quitar a ${jugador.name}`}
        className="text-red-500 flex-shrink-0"
      >
        <svg className="w-3.5 h-3.5 stroke-current" fill="none" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

export default function EquipoAdminCard({ equipo }) {
  const [nombre, setNombre] = useState(equipo.name);
  const [logo, setLogo] = useState(equipo.logo);
  const [nuevoJugador, setNuevoJugador] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [guardandoDatos, setGuardandoDatos] = useState(false);
  const [expandido, setExpandido] = useState(false);

  const guardarDatos = async () => {
    setGuardandoDatos(true);
    const res = await actualizarEquipo(equipo.id, { name: nombre.trim(), logo: logo.trim() });
    setGuardandoDatos(false);
    setMensaje(res.ok ? "Guardado ✓" : res.mensaje);
    setTimeout(() => setMensaje(""), 3000);
  };

  const agregarJugador = async (e) => {
    e.preventDefault();
    if (!nuevoJugador.trim()) return;
    await crearJugador(equipo.id, nuevoJugador.trim());
    setNuevoJugador("");
  };

  const eliminarEquipo = async () => {
    if (
      !window.confirm(
        `¿Eliminar el equipo "${equipo.name}" y todos sus jugadores? Esta acción no se puede deshacer.`
      )
    )
      return;
    const res = await borrarEquipo(equipo.id);
    if (!res.ok) {
      setMensaje(res.mensaje);
      setTimeout(() => setMensaje(""), 5000);
    }
  };

  return (
    <div className="rounded-2xl p-3.5 bg-white/70 border border-white/90 shadow-xs space-y-3">
      <div className="flex items-center gap-2">
        <img
          src={logo || equipo.logo}
          alt={equipo.name}
          className="w-14 h-14 object-contain flex-shrink-0 rounded-lg bg-white/60"
        />
        <div className="flex-1 min-w-0 space-y-1.5">
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del equipo"
            className="w-full h-8 px-2 text-xs font-semibold rounded-lg border border-emerald-600/25 bg-white/80 text-forest-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
          <div className="flex items-center gap-1.5">
            <input
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              placeholder="URL del escudo"
              className="flex-1 min-w-0 h-9 px-2 text-[11px] rounded-lg border border-emerald-600/25 bg-white/80 text-forest-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
            <SubirEscudoBoton
              onSubida={(url) => {
                setLogo(url);
                setMensaje("Foto subida, dale a Guardar para aplicarla ✓");
                setTimeout(() => setMensaje(""), 4000);
              }}
              onError={(msg) => {
                setMensaje(msg);
                setTimeout(() => setMensaje(""), 5000);
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={eliminarEquipo}
          className="text-[11px] font-semibold text-red-600"
        >
          Eliminar equipo
        </button>
        <div className="flex items-center gap-2">
          {mensaje && <span className="text-[10px] text-moss-muted">{mensaje}</span>}
          <button
            type="button"
            onClick={guardarDatos}
            disabled={guardandoDatos}
            className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white active:scale-95 transition disabled:opacity-60"
          >
            {guardandoDatos ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setExpandido((v) => !v)}
        className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 pt-1 border-t border-forest-900/10 w-full"
      >
        <svg
          className={`w-3.5 h-3.5 stroke-current transition-transform ${expandido ? "rotate-180" : ""}`}
          fill="none"
          strokeWidth="2.2"
          viewBox="0 0 24 24"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {expandido ? "Ocultar jugadores" : `Jugadores (${equipo.players.length})`}
      </button>

      {expandido && (
        <div className="space-y-1.5">
          {equipo.players.map((jugador) => (
            <FilaJugador key={jugador.id} jugador={jugador} />
          ))}

          <form onSubmit={agregarJugador} className="flex items-center gap-1.5 pt-1">
            <input
              value={nuevoJugador}
              onChange={(e) => setNuevoJugador(e.target.value)}
              placeholder="Nombre del nuevo jugador"
              className="flex-1 h-8 px-2 text-[11px] rounded-lg border border-emerald-600/25 bg-white/80 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
            <button
              type="submit"
              className="px-3 h-8 rounded-lg text-[11px] font-bold bg-emerald-600 text-white active:scale-95 transition"
            >
              Añadir
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
