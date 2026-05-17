const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const songRoutes = require("./routes/songRoutes");
const authRoutes = require("./routes/authRoutes");
const musicRoutes = require("./routes/musicRoutes");

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// MIDDLEWARE
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// DATABASE
connectDB();

// ROUTES
app.use("/api/song", songRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/music", musicRoutes);

// SOCKET
const socketRooms = {};  // socket.id -> roomId
const roomMembers = {};  // roomId -> { socketId: { name, email } }

const getRoomCount = (roomId) => {
  const room = io.sockets.adapter.rooms.get(roomId);
  return room ? room.size : 0;
};

// Get unique users by email — same user on multiple tabs counts once
const getUniqueUsers = (roomId) => {
  const members = roomMembers[roomId] || {};
  const seen = new Set();
  const users = [];

  Object.values(members).forEach(({ name, email }) => {
    if (!seen.has(email)) {
      seen.add(email);
      users.push({ name, email });
    }
  });

  return users;
};

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // Join a song's collab room
  socket.on("join_room", ({ roomId, name, email }) => {
    if (socketRooms[socket.id] === roomId) return;

    socket.join(roomId);
    socketRooms[socket.id] = roomId;

    if (!roomMembers[roomId]) roomMembers[roomId] = {};
    roomMembers[roomId][socket.id] = { name, email };

    const users = getUniqueUsers(roomId);
    io.to(roomId).emit("room_users", users);
    console.log(`${name} (${email}) joined room ${roomId} | unique users: ${users.length}`);
  });

  // Leave room
  socket.on("leave_room", (roomId) => {
    socket.leave(roomId);

    if (roomMembers[roomId]) {
      delete roomMembers[roomId][socket.id];
    }
    delete socketRooms[socket.id];

    const users = getUniqueUsers(roomId);
    io.to(roomId).emit("room_users", users);
  });

  // Broadcast field update to everyone in room except sender
  socket.on("send_update", ({ roomId, field, value }) => {
    socket.to(roomId).emit("receive_update", { field, value });
  });

  // ✅ Forward collaborator's save request to owner in the same room
  socket.on("request_save", ({ roomId, name }) => {
    socket.to(roomId).emit("save_requested", { name });
  });

  // Old message listener
  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });

  // Auto cleanup on disconnect
  socket.on("disconnect", () => {
    const roomId = socketRooms[socket.id];
    if (roomId) {
      if (roomMembers[roomId]) {
        delete roomMembers[roomId][socket.id];
      }
      delete socketRooms[socket.id];

      setTimeout(() => {
        const users = getUniqueUsers(roomId);
        io.to(roomId).emit("room_users", users);
        console.log(`Socket disconnected from room ${roomId} | unique users: ${users.length}`);
      }, 100);
    }
    console.log("User Disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});