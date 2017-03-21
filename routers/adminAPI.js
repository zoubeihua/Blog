var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Category');

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

//添加前端导航标题请求
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

module.exports = router;