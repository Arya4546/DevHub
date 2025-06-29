// controllers/chatController.js
const PairUp = require("../models/PairUp");
const Message = require("../models/Message");
const User = require("../models/User");

// Get all pair-ups with last message + user info
exports.getChats = async (req, res) => {
  const userId = req.user.id;

  const pairUps = await PairUp.find({
    $and: [
      { status: "accepted" },
      { $or: [{ from: userId }, { to: userId }] },
    ],
  }).populate("from to");

  const chats = [];

  for (const pairUp of pairUps) {
    const otherUser =
      pairUp.from._id.toString() === userId
        ? pairUp.to
        : pairUp.from;

    const lastMessage = await Message.findOne({ pairUp: pairUp._id })
      .sort({ createdAt: -1 })
      .limit(1);

    chats.push({
      pairUpId: pairUp._id,
      user: {
        _id: otherUser._id,
        name: otherUser.name,
        profileImageUrl: otherUser.profileImageUrl,
      },
      lastMessage: lastMessage ? lastMessage.text || "📷 Image" : "No messages yet",
      lastMessageAt: lastMessage ? lastMessage.createdAt : pairUp.createdAt,
    });
  }

  // Sort by lastMessageAt
  chats.sort((a, b) => b.lastMessageAt - a.lastMessageAt);

  res.json(chats);
};

// Search pair-ups by name
exports.searchChats = async (req, res) => {
  const userId = req.user.id;
  const { query } = req.query;

  const pairUps = await PairUp.find({
    $and: [
      { status: "accepted" },
      { $or: [{ from: userId }, { to: userId }] },
    ],
  }).populate("from to");

  const filtered = [];

  for (const pairUp of pairUps) {
    const otherUser =
      pairUp.from._id.toString() === userId
        ? pairUp.to
        : pairUp.from;

    if (otherUser.name.toLowerCase().includes(query.toLowerCase())) {
      const lastMessage = await Message.findOne({ pairUp: pairUp._id })
        .sort({ createdAt: -1 })
        .limit(1);

      filtered.push({
        pairUpId: pairUp._id,
        user: {
          _id: otherUser._id,
          name: otherUser.name,
          profileImageUrl: otherUser.profileImageUrl,
        },
        lastMessage: lastMessage ? lastMessage.text || "📷 Image" : "No messages yet",
        lastMessageAt: lastMessage ? lastMessage.createdAt : pairUp.createdAt,
      });
    }
  }

  res.json(filtered);
};

// Get messages for a pair-up
exports.getMessages = async (req, res) => {
  const { pairUpId } = req.params;
  const userId = req.user.id;

  const pairUp = await PairUp.findById(pairUpId);
  if (!pairUp) return res.status(404).json({ message: "PairUp not found" });

  if (
    pairUp.status !== "accepted" ||
    (pairUp.from.toString() !== userId && pairUp.to.toString() !== userId)
  ) {
    return res.status(403).json({ message: "Not authorized" });
  }

  const messages = await Message.find({ pairUp: pairUpId }).sort("createdAt");

  res.json(messages);
};

// Send message
exports.sendMessage = async (req, res) => {
  const { pairUpId } = req.params;
  const { text } = req.body;
  const userId = req.user.id;

  const pairUp = await PairUp.findById(pairUpId);
  if (!pairUp) return res.status(404).json({ message: "PairUp not found" });

  if (
    pairUp.status !== "accepted" ||
    (pairUp.from.toString() !== userId && pairUp.to.toString() !== userId)
  ) {
    return res.status(403).json({ message: "Not authorized" });
  }

  const newMessage = await Message.create({
    pairUp: pairUpId,
    sender: userId,
    text: text || "",
  });

  // Emit real-time event
  const io = req.app.get("io");
  io.to(pairUpId.toString()).emit("newMessage", newMessage);

  res.json(newMessage);
};
