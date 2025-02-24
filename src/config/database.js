const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://gupta05amit:<DB_password>.vomkj5d.mongodb.net/devTinder"
  );
  // here tevTinder is DB name...
};

module.exports = connectDB;
