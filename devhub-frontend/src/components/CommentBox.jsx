
import { useState } from "react";

export default function CommentBox({ comments = [] }) {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    console.log("New Comment:", newComment);
    setNewComment("");
  };

  return (
    <div className="mt-4">
      <h3 className="text-sm text-gray-300 mb-2">Comments</h3>
      <div className="space-y-3 mb-4">
        {comments.map((c, i) => (
          <div key={i} className="text-sm text-gray-100 bg-gray-800 p-2 rounded">
            <strong className="text-primary">{c.name}:</strong> {c.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 p-2 rounded bg-gray-900 border border-gray-700 text-white"
        />
        <button
          type="submit"
          className="bg-primary text-white px-3 py-2 rounded hover:bg-red-600"
        >
          Post
        </button>
      </form>
    </div>
  );
}