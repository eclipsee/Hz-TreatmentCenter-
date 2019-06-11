const app = getApp();
// components/nextBtn.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    status:String,
    disable:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    btnStatus:{
      'nextChapter':'下一章',
      'startWorking':'去完成作业',
      'checkIn':'立即打卡',
      'checkInOther':'立即补卡',
      'startLearning': '开始学习',
      'finishLearning':'完成学习',
      'finished':'完成',
      'reviewCheckIn': '查看今日打卡',
      'reviewCheckInBreak': '查看本关打卡',
      'nextTitle':'下一题',
      'submitAndReview':'提交并查看作业解析',
      'return':'返回',
      'analysisPage':'查看作业解析'
    },
    isIphoneX:false
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  ready(){
    this.setData({
      isIphoneX:app.globalData.isIphoneX
    })
  }
})
