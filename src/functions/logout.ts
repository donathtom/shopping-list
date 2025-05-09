import { supabase } from "../lib/supabase";

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Fehler beim Logout:", error.message);
  }
};
