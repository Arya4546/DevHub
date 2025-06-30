const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  uploadProfileImage,
  removeProfileImage,
  changePassword,
  getUserById,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");


// Multer config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);
router.post("/me/profile-image", protect, upload.single("profileImage"), uploadProfileImage);
router.delete("/me/profile-image", protect, removeProfileImage);
router.post("/me/change-password", protect, changePassword);
router.get("/:id", getUserById);


module.exports = router;
