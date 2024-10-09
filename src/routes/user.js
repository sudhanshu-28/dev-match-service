const express = require("express");

const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");

const userRouter = express.Router();

userRouter.get("/feed", userAuth, async (req, res) => {
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

module.exports = userRouter;
