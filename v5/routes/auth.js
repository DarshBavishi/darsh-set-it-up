require("dotenv/config");
var express = require("express");
var router = express.Router();
var express = require("express");
var passport = require("passport");
var User = require("../models/user");
const client = require("twilio")(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
var multer = require('multer');


//CLOUDINARY REQUIREMENTS

var storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({
    dest: "uploads/",
    storage: storage,
    fileFilter: imageFilter
});

var cloudinary = require('cloudinary');
const {
    update
} = require("../models/user");
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

// --------------------------------------------------------

//ROUTES

// --------------------------------------------------------

//HANDLING PROFILE REGISTRATION PAGE

router.post("/register", upload.single('image'), function (req, res) {
    cloudinary.v2.uploader.upload(req.file.path, function (err, result) {
        if (err) {
            req.flash("error", err.message);
        } else {
            //CHECKING VERIFICATION CODE
            client
                .verify
                .services("VA78c8b5d52196f3017aaad54bb3b16112")
                .verificationChecks
                .create({
                    to: "+91" + req.body.phNumber,
                    code: req.body.code
                })
                .then((data) => {
                    if (data.status === "pending") {
                        res.redirect("back");
                    }
                })
            //CHECKING IF TWO PASSWORDS ENTERED ARE SAME
            if (req.body.password !== req.body.retypedpassword) {
                req.flash("error", "Passwords do not match.Please try again");
                return res.redirect("back");
            }
                //AGE 
                console.log(req.body);
                if (req.body.age >= 15 && req.body.age <= 18) {
                    userAgeGroup= "15-18";
                }
                else if (req.body.age >= 19 && req.body.age <= 21) {
                    userAgeGroup = "19-21";
                }
                else if (req.body.age >= 22 && req.body.age <= 26) {
                    userAgeGroup = "22-26";
                } 
                else if (req.body.age >= 27 && req.body.age <= 30) {
                    userAgeGroup = "27-30";
                }
                else if (req.body.age >= 31 && req.body.age <= 50) {
                    userAgeGroup = "31-50";
                }
                else {
                    userAgeGroup = "Above 50";
                } 
                var newUser = new User({
                    username: req.body.username,
                    email: req.body.email,
                    image: result.secure_url,
                    imageId: result.public_id,
                    phNumber: req.body.phNumber,
                    age: req.body.age,
                    userAgeGroup: userAgeGroup,
                    date: req.body.date
                });
            User.register(newUser, req.body.password, function (err, user) {
                if (err) {
                    console.log(err);
                    return res.redirect("/register");
                } else {
                    passport.authenticate("local")(req, res, function () {
                        // req.flash("success", "Welcome to YelpCamp " + user.username + " !");
                        res.redirect("/profile/" + user._id);
                    });
                }
            });
        }
    })
});

//LOGIN ROUTE

router.get("/login", function (req, res) {
    res.render("login");
});

router.post('/login', function (req, res, next) {
    passport.authenticate('local', {
        failureFlash: true
    }, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash("error", "Password or Username does not match");
            return res.redirect('/login');
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            req.flash("error", `Welcome back ${user.username}`);
            // return res.redirect('/home/' + user._id);
            // req.flash("success", "Logged you in!")
            return res.send("Logged in");
        });
    })(req, res, next);
});

//LOGOUT ROUTE

router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/login");
});


module.exports = router;