const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// Reservation Schema
var reservationSchema = new Schema({
     reservation_id: Number,
     user_id: Number,
     room_id: Number,
     start_date: String,
     end_date: String, 
     price: Number,
     total: Number,
     created_at: String,
     update_at: String
 });

 const Reservation = mongoose.model("Reservation",reservationSchema);
 module.exports = Reservation;
 
