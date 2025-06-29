import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    currentChat: null,
    chats: [],
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },
  },
});

export const { setMessages, addMessage, setCurrentChat, setChats } = chatSlice.actions;
export default chatSlice.reducer;
