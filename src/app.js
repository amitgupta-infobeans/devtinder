const express = require("express");
require("./config/database");
const User = require("./models/user");
const connectDB = require("./config/database");
const app = express(); // app is the instance of express

app.use(express.json()) //middleware...


app.post("/api/signup", async (req, res) => {
  try {
    const userD = new User(req.body);
    const ud = await userD.save();
    res.send({ status: 200, data: [ud] });
  } catch (er) {
    res.send({ status: 501, message: er.message });
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
