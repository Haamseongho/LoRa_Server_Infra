/**
 * Created by haams on 2017-08-17.
 */
var express = require("express");
var router = express.Router();
var MedForm = require("../../models/med_form/medFormDB");

router.post("/insert", function (req, res, next) {
    var medName = req.body.medName // client - medName
    var alarmHour = req.body.alarmHour.hour1;
    var alarmHour2 = req.body.alarmHour[1];
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;

    console.log(medName + "/" + alarmHour + "/" +
        alarmHour2 + "/" + startDate + "/" + endDate);
});

module.exports = router;