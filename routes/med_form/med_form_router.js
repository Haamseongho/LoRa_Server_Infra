/**
 * Created by haams on 2017-08-17.
 */
var express = require("express");
var router = express.Router();
var MedForm = require("../../models/med_form/medFormDB");
var User = require("../../models/userDB");

router.post("/insert", function (req, res, next) {
    var medName = req.body.medName;
 // client - medName
    var alarmHour = req.body.alarmHour[0];
    var alarmHour2 = req.body.alarmHour[1];
    var alarmHour3 = req.body.alarmHour[2];

    var alarmMin = req.body.alarmMin[0];
    var alarmMin2 = req.body.alarmMin[1];
    var alarmMin3 = req.body.alarmMin[2];

    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    console.log(medName);
    console.log("약이름:"  + medName + "/시" + alarmHour + "/" + alarmHour2 +"/" +alarmMin +"/"+ alarmMin2 +
         "/" + startDate + "/" + endDate);
});

module.exports = router;
