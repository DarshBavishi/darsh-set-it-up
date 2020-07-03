var express    =require("express");
var http	   =require("http");
var formatMessages=require("./utils/messages.js");
var{userJoin,roomCreate,getCurrentUser,deleteUser,getRoomusers,findRoom}=require("./utils/users.js");
var bodyparser =require("body-parser");
// var socketio   =require("socket.io");  mistake it should be io=
var mongoose=require("mongoose");
//server config
var server	   =express();
var SERVER	   =http.createServer(server);
var io		   =require('socket.io').listen(SERVER);
// set static folder
//way1
// var path=require('path');
// server.use(express.static(path.join(__dirname,"public")));				//',' is important
//way2
server.use(express.static(__dirname+"/public"));

var botname="Admin";

var uniqid=require("uniqid");		//to generate unique id


// console.log(id); // testing


var me = "aqwerty123";	
var activeuser="Parth"	


//configuration
mongoose.set('useFindAndModify', false);  	// solution to depreciation warning
mongoose.connect("mongodb://localhost:27017/vadami",{useNewUrlParser:true,useUnifiedTopology:true})

var RoomSchema=new mongoose.Schema({
	userone:String,
	usertwo:String,
	roomnamedisplay:String
})
var Rooom=mongoose.model("Rooom",RoomSchema);
var MessageSchema=new mongoose.Schema(
	{
		roomid:String,
		sender:String,
		receiver:String,
		messagetext:String
	}
)
// Rooom.create({
	// userone:"Aayush",
	// usertwo:"Robb",
	// roomnamedisplay:"Robb"
// },function(err,newroom){
	// if(err){
		// console.log("error in create")
	// }else{
		// console.log("created newroom");
		// console.log(newroom);
	// }
// })

// =====================================================

server.get("/chat/:id",function(req,res){
	var father=req.params.id;
	console.log("in /chat/:id/ and the socket is "+father)
	// socket.join(req.params.id)
	res.sendFile(__dirname +"/public/chat.html")
})







//RUN whenclient connects
io.sockets.on("connection",function(socket){
//this when a new pair is matched from landing.js	
	socket.on("createroom",function(opp,roomid){	
		
		// var newroom=roomCreate(me,opp,roomid);
		// console.log(newroom)
		// console.log(Rooms[0])
		
		
		Rooom.create({
	userone:activeuser,
	usertwo:opp,
	roomnamedisplay:"Aayush & bot"
},function(err,newroom){
	if(err){
		console.log("error in create")
		console.log(err);
	}else{
		console.log("created newroom");
		console.log(newroom);
	}
})	
	})

//========================================================
	

	//join a new user
socket.on("joinroom",function({username,room}){
		//the room which we wish to join , first we will make a user with all the info abt it  like id , username,room and the add 
			//him to the room by 'socket.join(user.room)'
		var user =userJoin(socket.id,username,room);	//the socket will give it a unique id
		
		Rooom.findById(room,function(err,foundroom){
			
			// console.log("printing ruom")
			// console.log(ruom)
			// console.log("=======================")
			//console.log(me);	//works
			if(activeuser==foundroom.userone){
				var ruom=foundroom.usertwo
			}else{
				var ruom=foundroom.userone
			}	
			io.to(user.Room).emit("roomUsers",{
			room:ruom,
			//notneeded
			users:getRoomusers(user.Room)
			})
		})
		//var ruom =findRoom(room)
		
		// console.log(ruom);
		
		console.log("in joinroom")
		console.log(user);
		console.log(user.Room);
		socket.join(user.Room);		//socket provides us with this function to join different rooms
		
			
		//now to add the user to a room ;we will need an array  and hence we are making a users.js in utils 
			//where we will add the new user to the USER array			
		
			//Welcome messages
		//console.log("NEW CONNECTION!")
		//get room users
		io.to(user.Room).emit("roomUsers",{
			room:user.Room,
			//notneeded
			//users:getRoomusers(user.Room)
		})
		
		socket.emit("message",formatMessages("Admin","WELCOME to chatcord!"))//a message for oneself
		//now the messages must go only to the specific room
//changes		socket.broadcast.emit("message",formatMessages("Admin","A user has joined the chat"));   
		// io.to(user.Room).emit("message",formatMessages("admin","ytippe"))
		socket.broadcast.to(user.Room).emit("message",formatMessages(botname,`${user.Username} is online`))
		//a message for everyone except the sender
	});
		
			//noneeded
		// socket.emit("uniqueid",id);
		// socket.on("fromuniq",function(){
			// var id =uniqid();
			// socket.emit("fromservertouniq",id)
		// });
	
	


	
	//listen for Chat message
	socket.on("ChatMessage",function(msg){
		 // var user=getCurrentUser(socket.id,username,room)  //here no need of username ,we will get that using the function
			var currentuser=getCurrentUser(socket.id);
			console.log("in chat messages")
			console.log(currentuser)
			//outgoingmessage is 'to the left'
		socket.broadcast.to(currentuser.Room).emit("outgoingmessage",formatMessages(currentuser.Username,msg));		//this will emit the message in everyones chat
		socket.emit("totheright",formatMessages(currentuser.Username,msg));			//this is for the right	
	});
		
	
	
	socket.on("disconnect",function(){
		////when disconnect we need to delete the user from the array .for that a new function in users.js
		// var currentuser=deleteUser(socket.id);
		// //var user=getRoomusers(socket.id);
			// if(currentuser){
				// io.to(currentuser.room).emit("message",formatMessages("Admin",`${currentuser.username} has disconnected`));
			// }
			
					////get room users
		// io.to(currentuser.room).emit("roomUsers",{
			// room:user.room,
			// users:getRoomusers(user.room)
		// });
		console.log("disconnected")
	});
});

//socket ENDS



server.get("/chat",function(req,res){
	res.sendFile(__dirname +"/public/landing.html")
});
server.get("/chatoptions",function(req,res){
	//show all the users first
	Rooom.find({},function(err,alluser){
		
		if(err){
			console.log("error in /chat/options")
		}else{
			res.render(__dirname+"/public/youth.ejs",{alluser:alluser,activeuser:activeuser});	
		}	
});
});


server.get("/chat/:roomid",function(req,res){
	//note:here the :id is that of room
	var father=req.params.roomid;
	console.log("in /chat/:id/ and the socket is "+father)
	// socket.join(req.params.id)
	res.sendFile(__dirname +"/public/chat.html")
})
SERVER.listen(3000 || process.env.PORT,function(){
	console.log("DRACARYS!!");
	console.log("listening on 3000");
});
