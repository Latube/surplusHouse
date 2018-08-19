// let express = require('express');
let superagent = require('superagent');
let cheerio = require('cheerio');
let url = require('url');
let cdfx = "https://www.cdfangxie.com";
let topicUrls = [];
// var app = express();

for (let i = 1; i <= 26; i++) {
  var pageUrl = "https://www.cdfangxie.com/Infor/type/typeid/36.html?&p=" + i;
  superagent.get(pageUrl).end(function (err, sres) {
    if (err) {
      console.err(err);
    }

    /**
     * 爬取预售楼盘详情的链接和区域
     */
    let $ = cheerio.load(sres.text);
    $('.ul_list a').each(function (idx, element) {
      let $element = $(element);      
      topicUrls.push({
        href: url.resolve(cdfx, $element.attr('href')),
        zone: $element.attr('title')
      });
    });

    console.log(topicUrls);
  });
}