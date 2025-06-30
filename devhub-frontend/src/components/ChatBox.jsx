import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import {
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
} from "stream-chat-react";

export default function ChatBox({
  selectedPairUp,
  userId,
  setShowChatBox,
}) {
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    if (!selectedPairUp) return;

    const streamClient = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);
    const otherUserId =
      selectedPairUp.from === userId ? selectedPairUp.to : selectedPairUp.from;

    const channelId = [userId, otherUserId].sort().join("-");
    const newChannel = streamClient.channel("messaging", channelId, {
      members: [userId, otherUserId],
    });

    const init = async () => {
      await newChannel.watch();
      setChannel(newChannel);
    };

    init();

    return () => {
      if (channel) channel.stopWatching();
    };
  }, [selectedPairUp, userId]);

  if (!selectedPairUp) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 bg-[#141414]">
        Select a chat to start messaging
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 bg-[#141414]">
        Loading chat...
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col h-full bg-[#141414] ${selectedPairUp ? "block" : "hidden md:flex"}`}>
      <div className="md:hidden p-4 border-b border-gray-700 bg-[#1e1e1e] flex justify-between items-center">
        <button
          className="text-sm text-red-500"
          onClick={() => setShowChatBox(false)}
        >
          ← Back
        </button>
      </div>
      <Channel channel={channel}>
        <ChannelHeader />
        <MessageList />
        <MessageInput />
        <Thread />
      </Channel>
    </div>
  );
}
