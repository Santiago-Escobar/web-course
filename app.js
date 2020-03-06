var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
const port = 8080;
var Campground = require('./models/campground')
var Comment = require('./models/comment')
var seedDB = require('./seeds');

seedDB();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname+ "/public"));

mongoose.connect("mongodb://localhost/yelp_camp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected');
}).catch(err => {
    console.log('DB connection error: ', err.message)
});

//ROOT
app.get("/", function (req, res) {
    res.render("landing");
});

//INDEX
app.get("/campgrounds", function (req, res) {
    //res.render("campgrounds", { campgrounds: campgrounds });
    //Get all form db
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds });
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
app.get('/campgrounds/:id/comments/new', function (req, res) {
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
app.post('/campgrounds/:id/comments', function (req, res) {
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
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });


})



app.listen(port, function () {
    console.log("YelpCAmp server has started");
});
