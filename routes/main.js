var express = require("express");
var router = express.Router();
var http = require("http");
var User = require("../models/userDB");
var Doctor = require("../models/doctorDB");
var Admin = require("../models/adminDB");
var async = require("async");

router.get('/main', function (req, res, next) {
    console.log("good");
    var adminid = req.query.institution; // 관리자 로그인 >> ID (id 값 institution으로 정의)
    console.log(req.query.institution);
    console.log(req.query.password);
    var admin = new Admin();
    var doctor = new Doctor();
    var user = new User();


    checkIDInfo(admin, adminid); // 아이디 체크 [ adminDB에서 checkID 함수 불러오기 ]
    checkPWInfo(admin,req.query.password,function (err,admin) {
        if(err) return console.log("Error_admin_password");
        console.log(admin+"1");
    });

    /*admin.checkPassword(req.query.password, function (err, admins) {
        console.log(admin);
        if (err) return res.status(404).send("error to find admin");
        else {
            findAllDoctor(doctor, function (err, doctors) {
                // 의사 정보 모두 가져오기
                if (err) return console.log("의사 정보가 없습니다.");

                findUserData(user, function (err, users) {
                    // 유저 정보 모두 가져오기
                    if (err) return console.log("유저 정보가 없습니다.");

                    else
                        return res.render("main.ejs", {DoctorsData: doctors, UsersData: users, AdminsData: admins});
                }); // 유저 정보를 찾아서 main.ejs에 의사 정보와 유저 정보 그리고 관리자 정보를 같이 보낸다.
            });
        }
    }); // 비밀번호 체크 [ adminDB에서 checkPassword 함수 불러오기 ] -- bcrypt함수로 hashing 한 것 검사
    /*

     Admin.findOne({email: adminid, password: req.query.password}, function (err, admin) {
     if (err) return res.status(400).send("error to find admin");
     if (!admin) return res.status(404).send("error to find admin");
     else {
     Doctor.find({}, function (err, doctor) {
     console.log(doctor);
     if (err) return res.status(404).send("일치하는 유저와 의사 정보가 없습니다.");
     User.find({}, function (err, users) {
     console.log(users);

     })

     });
     }
     });*/
});

function checkIDInfo(admin, adminid) {
    admin.checkID(adminid, function (err, next) {
        if (err) return console.log("사용자 정보가 없습니다.");
        else {
            console.log(adminid +"입니다.");
            return next;
        }
    })
}

function checkPWInfo(admin,adminPW,callback){
    admin.checkPassword(adminPW,function (err,next) {
        if(err) return next(err);
        else{
            console.log(adminPW +"입니다.");
            return next;
        }
    })
}

function findUserData(user, callback) {
    user.findUserAllData(callback);
}

function findAllDoctor(doctor, callback) {
    doctor.findAllDr(callback);
}


/*
 회원 가입 구현하기.
 */

router.post("/main", function (req, res, next) {
    var LTID = req.body.LTID;
    var name = req.body.name;
    var address = req.body.address;
    var phoneNumber = req.body.phoneNumber;
    var age = req.body.age;
    var disease = req.body.disease;

    try {
        User.updateMany({LTID: LTID},
            {$set: {name: name}}, {upsert: true}
        );
    } catch (e) {
        console.log("error");
    }

    console.log(LTID + "/" + name + "/");
    User.findOne({
        LTID: LTID
    }, function (error, user) {
        if (error) console.log('There is no data in database');

        var f_LTID = user.LTID;
        var f_name = user.name;
        var f_address = user.address;
        var f_phoneNumber = user.phoneNumber;
        var f_age = user.age;
        var f_disease = user.disease;

        res.send({
            LTID: f_LTID, name: f_name, address: f_address, phoneNumber: f_phoneNumber
            , disease: f_disease
        });
    });

});

router.post("/addoldman", function (req, res, next) {
    var LTID = req.body.LTID;
    var name = req.body.name;
    var gender = req.body.gender;
    var tel = req.body.phoneNumber;
    var age = req.body.age;
    var Location = req.body.Location;
    var doctor_ID = req.body.Doctor_ID;
    var disease = req.body.disease;
    var born_at = req.body.bornat;
    console.log(LTID + " / " + name + "/" + gender + "/" + tel + "/" + age + "/" + disease);

    var userDB = new User({
        LTID: LTID,
        name: name,
        gender: gender,
        Location: Location,
        tel: tel,
        age: age,
        Doctor_ID: doctor_ID,
        disease: disease,
        born_at: born_at
    });
    userDB.save(function (err, userInfo) {
        if (err) return console.log("추가 데이터 저장 에러");
        else return res.send("well done");
    });
});

router.post("/deloldman", function (req, res, next) {
    console.log("asd");

    var LTID = req.body.LTID;
    // var name = req.query.name;
    // var gender = req.query.gender;
    // var age = req.query.age;
    var Location = req.body.Location;
    // var doctor_ID =req.query.Doctor_ID;

    console.log(LTID);

    User.remove({LTID: LTID, Location: Location}, function (err, userInfo) {
        if (err) return console.log("삭제 데이터  에러");
        else return res.send("well done");
    });
});


router.post("/adddoctor", function (req, res, next) {
    var Doctor_ID = req.body.Doctor_ID;
    var Doctor_name = req.body.Doctor_name;
    var Doctor_pw = req.body.Doctor_pw;
    console.log(Doctor_ID + " / " + Doctor_name + "/" + Doctor_pw);

    var Doctors = new Doctor({
        Doctor_ID: Doctor_ID,
        Doctor_name: Doctor_name,
        Doctor_pw: Doctor_pw
    });

    Doctors.save(function (err, doctorinfo) {
        if (err) return console.log("추가 데이터 저장 에러");
        else return res.send("well done");
    });
});


module.exports = router;