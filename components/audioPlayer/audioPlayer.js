import Util from '../../utils/util.js';

// components/audioPlayer/audioPlayer.js
var app = getApp();
var _playerStateChange = null;
var _stop = null;
var _pause = null;
var _play = null;
var _error = null;
var _end = null;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src: String,
    coverUrl: String,
    progressWidth: {
      type: Number,
      value: 315
    },
    title: String,
    duration: Number,
    taskId: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 与UI绑定的
    isPlaying: true,
    progressBarWidth: '0%',
    progressBarBufferWidth: '0%',
    // 与UI无关的
    audioContext: null,
    currentTime: '00:00',
    durationStr: '00:00',
    startX: 0,
    barWidth: 0,
    touched: false,
    hide:false
  },
  ready() {
    app.player.setSoundInfo({
      soundId: this.data.taskId,
      dataUrl: this.data.src,
      coverImgUrl: this.data.coverUrl,
      title: this.data.title
    })
    let systemInfo = {};
    wx.getSystemInfo({
      success: function(res) {
        systemInfo = res;
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    app.player.play();
    let self = this;
    _playerStateChange = (res) => {
      if (res.soundId === this.data.taskId) {
        // if (Math.abs(res.duration - res.currentPosition)<2){
        //   // 播放结束
        //   app.player.clearSoundInfo();
        //   this.setData({
        //     isPlaying: true,
        //     progressBarWidth: '0%',
        //     currentTime: '00:00'
        //   })
        // } else {
        // this.data.duration = Util.formatSeconds(event.detail.duration);
        // if (systemInfo.system && systemInfo.system.indexOf("iOS") > -1) {
        //   if (this.data.duration == Math.ceil(res.currentPosition - 1)) {
        //     app.player.stop();
        //     return;
        //   }
        // } else {
        //   if (this.data.duration == Math.ceil(res.currentPosition + 1)) {
        //     app.player.stop();
        //   }
        // }

        this.setData({
          currentTime: Util.formatSeconds(res.currentPosition),
          progressBarWidth: res.currentPosition / res.duration * 100 + '%',
          progressBarBufferWidth: res.buffered / res.duration * 100 + '%',
        })
        // }
      }
    }
    _stop = () => {
      this.setData({
        isPlaying: false,
        progressBarWidth: '0%',
        progressBarBufferWidth: '0%',
        currentTime: '00:00'
      })
    }
    _pause = () => {
      this.setData({
        isPlaying: false
      })
    }
    _play = () => {
      this.setData({
        isPlaying: true
      })
    }
    _error = () => {
      this.setData({
        isPlaying: false
      })
    }
    _end = () => {
      this.setData({
        isPlaying: false,
        progressBarWidth: '0%',
        currentTime: '00:00'
      })
      app.player.pause();
    }
    app.player.on("playerStateChange", _playerStateChange);
    app.player.on("stop", _stop);
    app.player.on("pause", _pause);
    app.player.on("play", _play);
    app.player.on("end", _end);
    this.setData({
      durationStr: Util.formatSeconds(this.data.duration) || '00:00'
    })
  },
  onShow(){
    // let data = Object.assign({},this.data)
    // this.setData(data)
    // app.player.getState(function(res){
    //   if(res.)
    // })
    this.setData({
      hide:true
    })
  },
  onHide(){
    this.setData({
      hide:false
    })
  },
  /**
   * 组件卸载的时候，清空监听器，防止内存泄露
   */
  detached() {
    this.togglePlay = null;
    this.onUpdateProgress = null;
    this.changeProgress = null;
    this.startProgress = null;
    // this.data.audioContext.pause();
    this.unBindEvents();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 音频播放与暂停
    togglePlay(isPlaying) {
      app.player.setSoundInfo({
        soundId: this.data.taskId,
        dataUrl: this.data.src,
        coverImgUrl: this.data.coverUrl,
        title: this.data.title
      });
      if (this.data.isPlaying === true) {
        // this.data.audioContext.pause();
        app.player.pause();
        this.data.isPlaying = false;
        wx.setKeepScreenOn({
          keepScreenOn: false
        })
      } else {
        if (Util.parseSeconds(this.data.currentTime) > 0) {
          app.player.seek(Util.parseSeconds(this.data.currentTime));
        }
        app.player.play();
        this.data.isPlaying = true;
        wx.setKeepScreenOn({
          keepScreenOn: true
        })
      }
      this.setData({
        isPlaying: this.data.isPlaying
      })
    },
    unBindEvents() {
      let self = this;
      app.player.removeListener('playerStateChange', _playerStateChange);
      app.player.removeListener('pause', _pause);
      app.player.removeListener('play', _play);
      app.player.removeListener('stop', _stop);
      app.player.removeListener('end', _end);
    },
    reset() {
      this.setData({
        isPlaying: false,
        progressBarWidth: '0%',
        progressBarBufferWidth: '0%',
        currentTime: '00:00'
      })
    },
    // 监听播放
    // onUpdateProgress:(event)=> {
    //   debugger;
    //   if (event.detail.duration === event.detail.currentTime) {
    //     // 播放结束
    //     this.data.isPlaying = false;
    //     this.data.progressBarWidth = '0%';
    //     this.data.currentTime = '00:00';
    //   } else {
    //     // this.data.duration = Util.formatSeconds(event.detail.duration);
    //     this.data.currentTime = Util.formatSeconds(event.detail.currentTime);
    //     this.data.progressBarWidth = event.detail.currentTime / event.detail.duration * 100 + '%';
    //   }
    //   this.refreshUI(this.data);
    // },
    // 监听进度条拖动
    changeProgress(event) {
      this.data.barWidth = this.data.barWidth + event.touches[0].pageX - this.data.startX;
      this.data.startX = event.touches[0].pageX;
      if (this.data.barWidth > this.data.progressWidth) {
        this.setData({
          isPlaying: false,
          progressBarWidth: '0%',
          currentTime: '00:00'
        })
        app.player.seek(0);
        this.data.barWidth = 0;
        this.data.startX = 0;
      } else if (this.data.barWidth <= 0){
        this.setData({
          progressBarWidth: '0%',
          currentTime: '00:00'
        })
        app.player.seek(0);
        this.data.barWidth = 0;
        this.data.startX = 0;
      } else{
        // this.data.audioContext.seek(this.data.duration * this.data.barWidth / this.data.progressWidth);
        this.setData({
          progressBarWidth: this.data.barWidth / this.data.progressWidth * 100 + '%',
        })
      }

    },

    // 点击设置进度
    setProgress(event) {
      this.data.barWidth = event.detail.x - event.currentTarget.offsetLeft;
      this.data.startX = event.detail.x;
      if (this.data.barWidth < this.data.progressWidth) {
        app.player.seek(this.data.duration * this.data.barWidth / this.data.progressWidth);
      } else {
        return;
      }
      if (!this.data.isPlaying) {
        app.player.play();
        this.setData({
          isPlaying: true
        })
        return;
      }
      // if (this.data.barWidth >= this.data.progressWidth){
      //   app.player.stop();
      //   this.setData({
      //     isPlaying: false,
      //     progressBarWidth: '0%',
      //     currentTime: '0:00'
      //   })
      // } else {
     
      //}
      this.setData({
        progressBarWidth: this.data.barWidth / this.data.progressWidth * 100 + '%',
        currentTime: Util.formatSeconds(this.data.duration * this.data.barWidth / this.data.progressWidth)
      })
    },
    endProgress(event) {
      this.setData({
        touched: false
      })
      if(this.data.barWidth >= this.data.progressWidth){
        return ;
      }
      app.player.seek(this.data.duration * this.data.barWidth / this.data.progressWidth);
    },
    // 开始拖动
    startProgress(event) {
      this.setData({
        touched: true
      })
      this.data.barWidth = event.touches[0].pageX - 30;
      this.data.startX = event.touches[0].pageX;
    },
    refreshUI(newData) {
      this.setData(newData);
    }
  }
})