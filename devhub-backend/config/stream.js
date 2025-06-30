// config/stream.js

import { StreamChat } from "stream-chat";
import dotenv from "dotenv";

// Load .env variables
dotenv.config();

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("❌ Stream API key or secret is missing. Check your .env file!");
  throw new Error("Stream API key or secret is missing");
}

// Create a single StreamChat client instance with BOTH key and secret
const streamClient = StreamChat.getInstance(apiKey, apiSecret);

// ✅ Upsert a user to Stream
export const upsertStreamUser = async (userData) => {
  try {
    console.log("📌 Upserting Stream user:", userData.id);
    await streamClient.upsertUser(userData);
    console.log("✅ Stream user upserted:", userData.id);
    return userData;
  } catch (error) {
    console.error("❌ Error upserting Stream user:", error.message);
    throw error;
  }
};

// ✅ Generate a JWT token for a Stream user
export const generateStreamToken = (userID) => {
  try {
    if (!userID || typeof userID !== "string") {
      throw new Error("Invalid userID: must be a non-empty string");
    }
    const token = streamClient.createToken(userID);
    console.log(`✅ Stream token generated for: ${userID}`);
    return token;
  } catch (error) {
    console.error("❌ Error generating Stream token:", error.message);
    throw error;
  }
};

// ✅ Export the client if you need it directly (optional)
export default streamClient;
