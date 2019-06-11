
const app = getApp()
Page({
    /**
     * 页面的初始数据
     *
     */
    data: {
      toUrl: null,
      navHeight: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options)
    {

      if (!options.toUrl)
      {
        return;
      }

      this.setData({
            toUrl: options.toUrl
      });

      this.setData({
          toUrl: null
      });

      this.setData({
        navHeight: app.globalData.navHeight
      })
    },
});