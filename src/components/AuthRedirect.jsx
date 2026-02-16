import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

export default function AuthRedirect({ children }) {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return <div className="min-h-screen" />;
  }

  // 🔑 if logged in, move away from home
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}