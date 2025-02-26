// userRouter
//GET  /user/connections  (my connections)
//GET  /user/requests/received    ( interested status)
//GET  /user/feed

//  skip() && limit()  two function for pagination.

const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express();

const USER_SAVED_DATA =
  "firstName lastName email gender photoUrl age about skills";
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

// GET ALL CONNECTIONS OF ACCEPTED STATUS.
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

// FEED API.
userRouter.get("/api/user/feed", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;
    // get all users whose I am not marked as: ignored, interested, rejected, and if also has connections with other user(don't show )
    // user shouldn't see his own card, his connection (already connected user), already ignored, or already sent the connection request to user. these users we don't have to send in API.

    const data = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedUser._id }, { toUserId: loggedUser._id }],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();
    data.forEach((row) => {
      hideUserFromFeed.add(row.fromUserId.toString());
      hideUserFromFeed.add(row.toUserId.toString());
    });
    // console.log(hideUserFromFeed);
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedUser._id } },
      ],
    })
      .select(USER_SAVED_DATA)
      .skip(skip)
      .limit(limit);

    //  skip formula :  (page-1)*limit
    res.status(200).json({ status: 200, message: "all feed fetched", users });
  } catch (e) {
    res.status(400).send({ status: 400, message: e.message });
  }
});

module.exports = userRouter;
