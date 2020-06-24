require("dotenv/config");
var express = require("express");
var router = express.Router();
var User = require("../models/user");
const cities = require("all-countries-and-cities-json")
var indianCities = cities.India;

// router.get("/explore/:id", function (req, res) {
//     if (Object.keys(req.query).length>0) {
//         User.find(getFilters(req), function (err, allUsers) {
//             if (err) {
//                 console.log(err);
//                 return res.redirect("back");
//             }
//             else {
//                 if (allUsers.length < 1) {
//                     console.log(req.query.gender);
//                     req.flash("error", "No User with username " + req.query.username + " Exists.");
//                     return res.redirect("back");
//                 }
//                 res.render("explore", { users: shuffle(allUsers), cities: indianCities });
//             }
//         });
//     } else{
//         User.find({ _id: { $ne: req.user } }, function(err, allUsers) {
//             if (err) {
//                 console.log(err);
//                 return res.redirect("back");
//             }
//             return res.render("explore", { users: shuffle(allUsers),cities: indianCities });
//         });
//     }
// })

router.get("/explore/:id", function (req, res) {
    if (Object.keys(req.query).length > 0) {
        User.find(getFilters(req), function (err, allUsers) {
            if (err) {
                console.log("err");
                return res.redirect("back");
            } else {
                if (allUsers.length < 1) {
                    req.flash("error", "No user with given criteria Exists");
                    return res.render("explore", {
                        users: shuffle(allUsers),
                        cities: indianCities
                    });
                }
                res.render("explore", {
                    users: shuffle(allUsers),
                    cities: indianCities
                });
            }
        });
    } else {
        User.find({
            _id: {
                $ne: req.user
            }
        }, function (err, allUsers) {
            if (err) {
                console.log(err);
                return res.redirect("back");
            }
            return res.render("explore", {
                users: shuffle(allUsers),
                cities: indianCities
            });
        });
    }
})

// function getFilters(req){
//     var filter = { _id: { $ne: req.user }};
//     if(req.query.username.length>0){
//         filter.username = new RegExp(escapeRegex(req.query.username), 'gi');
//     }
//     if(req.query.name.length>0){
//         filter.name = new RegExp(escapeRegex(req.query.name),'gi');
//     }
//     if(req.query.city.length>0){
//         filter.city = new RegExp(escapeRegex(req.query.city),'gi');
//     }
//     if(req.query.age.length>0){
//         filter.age = Number(age);
//     }
//     if(req.query.gender.length>0){
//         filter.gender = req.query.gender;
//     }
//     return filter;
// }

function getFilters(req){
    var filter = { _id: { $ne: req.user }};
    if(req.query.username.length>0){
        filter.username = new RegExp(escapeRegex(req.query.username), 'gi');
    }
    if(req.query.name.length>0){
        filter.name = new RegExp(escapeRegex(req.query.name),'gi');
    }
    if(req.query.city.length>0){
        filter.city = new RegExp(escapeRegex(req.query.city),'gi');
    }
    if(req.query.age.length>0){
        filter.userAgeGroup = new RegExp(escapeRegex(req.query.age),'gi');
    }
    if(req.query.gender.length>0){
        filter.gender = new RegExp(escapeRegex(req.query.gender),'gi');
    }
    return filter;
}

// function getFilters(req) {
//     var filter = {
//         _id: {
//             $ne: req.user
//         }
//     };

//     if (req.query.username.length > 0) {
//         filter.username = new RegExp(escapeRegex(req.query.username), 'gi');
//     }
//     if (req.query.city.length > 0) {
//         filter = {
//             _id: {
//                 $ne: req.user
//             },
//             city: {
//                 $eq: req.query.city
//             }
//         };
//     }
//     if (req.query.gender.length > 0) {
//         // filter.gender = new RegExp(escapeRegex(req.query.gender),'gi');
//         filter = {
//             _id: {
//                 $ne: req.user
//             },
//             gender: {
//                 $eq: req.query.gender
//             }
//         };
//     }
//     if (req.query.name.length > 0) {
//         filter.name = new RegExp(escapeRegex(req.query.name), 'gi');
//     }
    // if (req.query.age) {
    //     console.log(req.query.age);
    //     // filter.age = Number(age);
    //     if (req.query.age < 15) {
    //         filter = { _id: { $ne: req }, age: {$lte: 14} };
    //     }
    //     else if (req.query.age >= 15 && req.query.age <= 18) {
    //         filter = { _id: { $ne: req.user }, age: {$gte: 15, $lte:18} };
    //     }
    //     else if (req.query.age >= 19 && req.query.age <= 21) {
    //         filter = { _id: { $ne: req.user }, age: { $gte: 19, $lte: 21 } };
    //     }
    //     else if (req.query.age >= 22 && req.query.age <= 26) {
    //         filter = { _id: { $ne: req.user }, age: {$gte: 22, $lte:26} };
    //     }
    //     else if (req.query.age >= 27 && req.query.age <= 30) {
    //         filter = { _id: { $ne: req.user }, age: { $gte: 27, $lte: 30 } };
    //     }
    //     else if (req.query.age >= 31 && req.query.age <= 50) {
    //         filter = { _id: { $ne: req.user }, age: { $gte: 31, $lte: 50 } };
    //     }
    //     else if (req.query.age >= 51) {
    //         filter = { _id: { $ne: req.user }, age: { $gte: 51} };
    //     }
    // }
    // return filter;
// }

//FOR CLEARING FILTERS ROUTE

router.post("/explore/:id", (req, res) => {
    User.find({
        _id: {
            $ne: req.user
        }
    }, (err, allUsers) => {
        if (err) {
            console.log(err);
            return res.redirect("back");
        }

        return res.render("explore", {
            users: shuffle(allUsers),
            cities: indianCities
        });
        // return res.redirect("/explore/" + req.params.id, { users: shuffle(allUsers), cities: indianCities});
    })
});


//SEARCH GIVEN USER
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

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

module.exports = router