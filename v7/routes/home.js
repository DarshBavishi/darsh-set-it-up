require("dotenv/config");
var express = require("express");
var router = express.Router();
var User = require("../models/user");
var middleware = require("../middleware/index");
var count=0;
var array=[];
var popup=[];



//HOME PAGE ROUTE

router.get("/home/:id", middleware.checkAccountOwnership,middleware.bothLiked,async function (req, res) {

    
   

        await User.findById(req.user._id,async function(err,currentUser){
            await User.find({}, async function(err,otherUser){
                console.log("Inside find other users")
                otherUser.forEach(async (user) => {
                console.log("Inside forEach element");

                var item = req.user._id
                var index = user.likes.indexOf(item);
                if(index !==-1 ) {
                    console.log("inside if 1")
                     item = user._id
                     index = currentUser.likes.indexOf(item);
                    if(index !== -1) {
                        console.log("inside if 2")
                        item=user._id
                        index=currentUser.bothLiked.indexOf(item)
                        
                        if(index===-1)
                        {    
                            currentUser.bothLiked.push(user._id);
                            // currentUser.notifications.push(user._id); 
                            // user.notifications.push(req.user._id)
                            user.bothLiked.push(req.user._id);
                            await currentUser.save();
                           await user.save();   
                        }
                    }
                }
              });
            });
        });
    // User.findById(req.params.id, function (err, foundUser) {
    await User.findById(req.params.id).populate('notifications').exec( function (err, foundUser) {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong!")
            return res.redirect("back")
        } else {

            if(foundUser.notifications) {
                popup=foundUser.notifications;
                foundUser.notifications=null;
                foundUser.save();
            }
			
            //Female gender
            if (foundUser.gender === "Female") {
                console.log("female");
                if (foundUser.relPreference === "Straight") {
                    console.log("straight");
                    if (foundUser.relDistance === "Short Distance Relationships") {
                        console.log("inside short");
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            gender: "Male",
                            city: foundUser.city,
                            relPreference: "Straight",
                            age: {
                                $gte: Number(foundUser.relInitialAge) - 3,
                                $lte: Number(foundUser.relFinalAge) + 3
                            }
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                               return res.redirect("back")
                            }
                            array=matching(data,foundUser,count,array);
                            res.render('home',{data:shuffle(array),popup:popup});
                            array = [];
    
                        });
                    } else if (foundUser.relDistance === "Long Distance Relationship") {
                        console.log("inside long");
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            gender: "Male",
                            relPreference: "Straight" ,
                            age: {
                                $gte: Number(foundUser.relInitialAge) - 3 ,
                                $lte: Number(foundUser.relFinalAge) + 3
                            }
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                                return res.redirect("back")
                            }
                            array = matching(data, foundUser, count, array);
                            res.render('home', { data: shuffle(array),popup:popup });
                            array = [];
                        });
                    } else {
                        console.log("inside anything will do");
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            gender: "Male",
                            relPreference: "Straight",
                            age: {
                                $gte: Number(foundUser.relInitialAge) - 3,
                                $lte: Number(foundUser.relFinalAge) + 3
                            }
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                                return res.redirect("back")
                            }
                            array = matching(data, foundUser, count, array);
                            res.render('home', { data: shuffle(array),popup:popup });
                            array = [];
                        });
                    }
                } else if (foundUser.relPreference === "Homosexual") {
                    console.log("homosexual");
                    if (foundUser.relDistance === "Short Distance Relationships") {
                        console.log("inside short");
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            gender: "Female",
                            city: foundUser.city,
                            relPreference: "Homosexual",
                            age: {
                                $gte: Number(foundUser.relInitialAge) - 3,
                                $lte: Number(foundUser.relFinalAge) + 3
                            }
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                               return res.redirect("back")
                            }
                            array=matching(data,foundUser,count,array);
                            res.render('home',{data:shuffle(array),popup:popup});
                            array = []
                        });
                    } else if (foundUser.relDistance === "Long Distance Relationship") {
                        console.log("inside long");
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            age: {
                                $gte: Number(foundUser.relInitialAge) -3,
                                $lte: Number(foundUser.relFinalAge) + 3
                            },
                            gender: "Female",
                            relPreference: "Homosexual" 
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                                return res.redirect("back")
                            }
                            array = matching(data, foundUser, count, array);
                            res.render('home', { data: shuffle(array),popup:popup });
                            array = [];
                        });
                    } else {
                        console.log("inside anything will do");
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            age: {
                                $gte: Number(foundUser.relInitialAge) - 3,
                                $lte: Number(foundUser.relFinalAge) + 3
                            },
                            gender: "Female",
                            relPreference: "Homosexual"
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                                return res.redirect("back")
                            }
                            array = matching(data, foundUser, count, array);
                            res.render('home', { data: shuffle(array),popup:popup });
                            array=[];
                        });
                    }
                    //bisexual
                } else {
                    if (foundUser.relDistance === "Short Distance Relationships") {
                        console.log("inside short");
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            age: {
                                $gte: Number(foundUser.relInitialAge) - 3,
                                $lte: Number(foundUser.relFinalAge) + 3
                            },
                            city: foundUser.city
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                                return res.redirect("back")
                            }
                            array = matching(data, foundUser, count, array);
                            res.render('home', { data: shuffle(array),popup:popup  });
                                array = [];
                        });
                    } else if (foundUser.relDistance === "Long Distance Relationship") {
                        console.log("inside long");
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            age: {
                                $gte: Number(foundUser.relInitialAge) -3,
                                $lte: Number(foundUser.relFinalAge) + 3
                            },
                            
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                                return res.redirect("back")
                            }
                            array = matching(data, foundUser, count, array);
                            res.render('home', { data: shuffle(array),popup:popup  });
                            array = [];
                        });
                    } else {
                        console.log("inside anything will do");
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            age: {
                                $gte: Number(foundUser.relInitialAge) - 3,
                                $lte: Number(foundUser.relFinalAge) + 3
                            }
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                                return res.redirect("back")
                            }
                            array = matching(data, foundUser, count, array);
                            res.render('home', { data: shuffle(array),popup:popup  });
                            array = [];
                        });
                    }
                }
            }
            //Male gender
            else if (foundUser.gender === 'Male') {
                if (foundUser.relPreference === "Straight") {
                    console.log("straight");
                    if (foundUser.relDistance === "Short Distance Relationships") {
                        console.log("inside short");
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            gender: "Female",
                            city: foundUser.city,
                            relPreference: "Straight",
                            age: {
                                $gte: Number(foundUser.relInitialAge) - 3,
                                $lte: Number(foundUser.relFinalAge) + 3
                            }
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                               return res.redirect("back")
                            }
                            array=matching(data,foundUser,count,array);
                            res.render('home',{data:shuffle(array),popup:popup });
                            array = [];
    
                        });
                    } else if (foundUser.relDistance === "Long Distance Relationship") {
                        console.log("inside long");
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            gender: "Female",
                            
                            relPreference: "Straight" ,
                            age: {
                                $gte: Number(foundUser.relInitialAge) - 3,
                                $lte: Number(foundUser.relFinalAge) + 3
                            }
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                                return res.redirect("back")
                            }
                            array = matching(data, foundUser, count, array);
                            res.render('home', { data: shuffle(array),popup:popup  });
                            array = [];
                        });
                    } else {
                        console.log("inside anything will do");
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            gender: "Female",
                            relPreference: "Straight",
                            age: {
                                $gte: Number(foundUser.relInitialAge) - 3,
                                $lte: Number(foundUser.relFinalAge) + 3
                            }
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                                return res.redirect("back")
                            }
                            array = matching(data, foundUser, count, array);
                            res.render('home', { data: shuffle(array),popup:popup  });
                            array = [];
                        });
                    }
                } else if (foundUser.relPreference === "Homosexual") {
                    console.log("homosexual");
                    if (foundUser.relDistance === "Short Distance Relationships") {
                        console.log("inside short");
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            gender: "Male",
                            city: foundUser.city,
                            relPreference: "Homosexual",
                            age: {
                                $gte: Number(foundUser.relInitialAge) - 3,
                                $lte: Number(foundUser.relFinalAge) + 3
                            }
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                               return res.redirect("back")
                            }
                            array=matching(data,foundUser,count,array);
                            res.render('home',{data:shuffle(array),popup:popup });
                            array = []
                        });
                    } else if (foundUser.relDistance === "Long Distance Relationship") {
                        console.log("inside long");
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            age: {
                                $gte: Number(foundUser.relInitialAge) - 3,
                                $lte: Number(foundUser.relFinalAge) + 3
                            },
                            gender: "Male",
                            relPreference: "Homosexual" 
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                                return res.redirect("back")
                            }
                            array = matching(data, foundUser, count, array);
                            res.render('home', { data: shuffle(array),popup:popup  });
                            array = [];
                        });
                    } else {
                        console.log("inside anything will do");
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            age: {
                                $gte: Number(foundUser.relInitialAge) - 3,
                                $lte: Number(foundUser.relFinalAge) + 3
                            },
                            gender: "Male",
                            relPreference: "Homosexual"
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                                return res.redirect("back")
                            }
                            array = matching(data, foundUser, count, array);
                            res.render('home', { data: shuffle(array),popup:popup  });
                            array=[];
                        });
                    }
                    //bisexual
                } else {
                    if (foundUser.relDistance === "Short Distance Relationships") {
                        console.log("inside short");
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            age: {
                                $gte: Number(foundUser.relInitialAge) - 3,
                                $lte: Number(foundUser.relFinalAge) + 3
                            },
                            city: foundUser.city
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                                return res.redirect("back")
                            }
                            array = matching(data, foundUser, count, array);
                            res.render('home', { data: shuffle(array),popup:popup  });
                                array = [];
                        });
                    } else if (foundUser.relDistance === "Long Distance Relationship") {
                        console.log("inside long");
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            age: {
                                $gte: Number(foundUser.relInitialAge) - 3,
                                $lte: Number(foundUser.relFinalAge) + 3
                            }
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                                return res.redirect("back")
                            }
                            array = matching(data, foundUser, count, array);
                            res.render('home', { data: shuffle(array),popup:popup  });
                            array = [];
                        });
                    } else {
                        console.log("inside anything will do");
                        User.find({
                            _id: {
                                $ne: req.user
                            },
                            age: {
                                $gte: Number(foundUser.relInitialAge) - 3,
                                $lte: Number(foundUser.relFinalAge) + 3
                            }
                        }, function (err, data) {
                            if (err) {
                                req.flash("error", "Something went wrong!")
                                return res.redirect("back")
                            }
                            array = matching(data, foundUser, count, array);
                            res.render('home', { data:shuffle(array),popup:popup  });
                            array = [];
                        });
                    }
                }
            }
            //Others gender
            else {
                console.log("other");
                console.log("straight");
                if (foundUser.relDistance === "Short Distance Relationships") {
                    console.log("inside short");
                    User.find({
                        _id: {
                            $ne: req.user
                        },
                        gender: "Others",
                        city: foundUser.city,
                        age: {
                            $gte: Number(foundUser.relInitialAge) - 3,
                            $lte: Number(foundUser.relFinalAge) + 3
                        }
                    }, function (err, data) {
                        if (err) {
                            req.flash("error", "Something went wrong!")
                            return res.redirect("back")
                        }
                        array=matching(data,foundUser,count,array);
                        res.render('home',{data:shuffle(array),popup:popup });
                        array = [];

                    });
                } else if (foundUser.relDistance === "Long Distance Relationship") {
                    console.log("inside long");
                    User.find({
                        _id: {
                            $ne: req.user
                        },
                        gender: "Others",
                        age: {
                            $gte: Number(foundUser.relInitialAge) - 3,
                            $lte: Number(foundUser.relFinalAge) + 3
                        }
                    }, function (err, data) {
                        if (err) {
                            req.flash("error", "Something went wrong!")
                            return res.redirect("back")
                        }
                        array = matching(data, foundUser, count, array);
                        res.render('home', { data:shuffle(array),popup:popup  });
                        array = [];
                    });
                } else {
                    console.log("inside anything will do");
                    User.find({
                        _id: {
                            $ne: req.user
                        },
                        gender: "Others",
                        age: {
                            $gte: Number(foundUser.relInitialAge) - 3,
                            $lte: Number(foundUser.relFinalAge) + 3
                        }
                    }, function (err, data) {
                        if (err) {
                            req.flash("error", "Something went wrong!")
                            return res.redirect("back")
                        }
                        array = matching(data, foundUser, count, array);
                        res.render('home', { data: shuffle(array),popup:popup  });
                        array = [];
                    });
                }
            }
        }
    })
});

