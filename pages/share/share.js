// pages/share/share.js
import API from "../../requests/api/api.js";
var app = getApp();
const logger = app.logger;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    canvasimgbg: "",
    logoimgbg: "",
    eqimgbg: "",
    headUrl: "",
    checkinCount: '0',
    dateNum: "",
    couseTitle: "",
    wxNickName: "",
    isShow: true,
    windowW: "",
    windowH: "",
    imgsrcData: "",
    canvasHeight: "",
    canvasWidth: "",
    isIphoneX: true,
    fromTxt: "finishCheckin",
    uid: "",
    courseId: "",
    itemId: "",
    imgArr: [],
    qrCodeImg: "",
    couseCoverUrl: "",
    isOwn: false,
    requestCount: 0,
    currentYear: "",
    currentMonth: "",
    currentDate: "",
    weekString: "",
    ranking: "",
    ranking2: '',
    background: "",
    contactFlag: false,
    hasQrcode: false,
    hasImg: false,
    shareTicketPosterPath: "",
    hasCountAndRanking: 0, // 0 还未获取头像、打卡天数  // 1 获取成功  // 2 获取失败
    isHeightPhone: false,
    navHeight: 0,
    modelCount: 0,
    version: 0,
    compositeBackgroundUrl: "",
    pageDate: "",
    subscribed: false,
    myShareCanvasHeight: "",
    myShareCanvasWidth: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    this.data.requestCount = 0;
    var that = this;
    that.setData({
      fromTxt: options.from,
      courseId: options.courseId,
      itemId: options.itemId,
      navHeight: app.globalData.navHeight
    });
    if (options.from == "finishCheckin") {
      var Authorization = app.globalData.Authorization.split("&");
      var uid = Authorization[0];
      that.setData({
        uid: uid
      });
    } else {
      that.setData({
        uid: options.uid
      });
      var Localuid = app.globalData.Authorization.split("&")[0];
      if (Localuid && Localuid == that.data.uid) {
        that.setData({
          isOwn: true
        });
      }
    }

    //扫码打开接收参数courseId uid openNew checkinCount
    // if (options.scene) {
    //   let sceneStr = decodeURIComponent(options.scene);
    //   //&是我们定义的参数链接方式
    //   let courseId = sceneStr.split(",")[0];
    //   let fromTxt = sceneStr.split(",")[1];
    //   let uid = sceneStr.split(",")[2];
    //   that.setData({
    //     courseId: courseId,
    //     uid: uid,
    //     fromTxt: fromTxt
    //   });
    // }
    wx.reportAnalytics("show_share", {
      item: "马上打卡分享页",
      lessonid: that.data.courseId
    });
    wx.getSystemInfo({
      success: function (res) {
        var model = res.model;
        var myCanvasWidth = (640 / 375) * res.screenWidth;
        var myCanvasHeight = (1000 / 667) * res.screenHeight;
        var myShareCanvasWidth = (500 / 375) * res.screenWidth;
        var myShareCanvasHeight = myShareCanvasWidth * 0.8;
        var scale = myCanvasWidth / myCanvasHeight;
        that.setData({
          myShareCanvasWidth: myShareCanvasWidth,
          myShareCanvasHeight: myShareCanvasHeight
        })
        if (scale < 0.64) {
          that.setData({
            canvasWidth: myCanvasWidth,
            canvasHeight: 1000,
            isHeightPhone: true,
          });
        } else {
          that.setData({
            canvasWidth: myCanvasWidth,
            canvasHeight: myCanvasHeight,
          });
        }
      }
    });

    let isIphoneX = app.globalData.isIphoneX;
    that.setData({
      isIphoneX: isIphoneX
    });

    //获取弹框次数
    var courseId = this.data.courseId;
    var count = wx.getStorageSync("count" + courseId)
    if (count) {
      this.data.modelCount = count
    } else {
      this.data.modelCount = 0
    }


  },
  /**
  * 
  * @param {CanvasContext} ctx canvas上下文
  * @param {number} x 圆角矩形选区的左上角 x坐标
  * @param {number} y 圆角矩形选区的左上角 y坐标
  * @param {number} w 圆角矩形选区的宽度
  * @param {number} h 圆角矩形选区的高度
  * @param {number} r 圆角的半径
  */
  roundRect: function (ctx, x, y, w, h, r) {

    // console.log("444")
    // 开始绘制
    ctx.beginPath()
    // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
    // 这里是使用 fill 还是 stroke都可以，二选一即可
    ctx.setFillStyle('white')
    // ctx.setStrokeStyle('transparent')
    // 左上角
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
    // border-top
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.lineTo(x + w, y + r)
    // 右上角
    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)

    // border-right
    ctx.lineTo(x + w, y + h - r)
    ctx.lineTo(x + w - r, y + h)
    // 右下角
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

    // border-bottom
    ctx.lineTo(x + r, y + h)
    ctx.lineTo(x, y + h - r)
    // 左下角
    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

    // border-left
    ctx.lineTo(x, y + r)
    ctx.lineTo(x + r, y)

    // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
    ctx.fill()
    // ctx.stroke()
    ctx.closePath()
    // 剪切
    ctx.clip()
  },
  drawHead: function (ctx, y1, y2) {
    console.log("头像")
    let that = this;
    var width = that.data.canvasWidth;
    var height = that.data.canvasHeight;
    var headerImg = that.data.headerImg;
    var wxNickName = that.data.wxNickName;
    // var wxNickName = "好的名字👌好的名字👌好的名字👌好";
    ctx.save(); //保存当前的绘图上下文。
    ctx.beginPath(); //开始创建一个路径
    ctx.arc(
      (61 / 640) * width,
      (y1 / 1000) * height,
      (28 / 640) * width,
      0,
      2 * Math.PI,
      false
    ); //画一个圆形裁剪区域

    ctx.clip(); //裁剪
    ctx.drawImage(
      headerImg,
      (33 / 640) * width,
      ((y1 - 28) / 1000) * height,
      (56 / 640) * width,
      (56 / 640) * width
    ); //绘制图片
    ctx.restore(); //恢复之前保存的绘图上下文

    //用户昵称
    if (wxNickName.length > 10) {
      var wxNickNameA = wxNickName.substring(0, 10);
      ctx.setFillStyle("#ffffff"); // 文字颜色：黑色
      ctx.setFontSize((28 / 640) * width);
      ctx.setTextAlign("left");
      ctx.fillText(wxNickNameA + '...' + '   正在学习', (105 / 640) * width, (y2 / 1000) * height, 800);
    } else {
      ctx.setFillStyle("#ffffff"); // 文字颜色：黑色
      ctx.setFontSize((28 / 640) * width);
      ctx.setTextAlign("left");
      ctx.fillText(wxNickName + '   正在学习', (105 / 640) * width, (y2 / 1000) * height, 800);
    }
  },

  showPoster: function () {
    console.log("老版本")
    let that = this;
    var width = that.data.canvasWidth;
    var height = that.data.canvasHeight;

    const ctx = wx.createCanvasContext("shareCanvas");
    var canvasimgbg = that.data.canvasimgbg;
    var logoimgbg = that.data.logoimgbg;
    var eqimgbg = that.data.eqimgbg;
    var couseTitle = that.data.couseTitle;
    // var couseTitle = '好的名字好的';
    var qrCodeImg = that.data.qrCodeImg;
    var checkinCount = that.data.checkinCount;
    // var checkinCount = "31";
    // console.log("1111",date1,date2)
    var headerImg = that.data.headerImg;
  try {
    ctx.drawImage(canvasimgbg, 0, 0, width, height);

    //蒙层
    ctx.setFillStyle("rgba(0,0,0,0.2)")
    ctx.fillRect(0, 0, width, height)

    //日期
    ctx.setFillStyle("#ffffff"); // 文字颜色：黑色
    ctx.setFontSize((72 / 640) * width);
    ctx.setTextAlign("left");
    ctx.fillText(that.data.currentDate, (27 / 640) * width, (90 / 1000) * height, 300);
    // ctx.fillText("22", (27 / 640) * width, (90 / 1000) * height, 300);

    ctx.setFillStyle("#ffffff"); // 文字颜色：黑色
    ctx.setFontSize((28 / 640) * width);
    ctx.setTextAlign("left");
    ctx.fillText(that.data.currentYear + '.' + that.data.currentMonth, (30 / 640) * width, (140 / 1000) * height, 300);

    ctx.beginPath()
    ctx.setLineWidth(2)
    ctx.setStrokeStyle('#ffffff');
    ctx.moveTo((30 / 640) * width, (175 / 1000) * height)
    ctx.lineTo((60 / 640) * width, (175 / 1000) * height)
    ctx.stroke()

    // ctx.setFillStyle("#ffffff"); // 文字颜色：黑色
    // ctx.setFontSize((28 / 640) * width); // 文字字号
    // ctx.setTextAlign("left");
    // ctx.fillText(that.data.weekString, (30 / 640) * width, (195 / 1000) * height, 300);
    //logo图片
    ctx.drawImage(
      logoimgbg,
      (490 / 640) * width,
      (28 / 1000) * height,
      (120 / 640) * width,
      (30 / 640) * width
    );
    //课程标题  书中自有黄金屋，书中自有颜如玉
    if (couseTitle.length > 14) {
      this.drawHead(ctx, 532, 543);
      var courseTitleA = couseTitle.substring(0, 14);
      ctx.setFillStyle("#ffffff"); // 文字颜色：黑色
      ctx.setFontSize((38 / 640) * width);
      ctx.setTextAlign("left");
      ctx.fillText(
        '“' + courseTitleA,
        (38 / 640) * width,
        (615 / 1000) * height,
        (560 / 640) * width
      );
      // ctx.fillText(
      //   '“' + courseTitleA,
      //   (38 / 640) * width-0.5,
      //   (615 / 1000) * height,
      //   (560 / 640) * width
      // );
      var courseTitleB = couseTitle.substring(14, couseTitle.length + 1);
      ctx.setFillStyle("#ffffff"); // 文字颜色：黑色
      ctx.setFontSize((38 / 640) * width);
      ctx.setTextAlign("left");
      ctx.fillText(
        courseTitleB + '”',
        (53 / 640) * width,
        (665 / 1000) * height,
        (560 / 640) * width
      );
      // ctx.fillText(
      //   courseTitleB + '”',
      //   (53 / 640) * width - 0.5,
      //   (665 / 1000) * height,
      //   (560 / 640) * width
      // );
    } else {
      this.drawHead(ctx, 575, 586);
      ctx.setFillStyle("#ffffff"); // 文字颜色：黑色
      ctx.setFontSize((38 / 640) * width);
      ctx.setTextAlign("left");
      ctx.fillText(
        '“' + couseTitle + '”',
        (33 / 640) * width,
        (665 / 1000) * height,
        (560 / 640) * width
      );
      // ctx.fillText(
      //   '“' + couseTitle + '”',
      //   (33 / 640) * width,
      //   (665 / 1000) * height - 0.5,
      //   (560 / 640) * width
      // );
    }

    // ctx.save(); //保存当前的绘图上下文。
    // ctx.beginPath(); //开始创建一个路径
    // ctx.arc(
    //   (61 / 640) * width,
    //   ( 532/ 1000) * height,
    //   (28 / 640) * width,
    //   0,
    //   2 * Math.PI,
    //   false
    // ); //画一个圆形裁剪区域

    // ctx.clip(); //裁剪
    // ctx.drawImage(
    //   headerImg,
    //   (33 / 640) * width,
    //   ((532 - 28) / 1000) * height,
    //   (56 / 640) * width,
    //   (56 / 640) * width
    // ); //绘制图片
    // ctx.restore(); //恢复之前保存的绘图上下文


    // 绘制白色圆角边框
    this.roundRect(ctx, 33 / 640 * width, 705 / 1000 * height, 575 / 640 * width, 260 / 1000 * height, 10)

    //绘制二维码
    ctx.drawImage(
      qrCodeImg,
      (470 / 640) * width,
      (842 / 1000) * height,
      (103 / 640) * width,
      (101 / 640) * width
    );
    // console.log("canvasimgbg", canvasimgbg);

    //已打卡天数
    ctx.setFillStyle("#333333"); // 文字颜色：黑色
    ctx.setFontSize((28 / 640) * width); // 文字字号
    ctx.setTextAlign("left");
    ctx.fillText('Ta已坚持打卡', (60 / 640) * width, (770 / 1000) * height, 300);
    // ctx.fillText('Ta已坚持打卡', (60 / 640) * width - 0.5, (770 / 1000) * height, 300);

    ctx.setFillStyle("#F86442"); // 文字颜色：黑色
    ctx.setFontSize((98 / 640) * width); // 文字字号
    ctx.setTextAlign("center");
    ctx.fillText(checkinCount, (110 / 640) * width, (883 / 1000) * height, 150);
    // ctx.fillText(checkinCount, (110 / 640) * width - 0.5, (883 / 1000) * height, 150);

    ctx.setFillStyle("#F86442"); // 文字颜色：黑色
    ctx.setFontSize((34 / 640) * width);
    ctx.setTextAlign("center");
    ctx.fillText("天", (180 / 640) * width, (880 / 1000) * height, 168);

    // 超过了多少人
    ctx.setFillStyle("#999999"); // 文字颜色：黑色
    ctx.setFontSize((24 / 640) * width);
    ctx.setTextAlign("center");
    ctx.fillText("超过了" + that.data.ranking + "的人", (145 / 640) * width, (935 / 1000) * height, 300);
    // ctx.fillText("超过了" + that.data.ranking + "的人", (145 / 640) * width - 0.5, (935 / 1000) * height, 300);

    //长按识别二维码
    ctx.drawImage(
      eqimgbg,
      (405 / 640) * width,
      (745 / 1000) * height,
      (168 / 640) * width,
      (87 / 640) * width
    );

    ctx.setFillStyle("#ffffff"); // 文字颜色：黑色
    ctx.setFontSize((20 / 640) * width); // 文字字号：22px
    ctx.setTextAlign("left");
    ctx.fillText("长按识别二维码", (420 / 640) * width, (780 / 1000) * height, 168);
    ctx.setFillStyle("#ffffff"); // 文字颜色：黑色
    ctx.setFontSize((20 / 640) * width); // 文字字号：22px
    ctx.setTextAlign("left");
    ctx.fillText("跟Ta一起学", (455 / 640) * width, (810 / 1000) * height, 168);

    ctx.draw(
      false,
      setTimeout(function () {
        wx.canvasToTempFilePath({
          canvasId: "shareCanvas",
          success: function (res) {
            console.log("画成功啦吗")
            var tempFilePath = res.tempFilePath;
            that.setData({
              isShow: false,
              imgsrcData: res.tempFilePath,
              imgArr: [res.tempFilePath],
              hasImg: true
            });
            wx.hideLoading();
          },
          fail: function (res) {
            // console.log(res);
            that.setData({
              isShow: false
            });
            wx.hideLoading();
          }
        });
      }, 300)
    );

    } catch (e) {
      let message = {
        'msg': 'showPoster Failed',
        'canvasimgbg': canvasimgbg,
        'logoimgbg': logoimgbg,
        'qrCodeImg': qrCodeImg,
        'headerImg': headerImg,
        'eqimgbg': eqimgbg,
        'e': e.stack
      }
      logger.error(message);
    }

  },

  showShareTicketPoster: function () {
    const ctx = wx.createCanvasContext("shareTicktCanvas");
    var templatePath = "";
    var width = this.data.myShareCanvasWidth;
    var height = this.data.myShareCanvasHeight;
    // 1、画圆角矩形背景图
    ctx.beginPath();
    ctx.save();
    this.roundRect(ctx, 0, 0, width, height, 0);
    ctx.clip();
    ctx.drawImage("/images/shareTicketBg.jpg", 0, 0, width, height);
    ctx.restore();
    // 2、画头像
    ctx.save(); //保存当前的绘图上下文。
    ctx.beginPath(); //开始创建一个路径
    ctx.setStrokeStyle("white");
    ctx.setLineWidth(3 * 2 / 500 * width);
    ctx.arc((99 + 26) * 2 / 500 * width, 26 * 2 / 500 * width, 26 * 2 / 500 * width, 0, 2 * Math.PI, false); //画一个圆形裁剪区域
    ctx.setFillStyle("white");
    ctx.stroke();
    ctx.fill();
    ctx.clip(); //裁剪
    ctx.drawImage(this.data.headerImg, 99 * 2 / 500 * width, 0, 52 * 2 / 500 * width, 52 * 2 / 500 * width); //绘制图片
    ctx.restore(); //恢复之前保存的绘图上下文
    // 3、打卡天数、超过人数（数量）
    ctx.setFontSize(30 * 2 / 500 * width);
    ctx.setFillStyle("#fff");
    ctx.setTextAlign('center');
    ctx.fillText(this.data.checkinCount, 69 * 2 / 500 * width, 120 * 2 / 500 * width, 125 / 500 * width)
    ctx.fillText(this.data.ranking, 180 * 2 / 500 * width, 120 * 2 / 500 * width, 125 * 2 / 500 * width);
    let that = this;
    // ctx.scale(ratio,ratio);
    ctx.draw(false, setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'shareTicktCanvas',
        success: function (res) {
          console.log("自定义分享卡片图画成功了！");
          that.setData({
            shareTicketPosterPath: res.tempFilePath
          })
        },
        fail: function (err) {
          console.log(err);
        },
        complete: function (res) {
        }
      }, this)
    }, 100));
  },
  showNewPoster: function () {
    console.log("新版本开始画图啦")
    let that = this;
    var width = that.data.canvasWidth;
    var height = that.data.canvasHeight;

    const ctx = wx.createCanvasContext("shareCanvas");
    var canvasimgbg = that.data.canvasimgbg;
    var logoimgbg = that.data.logoimgbg;
    var eqimgbg = that.data.eqimgbg;
    var couseTitle = that.data.couseTitle;
    // var couseTitle = '好的名字好的';
    var qrCodeImg = that.data.qrCodeImg;
    var checkinCount = that.data.checkinCount;
    // var checkinCount = "31";
    // console.log("1111",date1,date2)
    var headerImg = that.data.headerImg;

    var wxNickName = that.data.wxNickName;
    var pageDate = that.data.pageDate;
    // console.log("headerImg", headerImg)
  try {
    ctx.drawImage(canvasimgbg, 0, 0, width, height);

    //已打卡天数
    ctx.setFillStyle("#333333"); // 文字颜色：黑色
    ctx.setFontSize((28 / 640) * width);
    ctx.setTextAlign("left");
    ctx.fillText(wxNickName, (166 / 640) * width, (610 / 1000) * height, 300);

    ctx.setFillStyle("#666666"); // 文字颜色：黑色
    ctx.setFontSize((20 / 640) * width);
    ctx.setTextAlign("left");
    ctx.fillText(pageDate + " 已坚持打卡", (166 / 640) * width, (645 / 1000) * height, 300);

    ctx.setFillStyle("#F86442");
    ctx.setFontSize((60 / 640) * width);
    ctx.setTextAlign("center");
    ctx.fillText(checkinCount, (160 / 640) * width, (770 / 1000) * height, 70);
    // ctx.fillText("34", (160 / 640) * width, (770 / 1000) * height, 70);

    ctx.setFillStyle("#F86442"); // 文字颜色：黑色
    ctx.setFontSize((28 / 640) * width);
    ctx.setTextAlign("center");
    ctx.fillText("天", (215 / 640) * width, (770 / 1000) * height);


    ctx.setFillStyle("#F86442"); // 文字颜色：黑色
    ctx.setFontSize((60 / 640) * width);
    ctx.setTextAlign("center");
    ctx.fillText(that.data.ranking2, (460 / 640) * width, (770 / 1000) * height);

    ctx.setFillStyle("#F86442"); // 文字颜色：黑色
    ctx.setFontSize((28 / 640) * width);
    ctx.setTextAlign("center");
    ctx.fillText("%", (525 / 640) * width, (770 / 1000) * height);
    ctx.drawImage(
      qrCodeImg,
      (510 / 640) * width,
      (872 / 1000) * height,
      (103 / 640) * width,
      (101 / 640) * width
    );



    ctx.save(); //保存当前的绘图上下文。
    ctx.beginPath(); //开始创建一个路径

    ctx.setStrokeStyle("white");
    ctx.setLineWidth(8 / 640 * width);

    ctx.arc(
      (100 / 640) * width,
      (605 / 1000) * height,
      (55 / 640) * width,
      0,
      2 * Math.PI,
      false
    ); //画一个圆形裁剪区域

    ctx.setFillStyle("#ffffff");
    // ctx.restore(); 
    ctx.stroke();
    ctx.fill();

    ctx.clip(); //裁剪
    ctx.drawImage(
      headerImg,
      (45 / 640) * width,
      (550 / 1000) * height,
      (110 / 640) * width,
      (110 / 640) * width
    ); //绘制图片
    ctx.restore(); //恢复之前保存的绘图上下文


    //绘制二维码
    // ctx.drawImage(
    //   qrCodeImg,
    //   (470 / 640) * width,
    //   (842 / 1000) * height,
    //   (103 / 640) * width,
    //   (101 / 640) * width
    // );
    // console.log("canvasimgbg", canvasimgbg);


    // ctx.setFillStyle("#F86442"); // 文字颜色：黑色
    // ctx.setFontSize((98 / 640) * width); // 文字字号
    // ctx.setTextAlign("center");
    // ctx.fillText(checkinCount, (110 / 640) * width, (883 / 1000) * height, 150);
    // ctx.fillText(checkinCount, (110 / 640) * width - 0.5, (883 / 1000) * height, 150);

    // ctx.setFillStyle("#F86442"); // 文字颜色：黑色
    // ctx.setFontSize((34 / 640) * width); // 文字字号：22px
    // ctx.setTextAlign("center");
    // ctx.fillText("天", (180 / 640) * width, (880 / 1000) * height, 168);

    // 超过了多少人
    // ctx.setFillStyle("#999999"); // 文字颜色：黑色
    // ctx.setFontSize((24 / 640) * width); // 文字字号：22px
    // ctx.setTextAlign("center");
    // ctx.fillText("超过了" + that.data.ranking + "的人", (145 / 640) * width, (935 / 1000) * height, 300);
    // ctx.fillText("超过了" + that.data.ranking + "的人", (145 / 640) * width - 0.5, (935 / 1000) * height, 300);

    //长按识别二维码

    // ctx.setFillStyle("#ffffff"); // 文字颜色：黑色
    // ctx.setFontSize((20 / 640) * width); // 文字字号：22px
    // ctx.setTextAlign("left");
    // ctx.fillText("长按识别二维码", (420 / 640) * width, (780 / 1000) * height, 168);
    // ctx.setFillStyle("#ffffff"); // 文字颜色：黑色
    // ctx.setFontSize((20 / 640) * width); // 文字字号：22px
    // ctx.setTextAlign("left");
    // ctx.fillText("跟Ta一起学", (455 / 640) * width, (810 / 1000) * height, 168);

    ctx.draw(
      false,
      setTimeout(function () {
        wx.canvasToTempFilePath({
          canvasId: "shareCanvas",
          success: function (res) {
            console.log("画成功啦吗")
            var tempFilePath = res.tempFilePath;
            that.setData({
              isShow: false,
              imgsrcData: res.tempFilePath,
              imgArr: [res.tempFilePath],
              hasImg: true
            });
            wx.hideLoading();
          },
          fail: function (res) {
            // console.log(res);
            that.setData({
              isShow: false
            });
            wx.hideLoading();
          }
        });
      }, 300)
    );

    } catch (e) {
      let message = {
        'msg': 'showPoster Failed',
        'canvasimgbg': canvasimgbg,
        'qrCodeImg': qrCodeImg,
        'headerImg': headerImg,
        'e': e.stack
      }
      logger.error(message);
    }

  },

  saveImage(filePath) {
    var that = this;
    wx.reportAnalytics("save_btn", {
      srcpage: "马上打卡分享页",
      srcmodule: "bottomTool",
      item: "button",
      itemid: "保存图片",
      lessonid: that.data.courseId
    });
    wx.saveImageToPhotosAlbum({
      filePath: filePath, // 此为图片路径
      success: res => {
        if (app.globalData.isIphone) {
          wx.showToast({
            title: "图片保存成功",
            icon: "none",
            duration: 2000
          });
        }
      },
      fail: err => {
        // console.log(err)
      }
    });
  },

  saveImgToPhotosAlbumTap: function () {
    let self = this;
    // 相册授权
    wx.getSetting({
      success(res) {
        // 进行授权检测，未授权则进行弹层授权
        if (typeof res.authSetting["scope.writePhotosAlbum"] != "undefined") {
          // console.log("222")
          if (res.authSetting["scope.writePhotosAlbum"] == true) {
            if (self.data.hasImg == true) {
              self.saveImage(self.data.imgsrcData);
            } else {
              wx.showLoading({
                title: "正在保存中..."
              });
              let tempTimer2 = setInterval(() => {
                // console.log("次数", self.data.hasImg)
                if (self.data.hasImg == true) {
                  wx.hideLoading();
                  // console.log("4次啦", this.data.requestCount)
                  self.saveImage(self.data.imgsrcData);
                  clearInterval(tempTimer2);
                }
                if (self.data.requestCount >= 1000) {
                  self.data.requestCount = 0;
                  wx.hideLoading();
                  clearInterval(tempTimer2);
                }
              }, 50);
            }
          } else if (res.authSetting["scope.writePhotosAlbum"] == false) {
            wx.showModal({
              content:
                "检测到您没打开马上打卡小程序访问相册的权限，是否去设置打开？",
              confirmText: "确认",
              cancelText: "取消",
              success: function (res) {
                //点击“确认”时打开设置页面
                if (res.confirm) {
                  console.log("用户点击确认");
                  wx.openSetting({
                    success: res => { }
                  });
                } else {
                  console.log("用户点击取消");
                }
              }
            });
          }
        } else {
          wx.authorize({
            scope: "scope.writePhotosAlbum",
            success() {
              //这里是用户同意授权后的回调
              self.saveImage(self.data.imgsrcData);
            },
            fail() {
              //这里是用户拒绝授权后的回调
            }
          });
        }
      },
      fail(res) {
        console.log(res);
      }
    });

  },

  toSignIn: function () {
    wx.navigateTo({
      url: "../../pages/signIn/signIn?courseId=" + this.data.courseId
    });
    // if (this.data.hasQrcode == true){
    //   this.setData({
    //     contactFlag: true
    //   })
    // }else{
    //   wx.navigateTo({
    //     url: "../../pages/signIn/signIn?courseId=" + this.data.courseId
    //   });
    // }
  },
  hideContact() {
    this.setData({
      contactFlag: false
    })
  },
  cancelContact: function () {
    console.log("取消")
    this.setData({
      contactFlag: this.data.contactFlag == true ? false : true
    })
  },
  getUserInfo: function () {
    var that = this;
    API.checkInShare(
      { uid: that.data.uid, courseId: that.data.courseId },
      false
    ).then(res => {
      if (res.statusCode == 200) {
        // res.data.pushQrCode = true
        that.setData({
          headUrl: res.data.wxHeadImage,
          couseTitle: res.data.couseTitle || "",
          checkinCount: res.data.checkinCount && res.data.checkinCount.toString() || '0',
          wxNickName: res.data.wxNickName || "",
          couseCoverUrl: res.data.couseCoverUrl,
          background: res.data.background || 'https://fdfs.xmcdn.com/group52/M08/6F/88/wKgLe1wHpnXxPw1KAANeiUsKnVw366.png',
          ranking: res.data.ranking,
          weekString: res.data.weekString,
          version: res.data.version,
          compositeBackgroundUrl: res.data.compositeBackgroundUrl || "",
          subscribed: res.data.subscribed
          // hasQrcode: res.data.pushQrCode
          // hasQrcode: true
        });
        console.log("得到的版本号", this.data.version)
        if (res.data.currentDate) {
          that.setData({
            currentYear: res.data.currentDate.split("-")[0],
            currentMonth: res.data.currentDate.split("-")[1],
            currentDate: res.data.currentDate.split("-")[2],
            pageDate: res.data.currentDate.replace(/-/g, '.')
          })
          // console.log(that.data.currentMonth)
        }
        //下载头像图片
        wx.downloadFile({
          url: that.data.headUrl,
          success(res) {
            // console.log("这是头像", res)
            if (res.statusCode === 200) {
              that.setData({
                headerImg: res.tempFilePath
              });
              that.data.requestCount++;
              that.data.hasCountAndRanking = 1;
              // console.log("背景图的临时地址", that.data.canvasimgbg)
            }
            
          },
          fail(res) {
            let message = {
              'msg': 'download headImg Failed',
              'headImgUrl': that.data.headUrl,
              'res': res
            }
            logger.error(message);
            wx.showToast({
              title: "头像图片错误",
              icon: "none"
            });
            that.data.requestCount += 1000;
            this.data.hasCountAndRanking = 2;
            that.setData({
              isShow: false
            });
          }
        });

        //根据版本号判断背景图片
        if (that.data.version == 1) {
          wx.downloadFile({
            url: that.data.background,
            // url: 'https://fdfs.xmcdn.com/group52/M08/6F/88/wKgLe1wHpnXxPw1KAANeiUsKnVw366.png',
            success(res) {
              // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
              // console.log("这是背景图", res)
              if (res.statusCode === 200) {
                that.setData({
                  canvasimgbg: res.tempFilePath
                });
                that.data.requestCount++;
                // console.log("背景图的临时地址", that.data.canvasimgbg)
              }
              
            },
            fail(res) {
              let message = {
                'msg': 'download backgroundUrl Failed',
                'backgroundUrl': that.data.background,
                'res': res
              }
              logger.error(message);
              wx.showToast({
                title: "背景图片下载错误",
                icon: "none"
              });
              that.data.requestCount += 1000;
            }
          });
          wx.downloadFile({
            url: "https://fdfs.xmcdn.com/group54/M05/1B/E8/wKgLfVwGGTaAFaCJAAADbLQRwtA720.png",
            success(res) {
              // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
              // console.log("22222222222222", res)
              if (res.statusCode === 200) {
                that.setData({
                  logoimgbg: res.tempFilePath
                });
                that.data.requestCount++;
              }
            },
            fail(res) {
              // console.log(res)
              that.data.requestCount += 1000;
            }
          });

          wx.downloadFile({
            url:
              "https://fdfs.xmcdn.com/group52/M00/20/70/wKgLe1wGKGiBJ5P8AAADwPl27Uw378.png",
            success(res) {
              // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
              // console.log("这是二维码上面的框框")
              if (res.statusCode === 200) {
                that.setData({
                  eqimgbg: res.tempFilePath
                });
                that.data.requestCount++;
              }
            },
            fail(res) {
              console.log(res)
              that.data.requestCount += 1000;
            }
          });
        } else {
          this.setData({
            ranking2: this.data.ranking.substring(0, this.data.ranking.length - 1),
          })
          console.log("背景图图片地址", that.data.compositeBackgroundUrl)
          wx.downloadFile({
            url: that.data.compositeBackgroundUrl,
            // url: 'https://fdfs.xmcdn.com/group52/M08/6F/88/wKgLe1wHpnXxPw1KAANeiUsKnVw366.png',
            success(res) {
              // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
              console.log("第二版本的背景图下载", res)
              if (res.statusCode === 200) {
                that.setData({
                  canvasimgbg: res.tempFilePath
                });
                that.data.requestCount++;
                // console.log("背景图的临时地址", that.data.canvasimgbg)
              }
              
            },
            fail(res) {
              let message = {
                'msg': 'download compositeBackgroundUrl Failed',
                'compositeBackgroundUrl': that.data.compositeBackgroundUrl,
                'res': res
              }
              logger.error(message);
              wx.showToast({
                title: "背景图片下载错误",
                icon: "none"
              });
              that.data.requestCount += 1000;
            }
          });
        }
        //下载二维码图片
        wx.downloadFile({
          url: res.data.wsQrCode,
          success(res) {
            // console.log("33333")
            if (res.statusCode === 200) {
              that.setData({
                qrCodeImg: res.tempFilePath
              });
              that.data.requestCount++;
              // console.log("背景图的临时地址", that.data.canvasimgbg)
            }
            
            // that.getPosterInfo()
          },
          fail(res) {
            wx.showToast({
              title: "二维码图片图片下载错误",
              icon: "none"
            });
            that.data.requestCount += 1000;
          }
        });

      } else {
        that.data.requestCount += 1000;
      }
    })
      .catch(res => {
        that.setData({
          isShow: false
        });
        that.data.requestCount += 1000;
      });
  },
  getPosterInfo: function () {
    console.log("获取分享信息")
    var that = this;
    that.getUserInfo();
  },
  toLessonDetail: function () {
    var that = this;
    wx.navigateTo({
      url: '/pages/learning/lessonDetails/lessonDetails?clear=true&courseId=' + that.data.courseId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */

  onReady: function () {
    let that = this;
    // this.getPosterInfo();
    // this.initPoster();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getPosterInfo();
    this.initPoster();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.showPoster = null;
    this.toSignIn = null;
    this.saveImage = null;
    this.getPosterInfo = null;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  /**
   * 生命周期函数-监听页面下拉
   */
  // onPullDownRefresh: function() {
  //   this.getPosterInfo();
  //   this.initPoster();
  //   wx.stopPullDownRefresh();
  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },
  previewImg: function (e) {
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.imgArr;
    wx.previewImage({
      current: imgArr[index], //当前图片地址
      urls: imgArr, //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { }
    });
  },
  initPoster() {
    var that = this;
    // console.log("版本号", that.data.version)
    let tempTimer = setInterval(() => {
      // console.log("次数", this.data.requestCount)
      if (this.data.requestCount >= 1000) {
        this.data.requestCount = 0;
        wx.hideLoading();
        clearInterval(tempTimer);
      } else if (this.data.requestCount >= 3) {
        if (this.data.version == 1) {
          if (this.data.requestCount == 5) {
            this.showPoster();
            // console.log("5次啦", this.data.requestCount)
            this.data.requestCount = 0;
            clearInterval(tempTimer);
          }
        } else {
          this.showNewPoster();
          this.data.requestCount = 0;
          clearInterval(tempTimer);
        }
      }
    }, 50);
    let tempTimer2 = setInterval(() => {
      if (this.data.hasCountAndRanking === 1) {
        this.data.hasCountAndRanking = 0;
        clearInterval(tempTimer2);
        this.showShareTicketPoster();
      } else if (this.data.hasCountAndRanking === 2) {
        this.data.hasCountAndRanking = 0;
        clearInterval(tempTimer2);
      }
    }, 50);
  },
  clickOpen: function () {
    this.setData({
      contactFlag: false
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    wx.reportAnalytics("click_sharebtn", {
      srcpage: "马上打卡分享页",
      srcmodule: "more",
      item: "button",
      itemid: "share",
      lessonid: that.data.courseId
    });
    console.log("分享了分享了分享了吗算了就当你分享了", that.data.itemId)

    API.shareRecord(
      {
        courseId: that.data.courseId,
        topicItemRef: that.data.itemId
      },
      false
    ).then(res => {
      if (this.data.modelCount < 3 && this.data.subscribed == false) {
        this.setData({
          contactFlag: true
        })
        this.data.modelCount++;
        wx.setStorageSync("count" + this.data.courseId, this.data.modelCount)
      }
      console.log("分享成功")
    }).catch(res => {
      console.log("分享失败", res)
    });
    wx.showShareMenu({
      withShareTicket: true
    });
    if (!that.data.shareTicketPosterPath){
      let message = {
        'msg': '自定义的分享卡片shareTicketPosterPath',
        'shareTicketPosterPath': that.data.shareTicketPosterPath
      }
      logger.error(message);
    }
    if (!that.data.couseCoverUrl) {
      let message = {
        'msg': '老版本课程封面分享couseCoverUrl',
        'couseCoverUrl': that.data.couseCoverUrl
      }
      logger.error(message);
    }
    return {
      title:
        `我正在学习「${that.data.couseTitle}」`,
      // imageUrl: that.data.imgsrcData,
      path:
        "/pages/share/share?courseId=" + that.data.courseId + "&from=openNew&uid=" + that.data.uid,
      imageUrl: that.data.shareTicketPosterPath || that.data.couseCoverUrl
    };

  }
});
