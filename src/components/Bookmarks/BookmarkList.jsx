import { useEffect, useMemo, useState } from "react";
import {
  Trash2,
  Clock,
  Search,
  Bookmark,
  Plus,
  Calendar,
} from "lucide-react";
import { supabase } from "../../services/supabaseClient";

export default function BookmarkList({ userId, onAdd = () => {} }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // UI STATES
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  // FETCH BOOKMARKS
  useEffect(() => {
    if (userId) fetchBookmarks();
    // eslint-disable-next-line
  }, [userId]);

  const fetchBookmarks = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) setError(error.message);
    else setBookmarks(data || []);

    setLoading(false);
  };

  // DELETE (SOFT)
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Move this bookmark to Trash?"
    );
    if (!confirmDelete) return;

    await supabase
      .from("bookmarks")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId);

    fetchBookmarks();
  };

  // FILTER + SEARCH
  const filteredBookmarks = useMemo(() => {
    const now = new Date();

    return bookmarks.filter((b) => {
      const created = new Date(b.created_at);

      let dateMatch = true;
      if (dateFilter === "today") {
        dateMatch = created.toDateString() === now.toDateString();
      }
      if (dateFilter === "7days") {
        dateMatch =
          (now - created) / (1000 * 60 * 60 * 24) <= 7;
      }
      if (dateFilter === "month") {
        dateMatch =
          created.getMonth() === now.getMonth() &&
          created.getFullYear() === now.getFullYear();
      }

      const q = search.toLowerCase();
      const searchMatch =
        b.title.toLowerCase().includes(q) ||
        b.url.toLowerCase().includes(q);

      return dateMatch && searchMatch;
    });
  }, [bookmarks, search, dateFilter]);

  // DATE FORMAT
  const formatDate = (timestamp) =>
    new Date(timestamp).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // LOADING
  if (loading) {
    return (
      <p className="text-sm text-gray-500">
        Loading bookmarks…
      </p>
    );
  }

  // ERROR
  if (error) {
    return (
      <p className="text-sm text-red-500">
        {error}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        {/* SEARCH */}
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search bookmarks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* DATE FILTER */}
        <div className="relative">
          <Calendar
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-lg border text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All</option>
            <option value="today">Today</option>
            <option value="7days">Last 7 days</option>
            <option value="month">This month</option>
          </select>
        </div>

        {/* ADD BUTTON */}
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 px-4 py-2
                     rounded-lg bg-indigo-600 text-white text-sm
                     hover:bg-indigo-700 transition shadow"
        >
          <Plus size={14} />
          Add
        </button>
      </div>

      {/* EMPTY STATE */}
      {filteredBookmarks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24
                        bg-white rounded-2xl border text-center">
          <div className="w-16 h-16 rounded-xl bg-indigo-50
                          flex items-center justify-center mb-5">
            <Bookmark size={32} className="text-indigo-500" />
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            No bookmarks found
          </h3>

          <p className="text-sm text-gray-500 mb-6 max-w-sm">
            Save useful links and keep everything organized
            in one place.
          </p>

          <button
            onClick={onAdd}
            className="px-6 py-2.5 rounded-lg bg-indigo-600
                       text-white text-sm font-medium
                       hover:bg-indigo-700 transition shadow"
          >
            + Add your first bookmark
          </button>
        </div>
      )}

      {/* BOOKMARK LIST */}
      {filteredBookmarks.map((b) => (
        <div
          key={b.id}
          className="flex flex-col sm:flex-row sm:items-center
                     sm:justify-between gap-3 p-3
                     bg-white border rounded-xl
                     hover:shadow-sm transition"
        >
          {/* LEFT */}
          <div className="flex items-start gap-3">
            <img
              src={`https://www.google.com/s2/favicons?domain=${b.url}&sz=64`}
              alt="favicon"
              className="w-7 h-7 mt-1"
            />

            <div>
              <p className="font-medium text-sm text-gray-900">
                {b.title}
              </p>

              <a
                href={b.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-600 hover:underline break-all"
              >
                {b.url}
              </a>

              <div className="flex items-center gap-1 mt-0.5
                              text-[11px] text-gray-500">
                <Clock size={12} />
                {formatDate(b.created_at)}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <button
            onClick={() => handleDelete(b.id)}
            className="flex items-center gap-1 text-xs
                       text-red-500 hover:text-red-600
                       self-end sm:self-center"
          >
            <Trash2 size={14} />
            Trash
          </button>
        </div>
      ))}
    </div>
  );
}