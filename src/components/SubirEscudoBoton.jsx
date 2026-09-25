import { useRef, useState } from "react";
import { subirEscudo } from "../lib/teamsStore";

// Boton que abre el selector de archivos, sube la imagen elegida al
// Storage de Supabase, y avisa al padre con la URL resultante
// (onSubida) para que la ponga en su campo de texto del escudo.
export default function SubirEscudoBoton({ onSubida, onError }) {
  const inputRef = useRef(null);
  const [subiendo, setSubiendo] = useState(false);

  const manejarArchivo = async (e) => {
    const archivo = e.target.files?.[0];
    e.target.value = ""; // permite volver a elegir el mismo archivo despues
    if (!archivo) return;

    setSubiendo(true);
    const res = await subirEscudo(archivo);
    setSubiendo(false);

    if (res.ok) {
      onSubida(res.url);
    } else {
      onError?.(res.mensaje);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={manejarArchivo}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={subiendo}
        className="px-3 h-9 rounded-lg text-[11px] font-bold bg-emerald-600 text-white active:scale-95 transition disabled:opacity-60 flex-shrink-0"
      >
        {subiendo ? "Subiendo…" : "Subir foto"}
      </button>
    </>
  );
}
