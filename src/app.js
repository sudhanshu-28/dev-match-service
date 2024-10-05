const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  // Creating new instance of User model
  const user = new User({
    firstName: "Akshay",
    lastName: "Kumar",
    emailId: "akshay@kumar.com",
    password: "Kumar@123",
    age: 54,
    gender: "Male",
  });

  // Recommend way - with All DB operations best practice is to write in try catch
  try {
    await user.save();
    res.send("User added successfully!");
  } catch (error) {
    console.log("err => ", err);
    res.status(500).send("User failed to add.");
  }
});

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
