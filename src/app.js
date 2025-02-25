const express = require("express");
const User = require("./models/user");
const connectDB = require("./config/database");
const { validateSignupData, validateLoginData } = require("./util/validation");
const bcrypt = require("bcrypt");
const app = express(); // app is the instance of express
const cookieParse = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./util/auth");
app.use(express.json()); //middleware...
app.use(cookieParse());

// SIGNUP API..
app.post("/api/signup", async (req, res) => {
  try {
    // Validate data..
    validateSignupData(req);
    //Encrypt the Password:
    const { firstName, lastName, email, password } = req.body;
    const passwordHashed = await bcrypt.hash(password, 10);
    const userD = new User({
      firstName: firstName,
      lastName: lastName,
      password: passwordHashed,
      email: email,
    });
    const ud = await userD.save();
    res.send({ status: 200, data: [ud] });
  } catch (er) {
    res.status(400).send({ status: 501, message: er.message });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    //valdiate login data
    validateLoginData(req);
    const userObj = await User.findOne({ email: email });
    if (!userObj) {
      throw new Error("invalid credentials.");
    }
    const isPasswordValid = await bcrypt.compare(password, userObj.password);
    if (isPasswordValid) {
      // create JWT token and send... and add token to cookies and send back response.
      const token = await jwt.sign(
        { _id: userObj._id },
        "secret-key-Dev-TinerD@4$*2",
        { expiresIn: "1d" }
      );
      res.cookie("jwttoken", token, {expires:new Date(Date.now() + 8*36000)});
      res.send({ status: 200, message: "Login successfully.", data: userObj });
    } else {
      throw new Error("invalid credentials.");
    }
  } catch (e) {
    res.status(400).send({ status: 400, message: e.message });
  }
});

// GET ONE USER API BY ID
app.get("/api/user/:userId", userAuth, async (req, res) => {
  try {
    res.send({
      status: 200,
      message: "Fetch one user data.",
      data: [req.user],
    });
  } catch (e) {
    res.send({ status: 501, message: e.message });
  }
});

connectDB()
  .then(() => {
    console.log("connect with DB successfully...");
    app.listen(7777, () => {
      console.log("dev tinder is running on port 7777");
    });
  })
  .catch((err) => {
    console.log("unable to connect....", err.message);
  });
