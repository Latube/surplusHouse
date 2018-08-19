let eventproxy = require('eventproxy');
let superagent = require('superagent');
let cheerio = require('cheerio');
let url = require('url');
let cdfx = "https://www.cdfangxie.com";
let pageUrls = [];


// 生成页面链接
for (let i = 1; i <= 26; i++) {
  let pageUrl = "https://www.cdfangxie.com/Infor/type/typeid/36.html?&p=" + i;
  pageUrls.push(pageUrl);
}



// 使用eventproxy库
var ep = new eventproxy();
// ep重复监听pageUrls.length次
ep.after('page_html', pageUrls.length, function (topics) {
  var projectItems = []; //存取项目详情的数组
  topics = topics.map(function (topicPair) {
    var pageHtml = topicPair[0]; //页面HTML    

    var $ = cheerio.load(pageHtml);
    var projectItem = []; //房产项目详情

    $('.ul_list a').each(function (idx, element) {
      var $element = $(element);
      projectItem.push({
        zone: $element.attr('title').split('|')[0],
        projectName: $element.attr('title').split('|')[1],
        href: url.resolve(cdfx, $element.attr('href'))
      })
    });

    return projectItem;
  });
  // 存取项目详情
  projectItems = [].concat.apply([], topics);

  // 为每个projectItem增加区域编码
  projectItems.forEach(function (element) {
    switch (element.zone) {
      case "锦江区":
        element.zoneCode = "004";
        break;
      case "青羊区":
        element.zoneCode = "005";
        break;
      case "金牛区":
        element.zoneCode = "006";
        break;
      case "武侯区":
        element.zoneCode = "007";
        break;
      case "成华区":
        element.zoneCode = "008";
        break;
      case "高新南区":
        element.zoneCode = "009";
        break;
      case "高新西区":
        element.zoneCode = "010";
        break;
      case "高新东区":
        element.zoneCode = "011";
        break;
      case "龙泉驿区":
        element.zoneCode = "012";
        break;
      case "青白江区":
        element.zoneCode = "013";
        break;
      case "新都区":
        element.zoneCode = "014";
        break;
      case "温江区":
        element.zoneCode = "015";
        break;
      case "金堂县":
        element.zoneCode = "021";
        break;
      case "双流区":
        element.zoneCode = "022";
        break;
      case "郫都区":
        element.zoneCode = "024";
        break;
      case "大邑县":
        element.zoneCode = "029";
        break;
      case "蒲江县":
        element.zoneCode = "031";
        break;
      case "新津县":
        element.zoneCode = "032";
        break;
      case "天府新区":
        element.zoneCode = "042";
        break;
      case "简阳市":
        element.zoneCode = "080";
        break;
      case "都江堰市":
        element.zoneCode = "081";
        break;
      case "彭州市":
        element.zoneCode = "082";
        break;
      case "邛崃市":
        element.zoneCode = "083";
        break;
      case "崇州市":
        element.zoneCode = "084";
        break;
      default:
        element.zoneCode = "不存在";
    }





  });

  // 为每个projectItem增加presellNum与tel
  var projectUrls = []
  projectItems.forEach(function (element) {
    projectUrls.push(element.href);
  });

  ep.after('project_html', projectUrls.length, function (topics) {
    topics = topics.map(function (topicPair) {
      var topicUrl = topicPair[0];
      var topicHtml = topicPair[1];
      // console.log(topicHtml);
      var $ = cheerio.load(topicHtml);
      var projectInfo = [];

      $('div.infor p').each(function(idx, element){
        var $element = $(element);
        if(idx == 0){
          projectInfo.push({
            projectName: $element('b>span>span').text()
          })
        }
      })
      
      
      
      return projectInfo;
    })

    console.log(topics);
  })




  projectItems.forEach(function (element) {
    var projectUrl = element.href;
    superagent.get(projectUrl).end(function (err, sres) {
      if (err) {
        console.err(err);
      }

      ep.emit('project_html', [projectUrl, sres.text]);
    });
  })


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