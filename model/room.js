const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
 const Room = mongoose.model("Room",roomSchema);
 module.exports = Room;
 