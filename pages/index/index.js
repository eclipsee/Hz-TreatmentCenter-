// import { get, post } from '../../requests/request'

const app = getApp()

Page({
  data: {
    catchOne: 1,
    loading: false,
    disabled: false,
    emotionList: []
  },

  onLoad: function(options) {
    const { flag } = options
    if (flag)
      wx.showToast({
        title: '发布成功\t\n 先听别的，很快就会有回应啦～'
      })
    this.drawEmotion()
    this.regularDraw()
  },

  onShow() {
    const animationOne = this.drawCatchStart()
    this.setData({
      animationOne
    })
  },

  regularDraw() {
    let flag = 0
    setInterval(() => {
      const symbol = (flag % 3) + 1
      const random = Math.ceil(Math.random() * 6)
      this.setData({
        [`emotionList${symbol}`]: []
      })
      this.drawAnimationList(false, symbol, random)
      flag++
      setTimeout(() => {
        this.drawEmotion(symbol, random)
      }, 0)
    }, 1500)
  },

  drawEmotion(symbol, random) {
    const data = []
    for (let index = 0; index < random; index++) {
      const temp = Math.ceil(1 + Math.random() * (6 - 1))
      data.push({
        image: temp,
        key: Math.ceil(Math.random(10, 120) * 100),
        viewClass: index % 2 ? 'emotion' : 'emotion1',
        imageClass: `image${temp % 6}`
      })
    }
    this.setData({
      [`emotionList${symbol}`]: data
    })

    this.drawAnimationList(true, symbol, random)
  },

  drawAnimationList(flag, symbol, random) {
    const animationData = []
    for (let index = 0; index < random; index++) {
      const temp = this[flag ? 'drawAnimation' : 'drawStart'](
        index % 2 ? 'left' : 'right'
      ).export()
      animationData.push(temp)
    }
    this.setData({
      [`animationData${symbol}`]: animationData
    })
  },

  drawAnimation(type) {
    var animation = wx.createAnimation({
      duration: 4500,
      timingFunction: 'ease',
      delay: 0
    })

    const bottom = Math.ceil((3 + Math.random() * (6 - 3)) * 100)
    const scale = 1 + Math.random() * 3
    const rigth = 10 + Math.random() * 50

    animation
      .opacity(0)
      [type](rigth)
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
      timingFunction: 'linear',
      delay: 0
    })

    animation
      .opacity(0)
      .scale(1000)
      .step()

    return animation
  },

  drawCatchStart() {
    var animation = wx.createAnimation({
      duration: 0,
      timingFunction: 'linear',
      delay: 0
    })

    animation
      .opacity(1)
      .scale(1)
      .step()

    return animation
  },

  // 跳转至情绪日历
  onClickCalendar() {
    wx.navigateTo({
      url: '../emotionCalendar/index'
    })
  },

  onClickCatch() {
    const catchOne = Math.ceil(1 + Math.random() * (6 + 1 - 1))
    this.setData({
      catchOne
    })
    const animationOne = this.drawCatch()
    this.setData({
      animationOne
    })
    setTimeout(() => {
      wx.navigateTo({
        url: '../emotionCalendar/index'
      })
    }, 3000)
  },

  onClickNew() {
    wx.navigateTo({
      url: '../emotionCalendar/index'
    })
  }
})
