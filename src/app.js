const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require("./config/database");

const {
  authRouter,
  exampleRouter,
  profileRouter,
  requestRouter,
  userRouter,
} = require("./routes");

const app = express();

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

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);
app.use("/example", exampleRouter);

// Start your sever only when you are connected to Database
connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(7777, () => {
      console.log("Server is running on Port:7777...");
    });
  })
  .catch((err) => {
    console.error("Database connection failed.");
    console.log(err);
  });
