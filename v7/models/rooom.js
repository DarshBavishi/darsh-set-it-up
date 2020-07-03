var mongoose = require("mongoose");

var RooomSchema=new mongoose.Schema({
	userone:String,
	usertwo:String,
	roomnamedisplay:String
})

module.exports = mongoose.model("Rooom", RooomSchema);
