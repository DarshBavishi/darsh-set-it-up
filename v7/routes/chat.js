require("dotenv/config");
var express = require("express");
var router = express.Router();
var User = require("../models/user");
var middleware = require("../middleware/index");
const { filter } = require("async");


router.get("/chat/:id", middleware.checkAccountOwnership ,function(req,res){
    User.findById(req.params.id).populate('bothLiked').exec(async function(err,data){
        var noMatch = false;
        if(req.query.search) {
            var arr = [];
            var x=[];
            data.bothLiked.forEach(function (user) {
                arr.push(user.username);
            })
            arr = filterItems(arr, req.query.search);
            // console.log(filterItems(data.bothLiked.username, req.query.search));
            // console.log(filterItems(fruits, 'ap'))  // ['apple', 'grapes']
            // console.log(filterItems(fruits, 'an'))  // ['banana', 'mango', 'orange']
            //    if(regex)
            //    {
            //        console.log("inside first if");
            //        data.bothLiked.forEach(function (joy) {

            //         if(joy.username !== regex)
            //         {
            //             console.log("inside second if");
            //             xyz.push(joy);
            //         }
            //      });
                    
            //    }
            //    console.log(xyz);
            console.log("2");
            if(x.length < 1) {
                noMatch = true;  
                console.log('heyyyy');              
            
            }
            // console.log(finalarr);
            console.log('plssssssssssss');
            res.render('chat',{allusers:x.bothLiked,noMatch:noMatch});
            var finalarr= [];
           
            await arr.forEach(async function(username) {
                    await User.find({username: username}, async function(err, foundUser) {
                    console.log("inside for each")
                    // console.log(foundUser);
                    x=finalarr.concat(foundUser);
                    console.log(x);
                })
                console.log("1");
            })
            } else {
            console.log("inside else");
            var arr=data.bothLiked;
           
            // Get all users from DB
           res.render('chat',{allusers:arr,noMatch:noMatch});
        }
    });
});
   

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

function filterItems(arr, query) {
    return arr.filter(function(el) {
        return el.toLowerCase().indexOf(query.toLowerCase()) !== -1
    })
};
module.exports = router;











