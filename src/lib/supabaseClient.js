import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Esto aparece en la consola del navegador si faltan las variables
  // de entorno. Revisa el archivo .env (desarrollo local) o las
  // variables de entorno del proyecto en Vercel.
  console.error(
    "Faltan VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY. La app no podra conectarse a la base de datos."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