function matching(data,foundUser,count,array){
    data.forEach(function (match) {
        // if(foundUser.relInitialAge<=match.age && foundUser.relFinalAge>=match.age ) // {
           var percent = 60;
            if (foundUser.relDistance === "Long Distance Relationship") {
                if (foundUser.city !== match.city) {
                    count += 10;
                }
            } else if (foundUser.relDistance === "Short Distance Relationships") {
                if (foundUser.city === match.city) {
                    count += 10;
                }
    
            } else if(foundUser.relDistance==="Anything Will Do") {
                count += 10;
            }
            if (foundUser.maritalStatus === match.maritalStatus) {
                count+=4;
            }
            if (foundUser.relType) {
                if (foundUser.relType === "Anything will do") {
                    count += 6;    
                }
                else if (foundUser.relType === match.relType) {
                    count += 6;
                }
            }
            if (foundUser.liveIn === match.liveIn) {
                count+=4;
            }
            if (foundUser.currently === match.currently) {
                count+=4;
            }
            if (foundUser.virgin === match.virgin) {
                count+=4;
            }
            if (foundUser.cook === match.cook) {
                count+=2;
            }
            if (foundUser.income === match.income) {
                count+=2;
            }
            var percentage = count + percent;
            var x = {
                count: count,
                userData: match,
                percentage: percentage
            };
            array.push(x);
            count = 0;
        // }
    });        
    var n=array.length;
            for (var i = 1; i<n; i++) {
                for (var j = 0; j < n - i; j++) {
                    if (array[j].count < array[j + 1].count) {
                        var temp = array[j];
                        array[j] = array[j + 1];
                        array[j + 1] = temp;
                    }
                }
            }
    return array;

}
module.exports = router

