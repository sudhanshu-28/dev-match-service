const mongoose = require("mongoose");

// Create Schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastname: {
    type: String,
  },
  emailId: {
    type: String,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
});

// Create Modal
const User = mongoose.model("User", userSchema);

module.exports = User;
