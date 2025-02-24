const express = require("express");
const { userMiddleware, adminMiddleware } = require("./util/auth");

const app = express(); // app is the instance of express

app.get("/user", userMiddleware, (req, res) => {
  res.send({ status: 200, message: "Success User..." });
});
app.get("/admin", adminMiddleware, (req, res) => {
  res.send({ status: 200, message: "Success Admin..." });
});

app.listen(7777, () => {
  console.log("dev tinder is running on port 7777");
});
