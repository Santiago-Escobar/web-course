var express = require('express');
var app = express();
var bodyParser = require("body-parser");

const port = 8080;
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

var campgrounds = [
    { name: "salmon", image: "https://www.reserveamerica.com/webphotos/racms/articles/images/26d3f677-5e65-44d1-bda9-807555a00d90_image2_Little-Pine-SP.jpg" },
    { name: "grass", image: "https://www.reserveamerica.com/webphotos/racms/articles/images/26d3f677-5e65-44d1-bda9-807555a00d90_image2_RickettsGlenn-SP.jpg" },
    { name: "mountain", image: "https://www.reserveamerica.com/webphotos/racms/articles/images/26d3f677-5e65-44d1-bda9-807555a00d90_image2_Pymatuning-SP.jpg" },
    { name: "salmon", image: "https://www.reserveamerica.com/webphotos/racms/articles/images/26d3f677-5e65-44d1-bda9-807555a00d90_image2_Little-Pine-SP.jpg" },
    { name: "grass", image: "https://www.reserveamerica.com/webphotos/racms/articles/images/26d3f677-5e65-44d1-bda9-807555a00d90_image2_RickettsGlenn-SP.jpg" },
    { name: "mountain", image: "https://www.reserveamerica.com/webphotos/racms/articles/images/26d3f677-5e65-44d1-bda9-807555a00d90_image2_Pymatuning-SP.jpg" },
    { name: "salmon", image: "https://www.reserveamerica.com/webphotos/racms/articles/images/26d3f677-5e65-44d1-bda9-807555a00d90_image2_Little-Pine-SP.jpg" },
    { name: "grass", image: "https://www.reserveamerica.com/webphotos/racms/articles/images/26d3f677-5e65-44d1-bda9-807555a00d90_image2_RickettsGlenn-SP.jpg" },
    { name: "mountain", image: "https://www.reserveamerica.com/webphotos/racms/articles/images/26d3f677-5e65-44d1-bda9-807555a00d90_image2_Pymatuning-SP.jpg" },
    { name: "salmon", image: "https://www.reserveamerica.com/webphotos/racms/articles/images/26d3f677-5e65-44d1-bda9-807555a00d90_image2_Little-Pine-SP.jpg" },
    { name: "grass", image: "https://www.reserveamerica.com/webphotos/racms/articles/images/26d3f677-5e65-44d1-bda9-807555a00d90_image2_RickettsGlenn-SP.jpg" },
    { name: "mountain", image: "https://www.reserveamerica.com/webphotos/racms/articles/images/26d3f677-5e65-44d1-bda9-807555a00d90_image2_Pymatuning-SP.jpg" }
];

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function (req, res) {
    res.render("campgrounds", { campgrounds: campgrounds });
});

app.post("/campgrounds", function (req, res) {
    var name =  req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);

    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function (req, res) {
    res.render("new");
});

app.listen(port, function () {
    console.log("YelpCAmp server has started");
});