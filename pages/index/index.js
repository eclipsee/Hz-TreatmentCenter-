// import { get, post } from '../../requests/request'

const app = getApp()

Page({
  data: {
    loading: false,
    disabled: false,
    emotionList: []
  },

  onLoad: function() {
    this.drawEmotion()
    this.regularDraw()
  },

  regularDraw() {
    setInterval(() => {
      this.drawEmotion()
    }, 10000)
  },

  drawEmotion() {
    const data = []
    for (let index = 0; index < 5; index++) {
      data.push(Math.ceil(Math.random(1, 12) * 10))
    }
    this.setData({
      emotionList: data
    })

    this.drawAnimation()
  },

  drawAnimation() {
    var animation = wx.createAnimation({
      duration: 10000,
      timingFunction: 'ease',
      delay: 0
    })

    animation
      .opacity(0)
      .left(10)
      .bottom(400)
      .scale(3)
      .step()

    var animation1 = wx.createAnimation({
      duration: 10000,
      timingFunction: 'ease',
      delay: 0
    })

    animation1
      .opacity(0)
      .right(10)
      .bottom(400)
      .scale(2)
      .step()

    this.setData({
      animationData: animation.export(),
      animationData1: animation1.export()
    })
  },

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
