const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();

// Because we had multiple admin API for authentication, hence adminAuth is written seperately and after auth it will be passed to next admin routes for server admin API request
app.use("/admin", adminAuth);

app.use("/admin/getAllData", (req, res) => {
  res.send("All Users List Sent");
});

app.use("/admin/deleteUser", (req, res) => {
  res.send("User Deleted");
});

// Because we had single user API for authentication, hence passed userAuth function directly with logic
app.use("/user", userAuth, (req, res) => {
  res.send("Welcome to Home page");
});

// Login API would not have token, since that need to authenticated then token will generate, so we didnt passed userAuth as middleware in this route
app.use("/user/login", (req, res) => {
  res.send("User Logged in Successfully");
}); // So in this way we can customize out route and get user authenticated based on our requirement and accordingly customize it

app.listen(7777, () => {
  console.log("Server is running on port 7777...");
});
