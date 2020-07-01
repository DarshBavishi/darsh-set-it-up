
var User = require("../models/user");
var middlewareObj = {};

middlewareObj.checkAccountOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
           User.findById(req.params.id, function(err, foundUser){
              if(err){
                  req.flash("error", "User not found");
                  res.redirect("back");
              }  else {
                  // does user own the account?
               if(foundUser._id.equals(req.user._id)) {
                   next();
               } else {
                   req.flash("error", "You don't have permission to do that");
                   res.redirect("/explore/" + req.user._id);
                //    res.redirect("/home/" + req.user._id);
               }
              }
           });
       } else {
           req.flash("error", "You need to be logged in to do that");
           res.redirect("back");
       }
   }
   
//    middlewareObj.checkCommentOwnership = function(req, res, next) {
//     if(req.isAuthenticated()){
//            Comment.findById(req.params.comment_id, function(err, foundComment){
//               if(err){
//                   res.redirect("back");
//               }  else {
//                   // does user own the comment?
//                if(foundComment.author.id.equals(req.user._id)) {
//                    next();
//                } else {
//                    req.flash("error", "You don't have permission to do that");
//                    res.redirect("back");
//                }
//               }
//            });
//        } else {
//            req.flash("error", "You need to be logged in to do that");
//            res.redirect("back");
//        }
//    }
   
   middlewareObj.isLoggedIn = function(req, res, next){
       if(req.isAuthenticated()){
           return next();
       }
       req.flash("error", "You need to be logged in to do that");
       res.redirect("/login");
   }
   

module.exports= middlewareObj;
