const express = require("express");

const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

const { userAuth } = require("../middlewares/auth");
const { default: mongoose } = require("mongoose");

const requestRouter = express.Router();

requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const { _id: fromUserId } = req?.user;
    const { status, toUserId } = req?.params;

    if (fromUserId.toString() === toUserId.toString()) {
      throw new Error(
        "You cannot send a request to the same user you are currently logged in as."
      );
    }

    const ALLOWED_STATUS = ["ignore", "interested"];

    // Valudate status
    if (!status || !ALLOWED_STATUS.includes(status)) {
      throw new Error(`Invalid status type: ${status}`);
    }

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

    // Check for existingConnectionRequest
    const existingConnectionRequest = ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) {
      throw new Error("Connection Request already present.");
    }

    // Store Connection request
    const newConnectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await newConnectionRequest.save();

    res.json({
      success: true,
      message:
        "Connection Request has been sent to " +
        user?.firstName +
        " successfully.",
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error: " + error,
    });
  }
});

module.exports = requestRouter;
