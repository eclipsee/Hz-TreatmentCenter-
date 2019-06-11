import Player from "../commen/player/Player.js";
// pages/lessonSetting/lessonSetting.js
import API from '../../requests/api/api.js';
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    courseId:"",
    needPush:false,
    subscribe:false,
    isChecked:false,
    contactFlag:false,
    navHeight:0,
    isModelShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.player = new Player(this);
    this.setData({
      courseId: options.courseId,
      navHeight: app.globalData.navHeight
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成  lessonSetting
   */
  onReady: function () {
    this.getSetting()
  },
  changeSwitch: function () {
    this.setData({
      isChecked: !this.data.isChecked
    })
    // console.log("this.data.checkined", this.data.isChecked)
    this.setLesson(this.data.isChecked);
    if (this.data.subscribe == false) {
      this.setData({
        contactFlag: true
      })
    }
  },
  getSetting:function(){
    API.lessonSetting({ courseId: this.data.courseId }).then(res => {
      if (res.statusCode == 200) {
        console.log("设置页面", res.data.subscribe, res.data.needPush)
        // res.data.subscribe = false
        // res.data.needPush = false
        this.setData({
          needPush: res.data.needPush,
          subscribe: res.data.subscribe
        })
        if (this.data.subscribe == false){
          this.setData({
            isChecked: false,
          })
        }else{
          if (this.data.needPush == true){
            this.setData({
              isChecked: true,
            })
          }else{
            this.setData({
              isChecked: false,
            })
          }
        }
      } else {

      }
    }).catch(res => {
      console.log(res);
    });
  },
  setLesson: function (needPush){
    API.setLesson({ courseId: this.data.courseId, needPush: needPush }).then(res =>     {
      if (res.statusCode == 200) {
        
      } else {

      }
    }).catch(res => {
      console.log(res);
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getSetting()
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

  //客服弹窗隐藏显示
  cancelContact:function(){
    console.log("点击了要取消")
    this.setData({
      contactFlag: this.data.contactFlag == true ? false : true,
      isChecked: true
    })
    // 没关注要取消弹框
    if (this.data.contactFlag == false && this.data.subscribe == false) {
      this.setData({
        isChecked: false,
        needPush: false
      })
    }

  },
  clickOpen:function(){
    this.setData({
      contactFlag: this.data.contactFlag == true ? false : true
    })
  },
  hideContact:function(){
    this.setData({
      contactFlag: false,
      isChecked: false
    })
    wx.redirectTo({
      url: '../../learning/lessonDetails/lessonDetails?clear=true',
    })
    wx.reportAnalytics('click_contact', {
      srcpage: '马上打卡课程设置页',
      srcmodule: '关注服务号弹窗',
      item: 'button',
      itemid: '去客服消息',
      lessonid: this.data.courseId,
    });
  }
})