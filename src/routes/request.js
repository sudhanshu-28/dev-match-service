const express = require("express");

const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const { firstName } = req?.user;

    res.send({
      success: true,
      message: firstName + " has sent Connection Request.",
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error: " + error,
    });
  }
});

module.exports = requestRouter;
