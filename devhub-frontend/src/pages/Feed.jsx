import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, addPost, updateReactions, addCommentToPost } from "../redux/slices/postSlice";
import PostCard from "../components/PostCard";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import CreatePostModal from "../components/CreatePostModal";
import { Plus } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Feed() {
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.posts);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("devhub_token");
        if (!token) {
          console.error("No token found, user must log in again.");
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/api/posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(setPosts(res.data));
      } catch (err) {
        console.error(err);
      }
    };

    fetchPosts();

    const socket = io(API_BASE_URL, {
      auth: {
        token: localStorage.getItem("devhub_token"),
      },
    });

    socket.on("new_post", (post) => {
      dispatch(addPost(post));
    });

    socket.on("new_reaction", ({ postId, userId }) => {
      dispatch(updateReactions({ postId, userId }));
    });

    socket.on("new_comment", ({ postId, comment }) => {
      dispatch(addCommentToPost({ postId, comment }));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-gradient-to-b from-black via-[#0d0d0d] to-[#1a0000] text-white">
      <Sidebar />
      
      <main className="relative flex-1 h-screen overflow-y-auto scroll-smooth">
      <Navbar />
        <div className="p-4 max-w-3xl mx-auto pb-24">
          <h1 className="text-3xl font-bold mb-6 text-red-600">Developer Feed</h1>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-12 right-2 md:right-12 z-50 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-105"
        >
          <Plus size={24} />
        </button>

        {showModal && <CreatePostModal onClose={() => setShowModal(false)} />}
      </main>
    </div>
  );
}
