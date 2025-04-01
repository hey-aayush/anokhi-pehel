const mongoose = require("mongoose");

const { Schema } = mongoose;

const BlogSchema = new Schema({
    title:{
      type: String,
      required: true, 
    },
    createdAt:{
      type: Date,
      default: Date.now, 
    },
    imageUrl:{
      type: String,
      required: true, 
    },
    description:{
      type: String,
      required: true, 
    },
    instagramPostLink:{
      type: String, 
    },
    linkedinPostLink:{
      type: String, 
    },
    facebookPostLink:{
      type: String, 
    },
});

module.exports = mongoose.model("Blog", BlogSchema);
