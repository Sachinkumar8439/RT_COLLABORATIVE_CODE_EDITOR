const express = require("express");
const databaseConnect = require("./configure/database");
require("dotenv").config()
const app = express();
const Routes = require("./Routes/routes");
app.use(express.json());
const cors = require("cors");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());

// CORS options to allow requests from frontend running on port 5500
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000"

const corsOptions = {
  origin: FRONTEND_URL ,
  methods: "GET,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"], 
};

app.use(cors(corsOptions));
app.get("/", (req, res) => {
  res.send("hello jii, kyaa haal chaal");
});
const socketio = require("socket.io");
const server = require("http").Server(app);
const io = socketio(server, {
  cors: {
    origin: FRONTEND_URL || "http://localhost:3000", 
    methods: ["GET", "POST"],
  },
});

app.use("/rtcce/version-1.0/", Routes);

databaseConnect();
io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} connected`);

  socket.on('join-room',(data)=>{
    socket.join(data.programid);
    socket.to(data.programid).emit('say-hello',(data));

  })
  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
  });

  socket.on('send-text',(data)=>{
    socket.to(data.programid).emit('get-text',(data))
  })
  
 
  
  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log("server is running on port ",PORT);
});

// http://localhost:3000/rtcce/version-1.0/output
