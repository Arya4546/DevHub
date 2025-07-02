import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function BugCard({ bug }) {
  const [suggestion, setSuggestion] = useState(bug.aiSuggestion || ""); // ✅ show saved value if present
  const [loading, setLoading] = useState(false);

  const handleGetSuggestion = async () => {
    setLoading(true);
    const token = localStorage.getItem("devhub_token");

    try {
      // ✅ MUST MATCH BACKEND: POST, not GET!
      const res = await axios.post(
        `${API_BASE_URL}/api/bugs/${bug._id}/ai`,
        {}, // empty POST body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuggestion(res.data.suggestion);
    } catch (err) {
      console.error("AI Suggestion Error:", err.message);
      alert("Failed to get AI suggestion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-[#141414] rounded-2xl p-5 mb-6 shadow-lg border border-[#222]"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-lg font-bold uppercase">
          {bug.user.name[0]}
        </div>
        <div>
          <p className="font-semibold">{bug.user.name}</p>
          <p className="text-xs text-gray-400">
            {new Date(bug.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <h3 className="text-xl font-bold text-primary mb-2">{bug.title}</h3>
      <p className="mb-3 text-gray-200">{bug.description}</p>

      {bug.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {bug.tags.map((tag, i) => (
            <span
              key={i}
              className="bg-red-600 text-white px-2 py-1 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={handleGetSuggestion}
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm mb-3"
      >
        {loading ? "Thinking..." : "💡 Get AI Suggestion"}
      </button>

      {suggestion && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-sm text-gray-300 bg-black/20 p-3 rounded"
        >
          <strong className="text-primary">AI Suggestion:</strong>{" "}
          <p className="whitespace-pre-line">{suggestion}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
