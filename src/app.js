const express = require("express");

const app = express();

app.use("/admin", (req, res, next) => {
  console.log("Entered in this middleware");
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";

  if (!isAdminAuthorized) {
    res.status(401).send("Unauthorized User");
  } else {
    next();
  }
});

app.use("/admin/getAllData", (req, res) => {
  res.send("All Users List Sent");
});

app.use("/admin/deleteUser", (req, res) => {
  res.send("User Deleted");
});

app.use("/dashboard", (req, res) => {
  res.send("Welcome to Home page");
});

app.listen(7777, () => {
  console.log("Server is running on port 7777...");
});
