const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const http = require("node:http");
const path = require("node:path");
const { Server } = require("socket.io");

const connectDB = require("./config/database");

const {
  authRouter,
  exampleRouter,
  profileRouter,
  requestRouter,
  userRouter,
} = require("./routes");

const app = express();

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173", // White listing this domain name
    credentials: true,
  })
);

// NEVER TRUST req.body => It can have malicious data
// Convert JSON (Readable Stream) into Javascript Object for all the APIs request for all HTTP methods
// Dont pass routes if Request Handler / Middleware needs to be applied for all APIs
app.use(express.json());
app.use(cookieParser());

// Create an HTTP server from the Express app
const server = http.createServer(app);

// Create a Socket.IO server instance
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Match your React app's origin
    methods: ["GET", "POST"], // Allowed methods for WebSocket
    credentials: true, // Pass credentials if needed
  },
});

io.on("connection", (socket) => {
  socket.on("client-message", (message) => {
    io.emit("server-message", message);
  });
});

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);
app.use("/example", exampleRouter);

app.use(express.static(path.join(__dirname, "./public")));
app.use(express.static("./public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Start your sever only when you are connected to Database
connectDB()
  .then(() => {
    console.log("Database connection established...");

    // Start the server on port 7777 (both HTTP API and WebSocket)
    server.listen(7777, () => {
      console.log("Server is running on Port:7777...");
    });
  })
  .catch((err) => {
    console.error("Database connection failed.");
    console.log(err);
  });
