var PORT=9529;
var http=require('http');
var qs=require('qs');
var TOKEN='pphh';

function checkSignature(params,token) {
    var key=[token,params.timestamp,params.nonce].sort().join('');
    var sha1=require('crypto').createHash('sha1');
    sha1.update(key);
    return sha1.digest('hex')==params.signature;

}

var server=http.createServer(function (request,response) {
    var query=require('url').parse(request.url).query;
    var params=qs.parse(query);

    if (!checkSignature(params,TOKEN)){
        response.end('signature fail');
        return;
    }

    if (request.method=='GET'){
        response.end(params.echostr);
    }else {
        var postdata="";

        request.addListener("data",function (postchunk) {
            postdata+=postchunk;

        });

        request.addListener("end",function(){
        var parseString = require('xml2js').parseString;
        parseString(postdata,function(err,result){
        if (!err) {
            console.log(result)
            response.write(replyText(result));
            response.end('success');

        }
    });
});
    }

});

server.listen(PORT);
console.log("Server running at port:"+PORT+".");


function replyText(msg) {
    var msgtype=msg.xml.MsgType[0];
    switch (msgtype){
        case 'text':
            feedback='文本消息';
            break;
        case 'image':
            feedback='图片消息';
            break;
        case 'shortvideo':
            feedback='小视频';
            break;
        case 'video':
            feedback='视频消息';
            break;
        case 'voice':
            feedback='语音消息';
            break;
        case 'location':
            feedback='你的位置'+'经度:'+result.Location_X;
            break;
        case 'link':
            feedback='链接消息';
            break;
        default:
            feedback='未知类型消息'
    }

    var tmpl=require('tmpl');
    var replyTmpl='<xml>'+
        '<ToUserName><![CDATA[{toUser}]]></ToUserName>'+
        '<FromUserName><![CDATA[{fromUser}]]></FromUserName>'+
        '<CreateTime><![CDATA[{time}]]></CreateTime>>'+
        '<MsgType><![CDATA[{type}]]></MsgType>>'+
        '<Content><![CDATA[{content}]]></Content>>'+
        '</xml>>';

    return tmpl(replyTmpl,{
        toUser:msg.xml.FromUserName[0],
        fromUser:msg.xml.ToUserName[0],
        type:'text',
        time:Date.now(),
        content:feedback
    });

}
////