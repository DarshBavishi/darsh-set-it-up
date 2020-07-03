var socket=io();
var ChatForm=document.getElementById("chat-form");
var ChatMessages=document.querySelector(".chat-messages");		//see line 9
// var roomName=document.querySelectorAll(".room-name");
var roomName=document.getElementById("room-name");
var usersName=document.getElementById("users");
// var Chatbtn=document.getElementById("uniqid");
//var formatMessage=require("./utils/messages");  doesn't work 
var RoomnameDisplay=document.getElementById("");
var UsernamenameDisplay=document.getElementById("username");

alert("aayush")
//get username and room
	//using body parser(try)
		// function urldata(req,res){
		// var username=req.params.username;
		// console.log(username);
		// }
		// urldata();
	//using qs cdn  mentioned (in chat.html)
		var {username,room}=Qs.parse(location.search,{
			ignoreQueryPrefix:true			//to ignore   ? type things
		});
		
	console.log(username,room);
	
	
//join the user to the chat room
	socket.emit("joinroom",{username,room});	//no function req since we are just sending data
	// this should be called when we click on a div on landing.html
// display room and users
	socket.on("roomUsers",function({room,users}){
		outputRoomname(room);
		//console.log("IN ROOMUSERS"+users)
		// outputUsersname(users);
	});

//message from server
socket.on("message",function(recievedMsg){
	console.log(recievedMsg);
	outputMessage(recievedMsg,'incoming');			//incoming is to make it to the left!
	
//scroll down to the latest message!
	//for that we need chat-messages class so we are doing document.query above
	ChatMessages.scrollTop=ChatMessages.scrollHeight;	 
			//mustsee:https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTop ||scrollHeight	
});
//to print the outgoing messages to other users on the left
socket.on("outgoingmessage",function(gomessage){
	console.log(gomessage);
	outputMessage(gomessage,'incoming');
	// sendMessages(gomessage);
	ChatMessages.scrollTop=ChatMessages.scrollHeight;
});
socket.on("totheright",function(gomessage){			//this one is for the right thing
	sendMessages(gomessage);
});

//new dropdown
// $(Chatbtn).click(function(){
	// console.log("btn is clicked!");
// });


//message submit
ChatForm.addEventListener("submit",function(e){
//get message text
	e.preventDefault();
	var msg=e.target.elements.msg.value;		//in chat.html msg is id and we want its value
	console.log(msg);			//this will consolemsg inctrl+sft+j individual only
	// var aay=formatMessage("AAYUSH",msg);
	console.log("the right msg is ");
	// console.log(aay);
	// sendMessages(aay);
	socket.emit("ChatMessage",msg)
	//clear message form
	e.target.elements.msg.value="";  //if we equal it to '" "' then place holder wont show up; null works fine!
	e.target.elements.msg.focus();	//focus() will take the typing cursor to the form.
});	
	
	//emit messageto server
	//  => outputMessage(msg,'outgoing');
	function sendMessages(msg){
	// var messssage={
		// message:msg,
	// }
	outputMessage(msg,'outgoing');
	console.log("send msg")
	var man=formatMessage(msg)
	console.log(man);
	// socket.emit("ChatMessage",msg)
	
	
	}


//outputMessage function definition
function outputMessage(recievedMsg,type){			//here we are creating the div class="message one"!!!
	var div=document.createElement("div");
	var className= type;
	div.classList.add(className,"message");
	div.innerHTML=`<p class="meta ">${recievedMsg.username} <span>${recievedMsg.time}</span></p>
		<p class="text">
			${recievedMsg.text}
		</p>`
	document.querySelector(".chat-messages").appendChild(div);
	

};

function outputRoomname(room){
	roomName.innerText=room;
};
// function outputUsersname(users){
	// usersName.innerHTML=`
	// ${users.map(user => `<li>${user.username}</li>`).join('')}`;
// }


function formatMessage(username,text){
	return{
		username,
		text,
		time:"11:47",
	}
}	





