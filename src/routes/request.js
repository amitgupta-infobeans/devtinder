// requestRouter
// POST /request/send/intrested/:userId
// POST /request/send/ignore/:userId
// POST /request/review/accepted/:requestId
// POST /request/review/rejected/:requestId
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const express = require("express");
const requestRouter = express();

requestRouter.post(
  "/api/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const { toUserId, status } = req.params;
      const allowedStatus = ["ignored", "intrested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "invalid status type", status: 400 });
      }

      //check if there is an existing connection request...
      const existingConnectionReqest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionReqest) {
        return res
          .status(400)
          .json({ message: "Connection request already exist.", status: 400 });
      }
      // validate toUserId is exist in DB...
      const toUserIdExistInDb = await User.findById(toUserId);
      if (!toUserIdExistInDb) {
        return res
          .status(400)
          .json({ message: "Invalid toUserId provided.", status: 400 });
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      //res.json({status:200, message:"connection send successfully", data:data});
      res.status(200).send({
        status: 200,
        message: "connection send successfully",
        data: data,
      });
    } catch (e) {
      res.status(400).send({ status: 400, message: e.message });
    }
  }
);

module.exports = requestRouter;
