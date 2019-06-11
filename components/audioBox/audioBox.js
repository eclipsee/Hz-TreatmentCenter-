const app = getApp();
import Util from '../../utils/util.js';
// components/audioBox/audioBox.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src: String,
    width: {
      type: Number,
      value: 524
    },
    progressWidth: {
      type: Number,
      value: 315
    },
    duration: Number,
    lessonId:Number,
    workId:Number,
    pageName:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    timer: null,
    durationFormat: '0\'\'',
    audioContext: null,
    isPlaying: '0', //0未播放 1 准备中 2 播放
    progressBarWidth: '0%',
    currentTime: 0,
    restTime: "00:00",
    durationStr: '00:00',
    startX: 0,
    barWidth: 0,
    waitingCount: 0,
    pageType:""
  },
  ready() {
    console.log("音频初始化", this.data.lessonId, this.data.workId, this.data.pageName)
    wx.getSystemInfo({
      success: res => {
        let modelmes = res.model;
        if (modelmes.search('iPhone') != -1) {
          wx.setInnerAudioOption({ obeyMuteSwitch: false, mixWithOther: false });
          // that.globalData.isIphoneX = true
        }
      }
    })
    // this.data.restTime = Util.formatSeconds(this.data.duration);
    this.setData({
      restTime: Util.formatSeconds(this.data.duration)
    })
    this.data.audioContext = wx.createInnerAudioContext();
    this.data.audioContext.src = this.data.src;

    this.data.audioContext.onPlay(() => {
      this.data.audioContext.onTimeUpdate(() => {
        this.setData({
          isPlaying: "2"
        })
        if (app.globalData.curSrc && app.globalData.curSrc != this.data.src) {
          clearInterval(this.data.timer);
          this.data.timer = null;
          this.data.audioContext.pause();
        }
        this.setData({
          progressBarWidth: Math.floor(this.data.audioContext.currentTime) / Math.floor(this.data.audioContext.duration) * 100 + '%',
          restTime: Util.formatSeconds(this.data.audioContext.duration - this.data.audioContext.currentTime)
        })
      });
    })

    this.data.audioContext.onEnded(() => {
      var that = this;
      that.setData({
        progressBarWidth: "0%",
        isPlaying: "0",
        restTime: Util.formatSeconds(that.data.audioContext.duration)
      })
    })

    this.data.audioContext.onPause(() => {
      this.setData({
        isPlaying: "0"
      })
    })

    this.setData({
      durationFormat: this.formateDuration(this.data.duration)
    })

    this.data.audioContext.onEnded(() => {
      this.reset();
    })
  },
  detached() {
    this.reset();
    this.playAudio = null;
    this.onPlay = null;
    this.changeProgress = null;
    this.startProgress = null;
    this.setData({
      isPlaying: "0"
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 播放音频
    playAudio() {
      // app.globalData.curSrc = this.data.src;
      // console.log("开始播放播放")
      this.data.audioContext.onWaiting(() => {
        // console.log("加载中")
        let a = setInterval(() => {
          if (this.data.audioContext.duration > 0) {
            this.setData({
              isPlaying: "1"
            })
            clearInterval(a);
          }
          this.data.waitingCount++;
        }, 100)
      })
      // this.data.audioContext.onCanplay(() => {
      //   console.log("加载完毕", this.data.waitingCount)
      //   if (this.data.waitingCount > 5) {
      //     let a = setInterval(() => {
      //       if (this.data.audioContext.duration > 0) {
      //         this.setData({
      //           isPlaying: "0"
      //         })
      //         clearInterval(a);
      //       }
      //     }, 100)
      //   }
      // })
      if (this.data.isPlaying === "2") {
        this.data.audioContext.pause();
        this.setData({
          isPlaying: "0"
        })
      } else {
        app.globalData.curSrc = this.data.src;
        this.data.audioContext.pause();
        this.data.audioContext.play();
        this.setData({
          isPlaying: "2"
        })
      }

      if (this.data.pageName.length > 0) {
        switch (this.data.pageName) {
          case 'question':
            wx.reportAnalytics('question_play_audio', {
              srcpage: "马上打卡作业页",
              srcpageid: '音频答案',
              srcmodule: 'button',
              item: 'play|pause',
              lessonid: this.data.lessonId,
              workid: this.data.workId,
            });
            break;
          case 'questionAnswer':
            wx.reportAnalytics('answer_play_audio', {
              srcpage: "马上打卡作业解析页",
              srcpageid: '音频答案',
              srcmodule: 'button',
              item: 'play|pause',
              lessonid: this.data.lessonId,
              workid: this.data.workId,
            });
            break;
        }
      }
    },


    // 重置播放器
    reset: function () {
      clearInterval(this.data.timer);
      this.setData({
        timer: null,
        isPlaying: "0",
      })
      this.data.audioContext.pause();
      this.data.audioContext.seek(0);
    },
    //更新ui
    refreshUI(newData) {
      this.setData(newData);
    },
    // 格式化音频播放时长
    formateDuration: function (seconds) {
      seconds = Math.round(seconds);
      let hour = Math.floor(seconds / (60 * 60));
      let minute = Math.floor((seconds - hour * 60 * 60) / 60);
      let second = Math.round((seconds - hour * 60 * 60) % 60);
      if (hour > 0) {
        return hour + '\'' + minute + '\'\'' + second + '\'\'\'';
      } else if (minute > 0) {
        return minute + '\'' + second + '\'\'';
      } else {
        return second + '\'\'';
      }
    },
    // 监听进度条拖动
    changeProgress(event) {
      this.data.barWidth = this.data.barWidth + event.touches[0].pageX - this.data.startX;
      this.data.startX = event.touches[0].pageX;
      if (this.data.barWidth > this.data.progressWidth) {
        this.data.audioContext.seek(0);
        this.setData({
          isPlaying: "0",
          progressBarWidth: '0%',
          restTime: '00:00',
          barWidth: 0,
          startX: 0
        })
      } else {
        var newprogressBarWidth = this.data.barWidth / this.data.progressWidth * 100 + '%';
        this.setData({
          progressBarWidth: newprogressBarWidth
        })

      }
      // this.refreshUI(this.data);
    },
    // 开始拖动
    startProgress(event) {
      console.log("222", this.data.barWidth, this.data.progressWidth)
      this.data.startX = event.touches[0].pageX;
      if (this.data.pageName.length > 0) {
        switch (this.data.pageName) {
          case 'question': 
            wx.reportAnalytics('touch_progress', {
              srcpage: "马上打卡作业页",
              srcpageid: '音频答案',
              srcmodule: 'button',
              item: 'progressBar',
              lessonid: this.data.lessonId,
              workid: this.data.workId,
            });
          break;
          case 'questionAnswer': 
            wx.reportAnalytics('answer_touchprogress', {
              srcpage: "马上打卡作业解析页",
              srcpageid: '音频答案',
              srcmodule: 'button',
              item: 'progressBar',
              lessonid: this.data.lessonId,
              workid: this.data.workId,
            });
          break;
        }
      }
    
      
    },
    endProgress(event) {
      var newprogressBarWidth = this.data.barWidth / this.data.progressWidth * 100 + '%';
      this.setData({
        progressBarWidth: newprogressBarWidth
      })
      this.data.audioContext.seek(this.data.duration * this.data.barWidth / this.data.progressWidth);
    }
  },

})
