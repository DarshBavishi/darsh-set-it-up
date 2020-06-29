require("dotenv/config");
var express = require("express");
var router = express.Router();
const client = require("twilio")(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

//GETTING STARTED ROUTE

router.get("/getting-started", function (req, res) {
    res.render("getting-started");
});

//HANDLING GETTING STARTED ROUTE REQUEST

router.post("/getting-started", function (req, res) {
    //CALCULATING AGE FROM DOB GIVEN BY USER      
    var {
        AgeFromDateString
    } = require('age-calculator');
    var Date = req.body.date;
    let ageFromString = new AgeFromDateString('' + Date + '').age;
    // console.log(ageFromString);

    if (ageFromString < 15) {
        req.flash("error", "Users below the age of 15 are not permitted!");
        return res.redirect("back" );
    } else {
    var age = ageFromString;
    var phNumber = req.body.phNumber;
        var date = req.body.date;
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
            phNumber: phNumber,
            age: age,
            date: date
        }))
    }
});

module.exports = router;