const User = require('../model/users');
const Room = require('../model/rooms');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Submit Sign Up
const submit_signup = (req, res) => {
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
                res.render('index', {isSession: req.session.login, id: req.session.userid});
                console.log("Sign Up Success");
                console.table(imagePath);
                imagePath = [];
            }
        });
    });
};

// Submit Login
const submit_login = (req, res) => {
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
                req.session.login = true;
                req.session.userid =  result[0]._id.toString();
                console.log("Type of sessionId: "+typeof(req.session.userid));
                console.log("sessionId: " + req.session.userid);
                console.log("Login: SUCCESS");
                res.render("index", {isSession: req.session.login, id: req.session.userid});
            } else {
                console.log("Login: FAILED");
                res.render("login", {isCorrectCredentials: false, isSession: false});
            }
        }
    });
};

// Profile Page
const profile_page = (req, res) => {
    console.log("ROUTE: /profile/:id");
    const userId = req.params.id;
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

            Room.find({owner_id: req.session.userid}, function(err, rooms){
                if(err) {
                    console.log(err);
                } else {
                    res.render("profile", { isSession: true, id: req.session.userid, user: result[0], properties: rooms});
                }
            });
        }
    });
};

module.exports = {
   submit_signup,
   submit_login,
   profile_page
  }

