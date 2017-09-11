
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

var Dynamic = mongoose.model("Dynamic", dataSchema);
module.exports = Dynamic;
