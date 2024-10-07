const mongoose = require("mongoose");
const { specialChars, containsSpecialChars } = require("../utils/helper");

// Create Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please enter First Name."], // by default if not passed it will be false
      trim: true,
      minLength: [3, "First Name length should be of minimum 3 characters."],
      maxLength: [20, "First Name length should be of maximum 20 characters."],
    },
    lastName: {
      type: String,
      trim: true,
      minLength: [3, "Last Name length should be of minimum 3 characters."],
      maxLength: [20, "Last Name length should be of maximum 20 characters."],
    },
    emailId: {
      type: String,
      required: [true, "Please enter Email address"],
      unique: true,
      lowercase: true,
      trim: true,
      minLength: 5,
      maxLength: 30,
      minLength: [5, "Email Address length should be of minimum 5 characters."],
      maxLength: [
        30,
        "Email Address length should be of maximum 30 characters.",
      ],
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: [8, "Password length should be of minimum 8 characters."],
      validate(value) {
        if (!containsSpecialChars(value)) {
          throw new Error(
            "Password must contain atleast one special characters out of given list " +
              specialChars
          );
        }
      },
    },
    age: {
      type: Number,
      max: 120,
      // min: 18,
      validate(value) {
        if (value < 18) {
          throw new Error("Age below 18 is not allowed in the application.");
        }
        // Order matters here, when any data is passed, Schema configuration is checked line by line - which error comes up first is thrown
      },
    },
    gender: {
      type: String,
      trim: true,
      enum: ["Male", "Female", "Other"],
    },
    photoUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_VQvuRo4SyQr1uhvdXwmgJYYX5pj7Yr_qcw&s",
    },
    about: {
      type: String,
      default: "This is default Description of the user.",
      trim: true,
      maxLength: [
        1000,
        "About description cannot be more than 1000 characters.",
      ],
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true } // Default store with UTC
);

// Create Modal
const User = mongoose.model("User", userSchema);

module.exports = User;
