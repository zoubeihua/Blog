var express = require('express');
var router = express.Router();
//首页
router.get('/',function(req,res,next){
    res.render('website/index',{
        userInfo:req.userInfo
    });
});
//生活资讯
router.get('/live',function(req,res,next){
    res.render('website/live');
})
module.exports = router;