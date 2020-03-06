var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var Comment = require('../models/comment');
// ======================================
// COMMENTS ROUTES
// ======================================
// NEW
router.get('/campgrounds/:id/comments/new', isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("comments/new", { campground: campground });
        }
    });
});

// CREATE
router.post('/campgrounds/:id/comments', isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            redirect("/campgrounds");
        } else {
            var newComment = req.body.comment;
            // Create a new comment
            Comment.create(newComment, function (err, createdComment) {
                if (err) {
                    console.log(err);
                } else {
                    createdComment.author.id = req.user._id;
                    createdComment.author.username = req.user.username;
                    createdComment.save();
                    campground.comments.push(createdComment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });


});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

module.exports = router;