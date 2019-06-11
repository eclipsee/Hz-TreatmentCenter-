// pages/signIn/signIn.js
import API from '../../requests/api/api.js';
var WxParse = require('../../wxParse/wxParse.js');
import Util from '../../utils/util.js';
var app = getApp();
const logger = app.logger;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX:false, 
    courseId:'',
    description:"",
    isJoined:true,
    title:'',
    shortDesc:'',
    coverUrl:'',
    status:'',
    isLogin:false,
    formId:"",
    wxAccount:"",
    pagetype:"",
    actionType:0,
    navHeight:0
  },
  onLoad: function (option) {
    let that = this;
    if (option.courseId) {
      that.setData({
        courseId: option.courseId
      })
    }
  
    if (option.type) {
      that.setData({
        pagetype: option.type
      })
    }
   
    if (option.scene) {
      let scene = decodeURIComponent(option.scene);
      let courseId = scene.split(",")[0];
      that.setData({
        courseId: courseId
      });
    }
    wx.reportAnalytics('show_signin', {
      item: '马上打卡课程报名页',
      lessonid: that.data.courseId,
    });
  
    // 判断iphoneX
    let isIphoneX = app.globalData.isIphoneX;
    that.setData({
      isIphoneX: isIphoneX
    })
    wx.showShareMenu({
      withShareTicket: true
    })
    that.setData({
      navHeight: app.globalData.navHeight
    })
  },

  
//获取formId
  testSubmit: function (e) {
    // console.log("获取formId")
    var that = this;
    that.setData({
      formId: e.detail.formId
    })
  },
//用户授权及登录
  bindGetUserInfo: function (e) {
    // console.log("免费报名")
    var that = this;
    wx.reportAnalytics('click_signin', {
      srcpage: '马上打卡课程报名页',
      item: 'button',
      itemid: '免费报名',
      lessonid: that.data.courseId,
    });
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      wx.reportAnalytics('authorize_btn', {
        srcpage: '马上打卡课程报名页',
        srcmodule: '微信授权弹窗',
        item: 'button',
        itemid: '允许',
        lessonid: that.data.courseId,
      });
      if (!app.globalData.isLogin){
        Util.loginApp(that.getCourseEncroll,e.detail);
      }else{
        var openid = wx.getStorageSync('openid')
        Util.getOpenGid(that.getCourseEncroll,openid);
      }
    } else {
      wx.reportAnalytics('authorize_btn', {
        srcpage: '马上打卡课程报名页',
        srcmodule: '微信授权弹窗',
        item: 'button',
        itemid: '拒绝',
        lessonid: that.data.courseId,
      });
      wx.navigateTo({
        url: '/pages/signInResult/signInResult?id=0'
      })
    }
  },
  // 绑定群
  bindTapGroup:function(){
    var that = this;
    var _data = {
      courseId: this.data.courseId,
      openGid:app.globalData.openGid
    }
    // console.log("openGid", app.globalData.openGid)
    API.addGroup(_data, true, false).then((res) => {
      if (res.statusCode == 200) {
        wx.showToast({
          title: "绑定成功，本群成员可以报名参加本课程",
          icon: "none"
        });
        that.setData({
          actionType:2
        })
      }
    }).catch((res) => {
      if (res.statusCode == 400) {
        wx.showToast({
          title: "绑定失败，请在群内打开课程",
          icon: "none"
        });
      }
    });
  },
