const validator = require("validator");
const validateSignupData = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("firstName and lastName is required.");
  } else if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("firstName should be 4-50 character.");
  } else if (!validator.isEmail(email)) {
    throw new Error("email is not valid.");
  }
  // else if (!validator.isStrongPassword(password)) {
  //   throw new Error("Please enter a strong password.");
  // }
};

const validateLoginData = (req) => {
  const { email, password } = req.body;
  if (!password || !email) {
    throw new Error("Email and Passowrd is required");
  } else if (!validator.isEmail(email)) {
    throw new Error("email is not valid.");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "email",
    "photoUrl",
    "age",
    "gender",
    "about",
    "skills",
  ];
  const isValid = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isValid;
};
module.exports = {
  validateSignupData,
  validateLoginData,
  validateEditProfileData,
};
