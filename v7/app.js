require("dotenv/config");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var User = require("./models/user");
var Rooom = require("./models/rooom");
var message=require("./models/message")
var flash = require("connect-flash");
var http = require('http').createServer(app);
var client = require('socket.io').listen(http);
var people = {};

//CHAT
// var SERVER	   =http.createServer(app);
// var io		   =require('socket.io').listen(SERVER);

//REQURING ROUTES
var authRoutes = require("./routes/auth");
var exploreRoutes = require("./routes/explore");
var gettingStartedRoutes = require("./routes/getting-started");
var miscRoutes = require("./routes/misc");
var profileRoutes = require("./routes/profile");
var resetRoutes = require("./routes/reset");
var settingsRoutes = require("./routes/settings");
var homeRoutes = require("./routes/home");
var savedUsersRoutes = require("./routes/saved");
var likeRoutes = require("./routes/like");
var chatRoutes = require("./routes/chat");
// var chat1Routes = require("./routes/chat1");


mongoose.connect("mongodb://localhost:27017/test-n", {
// mongoose.connect("mongodb://localhost:27017/test-p", {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');

//-------------------------------------------------------

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Monty is so single!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.use(authRoutes);
app.use(exploreRoutes)
app.use(gettingStartedRoutes);
app.use(miscRoutes);
app.use(profileRoutes);
app.use(resetRoutes);
app.use(settingsRoutes);
app.use(homeRoutes);
app.use(savedUsersRoutes);
app.use(likeRoutes);
app.use(chatRoutes);
// app.use(chat1Routes);

///socket for backupppppppp


client.on('connection', function(socket){

    // Create function to send status
    sendStatus = function(name,s){
        client.to(people[name]).emit('status', s);
    }
    
    socket.on('loaddata', function(data){
        message.find({from :data.self._id, to :data.with._id},function(err, res1){
            if(err){
                console.log(err);
            }
            else{
                message.find({from :data.with._id, to :data.self._id},function(err, res2){
                    if(err){
                        console.log(err);
                    } else {
                        res = res1.concat(res2);
                        res.sort(function(a, b) {
                            var dateA = new Date(a.date), dateB = new Date(b.date);
                            return dateA - dateB;
                        });
                        client.to(socket.id).emit('output',res);
                    }
                });
            }
        });
    });

    socket.on('join', function (data) {
        console.log(data.self.username + " Connected")
        people[data.self.username] = socket.id     
    });
	
	
	//typing functionality

     
	
	//typing functionality

     
	

    
    //Client sending message
    socket.on('input', function(data){
        console.log(data);
        User.find({username:data.from},function(err,from){
            User.find({username:data.to},function(err,to){
                message.create({from:from[0]._id, text: data.message,to:to[0]._id}, function(err,newmsg){
                    if(err){
                        console.log(err);
                    } else {
                        newmsg.text = data.message;
                        newmsg.save();
                        console.log(newmsg);
                        client.to(people[data.from]).emit('output',[newmsg]);
                        client.to(people[data.to]).emit('output',[newmsg]);
                        // Send status object
                        sendStatus(data.from,{
                            message: 'Message sent',
                            clear: true
                        });
                    } 
                });
            });
        });
    });
    socket.on('disconnect', function() {
        console.log('Got disconnect!',people);
        arr = Object.entries(people);
        for(var i = 0; i < arr.length;i++){
            if(arr[i][1]==socket.id){
                User.find({username:arr[i][0]},function(err,usr){
                    if(err){
                        console.log(err);
                    } else {
                        usr[0].lastseen = Date.now();
                        usr[0].save();
                    }
                });
                delete people[arr[i][0]];
                break;
            }
        }
      
    }); 
});


// //--------------------CHATBOX--------------------
// var activeuser="Iyer";
// var botname="Admin";
// var{userJoin,roomCreate,getCurrentUser,deleteUser,getRoomusers,findRoom}=require("./utils/users.js");
// var formatMessages=require("./utils/messages.js");
// //RUN whenclient connects
// io.sockets.on("connection",function(socket){
//     //this when a new pair is matched from landing.js	
//         socket.on("createroom",function(bot){	
//             //sunoomera battery khatam hogaya hai phone ka/// aata hu kuch time me
            
//             // var newroom=roomCreate(me,opp,roomid);
//             // console.log(newroom)
//             // console.log(Rooms[0])
            
            
//             Rooom.create({
//         userone: "Iyer",
//         usertwo:bot,
//         roomnamedisplay:"Hello & World "
//     },function(err,newroom){
//             if(err){
//                 console.log("err in create!");
//                 console.log(err);
//             }else{
//             console.log("created newroom");
//             console.log(newroom);
//             }    
//     })	
//         })
        
//     //========================================================
        
    
//         //join a new user
//     socket.on("joinroom",function({username,room}){
//             //the room which we wish to join , first we will make a user with all the info abt it  like id , username,room and the add 
//                 //him to the room by 'socket.join(user.room)'
//             var user =userJoin(socket.id,username,room);	//the socket will give it a unique id
            
//             Rooom.findById(room,function(err,foundroom){
                
//                 // console.log("printing ruom")
//                 // console.log(ruom)
//                 // console.log("=======================")
//                 //console.log(me);	//works
//                 if(activeuser==foundroom.userone){
//                     var ruom=foundroom.usertwo
//                 }else{
//                     var ruom=foundroom.userone
//                 }	
//                 io.to(user.Room).emit("roomUsers",{
//                 room:ruom,
//                 //notneeded
//                 users:getRoomusers(user.Room)
//                 })
//             })
//             //var ruom =findRoom(room)
            
//             // console.log(ruom);
            
//             console.log("in joinroom")
//             console.log(user);
//             console.log(user.Room);
//             socket.join(user.Room);		//socket provides us with this function to join different rooms
            
                
//             //now to add the user to a room ;we will need an array  and hence we are making a users.js in utils 
//                 //where we will add the new user to the USER array			
            
//                 //Welcome messages
//             //console.log("NEW CONNECTION!")
//             //get room users
//             io.to(user.Room).emit("roomUsers",{
//                 room:user.Room,
//                 //notneeded
//                 //users:getRoomusers(user.Room)
//             })
            
//             socket.emit("message",formatMessages("Admin","WELCOME to chatcord!"))//a message for oneself
//             //now the messages must go only to the specific room
//     //changes		socket.broadcast.emit("message",formatMessages("Admin","A user has joined the chat"));   
//             // io.to(user.Room).emit("message",formatMessages("admin","ytippe"))
//             socket.broadcast.to(user.Room).emit("message",formatMessages(botname,`${user.Username} is online`))
//             //a message for everyone except the sender
//         });
            
//                 //noneeded
//             // socket.emit("uniqueid",id);
//             // socket.on("fromuniq",function(){
//                 // var id =uniqid();
//                 // socket.emit("fromservertouniq",id)
//             // });
        
        
    
    
        
//         //listen for Chat message
//         socket.on("ChatMessage",function(msg){
//              // var user=getCurrentUser(socket.id,username,room)  //here no need of username ,we will get that using the function
//                 var currentuser=getCurrentUser(socket.id);
//                 console.log("in chat messages")
//                 console.log(currentuser)
//                 //outgoingmessage is 'to the left'
//             socket.broadcast.to(currentuser.Room).emit("outgoingmessage",formatMessages(currentuser.Username,msg));		//this will emit the message in everyones chat
//             socket.emit("totheright",formatMessages(currentuser.Username,msg));			//this is for the right	
//         });
            
        
        
//         socket.on("disconnect",function(){
//             ////when disconnect we need to delete the user from the array .for that a new function in users.js
//             // var currentuser=deleteUser(socket.id);
//             // //var user=getRoomusers(socket.id);
//                 // if(currentuser){
//                     // io.to(currentuser.room).emit("message",formatMessages("Admin",`${currentuser.username} has disconnected`));
//                 // }
                
//                         ////get room users
//             // io.to(currentuser.room).emit("roomUsers",{
//                 // room:user.room,
//                 // users:getRoomusers(user.room)
//             // });
//             console.log("disconnected")
//         });
//     });
    
//     //socket ENDS




// SERVER.listen(3000 || process.env.PORT,function(){
// 	console.log("DRACARYS!!");
// 	console.log("listening on 3000");
// });
// // -------------------- CHATBOX END ------------------

http.listen(process.env.PORT, function() {
    console.log("SetItUp serving on PORT " + process.env.PORT);
});
