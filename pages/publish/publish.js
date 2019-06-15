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
    timeStr:'',
    animationData: '',
    animationDataCloud:'',
    animationPanel:'',
    animationDataRotate:'',
    isShowPanel:true,
    star1:false,
    star2: false,
    star3: false,
    star4: false,
    star5: false,
    recordBg:'',
    isRecording:false,
    recordMinute: "00",
    recordSecond: "00",
    t1: {},
    tag:1

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.recorderManager = wx.getRecorderManager();
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
    let _this = this;
    this.topAnimation()
  },


  //泡泡上下飘动画
  topAnimation(){
    let _this = this;
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

  chooseMood(event) {
    let _this = this;
    let tag = event.currentTarget.dataset.tag;
    this.setData({
      tag: event.currentTarget.dataset.tag
    })
    setTimeout(function(){
      let animation = wx.createAnimation({
        duration: 1000,
        timingFunction: "ease",
        delay: 0,
        transformOrigin: "50% 50%",
      })
      animation.translate(0, 400).step();
      //导出动画数据传递给组件的animation属性。
      _this.setData({
        animationPanel: animation.export(),
      })
    },500)
  },


  chooseStar(event){
    let index = event.currentTarget.dataset.index;
    if(index == 1){
      this.setData({
        star1:true,
        star2: false,
        star3: false,
        star4: false,
        star5: false,
      })
    } else if (index == 2) {
      this.setData({
        star1: true,
        star2: true,
        star3: false,
        star4: false,
        star5: false,
      })
    } else if (index == 3) {
      this.setData({
        star1: true,
        star2: true,
        star3: true,
        star4: false,
        star5: false,
      })
    } else if (index == 4) {
      this.setData({
        star1: true,
        star2: true,
        star3: true,
        star4: true,
        star5: false,
      })
    } else if (index == 5) {
      this.setData({
        star1: true,
        star2: true,
        star3: true,
        star4: true,
        star5: true,
      })
    }

    // console.log("star1", star1)
  },

//点击录音按钮
  recordStart(){
    console.log("点击了录音")
    let _this = this;
    let isrecording = this.data.isRecording;
    if (isrecording == false){
      wx.getSetting({
        success(res) {
          // 进行授权检测，未授权则进行弹层授权
          if (typeof res.authSetting["scope.record"] != "undefined") {
            if (res.authSetting["scope.record"] == true) {
              _this.recordFn();
            } else if (res.authSetting["scope.record"] == false) {
              wx.showModal({
                content:
                  "检测到您没打开录音的权限，是否去设置打开？",
                confirmText: "确认",
                cancelText: "取消",
                success: function (res) {
                  //点击“确认”时打开设置页面
                  if (res.confirm) {
                    console.log("用户点击确认");
                    wx.openSetting({
                      success: res => { }
                    });
                  } else {
                    console.log("用户点击取消");
                  }
                }
              });
            }
          } else {
            wx.authorize({
              scope: "scope.record",
              success() {
                //这里是用户同意授权后的回调
                _this.recordFn();
              },
              fail() {
                //这里是用户拒绝授权后的回调
              }
            });
          }
        },
        fail(res) {
          console.log(res);
        }
      })
    }else{
      _this.recordStop();
    }
    
  },

  recordFn() {
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
    this.recordTime();
    this.recorderManager.start({
      duration: 600000,//指定录音的时长，单位 ms
      format: 'mp3',//音频格式，有效值 aac/mp3
    });
    this.setData({
      isRecording: true
    })
  },

  //录音暂停
  recordPause() {
    let that = this;
    wx.setKeepScreenOn({
      keepScreenOn: false
    })
    that.recorderManager.stop();
    that.recorderManager.onStop(function (res) {
      if (that.data.recordDuration <= 0) {
        wx.showToast({
          title: "录音时长为0",
          icon: 'none'
        })
      } else {
        that.uploadFile(res.tempFilePath);
      }
      that.setData({
        recordSecond: '00',
        recordMinute: '00',
        isRecording: false
      })
      clearInterval(that.data.t1);
    });

    that.recorderManager.onError(function (res) {
      // 停止录音之后，把录取到的音频放在res.tempFilePath
      console.log("录制失败", res)
    });
    that.setData({
      isRecording: false
    })
  },
//录音结束
  recordStop(){
    let that = this;
    wx.setKeepScreenOn({
      keepScreenOn: false
    })
    that.recorderManager.stop();
    that.recorderManager.onStop(function (res) {
      if (that.data.recordDuration <= 0) {
        wx.showToast({
          title: "录音时长为0",
          icon: 'none'
        })
      } else {
        that.uploadFile(res.tempFilePath);
      }
      that.setData({
        recordSecond: '00',
        recordMinute: '00',
        isRecording: false
      })
      clearInterval(that.data.t1);
    });

    that.recorderManager.onError(function (res) {
      // 停止录音之后，把录取到的音频放在res.tempFilePath
      console.log("录制失败", res)
    });
    that.setData({
      isRecording: false
    })
  },

  uploadFile(path) {
    let that = this;
    let authorize = encodeURIComponent('308503&51668374EE8D4NdV6664EBB7CE22ABF701A668130895ACAFD43CEBE5DEED04A7401C560B86C81BF6')
    wx.uploadFile({
      url: 'https://upload.ximalaya.com/dtres/audio/upload?_token=' + authorize + "&callerSource=ambassador",
      filePath:path,
      name: 'myfile',
      success: function (res) {
        if (res.statusCode == '200') {
          console.log("datadata", res.data.data[0].url)
        } else {
          wx.showToast({
            title: '上传失败，请重试',
            icon: "none"
          });
        }
        if (msg) {
          wx.showToast({
            title: msg,
            icon: "none"
          });
        }
      },
      fail: function (res) {
        wx.showToast({
          title: "上传出错，请重试",
          icon: "none"
        });
      }
    })
  },

  recordTime: function () {
    let that = this;
    let flag = that.data.timeFlag;
    let a = 0;
    let b = 0;
    let x = 0;
    let y = 0;
    // t1 = setInterval(beginTime, 1000);
    let t1 = setInterval(() => {
      beginTime()
    }, 1000);
    that.data.t1 = t1;

    function beginTime() {
      that.data.recordDuration++;
      x++;
      if (x < 10) {
        let seconds = '0' + x;
        that.setData({
          recordSecond: seconds
        })
      } else if (x >= 10 && x <= 59) {
        let seconds = x;
        that.setData({
          recordSecond: seconds
        })
      } else if (x > 59) {
        // seconds = '00';
        that.setData({
          recordSecond: "00"
        })
        x = 0;
        a++;
      }
      if (a < 10) {
        let minus = '0' + a;
        that.setData({
          recordMinute: minus
        })
      } else if (a >= 10) {
        let minus = a;
        that.setData({
          recordMinute: minus
        })
        this.recordStop()
        clearInterval(t1);
      }
    }
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