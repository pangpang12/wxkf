var express = require('express');
var parseurl = require('parseurl');
var session = require('express-session');

var app = express();

app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true
}))

app.use(function(req,res,next){
	var views = req.session.views
	if (!views){
		views = req.session.views = {}
	}
    //get the url pathname
    var pathname = parseurl(req).pathname
    //count the views
    views[pathname] = (views[pathname] || 0) + 1
    next()
})

app.use('/',function(req,res,next){
	var num = req.session.num
	if (!num){
		num = req.session.num = 0
	}
	req.session.num = num + 1
	console.log('=====这是第' + req.session.num + '次调用=====')
	next()
})

app.use(function(req,res,next){
	console.log("......")
	console.log("我是一个中间件，每次请求到来我都执行...")
	console.log("我可以偷懒，什么都不干，直接调用next(*^__^*) ")
	console.log("类似我这样的中间件有很多，你可以注册多个，一定要记得next哦，否则，呵呵")
	next()
})

app.use(function(req,res,next){
	console.log("......")
	console.log("我是另一个中间件，每次请求到来我都执行...")
	console.log("我还是做点什么事情吧，否则也挺无聊的")
	console.log("各位同学，要想学好NodeJS，要多动手，勤思考哦！！")
	next()
})

app.get('/foo',function(req,res,next){
	res.send('you viewed this page' + req.session.views['/foo'] + 'times')
})

app.get('/bar',function(req,res,next){
	res.send('you viewed this page' + req.session.views['/bar'] + 'times')
})

app.listen(3000);
console.log('Web server has started on http://127.0.0.1:3000/');