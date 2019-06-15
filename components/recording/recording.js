// components/recording/recording.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    recording: false,
    voice: null,
  },

  ready() {
    this.recorderManager = wx.getRecorderManager();
    this.recorderManager.onFrameRecorded((frameBuffer, isLastFrame) => {
      console.log(frameBuffer);
    });
  },

  /**
   * 组件的方法列表
   */
  methods: {
    record() {
      if (!this.data.recording) {
        this.recorderManager.start({
          duration: 600000,
          format: 'mp3',
        });
      } else {
        this.recorderManager.stop();
      }
     
      this.setData({
        recording: !this.data.recording,
      });
    },
  },
});
