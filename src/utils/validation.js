const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req?.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid.");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid.");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter strong Password.");
  }
};

const validateSignInData = (req) => {
  const { emailId, password } = req?.body;

  if (!emailId || !password) {
    throw new Error("Email or password is invalid.");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  }
};

module.exports = { validateSignUpData, validateSignInData };
