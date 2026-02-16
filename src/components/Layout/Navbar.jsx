import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { Bookmark, Menu, X } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user || null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.replace("/");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <a href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-md">
            <Bookmark size={20} className="text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            SmartBookmarks
          </span>
        </a>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#about" className="hover:text-indigo-600">About</a>
          <a href="#blogs" className="hover:text-indigo-600">Blogs</a>
          <a href="#pricing" className="hover:text-indigo-600">Pricing</a>
          <a href="#contact" className="hover:text-indigo-600">Contact</a>
        </div>

        {/* DESKTOP AUTH */}
        <div className="hidden md:block">
          {!user ? (
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className={`flex items-center gap-3 px-5 py-2 rounded-full border shadow-sm transition
                ${
                  loading
                    ? "bg-gray-100 cursor-not-allowed"
                    : "bg-white hover:bg-gray-50 hover:shadow-md"
                }`}
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span className="text-sm font-medium text-gray-700">
                {loading ? "Signing in..." : "Sign in "}
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <img
                src={user.user_metadata?.avatar_url}
                className="w-9 h-9 rounded-full border"
              />
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:underline"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-gray-700"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t px-6 py-6 space-y-4">
          <a
            href="#about"
            onClick={() => setMobileOpen(false)}
            className="block text-gray-700 font-medium"
          >
            About
          </a>
          <a
            href="#blogs"
            onClick={() => setMobileOpen(false)}
            className="block text-gray-700 font-medium"
          >
            Blogs
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileOpen(false)}
            className="block text-gray-700 font-medium"
          >
            Pricing
          </a>
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="block text-gray-700 font-medium"
          >
            Contact
          </a>

          <div className="pt-4 border-t">
            {!user ? (
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-5 py-2 rounded-full border shadow-sm"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  className="w-5 h-5"
                />
                <span className="text-sm font-medium">
                  Sign in 
                </span>
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full text-center text-red-500 font-medium"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}