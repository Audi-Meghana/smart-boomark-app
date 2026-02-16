import { useEffect, useState } from "react";
import {
  Bookmark,
  Trash2,
  Pin,
  Activity,
  Calendar,
  BarChart3,
} from "lucide-react";
import { supabase } from "../services/supabaseClient";

export default function Profile({ user }) {
  const [stats, setStats] = useState({
    total: 0,
    deleted: 0,
    pinned: 0,
  });

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) loadProfile();
  }, [user]);

  const loadProfile = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("bookmarks")
      .select("created_at, deleted_at, pinned")
      .eq("user_id", user.id);

    if (error) {
      console.error("PROFILE ERROR:", error);
      setLoading(false);
      return;
    }

    // ---------- STATS ----------
    setStats({
      total: data.length,
      deleted: data.filter(b => b.deleted_at !== null).length,
      pinned: data.filter(b => b.pinned === true).length,
    });

    // ---------- ACTIVITY (LAST 7 DAYS) ----------
    const map = {};
    data.forEach(b => {
      const day = new Date(b.created_at).toDateString();
      map[day] = (map[day] || 0) + 1;
    });

    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toDateString();
      days.push({
        day: key,
        count: map[key] || 0,
      });
    }

    setHistory(days);
    setLoading(false);
  };

  if (loading) {
    return <p className="text-gray-500">Loading profile…</p>;
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* USER CARD */}
      <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-5">
        <img
          src={user.user_metadata?.avatar_url || "/avatar.png"}
          alt="avatar"
          className="w-20 h-20 rounded-full border"
        />
        <div>
          <h2 className="text-xl font-semibold">
            {user.user_metadata?.full_name || "User"}
          </h2>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<Bookmark size={18} />} label="Total" value={stats.total} />
        <StatCard icon={<Trash2 size={18} />} label="Deleted" value={stats.deleted} />
        <StatCard icon={<Pin size={18} />} label="Pinned" value={stats.pinned} />
      </div>

      {/* ACTIVITY GRAPH — PIXEL BASED (FIXED) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold flex items-center gap-2 mb-4">
          <Activity size={18} />
          Activity (Last 7 Days)
        </h3>

        <div className="flex items-end gap-4 h-[160px] border-t pt-4">
          {history.map((h, index) => {
            // 🔥 GUARANTEED HEIGHT
            const height =
              h.count === 0 ? 12 : Math.min(h.count * 24, 140);

            return (
              <div key={index} className="flex flex-col items-center w-full">
                <div
                  className="w-8 bg-indigo-600 rounded-md transition-all"
                  style={{ height: `${height}px` }}
                  title={`${h.count} bookmarks`}
                />
                <span className="text-xs text-gray-500 mt-2">
                  {new Date(h.day).getDate()}
                </span>
              </div>
            );
          })}
        </div>

        {stats.total === 0 && (
          <p className="text-sm text-gray-400 mt-4 text-center">
            No activity yet — add bookmarks to see progress 📊
          </p>
        )}
      </div>

      {/* INSIGHTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InsightCard
          icon={<BarChart3 />}
          title="Avg per day"
          value={(stats.total / 7).toFixed(1)}
        />
        <InsightCard
          icon={<Calendar />}
          title="Member since"
          value={new Date(user.created_at).toDateString()}
        />
      </div>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border">
      <div className="flex items-center gap-2 text-indigo-600">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}

function InsightCard({ icon, title, value }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border flex items-center gap-4">
      <div className="text-indigo-600">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}