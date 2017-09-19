var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var dataSchema = new Schema({
    LTID: {
        type: String,
        required: true
    },
    pulse: {
        type: Number
    },
    lat: {
        type: Number
    },
    lon: {
        type: Number
    },
    time: {
        type: Date
    }
});

dataSchema.methods.findLTIDForLatLng = function (LTID, callback) {
    this.model("Dynamic").collection.findOne({LTID: LTID}, callback);
};
/*
 dynamicDB와 userDB 내의 LTID를 서로 비교 ( 키 : dynamicDB , 값: userDB )
 일치할 경우 dynamicDB에서 위도/경도 추출해내기
 */

var Dynamic = mongoose.model("Dynamic", dataSchema);
module.exports = Dynamic;
