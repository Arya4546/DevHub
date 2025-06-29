const PairUp = require("../models/PairUp");
const User = require("../models/User");

// ✅ Send a PairUp
exports.sendPairUp = async (req, res) => {
  const from = req.user.id;
  const { to } = req.body;

  console.log("PAIRUP ATTEMPT");
  console.log("From:", from);
  console.log("To:", to);

  if (!to) {
    return res.status(400).json({ message: "Missing 'to' in request body." });
  }

  if (from === to) {
    return res.status(400).json({ message: "You cannot pair up with yourself." });
  }

  const existing = await PairUp.findOne({ from, to, status: "pending" });
  if (existing) {
    return res.status(400).json({ message: "Pair Up already sent." });
  }

  const pairUp = await PairUp.create({ from, to });
  res.status(201).json({ message: "Pair Up sent.", pairUp });
};


// ✅ Withdraw a PairUp
exports.withdrawPairUp = async (req, res) => {
  try {
    const from = req.user.id;
    const { id } = req.params;

    const pairUp = await PairUp.findOne({ _id: id, from, status: "pending" });
    if (!pairUp) {
      return res.status(404).json({ message: "PairUp not found or not yours." });
    }

    await pairUp.deleteOne();

    res.status(200).json({ message: "PairUp withdrawn." });
  } catch (err) {
    console.error("Withdraw PairUp Error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// ✅ Accept a PairUp
exports.acceptPairUp = async (req, res) => {
  try {
    const to = req.user.id;
    const { id } = req.params;

    const pairUp = await PairUp.findOne({ _id: id, to, status: "pending" });
    if (!pairUp) {
      return res.status(404).json({ message: "PairUp not found or not for you." });
    }

    pairUp.status = "accepted";
    await pairUp.save();

    const io = req.app.get("io");
    io.emit("pairup_accepted", { from: pairUp.from, to: pairUp.to, pairUpId: pairUp._id });

    res.status(200).json({ message: "PairUp accepted." });
  } catch (err) {
    console.error("Accept PairUp Error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// ✅ Reject a PairUp
exports.rejectPairUp = async (req, res) => {
  try {
    const to = req.user.id;
    const { id } = req.params;

    const pairUp = await PairUp.findOne({ _id: id, to, status: "pending" });
    if (!pairUp) {
      return res.status(404).json({ message: "PairUp not found or not for you." });
    }

    pairUp.status = "rejected";
    await pairUp.save();

    res.status(200).json({ message: "PairUp rejected." });
  } catch (err) {
    console.error("Reject PairUp Error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// ✅ Get all PairUps
exports.getMyPairUps = async (req, res) => {
  try {
    const userId = req.user.id;

    const incoming = await PairUp.find({ to: userId, status: "pending" })
      .populate("from", "name profileImageUrl bio");

    const outgoing = await PairUp.find({ from: userId, status: "pending" })
      .populate("to", "name profileImageUrl bio");

    const paired = await PairUp.find({
      $or: [{ from: userId }, { to: userId }],
      status: "accepted",
    }).populate("from to", "name profileImageUrl bio");

    res.status(200).json({ incoming, outgoing, paired });
  } catch (err) {
    console.error("GetMyPairUps Error:", err);
    res.status(500).json({ message: "Server error." });
  }
};
exports.getDiscoverDevelopers = async (req, res) => {
  const userId = req.user.id;

  const allUsers = await User.find({ _id: { $ne: userId } }).select(
    "_id name profileImageUrl bio"
  );

  const outgoing = await PairUp.find({ from: userId, status: "pending" });

  const developers = allUsers.map((user) => {
    const sentReq = outgoing.find((req) => req.to.toString() === user._id.toString());
    return {
      ...user.toObject(),
      sent: !!sentReq,
      pairUpId: sentReq ? sentReq._id : null,
    };
  });

  res.json({ developers });
};