//SHUFFLE ALL USERS

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



// require("dotenv/config");
// var express = require("express");
// var router = express.Router();
// var User = require("../models/user");
// var middleware = require("../middleware/index");
// var count=0;
// var array=[];
// var popup=[];


// //HOME PAGE ROUTE

// router.get("/home/:id", middleware.checkAccountOwnership,function (req, res) {
    // User.findById(req.params.id).populate('notifications').exec( function (err, foundUser) {
//         if (err) {
//             console.log(err);
//             req.flash("error", "Something went wrong!")
//             return res.redirect("back")
//         } else {

//             if(foundUser.notification)
// 		{
	 
// 		popup=foundUser.notification;
// 	        foundUser.notification=null;
// 		foundUser.save();
		
// 		}
			
//             //Female gender
//             if (foundUser.gender === "Female") {
//                 console.log("female");
//                 if (foundUser.relPreference === "Straight") {
//                     console.log("straight");
//                     if (foundUser.relDistance === "Short Distance Relationships") {
//                         console.log("inside short");
//                         User.find({
//                             _id: {
//                                 $ne: req.user
//                             },
//                             gender: "Male",
//                             city: foundUser.city,
//                             relPreference: "Straight",
//                             age: {
//                                 $gte: Number(foundUser.relInitialAge) + 3,
//                                 $lte: Number(foundUser.relFinalAge) -3
//                             }
//                         }, function (err, data) {
//                             if (err) {
//                                 req.flash("error", "Something went wrong!")
//                                return res.redirect("back")
//                             }
//                             array=matching(data,foundUser,count,array);
//                             res.render('home',{data:array,popup:popup});
//                             array = [];
    
