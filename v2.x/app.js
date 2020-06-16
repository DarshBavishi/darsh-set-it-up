var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var User = require("./models/user");
var flash = require("connect-flash");
var async = require("async");
var crypto = require("crypto");
var nodemailer = require("nodemailer");
const client = require("twilio")("AC38172515e73a05228c16698aa8e8cdd1", "34254ed984b549c0182b729632c1df7f");

var multer = require('multer');
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
var upload = multer({ storage: storage, fileFilter: imageFilter });

var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'dcimcuqjm',
    api_key: "295715373559115",
    api_secret: "9KtbJHAqsFA3G1hCjlt9SUIG5OM"
});


//REQURING ROUTES
// var indexRoutes = require("./routes/index");
// app.use(indexRoutes); This gives an error.... app.use() requires a middleware function

mongoose.connect("mongodb://localhost:27017/test2", { useUnifiedTopology: true, useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
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

app.get("/", function(req, res) {
    res.send("landing");
});

//GETTING STARTED ROUTE

app.get("/getting-started", function (req, res) {
    res.render("getting-started");
});

//HANDLING GETTING STARTED ROUTE REQUEST

app.post("/getting-started", function (req, res) {
    var phNumber = req.body.phNumber;
    //sending a text message
    client
        .verify
        .services("VA78c8b5d52196f3017aaad54bb3b16112")
        .verifications
        .create({
            to: "+91" + phNumber,
            channel: "sms"
        })
        .then(res.render("register", {
            phNumber: phNumber
        }))
});

//HANDLING PROFILE REGISTRATION PAGE

app.post("/register", function(req, res) {
    var phNumber = req.body.phNumber;
    //CHECKING VERIFICATION CODE
    client
        .verify
        .services("VA78c8b5d52196f3017aaad54bb3b16112")
        .verificationChecks
        .create({
            to: "+91" + req.body.phNumber,
            code: req.body.code
        })
        .then(() => {
            if (res.status == "pending") {
                return res.redirect("back");
            }
        })

    var newUser = new User({
        username: req.body.username,
        email: req.body.email
    });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err.message);
            return res.redirect("/register");
        }

        else {
            passport.authenticate("local")(req, res, function() {
                // req.flash("success", "Welcome to YelpCamp " + user.username + " !");
                res.redirect("/profile/" + user._id);
            });
        }
    });
});

//DISPLAYING PROFILE INPUT PAGE

app.get("/profile/:id", function (req, res) {
    User.findById(req.params.id, function (err, foundUser) {
        if (err) {
            req.flash("error", "Oops! Something went wrong.")
        }
        res.render("profile", { user: foundUser });

    });
})

//HANDLING PROFILE INPUT PAGE

app.post("/profile/:id", upload.single('image'), function (req, res) {
    cloudinary.v2.uploader.upload(req.file.path, function (err, result) {
        if (err) {
            req.flash("error", err.message);
        }
        else {
            User.findById(req.params.id, async function (err, updatedUser) {
                if (err) {
                    console.log(err)
                }
                else {
                    updatedUser.image = result.secure_url;
                    updatedUser.imageId = result.public_id;
                    updatedUser.firstName = req.body.firstName;
                    updatedUser.lastName = req.body.lastName;
                    updatedUser.name = req.body.firstName + " " + req.body.lastName;
                    updatedUser.phNumber = req.body.phNumber;
                    updatedUser.city = req.body.city;
                    updatedUser.dob = req.body.dob;
                    updatedUser.nickname = req.body.nickname;
                    updatedUser.bio = req.body.bio;
                    updatedUser.maritalStatus = req.body.maritalStatus;
                    updatedUser.relType = req.body.relType;
                    updatedUser.relPreference = req.body.relPreference;
                    updatedUser.relDistance = req.body.relDistance;
                    updatedUser.liveIn = req.body.liveIn;
                    updatedUser.currently = req.body.currently;
                    updatedUser.virgin = req.body.virgin;
                    updatedUser.cook = req.body.cook;
                    updatedUser.income = req.body.income;
                    updatedUser.languages = req.body.languages;
                    await updatedUser.save();
                    res.render("home", { user: updatedUser });
                }
            })
        }
    });
});

