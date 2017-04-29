var express = require('express');
var cookieParser = require('cookie-parser');

var app = express();
app.use(cookieParser());

app.get('/read',function (req,res,next) {
    res.json(req.cookies);

});

app.get('/write',function (req,res,next) {
    res.cookie('my_cookie','hello');
    res.json(req.cookies);

});

app.listen(3000);
console.log("Server running at port:3000");