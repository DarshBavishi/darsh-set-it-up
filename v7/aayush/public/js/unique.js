var socket=io();
alert("aaa");

// socket.on("fromservertouniq",function(id){
	// var idname=id;
	// console.log(idname);
	// addingroom(id);
// })		

$("#uniqid").click(function(){
			// socket.emit("fromuniq");	
			var socks=socket.id;
				console.log("the id from socket is" +socks);
				addingroom(socks);
				
			});

function addingroom(II){
	var div=document.createElement("option");
			div.innerHTML=`<p class="text">${II}</p>`
			console.log("hhhhh");
			document.querySelector(".uniq").appendChild(div);
}