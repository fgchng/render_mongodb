const User = require('../model/users');
const Room = require('../model/rooms');
const Review = require('../model/reviews');


// Properties Page

const goto_properties = (req, res) => {
    console.log("ROUTE: /properties");
    console.log('GO TO : Properties Page');
    console.log("sessionId: " + req.session.userid);
    console.log('isLogedIn: ' + req.session.login);

    Room.find({}, function(err,result){
        if(result.length === 0) {
            res.render("properties", {isSession: req.session.login, id: req.session.userid, properties: []});
            console.log("No Existing Properties");
        } else { 
            res.render("properties", {isSession: req.session.login, id: req.session.userid, properties: result});
            console.log("There are existing properties");
            console.log("Result length: " + result.length);
        }
    });
};

// Listing Regristrations Page
const listing_registration = (req, res) =>{
    console.log("ROUTE: /listing-registration");
    res.render('listingRegistration', {isSession: req.session.login, id: req.session.userid});
    console.log('GO TO : Listing Registration Page');
};


// Listing Registration Page
const goto_addListing = (req,res) => {
    console.log("ROUTE: /addListing");
    res.render("listingRegistration", {isSession: req.session.login, id: req.session.userid });
};

const listing_page = (req,res) => {
    var listingId = req.params.id;
    console.log("GO TO: Listing Page with ID :"+ listingId);

    Room.find({_id: new Object(listingId)}, function(err, result) {
        User.find({_id: new Object(result[0].owner_id)},  function(err, users) {
            Review.find({room_id: new Object(listingId)}, function(err,reviews){
                if (err) throw err;
                    res.render("listing", {id: req.session.userid, isSession: req.session.login, property: result[0], user:users[0],
                                review: reviews});
            });
        });
    });
};

const delete_listing = (req, response) => {
    var id = req.params.id;
    Room.remove({_id: new Object(id)}, function(err, res) {
        if (err) throw err;
        // res.redirect("profile/:id");
        // response.render('index', {isSession: isLoggedIn, id: sessionId});
        User.find({_id: new Object(req.session.userid) }, function(err, result) {
            if(err) {
                console.log(err);
            } else {
                console.log("GO TO: Profile Page");
                console.log("sessionId: " + req.session.userid);
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
                        response.render("profile", { isSession: req.session.login, id: req.session.userid, user: result[0], properties: rooms});
                    }
                });
            }
        });
    });
};

const upload_listing = (req, response) => {
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
        owner_id: req.session.userid,
        embeddedLink: req.body.embeddedLink,

        images: imagePath,
    });

    room.save(function(err) {
        imagePath = [];
        console.log("Length of imagePath: " + imagePath.length);
        if (err) throw err;
        response.redirect("/profile/"+req.session.userid);
        console.log("Listing Registration Success");
    });
};

const edit_listing = (req, response) => {
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
        owner_id: req.session.userid,
        embeddedLink: req.body.embeddedLink,

        images: imagePath,
    });
    imagePath = [];
    response.redirect("/profile/"+req.session.userid);
};

const goto_editListing = (req, res) => {
    Room.find({_id: new Object(req.params.id)}, function(err,result){
        if (err) throw err;
        res.render("editListing", {isSession: req.session.login, id: req.session.userid, listing: result[0] });
    });
};

module.exports = {
    goto_addListing,
    goto_editListing,
    goto_properties,
    listing_registration,
    listing_page,
    edit_listing,
    delete_listing,
    upload_listing
   }
