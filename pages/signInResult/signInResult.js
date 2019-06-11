// pages/signInResault/signInResault.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSign:0,
    courseId: 0,
    navHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isSign: options.id,
      courseId:options.courseId ,
      navHeight: app.globalData.navHeight
      
    }) 
    // console.log(this.data.isSign)
  },
  bindtap:function(){
    var that = this;
    if (that.data.isSign == 1){
      wx.reportAnalytics('begin_lesson', {
        srcpage: '马上打卡报名成功页',
        srcmodule: 'bottomTool',
        item: 'button',
        itemid: '开始学习',
        lessonid: that.data.courseId,
      });
      wx.navigateTo({
        url: '../../pages/learning/lessonDetails/lessonDetails?clear=true&courseId='+that.data.courseId
      })
    }else{
      wx.navigateBack({
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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