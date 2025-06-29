// models/Message.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    pairUp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PairUp",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
