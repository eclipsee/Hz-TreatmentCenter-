// pages/publish/publish.js
// import  recordBg1 from '../../img/1.png'
// import  recordBg2  from '../../img/2.png'
// import  recordBg3  from '../../img/3.png'
// import  recordBg4  from '../../img/4.png'
// import  recordBg5  from '../../img/5.png'
// import  recordBg6  from '../../img/6.png'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    timeStr: '',
    animationData: '',
    animationDataCloud: '',
    animationPanel: '',
    animationDataRotate: '',
    isShowPanel: true,
    star1: false,
    star2: false,
    star3: false,
    star4: false,
    star5: false,
    recordBg: '',
    isRecording: false,
    recordMinute: '00',
    recordSecond: '00',
    t1: {},
    tag: 1,
    recordStatus: 0,
    audioSrc: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.recorderManager = wx.getRecorderManager()
    this.data.audioContext = wx.createInnerAudioContext()
    let timeStr = this.getNowFormatDate()
    this.setData({
      timeStr: timeStr
    })
    console.log('timeStr', timeStr)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let _this = this
    this.topAnimation()
    this.animationPublish()
  },

  //泡泡上下飘动画
  topAnimation() {
    let _this = this
    setInterval(function() {
      let animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease',
        delay: 0,
        transformOrigin: '50% 50%'
      })
      let y = Math.random(0, 100)
      animation.translate(0, -y * 10).step() //边旋转边放大
      animation.translate(0, 0).step()
      //导出动画数据传递给组件的animation属性。
      _this.setData({
        animationData: animation.export()
      })

      let animationCloud = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease',
        delay: 0,
        transformOrigin: '50% 50%'
      })
      let x = Math.random(0, 100)
      animationCloud.translate(x * 10, 0).step() //边旋转边放大
      animationCloud.translate(0, 0).step()
      //导出动画数据传递给组件的animation属性。
      _this.setData({
        animationDataCloud: animationCloud.export()
      })
    }, 1000) //每隔3秒打印一次
  },

  chooseMood(event) {
    let _this = this
    let tag = event.currentTarget.dataset.tag
    this.setData({
      tag: event.currentTarget.dataset.tag
    })
    setTimeout(function() {
      let animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease',
        delay: 0,
        transformOrigin: '50% 50%'
      })
      animation.translate(0, 400).step()
      //导出动画数据传递给组件的animation属性。
      _this.setData({
        animationPanel: animation.export()
      })
    }, 500)
  },

  chooseStar(event) {
    let index = event.currentTarget.dataset.index
    if (index == 1) {
      this.setData({
        star1: true,
        star2: false,
        star3: false,
        star4: false,
        star5: false
      })
    } else if (index == 2) {
      this.setData({
        star1: true,
        star2: true,
        star3: false,
        star4: false,
        star5: false
      })
    } else if (index == 3) {
      this.setData({
        star1: true,
        star2: true,
        star3: true,
        star4: false,
        star5: false
      })
    } else if (index == 4) {
      this.setData({
        star1: true,
        star2: true,
        star3: true,
        star4: true,
        star5: false
      })
    } else if (index == 5) {
      this.setData({
        star1: true,
        star2: true,
        star3: true,
        star4: true,
        star5: true
      })
    }

    // console.log("star1", star1)
  },

  getNowFormatDate() {
    let date = new Date()
    let seperator1 = '-'
    let month = date.getMonth() + 1
    let strDate = date.getDate()
    let strHour = date.getHours()
    let strMinutes = date.getMinutes()
    console.log('strMinutes', strHour, strMinutes)
    let strHourString = ''
    if (month >= 1 && month <= 9) {
      month = '0' + month
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = '0' + strDate
    }
    if (strMinutes >= 0 && strMinutes <= 9) {
      strMinutes = '0' + strMinutes
    }
    if (strHour > 12) {
      strHourString = (strHour - 12) + ':' + strMinutes + ' PM'
    } else {
      strHourString = strHour.toString() + ':' + strMinutes.toString() + ' AM'
    }
    console.log('strHourString', strHourString)
    let currentdate = month + '月' + strDate + '日 ' + strHourString
    return currentdate
  },

  drawPublish() {
    var animation = wx.createAnimation({
      duration: 5000,
      timingFunction: 'ease',
      delay: 0
    })

    animation
      .opacity(0)
      .scale(20)
      .bottom(400)
      .step()

    return animation
  },

  drawPublishStart() {
    var animation = wx.createAnimation({
      duration: 0,
      timingFunction: 'ease',
      delay: 0
    })

    animation
      .opacity(1)
      .scale(1)
      .bottom(0)
      .step()

    return animation
  },

  animationPublish() {
    const animationPublish = this.drawPublishStart()
    this.setData({
      animationPublish
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
})
