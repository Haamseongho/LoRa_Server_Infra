//           Basic_Configuration             //
var http = require("http");
var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
require('body-parser-xml')(bodyParser);
var app = express();
var config = require('./config');
var User = require("./models/userDB");
var colors = require("colors");
var Promise = require("es6-promise").Promise;
var port = process.env.PORT || 2721;
//      DataBase     //

var mongoose = require("mongoose");
var db = mongoose.connection;
var dbUrl = "mongodb://cadi_project:123123@ds155418.mlab.com:55418/cadi_project";
var httpReq = require('./promise-http').request;
var MongoClient = require("mongodb").MongoClient;
var asert = require("assert");
var indexRouter = require("./routes/index");


//         router        //


var dataRouter = require("./routes/data");

var fcmPush = require("./routes/push");
var test3 = require("./routes/test3");
var map= require("./routes/map");
var overdose = require("./routes/overdose");



var guardian = require("./routes/guard/guardian");
var users = require("./routes/user/userInfo");
var medForm = requrie("./routes/med_form_router");
var mainRouter = require("./routes/main");

//           session & passports           //


// var passport = require("passport");
// var LocalStrategy = require("passport-local");
// var session = require("express-session");
// var flash = require("connect-flash");
// var setUpPassport = require("./passports/setUpPassport");


//-----------------------------------------------------------------------------


//          app.set         //
app.set('port', port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.xml());

mongoose.connect(dbUrl, function (err) {
    if (err) {
        return console.log("There is no database");
    }
    console.log("Database is connected well!");
});

// configuration for base workout



//router

app.use("/", indexRouter);
app.use("/data", dataRouter);

app.use("/push", fcmPush);
app.use("/",test3);
app.use(express.static('public'));
app.use("/",map);
app.use("/",overdose);
/*
보호자 router
 */
app.use("/guard",guardian);
/*
디바이스 사용자

 */
app.use("/user",users);
app.use("/",mainRouter);
app.use("/medform",medForm);
// 투약알림 
app.use('/',function (req, res, next) {
   var err = new Error('Not Found');
   err.status = 404;
   next(err);
});


// **************************************************************************** function **************************************************************** //
var server = http.createServer(app);
// setUpPassport();


/*app.listen(port,function(){
 console.log("server is running on" + port);
 });*/
console.log("..");

server.listen(app.get('port'), function () {
    console.log('Express server listening on port:' + app.get('port') + " ");
});

module.exports = app;
