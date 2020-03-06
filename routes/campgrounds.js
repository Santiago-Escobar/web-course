var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
// ======================================
// CAMPGROUNDS ROUTES
// ======================================

//INDEX
router.get("/campgrounds", function (req, res) {
    //res.render("campgrounds", { campgrounds: campgrounds });
    console.log(req.user);
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
router.post("/campgrounds", isLoggedIn, function (req, res) {
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
router.get("/campgrounds/new", isLoggedIn, function (req, res) {
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


// UPDATE


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

module.exports = router;