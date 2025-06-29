// routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { protect } = require("../middleware/authMiddleware");
const {
  getChats,
  searchChats,
  getMessages,
  sendMessage,
} = require("../controllers/chatController");

// Optional: file uploads later for image messages
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.get("/", protect, getChats);
router.get("/search", protect, searchChats);
router.get("/:pairUpId", protect, getMessages);
router.post("/:pairUpId", protect, sendMessage);

module.exports = router;
