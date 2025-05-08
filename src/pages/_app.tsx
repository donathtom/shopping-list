import { supabase } from "@/lib/supabase";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import router from "next/router";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          router.push("/login");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return <Component {...pageProps} />;
}
