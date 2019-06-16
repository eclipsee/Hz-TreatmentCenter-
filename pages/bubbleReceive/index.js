// pages/bubble/bubbleFishing.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    bubble: {
      title: '谁来安慰安慰我～',
      url: 'http://yss.yisell.com/yisell/ybys2018050819052088/sound/yisell_sound_2014031622091974505_88366.mp3',
      level: 3,
      tag: 1,
      tagName: '开心',
      isPositive: false,
      comments: [1, 2, 3],
      like_count: 3,
      user: {
        username: '布丁',
        avatar: '../../img/avatar/user2.png',
      },
    },
  },

  goReply() {
    wx.navigateTo({ url: '../bubbleDetail/index' });
  },

  randomBubble() {
    console.log('randomBubble');
  },

  getBubbleTxt(tag) {
    const txts = ['生气', '快乐', '伤心', '烦躁', '苦恼', '纠结'];
    return txts[tag];
  },

  giveFive() {
    console.log('giveFive');
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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