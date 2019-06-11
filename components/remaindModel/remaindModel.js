// components/remaindModel/remaindModel.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isModelShow:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    externalAddress: "https://mp.weixin.qq.com/s/7s3e_gem3r4SYgKv5FaxTw"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancelModel:function(){
      this.setData({
        isModelShow:false
      })
      this.triggerEvent('myevent', {}, {})
    },
    toExternalAddress: function (event) {
      this.triggerEvent('openevent', {}, {})
      if (!event.currentTarget.dataset.externaladdress) {
        return;
      }
      wx.navigateTo({
        url: `/pages/webview/webview?toUrl=` + event.currentTarget.dataset.externaladdress
      });
    }
  }
})
