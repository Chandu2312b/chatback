const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

// Initialize express app BEFORE using it
const app = express();
app.use(cors());

const server = http.createServer(app);

// Setting up socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (you can restrict this later)
    methods: ["GET", "POST"]
  },
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log("[Backend] New user connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`[Backend] User ${socket.id} joined room: ${roomId}`);

    socket.on("send-message", (msg) => {
      console.log(`[Backend] Received message from ${socket.id} in room ${roomId}:`, msg);
      io.to(roomId).emit("receive-message", {
        sender: socket.id,
        message: msg,
      });
    });

    socket.on("disconnect", () => {
      console.log("[Backend] User disconnected:", socket.id);
    });
  });
});

// Use dynamic port for Render, fallback to 5000 locally
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`[Backend] Server is running on port ${PORT}`);
});
