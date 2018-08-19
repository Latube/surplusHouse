let express = require('express');
let cheerio = require('cheerio');
let superagent = require('superagent');
var url = "https://gfdj.cdfgj.gov.cn/lottery/accept/surplusHouse";

// 初始化server
var app = new express();
/**
 * 接口：返回房协网查到的结果
 * 接口的属性分别是：
 * zone: 区域
 * projectName: 项目名称
 * presellNum:　预售号
 * tel:　联系方式
 */
app.get('/', function(req, res){
  superagent.post(url).send('regioncode=042').send('licence=101373').end(function(err, sres){
    if(err){
      console.err(err);
    };

    var $ = cheerio.load(sres.text);
    var items = [];
    $('#_projectInfo tr td').each(function(idx, element){
      let $element = $(element);
      if(idx==2){
        items.push({
          zone:$element.text()
        })
      }else if(idx==3){
        items[0].projectName = $element.text();
      }else if(idx==4){
        items[0].presellNum = $element.text();
      }else if(idx==5){
        items[0].tel = $element.text();
      }
    });

    res.send(items);
  });
});

app.listen(3000, function(){
  console.log('app is listening at port 3000');
});