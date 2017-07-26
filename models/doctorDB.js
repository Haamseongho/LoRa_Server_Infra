var express =require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var doctorSchema = new Schema({
    Doctor_ID : {
        type: String,
        required:true
    },
    Doctor_name : {
        type: String

    },
    Doctor_pw : {
        type:String
    }
});

doctorSchema.methods.findAllDr = function (callback) {
    this.model("Doctor").find({},callback);
};


var Doctor = mongoose.model("Doctor",doctorSchema);
module.exports = Doctor;