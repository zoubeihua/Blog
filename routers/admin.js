var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');
router.use(function(req,res,next){
    if(!req.userInfo.isAdmin){
        res.send('<h1 style="color:red;">对不起，只有管理员用户才能登录!</h2>')
        return;
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
     * sort({id,Number}) Number只有 1或-1
     * 1:代表升序 从小到大排序
     * -1: 代表降序 从大到小排序
     */
    var page = req.query.page || 1;
    var limit = 10;
    var skip = (page - 1) * limit;
    var countpage = 0;
    User.count().then(function(count){
        //计算总页数
        countpage = Math.ceil(count / limit);
        User.find().sort({_id:-1}).limit(limit).skip(skip).then(function(users){
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
        Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function(navtitle){
            res.render('admin/categoryList',{
            categoryList:navtitle,
            countpage:countpage,
            curpage:page
        });
    })  
});
})
/**
 * 分类修改
 */
router.get('/category/Edit',function(req,res,next){
    //获取用户id的信息 并且用表单的形式展现出来
    var id = req.query.id || '';
    Category.findOne({
        _id:id
    }).then(function(category){
       if(!category){
           res.render('/admin/error',{
               message:'分类信息不存在'
           })
       }else{
           res.render('admin/categoryEdit',{
               category:category
           })
       }
    })
   
})

/**
 * 文章内容的添加
 */
router.get('/contentAdd',function(req,res,next){
    Category.find().sort({_id:-1}).then(function(categories){
        res.render('admin/contentAdd',{
            categories:categories
        });
    })
})
 /**
  * 文章列表显示
  */
  router.get('/contentList',function(req,res,next){
        var page = req.query.page || 1;
        var limit = 10;
        var skip = (page - 1) * limit;
        var countpage = 0;
        Content.count().then(function(count){
            //计算总页数
            countpage = Math.ceil(count / limit);
            Content.find().sort({_id:-1}).limit(limit).skip(skip).populate(['category','user']).then(function(contents){
                res.render('admin/contentList',{
                contentlist:contents,
                countpage:countpage,
                curpage:page
            });
        })  
    });
  })

/**
 * 文章修改逻辑
 */
router.get('/content/Edit',function(req,res,next){
    var id = req.query.id || '';
    var categorys = [];
     Category.find().sort({_id:-1}).then(function(categories){
        categorys = categories;
       return  Content.findOne({ _id:id}).populate(['category','user'])
    }).then(function(content){
        console.log(content);
        res.render('admin/contentEdit',{
            categorys:categorys,
            content:content
        })
    })
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