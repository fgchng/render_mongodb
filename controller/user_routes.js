const express = require("express");
const router = express.Router();
const Room = require("../model/room");
const path = require("path");

// Status
var isLoggedIn = false;
var sessionId = 0;

const User = require("../model/users")

// Home Page
app.get('/', function(req, res) {
    res.render('index', {isSession: isLoggedIn, id: sessionId});
    console.log('GO TO : Home Page');
});

// Login Page
app.get('/login', function(req, res) {
    res.render('login', {isSession: isLoggedIn, id: sessionId});
    console.log('GO TO : Log In Page');
});

// Sign Up Page
app.get('/signup', function(req, res) {
    res.render('signup', {isSession: false, id: sessionId});
    console.log('GO TO : Sign-Up Page');
});

// Properties Page
app.get('/properties', function(req, res){
    // res.redirect(__dirname + '/views/properties.html');
    res.render('properties', {isSession: isLoggedIn, id: sessionId});
    console.log('GO TO : Properties Page');
});

// Submit Sign Up
app.post('/signup_submit', (req, res) => {
    bcrypt.hash(req.body.password, saltRounds).then(function(hash) {
        const user = new User({
            firstName: (req.body.firstName).toLowerCase(),
            lastName: (req.body.lastName).toLowerCase(),
            phone_number: req.body.phone_number,
            email: (req.body.email).toLowerCase(),
            user_name: (req.body.username).toLowerCase(),
            password: hash,
        });
    
        user.save(function(err) {
            if (err) {
                console.log(err);
                console.log("Sign Up Failed");
            } else {
                res.redirect("/login");
                console.log("Sign Up Success");
            }
        });
    });
});

// Submit Login
app.post('/login-submit', (req, res) => {
    let username = (req.body.username).toLowerCase();
    let typedPassword = req.body.password;

    // bcrypt.hash(typedPassword, saltRounds).then(function(hash) {
        User.find({user_name: username}, function(err, result) {
            if(result === null) {
                res.redirect("/login");
                // res.render("login", {isCorrectCredentials: false});
                console.log("Username or Password is incorrect");
            } else if (err) {
                console.log(err);
            } else {
                const currentPassword = result[0].password;
                if(bcrypt.compareSync(typedPassword, currentPassword)) {
                    isLoggedIn = true;
                    sessionId =  result[0]._id.toString();
                    console.log("Type of sessionId: "+typeof(sessionId));
                    console.log("sessionId: " + sessionId);
                    console.log("Login: SUCCESS");
                    res.redirect("/");
                } else {
                    console.log("Login: FAILED");
                    res.redirect("/login");
                }
                // isLoggedIn = true;
                // sessionId =  result[0]._id.toString();
                // console.log("Type of sessionId: "+typeof(sessionId));
                // console.log("sessionId: " + sessionId);
                // console.log("Login: SUCCESS");
                // res.render("login", {isCorrectCredentials: true});
                // res.redirect("/");
            }
        });
    // });
});

app.get("/profile/:id", function(req, res) {
    const userId = req.params.id;
    User.find({_id: userId}, function(err, result) {
        if(err) {
            console.log(err);
        } else {
            console.log("GO TO: Profile Page");
            console.log("sessionId: " + userId);
            // console.log("firstName: "+result[0].firstName);
            // console.log("lastName: "+result[0].lastName);
            // console.log("user_name: "+result[0].user_name);
            // console.log("password: "+result[0].password);
            // console.log("email: "+result[0].email);
            // console.log("phone_number: "+result[0].phone_number);
            res.render("profile", { isSession: true, id: sessionId, user: result[0] });
        }
    });
});

// app.get("/profile/:id", function(req, res) {
//     const userId = req.params.id;
//     Reservation.find({_id: userId}, function(err, result) {
//         if(err) {
//             console.log(err);
//         } else {
//             console.log("GO TO: Profile Page");
//             console.log("sessionId: " + userId);
//             res.render("profile", { isSession: true, id: sessionId, user: result[0] });
//         }
//     });
// });

// Logout
app.get("/logout", function(req, res) {
    isLoggedIn = false;
    sessionId = 0;
    res.redirect("/");
});