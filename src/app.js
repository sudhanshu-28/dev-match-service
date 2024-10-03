const express = require("express");

const app = express();

app.use(
  "/user",
  (req, res, next) => {
    console.log("Route Handler 1");
    next();
  }, // Middleware
  (req, res, next) => {
    console.log("Route Handler 2");
    next();
  }, // Middleware
  (req, res, next) => {
    console.log("Route Handler 5");
    res.send("API executed successfully from RH5");
  } // Request Handler - as this function is handling request and sending the response
);

app.listen(7777, () => {
  console.log("Server is running on port 7777...");
});
