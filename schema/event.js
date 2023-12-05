const mongoose = require("mongoose");

const eventSchema = mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
    joinedUsers: {
        type:Array
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("events", eventSchema);
