import React from "react";

export default function CustomMessage({ message, isMyMessage }) {
  if (!message?.text) return null;

  const baseClasses = "px-4 py-2 rounded-xl max-w-[70%] break-words";
  const myMessageClasses = "bg-red-600 text-white self-end rounded-br-none";
  const theirMessageClasses = "bg-gray-700 text-white self-start rounded-bl-none";

  return (
    <div className={`flex flex-col mb-2 ${isMyMessage ? "items-end" : "items-start"}`}>
      <div className={`${baseClasses} ${isMyMessage ? myMessageClasses : theirMessageClasses}`}>
        {message.text}
      </div>
    </div>
  );
}
