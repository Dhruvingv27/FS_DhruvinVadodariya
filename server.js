import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import User from "./models/Users.js";

dotenv.config();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL }
});

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// API route for saving student commute data
app.post("/api/users", async (req, res) => {
  const { username, home, destination } = req.body;
  try {
    const user = await User.create({ username, home, destination });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all users
app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// WebSocket for chat
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendMessage", (msg) => {
    io.emit("receiveMessage", msg);
  });

  socket.on("disconnect", () => console.log("User disconnected"));
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
