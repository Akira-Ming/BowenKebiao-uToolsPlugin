let request = require("request");
let cheerio = require("cheerio");
// let fs = require('fs');
// let htmlData;
let cookies;
// 开学第一周
const FIRST_WEEK_YEAR = 2020; //年
const FIRST_WEEK_MONTH = 3; // 月
const FIRST_WEEK_DATE = 2; // 日

utools.onPluginReady(() => {
  // console.log('插件初始化完成')
  login();
  {
    let i = getTodayWeek();
    obj = document.getElementById("zc");
    obj[i].selected = true;
  }
});

// utools.onPluginEnter(({ code, type, payload }) => {
//     // login();
//     console.log('用户进入插件', code, type, payload)
//     window.loadingKeBiao(7, '2019-2020-2');
//     document.getElementById('Form1').submit();

// })

function login() {
  //登陆post地址
  let url = "http://54.222.196.251:81/gllgdxbwglxy_jsxsd/xk/LoginToXk";
  //登陆的用户邮箱和密码
  let loginEncode = "*******************";
  //登陆post的所有数据form data
  let datas = {
    encoded: loginEncode,
  };

  //设置头部
  let headers = {
    "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36`,
  };

  let opts = {
    url: url,
    method: "POST",
    headers: headers,
    form: datas,
  };

  //模拟登陆
  request(opts, (e, r, b) => {
    cookies = r.headers["set-cookie"];
    // console.log(cookies);
    window.loadingKeBiao(getTodayWeek(), "2019-2020-2");
    // console.log(r.headers['set-cookie']);
    // console.log(cookies);
  });
}

loadingKeBiao = (zcxx, xnxq01idxx) => {
  // if (dealWithAsynchronous) {
  let opts = {
    url: "http://54.222.196.251:81/gllgdxbwglxy_jsxsd/xskb/xskb_list.do",
    method: "POST",
    headers: {
      "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36`,
      Cookie: cookies, //这里是登陆后得到的cookie,(重点)
    },
    form: {
      zc: zcxx,
      xnxq01id: xnxq01idxx,
    },
  };
  // console.log(cookies);
  request(opts, (e, r, b) => {
    if (e) {
      console.log(e.message);
    } else {
      let $ = cheerio.load(b);
      $(".Nsb_pw").each(function () {
        // 先获取内部元素
        var _dom = $(this).html();

        $(this).after(_dom).remove();
      });
      $(".Nsb_top").remove();
      $(".Nsb_menu_pw").remove();
      $(".Nsb_rights").remove();
      $(".Nsb_r_title").remove();
      $("#LeftMenu1_divChildMenu").remove();
      $(".Nsb_layout_r").each(function () {
        // 先获取内部元素
        var _dom = $(this).html();

        $(this).after(_dom).remove();
      });
      $("#zc").remove();
      $("#xnxq01id").remove();
      $(".button").remove();
      $("#sfFD").remove();

      let html = $("body").html();
      html = html.replace(/&#x5468;&#x6B21;&#xFF1A;/gi, ""); //周次
      html = html.replace(
        /&#x5B66;&#x5E74;&#x5B66;&#x671F;&#xFF1A;&#xA0;&#xA0;/gi,
        ""
      ); //学年学期：
      html = html.replace(/&#x653E;&#x5927;/gi, "");
      html = html.replace(/<div(\s*)>([\s\S]*?)<\/div>/gi, "$2");

      document.getElementById("test").innerHTML = html;
      return html;
    }
  });
};

function getTodayWeek() {
  let todaySchoolWeek =
    getNewYearWeek() -
    getYearWeek(FIRST_WEEK_YEAR, FIRST_WEEK_MONTH, FIRST_WEEK_DATE) +
    1;
  return todaySchoolWeek;
}

var getYearWeek = function (a, b, c) {
  /*  
    date1是当前日期  
    date2是当年第一天  
    d是当前日期是今年第多少天  
    用d + 当前年的第一天的周差距的和在除以7就是本年第几周  
    */
  var date1 = new Date(a, parseInt(b) - 1, c),
    date2 = new Date(a, 0, 1),
    d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
  return Math.ceil((d + (date2.getDay() + 1 - 1)) / 7);
};

var getNewYearWeek = function () {
  let date3 = new Date();
  let a = date3.getFullYear();
  let b = date3.getMonth() + 1;
  let c = date3.getDate();
  let date1 = new Date(a, parseInt(b) - 1, c),
    date2 = new Date(a, 0, 1),
    d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
  return Math.ceil((d + (date2.getDay() + 1 - 1)) / 7);
};
