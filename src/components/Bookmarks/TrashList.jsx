import { useEffect, useState } from "react";
import { Trash2, RotateCcw, Clock } from "lucide-react";
import { supabase } from "../../services/supabaseClient";

export default function TrashList({ userId }) {
  const [trash, setTrash] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userId) {
      fetchTrash();
    }
  }, [userId]);

  const fetchTrash = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setTrash(data || []);
    }

    setLoading(false);
  };

  // ♻ Restore bookmark
  const handleRestore = async (id) => {
    await supabase
      .from("bookmarks")
      .update({ deleted_at: null })
      .eq("id", id)
      .eq("user_id", userId);

    fetchTrash();
  };

  // ❌ Permanent delete (manual)
  const handlePermanentDelete = async (id) => {
    const confirmDelete = window.confirm(
      "This will permanently delete the bookmark. Continue?"
    );
    if (!confirmDelete) return;

    await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    fetchTrash();
  };

  // ⏳ Days left before auto-delete
  const daysLeft = (deletedAt) => {
    const deletedDate = new Date(deletedAt);
    const now = new Date();
    const diffDays = 7 - Math.floor((now - deletedDate) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
    return <p className="text-gray-500">Loading trash...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-sm">{error}</p>;
  }

  if (trash.length === 0) {
    return (
      <p className="text-gray-500 text-sm">
        Trash is empty.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {trash.map((item) => (
        <div
          key={item.id}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border rounded-xl p-4 bg-white"
        >
          {/* LEFT */}
          <div className="flex items-start gap-4">
            <img
              src={`https://www.google.com/s2/favicons?domain=${item.url}&sz=64`}
              alt="favicon"
              className="w-9 h-9 mt-1"
            />

            <div>
              <p className="font-medium text-gray-900">
                {item.title}
              </p>

              <p className="text-sm text-gray-500 break-all">
                {item.url}
              </p>

              <div className="flex items-center gap-1 mt-1 text-xs text-orange-600">
                <Clock size={14} />
                Auto deletes in {daysLeft(item.deleted_at)} days
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 self-end sm:self-center">
            <button
              onClick={() => handleRestore(item.id)}
              className="flex items-center gap-1 text-sm text-green-600 hover:underline"
            >
              <RotateCcw size={16} />
              Restore
            </button>

            <button
              onClick={() => handlePermanentDelete(item.id)}
              className="flex items-center gap-1 text-sm text-red-500 hover:underline"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}