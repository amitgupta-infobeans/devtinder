const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  //read the token from the req.cookies
  const userId = req.params.userId;
  try {
    const { jwttoken } = req.cookies;
    // console.log(jwttoken)
    if (!jwttoken) {
      throw new Error("Invalid token");
    }
    const decodedJwt = await jwt.verify(jwttoken, "secret-key-Dev-TinerD@4$*2");
    const { _id } = decodedJwt;
    const userd = await User.findById(_id);
    if (!userd) {
      throw new Error("user doesn't exist, please login again..");
    }
    if (userd._id !== userId) {
      throw new Error("Unauthorized user.");
    }
    req.user = userd;
    next();
  } catch (e) {
    res.status(400).send({ message: e.message, status: 400 });
  }
};

//middleware
const adminMiddleware = (req, res, next) => {
  const isAdmin = "admintoken";
  if (isAdmin === "admintoken") {
    next();
  } else {
    res.send({ message: "Unauthorized User" });
  }
};

const userMiddleware = (req, res, next) => {
  const isAdmin = "userauth";
  if (isAdmin === "userauth") {
    next();
  } else {
    res.send({ message: "Unauthorized..." });
  }
};

module.exports = {
  userMiddleware,
  adminMiddleware,
  userAuth,
};
