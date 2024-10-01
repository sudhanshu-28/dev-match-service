const express = require("express");

const app = express();

// This callback function passed inside use function is called Request Handler
app.use("/test", (req, res) => {
  res.send("Hello from the server");
});

app.use("/hello", (req, res) => {
  res.send("Hello hello hello!");
});

app.use("/", (req, res) => {
  res.send("Home Page");
});

app.listen(7777, () => {
  console.log("Server is running on port 7777...");
});
