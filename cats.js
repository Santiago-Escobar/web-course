var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/cat_app",{
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
}).then(() => {
	console.log('Connected');
}).catch(err => {
	console.log('DB connection error: ', err.message)
});

var catSchema = new mongoose.Schema({
    name: String,
    age: Number,
    temperament: String
});

var Cat = mongoose.model("Cat", catSchema);

// CREATE
Cat.create({
    name: "dali",
    age: 19,
    temperament: "Bland"
},function(err, cat){
    if(err){
        console.log("something went wrong!");
    }else{
        console.log("Cat Saved!");
        console.log(cat);
    }
});

// RETRIEVE

Cat.find({},function(err,cats){
    if(err){
        console.log("Something went wrong!")
        console.log(err);
    }else{
        console.log("ALL THE CATS");
        console.log(cats);
    }
})