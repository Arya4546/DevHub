const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  sendPairUp,
  withdrawPairUp,
  acceptPairUp,
  rejectPairUp,
  getMyPairUps,
  getDiscoverDevelopers,
} = require("../controllers/pairUpController");

const router = express.Router();

// Send pair-up invite
router.post("/", protect, sendPairUp);

// Withdraw pair-up
router.delete("/:id", protect, withdrawPairUp);

// Accept pair-up
router.post("/:id/accept", protect, acceptPairUp);

// Reject pair-up
router.post("/:id/reject", protect, rejectPairUp);

// Get all pair-ups for logged-in user
router.get("/", protect, getMyPairUps);

router.get("/discover", protect, getDiscoverDevelopers);

module.exports = router;
