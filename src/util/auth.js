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
};
