const User = require("../models/User");
const PairUp = require("../models/PairUp");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

// ✅ Get user profile & pairup count
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  const pairUpsCount = await PairUp.countDocuments({
    $and: [
      {
        $or: [{ from: user._id }, { to: user._id }],
      },
      { status: "accepted" },
    ],
  });

  res.json({ user, pairUpsCount });
};

// ✅ Update profile
exports.updateProfile = async (req, res) => {
  const { name, email, bio, githubUrl, techStack, role } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = name || user.name;
  user.email = email || user.email;
  user.bio = bio || user.bio;
  user.githubUrl = githubUrl || user.githubUrl;
  user.techStack = techStack || user.techStack;
  user.role = role || user.role;

  await user.save();
  res.json({ message: "Profile updated", user });
};

// ✅ Upload/change profile image
exports.uploadProfileImage = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  if (user.profileImageUrl) {
    const oldPath = path.join(__dirname, "..", "uploads", path.basename(user.profileImageUrl));
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
  }

  user.profileImageUrl = `/uploads/${req.file.filename}`;
  await user.save();

  res.json({ message: "Profile image updated", profileImageUrl: user.profileImageUrl });
};

// ✅ Remove profile image
exports.removeProfileImage = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.profileImageUrl) {
    const filePath = path.join(__dirname, "..", "uploads", path.basename(user.profileImageUrl));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  user.profileImageUrl = "";
  await user.save();

  res.json({ message: "Profile image removed" });
};

// ✅ Change password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

  user.password = newPassword;
  await user.save();

  res.json({ message: "Password changed successfully" });
};
