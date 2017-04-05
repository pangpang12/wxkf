//加载依赖库
var express=require('express');
var path=require('path');
var bodyParser=require('body-parser');
var crypto=require('crypto');

//引入mongoose
var mongoose = require('mongoose');

//引入模型
var models = require('./models/models');

var User = models.User;

//使用mongoose连接服务
mongoose.connect('mongodb://localhost:27017/notes');
mongoose.createConnection().on('error',console.error.bind(console,'连接数据库失败'));

//创建express实例
var app=express();

//定义ejs模板引擎和模板文件位置
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

//定义静态文件目录
app.use(express.static(path.join(__dirname,'public')));


//定义数据解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//响应首页get请求
app.get('/',function (req,res) {
    res.render('index',{
        title:'首页'
    });
});

app.get('/register',function (req,res) {
    console.log('注册！');
    res.render('register',{
        title:'注册'
    });
});

//post 请求
app.post('/register',function (req,res) {
    //req.body 可以获取到表单的每项数据
    var username, password, passwordRepeat;
    username = req.body.username.toString();
    password = req.body.password.pro;
    passwordRepeat = req.body.passwordRepeat;

    // 检查输入的用户名是否为空，使用trim去掉两端空格
    if (username.trim().length == 0){
        console.log('用户名不能为空！');
        return res.redirect('/register');
    }

    // 检查输入的密码是否为空，使用trim去掉两端空格
    if (password.trim().length == 0||passwordRepeat.trim().length == 0){
        console.log('密码不能为空！');
        return res.redirect('/register');
    }

    // 检查两次输入的密码是否一致
    if (password != passwordRepeat){
        console.log("两次输入的密码不一致！");
        return res.redirect('/register');
    }



//检查用户名是否已经存在，如果不存在，则保存记录
User.findOne({username:username},function (err,user) {
    if (err){
        console.log(err);
        return res.redirect('/register');
    }

    if (user){
        console.log('用户名已存在');
        return res.redirect('/register');
    }

    //对密码进行md5加密
    var md5 = crypto.createHash('md5'),
        md5password = md5.update(password).digest('hex');

    //新建user对象用于数据保存
    var newUser = new User({
        username:username,
        password:md5password
        }
    );

    newUser.save(function (err,doc) {
        if (err){
            console.log(err);
            return res.redirect('/');
        }
        console.log('注册成功！');
        return res.redirect('/');

    });

});
});


app.get('/login',function (req,res) {
    console.log('登陆！');
    res.render('login',{
        title:'登陆'
    });
});

app.get('/quit',function (req,res) {
    console.log('退出！');
    res.render('quit',{
        title:'退出'
    });
});

app.get('/post',function (req,res) {
    console.log('发布！');
    res.render('post',{
        title:'发布'
    });
});

app.get('/detail/',function (req,res) {
    console.log('查看笔记！');
    res.render('detail',{
        title:'查看笔记'
    });
});

//监听3000端口
app.listen(3000,function (req,res) {
    console.log('app is running at port 3000');
});