/**
 * Created by haams on 2017-08-17.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var hourSchema = new Schema({
    hour1: {type: Number},
    hour2: {type: Number},
    hour3: {type: Number}
});
// 알림 시간 설정 시간 스키마

var minuteSchema = new Schema({
    minute1 : {type:Number},
    minute2 : {type:Number},
    minute3 : {type:Number}
});
// 알림 시간 설정 분 스키마


var medFormSchema = new Schema({
    medname: {type: String},
    alarmHour: [hourSchema],
    alarmMin: [minuteSchema],
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    }
});
// 투약폼 스키마


module.exports = mongoose.model("MedForm",medFormSchema);