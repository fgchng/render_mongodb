const express = require("express");
const router = express.Router();
const Room = require("../model/room");
const path = require("path");

// Properties Page
app.get('/properties', function(req, res){
     // res.redirect(__dirname + '/views/properties.html');
     res.render('properties', {isSession: isLoggedIn, id: sessionId});
     console.log('GO TO : Properties Page');
 });

 module.exports = router;