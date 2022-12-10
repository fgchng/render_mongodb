// --DEPENDENCIES--
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

// --MIDDLEWARES--
app.set('view engine', 'ejs');
app.set('', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + 'public/css')));


var isLoggedIn = false;
var sessionId = 0;

// --HOME PAGE--
app.get('/', function(req, res) {
    console.log("ROUTE: /index");
    res.render('index', {isSession: isLoggedIn, id: sessionId});
    console.log('GO TO : Home Page');
});

// --USER-- (login/signup/logout/review/reservation )
const userController = require('./controller/account');
app.get('/signup', userController.signup);
app.post('/signup_submit', userController.signup_submit);
app.get('/login', userController.login);
app.post('/login_submit', userController.login_submit);
app.get('/properties', userController.properties);
app.get('/logout', userController.logout);
app.get('/submit-review/:id', userController.review);
app.get('/reservation/:id', userController.reservation);

// --LISTING-- (add/delete/upload/edit)
const listingController = require('./controller/listing_cont');
app.get('/addListing', listingController.addListing);
app.post('/listingPage/:id', listingController.listingPage);
app.get('/deleteListing/:id', listingController.deleteListing);
app.get('/uploadListing', listingController.uploadListing);
app.get('/editListing', listingController.editListing);
app.get('/editListing/:id', listingController.editListingID);
app.use('/listing-registration', listingController.listing_registration);

// --MONGGODB CONNECTION--
const db = require('./controller/db');
app.use('/', db);



// --LOCAL HOST CONECTION--
app.listen(3000, function() {
    console.log("Listening on port 3000");
});

