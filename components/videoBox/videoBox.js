const app = getApp();
// components/videoBox/videoBox.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src: String,
    duration: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    videoContext:null,
    status:'0',
    playTime:0,
    autoplay:'false',
    isFull:false,
    isPause:false,
    isPlay:false
  },

  ready() {
    this.data.videoContext = wx.createVideoContext("myVideo", this);
  },
  /**
   * 组件卸载的时候，清空监听器，防止内存泄露
   */
  detached() {
    this.playVideo = null;
    this.onFullscreenChange = null;
    this.timeUpdate = null;
    this.play = null;
  },
  /**
   * 组件的方法列表
   */
  methods: {
    playVideo:function(){
      app.globalData.curSrc = this.data.src;
      console.log("12334",this.data.isPlay)
      // this.data.videoContext.requestFullScreen();
      this.setData({
        isPlay:true
      })
      if (this.data.playTime == 0){
        this.data.videoContext.play();
      } else {
        console.log("you")
        this.data.videoContext.seek(this.data.playTime);
        this.data.videoContext.play();
      }
      if(this.data.status = '0'){
        this.setData({
          status: '1'
        })
      }else{
        this.setData({
          status: '0'
        })
      }
    },
    onFullscreenChange: function(event) {
      var that = this;
      console.log("event.detail.fullScreen", event.detail.fullScreen)
      if (event.detail.fullScreen == false) {
        // this.data.videoContext.pause();
        // this.data.videoContext.seek(0);
        that.setData({
          isFull: false
        })
        console.log("缩小时候的播放状态")
        // if (this.data.isPause == true){
        //   this.setData({
        //     status: '0'
        //   })
        // }
      }else{
        that.setData({
          isFull:true
        })
      }
    },
    bindtimeupdate: function (res){
      if (app.globalData.curSrc && app.globalData.curSrc != this.data.src) {
        this.reset();
      }
      this.setData({
        playTime: res.detail.currentTime
      })
    },
    play() {
      app.globalData.curSrc = this.data.src;
    },
    reset() {
      this.data.videoContext.seek(0);
      this.data.videoContext.pause();
    },
    bindpause(){
      this.setData({
        isPause: true,
        isPlay: false
      })
      this.data.videoContext.pause();
      console.log("this.data.isFull",this.data.isFull)
      if (this.data.isFull == false){
        this.setData({
          status: '0'
        })
        console.log("stat", this.data.status)
      }
      this.data.playTime = 0
      this.setData({
        isPlay: false
      })
    },
  }
});
