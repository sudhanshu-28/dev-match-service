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
        "firstName lastName photoUrl about" // Specify fields which we want to extract
      );

    // Either pass all fields in array or pass as single string with space seperated
    //    Option 1: "firstName lastName photoUrl about skills"
    //    Option 2: ["firstName", "lastName", "photoUrl", "about", "skills"];

    console.log(connectionRequests);

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
      const fromUserIdMatches = connection?.fromUserId?._id.equals(_id);
      const toUserIdMatches = connection?.toUserId?._id.equals(_id);

      if (fromUserIdMatches) return connection?.toUserId;
      if (toUserIdMatches) return connection?.fromUserId;

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
      res.status(404).json({
        success: false,
        message: "Users not found.",
      });
    }

    res.json({
      success: true,
      message: "Users list fetched successfully.",
      data: usersList,
      totalUsers: count,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something went wrong. Failed to fetch Users list.",
    });
  }
});

module.exports = userRouter;
