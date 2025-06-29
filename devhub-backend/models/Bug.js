
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const bugSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: String,
    description: String,
    imageUrl: String,
    videoUrl: String,
    tags: [String],
    project: String,
    privacy: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    aiSuggestion: { type: String }, 
    comments: [commentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bug", bugSchema);
