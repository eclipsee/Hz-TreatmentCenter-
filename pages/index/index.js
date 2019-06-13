import { get, post } from '../../requests/request'

const app = getApp()

Page({
  data: {
    loading: false,
    disabled: false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    text: 0
  },

  onLoad: function() {},

  drawEmotion() {},

  // 跳转至情绪日历
  onClickCalendar: function() {
    wx.navigateTo({
      url: '../emotionCalendar/index'
    })
  },

  onClickCatch: function() {
    console.log('....打捞泡泡')
  }
})
