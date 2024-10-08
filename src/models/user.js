const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password: " + value);
        }
      },
      // validate(value) {
      //   if (!containsSpecialChars(value)) {
      //     throw new Error(
      //       "Password must contain atleast one special characters out of given list " +
      //         specialChars
      //     );
      //   }
      // },
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
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL: " + value);
        }
      },
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

// Schema Methods make your function/method easily reusable:
// Always we need to use Normal function here, because for each user record we create instance and for this is attached to userObj
// And this does not work with arrow function
userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user?._id }, "DEVTinder@997", {
    expiresIn: "1d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const hashedPassword = user?.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    hashedPassword
  );

  return isPasswordValid;
};

// Create Modal
// const User = mongoose.model("User", userSchema);
module.exports = mongoose.model("User", userSchema);
