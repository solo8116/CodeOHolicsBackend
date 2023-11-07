const mongoose = require("mongoose");

const eventSchema = mongoose.Schema(
  {
      title: {
        type: String,
        required: true,
      },
      discription: {
        type: String,
      },
      imageUrl: {
        type: String,
      },
      time: {
        type: Date,
      },
    }
);
const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: [true, "email already exists"],
    required: [true, "please provide email"],
  },
  name: {
    type: String,
    required: [true, "please provied your name"],
  },
  image: {
    type: String,
  },
  event: [eventSchema],
});

module.exports = mongoose.model("user", userSchema);