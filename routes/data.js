var express = require("express");
var router = express.Router();
var dynamicData = require("../models/dynamicDB");
var mongoose = require("mongoose");
var db = mongoose.connection;
var bodyParser = require("body-parser");
require('body-parser-xml')(bodyParser);
var db = mongoose.connection;

var app = express();


app.set(bodyParser.json());
app.set(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.xml());


router.post("/", function (req, res, next) {
    var data = new Array();
    data = req.body['m2m:cin']['con'][0].split("/");

    data = new dynamicData({
        LTID : req.body['m2m:cin']['ci'][0],
        pulse : req.body['m2m:cin']['con'][0],
        lat : req.body['m2m:cin']['con'][0],
        lon : req.body['m2m:cin']['con'][0],
        time : req.body['m2m:cin']['ct'][0]
    });
    console.log(user);
    data.save(function (error, data) {
        if (error) return res.json("error saved user's Data");
        return res.send('send well');
    });
});

module.exports = router;
