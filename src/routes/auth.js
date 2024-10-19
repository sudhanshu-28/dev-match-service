const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const {
  validateSignUpData,
  validateSignInData,
  deepClone,
} = require("../utils");

const authRouter = express.Router();

// Entry point of our application - to register new user
authRouter.post("/signup", async (req, res) => {
  // Recommend way - with All DB operations best practice is to write in try catch block
  try {
    // Step 1: Validation of Data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req?.body;

    // Step 2: Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Creating new instance of User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();

    res.json({
      success: true,
      message: "User added successfully!",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `Error: ${error?.message || error}`,
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    validateSignInData(req);

    const { emailId, password } = req?.body;

    const user = await User.findOne({ emailId }).select(
      "-createdAt -updatedAt -__v"
    );

    if (user) {
      if (user?.password) {
        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {
          // Create JWT Token
          const token = await user.getJWT(); // Offloaded JWT Logic to Schema methods

          // maxAge takes value in milliseconds
          // expires takes value in specific date
          res.cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // current time + 1 day
          });

          // Response data format
          const safeData = deepClone(user);
          delete safeData.password;

          res.json({
            success: true,
            message: "Logged In successfully!",
            data: safeData,
          });
        } else {
          throw new Error("Invalid credentials.");
        }
      }
    } else {
      throw new Error("Invalid credentials.");
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `Error: ${error?.message || error}`,
    });
  }
});

authRouter.get("/logout", (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logout successfully!",
  }); // Chaining
});

module.exports = authRouter;
