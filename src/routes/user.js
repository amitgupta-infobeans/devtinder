// userRouter
//GET  /user/connections  (my connections)
//GET  /user/requests/received    ( interested status)
//GET  /user/feed

const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express();

const USER_SAVED_DATA = "firstName lastName gender";
// GET ALL THE PENDING CONNECTION REQUEST FOR THE LOGGED USER.
userRouter.get("/api/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const data = await ConnectionRequest.find({
      toUserId: loggedUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAVED_DATA);
    if (!data.length) {
      return res
        .status(404)
        .json({ status: 404, message: "No connection request found." });
    }
    res.status(200).json({
      status: 200,
      message: "all connection request fetched",
      data: data,
    });
  } catch (e) {
    res.status(400).send({ status: 400, message: e.message });
  }
});

userRouter.get("/api/user/connections", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const allConnections = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedUser._id, status: "accepted" },
        { fromUserId: loggedUser._id, status: "accepted" },
      ],
    }).populate("fromUserId", USER_SAVED_DATA);

    const data = allConnections.map((row) => {
      if (row.fromUserId._id.toString() === loggedUser._id.toString()) {
        return row;
      }
      return row.fromUserId;
    });
    if (!data.length) {
      return res
        .status(404)
        .json({ status: 404, message: "No connections found." });
    }
    res
      .status(200)
      .json({ status: 200, message: "all connection fetched", data: data });
  } catch (e) {
    res.status(400).send({ status: 400, message: e.message });
  }
});

module.exports = userRouter;
