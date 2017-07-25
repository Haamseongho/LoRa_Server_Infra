var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        trim: true
    },
    LTID: {
        type: String,
        required: true
    },
    beatData: {
        type: Number,
        required: true
    },
    heartData: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    lat: {
        type: Number
    },
    lon: {
        type: Number
    },
    spot: {
        type: String
    },
    resourceId: {
        type: String,
        required: true,
        trim: true
    },
    created_at: {
        type: Date
    },
    address: {
        type: String,
        trim: true
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    disease: {
        type: String,
        trim: true
    },
    adminId: {
        type: String
    }

});
//
// userSchema.methods.findUserData = function (adminId, done) {
//
//     return this.model('User').find({name: this.name}, cb);
// };


var User = mongoose.model('User', userSchema);

module.exports = User;
