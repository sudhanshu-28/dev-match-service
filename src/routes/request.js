const express = require("express");

const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

const { userAuth } = require("../middlewares/auth");
const { default: mongoose } = require("mongoose");

const requestRouter = express.Router();

requestRouter.post("/send/interested/:userId", userAuth, async (req, res) => {
  try {
    const { _id: fromUserId } = req?.user;
    const { userId: toUserId } = req?.params;

    // Validate request ID
    if (!mongoose.isValidObjectId(toUserId)) {
      throw new Error(
        "Invalid User Id. Could not able to sent connection request."
      );
    }

    // Check user exist with this ID or not
    const user = await User.findById(toUserId);

    if (!user) {
      throw new Error("User not found.");
    }

    // Store Connection request
    const newConnectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status: "interested",
    });

    await newConnectionRequest.save();

    res.send({
      success: true,
      message:
        "Connection Request has been sent to " +
        user?.firstName +
        " successfully.",
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error: " + error,
    });
  }
});

module.exports = requestRouter;
