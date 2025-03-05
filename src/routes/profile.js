//  profileRouter.
// GET  /profile
// PATCH  /profile/edit  (edit profile)

const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../util/validation");
const express = require("express");

const profileRouter = express();

// GET USER API.
profileRouter.get("/api/profile", userAuth, async (req, res) => {
  try {
    res.status(200).json({
      status: 200,
      message: "Profile fetched successfully.",
      data: req.user,
    });
  } catch (e) {
    res.status(400).json({ status: 400, message: e.message });
  }
});

// EDIT USER PROFILE API.
profileRouter.patch("/api/profile/edit", userAuth, async (req, res) => {
  try {
    if (validateEditProfileData(req)) {
      const loggedUser = req.user;
      Object.keys(req.body).forEach((key) => (loggedUser[key] = req.body[key]));
      await loggedUser.save();     
      res.status(200).json({
        status: 200,
        message: "Profile Updated successfully.",
        data: loggedUser,
      });
    } else {
      throw new Error("Invalid edit request. All fields are required..");
    }
  } catch (e) {
    res.status(400).json({status:400, message: e.message });
  }
});

module.exports = profileRouter;
