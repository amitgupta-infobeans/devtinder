//  profileRouter.
// GET  profile/view
// PATCH  profile/edit  (edit profile)
// PATCH  profile/password
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../util/validation");
const express = require("express");

const profileRouter = express();

// GET ONE USER API BY ID
profileRouter.get("/api/profile", userAuth, async (req, res) => {
  try {
    res.status(200).json({
      status: 200,
      message: "Profile fetched successfully.",
      data: [req.user],
    });
  } catch (e) {
    res.status(501).json({ status: 501, message: e.message });
  }
});

// EDIT USER PROFILE API.
profileRouter.patch("/api/profile/edit", userAuth, async (req, res) => {
  try {
    if (validateEditProfileData(req)) {
      const loggedUser = req.user;
      Object.keys(req.body).forEach((key) => (loggedUser[key] = req.body[key]));
      await loggedUser.save();

      res.status(200).send({
        status: 200,
        message: loggedUser.firstName + " Profile Updated successfully.",
        data: loggedUser,
      });
    } else {
      throw new Error("Invalid edit request..");
    }
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

module.exports = profileRouter;
