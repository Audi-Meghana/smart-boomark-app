import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import { supabase } from "../services/supabaseClient";
import {
  ShieldCheck,
  Zap,
  LayoutGrid,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ HANDLE LOGIN REDIRECT (CRITICAL FOR VERCEL)
  useEffect(() => {
    // 1️⃣ Handle page reload after OAuth
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate("/dashboard", { replace: true });
      }
    });

    // 2️⃣ Listen for login event
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/dashboard", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // ✅ Google Login (NO redirectTo)
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) {
        console.error(error);
        alert("Google login failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-gray-800">
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="pt-32 pb-24 relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-indigo-200 rounded-full blur-3xl opacity-40" />
        <div className="absolute top-40 -right-32 w-[350px] h-[350px] bg-orange-200 rounded-full blur-3xl opacity-40" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-gray-200 px-4 py-1 rounded-full text-xs sm:text-sm font-medium mb-8 shadow-sm">
            <span className="w-2 h-2 bg-indigo-500 rounded-full" />
            Simple · Private · Real-time
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Your bookmarks,
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              beautifully organized
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Save links instantly. Access them anywhere.
            Private to you and synced in real-time.
          </p>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-base shadow-lg transition-all
              ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-[1.02]"
              }`}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            {loading ? "Signing in..." : "Get started with Google"}
            <ArrowRight size={18} />
          </button>

          <p className="mt-6 text-xs sm:text-sm text-gray-400">
            No credit card · Free forever · Secure login
          </p>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6">
            Why SmartBookmarks?
          </h2>

          <p className="text-gray-600 max-w-3xl mx-auto text-center mb-16">
            A modern replacement for browser bookmarks — designed
            for speed, privacy, and clarity.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<ShieldCheck />}
              title="Secure by default"
              desc="Google authentication keeps your data private and protected."
            />
            <FeatureCard
              icon={<Zap />}
              title="Instant sync"
              desc="Bookmarks update in real-time across all your devices."
            />
            <FeatureCard
              icon={<LayoutGrid />}
              title="Clean dashboard"
              desc="A distraction-free workspace for your important links."
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ================= COMPONENT ================= */

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition">
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4">
        {icon}
      </div>
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}