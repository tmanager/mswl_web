/**
 * Created by Administrator on 2019/2/18.
 */
var express = require('express');
var router = express.Router();


router.get('/',function(req,res,next){
    res.render('manager/login');
});

router.post('/login',function(req,res,next){
    var uname = req.body.username;
    req.session["ywtUname" + uname] = uname;
    req.session["ywtLogin" + uname] = req.body.loginsucc;
    //req.session["ywtUname" + uname] = req.body.username; // 登录成功，设置 session
    //req.session["ywtLogin" + uname] = req.body.loginsucc; // 登录成功，设置 session
    res.render('manager/main', {
        menu: 'main',
        loginsucc: req.session["ywtLogin" + uname]
    });
});

router.get('/logout',function(req,res){
    var uname = req.query.username;
    req.session["ywtUname" + uname] = "";
    req.session["ywtLogin" + uname] = "";
    //req.session.destroy();
    res.redirect('/');
});


router.get('/main',function(req,res,next){
   console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]) {  //判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('manager/main', {
            menu: req.url.substr(1),
            loginsucc: req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});

router.get('/user',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    console.info("usersession" + JSON.stringify(req.session));
    if(req.session["ywtUname" + uname]) {  //判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('manager/user/user', {
            menu: req.url.substr(1),
            loginsucc: req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});

router.get('/menu',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]) {  //判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('manager/power/menu', {
            menu: req.url.substr(1),
            loginsucc: req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});

router.get('/userpower',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]) {  //判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('manager/power/userpower', {
            menu: req.url.substr(1),
            loginsucc: req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});


router.get('/rolepower',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]) {  //判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('manager/power/rolepower', {
            menu: req.url.substr(1),
            loginsucc: req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});

//用户管理（个人信息）
router.get('/updateuser',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]){
        res.render('manager/user/updateuser',{
            menu:req.url.substr(1),
            loginsucc:req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});

router.get('/role',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]) {  //判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('manager/user/role', {
            menu: req.url.substr(1),
            loginsucc: req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});

router.get('/password',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]) {  //判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('manager/user/password', {
            menu: req.url.substr(1),
            loginsucc: req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});

router.get('/organ',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]) {  //判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('manager/organ/organ', {
            menu: req.url.substr(1),
            loginsucc: req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});

//二手物品分类
router.get('/usedtype',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]) {  //判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('manager/param/usedtype', {
            menu: req.url.substr(1),
            loginsucc: req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});
//家政服务分类
router.get('/hometype',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]) {  //判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('manager/param/hometype', {
            menu: req.url.substr(1),
            loginsucc: req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});
//房屋出租分类
router.get('/renttype',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]) {  //判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('manager/param/renttype', {
            menu: req.url.substr(1),
            loginsucc: req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});

//注册用户
router.get('/register',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]){   ////判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('manager/register/register',{
            menu: req.url.substr(1),
            loginsucc: req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});

//审核信息
router.get('/review',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]){
        res.render('manager/review/review',{
            menu: req.url.substr(1),
            loginsucc:req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});

//已发布信息
router.get('/released',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]){
        res.render('manager/released/released',{
            menu:req.url.substr(1),
            loginsucc:req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});

//精选信息
router.get('/choice',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]){
        res.render('manager/released/choice',{
            menu:req.url.substr(1),
            loginsucc:req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});
//广告信息
router.get('/advertisement',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]){
        res.render('manager/param/advertisement',{
            menu:req.url.substr(1),
            loginsucc:req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});

//家政模板
router.get('/preview/home',function(req,res,next){
    console.info(req.url);
    res.render('manager/preview/home');
});

//出租模板
router.get('/preview/rent',function(req,res,next){
    console.info(req.url);
    res.render('manager/preview/rent');
});


//二手模板
router.get('/preview/used',function(req,res,next){
    console.info(req.url);
    res.render('manager/preview/used');
});

module.exports = router;