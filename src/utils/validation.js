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

const validateProfileEditData = (req) => {
  const userData = req?.body;
  const { firstName, lastName, photoUrl } = userData;

  const ALLOWED_EDIT_FIELDS = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];

  const isUpdateAllowed = Object.keys(userData).every((field) =>
    ALLOWED_EDIT_FIELDS.includes(field)
  );

  if (!isUpdateAllowed) {
    throw new Error("Invalid Edit request.");
  }

  if (!firstName || !lastName) {
    throw new Error("Name is not valid.");
  } else if (!validator.isURL(photoUrl)) {
    throw new Error("Invalid Photo URL: " + photoUrl);
  }
};

const validateProfilePasswordData = (req) => {
  const { currentPassword, newPassword, confirmPassword } = req?.body;

  if (!validator.isStrongPassword(newPassword)) {
    throw new Error("Please choose a strong new Password.");
  } else if (currentPassword === newPassword) {
    throw new Error("Old & New password cannot be same.");
  } else if (newPassword !== confirmPassword) {
    throw new Error("New & Confirmed password does not match.");
  }
};

module.exports = {
  validateSignUpData,
  validateSignInData,
  validateProfileEditData,
  validateProfilePasswordData,
};
