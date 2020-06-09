var express        =  require("express"),
    app            =  express(),
    bodyParser     =  require("body-parser"),
    mongoose       =  require("mongoose"),
    flash          =  require("connect-flash"),
    passport       =  require("passport"),
    LocalStrategy  =  require("passport-local"),
    methodOverride =  require("method-override");
             async = require("async"),
            crypto = require("crypto"),
        nodemailer = require("nodemailer"),
    // Campground     =  require("./models/campground"),
    // Comment        =  require("./models/comment"),
    User           =  require("./models/user");
    // seedDB         =  require("./seeds")


//requiring routes
// var commentRoutes = require("./routes/comments"),
// campgroundRoutes  = require("./routes/campgrounds"),
// indexRoutes       = require("./routes/index")
  

mongoose.connect("mongodb://localhost:27017/set_it_up_v2e1", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); // seed the database

//PSSPORT CONFIG
app.use(require("express-session")({
    secret: "Dogs Are Cute",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.get("/",function(req,res) {
    res.render("landing");
});

//LOGIN ROUTE

app.get("/login", function(req, res) {
    res.render("login");
});


//HANDLING LOGIN ROUTE
app.post("/login", passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",

    failureFlash: true,
    succssFlash: true
}), function(req, res) {});


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
// app.get('/reset/:token', function(req, res) {
//     User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
//         if (err) {
//             req.flash("error", "Something went wrong!");
//             return res.redirect("back");
//         }
//         if (!user) {
//             req.flash('error', 'Password reset token is invalid or has expired.');
//             return res.redirect('/forgot');
//         }
//         res.render('reset', { token: req.params.token });
//     });
// });

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
            res.redirect('/campgrounds');
        });
});



app.get("/register", function(req,res) {
    res.render("register");
});



app.post("/register",function(req,res) {
    var newUser = new User ({
        username: req.body.username,
        email: req.body.email
    })
    User.register(newUser, req.body.password , function(err,user) {
        if(err) {
            console.log(err);
            req.flash("error", err.message)
            return res.redirect("/register")
        }
        passport.authenticate("local")(req,res, function() {
            req.flash("success", "Welcome to SetItUp " + user.username)
            res.redirect("/profile/"+ user._id)
        });
    }); 
});

app.get("/profile/:id", function(req,res) {
    User.findById(req.params.id, function(err, foundUser) {
        if(err) {
            req.flash("error", "Something went wrong!")
            res.redirect("back")
        } else {
             res.render("profile", {user: foundUser});
        }
    })
});

app.post("/profile/:id", function(req,res) {
    console.log(req);
    User.findById(req.params.id, async function (err, updatedUser) {
        console.log(updatedUser);
        if(err) {
            console.log(err)
        } else {
        updatedUser.firstName = req.body.firstName;
        updatedUser.lastName = req.body.lastName;
        updatedUser.phNumber = req.body.phNumber;
        updatedUser.city = req.body.city;
        updatedUser.dob = req.body.dob;
        updatedUser.nickname = req.body.nickname;
        updatedUser.bio = req.body.bio;
        updatedUser.maritalStatus = req.body.maritalStatus;
        updatedUser.relType = req.body.relType;
        updatedUser.relPreference = req.body.relPreference;
        updatedUser.relDistance= req.body.relDistance;
        updatedUser.liveIn= req.body.liveIn;
        updatedUser.currently= req.body.currently;
        updatedUser.virgin= req.body.virgin;
        updatedUser.cook= req.body.cook;
        updatedUser.income= req.body.cook;
        updatedUser.languages= req.body.languages;
        await updatedUser.save();
        console.log(req.body);
        res.render("home", {user: updatedUser});
        }
    })
});


// app.post("/profile/:id", function(req,res) {
//     User.findByIdAndUpdate(req.params.id,{
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         phNumber: req.body.phNumber,
//         city: req.body.city,
//         dob: req.body.dob,
//         nickname: req.body.nickname,
//         bio: req.body.bio,
//         maritalStatus: req.body.maritalStatus,
//         relType: req.body.relType,
//         relPreference: req.body.relPreference,
//         relDistance: req.body.relDistance,
//         liveIn: req.body.liveIn,
//         currently: req.body.currently,
//         virgin: req.body.virgin,
//         cook: req.body.cook,
//         income: req.body.cook,
//         languages: req.body.languages
//     }, function (err, updatedUser) {
//         if(err) {
//             console.log(err)
//         } else {
//             console.log(req.body);
//             res.render("home", {user: updatedUser})
//         }
//     })
// });



app.get("/home", function(req,res) {
    res.render("home");
});



var port = process.env.PORT || 3000;
app.listen(port,function() {
        console.log("SetItUp server has started!");
});

// Change all these routes to use upload file.

// //CREATE - add new campground to DB
// router.post("/campgrounds", middleware.isLoggedIn, upload.single('image'), function(req, res) {
//     cloudinary.v2.uploader.upload(req.file.path,function(err,result) {
//         if(err) {
//             req.flash("error", err.message);
//         }
//         else {
//             // add cloudinary url for the image to the campground object under image property
//             req.body.campground.image = result.secure_url;
//             req.body.campground.imageId = result.public_id;;
//             // add author to campground
//             req.body.campground.author = {
//                 id: req.user._id,
//                 username: req.user.username
//             }
//           Campground.create(req.body.campground, function(err, campground) {
//             if (err) {
//               req.flash('error', err.message);
//               return res.redirect('back');
//             }
//               res.redirect('/campgrounds/' + campground.id);
//             });
//         }
//     });
// });

// //EDIT ROUTE - EDIT A CAMPGROUND

// router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwenerShip, function(req, res) {
//     Campground.findById(req.params.id, function(err, foundCampground) {
//         if (err) {
//             req.flash("error", "Cannot Find The Campground");
//             res.redirect("back");
//         }
//         else {
//             res.render("campgrounds/edit", { campground: foundCampground });
//         }
//     });
// });


// //UPDATE ROUTE - HANDLING EDITION OF CAMPGROUND
// router.put("/campgrounds/:id", upload.single('image'), function(req, res){
//     Campground.findById(req.params.id, async function(err, campground){
//         if(err){
//             req.flash("error", err.message);
//             res.redirect("back");
//         } else {
//             if (req.file) {
//               try {
//                   await cloudinary.v2.uploader.destroy(campground.imageId);
//                   var result = await cloudinary.v2.uploader.upload(req.file.path);
//                   campground.imageId = result.public_id;
//                   campground.image = result.secure_url;
//               } catch(err) {
//                   req.flash("error", err.message);
//                   return res.redirect("back");
//               }
//             }
//             campground.name = req.body.name;
//             campground.Description = req.body.Description;
//             campground.price = req.body.price;
//             campground.save();
//             req.flash("success","Successfully Updated Campground!");
//             res.redirect("/campgrounds/" + campground._id);
//         }
//     });
// });

// // //DELETE ROUTE - DELETE A CAMPGROUND

// router.delete("/campgrounds/:id", middleware.checkCampgroundOwenerShip, middleware.isLoggedIn, function(req, res) {
//     Campground.findById(req.params.id, async function(err, campground) {
//         if (err) {
//             req.flash("error", err.message);
//             return res.redirect("back");
//         }
//         try {
//             await cloudinary.v2.uploader.destroy(campground.imageId);
//             campground.remove();
//             req.flash("success", "Deleted Campground Successfully.");
//             res.redirect("/campgrounds");
//         }
//         catch (err) {
//             if(err) {
//                 req.flash("error", err.message);
//                 return res.redirect("back");
//             }
//         }
//     });
// });

