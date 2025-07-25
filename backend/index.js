import app from "./app.js";
import connectDB from "./config/db.js";
import { Server } from "socket.io";
import http from "http";

const PORT = process.env.PORT || 3000;
export const secretKey = process.env.JWT_SECRET || "";

const onlineUsers = new Map();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173,https://golpogujob.netlify.app/",
    credentials: true,
    methods: ["GET", "POST"]
  },
});

const emitOnlineUsers = () => {
  const userIds = Array.from(onlineUsers.keys());
  io.emit("onlineUsers", userIds); 
};

// Handle socket connections
io.on("connection", (socket) => {
  console.log(" A user connected:", socket.id);

  socket.on("register", (userId) => {
    if (!userId) return;
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);
    console.log(`User ${userId} registered. Current sockets:`, onlineUsers.get(userId));
    emitOnlineUsers();
  });

  
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);

    for (const [userId, sockets] of onlineUsers.entries()) {
      if (sockets.has(socket.id)) {
        sockets.delete(socket.id);
        console.log(` Removed socket ${socket.id} from user ${userId}`);

        if (sockets.size === 0) {
          onlineUsers.delete(userId);
          console.log(` User ${userId} is now offline`);
        }
        break;
      }
    }
    emitOnlineUsers();
  });
});

export { io, onlineUsers };


connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running at port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error regarding server connection:", err);
  });
