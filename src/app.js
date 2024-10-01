const express = require("express");

const app = express();

// get : This will only handle GET route call to /user
app.get("/user", (req, res) => {
  res.send("Users List API trigerred");
});

app.post("/user", (req, res) => {
  res.send("User Create API trigerred");
});

app.put("/user", (req, res) => {
  res.send("User Update Profile API trigerred");
});

app.patch("/user", (req, res) => {
  res.send("User Update API trigerred");
});

app.delete("/user", (req, res) => {
  res.send("User Delete API trigerred");
});

// use: This will match all the HTTP method API calls to /test
app.use("/test", (req, res) => {
  res.send("Hello from Test API call");
});

// This callback function passed inside use function is called Request Handler
// app.use("/", (req, res) => {
//   res.send("Main Dashboard API call");
// });

app.listen(7777, () => {
  console.log("Server is running on port 7777...");
});
