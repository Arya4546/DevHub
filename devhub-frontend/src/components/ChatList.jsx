import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setChats, setCurrentChat, setMessages } from "../redux/slices/chatSlice";
import io from "socket.io-client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

let socket;

export default function ChatList({ onSelectChat }) {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const { chats } = useSelector((state) => state.chat);
  const token = localStorage.getItem("devhub_token");

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/chats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(setChats(res.data));
  };

  const handleSearch = async () => {
    if (!search) return fetchChats();
    const res = await axios.get(`${API_BASE_URL}/api/chats/search?query=${search}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(setChats(res.data));
  };

  const selectChat = async (pairUpId, user) => {
    dispatch(setCurrentChat({ pairUpId, user }));
    if (!socket) socket = io(API_BASE_URL, {
      auth: { token: localStorage.getItem("devhub_token") },
    });
    socket.emit("joinPairUp", pairUpId);
    const res = await axios.get(`${API_BASE_URL}/api/chats/${pairUpId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(setMessages(res.data));
    onSelectChat && onSelectChat();
  };

  return (
    <div className="flex flex-col h-full p-4 bg-[#0d0d0d] text-white">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-[#0d0d0d] pb-4">
        <h2 className="text-xl font-bold text-red-500 mb-4">Chats</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search pair-ups..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-white placeholder-gray-400 transition duration-200"
          />
        </div>
      </div>

      {/* Scrollable Chat List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {chats.map((chat) => (
          <div
            key={chat.pairUpId}
            onClick={() => selectChat(chat.pairUpId, chat.user)}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <img
                src={
                  chat.user.profileImageUrl
                    ? `${API_BASE_URL}${chat.user.profileImageUrl}`
                    : "/default-avatar.png"
                }
                alt={chat.user.name}
                className="w-12 h-12 rounded-full object-cover border border-gray-700"
              />
              <div className="flex flex-col">
                <p className="font-semibold text-white">{chat.user.name}</p>
                <p className="text-gray-400 text-xs truncate max-w-[200px]">
                  {chat.lastMessage || "Start chatting..."}
                </p>
              </div>
            </div>
            <div
              className="flex-shrink-0 w-3 h-3 rounded-full"
              style={{ background: chat.user.isOnline ? "#22c55e" : "#555" }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}