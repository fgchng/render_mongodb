const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// Review Schema
var reviewSchema = new Schema({
    room_id: String,
    user_id: String,
    rating: Number,
    comment: String,

    firstName: String,
    lastName: String,
    profilePicture: String,
    username: String,
});

 const Review = mongoose.model("Review", reviewSchema);
 module.exports = Review;