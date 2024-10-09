const express = require("express");

const { userAuth } = require("../middlewares/auth");

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

module.exports = profileRouter;
