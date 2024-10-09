const express = require("express");

const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");

const exampleRouter = express.Router();

exampleRouter.get("/getAllUsers", userAuth, async (req, res) => {
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

exampleRouter.get("/getUserById", userAuth, async (req, res) => {
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

exampleRouter.get("/getUserByEmail", userAuth, async (req, res) => {
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

exampleRouter.patch("/user/:userId", userAuth, async (req, res) => {
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

exampleRouter.patch("/userUpdateByEmail", userAuth, async (req, res) => {
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

exampleRouter.delete("/user", userAuth, async (req, res) => {
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

module.exports = exampleRouter;
