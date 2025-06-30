import { useEffect, useState } from "react";
import axios from "axios";
import { StreamChat } from "stream-chat";
import { Chat as StreamChatComponent } from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import ChatList from "../components/ChatList";
import ChatBox from "../components/ChatBox";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Chat() {
  const [client, setClient] = useState(null);
  const [pairUps, setPairUps] = useState([]);
  const [selectedPairUp, setSelectedPairUp] = useState(null);
  const [showChatBox, setShowChatBox] = useState(false);
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const token = localStorage.getItem("devhub_token");

  useEffect(() => {
    const initChat = async () => {
      try {
        const streamClient = StreamChat.getInstance(
          import.meta.env.VITE_STREAM_API_KEY
        );

        const res = await axios.get(`${API_BASE_URL}/api/chats/token`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        await streamClient.connectUser(
          { id: userId, name: userName },
          res.data.token
        );

        setClient(streamClient);

        const pairUpsRes = await axios.get(`${API_BASE_URL}/api/chats/pairups`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPairUps(pairUpsRes.data);

        if (pairUpsRes.data.length > 0) {
          setSelectedPairUp(pairUpsRes.data[0]);
          setShowChatBox(true);
        }

        return () => {
          streamClient.disconnectUser();
        };
      } catch (err) {
        console.error("Chat initialization error:", err);
      }
    };

    if (userId && token) {
      initChat();
    }
  }, [userId, userName, token]);

  const handleSelectPairUp = (pairUp) => {
    setSelectedPairUp(pairUp);
    setShowChatBox(true);
  };

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-[#0d0d0d] to-[#1a0000] text-white">
        <p>Loading chat...</p>
      </div>
    );
  }

  return (
    <StreamChatComponent client={client} theme="messaging dark">
      <div className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-gradient-to-b from-black via-[#0d0d0d] to-[#1a0000] text-white">
        <Sidebar />
        <main className="flex-1 h-screen overflow-hidden md:ml-64">
          <Navbar />
          <div className="flex h-[calc(100vh-64px)]">
            <ChatList
              pairUps={pairUps}
              selectedPairUp={selectedPairUp}
              onSelectPairUp={handleSelectPairUp}
              userId={userId}
              setShowChatBox={setShowChatBox}
            />
            <ChatBox
              selectedPairUp={selectedPairUp}
              userId={userId}
              setShowChatBox={setShowChatBox}
            />
          </div>
        </main>
      </div>
    </StreamChatComponent>
  );
}
