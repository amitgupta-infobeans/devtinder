// userRouter
//GET  /user/connections  (my connections)
//GET  /user/requests/received    ( interested status)
//GET  /user/feed

//  skip() && limit()  two function for pagination.

const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateInputForChangePassword } = require("../util/validation");

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
        .json({ status: 404, message: "No connection request received." });
    }
    res.status(200).json({
      status: 200,
      message: "All connection request fetched",
      data: data,
    });
  } catch (e) {
    res.status(400).json({ status: 400, message: e.message });
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
        .json({ status: 404, message: "No Connections found." });
    }
    res
      .status(200)
      .json({ status: 200, message: "all connection fetched", data: data });
  } catch (e) {
    res.status(400).json({ status: 400, message: e.message });
  }
});

// FEED API.
userRouter.get("/api/user/feed", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 5;
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
    if (users.length === 0) {
      return res
        .status(400)
        .json({ status: 400, message: "No Feed found", data: [] });
    }
    res
      .status(200)
      .json({ status: 200, message: "All feed fetched", data: users });
  } catch (e) {
    res.status(400).json({ status: 400, message: e.message });
  }
});

userRouter.post("/api/user/changepassword", userAuth, async (req, res) => {
  try {
    validateInputForChangePassword(req);
    const loggedUser = req.user;
    const { currentpassword, newpassword } = req.body;
    const hashedPassword = await bcrypt.hash(newpassword, 10);

    const iscurrentPasswordCurrect = await bcrypt.compare(
      currentpassword,
      loggedUser.password
    );
    if (!iscurrentPasswordCurrect) {
      return res
        .status(400)
        .json({ status: 400, message: "current password in not correct." });
    }
    loggedUser.password = hashedPassword;
    await loggedUser.save();
    res.status(200).json({
      status: 200,
      message: "password updated successfully.",
      data: loggedUser,
    });
  } catch (e) {
    res.status(400).json({ status: 400, message: e.message });
  }
});
module.exports = userRouter;
