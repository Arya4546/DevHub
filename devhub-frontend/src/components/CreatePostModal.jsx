
import { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function CreatePostModal({ onClose }) {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [privacy, setPrivacy] = useState("public");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("devhub_token");

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("privacy", privacy);
    if (file) formData.append("file", file);

    await axios.post(`${API_BASE_URL}/api/posts`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-[#141414] p-6 rounded-lg w-full max-w-md space-y-4 border border-gray-800"
      >
        <h2 className="text-xl font-bold text-white">Create Post</h2>
        <textarea
          placeholder="Write your caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full p-3 rounded-md bg-[#1e1e1e] border border-gray-700 text-white"
        ></textarea>

        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full text-sm text-gray-400"
        />

        <select
          value={privacy}
          onChange={(e) => setPrivacy(e.target.value)}
          className="w-full p-2 rounded-md bg-[#1e1e1e] border border-gray-700 text-white"
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
}
