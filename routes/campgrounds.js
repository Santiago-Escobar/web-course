var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware');
// ======================================
// CAMPGROUNDS ROUTES
// ======================================

//INDEX
router.get("/campgrounds", function (req, res) {
    //res.render("campgrounds", { campgrounds: campgrounds });
    //console.log(req.user);
    //Get all form db
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds});
        }
    })
});

//CREATE
router.post("/campgrounds", middleware.isLoggedIn, function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = { 
        id: req.user._id,
        username: req.user.username
    };    
    var newCampground = { name: name, image: image, description: description , author: author};
    // Create a new one and save into db
    Campground.create(newCampground, function (err, createdCampground) {
        if (err) {
            console.log(err);
        } else {
            //console.log(createdCampground);
            res.redirect("/campgrounds");
        }
    });
});

//NEW
router.get("/campgrounds/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

//SHOW
router.get("/campgrounds/:id", function (req, res) {
    // find campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });

});
// EDIT
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
    
});

// UPDATE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership,  function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

// DESTROY
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;