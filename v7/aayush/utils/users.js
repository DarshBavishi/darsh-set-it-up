var mongoose=require("mongoose");
var express=require("express");
var Users=[];
var Rooms=[];




// var RoomSchema=new mongoose.Schema({
	// userone:String,
	// usertwo:String,
	// roomnamedisplay:String
// })
// var Rooom=mongoose.model("Rooom",RoomSchema);
//join new user to the array
function userJoin(id,username,room){		//we will get  personal id for every user through socket.id 
	//now we want to create a user from the stuff passed here i.e id username and room 
	user={ID:id,
	Username:username,
	Room:room
	};
	
	Users.push(user);
	return user;
};

function findRoom(room){
	//return Rooom.findById(room)	
}


// me,opp,roomid notneeded since we have switched to database
function roomCreate(me,opp,roomid){
	chatroom={
		myself:me,
		opposite:opp,
		roomId:roomid
	};
	
	Rooms.push(chatroom);
	console.log(Rooms.length);
	return chatroom;
}
//notneeded
function getRoomsforme(me){
	console.log("in getroomsforme")
}

//to get current user
	//how will we get :ans: by id
function getCurrentUser(id){
	// Users.find(user,function(err,found){
		// if(err){
			// console.log("no such user found")
		// }else{
			
		// }
		// return Users.find(function(user){
			// user.id===id;
		return Users.find(user =>user.ID===id)	
		};

//to disconnect and delete a user
function deleteUser(id){
	var index=Users.findIndex(user => user.id===id);
	if(index !== -1){
		// var deletedUser=
		return Users.splice(index,1)[0];
	//here we need to  return the name of the user we are deleting since we want to display the message with name ,hence we are  returning it	
		// return deleteUser;
	
	}
};

//get room users
function getRoomusers(room){
	return Users.filter(user=> user.room===room);
};



module.exports={
	userJoin,
	roomCreate,
	getCurrentUser,
	deleteUser,
	getRoomusers,
	findRoom,
}