import { useDispatch } from "react-redux";
import axios from "axios";
import { motion } from "framer-motion";
import { updateReactions, addCommentToPost } from "../redux/slices/postSlice";
import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function PostCard({ post }) {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReaction = async () => {
    const token = localStorage.getItem("devhub_token");
    await axios.post(`${API_BASE_URL}/api/posts/${post._id}/react`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("devhub_token");
      const res = await axios.post(
        `${API_BASE_URL}/api/posts/${post._id}/comment`,
        { text: comment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      
      setComment("");
    } catch (err) {
      console.error("Add comment failed", err);
    } finally {
      setLoading(false);
    }
  };

  const imageUrl = post.imageUrl ? `${API_BASE_URL}${post.imageUrl}` : null;
  const videoUrl = post.videoUrl ? `${API_BASE_URL}${post.videoUrl}` : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-[#141414] rounded-2xl p-5 mb-6 shadow-lg border border-[#222]"
    >
     <div className="flex items-center gap-3 mb-4">
  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-lg font-bold uppercase">
    {post.user?.name ? post.user.name[0] : "?"}
  </div>
  <div>
    <p className="font-semibold">{post.user?.name || "Unknown"}</p>
    <p className="text-xs text-gray-400">
      {new Date(post.createdAt).toLocaleString()}
    </p>
  </div>
</div>

      {post.caption && <p className="mb-3 text-gray-200">{post.caption}</p>}

      {imageUrl && (
        <img
          src={imageUrl}
          alt="post media"
          className="w-full rounded-lg mb-3"
        />
      )}

      {videoUrl && (
        <video controls className="w-full rounded-lg mb-3">
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support video.
        </video>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        <span className="px-3 py-1 bg-red-600 rounded-full text-xs">
          #{post.privacy}
        </span>
      </div>

      <div className="flex gap-6 text-sm text-gray-400 mb-3">
        <button onClick={handleReaction} className="hover:text-red-400">
          ❤️ {post.reactions.length}
        </button>
        <span>💬 {post.comments.length}</span>
      </div>

      {/* ✅ Render all comments */}
      <div className="mb-3">
        {post.comments.map((c, i) => (
          <div key={i} className="text-sm text-gray-300 mb-1">
            <span className="font-semibold">{c.user?.name}:</span> {c.text}
          </div>
        ))}
      </div>

      {/* ✅ Add comment input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 px-4 py-2 rounded-md bg-[#1e1e1e] border border-gray-700 text-sm"
        />
        <button
          onClick={handleAddComment}
          disabled={loading}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </motion.div>
  );
}
