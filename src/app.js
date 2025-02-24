const express = require("express");
require("./config/database");
const User = require("./models/user");
const connectDB = require("./config/database");
const app = express(); // app is the instance of express

app.use(express.json()); //middleware...

// SIGNUP API..
app.post("/api/signup", async (req, res) => {
  try {
    const userD = new User(req.body);
    const ud = await userD.save();
    res.send({ status: 200, data: [ud] });
  } catch (er) {
    res.send({ status: 501, message: er.message });
  }
});

// GET ONE USER API BY ID
app.get("/api/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const userd = await User.findById(userId);
    console.log(userd);
    res.send({
      status: 200,
      message: userd ? "Fetch one user data." : "invalid userId provided",
      data: [userd],
    });
  } catch (e) {
    res.send({ status: 501, message: e.message });
  }
});

//GET ALL USER API
app.get("/api/user", async (req, res) => {
  try {
    const userd = await User.find({});
    res.send({
      status: 200,
      message: "Success",
      data: userd,
    });
  } catch (e) {
    res.send({ status: 501, message: e.message });
  }
});

// DELETE USER BY ID API
app.delete("/api/user/:userId", async (req, res) => {
  try {
    const existUser = await User.findByIdAndDelete(req.params.userId);
    if (existUser) {
        res.send({status:200, message:"User Deleted Successfully"})
    }else{
        res.send({status:400, message:"Invalid userId provided"})
    }
  } catch (e) {
    res.send({status:400, message:e.message})
  }
});

// UPDATE USER BY PATCH
app.patch('/api/user', async (req,res)=>{
    const data = req.body;
    try{
        const updateUser = await User.findByIdAndUpdate(req.body.userId, data, {returnDocument:'after'} )
        res.send({status:200, message:updateUser})
    }catch(e){
        res.send({status:400, message:e.message})
    }
})




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
