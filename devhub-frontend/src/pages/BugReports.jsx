import { useState, useEffect } from "react";
import axios from "axios";
import BugCard from "../components/BugCard";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function BugReports() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
    file: null,
  });

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/bugs`, {
          withCredentials: true,
        });
        setBugs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBugs();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setForm((prev) => ({ ...prev, file: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateBug = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("devhub_token");

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append(
      "tags",
      JSON.stringify(form.tags.split(",").map((tag) => tag.trim()))
    );
    if (form.file) formData.append("file", form.file);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/bugs`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setBugs([res.data.bug, ...bugs]);
      setShowModal(false);
      setForm({ title: "", description: "", tags: "", file: null });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create bug");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-gradient-to-b from-black via-[#0d0d0d] to-[#1a0000] text-white">
      <Sidebar />
      <main className="relative flex-1 h-screen overflow-y-auto scroll-smooth">
        <Navbar />
        <div className="p-4 max-w-3xl mx-auto pb-24">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-red-600">Bug Reports</h1>
            <button
              onClick={() => setShowModal(true)}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
            >
              + Report Bug
            </button>
          </div>

          {loading ? (
            <p className="text-gray-400">Loading bugs...</p>
          ) : bugs.length === 0 ? (
            <p className="text-gray-400">No bugs reported yet.</p>
          ) : (
            bugs.map((bug) => <BugCard key={bug._id} bug={bug} />)
          )}
        </div>

        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="bg-[#141414] rounded-lg p-6 w-full max-w-md shadow-2xl"
              >
                <h2 className="text-xl font-bold mb-4 text-primary">
                  Report a New Bug
                </h2>
                <form onSubmit={handleCreateBug} className="space-y-4">
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Bug Title"
                    required
                    className="w-full p-3 rounded bg-[#1e1e1e] border border-gray-700 placeholder-gray-400"
                  />
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the bug..."
                    rows="4"
                    required
                    className="w-full p-3 rounded bg-[#1e1e1e] border border-gray-700 placeholder-gray-400"
                  ></textarea>
                  <input
                    type="text"
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                    placeholder="Tags (comma separated)"
                    className="w-full p-3 rounded bg-[#1e1e1e] border border-gray-700 placeholder-gray-400"
                  />
                  <input
                    type="file"
                    name="file"
                    accept="image/*,video/*"
                    onChange={handleChange}
                    className="w-full p-3 rounded bg-[#1e1e1e] border border-gray-700 text-gray-400"
                  />

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                    >
                      Post Bug
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
