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

// API throws unhandled error with Status code 500
app.use("/getAllUserData", (req, res) => {
  // Best way to write code is with try & catch

  try {
    throw new Error("Unable to fetch Users list");
    res.send("All Users list sent.");
  } catch (error) {
    res
      .status(500)
      .send("Error in functionality, Catch function got executed.");
  }
});

// Express is dynamic - In app.use based on parameters it behavious differently
// 2 - params => req, res
// 3 - params => req, res, next
// 4 - params => err, req, res, next

// Handle Error in any APIs we get, with this way, we will not expose error message / file path where we are getting error to API consumer
app.use("/", (err, req, res, next) => {
  if (err) {
    // Also Log your error - in log file / some sort of monitoring / alert / to notify us - if anyting went down

    // Send error message to User on API Internal code failure/error
    res.status(500).send("Something went wrong.");
  }
});

app.listen(7777, () => {
  console.log("Server is running on port 7777...");
});