//LOGIN ROUTE

app.get("/login", function(req, res) {
    res.render("login");
});

app.post('/login', function(req, res, next) {
    passport.authenticate('local', { failureFlash: true }, function(err, user) {
        if (err) { return next(err); }
        if (!user) {
            // req.flash("error", "Password or Username does not match");
            return res.redirect('/login');
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect("/explore/" + user._id);
            // return res.redirect('/home/' + user._id);
        });
    })(req, res, next);
});


// FORGET PASSWORD ROUTE

app.get("/forgot", function(req, res) {
    res.render("forgot");
});

//HANDLING FORGOT PASSWORD REQUEST

app.post('/forgot', function(req, res, next) {
    async.waterfall([
    function(done) {
        crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');
            done(err, token);
        });
    },
    function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
            if (err) {
                req.flash("error", "Something went wrong!");
                return res.redirect("back");
            }
            if (!user) {
                req.flash('error', 'No account with that email address exists.');
                return res.redirect('/forgot');
            }

            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            user.save(function(err) {
                done(err, token, user);
            });
        });
    },
    function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'yelpcamp01@gmail.com',
                pass: 'parth_shah1936'
            }
        });
        var mailOptions = {
            to: user.email,
            from: 'SetItUp@gmail.com',
            subject: 'Node.js Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
            console.log('mail sent');
            req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
            done(err, 'done');
        });
    }
  ], function(err) {
        if (err) return next(err);
        res.redirect('/forgot');
    });
});

// RESET PASSWORD ROUTE
app.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (err) {
            req.flash("error", "Something went wrong!");
            return res.redirect("back");
        }
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot');
        }
        res.render('reset', { token: req.params.token });
    });
});

app.get("/reset", function(req, res) {
    res.render("reset")
})

//HANDLING RESET PASSWORD REQUEST

app.post('/reset/:token', function(req, res) {
    async.waterfall([
    function(done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                if (err) {
                    req.flash("error", "Something went wrong!");
                    return res.redirect("back");
                }
                if (!user) {
                    console.log(req.params.token);
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('back');
                }
                if (req.body.password === req.body.confirm) {
                    user.setPassword(req.body.password, function(err) {
                        if (err) {
                            req.flash("error", "Something went wrong!");
                            return res.redirect("back");
                        }
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        user.save(function(err) {
                            if (err) {
                                req.flash("error", "Something went wrong!");
                                return res.redirect("back");
                            }
                            req.logIn(user, function(err) {
                                done(err, user);
                            });
                        });
                    });
                }
                else {
                    req.flash("error", "Passwords do not match.");
                    return res.redirect('back');
                }
            });
        },
        function(user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'yelpcamp01@gmail.com',
                    pass: 'parth_shah1936'
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'learntocodeinfo@mail.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('success', 'Success! Your password has been changed.');
                done(err);
            });
        }
        ],
    function(err) {
        if (err) {
            req.flash("error", "Something went wrong!");
            return res.redirect("back");
        }
        res.redirect('/login');
    });
});

app.get("/home/:id", function(req,res) {
    User.findById(req.params.id, function(err, foundUser) {
        if(err) {
            console.log(err);
            req.flash("error", "Something went wrong!")
            res.redirect("back")
        } else {
             res.render("home", {user: foundUser});
        }
    })
});

