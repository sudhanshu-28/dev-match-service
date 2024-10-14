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

    res.send({
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
    res.status(400).send({
      success: false,
      message: "Error: " + error?.message,
    });
  }
});

module.exports = profileRouter;
