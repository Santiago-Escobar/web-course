const port = 8080;
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStategy = require('passport-local');

var Campground = require('./models/campground');
var Comment = require('./models/comment');
var User = require('./models/user');

var seedDB = require('./seeds');


mongoose.connect("mongodb://localhost/yelp_camp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected');
}).catch(err => {
    console.log('DB connection error: ', err.message);
});
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

//PASSPORT Configutarions
app.use(require("express-session")({
    secret: "Santi Wins this time",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});




//ROOT
app.get("/", function (req, res) {
    res.render("landing");
});

//INDEX
app.get("/campgrounds", function (req, res) {
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
app.post("/campgrounds", function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = { name: name, image: image, description: description };
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
app.get("/campgrounds/new", function (req, res) {
    res.render("campgrounds/new");
});

//SHOW
app.get("/campgrounds/:id", function (req, res) {
    // find campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });

});
// ======================================
// COMMENTS ROUTES
// ======================================
// NEW
app.get('/campgrounds/:id/comments/new', isLoggedIn, function (req, res) {
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
app.post('/campgrounds/:id/comments', isLoggedIn, function (req, res) {
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
                    campground.comments.push(createdComment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });


})

// ======================================
// AUTH ROUTES
// ======================================

// SHOW REGISTER FORM
app.get("/register", function (req, res) {
    res.render("authentication/register")
});
// handle sign up logic
app.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("/authentication/register");
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/campgrounds");
            })
        }
    });
});


// SHOW LOGIN FORM
app.get("/login", function (req, res) {
    res.render("authentication/login")
});
// handle sign in logic
//app.post("/login",middleware, callback);
app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req, res) {  
});

// logic rout
app.get("/logout",function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

app.listen(port, function () {
    console.log("YelpCAmp server has started");
});
