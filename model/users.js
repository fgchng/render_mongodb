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
 

const User = mongoose.model("User",userSchema);
module.exports = User;

