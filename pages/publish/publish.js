// pages/publish/publish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeStr:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let timeStr = this.getNowFormatDate()
    console.log("timeStr", timeStr)
  },

  getNowFormatDate() {
      let date = new Date();
      let seperator1 = "-";
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      if(month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      let currentdate =  month + '月' + strDate + '日';
      return currentdate;
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