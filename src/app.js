const express = require("express");

const app = express();

app.use(
  "/user",
  (req, res, next) => {
    console.log("Route Handler 1");
    next();
  },
  (req, res, next) => {
    console.log("Route Handler 2");
    next();
  },
  (req, res, next) => {
    console.log("Route Handler 3");
    next();
  },
  (req, res, next) => {
    console.log("Route Handler 4");
    next();
  },
  (req, res, next) => {
    console.log("Route Handler 5");
    next();
  }
);

app.listen(7777, () => {
  console.log("Server is running on port 7777...");
});
