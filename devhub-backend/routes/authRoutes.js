const express = require("express");
const multer = require("multer");
const { registerUser, loginUser, getUserProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/register", upload.single("image"), registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

module.exports = router;
