const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user");

const {
  validateProfileEditData,
  validateProfilePasswordData,
} = require("../utils/validation");
const { userAuth } = require("../middlewares/auth");

const profileRouter = express.Router();

profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    // Fetched User details from userAuth middleware
    if (!req?.user) {
      throw new Error("Authentication failed. User details not found.");
    }

    const { _id, firstName, lastName, emailId, photoUrl, about, skills } =
      req?.user;

    res.json({
      success: true,
      message: "Profile fetched successfully.",
      data: { _id, firstName, lastName, emailId, photoUrl, about, skills },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error: " + error?.message,
    });
  }
});

profileRouter.patch("/edit", userAuth, async (req, res) => {
  try {
    const loggedInUser = req?.user;

    if (!loggedInUser) {
      throw new Error("Authentication failed. User details not found.");
    }

    validateProfileEditData(req);

    const userData = req?.body;

    Object.keys(userData).forEach((key) => (loggedInUser[key] = userData[key]));

    await loggedInUser.save();

    res.json({
      success: true,
      message: "User updated successfully.",
      data: {
        _id: loggedInUser?._id,
        firstName: loggedInUser?.firstName,
        lastName: loggedInUser?.lastName,
        emailId: loggedInUser?.emailId,
        photoUrl: loggedInUser?.photoUrl,
        about: loggedInUser?.about,
        skills: loggedInUser?.skills,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error: " + error?.message,
    });
  }
});

profileRouter.patch("/password", userAuth, async (req, res) => {
  try {
    const userData = req?.user;

    if (!userData) {
      throw new Error("Authentication failed. User details not found.");
    }

    validateProfilePasswordData(req);

    const { currentPassword, confirmPassword } = req?.body;

    const isMatched = await bcrypt.compare(currentPassword, userData?.password);

    if (!isMatched) {
      throw new Error("Current Password entered does not match.");
    }

    const passwordHash = await bcrypt.hash(confirmPassword, 10);
    const user = await User.findByIdAndUpdate(userData?._id, {
      password: passwordHash,
    });

    if (!user) {
      throw new Error("Password update failed.");
    }

    res.json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error: " + error?.message,
    });
  }
});

module.exports = profileRouter;