//                         });
//                     } else if (foundUser.relDistance === "Long Distance Relationship") {
//                         console.log("inside long");
//                         User.find({
//                             _id: {
//                                 $ne: req.user
//                             },
//                             gender: "Male",
//                             relPreference: "Straight" ,
//                             age: {
//                                 $gte: Number(foundUser.relInitialAge) + 3,
//                                 $lte: Number(foundUser.relFinalAge) -3
//                             }
//                         }, function (err, data) {
//                             if (err) {
//                                 req.flash("error", "Something went wrong!")
//                                 return res.redirect("back")
//                             }
//                             array = matching(data, foundUser, count, array);
//                             res.render('home', { data: array,popup:popup });
//                             array = [];
//                         });
//                     } else {
//                         console.log("inside anything will do");
//                         User.find({
//                             _id: {
//                                 $ne: req.user
//                             },
//                             gender: "Male",
//                             relPreference: "Straight",
//                             age: {
//                                 $gte: Number(foundUser.relInitialAge) + 3,
//                                 $lte: Number(foundUser.relFinalAge) -3
//                             }
//                         }, function (err, data) {
//                             if (err) {
//                                 req.flash("error", "Something went wrong!")
//                                 return res.redirect("back")
//                             }
//                             array = matching(data, foundUser, count, array);
//                             res.render('home', { data: array,popup:popup });
//                             array = [];
//                         });
//                     }
//                 } else if (foundUser.relPreference === "Homosexual") {
//                     console.log("homosexual");
//                     if (foundUser.relDistance === "Short Distance Relationships") {
//                         console.log("inside short");
//                         User.find({
//                             _id: {
//                                 $ne: req.user
//                             },
//                             gender: "Female",
//                             city: foundUser.city,
//                             relPreference: "Homosexual",
//                             age: {
//                                 $gte: Number(foundUser.relInitialAge) + 3,
//                                 $lte: Number(foundUser.relFinalAge) -3
//                             }
//                         }, function (err, data) {
//                             if (err) {
//                                 req.flash("error", "Something went wrong!")
//                                return res.redirect("back")
//                             }
//                             array=matching(data,foundUser,count,array);
//                             res.render('home',{data:array,popup:popup});
//                             array = []
//                         });
//                     } else if (foundUser.relDistance === "Long Distance Relationship") {
//                         console.log("inside long");
//                         User.find({
//                             _id: {
//                                 $ne: req.user
//                             },
//                             age: {
//                                 $gte: Number(foundUser.relInitialAge) + 3,
//                                 $lte: Number(foundUser.relFinalAge) -3
//                             },
//                             gender: "Female",
//                             relPreference: "Homosexual" 
//                         }, function (err, data) {
//                             if (err) {
//                                 req.flash("error", "Something went wrong!")
//                                 return res.redirect("back")
//                             }
//                             array = matching(data, foundUser, count, array);
//                             res.render('home', { data: array,popup:popup });
//                             array = [];
//                         });
//                     } else {
//                         console.log("inside anything will do");
//                         User.find({
//                             _id: {
//                                 $ne: req.user
//                             },
//                             age: {
//                                 $gte: Number(foundUser.relInitialAge) + 3,
//                                 $lte: Number(foundUser.relFinalAge) -3
//                             },
//                             gender: "Female",
//                             relPreference: "Homosexual"
//                         }, function (err, data) {
//                             if (err) {
//                                 req.flash("error", "Something went wrong!")
//                                 return res.redirect("back")
//                             }
//                             array = matching(data, foundUser, count, array);
//                             res.render('home', { data: array,popup:popup });
//                             array=[];
//                         });
//                     }
//                     //bisexual
//                 } else {
//                     if (foundUser.relDistance === "Short Distance Relationships") {
//                         console.log("inside short");
//                         User.find({
//                             _id: {
//                                 $ne: req.user
//                             },
//                             age: {
//                                 $gte: Number(foundUser.relInitialAge),
//                                 $lte: Number(foundUser.relFinalAge)
//                             } + 4,
//                             city: foundUser.city -3
//                         }, function (err, data) {
//                             if (err) {
//                                 req.flash("error", "Something went wrong!")
//                                 return res.redirect("back")
//                             }
//                             array = matching(data, foundUser, count, array);
//                             res.render('home', { data: array,popup:popup });
//                                 array = [];
//                         });
//                     } else if (foundUser.relDistance === "Long Distance Relationship") {
//                         console.log("inside long");
//                         User.find({
//                             _id: {
//                                 $ne: req.user
//                             },
//                             age: {
//                                 $gte: Number(foundUser.relInitialAge) + 3,
//                                 $lte: Number(foundUser.relFinalAge) - 3
//                             },
//                         }, function (err, data) {
//                             if (err) {
//                                 req.flash("error", "Something went wrong!")
//                                 return res.redirect("back")
//                             }
//                             array = matching(data, foundUser, count, array);
//                             res.render('home', { data: array,popup:popup });
//                             array = [];
//                         });
//                     } else {
//                         console.log("inside anything will do");
//                         User.find({
//                             _id: {
//                                 $ne: req.user
//                             },
//                             age: {
//                                 $gte: Number(foundUser.relInitialAge) + 3,
//                                 $lte: Number(foundUser.relFinalAge) - 3
//                             }
//                         }, function (err, data) {
//                             if (err) {
//                                 req.flash("error", "Something went wrong!")
//                                 return res.redirect("back")
//                             }
//                             array = matching(data, foundUser, count, array);
//                             res.render('home', { data: array,popup:popup });
//                             array = [];
//                         });
//                     }
//                 }
//             }
//             //Male gender
//             else if (foundUser.gender === 'Male') {
//                 if (foundUser.relPreference === "Straight") {
//                     console.log("straight");
//                     if (foundUser.relDistance === "Short Distance Relationships") {
//                         console.log("inside short");
//                         User.find({
//                             _id: {
//                                 $ne: req.user
//                             },
//                             gender: "Female",
//                             city: foundUser.city,
//                             relPreference: "Straight",
//                             age: {
//                                 $gte: Number(foundUser.relInitialAge) + 3,
//                                 $lte: Number(foundUser.relFinalAge) - 3
//                             }
//                         }, function (err, data) {
//                             if (err) {
//                                 req.flash("error", "Something went wrong!")
//                                return res.redirect("back")
//                             }
//                             array=matching(data,foundUser,count,array);
//                             res.render('home',{data:array,popup:popup});
//                             array = [];
    
