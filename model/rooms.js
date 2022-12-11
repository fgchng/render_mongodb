const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var roomSchema = new Schema({
    firstName: String,
    lastName: String,
    phoneNumber: Number,
    emailAddress: String,

    name: String,
    room_id: Number,
    total_occupancy: Number,
    total_bedrooms: Number,
    total_bathrooms: Number,
    summary: String,

    addressExactAddress: String,
    addressStreet: String,
    addressCity: String,
    addressRegion: String,
    addressCountry: String,
    addressPostalCode: String,
    addressNearestLandmark: String,

    has_tv: Boolean,
    has_kitchen: Boolean,
    has_internet: Boolean,
    price: Number,
    owner_id: String,
    embeddedLink: String,
    images: []
});

const Room = mongoose.model("Room",roomSchema);
module.exports = Room;