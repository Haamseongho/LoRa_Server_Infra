var express = require("express");
var router = express.Router();
var User = require("../models/userDB");
var mongoose = require("mongoose");
var db = mongoose.connection;
var bodyParser = require("body-parser");
require('body-parser-xml')(bodyParser);


var app = express();
var user = undefined;

app.set(bodyParser.json());
app.set(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.xml());


router.post("/", function (req, res, next) {
    user = new User({
        name: req.body['m2m:cin']['cr'][0],
        age: 0.0,
        LTID : req.body['m2m:cin']['ci'][0],
        content: req.body['m2m:cin']['con'][0],
        // content -> beatData,heartData,lat,lon
        created_at: req.body['m2m:cin']['ct'][0],
        address : " ",
        phoneNumber : " ",
        disease : " ",
        adminId : " "
    });
    console.log(user);
    user.save(function (error, user) {
        if (error) return res.json("error saved user's Data");
        return res.send('send well');
    });
});


router.get("/", function (req, res, next) {
    user.findData(req.body.name, function (err, user) {
        if (err) return res.status(404).send(new Error("user Not Found"));
        return res.status(200).json(user);
    })
});


module.exports = router;
