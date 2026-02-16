import { useState, useMemo } from "react";
import { supabase } from "../../services/supabaseClient";
import {
  Link2,
  Type,
  CheckCircle,
  AlertTriangle,
  Globe,
} from "lucide-react";

export default function BookmarkForm({ onSuccess }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔍 Normalize URL
  const normalizedUrl = useMemo(() => {
    if (!url) return "";
    return url.startsWith("http") ? url : `https://${url}`;
  }, [url]);

  // 🌐 Domain preview
  const domain = useMemo(() => {
    try {
      return new URL(normalizedUrl).hostname;
    } catch {
      return "";
    }
  }, [normalizedUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim() || !url.trim()) {
      setError("Both title and URL are required.");
      return;
    }

    try {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError("Session expired. Please login again.");
        return;
      }

      const { error: insertError } = await supabase
        .from("bookmarks")
        .insert({
          title: title.trim(),
          url: normalizedUrl,
          user_id: session.user.id,
        });

      if (insertError) {
        setError(insertError.message);
        return;
      }

      // ✅ SUCCESS
      setTitle("");
      setUrl("");
      setSuccess("Bookmark saved successfully ✨");

      // ⏱ Small delay → smoother UX
      setTimeout(() => {
        onSuccess?.(); // 👈 GO BACK TO BOOKMARK LIST
      }, 600);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm"
      >
        {/* HEADER */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Add New Bookmark
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Save useful links and access them anytime
          </p>
        </div>

        {/* TITLE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bookmark Title
          </label>
          <div className="relative">
            <Type
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="React Docs, GitHub, ChatGPT..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website URL
          </label>
          <div className="relative">
            <Link2
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* LIVE PREVIEW */}
        {domain && (
          <div className="flex items-center gap-3 bg-gray-50 border rounded-lg p-3">
            <img
              src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
              alt=""
              className="w-8 h-8"
            />
            <div className="text-sm">
              <p className="font-medium text-gray-800">
                {title || "Untitled Bookmark"}
              </p>
              <p className="text-gray-500 flex items-center gap-1">
                <Globe size={14} />
                {domain}
              </p>
            </div>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 border border-green-100 px-3 py-2 rounded-lg">
            <CheckCircle size={16} />
            {success}
          </div>
        )}

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium
                     hover:bg-indigo-700 active:scale-[0.98]
                     disabled:opacity-60 transition"
        >
          {loading ? "Saving..." : "Save Bookmark"}
        </button>
      </form>
    </div>
  );
}