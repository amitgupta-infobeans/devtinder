const express = require("express");

const app = express(); // app is the instance of express

app.use('/test', (req,res)=>{
    res.send("hello from the server...")
})

app.get("/", (req, res) => {
  res.send("hello World from / ");
});

app.listen(7777, () => {
  console.log("dev tinder is running on port 7777");
});
