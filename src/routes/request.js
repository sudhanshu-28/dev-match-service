const express = require("express");

const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

const { userAuth } = require("../middlewares/auth");
const {
  validateNonMatchingUserIds,
  validateObjectId,
} = require("../utils/validation");

const requestRouter = express.Router();

requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const { status, toUserId } = req?.params;
    const { _id: fromUserId, firstName: fromUserName } = req?.user;

    // Handled in pre check of Schema
    validateNonMatchingUserIds(fromUserId, toUserId);

    // Validate request ID
    validateObjectId(toUserId);

    const ALLOWED_STATUS = ["ignore", "interested"];

    // Validation of IDs are also done at Schema level with pre function
    if (!status || !ALLOWED_STATUS.includes(status)) {
      throw new Error(`Invalid status type: ${status}`);
    }

    // Check user exist with this ID or not
    const { _id, firstName: toUserName } = await User.findById(toUserId);

    if (!_id) {
      throw new Error("User not found.");
    }

    // Check for existingConnectionRequest
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ], // We have Compund Index for this both field to search in DB very fast
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

    let message = `${fromUserName} is ${status} in ${toUserName}`;

    if (status === "ignore") {
      message = `${fromUserName} ${status} ${toUserName} connection request.`;
    }

    res.json({
      success: true,
      message,
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error: " + error,
    });
  }
});

requestRouter.post("/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const { _id } = req?.user;
    const { status, requestId } = req?.params;

    // Handled in pre check of Schema
    validateNonMatchingUserIds(requestId, _id);

    // Validate request ID
    validateObjectId(requestId);

    const ALLOWED_STATUS = ["accepted", "rejected"];

    // Validation of IDs are also done at Schema level with pre function
    if (!status || !ALLOWED_STATUS.includes(status)) {
      throw new Error(`Invalid status type: ${status}`);
    }

    const connectionRequestUpdateData =
      await ConnectionRequest.findOneAndUpdate(
        {
          fromUserId: requestId,
          toUserId: _id,
          status: "interested",
        },
        { status }
      );

    if (!connectionRequestUpdateData) {
      throw new Error("Failed to accept / reject connection request.");
    }

    res.json({
      success: true,
      message: "Connection request " + status + " successfully.",
      data: connectionRequestUpdateData,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error: " + error,
    });
  }
});

module.exports = requestRouter;
