const express = require("express");
const Room  = require("../model/room");
const Review = require("../model/review");
const User = require('../model/users');
const multer  = require('multer');

const app = express();


var isLoggedIn = false;
var sessionId = 0;

var imagePath = []; 
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },

    filename: function(req, file, cb) {
        req.imageName = new Date().toISOString().replace(/:/g, '-') + file.originalname;
        imagePath.push(req.imageName);
        console.log("Image Uploaded", req.imageName);
        cb(null, req.imageName);
    }
});

var upload = multer({ storage: storage });
app.get("/uploads", express.static(__dirname + "/uploads"));



// Listing Registration Page
const listing_registration = ('/listing-registration', function(req, res) {
    console.log("ROUTE: /listing-registration");
    res.render('listingRegistration', {isSession: true, id: sessionId});
    console.log('GO TO : Listing Registration Page');
});


const addListing = ("/addListing", function(req,res) {
    console.log("ROUTE: /addListing");
    res.render("listingRegistration", {isSession: true, id: sessionId });
});

const listingPage = ("/listingPage/:id", function(req,res) {
    var listingId = req.params.id;
    console.log("GO TO: Listing Page with ID :"+ listingId);

    Room.find({_id: new Object(listingId)}, function(err, result) {
        User.find({_id: new Object(result[0].owner_id)},  function(err, users) {
            Review.find({room_id: new Object(listingId)}, function(err,reviews){
                if (err) throw err;
                    res.render("listing", {id: sessionId, isSession: isLoggedIn, property: result[0], user:users[0],
                                review: reviews});
            });
        });
    });
});

const deleteListing = ("/deleteListing/:id", function(req, response) {
    var id = req.params.id;
    Room.remove({_id: new Object(id)}, function(err, res) {
        if (err) throw err;
        // res.redirect("profile/:id");
        // response.render('index', {isSession: isLoggedIn, id: sessionId});
        User.find({_id: new Object(sessionId) }, function(err, result) {
            if(err) {
                console.log(err);
            } else {
                console.log("GO TO: Profile Page");
                console.log("sessionId: " + sessionId);
                console.log("firstName: "+result[0].firstName);
                console.log("lastName: "+result[0].lastName);
                console.log("user_name: "+result[0].user_name);
                console.log("password: "+result[0].password);
                console.log("email: "+result[0].email);
                console.log("phone_number: "+result[0].phone_number);
                console.log("description: "+result[0].description);
                // console.table(result);
    
                Room.find({owner_id: result[0]._id.toString()}, function(err, rooms){
                    if(err) {
                        console.log(err);
                    } else {
                        response.render("profile", { isSession: true, id: sessionId, user: result[0], properties: rooms});
                    }
                });
            }
        });
    });
});

const uploadListing = ("/uploadListing", upload.array('images'), function (req, response) {
    for(var i = 0; i < imagePath.length; i++) {
        imagePath[i] = "uploads/" + imagePath[i];
        console.log(imagePath[i]);
    }
    console.log("ROUTE: /uploadListing");
    const room = new Room({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        emailAddress: req.body.emailAddress,

        name: req.body.name,
        room_id: req.body.id,
        home_type: req.body.home_type,
        room_type: req.body.room_type,
        total_occupancy: req.body.total_occupancy,
        total_bedrooms: req.body.total_bedrooms,
        total_bathrooms: req.body.total_bathrooms,
        summary: req.body.summary,

        addressExactAddress: req.body.addressExactAddress,
        addressStreet: req.body.addressStreet,
        addressCity: req.body.addressCity,
        addressRegion: req.body.addressRegion,
        addressCountry: req.body.addressCountry,
        addressPostalCode: req.body.addressPostalCode,
        addressNearestLandmark: req.body.addressNearestLandmark,

        has_tv: req.body.has_tv,
        has_kitchen: req.body.has_kitchen,
        has_internet: req.body.has_internet,
        price: req.body.price,
        owner_id: sessionId,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        embeddedLink: req.body.embeddedLink,

        images: imagePath,
    });

    Room.save(function(err) {
        imagePath = [];
        console.log("Length of imagePath: " + imagePath.length);
        if (err) throw err;
        response.redirect("/profile/"+sessionId);
        console.log("Listing Registration Success");
    });
});

const editListing = ("../editListing", upload.array('images'), function (req, response) {
    var listingIds = req.body.listingId;
    for(var i = 0; i < imagePath.length; i++) {
        imagePath[i] = "uploads/" + imagePath[i];
        console.log(imagePath[i]);
    }
    console.log("Listing ID: "+listingIds);

    Room.findOneAndUpdate({_id: new Object(listingIds)},{
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        emailAddress: req.body.emailAddress,

        name: req.body.name,
        room_id: req.body.id,
        home_type: req.body.home_type,
        room_type: req.body.room_type,
        total_occupancy: req.body.total_occupancy,
        total_bedrooms: req.body.total_bedrooms,
        total_bathrooms: req.body.total_bathrooms,
        summary: req.body.summary,

        addressExactAddress: req.body.addressExactAddress,
        addressStreet: req.body.addressStreet,
        addressCity: req.body.addressCity,
        addressRegion: req.body.addressRegion,
        addressCountry: req.body.addressCountry,
        addressPostalCode: req.body.addressPostalCode,
        addressNearestLandmark: req.body.addressNearestLandmark,

        has_tv: req.body.has_tv,
        has_kitchen: req.body.has_kitchen,
        has_internet: req.body.has_internet,
        price: req.body.price,
        owner_id: sessionId,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        embeddedLink: req.body.embeddedLink,

        images: imagePath,
    });
    imagePath = [];
    response.redirect("/profile/"+sessionId);
});

const editListingID = ("/editListing/:id", function(req, res){
    Room.find({_id: new Object(req.params.id)}, function(err,result){
        if (err) throw err;
        res.render("editListing", {isSession: true, id: sessionId, listing: result[0] });
    });
});

module.exports = {
    editListing,
    editListingID,
    deleteListing,
    addListing,
    listingPage,
    uploadListing,
    listing_registration
}

