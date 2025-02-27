const express = require("express");
const connectDB = require("./config/database");
const app = express(); // app is the instance of express
const cookieParse = require("cookie-parser");
const cors = require("cors");
app.use(cors({
  origin:"http://localhost:5173",  //so this is for whitelisting 
  credentials:true
}));
app.use(express.json()); //middleware...
app.use(cookieParse());
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter, profileRouter, requestRouter, userRouter);

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
