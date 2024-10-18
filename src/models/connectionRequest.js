const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Types.ObjectId,
      ref: "User", // Creating (reference / connection) to User Collection
      required: true,
    },
    toUserId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
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

// Because we are checking connection request if exist from 2 fileds, so indexing only one field will not work
// We will need to create COMPOUND INDEX as shown below
// Now below combined query will work very fast
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// Pre function is applied at schema level, so any time save method is called, this pre function will execute before
connectionRequestSchema.pre("save", function (next) {
  // Every time mongoose save the new record in this schema/collection this function will be executed
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
