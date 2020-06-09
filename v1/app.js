var express = require("express"),
    bodyParser = require("body-parser");


var app = express();



app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));

app.get("/",function(req,res) {
    res.send("Landing Page");
});

app.get("/register", function(req,res) {
    res.render("register");
});

app.post("/register",function(req,res) {
    res.redirect("/profile")
});

app.get("/profile", function(req,res) {
    res.render("profile");
});

app.post("/profile", function(req,res) {
    res.redirect("home")
});

app.get("/home", function(req,res) {
    res.render("home");
});

var port = process.env.PORT || 3000;
app.listen(port,function() {
        console.log("SetItUp server has started!");
});
