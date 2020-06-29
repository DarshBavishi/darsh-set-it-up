require("dotenv/config");
var express = require("express");
var router = express.Router();
var User = require("../models/user");

// DISPLAY LIKES PAGE

router.get("/likes/:id", (req, res) => {
    // get list of those users which exist in likes array of foundUser
    User.findById(req.params.id)
        .populate("likes")
        .exec(function (err, foundUser) {
            if (err) {
                req.flash("error", "Something went wrong!");
                return res.redirect("back");
            }
            res.render("likes", {
                user: foundUser,
            });
        });
});

//HANDLING Like/Unlike REQUEST FROM VIEW PROFILE PAGE OR LIKES PAGE

router.post("/likes/:selectedUser_id", (req, res) => {
    User.findById(req.params.selectedUser_id, (err, foundclickedUser) => {
        if (err) {
            console.log(err);
            return res.redirect("back");
        }
        // check if req.user._id exists in foundclickedUser.likes
        var foundclickedUserLike = foundclickedUser.likes.some(function (like) {
            return like.equals(req.user._id);
        });

        if (foundclickedUserLike) {
            // user already liked, removing like
            foundclickedUser.likes.pull(req.user._id);
        } else {
            // adding the new user like
            foundclickedUser.likes.push(req.user);
        }

        foundclickedUser.save(function (err) {
            if (err) {
                console.log(err);
                return res.redirect("back");
            }
            return res.redirect("/profile/" + foundclickedUser._id + "/view");
        });
    });
});

//HANDLING Like/Unlike REQUEST FROM HOME PAGE

router.post("/likes/:selectedUser_id/home", (req, res) => {
    User.findById(req.params.selectedUser_id, (err, foundclickedUser) => {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong!");
            return res.redirect("back");
        }
        // check if req.user._id exists in foundclickedUser.likes
        var foundclickedUserLike = foundclickedUser.likes.some(function (like) {
            return like.equals(req.user._id);
        });

        if (foundclickedUserLike) {
            // user already liked, removing like
            foundclickedUser.likes.pull(req.user._id);
        } else {
            // adding the new user like
            foundclickedUser.likes.push(req.user);
        }

        foundclickedUser.save(function (err) {
            if (err) {
                console.log(err);
                req.flash("error", "Something went wrong!");
                return res.redirect("back");
            }
            return res.redirect("/home/" + req.user._id);
        });
    });
});

module.exports = router;
