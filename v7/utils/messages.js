var moment=require("moment");

function formatMessage(username,text){
	return{
		username,
		text,
		time:moment().format("h:mm a")		//here we r not just specifying format of the time or else Moment<2020-06-24T14:20:58+05:30> it will look like this
	};	//the a above is for to specify am or pmwe are denoting the current time!
}
// console.log(moment());

module.exports=formatMessage;
//we will link this to the server side