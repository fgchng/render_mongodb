const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const passportLocalMongoose = require("passport-local-mongoose");

// User Schema
var userSchema = new Schema ({
    user_id: Number,
    firstName: String,
    lastName: String,
    user_name: { 
        type: String, 
        required: true, 
        unique: true},
    password: { 
        type: String, 
        required: true},
    email: String,
    phone_number: Number,
    description: String,
    profilePicture: String,
    bannerPicture: String,

    addressFull: String,
    addressStreet: String,
    addressCity: String,
    addressRegion: String,
    addressCountry: String,

    createdAt: String,
    updatedAt: String
});
// userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User",userSchema);

module.exports = User;