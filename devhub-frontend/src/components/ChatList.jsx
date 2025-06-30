import { useEffect, useState } from "react";
import axios from "axios";
import { StreamChat } from "stream-chat";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ChatList({
  pairUps,
  selectedPairUp,
  onSelectPairUp,
  userId,
  setShowChatBox,
}) {
  const [userProfiles, setUserProfiles] = useState({});
  const [lastMessages, setLastMessages] = useState({});
  const token = localStorage.getItem("devhub_token");

  useEffect(() => {
    const fetchUserProfilesAndMessages = async () => {
      try {
        const streamClient = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);
        const profiles = {};
        const messages = {};

        for (const pairUp of pairUps) {
          const otherUserId = pairUp.from === userId ? pairUp.to : pairUp.from;

          if (!profiles[otherUserId]) {
            const res = await axios.get(`${API_BASE_URL}/api/users/${otherUserId}`, {
  headers: { Authorization: `Bearer ${token}` },
});
profiles[otherUserId] = res.data;
          }

          const channelId = [userId, otherUserId].sort().join("-");
          const channel = streamClient.channel("messaging", channelId);
          await channel.watch();
          const state = await channel.state;
          const lastMessage = state.messages.length > 0
            ? state.messages[state.messages.length - 1].text
            : "Start a conversation";
          messages[pairUp._id] = lastMessage;
        }

        setUserProfiles(profiles);
        setLastMessages(messages);
      } catch (err) {
        console.error("Error fetching user profiles or messages:", err);
      }
    };

    if (pairUps.length > 0 && userId && token) {
      fetchUserProfilesAndMessages();
    }
  }, [pairUps, userId, token]);

  return (
    <div className={`w-full md:w-1/3 h-full border-r border-gray-700 overflow-hidden ${selectedPairUp ? "hidden md:block" : "block"}`}>
      <div className="p-4 bg-[#141414] border-b border-gray-700 flex items-center sticky top-0 z-10">
        <img
          src={userProfiles[userId]?.profileImageUrl || "/default-avatar.png"}
          alt="Profile"
          className="w-10 h-10 rounded-full mr-3"
        />
        <h2 className="text-xl font-bold text-red-600">Chats</h2>
      </div>
      <div className="overflow-y-auto h-[calc(100%-64px)]">
        {pairUps.map((pairUp) => {
          const otherUserId = pairUp.from === userId ? pairUp.to : pairUp.from;
          const user = userProfiles[otherUserId];
          return (
            <div
              key={pairUp._id}
              onClick={() => {
                onSelectPairUp(pairUp);
                setShowChatBox(true);
              }}
              className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-[#1e1e1e] transition ${
                selectedPairUp?._id === pairUp._id ? "bg-[#1e1e1e]" : ""
              }`}
            >
              <img
                src={user?.profileImageUrl || "/default-avatar.png"}
                alt={pairUp.userName}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <p className="font-semibold">{pairUp.userName}</p>
                <p className="text-sm text-gray-400 truncate">
                  {lastMessages[pairUp._id] || "Loading..."}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
