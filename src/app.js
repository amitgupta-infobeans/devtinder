const express = require("express");
const connectDB = require("./config/database");
const app = express(); // app is the instance of express
const cookieParse = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

app.use(
  cors({
    origin: process.env.FRONT_APP_URL, //so this is for whitelisting
    credentials: true,
  })
);
app.use(express.json()); //middleware...
app.use(cookieParse());

PORT = process.env.PORT || 7777;

// API ROUTES.
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter, profileRouter, requestRouter, userRouter);

app.use("*", (req, res) => {
  res.status(404).send({ status: 404, message: "invalid API path." });
});
connectDB()
  .then(() => {
    console.log("connect with DB successfully...");
    app.listen(PORT, () => {
      console.log("dev tinder is running on port " + PORT);
    });
  })
  .catch((err) => {
    console.log("unable to connect....", err.message);
  });
