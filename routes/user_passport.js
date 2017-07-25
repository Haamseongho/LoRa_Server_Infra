/**
 * Created by haams on 2017-05-18.
 */
module.exports = function (app,passport) {
    app.get('/',function (req,res) {
        console.log('패스요청');
        if(req.user == undefined){
            res.render('index.ejs',{ login_success : false });
        } else{
            res.render('index.ejs' , { login_success : true });
        }
    });
    app.get('/login',function (req,res) {
        console.log('login 패스 요청');
        res.render('index.ejs');
    })
    app.get('/logout', function(req, res) {
        console.log('/logout 패스 요청됨.');
        req.logout();
        res.redirect('/');
    });

    app.post('/login',
        passport.authenticate('local-login', {
            successRedirect : '/main',
            failureRedirect : '/',
            failureFlash : true
        })
    );
};