//                         });
//                     } else if (foundUser.relDistance === "Long Distance Relationship") {
//                         console.log("inside long");
//                         User.find({
//                             _id: {
//                                 $ne: req.user
//                             },
//                             gender: "Female",
//                             relPreference: "Straight" ,
//                             age: {
//                                 $gte: Number(foundUser.relInitialAge) + 3,
//                                 $lte: Number(foundUser.relFinalAge) - 3
//                             }
//                         }, function (err, data) {
//                             if (err) {
//                                 req.flash("error", "Something went wrong!")
//                                 return res.redirect("back")
//                             }
//                             array = matching(data, foundUser, count, array);
//                             res.render('home', { data: array,popup:popup });
//                             array = [];
//                         });
//                     } else {
//                         console.log("inside anything will do");
//                         User.find({
//                             _id: {
//                                 $ne: req.user
//                             },
//                             gender: "Female",
//                             relPreference: "Straight",
//                             age: {
//                                 $gte: Number(foundUser.relInitialAge) + 3,
//                                 $lte: Number(foundUser.relFinalAge) - 3
//                             }
//                         }, function (err, data) {
//                             if (err) {
//                                 req.flash("error", "Something went wrong!")
//                                 return res.redirect("back")
//                             }
//                             array = matching(data, foundUser, count, array);
//                             res.render('home', { data: array,popup:popup });
//                             array = [];
//                         });
//                     }
//                 } else if (foundUser.relPreference === "Homosexual") {
//                     console.log("homosexual");
//                     if (foundUser.relDistance === "Short Distance Relationships") {
//                         console.log("inside short");
//                         User.find({
//                             _id: {
//                                 $ne: req.user
//                             },
//                             gender: "Male",
//                             city: foundUser.city,
//                             relPreference: "Homosexual",
//                             age: {
//                                 $gte: Number(foundUser.relInitialAge) + 3,
//                                 $lte: Number(foundUser.relFinalAge) - 3
//                             }
//                         }, function (err, data) {
//                             if (err) {
//                                 req.flash("error", "Something went wrong!")
//                                return res.redirect("back")
//                             }
//                             array=matching(data,foundUser,count,array);
//                             res.render('home',{data:array,popup:popup});
//                             array = []
//                         });
//                     } else if (foundUser.relDistance === "Long Distance Relationship") {
//                         console.log("inside long");
//                         User.find({
//                             _id: {
//                                 $ne: req.user
//                             },
//                             age: {
//                                 $gte: Number(foundUser.relInitialAge) + 3,
//                                 $lte: Number(foundUser.relFinalAge) - 3
//                             },
//                             gender: "Male",
//                             relPreference: "Homosexual" 
//                         }, function (err, data) {
//                             if (err) {
//                                 req.flash("error", "Something went wrong!")
//                                 return res.redirect("back")
//                             }
//                             array = matching(data, foundUser, count, array);
//                             res.render('home', { data: array,popup:popup });
//                             array = [];
//                         });
//                     } else {
//                         console.log("inside anything will do");
//                         User.find({
//                             _id: {
//                                 $ne: req.user
//                             },
//                             age: {
//                                 $gte: Number(foundUser.relInitialAge) + 3,
//                                 $lte: Number(foundUser.relFinalAge) - 3
//                             },
//                             gender: "Male",
//                             relPreference: "Homosexual"
//                         }, function (err, data) {
//                             if (err) {
//                                 req.flash("error", "Something went wrong!")
//                                 return res.redirect("back")
//                             }
//                             array = matching(data, foundUser, count, array);
//                             res.render('home', { data: array,popup:popup });
//                             array=[];
//                         });
//                     }
//                     //bisexual
//                 } else {
//                     if (foundUser.relDistance === "Short Distance Relationships") {
//                         console.log("inside short");
//                         User.find({
//                             _id: {
//                                 $ne: req.user
//                             },
//                             age: {
//                                 $gte: Number(foundUser.relInitialAge) + 3,
//                                 $lte: Number(foundUser.relFinalAge) - 3
//                             },
//                             city: foundUser.city
//                         }, function (err, data) {
//                             if (err) {
//                                 req.flash("error", "Something went wrong!")
//                                 return res.redirect("back")
//                             }
//                             array = matching(data, foundUser, count, array);
//                             res.render('home', { data: array,popup:popup });
//                                 array = [];
//                         });
//                     } else if (foundUser.relDistance === "Long Distance Relationship") {
//                         console.log("inside long");
//                         User.find({
//                             _id: {
//                                 $ne: req.user
//                             },
//                             age: {
//                                 $gte: Number(foundUser.relInitialAge) + 3,
//                                 $lte: Number(foundUser.relFinalAge) - 3
//                             },
//                         }, function (err, data) {
//                             if (err) {
//                                 req.flash("error", "Something went wrong!")
//                                 return res.redirect("back")
//                             }
//                             array = matching(data, foundUser, count, array);
//                             res.render('home', { data: array,popup:popup });
//                             array = [];
//                         });
//                     } else {
//                         console.log("inside anything will do");
//                         User.find({
//                             _id: {
//                                 $ne: req.user
//                             },
//                             age: {
//                                 $gte: Number(foundUser.relInitialAge) + 3,
//                                 $lte: Number(foundUser.relFinalAge) - 3
//                             }
//                         }, function (err, data) {
//                             if (err) {
//                                 req.flash("error", "Something went wrong!")
//                                 return res.redirect("back")
//                             }
//                             array = matching(data, foundUser, count, array);
//                             res.render('home', { data: array,popup:popup });
//                             array = [];
//                         });
//                     }
//                 }
//             }
//             //Others gender
//             else {
//                 console.log("other");
//                 console.log("straight");
//                 if (foundUser.relDistance === "Short Distance Relationships") {
//                     console.log("inside short");
//                     User.find({
//                         _id: {
//                             $ne: req.user
//                         },
//                         gender: "Others",
//                         city: foundUser.city,
//                         age: {
//                             $gte: Number(foundUser.relInitialAge) + 3,
//                             $lte: Number(foundUser.relFinalAge) - 3
//                         }
//                     }, function (err, data) {
//                         if (err) {
//                             req.flash("error", "Something went wrong!")
//                             return res.redirect("back")
//                         }
//                         array=matching(data,foundUser,count,array);
//                         res.render('home',{data:array,popup:popup});
//                         array = [];

