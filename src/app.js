const express = require("express");
const User = require("./models/user");
const connectDB = require("./config/database");
const { validateSignupData, validateLoginData } = require("./util/validation");
const bcrypt = require("bcrypt");
const app = express(); // app is the instance of express

app.use(express.json()); //middleware...

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
      res.send({ status: 200, message: "Login successfully.", data: userObj });
    } else {
      throw new Error("invalid credentials.");
    }
  } catch (e) {
    res.status(400).send({ status: 400, message: e.message });
  }
});

// GET ONE USER API BY ID
app.get("/api/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const userd = await User.findById(userId);
    res.send({
      status: 200,
      message: userd ? "Fetch one user data." : "invalid userId provided",
      data: [userd],
    });
  } catch (e) {
    res.send({ status: 501, message: e.message });
  }
});

//GET ALL USER API
app.get("/api/user", async (req, res) => {
  try {
    const userd = await User.find({});
    res.send({
      status: 200,
      message: "Success",
      data: userd,
    });
  } catch (e) {
    res.send({ status: 501, message: e.message });
  }
});

// DELETE USER BY ID API
app.delete("/api/user/:userId", async (req, res) => {
  try {
    const existUser = await User.findByIdAndDelete(req.params.userId);
    if (existUser) {
      res.send({ status: 200, message: "User Deleted Successfully" });
    } else {
      res.send({ status: 400, message: "Invalid userId provided" });
    }
  } catch (e) {
    res.send({ status: 400, message: e.message });
  }
});

// UPDATE USER BY PATCH
app.patch("/api/user", async (req, res) => {
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [
      "userId",
      "skills",
      "age",
      "about",
      "photoUrl",
      "gender",
    ];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    const updateUser = await User.findByIdAndUpdate(req.body.userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send({ status: 200, message: updateUser });
  } catch (e) {
    res.status(400).send({ status: 400, message: e.message });
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
