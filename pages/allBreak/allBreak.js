// pages/allBreak/allBreak.js
import API from '../../requests/api/api.js';
import Constant from '../../constants/constants.js';
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    items:[],
    courseId:'',
    checked:0,
    navHeight:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      courseId: options.courseId,
      checked: options.checked,
      navHeight: app.globalData.navHeight
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getCourseDetail()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.reportAnalytics('show_all_break', {
      item:"马上打卡所有课时页",
      lessonid: this.data.courseId,
    });
  },

  getCourseDetail: function (tipFlag = true) {
    API.getCourseDetail({
      courseId: this.data.courseId
    }).then(res => {
      if (res.statusCode == 200) {
        this.setData({
          courseInfo: res.data,
          items: res.data.items,
        })
      } 
    }).catch(res => {
      console.log(res);
    });
  },

  toLessonDetail:function(e){
    let dataset = e.currentTarget.dataset;
    wx.redirectTo({
      url: `../learning/lessonDetails/lessonDetails?clear=true&checked=${dataset.index}&courseId=${this.data.courseId}`,
    })
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