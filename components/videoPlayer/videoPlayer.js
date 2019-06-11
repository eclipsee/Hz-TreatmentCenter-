import Util from '../../utils/util.js';
// components/videoPlayer/videoPlayer.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src: String,
    coverUrl: String,
    progressWidth: {
      type: Number,
      value: 183
    },
    duration: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 与UI绑定的
    isPlaying: false,
    progressBarWidth: '0%',
    progressBarWidthBack: '-6%',
    nativeControl: false,
    controlVisible: false,
    // 与UI无关的
    videoContext: null,
    currentTime: '00:00',
    durationStr: '00:00',
    startX: 0,
    barWidth: 0,
    isStart:true,
    currentStr:0,
    playState:0, // 0 暂停 1 播放 2 loading状态
    curTime:0,
    curStorage:0,
    hidden:true,
    playReady:false
  },
  attached(){
    // this.triggerEvent('onPlayerLoad',{});
  },
  ready() {
    //进度缓存
    this.data.videoContext = wx.createVideoContext('myVideo', this);
    // this.data.videoContext.play();
    this.setData({
      durationStr: Util.formatSeconds(this.data.duration) || '00:00'
    })
    var src = this.data.src;
    var srcString = src.substring(src.lastIndexOf("\/") + 1, src.lastIndexOf("."));
    this.data.curStorage = wx.getStorageSync(srcString);
    this.data.currentTime = Util.formatSeconds(this.data.curStorage);
    console.log("111", this.data.curStorage)
  },
  /**
   * 组件卸载的时候，清空监听器，防止内存泄露
   */
  detached() {
    this.togglePlay = null;
    this.onUpdateProgress = null;
    this.endPlaying = null;
    this.startPlay = null;
    this.startPause = null;
    this.changeProgress = null;
    this.startProgress = null;
    this.enFullScreen = null;
    this.listenFullScreen = null;
    // console.log("离开", this.data.duration, this.data.currentStr)

     //进度缓存
    if (Util.formatSeconds(this.data.duration) !== this.data.currentTime ) {
      var src = this.data.src;
      var srcString = src.substring(src.lastIndexOf("\/") + 1, src.lastIndexOf("."));
      if (this.data.currentTime != '00:00'){
        console.log("存储", srcString)
        wx.setStorageSync(srcString,Util.parseSeconds(this.data.currentTime))
      }else{
        console.log("为0")
        var cur = wx.getStorageSync(srcString, '0')
        if (cur){
          wx.removeStorageSync(srcString)
        }
      } 
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 音频播放与暂停
    togglePlay() {
      if (this.data.isPlaying === true) {
        this.data.videoContext.pause();
        this.data.isPlaying = false;
      } else {
        this.data.videoContext.play();
        this.data.isPlaying = true;
      }
      this.refreshUI(this.data);
    },
    // 监听播放
    onUpdateProgress(event) {
     this.setData({
       currentStr: event.detail.currentTime
     })
     if(!this.data.playReady){
        if (this.data.curStorage) {
          // setTimeout(()=>{
            this.data.videoContext.seek(parseInt(this.data.curStorage));
          // },100)
         
          // this.data.videoContext.initalTime = parseInt(this.data.curStorage);
          // this.data.videoContext.play();
       }
       this.setData({
         playReady:true,
         hidden:false
       })
      //  this.triggerEvent('onPlayerReady',{});
     }

     console.log(this.data.curStorage);
      if (event.detail.duration === event.detail.currentTime || this.data.progressBarWidth == '100%') {
        // 播放结束
        this.data.isPlaying = false;
        this.data.progressBarWidth = '0%';
        this.data.progressBarWidthBack = '-6%';
        this.data.currentTime = '00:00';
        
      } else {
        this.data.duration = Util.formatSeconds(event.detail.duration);
        this.data.currentTime = Util.formatSeconds(event.detail.currentTime);
        this.data.progressBarWidth = event.detail.currentTime / event.detail.duration * 100 + '%';
        this.data.progressBarWidthBack = event.detail.currentTime / event.detail.duration * 100 - 6 + '%';
      }
      // this.refreshUI(this.data);
    },
    // 监听播放结束
    endPlaying(event) {
      this.setData({
        playState: 0
      })
      this.data.isPlaying = false;
      this.data.progressBarWidth = '0%';
      this.data.progressBarWidthBack = '-6%';
      this.data.currentTime = '00:00';
      this.refreshUI(this.data);
      var src = this.data.src;
      var srcString = src.substring(src.lastIndexOf("\/") + 1, src.lastIndexOf("."));
      var cur = wx.getStorageSync(srcString, '0')
      if (cur) {
        console.log("播放完成")
        wx.removeStorageSync(srcString)
      }
    },
    onWaiting(event){
      if(this.data.playState !== 2){
        this.setData({
          playState: 2
        })
      }
    },
    onError(event){
      if(this.data.playState !== 0){
        this.setData({
          playState: 0
        })
      }
    },
    playVideo(){
      // console.log("点击播放")
      // var src = this.data.src;
      // var srcString = src.substr(src.lastIndexOf("\/") + 1, src.lastIndexOf("."));
      // var curStorage = wx.getStorageSync(srcString);
      // console.log("111", curStorage)
      // if (curStorage) {
      //   console.log("有进度")
      //   this.data.videoContext.seek(curStorage);
      //   this.data.videoContext.play();
      // } else {
      //   this.data.videoContext.play();
      // }
      this.data.videoContext.play();
      this.setData({
        playState: 2
      })
    },
    // 开始播放
    startPlay(event) {
      this.setData({
        isPlaying: true,
        playState:1
      })
    },
    // 暂停播放
    startPause(event) {
      this.setData({
        isPlaying: 1
      })
    },
    // 监听进度条拖动
    changeProgress(event) {
      this.data.barWidth = this.data.barWidth + event.touches[0].pageX - this.data.startX;
      this.data.startX = event.touches[0].pageX;
      if (this.data.barWidth > this.data.progressWidth || this.data.barWidth < 0) {
        this.data.videoContext.seek(0);
        this.data.barWidth = 0;
        this.data.startX = 0;
        this.setData({
          isPlaying:false,
          progressBarWidth: '0%',
          progressBarWidthBack:'-6%',
          currentTime: '00:00'
        })
      } else {
        this.setData({
          progressBarWidth: this.data.barWidth / this.data.progressWidth * 100 + '%',
          progressBarWidthBack: this.data.barWidth / this.data.progressWidth * 100 - 6 + '%'
        })
      }
    },
    // 开始拖动
    startProgress(event) {
      this.data.startX = event.touches[0].pageX;
    },
    // 停止拖动
    endProgress(event) {
      this.data.videoContext.seek(Util.parseSeconds(this.data.durationStr) * this.data.barWidth / this.data.progressWidth);
    },
    // 点击设置进度
    setProgress(event) {
      // 点击设置进度
      this.data.barWidth = event.detail.x - event.currentTarget.offsetLeft;
      this.data.startX = event.detail.x;
      this.data.videoContext.seek(Util.parseSeconds(this.data.durationStr) * this.data.barWidth / this.data.progressWidth);
      this.setData({
        progressBarWidth: this.data.barWidth / this.data.progressWidth * 100 + '%',
        progressBarWidthBack:this.data.barWidth / this.data.progressWidth * 100 - 6 + '%'
      })
    },
    refreshUI(newData) {
      this.setData(newData);
    },
    // 打开全屏
    enFullScreen() {
      this.data.videoContext.requestFullScreen();
    },
    // 监听打开或退出全屏
    listenFullScreen(event) {
      if (event.detail.fullScreen === true) {
        this.data.nativeControl = true;
      } else {
        this.data.nativeControl = false;
      }
      this.setData({
        nativeControl: this.data.nativeControl
      })
    },
    touchStart(event) {
      clearInterval(this.data.controlInterval);
      this.setData({
        controlVisible: true
      })
      this.data.controlInterval = setInterval(() => {
        this.setData({
          controlVisible: false
        })
      }, 5000);

    }
  }
})