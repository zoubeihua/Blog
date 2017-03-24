var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');

//声明一个信息提示对象
var responseData;
//初始化对象
router.use(function(req,res,next){
    responseData = {
        code:0,
        msg:''
    }
    next();
})

//添加分类标题请求
router.post('/Category/Add',function(req,res,next){
    var navtitle = req.body.navtitle || '';
    if(navtitle == ''){
        responseData.code = 1;
        responseData.msg = '输入的内容不能为空';
        res.json(responseData);
        return;
    }
    Category.findOne({
        navtitle:navtitle
    }).then(function(rs){
        if(rs){
            //数据分类已经存在
            responseData.code = 2;
            responseData.msg = '该分类名已经存在';
            res.json(responseData);
            return Promise.reject();;
        }else{
            //该分类不存在可以保存到数据库中
            return new Category({
                navtitle:navtitle
            }).save();
        }
    }).then(function(NewCategory){
            responseData.code = 0;
            responseData.msg = '该分类名保存成功';
            res.json(responseData);
    })
})
//分类修改请求
router.post('/Category/Edit',function(req,res,next){
     var navtitle = req.body.navtitle || '';
     var id = req.body.id || '';
     Category.findOne({
         _id:id
     }).then(function(category){
        if(!category){
            responseData.code = 2;
            responseData.msg = '分类信息不存在';
            res.json(responseData);
            return Promise.reject();
        }else{
            if(navtitle == category.navtitle){
                responseData.code = 3;
                responseData.msg = '您修改的还是之前的分类名称';
                res.json(responseData);
                return Promise.reject();
            }else{
                //要修改的名字是否和数据库重名
                return Category.findOne({
                    _id:{$ne:id},
                    navtitle:navtitle
                });
            }
        }
     }).then(function(sameCategory){
         if(sameCategory){
            responseData.code = 1;
            responseData.msg = '您修改的名字已被使用';
            res.json(responseData);
            return Promise.reject();
         }else{
             return Category.update({
                 _id:id
             },{
                navtitle:navtitle 
             });
         }
     }).then(function(){
            responseData.code = 0;
            responseData.msg = '修改成功';
            responseData.url = '/admin/categoryList';
            res.json(responseData);
     })
});

//分类列表删除请求
router.get('/Category/Del',function(req,res){
    var id = req.query.id || '';
    Category.remove({
        _id:id
    }).then(function(){
        responseData.code = 4;
        responseData.msg = '删除成功';
        responseData.id = id;
        res.json(responseData);
    })
});

//内容管理 保存逻辑
router.post('/Content/Add',function(req,res){
    console.log(req.body)
})
module.exports = router;