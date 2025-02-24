const express = require("express");

const app = express(); // app is the instance of express

const firstM = (req,res, next) =>{
   next();
}

const secondM = (req,res) =>{
    res.send({message:"secondMsecondM...."})    
}
app.use('/user', firstM, secondM) // "user" route handler
app.listen(7777, () => {
  console.log("dev tinder is running on port 7777");
});
