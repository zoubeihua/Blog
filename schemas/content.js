//引用数据库模块
var mongoose = require('mongoose');
//文章内容表结构的创建
module.exports = new mongoose.Schema({
   //分类 是一个关联字段 -分类管理标题的id
   category:{
       type:mongoose.Schema.Types.ObjectId,
       ref:'Category'
   },
    //标题
    title:String,
    //作者 是一个关联字段 -用户信息的id
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    //时间 
    AddTime:{
        type:Date,
        default:new Date()
    },
    //阅读量
    views:{
        type:Number,
        default:0
    },
    //简介
    description:{
        type:String,
        default:''
    },
    content:{
        type:String,
        default:''
    }
   
});