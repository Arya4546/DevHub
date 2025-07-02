const express = require("express");
const router = express.Router();
const {
  createBug,
  getBugs,
  addComment,
  aiSuggestion,
} = require("../controllers/bugController");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post("/", protect, upload.single("file"), createBug);
router.get("/", getBugs);
router.post("/:id/comment", protect, addComment);
router.post("/:id/ai", protect, aiSuggestion);

module.exports = router;
