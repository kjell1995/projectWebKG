const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  Email: String,
  Firstname: String,
  Lastname: String,
  Username: String,
  Password: String
});

const user = mongoose.model("users", userSchema);
module.exports = user;
