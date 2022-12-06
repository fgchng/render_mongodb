const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

// Create user schema
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
     profile_image: {
         data: Buffer,
         contentType: String
     },
     address: {
         full: String,
         street_1st: String,
         street_2nd: String,
         city: String,
         state_province: String,
         country: String,
         postal_code: String
     },
     createdAt: String,
     updatedAt: String
 });
 
 // Room Schema
 var roomSchema = new Schema({
     room_id: Number,
     home_type: String,
     room_type: String,
     total_occupancy: Number,
     total_bedrooms: Number,
     total_bathrooms: Number,
     summary: String,
     address: {
         full: String,
         street_1st: String,
         street_2nd: String,
         city: String,
         state_province: String,
         country: String,
         postal_code: String
     },
     has_tv: Boolean,
     has_kitchen: Boolean,
     has_ac: Boolean,
     has_internet: Boolean,
     price: Number,
     published_at: String,
     owner_id: Number,
     created_at: String,
     update_at: String,
     latitude: Number,
     longitude: Number,
     images: []
 });

// Pre save mongoose for password encryption
userSchema.pre("save",function(next) {
    bcrypt.genSalt(10)
    .then(salt => {
        bcrypt.hash(this.password,salt)
        .then(hash => {
            this.password = hash;
            next();
        })
        .catch(err=>console.log(`Error: ${err}`));
    })
    .catch(err=>console.log(`Error: ${err}`));
});

const userModel = mongoose.model("User",userSchema);

module.exports = userModel;