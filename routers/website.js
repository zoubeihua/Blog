var express = require('express');
var router = express.Router();
var Category = require('../models/Category');
var Content = require('../models/Content');

//公共数据
 var data;
router.use(function(req,res,next){
    data = {
        userInfo:req.userInfo,
        categories:[]
    }
    Category.find().then(function(categories){
        data.categories = categories;
       next();
    })
})

//首页
router.get('/',function(req,res,next){
    data.category = req.query.category ||'',
        data.page = req.query.page || 1,
        data.limit = 5,
        data.countpage = 0,
        data.count = 0

    Content.count().then(function(count){
        data.count = count;
        //计算页数
        data.countpage = Math.ceil(data.count / data.limit);
        //取值不能超过 总页数
        data.page = Math.min(data.page,data.countpage);
        //取值不能小于1
        data.page = Math.max(data.page,1);
        var skip = (data.page - 1)*data.limit;

        return Content.find().limit(data.limit).skip(skip).populate(['category','user']);
        
    }).then(function(contents){
        data.contents = contents;
        res.render('website/index',data); 
    })
    
});
//生活资讯
router.get('/live',function(req,res,next){
        data.category = req.query.category ||'',
        data.page = req.query.page || 1,
        data.limit = 5,
        data.countpage = 0,
        data.count = 0
    //条件判断分类对应的内容筛选
    var where= {};
    if(data.category){
        where.category = data.category;
    }
 Content.count().where(where).then(function(count){
        data.count = count;
        //计算页数
        data.countpage = Math.ceil(data.count / data.limit);
        //取值不能超过 总页数
        data.page = Math.min(data.page,data.countpage);
        //取值不能小于1
        data.page = Math.max(data.page,1);
        var skip = (data.page - 1)*data.limit;

        return Content.find().where(where).limit(data.limit).skip(skip).populate(['category','user']).sort({AddTime:-1});
        
    }).then(function(contents){
        data.contents = contents;
        res.render('website/live',data); 
    })
})

//全文内容
router.get('/conte',function(req,res,next){
    var contentid = req.query.contentid || '';
    Content.findOne({
        _id:contentid
    }).then(function(content){
        data.content = content;
        console.log(data)
        res.render('website/Contentdetails',data); 
    })
})
module.exports = router;