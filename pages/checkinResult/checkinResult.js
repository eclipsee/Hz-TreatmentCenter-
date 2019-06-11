// pages/checkinResult/checkinResult.js
import API from '../../requests/api/api.js';
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    phoneNum:"",
    courseId:"",
    activityId:"",
    ranking:"",
    hasPhone:false,
    isPhoneDone:false,
    isFocus: false,
    navHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options){
      this.setData({
        courseId: options.courseId,
        activityId: options.activityId,
      })
    }
    this.setData({
      navHeight: app.globalData.navHeight
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getResult()
  },
  oninput:function(e){
    this.setData({
      phoneNum: e.detail.value,
    })
  },
  bindfocus:function(){
    this.setData({
      isFocus: true,
    })
    // console.log("聚焦")
    wx.pageScrollTo({
      scrollTop: 3000
    })
  },
  bindblur:function(){
    this.setData({
      isFocus: false,
    })
  },
  getResult:function(){
    API.activityResult({ courseId: this.data.courseId, activityRef: this.data.activityId }).then(res => {
      if (res.statusCode == 200) {
        // res.data.isPhoneDone = false
        this.setData({
          ranking: res.data.ranking,
          isPhoneDone: res.data.isPhoneDone,
        })
        if (res.data.isPhoneDone == false){
          console.log("没有确认过")
          this.setData({
            phoneNum: res.data.phone
          })
        }
      } else {

      }
    }).catch(res => {
      console.log(res);
    });
  },
  submitPhone:function(){
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (this.data.phoneNum.length == 0) {
      wx.showToast({
        title: '手机号为空',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (this.data.phoneNum.length < 11) {
      wx.showToast({
        title: '手机号长度不正确',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (!myreg.test(this.data.phoneNum)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else {
      API.activityPhone({ courseId: this.data.courseId,phone: this.data.phoneNum}).then(res => {
        if (res.statusCode == 200) {
          console.log("res", res)
          this.setData({
            hasPhone: true,
            isPhoneDone:true
          })
        } else {
          wx.showToast({
            title: '提交失败',
            icon: 'none',
            duration: 1500
          })
        }
      }).catch(res => {
        console.log(res);
        wx.showToast({
          title: '提交失败',
          icon: 'none',
          duration: 1500
        })
      });
    }
  },
  backtoLesson:function(){
    wx.reLaunch({
      url: '/pages/learning/lessonDetails/lessonDetails?clear=true&courseId=' + this.data.courseId
    })
  },
  toActivityDetail:function(){
    wx.navigateTo({
      url: "../activityDetail/activityDetail?clear=true&courseId=" + this.data.courseId
    })
    console.log("点击了")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.toActivityDetail = null;
    this.backtoLesson = null;
    this.submitPhone = null;
    this.getResult = null;
    this.oninput = null;
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