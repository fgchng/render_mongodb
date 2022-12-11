const User = require('../model/users');
const Review = require('../model/reviews');


const submit_review = (req, res) => {
    var room_ids = req.params.id;

    User.find({_id: new Object(req.session.userid)}, function(err, user){
        var review = new Review({
            room_id: room_ids,
            user_id: req.session.userid,
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
};

module.exports = {
    submit_review
   }