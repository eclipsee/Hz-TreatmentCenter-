// components/record/record.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tag: {
      type: String,
      value: '1'
    },
    recordStatus: {
      type: String,
      value: '0'
    },
    recordMinute: {
      type: String,
      value: '00'
    },
    recordSecond: {
      type: String,
      value: '00'
    },
    theme: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    recorderManager: null,
    audioContext: null,
    t1: {}
  },

  ready() {
    this.recorderManager = wx.getRecorderManager()
    this.data.audioContext = wx.createInnerAudioContext()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //点击录音按钮
    recordStart() {
      console.log('点击了录音', this.data.recordStatus)
      let _this = this
      let recordStatus = this.data.recordStatus
      if (recordStatus == 0) {
        wx.getSetting({
          success(res) {
            // 进行授权检测，未授权则进行弹层授权
            if (typeof res.authSetting['scope.record'] != 'undefined') {
              if (res.authSetting['scope.record'] == true) {
                _this.recordFn()
              } else if (res.authSetting['scope.record'] == false) {
                wx.showModal({
                  content: '检测到您没打开录音的权限，是否去设置打开？',
                  confirmText: '确认',
                  cancelText: '取消',
                  success: function(res) {
                    //点击“确认”时打开设置页面
                    if (res.confirm) {
                      console.log('用户点击确认')
                      wx.openSetting({
                        success: res => {}
                      })
                    } else {
                      console.log('用户点击取消')
                    }
                  }
                })
              }
            } else {
              wx.authorize({
                scope: 'scope.record',
                success() {
                  //这里是用户同意授权后的回调
                  _this.recordFn()
                },
                fail() {
                  //这里是用户拒绝授权后的回调
                }
              })
            }
          },
          fail(res) {
            console.log(res)
          }
        })
      } else if (recordStatus == 1) {
        _this.recordPause()
      } else if (recordStatus == 2) {
        _this.playFn()
      }
    },

    playFn() {
      console.log('开始播放')
      this.data.audioContext.src = this.data.audioSrc
      this.data.audioContext.play()
      this.setData({
        isRecording: true,
        recordStatus: 3
      })
    },

    recordFn() {
      wx.setKeepScreenOn({
        keepScreenOn: true
      })
      this.recordTime()
      this.recorderManager.start({
        duration: 600000, //指定录音的时长，单位 ms
        format: 'mp3' //音频格式，有效值 aac/mp3
      })
      this.setData({
        isRecording: true,
        recordStatus: 1
      })
    },

    //录音暂停
    recordPause() {
      let that = this
      wx.setKeepScreenOn({
        keepScreenOn: false
      })
      that.recorderManager.stop()
      that.recorderManager.onStop(function(res) {
        if (that.data.recordDuration <= 0) {
          wx.showToast({
            title: '录音时长为0',
            icon: 'none'
          })
        } else {
          console.log('停止了停止了', res.tempFilePath)
          // that.uploadFile(res.tempFilePath);
          that.setData({
            audioSrc: res.tempFilePath
          })
        }
        that.setData({
          isRecording: false,
          recordStatus: 2
        })
        clearInterval(that.data.t1)
      })

      that.recorderManager.onError(function(res) {
        // 停止录音之后，把录取到的音频放在res.tempFilePath
        console.log('录制失败', res)
      })
      that.setData({
        isRecording: false
      })
    },

    //录音发送
    recordSend() {
      let src = this.data.audioSrc
      console.log('src', src)
      this.uploadFile(src)
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/index/index?flag',
        })
      }, 500)
      this.setData({
        recordSecond: '00',
        recordMinute: '00',
        recordStatus: 0
      })
      this.triggerEvent('bubbles')
    },

    recordRestart() {
      this.data.audioContext.pause()
      this.data.audioContext.src = ''
      this.setData({
        audioSrc: '',
        recordSecond: '00',
        recordMinute: '00',
        recordStatus: 0
      })
      clearInterval(this.data.t1)
    },

    uploadFile(path) {
      console.log(path)
      let that = this
      let authorize = encodeURIComponent(
        '308503&51668374EE8D4NdV6664EBB7CE22ABF701A668130895ACAFD43CEBE5DEED04A7401C560B86C81BF6'
      )
      wx.uploadFile({
        url:
          'https://ranxinxiang.cn/api/upload/girl',
        filePath: path,
        name: 'file',
        header: {
          "Content-Type": "multipart/form-data"
        },
        success: function(res) {
          if (res.statusCode == '200') {
            console.log('datadata', res)
          } else {
            wx.showToast({
              title: '上传失败，请重试',
              icon: 'none'
            })
          }
          if (res.msg) {
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
          }
        },
        fail: function(res) {
          wx.showToast({
            title: '上传出错，请重试',
            icon: 'none'
          })
        }
      })
    },

    recordTime: function() {
      let that = this
      let flag = that.data.timeFlag
      let a = 0
      let b = 0
      let x = 0
      let y = 0
      // t1 = setInterval(beginTime, 1000);
      let t1 = setInterval(() => {
        beginTime()
      }, 1000)
      that.data.t1 = t1

      function beginTime() {
        that.data.recordDuration++
        x++
        if (x < 10) {
          let seconds = '0' + x
          that.setData({
            recordSecond: seconds
          })
        } else if (x >= 10 && x <= 59) {
          let seconds = x
          that.setData({
            recordSecond: seconds
          })
        } else if (x > 59) {
          // seconds = '00';
          that.setData({
            recordSecond: '00'
          })
          x = 0
          a++
        }
        if (a < 10) {
          let minus = '0' + a
          that.setData({
            recordMinute: minus
          })
        } else if (a >= 10) {
          let minus = a
          that.setData({
            recordMinute: minus
          })
          this.recordStop()
          clearInterval(t1)
        }
      }
    }
  }
})
