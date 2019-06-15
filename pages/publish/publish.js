// pages/publish/publish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeStr:'',
    animationData: '',
    animationDataCloud:'',
    animationPanel:'',
    isShowPanel:true

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let timeStr = this.getNowFormatDate()
    this.setData({
      timeStr: timeStr
    })
    console.log("timeStr", timeStr)
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    this.topAnimation()
  },


  //泡泡上下飘动画
  topAnimation(){
    var _this = this;
    setInterval(function () {
      let animation = wx.createAnimation({
        duration: 1000,
        timingFunction: "ease",
        delay: 0,
        transformOrigin: "50% 50%",
      })
      let y = Math.random(0,100)
      animation.translate(0, -y * 10).step();     //边旋转边放大
      animation.translate(0, 0).step();
      //导出动画数据传递给组件的animation属性。
      _this.setData({
        animationData: animation.export(),
      })

      let animationCloud = wx.createAnimation({
        duration: 1000,
        timingFunction: "ease",
        delay: 0,
        transformOrigin: "50% 50%",
      })
      let x = Math.random(0, 100)
      animationCloud.translate(x * 10,0).step();     //边旋转边放大
      animationCloud.translate(0, 0).step();
      //导出动画数据传递给组件的animation属性。
      _this.setData({
        animationDataCloud: animationCloud.export(),
      })
    }, 1000)  //每隔3秒打印一次
  },

  chooseMood: function () {
    var _this = this;
    setTimeout(function(){
      let animation = wx.createAnimation({
        duration: 1000,
        timingFunction: "ease",
        delay: 0,
        transformOrigin: "50% 50%",
      })
      animation.translate(0, 300).step();
      //导出动画数据传递给组件的animation属性。
      _this.setData({
        animationPanel: animation.export(),
      })
    },500)
  },

  getNowFormatDate() {
    let date = new Date();
    let seperator1 = "-";
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    let strHour = date.getHours();
    let strMinutes = date.getMinutes();
    console.log("strMinutes", strHour,strMinutes)
    let strHourString = ''
    if(month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    if (strMinutes >= 0 && strMinutes <= 9) {
      strMinutes = "0" + strMinutes;
    }
    if (strHour > 12){
      strHourString = (strHour - 12) + ':' +  strMinutes + ' PM'
    }else{
      strHourString = strHour + strMinutes + ' AM'
    }
    console.log("strHourString", strHourString)
    let currentdate = month + '月' + strDate + '日 ' + strHourString;
    return currentdate;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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