import { useEffect, useState } from "react";
import {
  Bookmark,
  PlusCircle,
  Trash2,
  User,
  LogOut,
} from "lucide-react";
import { supabase } from "../services/supabaseClient";

import BookmarkForm from "../components/Bookmarks/BookmarkForm";
import BookmarkList from "../components/Bookmarks/BookmarkList";
import TrashList from "../components/Bookmarks/TrashList";
import Profile from "../pages/Profile";

export default function Dashboard() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("bookmarks");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
  }, []);

  if (loading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading dashboard…
      </div>
    );
  }

  const user = session.user;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.replace("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="px-6 py-6 border-b">
          <h2 className="text-2xl font-extrabold text-indigo-600">
            SmartBookmarks
          </h2>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 text-sm">
          <SidebarItem
            icon={<Bookmark size={18} />}
            label="Bookmarks"
            active={active === "bookmarks"}
            onClick={() => setActive("bookmarks")}
          />

          <SidebarItem
            icon={<PlusCircle size={18} />}
            label="Add Bookmark"
            active={active === "add"}
            onClick={() => setActive("add")}
          />

          <SidebarItem
            icon={<Trash2 size={18} />}
            label="Trash"
            active={active === "trash"}
            onClick={() => setActive("trash")}
          />

          <SidebarItem
            icon={<User size={18} />}
            label="Profile"
            active={active === "profile"}
            onClick={() => setActive("profile")}
          />
        </nav>

        <div className="px-4 py-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 text-sm hover:underline"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="bg-white border-b px-4 md:px-6 py-4">
          <h1 className="text-lg font-semibold">
            Welcome, {user.user_metadata?.full_name}
          </h1>
        </header>

        {/* ================= MOBILE TOP NAV ================= */}
        <div className="md:hidden bg-white border-b flex justify-around py-2">
          <MobileNavItem
            icon={<Bookmark size={20} />}
            active={active === "bookmarks"}
            onClick={() => setActive("bookmarks")}
          />
          <MobileNavItem
            icon={<PlusCircle size={20} />}
            active={active === "add"}
            onClick={() => setActive("add")}
          />
          <MobileNavItem
            icon={<Trash2 size={20} />}
            active={active === "trash"}
            onClick={() => setActive("trash")}
          />
          <MobileNavItem
            icon={<User size={20} />}
            active={active === "profile"}
            onClick={() => setActive("profile")}
          />
          <MobileNavItem
            icon={<LogOut size={20} />}
            danger
            onClick={handleLogout}
          />
        </div>

        {/* CONTENT */}
        <main className="flex-1 p-4 md:p-6">
          {active === "bookmarks" && (
            <BookmarkList
              userId={user.id}
              onAdd={() => setActive("add")}
            />
          )}

          {active === "add" && (
            <BookmarkForm
              onSuccess={() => setActive("bookmarks")}
            />
          )}

          {active === "trash" && (
            <TrashList userId={user.id} />
          )}

          {active === "profile" && (
            <Profile user={user} />
          )}
        </main>
      </div>
    </div>
  );
}

/* ================= SIDEBAR ITEM ================= */
function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition
        ${
          active
            ? "bg-indigo-50 text-indigo-600 font-semibold"
            : "text-gray-600 hover:bg-gray-100"
        }`}
    >
      {icon}
      {label}
    </button>
  );
}

/* ================= MOBILE NAV ITEM ================= */
function MobileNavItem({ icon, active, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition
        ${
          danger
            ? "text-red-500"
            : active
            ? "text-indigo-600 bg-indigo-50"
            : "text-gray-500"
        }`}
    >
      {icon}
    </button>
  );
}