const express = require("express");

const User = require("../models/user");

const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    // Fetched User details from userAuth middleware
    if (!req?.user) {
      throw new Error("Authentication failed. User details not found.");
    }

    const { firstName, lastName, emailId, photoUrl, about, skills } = req?.user;

    res.send({
      success: true,
      message: "Profile fetched successfully.",
      data: { firstName, lastName, emailId, photoUrl, about, skills },
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error: " + error?.message,
    });
  }
});

profileRouter.patch("/edit/:userId", userAuth, async (req, res) => {
  try {
    const { userId } = req?.params;

    console.log("req?.user?.firstName => ", req?.user?.firstName);

    if (!userId && !req?.user) {
      throw new Error("Authentication failed. User details not found.");
    }

    if (userId !== req?.user?._id.toString()) {
      throw new Error(
        "User details cannot be updated while logged in as a different user. Please log in with the correct user ID to make changes."
      );
    }

    validateProfileEditData(req);

    const userData = req?.body;

    const user = await User.findByIdAndUpdate(userId, userData, {
      runValidators: true,
      returnDocument: "after",
    });

    res.send({
      success: true,
      message: "User updated successfully.",
      data: {
        _id: user?._id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        emailId: user?.emailId,
        photoUrl: user?.photoUrl,
        about: user?.about,
        skills: user?.skills,
      },
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error: " + error?.message,
    });
  }
});

module.exports = profileRouter;
