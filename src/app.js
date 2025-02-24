const express = require("express");

const app = express(); // app is the instance of express

app.get("/user", (req,res)=>{
    res.send({status:200, message:"get all users"})
})
app.post('/user',(req,res)=>{
    res.send({status:200,message:"Post method called"})
})
app.put('/user',(req,res)=>{
    res.send({status:200,message:"Post method put"})
})

app.delete('/user',(req,res)=>{
    res.send({status:200,message:"User Deleted successfully!"})
})

app.listen(7777, () => {
  console.log("dev tinder is running on port 7777");
});
