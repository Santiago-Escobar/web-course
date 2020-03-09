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

// EDIT 
router.get("/campgrounds/:id/comments/:comment_id/edit", checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, comment){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.render("comments/edit", {campground_id: req.params.id, comment: comment});
        }
    });
    
});

// UPDATE
router.put("/campgrounds/:id/comments/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment ,function(err, comment){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    
});

// DESTROY
router.delete("/campgrounds/:id/comments/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("/campgrounds/" + req.params.id);
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}



function checkCommentOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                // does user own the comment
                // if(foundCampground.author.id === req.user._id) Won't work becaouse left side is a moggoose object and tight side is a string
                if (foundComment.author.id.equals(req.user._id)) {
                    next()
                } else {
                    res.redirect("back");
                }


            }
        });
    } else {
        res.redirect("back");
    }

}

module.exports = router;