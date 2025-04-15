const express = require("express");
const databaseConnect = require("./configure/database");
const app = express();
const Routes = require("./Routes/routes");
app.use(express.json());
const cors = require("cors");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());
// CORS options to allow requests from frontend running on port 5500
const corsOptions = {
  origin: "http://localhost:3000", // Allow only requests from this origin
  methods: "GET,POST,DELETE", // Allow only these methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow only these headers
};

// Use CORS middleware with specified options
app.use(cors(corsOptions));
app.get("/", (req, res) => {
  res.send("hello jii, kyaa haal chaal");
});
const socketio = require("socket.io");
const server = require("http").Server(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000", 
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
server.listen(4000, () => {
  console.log("hello server started");
});

// http://localhost:3000/rtcce/version-1.0/output
