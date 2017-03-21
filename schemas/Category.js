//引用数据库模块
var mongoose = require('mongoose');
//前端导航分类管理结构的创建
module.exports = new mongoose.Schema({
    //导航名称
   navtitle:String,
});