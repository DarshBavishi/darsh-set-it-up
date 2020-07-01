require("dotenv/config");
var express = require("express");
var router = express.Router();
var express = require("express");
var passport = require("passport");
var User = require("../models/user");
const client = require("twilio")(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
var multer = require('multer');
const cities = require("all-countries-and-cities-json")
var indianCities = cities.India;


//CLOUDINARY REQUIREMENTS

var storage = multer.diskStorage({
    filename: function(req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});
var imageFilter = function(req, file, cb) {
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

router.get("/register", (req, res) => {
    console.log(req.query.age);
    console.log(req.query.phNumber);
    console.log(req.query.date);
    res.render("register", {
        age: req.query.age,
        date: req.query.date,
        phNumber: req.query.phNumber
    })
})


//HANDLING PROFILE REGISTRATION PAGE

router.post("/register", upload.single('image'), function (req, res) {
    cloudinary.v2.uploader.upload(req.file.path,async function(err, result) {
        if (err) {
            req.flash("error", err.message);
        } else {
            //CHECKING VERIFICATION CODE
            User.find({}, async (err, allUsers) => {
                if (err) {
                    console.log(err);
                    console.log("Inside If err")
                }
                for (var i = 0; i < allUsers.length; i++) {
                    console.log("inside for");
                    if (allUsers[i].username === req.body.username) {
                        console.log("inside if username duplicate");
                        req.flash("error", "Username already exists. Please sign up with a different Username");
                        return res.redirect(`/register?age=${req.body.age}&date=${req.body.date}&phNumber=${req.body.phNumber}`);
                    }
                    if (allUsers[i].email === req.body.email) {
                        console.log("inside if email duplicate");
                        req.flash("error", "Email Address is already in use.Please sign up with a different Email Address")
                        return res.redirect(`/register?age=${req.body.age}&date=${req.body.date}&phNumber=${req.body.phNumber}`);                    
                    }
                }  
            });
            await client
                .verify
                .services("VAf267f7d3f5ea60ee2f2329c58481b715")
                .verificationChecks
                .create({
                    to: "+91" + req.body.phNumber,
                    code: req.body.code
                })
                .then((data) => {
                    if (data.status === "pending") {
                        req.flash("error", "OTP does not match.Please try again.")
                        return res.redirect("back");
                    }
                });

            //CHECKING IF TWO PASSWORDS ENTERED ARE SAME

            if (req.body.password !== req.body.retypedpassword) {
                req.flash("error", "Passwords do not match.Please try again");
                return res.redirect("back");
            }

            //AGE 

            console.log(req.body);
            if (req.body.age >= 15 && req.body.age <= 18) {
                userAgeGroup = "15-18";
            } else if (req.body.age >= 19 && req.body.age <= 21) {
                userAgeGroup = "19-21";
            } else if (req.body.age >= 22 && req.body.age <= 26) {
                userAgeGroup = "22-26";
            } else if (req.body.age >= 27 && req.body.age <= 30) {
                userAgeGroup = "27-30";
            } else if (req.body.age >= 31 && req.body.age <= 50) {
                userAgeGroup = "31-50";
            } else {
                userAgeGroup = "Above 50";
            }
            console.log(req.body.date);
            var date = req.body.date;
            var newUser = {
                username: req.body.username,
                email: req.body.email,
                image: result.secure_url,
                imageId: result.public_id,
                phNumber: req.body.phNumber,
                age: req.body.age,
                userAgeGroup: userAgeGroup,
                date: date,
                password: req.body.password
            };
            res.render("profile", {
                user: newUser,
                cities: indianCities
            });
        }
    })
});

router.post("/profile", upload.array('images'), async function (req, res) {
    // User.findById(req.params.id, async function (err, updatedUser) {
    //     if (err) {
    //         console.log("inside if");
    //         req.flash("error", "You can upload a maximum of 5 images only.");
    //         return res.redirect("back");
    //     }
    //      else {
    //         //UPLOADING IMAGES ON CLOUDINARY
    //         req.body.user.images = [];
    //         for (const file of req.files) {
    //             var image = await cloudinary.v2.uploader.upload(file.path);
    //             req.body.user.images.push({
    //                 url: image.secure_url,
    //                 public_id: image.public_id
    //             })
    //         }
    //         if(req.body.user.relFinalAge <= req.body.user.relInitialAge ) {
    //             req.flash("error", "Please Enter a Final Age that is greater than the Initial Age in the Preferred Age Group category!");
    //             return res.redirect("back");
    //         }
    //         updatedUser.images = req.body.user.images;
    //         updatedUser.firstName = req.body.user.firstName;
    //         updatedUser.lastName = req.body.user.lastName;
    //         updatedUser.name = req.body.user.firstName + " " + req.body.user.lastName;
    //         updatedUser.city = req.body.user.city;
    //         updatedUser.gender = req.body.user.gender;
    //         updatedUser.nickname = req.body.user.nickname;
    //         updatedUser.bio = req.body.user.bio;
    //         updatedUser.maritalStatus = req.body.user.maritalStatus;
    //         updatedUser.relType = req.body.user.relType;
    //         updatedUser.relPreference = req.body.user.relPreference;
    //         updatedUser.relDistance = req.body.user.relDistance;
    //         updatedUser.relInitialAge = req.body.user.relInitialAge;
    //         updatedUser.relFinalAge = req.body.user.relFinalAge;
    //         updatedUser.relAgeGroup = req.body.user.relInitialAge + "-" + req.body.user.relFinalAge;
    //         updatedUser.liveIn = req.body.user.liveIn;
    //         updatedUser.currently = req.body.user.currently;
    //         updatedUser.virgin = req.body.user.virgin;
    //         updatedUser.cook = req.body.user.cook;
    //         updatedUser.income = req.body.user.income;
    //         updatedUser.languages = req.body.user.languages;
    //         updatedUser.fbLink = req.body.user.fbLink;
    //         updatedUser.igLink = req.body.user.igLink;
    //         updatedUser.twitterLink = req.body.user.twitterLink;
    //         // updatedUser.saveButtonValue = "SAVE";
    //         // updatedUser.saveFormActionValue = "saved"
    //         await updatedUser.save();
    //         res.render("home", {
    //             user: updatedUser,
    //         });
    //     }
    // });
    // UPLOADING IMAGES ON CLOUDINARY
    req.body.user.images = [];
    for (const file of req.files) {
        var image = await cloudinary.v2.uploader.upload(file.path);
        req.body.user.images.push({
            url: image.secure_url,
            public_id: image.public_id
        })
    }
    if(req.body.user.relFinalAge <= req.body.user.relInitialAge ) {
        req.flash("error", "Please Enter a Final Age that is greater than the Initial Age in the Preferred Age Group category!");
        return res.redirect("back");
    }
    var newUser = await new User({
        username: req.body.user.username,
        email: req.body.user.email,
        image: req.body.user.secure_url,
        imageId: req.body.user.public_id,
        phNumber: req.body.user.phNumber,
        age: req.body.user.age,
        userAgeGroup: req.body.user.userAgeGroup,
        date: req.body.user.date,
        images: req.body.user.images,
        firstName: req.body.user.firstName,
        lastName: req.body.user.lastName,
        name: req.body.user.firstName + " " + req.body.user.lastName,
        city: req.body.user.city,
        gender: req.body.user.gender,
        nickname: req.body.user.nickname,
        bio: req.body.user.bio,
        maritalStatus: req.body.user.maritalStatus,
        relType: req.body.user.relType,
        relPreference: req.body.user.relPreference,
        relDistance: req.body.user.relDistance,
        relInitialAge: req.body.user.relInitialAge,
        relFinalAge: req.body.user.relFinalAge,
        relAgeGroup: req.body.user.relInitialAge + "-" + req.body.user.relFinalAge,
        liveIn: req.body.user.liveIn,
        currently: req.body.user.currently,
        virgin: req.body.user.virgin,
        cook: req.body.user.cook,
        income: req.body.user.income,
        languages: req.body.user.languages,
        fbLink: req.body.user.fbLink,
        igLink: req.body.user.igLink,
        twitterLink: req.body.user.twitterLink
    });

    await User.register(newUser, req.body.password, async function(err, user) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/getting-started");
            // return res.redirect("back");
        } else {
            console.log("inside else");
                req.flash("success", "Your account has been created successfully.Please login to continue." )
                res.redirect("/login");
        }
    });
});

//LOGIN ROUTE

router.get("/login", function(req, res) {
    res.render("login");
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local', {
        failureFlash: true
    }, function(err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash("error", "Password or Username does not match");
            return res.redirect('/login');
        }
        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome back " + user.username);
            return res.redirect('/explore/' + user._id);
            
        });
    })(req, res, next);
});

//LOGOUT ROUTE

router.get("/logout/:id", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/login");
});


module.exports = router;