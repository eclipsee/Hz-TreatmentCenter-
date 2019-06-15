// pages/bubbleDetail/index.js
const testUrl = 'http://yss.yisell.com/yisell/ybys2018050819052088/sound/yisell_sound_2014031622091974505_88366.mp3';
const testAvatar = 'http://img.wxcha.com/file/201807/13/9bbc369f6e.jpg';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {
      username: 'lizifen',
      avatar: testAvatar,
    },
    bubble: {
      title: '分手求安慰',
      url: testUrl,
      duration: 10,
      type: 1, // 1, 开心，2，悲伤，3，愤怒，4，语音回复，5，治愈音
    },
    comments: [
      { user: { username: 'lizifen', avatar: testAvatar }, bubble: { url: testUrl, duration: 10, comment_type: 1 } },
      { user: { username: 'lizifen', avatar: testAvatar }, bubble: { url: testUrl, duration: 10, comment_type: 2 } },
      { user: { username: 'lizifen', avatar: testAvatar }, isSelf: true, bubble: { url: testUrl, duration: 10, comment_type: 3 } },
    ],
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