//                     });
//                 } else if (foundUser.relDistance === "Long Distance Relationship") {
//                     console.log("inside long");
//                     User.find({
//                         _id: {
//                             $ne: req.user
//                         },
//                         gender: "Others",
//                         age: {
//                             $gte: Number(foundUser.relInitialAge) + 3,
//                             $lte: Number(foundUser.relFinalAge) - 3
//                         }
//                     }, function (err, data) {
//                         if (err) {
//                             req.flash("error", "Something went wrong!")
//                             return res.redirect("back")
//                         }
//                         array = matching(data, foundUser, count, array);
//                         res.render('home', { data: array,popup:popup });
//                         array = [];
//                     });
//                 } else {
//                     console.log("inside anything will do");
//                     User.find({
//                         _id: {
//                             $ne: req.user
//                         },
//                         gender: "Others",
//                         age: {
//                             $gte: Number(foundUser.relInitialAge) + 3,
//                             $lte: Number(foundUser.relFinalAge) - 3
//                         }
//                     }, function (err, data) {
//                         if (err) {
//                             req.flash("error", "Something went wrong!")
//                             return res.redirect("back")
//                         }
//                         array = matching(data, foundUser, count, array);
//                         res.render('home', { data: array,popup:popup });
//                         array = [];
//                     });
//                 }
//             }
//         }
//     })
// });

