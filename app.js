/**
 * 应用程序的启动（入口）文件
 */
//加载express模块
var express = require('express');
//加载数据库模块
var mongoose = require('mongoose');
//加载模板处理模块
var swig = require('swig');
//加载body-parser 来处理客户端提交的post数据
var bodyParser = require('body-parser');
//加载 cookies 模块
var Cookies = require('cookies');
//加载数据模型模块
var User = require('./models/User');
//创建app应用 相当于NodeJs Http.createServer();
var app = express();

/**
 *  设置静态文件托管
 *  当用户访问的Url以public开始，那么直接返回对用的__dirname +'/public'下的文件
 */
app.use('/public',express.static(__dirname + '/public'));
//配置当前模板
//定义当前应用所用引擎
//第一个参数：模板引擎的名称，也是文件名的后缀名，第二个参数表示用于解析模板的方法；
app.engine('html',swig.renderFile);
//设置模板存放的目录  第一个参数必须是views，第二个参数是存放的目录；
app.set('views','./views');
//注册所使用的模板引擎，第一个参数必须是view engine,第二个参数和app.engine这个方法中定义的模板引擎名称(第一个参数)必须保持一致；
app.set('view engine','html');
//开发过程中 需要取消模板缓存
swig.setDefaults({
    cache:false
});

//bodyParser设置
app.use(bodyParser.urlencoded({extended:false}));
//cookies 路由设置
app.use(function(req,res,next){
    req.cookies = new Cookies( req, res)
    //解析用户登录的cookies信息
    req.userInfo = {};
    if(req.cookies.get('signed')){
        try {
            var base64Json = JSON.parse(req.cookies.get('signed'));
            for(key in base64Json){
                if(key == 'username'){
                    // 把base64解码
                    var buf = Buffer.from(base64Json[key],"base64");
                    var utf = buf.toString();
                    base64Json[key] = utf;
                }
                // 然后赋值渲染到页面为中文
                req.userInfo[key]= base64Json[key];  
            }
            //获取当前用户的类型 是否为管理员
            User.findById(req.userInfo.id).then(function(userInfo){ 
                req.userInfo.isAdmin = userInfo.isAdmin;
                next();
            });    
        } catch (error){
            next(); 
        }
    }else{
       next();
    }     
});
//web端访问首页路由
app.use('/',require('./routers/website'));
//web端访问业务逻辑
app.use('/api',require('./routers/api'));
//后台管理页面
app.use('/admin',require('./routers/admin'));
//后台管理业务逻辑
app.use('/admin',require('./routers/adminAPI'))
//监听http请求
mongoose.connect('mongodb://localhost/Blog',function(err){
    if(err)
    {
        console.log('数据库连接失败');
    }
    else
    {
        console.log('数据库连接成功');
        app.listen(80,function(){
            console.log('80端口启动成功');
        });
    }
})