//课程报名
  getCourseEncroll: function (openGid){
    var that = this;
    var openid = app.globalData.openid;
    var _data={}
    if (openGid) {
      _data = {
        openGid: openGid,
        courseId: that.data.courseId,
        formId: that.data.formId,
        openId: openid
      }
    } else {
      _data = {
        courseId: that.data.courseId,
        formId: that.data.formId,
        openId: openid,
        scene: app.globalData.scene,
        shareTicket: app.globalData.shareTicket
      }
    }
    API.courseEnroll(_data, true, false).then((res) => {
      if (res.statusCode == 200) {
        that.setData({
          actionType: 2
        })
        wx.navigateTo({
          url: '/pages/signInResult/signInResult?id=1&courseId=' + that.data.courseId
        })
      }
    }).catch((res) => {
      if (res.statusCode == 403) {
        // 尝试打印日志
        logger.warn('no openGid: ' + JSON.stringify(_data))
        wx.showModal({
          title: '提示',
          content: '暂无报名权限,请联系老师微信开通，微信号：' + that.data.wxAccount,
          showCancel: false,//是否显示取消按钮
          cancelColor: '#333',//取消文字的颜色
          confirmColor: '#333',//确定文字的颜色
          success: function (res) {
            
          },
          fail: function (res) { },//接口调用失败的回调函数
          complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
        })
      } else if (res.statusCode == 404) {
        wx.showModal({
          title: '提示',
          content: '课程不存在',
          showCancel: false,//是否显示取消按钮
          cancelColor: '#333',//取消文字的颜色
          confirmColor: '#333',//确定文字的颜色
          success: function (res) {
            // if (res.cancel) {
            //   //点击取消,默认隐藏弹框
            // } else {
            //   //点击确定
            // }
          },
          fail: function (res) { },//接口调用失败的回调函数
          complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
        })
      } else if (res.statusCode == 401) {
        wx.clearStorageSync();
        app.globalData.isLogin = false;
        wx.showModal({
          title: '提示',
          content: '登录信息过期，请重新点击报名',
          showCancel: false,//是否显示取消按钮
          cancelColor: '#333',//取消文字的颜色
          confirmColor: '#333',//确定文字的颜色
          success: function (res) {
            // if (res.cancel) {
            //   //点击取消,默认隐藏弹框
            // } else {
            //   //点击确定
            // }
          },
          fail: function (res) { },//接口调用失败的回调函数
          complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
        })
      } else if (res.statusCode == 406) {
        that.getMySignCourse(openGid);
      }
    });
  },


  toLessonDetail:function(){
    var that = this;
    wx.reportAnalytics('click_signin', {
      srcpage: '马上打卡课程报名页',
      item: 'button',
      itemid: '开始学习',
      lessonid: that.data.courseId,
    });
      wx.navigateTo({
        url: '/pages/learning/lessonDetails/lessonDetails?clear=true&courseId='+that.data.courseId
      })
  },

//获取页面信息
  getMySignCourse:function(openGid){
        var that = this;
        var _data={};
        if (openGid){
          _data={
            openGid: openGid,
            courseId: that.data.courseId
          }
        }else{
          _data = {
            courseId: that.data.courseId
          }
        }
    API.getMySignCourse(_data).then((res) => {
      if (res.statusCode == 200) {
        this.setData({
          coverUrl: res.data.coverUrl,
          title: res.data.title,
          shortDesc: res.data.shortDesc,
          description: res.data.description,
          isJoined: res.data.isJoined,
          status: res.data.status,
          wxAccount: res.data.wxAccount,
          actionType: res.data.actionType
        })
        // console.log("res.data.groupSuccess",res.data.groupSuccess)
        // if (res.data.groupSuccess){
        //   wx.showToast({
        //     title: "操作成功，本群成员可以报名参加本课程",
        //     icon: "none"
        //   });
        // }
        
        // 1立即报名 2开始学习 3绑定群
        if (res.data.actionType == 2 && this.data.pagetype != 1) {
          wx.redirectTo({
            url: '/pages/learning/lessonDetails/lessonDetails?clear=true&courseId=' + that.data.courseId
          })
        }


        var article = res.data.description;
        // var article = '<p>sdfsdf,i&#x27;d like to tell you &gt;&#x27;\]|}{&quot;:?&gt;   </p><p>你好啊，你<span style="color:#07a9fe">在哪里</span>哟哈<span style="font-size:30px">哈哈哈</span>哈哈哈哈</p><p>dsddd<span style="font-size:30px">ddddddddd</span>ddd<span style="color:#8e44ad">ddddd</span>dddd<strong>ddd</strong>ddd<u>ddd</u>d</p>'

        WxParse.wxParse('article', 'html', article, that, 5);
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成  this.data.courseId
   */
  onReady: function () {
    var that = this;
    app.globalData.count = '0';
    console.log("app.globalData.isLogin", app.globalData.isLogin)
    if (app.globalData.isLogin){
      var openid = wx.getStorageSync('openid')
      Util.getOpenGid(that.getMySignCourse, openid)
      console.log("11111", openid)
    } else {
      // console.log("22222")
      that.getMySignCourse();
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // console.log("hidehidehide")
  },

  /**
   * 生命周期函数--监听页面卸载 getMySignCourse
   */
  onUnload: function () {
    this.toLessonDetail = null;
    this.testSubmit = null;
    this.getMySignCourse = null;
    this.getCourseEncroll = null;
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    wx.reportAnalytics('signin_share', {
      srcpage: '马上打卡课程报名页',
      srcmodule: 'more',
      item: 'button',
      itemid: '拒绝',
      lessonid: that.data.courseId,
    });
    wx.showShareMenu({
      withShareTicket: true
    })
    return {
      title: `我邀请你参加「${this.data.title}」`,
      imageUrl: that.data.coverUrl,
      path: '/pages/signIn/signIn?courseId=' + that.data.courseId,
    }
  }
})