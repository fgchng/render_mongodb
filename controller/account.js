const User = require('../model/users');
const Reservation = require('../model/review');
const Room = require('../model/room.js');
const multer = require('multer');
const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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


//signup
  const signup = ('/signup', (req, res) => {
    console.log("ROUTE: /signup");
    res.render('signup', {isSession: isLoggedIn, id: sessionId});
    console.log('GO TO : Sign-Up Page');
});

// Submit Sign Up
const signup_submit = ('/signup-submit', upload.array('profilePicture'), (req, res) => {
    console.log("ROUTE: /signup_submit");
    
    // upload.array('bannerPicture');
    bcrypt.hash(req.body.password, saltRounds).then(function(hash) {
        var user = new User({
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
    
        User.save(function(err) {
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




//login
const login = ('/login', (req, res) => {
    console.log("ROUTE: /login");
    res.render("login", {isSession: isLoggedIn, id: sessionId, isCorrectCredentials: true});
    console.log('GO TO : Log In Page');

});

// Submit Login
const login_submit = ('/login-submit', (req, res) => {
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


// Logout
const logout = ("/logout", function(req, res) {
    console.log("ROUTE: /logout");
    isLoggedIn = false;
    sessionId = 0;
    res.redirect('index', { isSession: isLoggedIn });
    console.log("Logout: SUCCESS");

    
});

// Properties Page
const properties = ('/properties', function(req, res){
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
const review = ("/submit-review/:id", function(req, res){
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

const reservation = ("/reservation/:id", function(req, res) {
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

module.exports = {
    signup, signup_submit, login, login_submit, logout, properties, review, reservation
};
