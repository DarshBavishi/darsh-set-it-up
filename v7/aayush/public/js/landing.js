//this one is for new creation of chatroom
var socket=io();

// $("#popupform").submit(function(e){
		// alert("aaaa");
		// console.log("from popup");
		// newContact("name","rum")
		// alert("fgf")
		
	// })

	
function newContact(oppuser,room){
	// alert("fro");
	var div=document.createElement("a");	//div was added instead of 'a'
	// div.href="chat.html"
	div.setAttribute("href","chat.html")
	// div.classList.add("aayush","friend-drawer","friend-drawer--onhover","rendering")
	// div.setAttribute("href","#")
	div.innerHTML=`
	<div class="friend-drawer friend-drawer--onhover rendering">	
      <img class="profile-image" src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/robocop.jpg" alt="">
      <div class="text">
      <h6>AAYUSH shah</h6>
      <p class="text-muted">Hey, you're released!</p>
      </div>
	</div>	
	`
	div.onclick=function(){
		var asd="AAYUSHshah"
		var roogm="newRoom"
		// socket.emit("joinroom",{asd,roogm})
		
		// $("#cont").hide();
	// $("#chatroomarea").show();
	console.log("sadd")
	}
	// alert("frooooooo");
	document.querySelector("#cont").appendChild(div);
}	

$("#bluffform").submit(function(e){
	e.preventDefault()
	// alert("asd");
	
	$(".jumbotron").hide();
	$(".container").show();
	var socks=socket.id;
	var aayush="AAYUSH";
	var bot="DARSH"
	console.log("the new generated socketid is"+socks)
	socket.emit("createroom",{bot:bot,socks:socks});
	newContact("a","a");
})
$(".friend-drawer").click(function(e){
	// e.preventDefault(); 
	$("#cont").hide();
	$("#chatroomarea").show();
	console.log("sadd")
})




// <div class="friend-drawer friend-drawer--onhover rendering">
// </div>