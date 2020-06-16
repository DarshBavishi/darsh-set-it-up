var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: String,
    firstName: String,
    lastName: String,
    name: String,
    bio: String,
    email: { type: String, unique: true, required: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    gender: String,
    phNumber: {type: String, unique: true},
    city: String,
    image: String,
    imageId: String,
    dob: Date,
    nickname: String,
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

UserSchema.plugin(passportLocalMongoose, {
    usernameQueryFields: ["phNumber","email"]
});

module.exports = mongoose.model("User", UserSchema);
