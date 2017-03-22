var express = require('express');
var router = express.Router();
var Category = require('../models/Category');
//首页
router.get('/',function(req,res,next){
    Category.find().then(function(categories){
        res.render('website/index',{
            userInfo:req.userInfo,
            categories:categories
        }); 
    })
    
});
//生活资讯
router.get('/live',function(req,res,next){
    res.render('website/live');
})
module.exports = router;