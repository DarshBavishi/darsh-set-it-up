require("dotenv/config");
var express = require("express");
var router = express.Router();
var User = require("../models/user");
var middleware = require ("../middleware/index.js");

//HOME PAGE ROUTE

router.get("/home/:id", middleware.isLoggedIn ,function (req, res) {
    User.findById(req.params.id, function (err, foundUser) {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong!")
            res.redirect("back")
        } else {
            var array = [];
            var count = 0;
            var total = 14;
            var initialAge = Number(foundUser.relInitialAge); //17 //17
            var finalAge = Number(foundUser.relFinalAge); // 20 //21

            //Female gender
            if (foundUser.gender === "Female") {
                console.log("female");
                if (foundUser.relPreference === "Straight") {
                    console.log("second if");
                    User.find({
                        _id: {
                            $ne: req.user
                        },
                        gender: "Male",
                        relType: foundUser.relType, // Anything
                        age: {
                            $range: [initialAge, finalAge] // [17, 20]
                        }
                    }, function (err, data) {
                            console.log(data);
                        if (err) {
                            req.flash("error", "Something went wrong!")
                            res.redirect("back")
                        }
                        data.forEach(function (match) {
                            if (foundUser.relDistance === "Long Distance Relationships") {
                                if (foundUser.city !== match.city) {
                                    count += 4;
                                }

                            } else if (foundUser.relDistance === "Short Distance Relationships") {
                                if (foundUser.city === match.city) {
                                    count += 4;
                                }

                            } else {
                                count += 4;
                            }
                            if (foundUser.maritalStatus === match.maritalStatus) {
                                count++;
                            }
                            if (foundUser.liveIn === match.liveIn) {
                                count++;
                            }
                            if (foundUser.currently === match.currently) {
                                count++;
                            }
                            if (foundUser.virgin === match.virgin) {
                                count++;
                            }
                            if (foundUser.cook === match.cook) {
                                count++;
                            }
                            if (foundUser.income === match.income) {
                                count++;
                            }
                            var percentage = (count / total) * 100;
                            var x = {
                                count: count,
                                userData: match,
                                percentage: percentage
                            };
                            array.push(x);
                            count = 0;

                        });

                    });
                } else if (foundUser.relPreference === "Homosexual") {
                    User.find({
                        _id: {
                            $ne: req.user
                        },
                        gender: "Female",
                        relType: foundUser.relType,
                        age: {
                            $range: [initialAge, finalAge]
                        }
                    }, function (err, data) {
                        if (err) {
                            req.flash("error", "Something went wrong!")
                            res.redirect("back")
                        }
                        data.forEach(function (match) {
                            if (foundUser.relDistance === "Long Distance Relationships") {
                                if (foundUser.city !== match.city) {
                                    count += 4;
                                }

                            } else if (foundUser.relDistance === "Short Distance Relationships") {
                                if (foundUser.city === match.city) {
                                    count += 4;
                                }

                            } else {
                                count += 4;
                            }
                            if (foundUser.maritalStatus === match.maritalStatus) {
                                count++;
                            }
                            if (foundUser.liveIn === match.liveIn) {
                                count++;
                            }
                            if (foundUser.currently === match.currently) {
                                count++;
                            }
                            if (foundUser.virgin === match.virgin) {
                                count++;
                            }
                            if (foundUser.cook === match.cook) {
                                count++;
                            }
                            if (foundUser.income === match.income) {
                                count++;
                            }
                            var percentage = (count / total) * 100;
                            var x = {
                                count: count,
                                userData: match,
                                percentage: percentage
                            };
                            array.push(x);
                            count = 0;

                        });

                    });

                } else {
                    User.find({
                        _id: {
                            $ne: req.user
                        },
                        relType: foundUser.relType,
                        age: {
                            $range: [initialAge, finalAge]
                        }
                    }, function (err, data) {
                        if (err) {
                            req.flash("error", "Something went wrong!")
                            res.redirect("back")
                        }
                        data.forEach(function (match) {
                            if (foundUser.relDistance === "Long Distance Relationships") {
                                if (foundUser.city !== match.city) {
                                    count += 4;
                                }

                            } else if (foundUser.relDistance === "Short Distance Relationships") {
                                if (foundUser.city === match.city) {
                                    count += 4;
                                }

                            } else {
                                count += 4;
                            }
                            if (foundUser.maritalStatus === match.maritalStatus) {
                                count++;
                            }
                            if (foundUser.liveIn === match.liveIn) {
                                count++;
                            }
                            if (foundUser.currently === match.currently) {
                                count++;
                            }
                            if (foundUser.virgin === match.virgin) {
                                count++;
                            }
                            if (foundUser.cook === match.cook) {
                                count++;
                            }
                            if (foundUser.income === match.income) {
                                count++;
                            }
                            var percentage = (count / total) * 100;
                            var x = {
                                count: count,
                                userData: match,
                                percentage: percentage
                            };
                            array.push(x);
                            count = 0;

                        });

                    });

                }

            }
            //Male gender
            else if (foundUser.gender === 'Male') {
                if (foundUser.relPreference === "Straight") {
                    User.find({
                        _id: {
                            $ne: req.user
                        },
                        gender: "Female",
                        relType: foundUser.relType,
                        age: {
                            $range: [initialAge, finalAge]
                        },
                        function(err, data) {
                            console.log(data);
                            if (err) {
                                req.flash("error", "Something went wrong!")
                                res.redirect("back")
                            }
                            data.forEach(function (match) {
                                console.log(match);
                                if (foundUser.relDistance === "Long Distance Relationships") {
                                    if (foundUser.city !== match.city) {
                                        count += 4;
                                    }

                                } else if (foundUser.relDistance === "Short Distance Relationships") {
                                    if (foundUser.city === match.city) {
                                        count += 4;
                                    }

                                } else {
                                    count += 4;
                                }
                                if (foundUser.maritalStatus === match.maritalStatus) {
                                    count++;
                                }
                                if (foundUser.liveIn === match.liveIn) {
                                    count++;
                                }
                                if (foundUser.currently === match.currently) {
                                    count++;
                                }
                                if (foundUser.virgin === match.virgin) {
                                    count++;
                                }
                                if (foundUser.cook === match.cook) {
                                    count++;
                                }
                                if (foundUser.income === match.income) {
                                    count++;
                                }
                                var percentage = (count / total) * 100;
                                var x = {
                                    count: count,
                                    userData: match,
                                    percentage: percentage
                                };
                                console.log(count);
                                array.push(x);
                                count = 0;

                            });

                        }
                    });
                } else if (foundUser.relPreference === "Homosexual") {
                    User.find({
                        _id: {
                            $ne: req.user
                        },
                        gender: "Male",
                        relType: foundUser.relType,
                        age: {
                            $range: [initialAge, finalAge]
                        }
                    }, function (err, data) {
                        if (err) {
                            req.flash("error", "Something went wrong!")
                            res.redirect("back")
                        }
                        data.forEach(function (match) {
                            if (foundUser.relDistance === "Long Distance Relationships") {
                                if (foundUser.city !== match.city) {
                                    count += 4;
                                }

                            } else if (foundUser.relDistance === "Short Distance Relationships") {
                                if (foundUser.city === match.city) {
                                    count += 4;
                                }

                            } else {
                                count += 4;
                            }
                            if (foundUser.maritalStatus === match.maritalStatus) {
                                count++;
                            }
                            if (foundUser.liveIn === match.liveIn) {
                                count++;
                            }
                            if (foundUser.currently === match.currently) {
                                count++;
                            }
                            if (foundUser.virgin === match.virgin) {
                                count++;
                            }
                            if (foundUser.cook === match.cook) {
                                count++;
                            }
                            if (foundUser.income === match.income) {
                                count++;
                            }
                            var percentage = (count / total) * 100;
                            var x = {
                                count: count,
                                userData: match,
                                percentage: percentage
                            };
                            array.push(x);
                            count = 0;

                        });

                    });

                } else {
                    User.find({
                        _id: {
                            $ne: req.user
                        },
                        relType: foundUser.relType,
                        age: {
                            $range: [initialAge, finalAge]
                        }
                    }, function (err, data) {
                        if (err) {
                            req.flash("error", "Something went wrong!")
                            res.redirect("back")
                        }
                        data.forEach(function (match) {
                            if (foundUser.relDistance === "Long Distance Relationships") {
                                if (foundUser.city !== match.city) {
                                    count += 4;
                                }

                            } else if (foundUser.relDistance === "Short Distance Relationships") {
                                if (foundUser.city === match.city) {
                                    count += 4;
                                }

                            } else {
                                count += 4;
                            }
                            if (foundUser.maritalStatus === match.maritalStatus) {
                                count++;
                            }
                            if (foundUser.liveIn === match.liveIn) {
                                count++;
                            }
                            if (foundUser.currently === match.currently) {
                                count++;
                            }
                            if (foundUser.virgin === match.virgin) {
                                count++;
                            }
                            if (foundUser.cook === match.cook) {
                                count++;
                            }
                            if (foundUser.income === match.income) {
                                count++;
                            }
                            var percentage = (count / total) * 100;
                            var x = {
                                count: count,
                                userData: match,
                                percentage: percentage
                            };
                            array.push(x);
                            count = 0;

                        });

                    });

                }



            }
            //Others gender
            else {
                console.log("other");
                User.find({
                    _id: {
                        $ne: req.user
                    },
                    relType: foundUser.relType,
                    age: {
                        $range: [initialAge, finalAge]
                    }
                }, function (err, data) {
                    if (err) {
                        req.flash("error", "Something went wrong!")
                        res.redirect("back")
                    }
                    data.forEach(function (match) {
                        if (foundUser.relDistance === "Long Distance Relationships") {
                            if (foundUser.city !== match.city) {
                                count += 4;
                            }

                        } else if (foundUser.relDistance === "Short Distance Relationships") {
                            if (foundUser.city === match.city) {
                                count += 4;
                            }

                        } else {
                            count += 4;
                        }
                        if (foundUser.maritalStatus === match.maritalStatus) {
                            count++;
                        }
                        if (foundUser.liveIn === match.liveIn) {
                            count++;
                        }
                        if (foundUser.currently === match.currently) {
                            count++;
                        }
                        if (foundUser.virgin === match.virgin) {
                            count++;
                        }
                        if (foundUser.cook === match.cook) {
                            count++;
                        }
                        if (foundUser.income === match.income) {
                            count++;
                        }
                        var percentage = (count / total) * 100;
                        var x = {
                            count: count,
                            userData: match,
                            percentage: percentage
                        };
                        array.push(x);
                        count = 0;

                    });

                });
            }
            for (var i = 1; i < array.length; i++) {
                for (var j = 0; j < n - i; j++) {
                    if (array[j].count < array[j + 1].count) {
                        var temp = array[j];
                        array[j] = array[j + 1];
                        array[j + 1] = temp;

                    }
                }

            }
            res.render('home', {
                data: array
            });


        }
    })
});

module.exports = router