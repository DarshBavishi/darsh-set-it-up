require("dotenv/config");
var express = require("express");
var router = express.Router();
var async = require("async");
var nodemailer = require("nodemailer");
var express = require("express");
var User = require("../models/user");
var multer = require('multer');
const cities = require("all-countries-and-cities-json")
var indianCities = cities.India;


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

//----------------------------------------------------------

//ROUTES

//----------------------------------------------------------

//SETTINGS PAGE ROUTE

router.get("/settings/:id", (req, res) => {
    User.findById(req.params.id, function (err, foundUser) {
        //IF ERROR OCCURS
        if (err) {
            req.flash("error", "Something went wrong!");
            return res.redirect("back");
        }

        //ALL GOES GOOD
        res.render("settings", {
            user: foundUser,
            cities: indianCities
        });

    })
});

//HANDLING SETTINGS PAGE REQUEST

router.post("/settings/:id", (req, res) => {
    User.findByIdAndUpdate(req.params.id, {
        username: req.body.username,
        email: req.body.email
    }, async (err, updatedUser) => {
        if (err) {
            console.log(err.message);
            console.log(`E11000 duplicate key error collection: test-g.users index: phNumber_1 dup key: { username: "${req.body.phNumber}" }`);
            if (err.message === 'E11000 duplicate key error collection: test-g.users index: username_1 dup key: { username: ' + '"' + req.body.username + '" }') {
                req.flash("error", "A User with the given Username exists!");
                return res.redirect("back"); 
            }
            if (err.message === 'E11000 duplicate key error collection: test-g.users index: email_1 dup key: { email: ' + '"' + req.body.email + '" }') {
                req.flash("error", "A User with the given Email exists!");
                return res.redirect("back"); 
            }
            //  if (err.message === 'E11000 duplicate key error collection: test-a.users index: phNumber_1 dup key: { phNumber: ' + '"' + req.body.phNumber + '" }') {
            //     console.log("Inside if");
            //     req.flash("error", "A User with the given Contact No exists!");
            //     return res.redirect("back"); 
            // }
        }
        else {
            await req.flash("success", "Details updated Successfully!");
            await res.redirect("/settings/" + req.params.id);
        }
    });
});

router.post('/settings/:id/reset', function (req, res) {
    async.waterfall([
        function (done) {
            User.findById(req.params.id, function (err, user) {
                if (err) {
                    req.flash("error", "Something went wrong!");
                    return res.redirect("back");
                }
                if (req.body.password === req.body.confirm) {
                    user.setPassword(req.body.password, function (err) {
                        if (err) {
                            req.flash("error", "Something went wrong!");
                            return res.redirect("back");
                        }
                        user.save(function (err) {
                            if (err) {
                                req.flash("error", "Something went wrong!");
                                return res.redirect("back");
                            }
                            req.logIn(user, function (err) {
                                done(err, user);
                            });
                        });
                    });
                } else {
                    req.flash("error", "Passwords do not match.");
                    return res.redirect('back');
                }
            });
        },
        function (user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            });
            var mailOptions = {
                to: user.email,
                from: process.env.EMAIL,
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                res.redirect('/reset-logout');
            });
        }
    ])
});

// REDIRECTING AFTER RESETTING PASSWORD

router.get("/reset-logout", (req, res) => {
    req.logout();
    req.flash("success", "Your password has been changed.Please Login with your new password.");
    res.redirect("/login");
})

//EDITING MULTIPLE IMAGES ROUTE

router.put("/settings/:id/update", upload.array("images", 5), (req, res) => {
    //find user by id
    User.findById(req.params.id, async (err, user) => {
        //check if there is any image for deletion
        if (req.body.deleteImages && req.body.deleteImages.length) {
            //assign deleteImages from req.body to its own variable
            var deleteImages = req.body.deleteImages;
            //loop over for deletion of selected images
            for (var public_id of deleteImages) {
                // delete images from cloudinary
                await cloudinary.v2.uploader.destroy(public_id);
                //delete images from user.images
                for (var image of user.images) {
                    if (image.public_id === public_id) {
                        var index = user.images.indexOf(image);
                        user.images.splice(index, 1);
                    }
                }
            }
        }
        //check if there are any new images to upload
        if (req.files) {
            //upload images
            for (const file of req.files) {
                var image = await cloudinary.v2.uploader.upload(file.path);
                //add images to user.images array
                user.images.push({
                    url: image.secure_url,
                    public_id: image.public_id
                })
            }
        }
        //save the new images in database
        await user.save();
        res.redirect("/profile/" + req.params.id + "/view#photos");
    })
});

//DELETE ACCOUNT ROUTE

router.delete("/settings/:id/delete", (req, res) => {
    User.findById(req.params.id, async (err, user) => {
        if (err) {
            req.flash("error", "Something went wrong!");
            return res.redirect("back");
        }
        for (var image of user.images) {
            await cloudinary.v2.uploader.destroy(image.public_id);
        }
        await cloudinary.v2.uploader.upload(user.public_id);
        await user.remove();
        req.flash("success", "Your account has been deleted successfully.");
        res.redirect("/");
    });
});

//UPDATE PROFILE PICTURE ROUTE

router.put("/settings/:id/image", upload.single('image'), (req, res) => {
    User.findById(req.params.id, async (err, foundUser) => {
        if (err) {
            console.log(err)
            req.flash("error", "Something went Wrong!");
            return res.redirect("back");
        }
        try {
            await cloudinary.v2.uploader.destroy(foundUser.imageId);
            var result = await cloudinary.v2.uploader.upload(req.file.path);
            foundUser.imageId = result.public_id;
            foundUser.image = result.secure_url;

        } catch (err) {
            console.log(err)
            req.flash("error", "Something went Wrong!");
            return res.redirect("back");
        }
        await foundUser.save();
        req.flash("success", "Updated Profile Picture Successfully");
        res.redirect("/settings/" + req.params.id);

    });
});

module.exports = router;