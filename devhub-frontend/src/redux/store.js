
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import postReducer from "./slices/postSlice";
import chatReducer from "./slices/chatSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    chat: chatReducer,
  },
});
export default store;