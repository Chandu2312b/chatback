const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

// Setup socket.io with proper CORS
const io = new Server(server, {
  cors: {
    origin: "*", // Replace with your frontend URL in production for security
    methods: ["GET", "POST"],
  },
});

// Handle client connections
io.on("connection", (socket) => {
  console.log("[Backend] New user connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`[Backend] User ${socket.id} joined room: ${roomId}`);

    socket.on("send-message", (msg) => {
      console.log(`[Backend] Received from ${socket.id} in ${roomId}:`, msg);

      io.to(roomId).emit("receive-message", {
        sender: socket.id,
        message: msg,
      });

      console.log(`[Backend] Broadcasted to room ${roomId}`);
    });

    socket.on("disconnect", () => {
      console.log("[Backend] User disconnected:", socket.id);
    });
  });
});

// Use dynamic port from environment (important for Render)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`[Backend] Server is running on port ${PORT}`);
});
