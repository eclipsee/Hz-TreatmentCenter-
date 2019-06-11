// components/navBar/navBar.js
const App = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    pageName: String,
    showNav: {
      type: Boolean,
      value: true
    },
    showHome: {
      type: String,
      value: '1'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    hasPrevpage: false
  },
  ready() {
    let pages = getCurrentPages();
    let prevpage = pages[pages.length - 2];
    if (prevpage) {
      this.setData({
        hasPrevpage: true
      })
    } else {
      this.setData({
        hasPrevpage: false
      })
    }
  },
  lifetimes: {
    attached: function () {
      this.setData({
        navH: App.globalData.navHeight
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //回退
    navBack: function () {
      console.log("返回")
      wx.navigateBack({
        delta: 1
      })
    },
    //回主页
    toIndex: function () {
      console.log("去主页")
      wx.reLaunch({
        url: '/pages/todayTask/todayTask'
      })
    },
  }
})
