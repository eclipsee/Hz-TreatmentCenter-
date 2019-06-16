// pages/login/login.js
import { dbRequests } from '../../requests/request';
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {

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

  //授权登录后调用主站的登录接口
  bindGetUserInfo: function (e) {
    // debugger;
    var that = this;
    console.log("点击登录", e)
    if (e.detail.userInfo) {
    
      // this.loginApp(e.detail);
      let nickname = e.detail.userInfo.nickname;
      let avatarUrl = e.detail.userInfo.avatarUrl;
      let openid = app.globalData.openid;
      console.log("有授权", openid)
      dbRequests.getUser(openid).then((res) => {
        console.log("res",res);
        if(res == null){
          console.log("没有该用户")
          let params={
            nickname: nickname,
            avatarUrl: avatarUrl
          }
          dbRequests.addUser({params}).then((res) => {
            console.log("添加用户res", res);
          }).catch(() => {
            wx.showModal({
              title: '获取失败',
              showCancel: false,
            });
          });
        }else{
          console.log("res.update_time._id", res._id)
          wx.setStorage({
            key: 'uid',
            data: res._id,
          })
          wx.redirectTo({
            url: '/pages/index/index',
          })
        }
      }).catch(() => {
        wx.showToast({
          title: '获取失败',
          icon:none
        });
      });

    }
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