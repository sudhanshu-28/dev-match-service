const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

// Convert JSON (Readable Stream) into Javascript Object - for all the APIs request for all HTTP methods (use)
// Dont pass routes if Request Handler / Middleware needs to be applied for all APIs
app.use(express.json());

app.post("/signup", async (req, res) => {
  console.log(req.body);

  // Creating new instance of User model
  const user = new User(req.body);
  // // Recommend way - with All DB operations best practice is to write in try catch
  try {
    await user.save();
    res.send("User added successfully!");
  } catch (error) {
    console.log("Error => ", err);
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
