import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLigaData } from "../lib/useLigaData";
import { actualizarFechaJornada, marcarJornadaProxima } from "../lib/scheduleStore";
import { crearEquipo } from "../lib/teamsStore";
import { login, isLoggedIn, suscribirseASesion } from "../lib/adminAuth";
import PartidoAdminCard from "../components/PartidoAdminCard";
import EquipoAdminCard from "../components/EquipoAdminCard";
import SubirEscudoBoton from "../components/SubirEscudoBoton";
import { CampoFila, SelectorEstilizado } from "../components/AdminField";

function LoginForm({ onSuccess }) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    const ok = await login(correo, contrasena);
    setEnviando(false);

    if (ok) {
      setError("");
      onSuccess();
    } else {
      setError("Correo o contraseña incorrectos.");
    }
  };

  return (
    <div className="mt-10" style={{ paddingLeft: 20, paddingRight: 20 }}>
      <div className="glass-card rounded-2xl p-5 border border-white/90 space-y-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-forest-900">
            Acceso de administrador
          </h2>
          <p className="text-xs text-moss-muted mt-1">
            Ingresa tus credenciales para cargar los resultados de la jornada.
          </p>
        </div>

        <form onSubmit={enviar} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-moss-muted mb-1">
              Correo
            </label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              autoComplete="username"
              className="w-full h-10 px-3 rounded-xl border border-emerald-600/25 bg-white/80 text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-moss-muted mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              autoComplete="current-password"
              className="w-full h-10 px-3 rounded-xl border border-emerald-600/25 bg-white/80 text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          {error && <p className="text-[11px] font-semibold text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={enviando}
            className="w-full h-10 rounded-xl bg-emerald-600 text-white text-sm font-bold active:scale-95 transition disabled:opacity-60"
          >
            {enviando ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-xs text-moss-muted underline w-full text-center"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}

function FechaJornada({ jornada }) {
  const [fecha, setFecha] = useState(jornada.fecha);
  const [guardada, setGuardada] = useState(true);

  useEffect(() => {
    setFecha(jornada.fecha);
    setGuardada(true);
  }, [jornada.numero, jornada.fecha]);

  const guardar = async () => {
    if (fecha === jornada.fecha) return;
    await actualizarFechaJornada(jornada.numero, fecha);
    setGuardada(true);
  };

  return (
    <CampoFila etiqueta="Día de la jornada">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={fecha}
          onChange={(e) => {
            setFecha(e.target.value);
            setGuardada(false);
          }}
          onBlur={guardar}
          className="flex-1 h-10 px-3 text-sm rounded-xl border border-emerald-600/25 bg-white/80 text-forest-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        />
        {!guardada && <span className="text-[10px] text-emerald-700 flex-shrink-0">●</span>}
      </div>
    </CampoFila>
  );
}

function ProximaJornadaSelector({ jornadas }) {
  const actual = jornadas.find((j) => j.esProxima);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const cambiar = async (numero) => {
    setGuardando(true);
    const res = await marcarJornadaProxima(Number(numero));
    setGuardando(false);
    setMensaje(res.ok ? "Actualizado ✓" : res.mensaje);
    setTimeout(() => setMensaje(""), 3000);
  };

  return (
    <div>
      <CampoFila etiqueta="Próxima jornada">
        <SelectorEstilizado
          value={actual?.numero ?? ""}
          onChange={cambiar}
          disabled={guardando}
          options={jornadas.map((j) => ({ value: j.numero, label: `${j.titulo} — ${j.fecha}` }))}
        />
      </CampoFila>
      {mensaje && <p className="text-[10px] text-moss-muted mt-1 ml-[7.75rem]">{mensaje}</p>}
    </div>
  );
}

function TabResultados({ teams, jornadas }) {
  const [numeroJornada, setNumeroJornada] = useState(jornadas[0]?.numero);
  const jornada = jornadas.find((j) => j.numero === numeroJornada) || jornadas[0];

  const getTeamByName = (nombre) => teams.find((t) => t.name === nombre);

  return (
    <>
      <div className="mt-4 space-y-3" style={{ paddingLeft: 20, paddingRight: 20 }}>
        <ProximaJornadaSelector jornadas={jornadas} />

        <CampoFila etiqueta="Jornada">
          <SelectorEstilizado
            value={jornada.numero}
            onChange={(numero) => setNumeroJornada(Number(numero))}
            options={jornadas.map((j) => ({ value: j.numero, label: `${j.titulo} — ${j.fecha}` }))}
          />
        </CampoFila>

        <FechaJornada jornada={jornada} />
      </div>

      <div className="space-y-3 mt-4 mb-6" style={{ paddingLeft: 20, paddingRight: 20 }}>
        {jornada.partidos.map((partido) => (
          <PartidoAdminCard
            key={partido.id}
            matchId={partido.id}
            partido={partido}
            local={getTeamByName(partido.local)}
            visitante={getTeamByName(partido.visitante)}
          />
        ))}
      </div>
    </>
  );
}

function TabEquipos({ teams }) {
  const [nombre, setNombre] = useState("");
  const [logo, setLogo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [creando, setCreando] = useState(false);

  const agregarEquipo = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    setCreando(true);
    const res = await crearEquipo({ name: nombre.trim(), logo: logo.trim() });
    setCreando(false);
    if (res.ok) {
      setNombre("");
      setLogo("");
      setMensaje("Equipo creado ✓");
    } else {
      setMensaje(res.mensaje);
    }
    setTimeout(() => setMensaje(""), 3000);
  };

  return (
    <div className="space-y-3 mt-3 mb-6" style={{ paddingLeft: 20, paddingRight: 20 }}>
      <form
        onSubmit={agregarEquipo}
        className="rounded-2xl p-3.5 bg-white/70 border border-white/90 shadow-xs space-y-2"
      >
        <p className="text-xs font-bold text-forest-900">Añadir equipo nuevo</p>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del equipo"
          className="w-full h-9 px-2.5 text-xs rounded-lg border border-emerald-600/25 bg-white/80 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        />
        <div className="flex items-center gap-2">
          {logo && (
            <img
              src={logo}
              alt="Vista previa"
              className="w-9 h-9 object-contain flex-shrink-0 rounded-lg bg-white/60"
            />
          )}
          <input
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            placeholder="URL del escudo (opcional)"
            className="flex-1 min-w-0 h-9 px-2.5 text-xs rounded-lg border border-emerald-600/25 bg-white/80 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
          <SubirEscudoBoton
            onSubida={(url) => setLogo(url)}
            onError={(msg) => {
              setMensaje(msg);
              setTimeout(() => setMensaje(""), 5000);
            }}
          />
        </div>
        <div className="flex items-center justify-between">
          {mensaje && <span className="text-[10px] text-moss-muted">{mensaje}</span>}
          <button
            type="submit"
            disabled={creando}
            className="px-3 py-1.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white active:scale-95 transition disabled:opacity-60 ml-auto"
          >
            {creando ? "Creando…" : "Crear equipo"}
          </button>
        </div>
      </form>

      {teams.map((equipo) => (
        <EquipoAdminCard key={equipo.id} equipo={equipo} />
      ))}
    </div>
  );
}

export default function Admin() {
  const [autenticado, setAutenticado] = useState(false);
  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [tab, setTab] = useState("resultados");
  const { teams, jornadas, cargando } = useLigaData();

  useEffect(() => {
    let activo = true;

    isLoggedIn().then((ok) => {
      if (!activo) return;
      setAutenticado(ok);
      setCargandoSesion(false);
    });

    const desuscribir = suscribirseASesion((ok) => {
      if (activo) setAutenticado(ok);
    });

    return () => {
      activo = false;
      desuscribir();
    };
  }, []);


  if (cargandoSesion) {
    return (
      <div
        className="mt-10 text-center text-xs text-moss-muted"
        style={{ paddingLeft: 20, paddingRight: 20 }}
      >
        Cargando…
      </div>
    );
  }

  if (!autenticado) {
    return <LoginForm onSuccess={() => setAutenticado(true)} />;
  }

  return (
    <>
      <section className="pt-2 pb-1" style={{ paddingLeft: 20, paddingRight: 20 }}>
        <h2 className="text-2xl font-serif font-bold text-forest-950 tracking-tight">
          Panel de Administrador
        </h2>
      </section>

      <div className="flex gap-2 mt-3" style={{ paddingLeft: 20, paddingRight: 20 }}>
        {[
          { id: "resultados", label: "Resultados y horarios" },
          { id: "equipos", label: "Equipos y jugadores" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={
              tab === t.id
                ? "px-3 py-1.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white"
                : "px-3 py-1.5 rounded-full text-[11px] font-semibold bg-white/70 text-moss-muted border border-emerald-600/20"
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {cargando || jornadas.length === 0 ? (
        <div className="mt-10 text-center text-xs text-moss-muted">Cargando…</div>
      ) : tab === "resultados" ? (
        <TabResultados teams={teams} jornadas={jornadas} />
      ) : (
        <TabEquipos teams={teams} />
      )}
    </>
  );
}
