const validator = require("validator");
const validateSignupData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  // Validate all fields.
  if (
    [firstName, lastName, email, password].some(
      (isemptyField) => isemptyField.trim() === ""
    )
  ) {
    throw new Error("All fields are required!");
  } else if (!firstName.trim() || !lastName.trim()) {
    throw new Error("firstName and lastName is required.");
  } else if (firstName.length < 3 || firstName.length > 50) {
    throw new Error("firstName should be 4-50 character.");
  } else if (!validator.isEmail(email)) {
    throw new Error("email is not valid.");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password.");
  }
};

const validateLoginData = (req) => {
  const { email, password } = req.body;
  if (!password || !email) {
    throw new Error("Email and Passowrd is required");
  } else if (!validator.isEmail(email)) {
    throw new Error("email is not validssss.");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "photoUrl",
    "age",
    "gender",
    "about",
  ];
  let isValid = Object.keys(req.body).every(
    (field) => allowedEditFields.includes(field) && req.body[field] !== ""
  );
  return isValid;
};

const validateInputForChangePassword = (req) => {
  const { currentpassword, newpassword } = req.body;
  if (!currentpassword || !newpassword) {
    throw new Error("Please provide current password and new password.");
  } else if (!validator.isStrongPassword(newpassword)) {
    throw new Error("Please enter a strong password.");
  }
};

module.exports = {
  validateSignupData,
  validateLoginData,
  validateEditProfileData,
  validateInputForChangePassword,
};
