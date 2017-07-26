var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var userSchema = new Schema({

    LTID: {
        type: String
    },
    created_at: {
        type: Date
    },
    gender: {
        type: String
    },
    tel: {
        type: String
    },
    born_at :{
        type:String
    },
    address: {
        type: String
    },
    age: {
        type: Number
    },
    name: {
        type: String
    },
    disease: {
        type: String
    },
    Location: {
        type: String
    },
    Doctor_ID: {
        type: String
    }
});



// 유저 전체 데이터 가져오기
userSchema.methods.findUserAllData = function (callback) {
    return this.model('User').find({}, callback);
};


userSchema.methods.findData = function findData(name, cb) {
    return this.model('User').find({name: this.name}, cb);
};

var User = mongoose.model('User', userSchema);

module.exports = User;
