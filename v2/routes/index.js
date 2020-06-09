  
var express = require("express");
var router = express.Router();

router.get("/", function(req, res) {
    res.render("login.ejs");
});

//LOGIN ROUTE

router.get("/login", function(req, res) {
    res.render("login.ejs");
});