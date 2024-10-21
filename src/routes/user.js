const express = require("express");

const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

const { userAuth } = require("../middlewares/auth");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl about skills age gender";

userRouter.get("/requests/received", userAuth, async (req, res) => {
  try {
    const { _id } = req?.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: _id,
      status: "interested",
    })
      .select("fromUserId") // Only fields i want to extract from each document
      .populate(
        "fromUserId", // It will populate all data fromUserId for connected/refered Collection
        USER_SAFE_DATA
      );

    // Either pass all fields in array or pass as single string with space seperated
    //    Option 1: "firstName lastName photoUrl about skills"
    //    Option 2: ["firstName", "lastName", "photoUrl", "about", "skills"];

    res.json({
      success: true,
      message: "Connection Requests list fetched successfully.",
      data: connectionRequests || [],
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Error: " + error?.message,
    });
  }
});

userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const { _id } = req?.user;

    const myConnections = await ConnectionRequest.find({
      $or: [{ fromUserId: _id }, { toUserId: _id }],
      status: "accepted",
    })
      .select("fromUserId toUserId status")
      .populate("fromUserId", USER_SAFE_DATA) // 1st way to write
      .populate({
        path: "toUserId",
        select: USER_SAFE_DATA,
      }); // 2nd way to write

    // Customized Response
    const modifiedResponse = myConnections.map((connection) => {
      if (connection?.fromUserId?._id.equals(_id)) {
        return connection?.toUserId;
      }

      if (connection?.toUserId?._id.toString() === _id.toString()) {
        return connection?.fromUserId;
      }

      return {};
    });

    res.json({
      success: true,
      message: "Connections fetched successfully.",
      data: modifiedResponse,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error: " + error?.message || error,
    });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const { _id } = req?.user;

    const page = parseInt(req?.query?.page) || 1;
    let limit = parseInt(req?.query?.limit) || 10;

    // Input sanatization for Limit
    if (limit > 50) {
      limit = 50;
    }

    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: _id }, { toUserId: _id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req?.fromUserId.toString());
      hideUsersFromFeed.add(req?.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: _id } },
      ],
    })
      .sort({ updatedAt: -1 })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      message: "Users fetched for the Feed successfully.",
      data: users,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error: " + error?.message || error,
    });
  }
});

module.exports = userRouter;
