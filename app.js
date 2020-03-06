const port = 8080;
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStategy = require('passport-local');
var methodOverride = require('method-override');
var Campground = require('./models/campground');
var Comment = require('./models/comment');
var User = require('./models/user');

var seedDB = require('./seeds');

var commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    authRoutes = require('./routes/auth');


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
app.use(methodOverride("_method"));
//seedDB();

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

app.use(authRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(port, function () {
    console.log("YelpCAmp server has started");
});
