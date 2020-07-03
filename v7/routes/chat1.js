// require("dotenv/config");
// var express = require("express");
// var router = express.Router();
// var express = require("express");
// var passport = require("passport");
// const client = require("twilio")(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
// var multer = require('multer');
// var middleware = require("../middleware/index");
// var http=require("http");
// var formatMessages=require("../utils/messages.js");
// var Rooom = require("../models/rooom");
// var{userJoin,roomCreate,getCurrentUser,deleteUser,getRoomusers,findRoom}=require("../utils/users.js");
// // var socketio   =require("socket.io");  mistake it should be io=
// //server config
// // set static folder
// //way1
// // var path=require('path');
// // server.use(express.static(path.join(__dirname,"public")));				//',' is important
// //way2

// var botname="Admin";

// var uniqid=require("uniqid");		//to generate unique id


// // console.log(id); // testing


// var me = "aqwerty123";	
// var activeuser="Shah"	


// //configuration

// // var MessageSchema=new mongoose.Schema(
// // 	{
// // 		roomid:String,
// // 		sender:String,
// // 		receiver:String,
// // 		messagetext:String
// // 	}
// // )
// // Rooom.create({
// // 	userone:"Aayush",
// // 	usertwo:"Robb",
// // 	roomnamedisplay:"Robb"
// // },function(err,newroom){
// // 	if(err){
// // 		console.log("error in create")
// // 	}else{
// // 		console.log("created newroom");
// // 		console.log(newroom);
// // 	}
// // })

// // =====================================================

// router.get("/chat/:id",function(req,res){
//     var father=req.params.id;
    
// 	console.log("in /chat/:id/ and the socket is "+father)
// 	// socket.join(req.params.id)
// 	res.render("chat1")
// })


// router.get("/chat",function(req,res){
// 	res.render("landing1")
// });
// router.get("/chatoptions",function(req,res){
// 	//show all the users first
// 	Rooom.find({},function(err,alluser){
		
// 		if(err){
// 			console.log("error in /chat/options")
// 		}else{
// 			res.render("youth",{alluser:alluser,activeuser:activeuser});	
// 		}	
// });
// });


// router.get("/chat/:roomid",function(req,res){
// 	//note:here the :id is that of room
// 	var father=req.params.roomid;
// 	console.log("in /chat/:id/ and the socket is "+father)
// 	// socket.join(req.params.id)
// 	res.render("chat1")
// })

















































// module.exports=router;
