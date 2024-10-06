const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

// Convert JSON (Readable Stream) into Javascript Object - for all the APIs request for all HTTP methods (use)
// Dont pass routes if Request Handler / Middleware needs to be applied for all APIs
app.use(express.json());

app.post("/signup", async (req, res) => {
  // Creating new instance of User model
  const user = new User(req?.body);

  // Recommend way - with All DB operations best practice is to write in try catch
  try {
    await user.save();
    res.send("User added successfully!");
  } catch (error) {
    console.log("Error => ", err);
    res.status(500).send("User failed to add.");
  }
});

app.get("/getAllUsers", async (req, res) => {
  try {
    const users = await User.find({});
    const count = await User.countDocuments();

    const usersList = users.map((user) => ({
      _id: user?._id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      emailId: user?.emailId,
      age: user?.age,
      gender: user?.gender,
    }));

    if (usersList.length === 0) {
      res.status(404).send({
        success: false,
        message: "Users not found.",
      });
    }

    res.send({
      success: true,
      message: "Users list fetched successfully.",
      data: usersList,
      totalUsers: count,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Something went wrong. Failed to fetch Users list.",
    });
  }
});

app.get("/getUserById", async (req, res) => {
  const userId = req?.query?.id;

  const userData = await User.findById(userId).exec();

  if (!userData) {
    res.status(404).send({
      status: false,
      message: "User not found.",
    });
  } else {
    res.send({
      success: true,
      message: "User fetched successfully.",
      data: {
        _id: userData?._id,
        firstName: userData?.firstName,
        lastName: userData?.lastName,
        emailId: userData?.emailId,
        age: userData?.age,
        gender: userData?.gender,
      },
    });
  }
});

app.get("/getUserByEmail", async (req, res) => {
  const userEmailID = req?.query?.emailID;

  const userData = await User.findOne({ emailId: userEmailID });

  if (!userData) {
    res.status(404).send({
      success: false,
      message: "User not found.",
    });
  } else {
    res.send({
      success: true,
      message: "User fetched successfully.",
      data: {
        _id: userData?._id,
        firstName: userData?.firstName,
        lastName: userData?.lastName,
        emailId: userData?.emailId,
        age: userData?.age,
        gender: userData?.gender,
      },
    });
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    const count = await User.countDocuments();

    const usersList = users.map((user) => ({
      _id: user?._id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      emailId: user?.emailId,
      age: user?.age,
      gender: user?.gender,
    }));

    if (usersList.length === 0) {
      res.status(404).send({
        success: false,
        message: "Users not found.",
      });
    }

    res.send({
      success: true,
      message: "Users list fetched successfully.",
      data: usersList,
      totalUsers: count,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Something went wrong. Failed to fetch Users list.",
    });
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
