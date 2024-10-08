const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req?.cookies;

    if (!token) {
      throw new Error("Authentication failed. Please log in again.");
    }

    const { _id } = jwt.verify(token, "DEVTinder@997");

    if (!_id) {
      throw new Error("Authentication failed. User not found.");
    }

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("Authentication failed. User details not found.");
    }

    next();
  } catch (error) {
    res.status(401).send({
      success: false,
      message: "Error: " + error,
    });
  }
};

const adminAuth = (req, res, next) => {
  console.log("Admin Auth is called");
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";

  if (!isAdminAuthorized) {
    res.status(401).send("Unauthorized User");
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };
