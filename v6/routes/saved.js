require("dotenv/config");
var express = require("express");
var router = express.Router();
var async = require("async");
var User = require("../models/user");
var middleware = require ("../middleware/index.js");


router.get("/saved/:id", middleware.checkAccountOwnership ,function(req,res) {
    User.findById(req.params.id).populate("savedUsers").exec(function (err,foundUser) {
        if (err) {
            console.log(err);
        } else {
            res.render("savedUsers", {user: foundUser} );
        }
    })
})

router.post('/saved/:id', middleware.isLoggedIn ,async function (req,res) {
    User.findById(req.user._id, async function(err, foundUser){
        if(err){
            req.flash("error","Oops! Something went wrong. Could not save this user")
            res.redirect("back");
        } else {
            // var obj = {
            //     _id: req.params.id,
            //     saveButtonValue: "REMOVE FROM SAVED",
            //     saveFormActionValue: "removeFromSaved"
            // }
            foundUser.savedUsers.push(req.params.id);
            // foundUser.saveButtonValue = "REMOVE FROM SAVED"
            // foundUser.saveFormActionValue = "removeFromSaved"
            await foundUser.save()
            console.log(foundUser)
            res.redirect("/profile/" + req.params.id + "/view")
        }
    });
})

router.post('/removeFromSaved/:id', middleware.isLoggedIn ,async function (req,res) {
    User.findById(req.user._id, async function(err, foundUser){
        if(err){
            req.flash("error","Oops! Something went wrong. Could not remove this user from your saved users")
            res.redirect("back");
        } else {
            var item = req.params.id
            var index = foundUser.savedUsers.indexOf(item);
            if (index === -1) {
                req.flash("error","Oops! Something went wrong. Could not find this user in your saved users")
                return res.redirect("back");
            } else {
                foundUser.savedUsers.splice(index, 1)
                // foundUser.saveButtonValue = "SAVE"
                // foundUser.saveFormActionValue = "saved"
                await foundUser.save()
                res.redirect("/profile/" + req.params.id + "/view")
            }
        }
    });
})
router.post('/removeFromSavedPage/:id', middleware.isLoggedIn ,async function (req,res) {
    User.findById(req.user._id, async function(err, foundUser){
        if(err){
            req.flash("error","Oops! Something went wrong. Could not remove this user from your saved users")
            res.redirect("back");
        } else {
            var item = req.params.id
            var index = foundUser.savedUsers.indexOf(item);
            if (index === -1) {
                req.flash("error","Oops! Something went wrong. Could not find this user in your saved users")
                return res.redirect("/saved/" + req.params.id);
            } else {
                foundUser.savedUsers.splice(index, 1)
                await foundUser.save()
                res.redirect("/saved/" + req.user._id )
            }
        }
    });
})
module.exports = router;
