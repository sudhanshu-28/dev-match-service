const express = require("express");
const { connectDB } = require("./config/database");

const app = express();

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
