const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    let profileImageUrl = "";

    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      const uploadPath = path.join(__dirname, "..", "uploads", filename);

      fs.writeFileSync(uploadPath, req.file.buffer);
      profileImageUrl = `/uploads/${filename}`;
    }

    const newUser = await User.create({
      name,
      email,
      password, // Make sure you hash using a pre-save hook
      profileImageUrl,
      bio,
      authProvider: "email",
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        bio: newUser.bio,
        profileImageUrl: newUser.profileImageUrl,
      },
      token,
    });
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    res.status(200).json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
