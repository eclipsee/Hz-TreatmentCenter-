// components/bubble/bubble.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    size: {
      type: String,
      value: 'middle',
    },
    bubble: {
      type: Object,
      value: {},
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    playing: false,
    time: 0,
    timer: null,
  },

  ready() {
    this.audioCtx = wx.createInnerAudioContext();
    this.audioCtx.onEnded(() => {
      console.log('onEnded');
      clearInterval(this.data.timer);
      this.setData({ playing: false, time: 0 });
    });
  },
  
  detached() {
    clearInterval(this.data.timer);
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getBubbleUrl(url) {
      return new Promise((resolve, reject) => {
        if (url.match(/^http/)) {
          resolve(url);
        } else {
          wx.cloud.downloadFile({
            fileID: url,
            success: res => {
              console.log(res.tempFilePath);
              resolve(res.tempFilePath);
            },
            fail: err => {
              console.log('获取音频失败');
              reject();
            },
          });
        }
      });
    },
    togglePlay() {
      let timer = null;
      if (this.data.playing) {
        this.audioCtx.pause();
        clearInterval(this.data.timer);
        this.setData({ playing: !this.data.playing });
      } else {
        console.log('bubble:', this.data.bubble);
        this.getBubbleUrl(this.data.bubble.url).then((url) => {
          this.audioCtx.src = url;
          this.audioCtx.play();
          timer = setInterval(() => {
            this.setData({ time: this.data.time + 1 });
          }, 1000);
          this.setData({ playing: !this.data.playing, timer });
        });
      }
    },
  },
});
