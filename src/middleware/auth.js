const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const userAuth = async (req, res, next) => {
  //read the token from the req.cookies
  try {
    const { jwttoken } = req.cookies;
    if (!jwttoken) {
     return res.status(401).send({ status: 401, message: "Token has expired" });
    }
    const decodedJwt = await jwt.verify(jwttoken, process.env.SECRET_KEY);
    const { _id } = decodedJwt;
    const userd = await User.findById(_id);
    if (!userd) {
      throw new Error("user doesn't exist, please login again..");
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
