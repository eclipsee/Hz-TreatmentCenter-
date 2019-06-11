import Player from "../commen/player/Player.js";
// pages/activityDetail/activityDetail.js
import API from '../../requests/api/api.js';
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp();
Page({
  type:"activityDetail",
  /**
   * 页面的初始数据
   */
  data: {
    courseId:"",
    checkinCount:0,
    isOver:false,
    name:"",
    startTime:"",
    endTime:"",
    targetCount:0,
    awardDesc:"",
    id:"",
    isIphoneX:false,
    percentStyle:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.player = new Player(this);
    if (options){
      this.setData({
        courseId: options.courseId
      })
    }
    let isIphoneX = app.globalData.isIphoneX;
    this.setData({
      isIphoneX: isIphoneX,
      navHeight: app.globalData.navHeight
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getActivity();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  getActivity:function(){
    API.activityDetail({ courseId: this.data.courseId }).then(res => {
      if (res.statusCode == 200) {
        this.setData({
          checkinCount: res.data.checkinCount || 0,
          isOver: res.data.isOver,
          name: res.data.name,
          // name: "有没有三十四有没有三十四有没有三十四有没有三十四有没有三十四有没有三",
          targetCount: res.data.targetCount,
          awardDesc: res.data.awardDesc,
          id: res.data.id
        })
        // console.log("count",this.data.checkinCount )
        if (this.data.checkinCount == 0){
          this.setData({
            percentStyle: "width:0%"
          })
        }else{
          this.setData({
            percentStyle: "width:" + this.data.checkinCount / this.data.targetCount*100 + "%"
          })
        }

        if(this.data.name.length > 29){
          this.setData({
            name: this.data.name.substr(0, 29) + '...'
          })
        }
        if (res.data.startTime){
          var startTime1 = res.data.startTime.split(" ")[0];
          var startTime = startTime1.replace(/-/g, '/') || "";
          this.setData({
            startTime: startTime
          })
        }
        if (res.data.endTime) {
          var endTime1 = res.data.endTime.split(" ")[0];
          var endTime = endTime1.replace(/-/g, '/') || "";
          this.setData({
            endTime: endTime
          })
        }
        var article = res.data.awardDesc;
        // var article = "<a href='https://www.baidu.com' > <img src='http://fdfs.test.ximalaya.com/group1/M01/F9/D6/wKgD3lwPgZyARLr9AANeiUsKnVw014.png'/> </a>"
        // var article = "<a href='https://www.baidu.com' >baidu  </a>"
        // var article = "<img src='http://fdfs.test.ximalaya.com/group1/M01/F9/D6/wKgD3lwPgZyARLr9AANeiUsKnVw014.png'/>"
        WxParse.wxParse('article', 'html', article, this, 5);
      } else {
        
      }
    }).catch(res => {
      console.log(res);
    });
  },
  toLessonDetail: function () {
    var that = this;
    wx.reLaunch({
      url: '/pages/learning/lessonDetails/lessonDetails?clear=true&courseId=' + that.data.courseId
    })
    console.log("马上打卡按钮")
  },
  //a标签跳转事件
  // wxParseTagATap: function (e) {
  //   var href = e.currentTarget.dataset.src;
  //   console.log(href);
  //   //我们可以在这里进行一些路由处理
  //   if (href.length > 0) {
  //     //跳转的方法根据项目需求的不同自己替换，也可以加参数，
  //     wx.redirectTo({
  //       url: href
  //     })
  //   }
  // },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.toLessonDetail = null;
    this.getActivity = null;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})