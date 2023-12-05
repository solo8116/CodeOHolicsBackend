const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: [true,"please provide email"],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  admin:{
    type:Boolean,
    default:false
  }
});

module.exports = mongoose.model("users", userSchema);
