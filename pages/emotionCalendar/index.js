//logs.js
import { arrayList } from './data.js'
import { dbRequests } from '../../requests/request'

Page({
  data: {
    voiceList: []
  },

  onLoad: function() {
    dbRequests
      .getUserBubbles('94b1e1fc5d05b1a002435cf46ae41970')
      .then(res => {
        const voiceList = (res || []).map(item => {
          const { update_time, tag, url } = item
          const day = `${update_time.getDate()}年${update_time.getMonth() +
            1}月`
          const time = `${update_time.getHours()}:${update_time.getMinutes()}PM`
          return {
            ...item,
            day,
            time,
            bubble: { tag, url }
          }
        })
        this.setData({
          voiceList
        })
        console.log(res)
      })
      .catch(() => {
        wx.showModal({
          title: '获取失败',
          showCancel: false
        })
      })
  }
})
