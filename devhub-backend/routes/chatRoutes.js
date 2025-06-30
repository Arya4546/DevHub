const express = require("express");
const router = express.Router();
const { getStreamToken, getPairUps } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

router.get("/token", protect, getStreamToken);
router.get("/pairups", protect, getPairUps);

module.exports = router;
