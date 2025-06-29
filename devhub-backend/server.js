
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const bugRoutes = require("./routes/bugRoutes");
const pairUpRoutes = require("./routes/pairUpRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");


// Load env vars
dotenv.config();

// Connect DB
connectDB();

// Init app
const app = express();
app.use(express.json());

app.use(cors({
  origin: "*",
  credentials: true, // allow cookies or auth headers
}))

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/pairups", pairUpRoutes);
app.use("/api/bugs", bugRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/uploads", express.static("uploads"));


// Create HTTP server
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});


// Listen for socket connections
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("joinPairUp", (pairUpId) => {
    socket.join(pairUpId);
    console.log(`Socket ${socket.id} joined ${pairUpId}`);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});


// Attach io instance to app for controllers to use
app.set("io", io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
