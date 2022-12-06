// Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require('multer');
const mongoose = require("mongoose");
const { request } = require("http");
const bcrypt = require('bcrypt');
const { application, response } = require("express");
const { error } = require("console");
const saltRounds = 10;

const app = express();

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

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
 
app.use("/uploads", express.static(__dirname + "/uploads"));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/PareHome");

const Schema = mongoose.Schema;

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

// Room Schema
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
    description: String,

    addressExactAddress: String,
    addressStreet: String,
    addressCity: String,
    addressRegion: String,
    addressCountry: String,
    addressPostalCode: String,
    addressNearestLandmark: String,

    has_tv: Boolean,
    has_kitchen: Boolean,
    has_ac: Boolean,
    has_internet: Boolean,
    price: Number,
    owner_id: String,
    latitude: Number,
    longitude: Number,
    embeddedLink: String,
    images: []
});

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

const User = mongoose.model("user", userSchema);
const Room = mongoose.model("room", roomSchema);
const Reservation = mongoose.model("reservation", reservationSchema);
const Review = mongoose.model("review", reviewSchema);

// Status
var isLoggedIn = false;
var sessionId = 0;

// Home Page
app.get('/', function(req, res) {
    console.log("ROUTE: /index");
    res.render('index', {isSession: isLoggedIn, id: sessionId});
    console.log('GO TO : Home Page');
});

// Login Page
app.get('/login', function(req, res) {
    console.log("ROUTE: /login");
    res.render('login', {isSession: isLoggedIn, id: sessionId, isCorrectCredentials: true});
    console.log('GO TO : Log In Page');
});

// Sign Up Page
app.get('/signup', function(req, res) {
    console.log("ROUTE: /signup");
    res.render('signup', {isSession: false, id: sessionId});
    console.log('GO TO : Sign-Up Page');
});

// Properties Page
app.get('/properties', function(req, res){
    console.log("ROUTE: /properties");
    console.log('GO TO : Properties Page');

    Room.find({}, function(err,result){
        if(result.length === 0) {
            res.render("properties", {isSession: isLoggedIn, id: sessionId, properties: []});
            console.log("No Existing Properties");
        } else { 
            res.render("properties", {isSession: isLoggedIn, id: sessionId, properties: result});
            console.log("There are existing properties");
            console.log("Result length: " + result.length);
        }
    });
});

// Listing Regristrations Page
app.get('/listing-registration', function(req, res) {
    console.log("ROUTE: /listing-registration");
    res.render('listingRegistration', {isSession: true, id: sessionId});
    console.log('GO TO : Listing Registration Page');
});

// Submit Sign Up
app.post('/signup_submit', upload.array('profilePicture'), (req, res) => {
    console.log("ROUTE: /signup_submit");
    
    // upload.array('bannerPicture');
    bcrypt.hash(req.body.password, saltRounds).then(function(hash) {
        const user = new User({
            firstName: (req.body.firstName).toLowerCase(),
            lastName: (req.body.lastName).toLowerCase(),
            phone_number: req.body.phone_number,
            email: (req.body.email).toLowerCase(),
            description: (req.body.description),
            user_name: (req.body.username).toLowerCase(),
            password: hash,
            addressFull: (req.body.addressFull),
            addressStreet: (req.body.addressStreet),
            addressCity: (req.body.addressCity),
            addressRegion: (req.body.addressRegion),
            addressCountry: (req.body.addressCountry),
            profilePicture: "uploads/"+imagePath[0],
            // bannerPicture: "uploads/"+imagePath[1],
        });
    
        user.save(function(err) {
            if (err) {
                console.log(err);
                console.log("Sign Up Failed");
            } else {
                res.render('index', {isSession: isLoggedIn, id: sessionId});
                console.log("Sign Up Success");
                console.table(imagePath);
                imagePath = [];
            }
        });
    });
});

// Submit Login
app.post('/login-submit', (req, res) => {
    console.log("ROUTE: /login-submit");
    let username = (req.body.username).toLowerCase();
    let typedPassword = req.body.password;

    User.find({user_name: username}, function(err, result) {
        if(result.length === 0) {
            res.render("login", {isCorrectCredentials: false, isSession: false});
            console.log("Username or Password is incorrect");
        } else {
            const currentPassword = result[0].password;
            if(bcrypt.compareSync(typedPassword, currentPassword)) {
                isLoggedIn = true;
                sessionId =  result[0]._id.toString();
                console.log("Type of sessionId: "+typeof(sessionId));
                console.log("sessionId: " + sessionId);
                console.log("Login: SUCCESS");
                res.render("index", {isSession: isLoggedIn, id: sessionId});
            } else {
                console.log("Login: FAILED");
                res.render("login", {isCorrectCredentials: false, isSession: false});
            }
        }
    });
});

// Profile Page
app.get("/profile/:id", function(req, res) {
    console.log("ROUTE: /profile/:id");
    const userId = req.params.id;
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

            Room.find({owner_id: sessionId}, function(err, rooms){
                if(err) {
                    console.log(err);
                } else {
                    res.render("profile", { isSession: true, id: sessionId, user: result[0], properties: rooms});
                }
            });
        }
    });
});

app.get("/reservation/:id", function(req, res) {
    console.log("ROUTE: /reservation/:id");
    const userId = req.params.id;
    Reservation.find({user_id: userId}, function(err, result) {
        if(err) {
            console.log(err);
        } else {
            console.log("GO TO: Reservation Page");
            console.log("sessionId: "+ userId);

            res.render("reservation", { isSession: true, id: sessionId, reservations: result});
        }
    });
});

// Listing Registration Page
app.get("/addListing", function(req,res) {
    console.log("ROUTE: /addListing");
    res.render("listingRegistration", {isSession: true, id: sessionId });
});

app.get("/listingPage/:id", function(req,res) {
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

app.get("/deleteListing/:id", function(req, response) {
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

app.post("/uploadListing", upload.array('images'), function (req, response) {
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

    room.save(function(err) {
        imagePath = [];
        console.log("Length of imagePath: " + imagePath.length);
        if (err) throw err;
        response.redirect("/profile/"+sessionId);
        console.log("Listing Registration Success");
    });
});

app.post("/editListing", upload.array('images'), function (req, response) {
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

app.get("/editListing/:id", function(req, res){
    Room.find({_id: new Object(req.params.id)}, function(err,result){
        if (err) throw err;
        res.render("editListing", {isSession: true, id: sessionId, listing: result[0] });
    });
});

app.post("/submit-review/:id", function(req, res){
    var room_ids = req.params.id;

    User.find({_id: new Object(sessionId)}, function(err, user){
        var review = new Review({
            room_id: room_ids,
            user_id: sessionId,
            comment: req.body.review,
            
            firstName: user[0].firstName,
            lastName: user[0].lastName,
            profilePicture: user[0].profilePicture,
            username: user[0].user_name,
        });

        review.save(function(err) {
            if (err) throw err;
            res.redirect("/listingPage/"+room_ids);
        });
    });
});

// Logout
app.get("/logout", function(req, res) {
    console.log("ROUTE: /logout");
    isLoggedIn = false;
    sessionId = 0;
    res.render('index', { isSession: false });
    console.log("Logout: SUCCESS");
});

// Listening Port
app.listen(3000, function() {
     console.log("Listening on port 3000");
 });

