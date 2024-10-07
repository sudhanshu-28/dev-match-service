const express = require("express");
const validator = require("validator");

const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

// Convert JSON (Readable Stream) into Javascript Object - for all the APIs request for all HTTP methods (use)
// Dont pass routes if Request Handler / Middleware needs to be applied for all APIs
app.use(express.json());

// NEVER TRUST req.body => It can have malicious data

app.post("/signup", async (req, res) => {
  // Creating new instance of User model
  const user = new User(req?.body);

  // Recommend way - with All DB operations best practice is to write in try catch
  try {
    if (user?.emailId) {
      const isValidEmail = validator.isEmail(user?.emailId);
      if (!isValidEmail) {
        throw new Error("Error: Invalid Email Address.");
      }
    }

    await user.save();
    res.send("User added successfully!");
  } catch (error) {
    console.log("Error => ", error);
    res.status(400).send(error?.message || error);
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
  // Passing key and value after API name with ? are the queries
  const userEmailID = req?.query?.emailID;

  try {
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
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong. Failed to fetch User details.",
    });
  }
});

app.patch("/user/:userId", async (req, res) => {
  // Passing id/value directly in URL after API name are the parameters
  const userId = req?.params?.userId;

  let userData = req?.body;

  try {
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "password",
      "age",
      "gender",
      "photoUrl",
      "about",
      "skills",
    ];

    // Data Sanatization in API level
    const isUpdateAllowed = Object.keys(userData).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed.");
    }

    // Never trust user data and prevent external attack and do proper Data Sanatization
    if (userData?.skills) {
      if (userData?.skills.length > 10) {
        throw new Error("Skills cannot be more than 10.");
      } else {
        userData.skills = [...new Set(userData?.skills)];
      }
    }

    const user = await User.findByIdAndUpdate(userId, userData, {
      returnDocument: "after",
      runValidators: true,
    });

    if (user) {
      res.send({
        success: true,
        message: "User data updated successfully.",
        data: user,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Something went wrong, failed to update User.",
      });
    }
  } catch (error) {
    const defaultMsg = "Failed to update User due to Internal Server Error.";
    res.status(400).send({
      success: false,
      message: error?.message ? `Update Failed: ${error?.message}` : defaultMsg,
    });
  }
});

app.patch("/userUpdateByEmail", async (req, res) => {
  const { emailId } = req?.query;
  const userData = req?.body;

  try {
    const user = await User.findOneAndUpdate({ emailId }, userData, {
      returnDocument: "after",
      runValidators: true,
    });

    if (user) {
      res.send({
        success: true,
        message: "User data updated successfully.",
        data: user,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Something went wrong, failed to update User.",
      });
    }
  } catch (error) {
    const defaultMsg = "Failed to update User due to Internal Server Error.";
    res.status(500).send({
      success: false,
      message: error?.message ? `Update Failed: ${error?.message}` : defaultMsg,
    });
  }
});

app.delete("/user", async (req, res) => {
  const userId = req?.query?.id;

  try {
    const user = await User.findByIdAndDelete(userId);

    if (user) {
      res.send({
        success: true,
        message: "User deleted successfully.",
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Failed to delete user. Please try again.",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong. Please try again.",
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
