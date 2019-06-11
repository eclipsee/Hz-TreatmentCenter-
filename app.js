import logger from 'logger/logger.js';

var XMPlayer = require('./pages/commen/player/XMPlayer.js');
var player = new XMPlayer();

//app.js
App({
  logger: logger,
  player: player,
  onLaunch: function (options) {
    var _this = this;
    // if (options.scene == 1044) {
    //   _this.globalData.shareTicket = options.shareTicket;
    //   console.log("shareTicket111", _this.globalData.shareTicket)
    // }
  },
 
  onShow: function (options) {
    let that = this;
    that.globalData.scene = options.scene;
    if (options.scene == 1044) {
      that.globalData.shareTicket = options.shareTicket;
    } else {
      that.globalData.shareTicket = "";
    }
    wx.getSystemInfo({
      success: res => {
        let modelmes = res.model;
        if (modelmes.search('iPhone X') != -1) {
          that.globalData.isIphoneX = true
        }
        if (modelmes.search('iPhone') != -1) {
          that.globalData.isIphone = true
        }
        this.globalData.navHeight = res.statusBarHeight + 46;
      },
      fail(err) {
        console.log(err);
      }
    })

    //判断是否登录
    that.globalData.Authorization = wx.getStorageSync('Authorization')
    if (that.globalData.Authorization) {
      that.globalData.isLogin = true;
      wx.getUserInfo({
        success: res => {
          that.globalData.userInfo = res.userInfo;
          wx.setStorage({
            key: "avatarUrl",
            data: res.userInfo.avatarUrl
          })
          wx.setStorage({
            key: "nickName",
            data: res.userInfo.nickName
          })
          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          // 所以此处加入 callback 以防止这种情况
          if (that.userInfoReadyCallback) {
            that.userInfoReadyCallback(res)
          }
        }
      })
    }else{
      that.globalData.isLogin = false;
    }
    that.globalData.openid = wx.getStorageSync('openid')
  },
  
  globalData: {
    userInfo: null,
    isIphoneX:false,
    Authorization:'',
    context:{},
    openid:"",
    isLogin:false,
    scene: 0,
    shareTicket:"",
    isIphone:false,
    count:'0',
    openGid:"",
    item:null,
    navHeight:0
  },

})