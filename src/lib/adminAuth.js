import { supabase } from "./supabaseClient";

// El administrador se crea directamente en el panel de Supabase
// (Authentication > Users > Add user), no hay registro publico.

export async function login(email, contrasena) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: contrasena,
  });
  return !error;
}

export async function logout() {
  await supabase.auth.signOut();
}

export async function isLoggedIn() {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
}

// Avisa cuando cambia la sesion (login/logout), incluso si ocurre en
// otra pestaña.
export function suscribirseASesion(callback) {
  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(!!session);
  });
  return () => listener.subscription.unsubscribe();
}
