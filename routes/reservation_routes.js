const express = require("express");
const router = express.Router();
const Room = require("../model/reservation");
const path = require("path");

app.get("/profile/:id", function(req, res) {
   const userId = req.params.id;
     Reservation.find({_id: userId}, function(err, result) {
             if(err) {
            console.log(err);
         } else {
             console.log("GO TO: Profile Page");
                  console.log("sessionId: " + userId);
                  res.render("profile", { isSession: true, id: sessionId, user: result[0] });
              }
          });
      });