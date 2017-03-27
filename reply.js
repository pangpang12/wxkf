var parseStr=require("xml2js").parseString;
parseStr(postdata,function(err,result){
    if (err){
        console.log(err);
        return;
    }
    console.log(result);
})

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
            feedback='位置消息';
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