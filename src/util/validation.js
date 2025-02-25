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
  //   else if (!validator.isStrongPassword(password)) {
  // throw new Error("Please enter a strong password.");
  //   }
};

const validateLoginData = (req) => {
  const { email, password } = req.body;
  if (!password || !email) {
    throw new Error("Email and Passowrd is required");
  } else if (!validator.isEmail(email)) {
    throw new Error("email is not valid.");
  }
};
module.exports = { validateSignupData, validateLoginData };
