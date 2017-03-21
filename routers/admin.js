var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Category');
router.use(function(req,res,next){
    if(!req.userInfo.isAdmin){
        res.send('<h1 style="color:red;">对不起，只有管理员用户才能登录!</h2>')
    }
    next();
})
/**
 * 首页
 */
router.get('/',function(req,res,next){
   res.render('admin/index',{
       userInfo:req.userInfo
   });
});
router.get('/main',function(req,res,next){
   res.render('admin/main');
});
/**
 * 用户列表
 */
router.get('/userlist',function(req,res,next){
    /**
     * 从数据库读取用户信息
     * limit(Number):限制获取的数据条数
     * 
     * skip(Number):忽略数据的条数
     * 每页显示两条数据
     * 1: 1-2 skip:0 -> 公式 (当前页-1)*limit
     * 2: 3-4 skip:2
     */
    var page = req.query.page || 1;
    var limit = 10;
    var skip = (page - 1) * limit;
    var countpage = 0;
    User.count().then(function(count){
        //计算总页数
        countpage = Math.ceil(count / limit);
        User.find().limit(limit).skip(skip).then(function(users){
            res.render('admin/userlist',{
            userslist:users,
            countpage:countpage,
            curpage:page
        });
    })  
});
})


/**
 * 分类管理
 */
router.get('/categoryAdd',function(req,res,next){
    res.render('admin/categoryAdd')
})

/**
 * 分类列表
 */
router.get('/categoryList',function(req,res,next){
     /**
     * 从数据库读取用户信息
     * limit(Number):限制获取的数据条数
     * 
     * skip(Number):忽略数据的条数
     * 每页显示两条数据
     * 1: 1-2 skip:0 -> 公式 (当前页-1)*limit
     * 2: 3-4 skip:2
     */
    var page = req.query.page || 1;
    var limit = 10;
    var skip = (page - 1) * limit;
    var countpage = 0;
    Category.count().then(function(count){
        //计算总页数
        
        countpage = Math.ceil(count / limit);
        console.log(countpage)
        Category.find().limit(limit).skip(skip).then(function(navtitle){
            res.render('admin/categoryList',{
            categoryList:navtitle,
            countpage:countpage,
            curpage:page
        });
    })  
});
})






router.get('/navbar',function(req,res,next){
   res.render('admin/navbar');
});

router.get('/form',function(req,res,next){
   res.render('admin/form');
});

router.get('/table',function(req,res,next){
   res.render('admin/table');
});

router.get('/button',function(req,res,next){
   res.render('admin/button');
});

router.get('/tab',function(req,res,next){
   res.render('admin/tab');
});

module.exports = router;