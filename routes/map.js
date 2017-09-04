/**
 * Created by yn782 on 2017-08-17.
 */
var express = require("express");
var router = express.Router();
var http = require("http");

var user = undefined;

router.get("/map", function (req, res, next) {
    return res.render("map.ejs");
});



module.exports = router;