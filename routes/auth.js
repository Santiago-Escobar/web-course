var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

//ROOT
router.get("/", function (req, res) {
    res.render("landing");
});


// ======================================
// AUTH ROUTES
// ======================================

// SHOW REGISTER FORM
router.get("/register", function (req, res) {
    res.render("authentication/register")
});
// handle sign up logic
router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.render("authentication/register");
        } else {
            req.flash("success", "Welcome to YelpCamp "+ user.username);
            passport.authenticate("local")(req, res, function () {
                res.redirect("/campgrounds");
            })
        }
    });
});


// SHOW LOGIN FORM
router.get("/login", function (req, res) {
    res.render("authentication/login")
});
// handle sign in logic
//router.post("/login",middleware, callback);
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req, res) {  
});

// logic rout
router.get("/logout",function(req, res){
    req.logout();
    req.flash("success", "Logged Out")
    res.redirect("/campgrounds");
});

module.exports = router;