require("dotenv/config");
var express = require("express");
var router = express.Router();
var User = require("../models/user");
const client = require("twilio")(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

//GETTING STARTED ROUTE

router.get("/getting-started", function (req, res) {
    res.render("getting-started");
});

//HANDLING GETTING STARTED ROUTE REQUEST

router.post("/getting-started", async function (req, res) {
    //CALCULATING AGE FROM DOB GIVEN BY USER      
    var {
        AgeFromDateString
    } = require('age-calculator');
    var Date = req.body.date;
    let ageFromString = new AgeFromDateString('' + Date + '').age;
    var age = ageFromString;
    var phNumber = req.body.phNumber;
    var date = req.body.date;
    if (ageFromString < 15) {
        req.flash("error", "Users below the age of 15 are not permitted!");
        return res.redirect("back");
    } else {
       await User.find({}, async (err, allUsers) => {
            if (err) {
                console.log(err);
                console.log("Inside If err")
            }
            for (var i = 0; i < allUsers.length; i++) {
                 if (allUsers[i].phNumber === req.body.phNumber) {
                    console.log("inside if phNumber duplicate");
                    req.flash("error", "Phone Number is already in use.Please sign up with different Phone Number");
                    return res.redirect("back");                
                }
            }
        })
        await client
            .verify
            .services("VAf267f7d3f5ea60ee2f2329c58481b715")
            .verifications
            .create({
                to: "+91" + phNumber,
                channel: "sms"
            })
            .then(res.render("register", {
                phNumber: phNumber,
                age: age,
                date: date,
            }))
    }
});

module.exports = router;