// userRouter
//GET  /user/connections  (my connections)
//GET  /user/requests/received    ( interested status)
//GET  /user/feed

const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express();

// GET ALL THE PENDING CONNECTION REQUEST FOR THE LOGGED USER.
userRouter.get("/api/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const data = await ConnectionRequest.find({
      toUserId: loggedUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName", "gender"]);
    if (!data.length) {
      return res
        .status(404)
        .json({ status: 404, message: "No connection request found." });
    }
    res
      .status(200)
      .json({ status: 200, message: "all connection fetched", data: data });
  } catch (e) {
    res.status(400).send({ status: 400, message: e.message });
  }
});

module.exports = userRouter;
