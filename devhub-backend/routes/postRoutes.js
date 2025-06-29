const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createPost,
  getPublicPosts,
  reactToPost,
  addComment,
  getComments,
} = require("../controllers/postController");

// Public feed
router.get("/", protect, getPublicPosts);

// Create new post
router.post("/", protect, createPost);

// React to post
router.post("/:id/react", protect, reactToPost);

// ✅ Add comment
router.post("/:id/comment", protect, addComment);

// Get comments
router.get("/:id/comments", protect, getComments);

module.exports = router;
