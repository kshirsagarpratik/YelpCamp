var mongoose = require("mongoose");

//create a schema for campgrounds
var campgroundSchema = new mongoose.Schema({
   name: String,
   price: Number,
   image: String,
   location: String,
   description: String,
   createdAt: { type: Date, default: Date.now },
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
         }
      ]
});

//create a model from the schema
module.exports = mongoose.model("Campground", campgroundSchema);