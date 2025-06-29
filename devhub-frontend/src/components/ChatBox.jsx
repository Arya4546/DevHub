import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../redux/slices/chatSlice";
import axios from "axios";
import socket from "../socket";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ChatBox({ onBack }) {
  const dispatch = useDispatch();
  const { currentChat, messages } = useSelector((state) => state.chat);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("devhub_token");
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName") || "You"; 

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!currentChat) return;

    socket.emit("joinPairUp", currentChat.pairUpId);

    const handleNewMessage = (msg) => {
      // Only dispatch messages not sent by the current user to avoid duplicates
      if (msg.sender !== userId) {
        dispatch(addMessage(msg));
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [currentChat, userId, dispatch]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/chats/${currentChat.pairUpId}`,
        { text: message, senderName: userName }, // Include senderName in the payload
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(addMessage(res.data)); // Add to state immediately
      socket.emit("sendMessage", res.data); // Notify other clients
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const sendFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("Max file size is 10MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("senderName", userName); // Include senderName in the payload

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/chats/${currentChat.pairUpId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch(addMessage(res.data)); // Add to state immediately
      socket.emit("sendMessage", res.data);
    } catch (error) {
      console.error("Error sending file:", error);
    }
  };

  if (!currentChat) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-lg">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 flex items-center gap-4 p-4 border-b border-gray-800 bg-[#111] shadow-sm">
        <button
          onClick={onBack}
          className="md:hidden text-2xl text-gray-400 hover:text-white transition duration-200"
        >
          ←
        </button>
        <img
          src={
            currentChat.user.profileImageUrl
              ? `${API_BASE_URL}${currentChat.user.profileImageUrl}`
              : "/default-avatar.png"
          }
          alt={currentChat.user.name}
          className="w-12 h-12 rounded-full object-cover border border-gray-700"
        />
        <div>
          <h3 className="text-lg font-semibold text-white">{currentChat.user.name}</h3>
          <p
            className={`text-xs ${
              currentChat.user.isOnline ? "text-green-500" : "text-gray-400"
            }`}
          >
            {currentChat.user.isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Scrollable Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#0d0d0d] space-y-3">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`max-w-[70%] px-4 py-2 rounded-lg text-sm break-words shadow-md flex flex-col gap-1 ${
              msg.sender === userId
                ? "bg-red-600 ml-auto text-white"
                : "bg-gray-800 mr-auto text-gray-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-300">
                {msg.sender === userId ? userName : currentChat.user.name}
              </span>
            </div>
            {msg.text && <p>{msg.text}</p>}
            {msg.fileUrl && (
              <a
                href={`${API_BASE_URL}${msg.fileUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-400 hover:text-blue-300"
              >
                📎 {msg.fileName || "Attachment"}
              </a>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Input */}
      <div className="sticky bottom-10 bg-[#111] border-t border-gray-800 p-4">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-lg bg-[#1a1a1a] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={sendFile}
            accept="*"
            hidden
          />
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            📎
          </button>
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  );
}
