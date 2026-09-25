import { useEffect, useRef, useState } from "react";

// Fila con la etiqueta a la izquierda y el control a la derecha, con
// el mismo ancho de etiqueta y la misma altura en los 3 selectores del
// panel, para que se vean simetricos entre si.
export function CampoFila({ etiqueta, children }) {
  return (
    <div className="flex items-center gap-3">
      <label className="w-28 flex-shrink-0 text-[11px] font-semibold text-moss-muted">
        {etiqueta}
      </label>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

// Reemplaza al <select> nativo: el navegador no permite darle estilo
// al menu que se despliega de un <select> normal, asi que este
// dropdown esta hecho con un boton + una lista posicionada debajo,
// con el mismo estilo "glass" del resto de la app.
export function SelectorEstilizado({ value, onChange, options, disabled }) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClickFuera = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setAbierto(false);
    };
    document.addEventListener("mousedown", onClickFuera);
    return () => document.removeEventListener("mousedown", onClickFuera);
  }, []);

  const seleccionado = options.find((o) => String(o.value) === String(value));

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setAbierto((v) => !v)}
        className="w-full h-10 px-3 rounded-xl border border-emerald-600/25 bg-white/80 text-sm font-semibold text-forest-900 flex items-center justify-between gap-2 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
      >
        <span className="truncate text-left">{seleccionado?.label ?? "Selecciona"}</span>
        <svg
          className={`w-4 h-4 stroke-current text-moss-muted flex-shrink-0 transition-transform ${
            abierto ? "rotate-180" : ""
          }`}
          fill="none"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {abierto && (
        <div
          className="absolute z-30 mt-1.5 w-full max-h-64 overflow-y-auto rounded-2xl border border-white/90 p-1.5 space-y-0.5"
          style={{
            background: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow:
              "rgba(11, 43, 27, 0.14) 0px 16px 36px -6px, rgba(255, 255, 255, 0.95) 0px 1px 1px inset",
          }}
        >
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                onChange(o.value);
                setAbierto(false);
              }}
              className={
                String(o.value) === String(value)
                  ? "w-full text-left px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-600/15 text-emerald-800"
                  : "w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-forest-900 hover:bg-emerald-50/70 transition-colors"
              }
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
