var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var userInfoSchema = new Schema({
    LTID: {
        type: String,
        required: true
    },
    pulse: {
        type: Number
    },
    Dynamic_GPS: {
        type: Number
    }
});

var UserInfo = mongoose.model("UserInfo", userInfoSchema);

module.exports = UserInfo;
