// import { get, post } from '../../requests/request'

const app = getApp()

Page({
  data: {
    catchOne: 1,
    loading: false,
    disabled: false,
    emotionList: [],
    isCatch: false
  },

  onLoad: function(options) {
    const { flag } = options
    if (flag)
      wx.showToast({
        icon: 'none',
        title: '发布成功\r\n先听别的，很快就会有回应啦～',
        duration: 3000
      })
    this.drawEmotion(1, false)
    this.regularDraw()
  },

  onShow() {
    const animationOne = this.drawCatchStart()
    this.setData({
      animationOne,
      isCatch: false
    })
  },

  regularDraw() {
    let flag = 1
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
      duration: 5000,
      timingFunction: 'ease-out',
      delay: 0
    })

    const bottom = Math.ceil(530 + Math.random() * 300)
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
      .bottom(230)
      .scale(1)
      .step()

    return animation
  },

  drawCatch() {
    var animation = wx.createAnimation({
      duration: 3000,
      timingFunction: 'ease',
      delay: 0,
      transformOrigin: '50% 50%'
    })

    animation
      .opacity(0)
      .scale(50, 50)
      .step()

    return animation
  },

  drawCatchStart() {
    var animation = wx.createAnimation({
      duration: 0,
      timingFunction: 'ease',
      delay: 0
    })

    animation
      .opacity(1)
      .scale(1, 1)
      .step()

    return animation
  },

  onClickCatch() {
    const catchOne = Math.ceil(Math.random() * 6)
    this.setData({
      catchOne,
      isCatch: true
    })
    const animationOne = this.drawCatch()
    this.setData({
      animationOne
    })
    setTimeout(() => {
      wx.navigateTo({
        url: '../bubbleReceive/index'
      })
    }, 1000)
  },

  onClickNew() {
    wx.navigateTo({
      url: '../publish/index'
    })
  }
})
