
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: String,
    firstName: String,
    lastName: String,
    email: { type: String, unique: true, required: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    phNumber: Number,
    city: String,
    dob: Date,
    nickname: String,
    bio: String,
    maritalStatus: String,
    relType: String,
    relPreference: String,
    relDistance: String,
    liveIn: String,
    currently: String,
    virgin: String,
    cook: String,
    income: String,
    languages: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);