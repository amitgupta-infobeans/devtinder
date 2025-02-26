// authRouter
const express = require("express")
const authRouter = express.Router();

const { validateSignupData, validateLoginData } = require("../util/validation")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

authRouter.post("/api/signup", async (req, res) => {
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
    res.status(200).json({ status: 200, data: [ud] });
  } catch (er) {
    res.status(400).send({ status: 501, message: er.message });
  }
});

authRouter.post("/api/login", async (req, res) => {
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
        res.cookie("jwttoken", token, {
          expires: new Date(Date.now() + 8 * 360000),
        });
        res.status(200).json({ status: 200, message: "Login successfully.", data: userObj });
      } else {
        throw new Error("invalid credentials.");
      }
    } catch (e) {
      res.status(400).send({ status: 400, message: e.message });
    }
  });

authRouter.post('/api/logout', (req,res)=>{
  //  expire the cookie and the user will be logout. We are setting jwttoken to null.
  res.cookie('jwttoken', null, {expires:new Date(Date.now())})
  res.status(200).send({status:200, message:"successfully logout.."}) 
})

module.exports = authRouter;