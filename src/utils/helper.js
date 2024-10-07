const specialChars = "[`!@#$%^&*()_+-=[]{};':\"\\|,.<>/?~]/";

const containsSpecialChars = (str) => {
  return specialChars
    .split("")
    .some((specialChar) => str.includes(specialChar));
};

module.exports = { specialChars, containsSpecialChars };
