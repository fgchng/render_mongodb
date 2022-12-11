// Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require('multer');
const mongoose = require("mongoose");
const { request } = require("http");
const { application, response } = require("express");
const { error } = require("console");
const session = require("express-session");
require('dotenv').config();
const userController = require('./controller/users');
const generalController = require('./controller/general');
const reviewController = require('./controller/reviews');
const roomController = require('./controller/rooms');
const { goto_addListing, listing_page, delete_listing, upload_listing } = require("./controller/rooms");

const app = express();

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
    session({
      secret: "Parehome Secret",
      resave: false,
      saveUninitialized: false,
    })
  );


global.imagePath = []; 
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
const mongoDBUrl = "mongodb+srv://admin1:ADMINparehome@cluster0.63wh007.mongodb.net/PareHome";
mongoose.connect(mongoDBUrl, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log(`Connected to database`);
})
.catch((err) => {
    console.log(`Error connecting to database: ${err}`);
});


// Status

// Home Page
app.get('/', generalController.homepage);

// Login Page
app.get('/login', generalController.login_page);

// Sign Up Page
app.get('/signup', generalController.signup_page);

// Properties Page
app.get('/properties', roomController.goto_properties);

// Listing Regristrations Page
app.get('/listing-registration', roomController.listing_registration);

// Submit Sign Up
app.post('/signup_submit', upload.array('profilePicture'), userController.submit_signup);

// Submit Login
app.post('/login-submit', userController.submit_login);

// Profile Page
app.get("/profile/:id", userController.profile_page);

// Listing Registration Page
app.get("/addListing", roomController.goto_addListing);

app.get("/listingPage/:id", roomController.listing_page);

app.get("/deleteListing/:id", roomController.delete_listing);

app.post("/uploadListing", upload.array('images'), roomController.upload_listing);

app.post("/editListing", upload.array('images'), roomController.edit_listing);

app.get("/editListing/:id", roomController.goto_editListing);

app.post("/submit-review/:id", reviewController.submit_review);

// Logout
app.get("/logout", generalController.logout);

// Listening Port
app.listen(3000, function() {
     console.log("Listening on port 3000");
 });

