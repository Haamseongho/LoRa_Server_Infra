var express = require("express");
var router = express.Router();
var http = require("http");
var User = require("../models/userDB");
var mongoose = require("mongoose");
var db = mongoose.connection;
var dbUrl = "mongodb://cadi_project:123123@ds155418.mlab.com:55418/cadi_project";

// /* GET home page. */
//

router.get('/doctor_change', function (req, res, next) {
    var LTID = req.query.LTID;
    var Doctor_ID = req.query.Doctor_ID;

    User.findOne({LTID: LTID}, function (err, users) {
        if (err) return res.status(500).json({error: 'database failure'});
        if (!users) return res.status(404).json({error: 'user not found'});
        console.log("update");
        console.log(users);

        users.Doctor_ID = Doctor_ID;
        users.save(function (err) {
            if (err) res.status(500).json({error: 'failed to update'});
            res.json({message: 'User updated'});
        });

    });
});

module.exports = router;