app.get("/explore/:id", function (req, res) {
    //if someone searched by username
    
    if (req.query.username) {
        var regex = new RegExp(escapeRegex(req.query.username), 'gi');
        User.find({ "username": regex, _id: { $ne: req.user } }, function (err, allUsers) {
            if (err) {
                console.log("err");
                return res.redirect("back");
            }
            else {
                if (allUsers.length < 1) {
                    console.log(err);
                    req.flash("error", "No User with username " + req.query.username + " Exists.");
                    return res.redirect("back");
                }
                res.render("explore", { users: shuffle(allUsers) });
            }
        });
    }

    //if someone searched by city

    //BY FUZZY SEARCH

    // else if (req.query.city) {
    //     var regex = new RegExp(escapeRegex(req.query.city), 'gi');
    //     User.find({ "city": regex, _id: { $ne: req.user } }, function(err, allUsers) {
    //         if (err) {
    //             console.log("err");
    //             return res.redirect("back");
    //         }
    //         else {
    //             if (allUsers.length < 1) {
    //                 console.log(err);
    //                 req.flash("error", "No User lives in " + req.query.city);
    //                 return res.redirect("back");
    //             }
    //             res.render("explore", { users: allUsers });
    //         }
    //     });
    // }

    //If someone searched by city

    //BY USING FILTER FUNCTION

    else if (req.query.city) {
        User.find({ _id: { $ne: req.user } }, (err, allUsers) => {
            if (err) {
                return res.redirect("back");
            }
            var filteredItems = filterItems(allUsers, req.query.city);
            return res.render("explore", { users: shuffle(filteredItems) })
        })
    }
    
    //if someone filtered gender
    else if (req.query.gender) {
        var regex = new RegExp(escapeRegex(req.query.gender), 'gi');
        User.find({ "gender": regex, _id: { $ne: req.user } }, function(err, allUsers) {
            if (err) {
                console.log("err");
                return res.redirect("back");
            }
            else {
                if (allUsers.length < 1) {
                    console.log(err);
                    req.flash("error", "No User with gender " + req.query.gender + " Exists");
                    return res.redirect("back");
                }
                res.render("explore", { users: allUsers });
            }
        });
    }
    
    //if someone filtered name
    else if (req.query.name) {
        var regex = new RegExp(escapeRegex(req.query.name), 'gi');
        User.find({ "name": regex, _id: { $ne: req.user } }, function(err, allUsers) {
            if (err) {
                console.log("err");
                return res.redirect("back");
            }
            else {
                if (allUsers.length < 1) {
                    console.log(err);
                    req.flash("error", "No User With Name " + req.query.name + " Exists");
                    return res.redirect("back");
                }
                res.render("explore", { users: allUsers });
            }
        });
    }

    //if someone filtered age
    else if (req.query.age) {
        var regex = new RegExp(escapeRegex(req.query.age), 'gi');
        User.find({ "age": regex, _id: { $ne: req.user } }, function(err, allUsers) {
            if (err) {
                console.log("err");
                return res.redirect("back");
            }
            else {
                if (allUsers.length < 1) {
                    console.log(err);
                    req.flash("error", "No User With age " + req.query.age + " Exists");
                    return res.redirect("back");
                }
                res.render("explore", { users: allUsers });
            }
        });
    }

    //If search is empty
    else {
        User.find({ _id: { $ne: req.user } }, function(err, allUsers) {
            if (err) {
                console.log(err);
                return res.redirect("back");
            }
            //if all goes good, display explore page
            return res.render("explore", { users: shuffle(allUsers) });
        });
    }
});

//FOR CLEARING FILTERS ROUTE

app.post("/explore/:id", (req, res) => {
    User.find({ _id: { $ne: req.user } }, (err, allUsers) => {
        if(err) {
            console.log(err);
            return res.redirect("back");
        }

        return res.render("explore", { users: shuffle(allUsers) });
    }) 
});

function filterItems(arr, query) {
    return arr.filter(function (el) {
        return el.city.indexOf(query) !== -1
    })
};








//SEARCH GIVEN USER
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//logout route
app.get("/logout", function(req,res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/login");
});


app.listen(process.env.PORT || 3000, function() {
    console.log("SetItUp serving on PORT 3000!");
});
