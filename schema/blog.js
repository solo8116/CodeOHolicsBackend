const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
    author: {
      type: String,
      required:true
    },
    title: {
      type: String,
      required: [true, "please provide the title"],
    },
    thumbNail: {
      type: String,
    },
    content:{
        type:String,
        required:true
    }
  },{
    timestamps:true
  });

  module.exports = mongoose.model('blog',blogSchema)