// function matching(data,foundUser,count,array){
//     data.forEach(function (match) {
//         // if(foundUser.relInitialAge<=match.age && foundUser.relFinalAge>=match.age ) // {
//            var percent = 60;
//             if (foundUser.relDistance === "Long Distance Relationship") {
//                 if (foundUser.city !== match.city) {
//                     count += 11;
//                 }
    
//             } else if (foundUser.relDistance === "Short Distance Relationships") {
//                 if (foundUser.city === match.city) {
//                     count += 11;
//                 }
    
//             } else if(foundUser.relDistance==="Anything Will Do") {
//                 count += 11;
//             }
//             if (foundUser.maritalStatus === match.maritalStatus) {
//                 count+=4;
//             }
//             if (foundUser.relType) {
//                 if (foundUser.relType === "Anything will do") {
//                     count += 6;    
//                 }
//                 else if (foundUser.relType === match.relType) {
//                     count += 6;
//                 }
//             }
//             if (foundUser.liveIn === match.liveIn) {
//                 count+=5;
//             }
//             if (foundUser.currently === match.currently) {
//                 count+=4;
//             }
//             if (foundUser.virgin === match.virgin) {
//                 count+=3;
//             }
//             if (foundUser.cook === match.cook) {
//                 count+=2;
//             }
//             if (foundUser.income === match.income) {
//                 count+=2;
//             }
//             var percentage = count + percent;
//             var x = {
//                 count: count,
//                 userData: match,
//                 percentage: percentage
//             };
//             array.push(x);
//             count = 0;
//         // }
//     });        
//     var n=array.length;
//             for (var i = 1; i<n; i++) {
//                 for (var j = 0; j < n - i; j++) {
//                     if (array[j].count < array[j + 1].count) {
//                         var temp = array[j];
//                         array[j] = array[j + 1];
//                         array[j + 1] = temp;

//                     }
//                 }
//             }
//     return array;
// }
// module.exports = router;

