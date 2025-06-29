// ✅ File: src/redux/postSlice.js
import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    addPost: (state, action) => {
      state.posts.unshift(action.payload);
    },
    updateReactions: (state, action) => {
      const { postId, userId } = action.payload;
      const post = state.posts.find((p) => p._id === postId);
      if (post) {
        const index = post.reactions.indexOf(userId);
        if (index > -1) {
          post.reactions.splice(index, 1);
        } else {
          post.reactions.push(userId);
        }
      }
    },
    addCommentToPost: (state, action) => {
      const { postId, comment } = action.payload;
      const post = state.posts.find((p) => p._id === postId);
      if (post) {
        post.comments.push(comment);
      }
    },
  },
});

export const { setPosts, addPost, updateReactions, addCommentToPost } =
  postSlice.actions;

export default postSlice.reducer;
