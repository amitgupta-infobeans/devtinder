// requestRouter
// POST /request/send/intrested/:userId
// POST /request/send/ignore/:userId
// POST /request/review/accepted/:requestId
// POST /request/review/rejected/:requestId

const express = require("express")

const requestRouter = express();

requestRouter.get("/api/sendConnectionRequest", (req, res) => {
    try {
      res.status(200).send("success...");
    } catch (e) {
      res.send({ status: 501, message: e.message });
    }
  });

  module.exports = requestRouter