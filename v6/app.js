require("dotenv/config");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var User = require("./models/user");
var flash = require("connect-flash");


//REQURING ROUTES
var authRoutes = require("./routes/auth");
var exploreRoutes = require("./routes/explore");
var gettingStartedRoutes = require("./routes/getting-started");
var miscRoutes = require("./routes/misc");
var profileRoutes = require("./routes/profile");
var resetRoutes = require("./routes/reset");
var settingsRoutes = require("./routes/settings");
var homeRoutes = require("./routes/home");
var savedUsersRoutes = require("./routes/saved");
var likeRoutes = require("./routes/like");

mongoose.connect("mongodb://localhost:27017/test-n", {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');

//-------------------------------------------------------

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Monty is so single!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(authRoutes);
app.use(exploreRoutes)
app.use(gettingStartedRoutes);
app.use(miscRoutes);
app.use(profileRoutes);
app.use(resetRoutes);
app.use(settingsRoutes);
app.use(homeRoutes);
app.use(savedUsersRoutes);
app.use(likeRoutes);

app.listen(process.env.PORT, function() {
    console.log("SetItUp serving on PORT " + process.env.PORT);
});