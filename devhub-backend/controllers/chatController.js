

import streamClient from "../config/stream.js";
import PairUp from "../models/PairUp.js";

// ✅ Return a token for the logged-in user
export const getStreamToken = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const userName = req.user.name || "User";

    console.log(`getStreamToken: userId: ${userId}`);

    // ✅ Upsert this user to Stream first
    await syncStreamUser(userId, userName);

    // ✅ Then generate token
    const token = streamClient.createToken(userId);
    console.log("getStreamToken: Token generated successfully");

    res.json({ token });
  } catch (err) {
    console.error("getStreamToken Error:", err.message, err.stack);
    res.status(500).json({ message: "Failed to generate Stream token" });
  }
};


// ✅ Sync a user in Stream
export const syncStreamUser = async (userId, userName) => {
  try {
    console.log(`syncStreamUser: Syncing user ${userId}`);
    await streamClient.upsertUser({
      id: userId,
      name: userName || "User",
    });
    console.log(`syncStreamUser: User ${userId} synced successfully`);
  } catch (err) {
    console.error(`syncStreamUser: Failed to sync user ${userId}:`, err.message);
    throw err;
  }
};

// ✅ Get pair-ups and sync both users
export const getPairUps = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    console.log(`getPairUps: Fetching pair-ups for user ${userId}`);

    const pairUps = await PairUp.find({
      $and: [
        { $or: [{ from: userId }, { to: userId }] },
        { status: "accepted" },
      ],
    }).populate("from to", "name _id");

    const validPairUps = [];
    for (const pairUp of pairUps) {
      const fromId = pairUp.from._id.toString();
      const toId = pairUp.to._id.toString();
      try {
        await syncStreamUser(fromId, pairUp.from.name);
        await syncStreamUser(toId, pairUp.to.name);
        validPairUps.push({
          _id: pairUp._id,
          from: fromId,
          to: toId,
          userName: fromId === userId ? pairUp.to.name : pairUp.from.name,
        });
      } catch (err) {
        console.error(
          `getPairUps: Skipping pair-up ${pairUp._id} due to error:`,
          err.message
        );
      }
    }

    console.log(`getPairUps: Returning ${validPairUps.length} valid pair-ups`);
    res.json(validPairUps);
  } catch (err) {
    console.error("getPairUps Error:", err.message, err.stack);
    res.status(500).json({ message: "Failed to fetch pair-ups" });
  }
};
