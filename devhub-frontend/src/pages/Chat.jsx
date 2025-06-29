import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ChatList from "../components/ChatList";
import ChatBox from "../components/ChatBox";

export default function Chat() {
  const [showChatBox, setShowChatBox] = useState(false);

  const handleSelectChat = () => {
    setShowChatBox(true);
  };

  const handleBack = () => {
    setShowChatBox(false);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64">
        <Navbar />
        <div className="flex flex-1">
          {/* Chat List */}
          <div
            className={`w-full md:w-1/3 border-r border-gray-800 ${
              showChatBox ? "hidden md:block" : "block"
            }`}
          >
            <ChatList onSelectChat={handleSelectChat} />
          </div>

          {/* Chat Box */}
          <div
            className={`w-full md:w-2/3 ${
              showChatBox ? "block" : "hidden md:block"
            }`}
          >
            <ChatBox onBack={handleBack} />
          </div>
        </div>
      </div>
    </div>
  );
}