var http=require('http');
var fs=require('fs');
var cheerio=require('cheerio');

http.get("http://www.ss.pku.edu.cn/index.php/newscenter/news",function (res) {
    var html='';
    var news=[];
    res.setEncoding('utf-8');

    res.on('data',function (chunk) {
        html+=chunk;

    });

    res.on('end',function () {
        //console.log(html);
        var $=cheerio.load(html);

        $('#info-list-ul li').each(function (index,item) {
            var new_item={
                title:$('.info-title',this).text(),
                time:$('.time',this).text(),
                link:'http://www.ss.pku.edu.cn'+$('a',this).attr('href'),
            };
            news.push(new_item);

        });
        console.log(news);
        saveData('data/data.json',news);

    });

}).on('error',function (err) {
    console.log(err);

});

function saveData(path,news) {
    fs.writeFile(path,JSON,stringify(news,null,4),function (err) {
        if (err){
            return console.log(err);
        }
        console.log("Data saved");

    });

}