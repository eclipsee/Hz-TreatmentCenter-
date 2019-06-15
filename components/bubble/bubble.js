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
    togglePlay() {
      let timer = null;
      if (this.data.playing) {
        this.audioCtx.pause();
        clearInterval(this.data.timer);
      } else {
        this.audioCtx.src = this.data.bubble.url;
        this.audioCtx.play();
        timer = setInterval(() => {
          this.setData({ time: this.data.time + 1 });
        }, 1000);
      }
      this.setData({ playing: !this.data.playing, timer });
    },
  },
});
