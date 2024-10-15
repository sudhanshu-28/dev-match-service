const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
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

// Pre function is applied at schema level, so any time save method is called, this pre function will execute before
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;

  // Check if fromUserId is same as toUserId
  if (connectionRequest?.fromUserId.equals(connectionRequest?.toUserId)) {
    throw new Error(
      "You cannot send a request to the same user you are currently logged in as."
    );
  }

  next();
});

module.exports = new mongoose.model(
  "connectionRequest",
  connectionRequestSchema
);
