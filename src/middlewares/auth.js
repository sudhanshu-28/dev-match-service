const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req?.cookies;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please Login.",
      });
    }

    const { _id } = await jwt.verify(token, "DEVTinder@997");

    if (!_id) {
      throw new Error("Authentication failed. User not found.");
    }

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("Authentication failed. User details not found.");
    }

    req.user = user; // Attach user details to req body, if any authenticated API required access to it
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Error: " + error,
    });
  }
};

const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";

  if (!isAdminAuthorized) {
    res.status(401).json({
      success: false,
      message: "Unauthorized User",
    });
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };
