let eventproxy = require('eventproxy');
let superagent = require('superagent');
let cheerio = require('cheerio');
let express = require('express');
let url = require('url');
let cdfx = "https://www.cdfangxie.com";
let pageUrls = [];


// 生成页面链接
for (let i = 1; i <= 26; i++) {
  let pageUrl = "https://www.cdfangxie.com/Infor/type/typeid/36.html?&p=" + i;
  pageUrls.push(pageUrl);
}


let app = express();

app.get('/', function (req, res) {
  // 使用eventproxy库
  var ep = new eventproxy();
  // ep重复监听pageUrls.length次
  ep.after('page_html', pageUrls.length, function (topics) {
    topics = topics.map(function (topicPair) {
      var pageHtml = topicPair[0]; //页面HTML

      var $ = cheerio.load(pageHtml);
      var projectItem = []; //房产项目详情

      $('.ul_list a').each(function (idx, element) {
        var $element = $(element);
        projectItem.push({
          title: $element.attr('title'),
          href: url.resolve(cdfx, $element.attr('href'))
        })
      });

      return projectItem;
    });

    res.send(topics);
  });

  // 并发抓取每个页面
  pageUrls.forEach(function (pageUrl) {
    superagent.get(pageUrl).end(function (err, sres) {
      if (err) {
        console.err(err);
      }

      ep.emit('page_html', [sres.text]);
    });
  });
});

app.listen(3000, function(){
  console.log('app is listening at port 3000');
})