import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AmbientGlows from "./AmbientGlows";
import BottomNav from "./BottomNav";
import AdminButton from "./AdminButton";
import { isLoggedIn, logout, suscribirseASesion } from "../lib/adminAuth";

export default function MobileShell() {
  const location = useLocation();
  const enAdmin = location.pathname === "/admin";
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    let activo = true;
    isLoggedIn().then((ok) => activo && setAutenticado(ok));
    const desuscribir = suscribirseASesion((ok) => activo && setAutenticado(ok));
    return () => {
      activo = false;
      desuscribir();
    };
  }, []);

  // Cada vez que se cambia de pagina (por cualquier boton de
  // navegacion), la pagina se abre siempre desde su inicio. La UNICA
  // excepcion es entrar a Estadisticas desde el boton "Ver Todo" de
  // Maximos Goleadores en Inicio, que debe abrir directo en la seccion
  // de Goles y Asistencia.
  useEffect(() => {
    const container = document.getElementById("app-scroll");
    if (!container) return;

    if (location.pathname === "/estadisticas" && location.hash === "#goles-asistencia") {
      const target = document.getElementById("goles-asistencia");
      target?.scrollIntoView({ behavior: "auto", block: "start" });
    } else {
      container.scrollTop = 0;
    }
  }, [location.pathname, location.hash]);

  return (
    // Contenedor de viewport: ocupa exactamente el alto/ancho de la
    // pantalla del telefono y NUNCA hace scroll el mismo.
    <div className="h-dvh w-full flex justify-center overflow-hidden bg-[#f8faf9] selection:bg-emerald-200 selection:text-forest-900">
      {/* Fondo fijo (el "telefono"): se adapta al alto/ancho de la
          pantalla pero permanece estatico, no se mueve con el scroll. */}
      <div className="w-full max-w-md h-full bg-white/75 backdrop-blur-3xl flex flex-col relative border-x border-emerald-900/5 shadow-2xl overflow-hidden">
        <AmbientGlows />

        {/* Unica zona que hace scroll: todo el contenido de cada
            pantalla se mueve aqui dentro, el fondo de arriba y el
            menu de abajo quedan estaticos. */}
        <div id="app-scroll" className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden relative z-10">
          {/* Header: se repite en todas las paginas, por eso vive aqui
              en el layout en vez de en cada pagina. */}
          <div
            className="pt-4 pb-2 flex items-center justify-between z-10"
            data-purpose="app-header"
            style={{ paddingLeft: 20, paddingRight: 20 }}
          >
            <div className="flex items-center space-x-2">
              <svg
                className="w-6 h-6 fill-emerald-600 drop-shadow-xs"
                viewBox="0 0 24 24"
              >
                <path d="M10.75 2.5a1.25 1.25 0 00-1.25 1.25V7.5H5.75A1.25 1.25 0 004.5 8.75v2.5c0 .69.56 1.25 1.25 1.25H9.5v8.75c0 .69.56 1.25 1.25 1.25h2.5c.69 0 1.25-.56 1.25-1.25V12.5h3.75c.69 0 1.25-.56 1.25-1.25v-2.5a1.25 1.25 0 00-1.25-1.25H14.5V3.75c0-.69-.56-1.25-1.25-1.25h-2.5z" />
              </svg>
              <h1 className="font-serif text-2xl font-bold tracking-tight text-forest-900">
                Liga Cristiana
              </h1>
            </div>
            {enAdmin ? (
              autenticado && (
                <button
                  type="button"
                  onClick={logout}
                  className="px-3 py-1.5 rounded-full text-[11px] font-semibold bg-white/70 text-red-600 border border-red-500/30 flex-shrink-0"
                >
                  Cerrar sesión
                </button>
              )
            ) : (
              <AdminButton />
            )}
          </div>

          <Outlet />
        </div>

        {/* Menu de navegacion: estatico en la parte de abajo, siempre
            visible aunque se haga scroll. El contenido se esconde
            justo 8px (pt-2) antes de llegar a su borde superior. */}
        <div className="shrink-0 relative z-40 pt-2 pb-3" style={{ paddingLeft: 20, paddingRight: 20 }}>
          <BottomNav />
        </div>

        {/* iPhone Home Indicator Line */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-forest-950/20 rounded-full pointer-events-none z-50"></div>
      </div>
    </div>
  );
}
