// components/audioPlayer/audioPlayer.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isHome: {
      type: String,
      value: '1'
    }
  },

  methods: {
    onClickNew() {
      wx.navigateTo({
        url: '../../pages/publish/publish'
      })
    },
    // 跳转至情绪日历
    onClickCalendar() {
      wx.navigateTo({
        url: '../../pages/emotionCalendar/index'
      })
    },
    onClickCatch() {
      wx.navigateTo({
        url: '../../pages/index/index'
      })
    }
  }
})
