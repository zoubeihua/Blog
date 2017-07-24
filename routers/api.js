var express = require('express');
var router = express.Router();
//引用数据模型
var User = require('../models/User');
var Content = require('../models/Content');
var multipart = require('connect-multiparty');

/**
 * 注册非空判断逻辑
 * 1.输入的账户名不能为空
 * 2.输入的密码不能为空
 * 
 * 3.用户名是否已被注册 数据库查询
 */
//声明一个信息提示对象
var responseData;
//初始化对象
router.use(function(req,res,next){
    multipart();
    responseData = {
        code:0,
        message:''
    }
    next();
});
//上传接口
router.post('/user/upload',function(req, resp) {
  console.log(req.body, req.files);
    
  // don't forget to delete all req.files when done
});
//用户注册逻辑
router.post('/user/register',function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;
    if(username == ''){
        responseData.code = 1;
        responseData.message = '输入的用户名不能为空';
        res.json(responseData);
        return;
    }
    if(password == ''){
        responseData.code = 2;
        responseData.message = '输入的密码不能为空';
        res.json(responseData);
        return;
    }
    //用户名是否已被注册 如果数据库中已经存在和我们注册的用户名同名的数据 表明该用户已被注册
    User.findOne({
        username:username
    }).then(function(userInfo){
        if(userInfo){
            //表示数据库中已有该数据
            responseData.code = 3;
            responseData.message = '该用户名已被注册';
            res.json(responseData);
            return;
        }
        //保存用户信息到数据库中
        var user = new User({
            username:username,
            password:password
        });
        return user.save()
    }).then(function(NewUserInfo){
         responseData.message = '注册成功';
         res.json(responseData);
    })
});

//用户登录逻辑
router.post('/user/login',function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    if(username == ''||password == ''){
        responseData.code = 1;
        responseData.message = '用户名或密码不能为空!';
        res.json(responseData);
        return;
    }
    //查询数据库中的用户名和密码是否和客户端登录信息相同，
    User.findOne({
        username:username,
        password:password
    }).then(function(userInfo){
        if(!userInfo){
            responseData.code = 2;
            responseData.message = '用户名或密码错误';
            res.json(responseData);
            return;
        }
       
        //用户名和密码是正确的
        responseData.message = '登录成功';
        
        responseData.userInfo = {
            _id:userInfo._id,
            username:userInfo.username,
            isAdmin:userInfo.isAdmin
            
        };
        
    var StrJSON = {
        username:userInfo.username
    }
    //解决中文不能存储到cookie的问题
    //把中文转成base64
     var buf = Buffer.from(StrJSON.username);
     var base64 = buf.toString('base64');
      req.cookies.set('signed',JSON.stringify({
            'id':userInfo._id,
             'username': base64
      }))
        res.json(responseData);
        return;
    })
})

/**
 * 退出逻辑
 */
router.get('/user/logout',function(req,res){
     req.cookies.set('signed',null);
     responseData.message = '退出成功';
     res.json(responseData);
})

//评论接口
router.post('/comment', function (req, res) {
    var commentId = req.body.commentid || '';
    var commentData = {
        username: req.userInfo.username,
        commenTime: new Date(),
        commContent: req.body.commContent
    }
    Content.findOne({
        _id: commentId
    }).then(function (conten) {
        conten.comments.push(commentData);
        return conten.save(commentData);
    }).then(function (Newcontent) {
        responseData.code = 0;
        responseData.message = '评论成功';
        responseData.data = Newcontent;
        res.json(responseData)
    })
})

//获取用户评论内容
router.get('/commentlist',function(req,res){
    var commentId = req.query.commentid || '';
    Content.findOne({
        _id:commentId
    }).then(function(comlist){
        responseData.data = comlist.comments; 
        res.json(responseData);
    })
})
router.get('/test',function(req,res){
    var id = req.query.id || '';
    var jsonas = {
        user:'michong',
        password:id
    }
    if(id){
         res.json(jsonas);
    }
   
})
module.exports = router;