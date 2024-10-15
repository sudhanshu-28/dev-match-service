const mongoose = require("mongoose");

const ConnectionRequest = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignore", "interested", "accepted", "rejected"],
        message: "{VALUE} is an invalid status type.",
      },
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("connectionRequest", ConnectionRequest);
