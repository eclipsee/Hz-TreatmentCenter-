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
      this.setData({
        emotionList: []
      })
      const animationData = this.drawStart('left').export()
      const animationData1 = this.drawStart('right').export()
      this.setData({
        animationData,
        animationData1
      })
      setTimeout(() => {
        this.drawEmotion()
      }, 0)
    }, 5000)
  },

  drawEmotion() {
    const data = []
    for (let index = 0; index < 6; index++) {
      const temp = Math.ceil(Math.random(1, 12) * 10)
      data.push({
        image: temp,
        key: Math.ceil(Math.random(10, 120) * 100),
        viewClass: index % 2 ? 'emotion' : 'emotion1',
        imageClass: `image${temp % 4}`
      })
    }
    this.setData({
      emotionList: data
    })

    const animationData = this.drawAnimation('left').export()
    const animationData1 = this.drawAnimation('right').export()

    this.setData({ animationData, animationData1 })
  },

  drawAnimation(type) {
    var animation = wx.createAnimation({
      duration: 5000,
      timingFunction: 'ease',
      delay: 0
    })

    const bottom = Math.ceil((3 + Math.random() * (5 + 1 - 3)) * 100)
    const scale = 1.5 + Math.random() * (3 + 1 - 1)

    animation
      .opacity(0)
      [type](10)
      .bottom(bottom)
      .scale(scale)
      .step()

    return animation
  },

  drawStart(type) {
    var animation = wx.createAnimation({
      duration: 0,
      timingFunction: 'ease',
      delay: 0
    })

    animation
      .opacity(1)
      [type]('50%')
      .bottom(200)
      .scale(1)
      .step()

    return animation
  },

  drawCatch() {
    var animation = wx.createAnimation({
      duration: 5000,
      timingFunction: 'ease',
      delay: 0
    })

    animation
      .opacity(0)
      .bottom(350)
      .scale(350)
      .step()

    return animation
  },

  // 跳转至情绪日历
  onClickCalendar: function() {
    wx.navigateTo({
      url: '../emotionCalendar/index'
    })
  },

  onClickCatch: function() {}
})
