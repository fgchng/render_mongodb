const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// Review Schema
var reviewSchema = new Schema({
     review_id: Number,
     user_id: Number,
     rating: Number,
     comment: String
 });

 const Review = mongoose.model("review", reviewSchema);
 module.exports = reviewModel;