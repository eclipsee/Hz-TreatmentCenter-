import API from '../../requests/api/api.js';
import Analytics from '../../requests/analytics.js';
var WxParse = require('../../wxParse/wxParse.js');
import Constant from '../../constants/constants.js';
import Loader from '../commen/loader/Loader.js';

const app = getApp();
const logger = app.logger;

// pages/learning/learning.js
Page({
  type:"learning",
  /**
   * 页面的初始数据
   */
  data: {
    btnStatus: 'nextChapter',
    item:{},
    dateFlag: 'today',
    fromPage:'',
    prevPage:{},
    // hide:false
    navHeight:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 从缓存拿到当前点击的任务对象信息
    this.loader = new Loader(this);
    this.setData({
      item: JSON.parse(wx.getStorageSync(options.key)),
      fromPage:options.fromPage || '',
      navHeight: app.globalData.navHeight
    });
    console.log("itemitem",this.data.item)
    // 解析富文本
    WxParse.wxParse('lessonContent', 'html', this.data.item.tasks[this.data.item.currentTaskIndex].taskContent.lessonContent, this, 15);
    // 拿到上一页面实例
    let pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    this.data.prevPage = pages[pages.length - 2];
    var checkedDate = wx.getStorageSync("checkedDate").replace(/-/g, '/')
    console.log("拿到的日期", checkedDate)
    prevPage.setData({
      checkedTime: checkedDate
    })
    // 更新任务状态
    let params = {};
    params["taskType"] = 'course'
    params["courseId"] = this.data.item.courseId;
    params["taskRef"] = this.data.item.tasks[this.data.item.currentTaskIndex].id;
    params["taskStatus"] = "done";
    params['taskResult'] = {};
    // 判断提交内容是否有误，上报
    if (this.data.item.tasks[this.data.item.currentTaskIndex].taskType != 'course') {
      let message = {
        'msg': 'learning error submit taskResult',
        'item': this.data.item
      }
      logger.error(message);
    }
    let _this = this;
    if (['not_startted', 'inprocess','done'].indexOf(this.data.item.tasks[this.data.item.currentTaskIndex].taskStatus) > -1){
      API.submitTask(params,false,false).then((res) => {
        console.log("updateTaskStatus")
        _this.data.prevPage.updateTaskStatus && _this.data.prevPage.updateTaskStatus();
      },err => {
        if(err.data.errorCode == -158){
          wx.showModal({
            title: '提示',
            content: '抱歉，该任务已经下架',
            showCancel:false,
            success:function(res){
              _this.data.prevPage.updateTaskStatus && _this.data.prevPage.updateTaskStatus();
              wx.navigateBack();
            }
          })
        } else {
          if (this.data.item.tasks[this.data.item.currentTaskIndex].taskStatus != 'done'){
            wx.navigateBack();
            wx.showToast({
              title: err.data.technialMessage,
              icon: 'none',
              duration: 2000
            })
          }
        }
      });
    }
  },
  onHide(){
    // this.setData({
    //   hide:true
    // })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.initBtnStatus();
    // 确定课程是否已下架
    let _this = this;
    API.courseOffConfirm({ courseId: this.data.item.courseId }).then(res => {
      wx.showModal({
        title: '提示',
        content: Constant.COURSE_OFF_MODAL,
        showCancel: false,
        success: res => {
          _this.data.prevPage.updateTaskStatus && this.data.prevPage.updateTaskStatus();
          if (_this.data.fromPage == 'todayTask'){
            wx.navigateBack();
          } else {
            wx.reLaunch({
              url: '/pages/todayTask/todayTask',
            })
          }
        }
      })
    });
  },
  /**
   * 生命周期函数-监听页面关闭
   */
  onUnload: function() {
    // 置空监听器，防止内存泄露
    this.runNext = null;
    this.nextChapter = null;
    this.reviewCheckIn = null;
    this.reviewAnalysisPage = null;
    this.checkIn = null;
    this.startWorking = null;
    this.report = null;
    // console.log("离开")
  },
  onShow:function(){
    Analytics.showLearningPage({
      courseId:this.data.item.courseId,
      taskId:this.data.item.tasks[this.data.item.currentTaskIndex].id
    });
    // if(this.data.hide){
    //   wx.redirectTo({
    //     url: '../learning/learning?key=item&from=lock',
    //   })
    //   this.setData({
    //     hide:false
    //   })
    // }
  },

  /**
   * 初始化底部按钮状态
   */
  initBtnStatus:function(){
    if (app.globalData.item && app.globalData.item.btnStatus){
      this.setData({
        btnStatus: app.globalData.item.btnStatus
      })
      return;
    }
    this.data.dateFlag = (new Date().getTime() - new Date(this.data.item.topicItemDate).getTime()) > 24*60*60*1000 ? 'yesterday' : 'today';
    if (this.data.item.doneCheckin) {
      // 1. 已打卡
      if (this.data.item.currentTaskIndex >= this.data.item.tasks.length - 1) {
        // 1.1 后面已无任务
        if (this.data.dateFlag === 'today') {
          // 1.1.1 查看今日打卡
          this.data.btnStatus = 'reviewCheckIn';
        } else {
          // 1.1.2 完成
          this.data.btnStatus = 'finishLearning';
        }
      } else {
        // 1.2 后面还有任务
        if (this.data.item.tasks[this.data.item.currentTaskIndex + 1].taskType !== 'quiz') {
          // 1.2.1 不是作业，下一章
          this.data.btnStatus = 'nextChapter';
        } else {
          // 1.2.2 是作业
          if (this.data.item.tasks[this.data.item.currentTaskIndex + 1].taskStatus == 'done') {
            // 1.2.2.1 如果作业已经完成，进入作业解析页
            this.data.btnStatus = 'analysisPage';
          } else {
            // 1.2.2.2 作业未完成，进入答题页
            this.data.btnStatus = 'startWorking';
          }

        }
      }
    } else {
      // 2. 未打卡
      if (this.data.item.currentTaskIndex >= this.data.item.tasks.length - 1) {
        // 2.1 后面已无任务
        // this.data.btnStatus = 'checkIn';
        // this.setData({
        //   btnStatus: 'checkIn'
        // })
        if (this.data.dateFlag === 'today') {
          // 2.1.1 立即打卡
          this.data.btnStatus = 'checkIn';
        } else {
          // 2.1.2 立即补卡
          this.data.btnStatus = 'checkInOther';
        }
      } else {
        // 2.2 后面还有任务
        if (this.data.item.tasks[this.data.item.currentTaskIndex + 1].taskType === 'quiz') {
          // 2.2.1 是作业
          if (this.data.item.tasks[this.data.item.currentTaskIndex + 1].taskStatus == 'done') {
            // 2.2.1.1 如果作业已经完成，进入作业解析页
            this.data.btnStatus = 'analysisPage';
          } else {
            // 2.2.1.2 作业未完成，进入答题页
            this.data.btnStatus = 'startWorking';
          }
        } else {
          // 2.2.2 进入下一章
          this.data.btnStatus = 'nextChapter';
        }
      }
    }
    this.setData({
      btnStatus: this.data.btnStatus
    })
  },
  /**
   * 点击最底部按钮，根据按钮状态进行相应操作
   */
  runNext:function(event) {
    switch (event.currentTarget.dataset.status) {
      case 'nextChapter': this.nextChapter(); break;
      case 'reviewCheckIn': this.reviewCheckIn(); break;
      case 'finished':;
      case 'finishLearning': this.finishLearning();break;
      case 'checkIn': this.checkIn(); break;
      case 'checkInOther': this.checkIn(); break;
      case 'startWorking': this.startWorking(); break;
      case 'analysisPage': this.reviewAnalysisPage(); break;
    }
  },
  /**
   * 进入下一章
   */
  nextChapter:function(event) {
    app.player.stop();
    Analytics.nextChapterOrStartWork({
      itemId:'下一章',
      courseId:this.data.item.courseId,
      taskId: this.data.item.tasks[this.data.item.currentTaskIndex].id
    })
    this.data.item.currentTaskIndex++;
    app.globalData.item = this.data.item;
    wx.setStorageSync('item', JSON.stringify(this.data.item));
    wx.redirectTo({
      url: '../learning/learning?key=item',
    })
  },
  /**
   * 查看今日打卡
   */
  reviewCheckIn:function(event) {
    app.player.stop();
    wx.redirectTo({
      url: `../share/share?from=finishCheckin&courseId=${this.data.item.courseId}&itemId=${this.data.item.id}`,
    })
  },
  /**
   * 查看作业解析页
   */
  reviewAnalysisPage:function(event){
    app.player.stop();
    app.globalData.item && (app.globalData.item.btnStatus = 'analysisPage');
    this.data.item.currentTaskIndex++;
    wx.setStorageSync('item', JSON.stringify(this.data.item));
    wx.redirectTo({
      url: `../questionAnswer/questionAnswer?key=item`,
    })
  },
  /**
   * 立即打卡
   */
  checkIn:function(event) {
    let params = {
       "topicRef":this.data.item.tasks[this.data.item.currentTaskIndex].topicRef,
       "itemRef":this.data.item.id
    };
    API.checkIn(params).then((res) => {
      // 更新上一页页面状态
      this.data.prevPage.updateTaskStatus && this.data.prevPage.updateTaskStatus();
      app.player.stop();
      app.globalData.item && (app.globalData.item.btnStatus = 'reviewCheckIn');
      wx.redirectTo({
        url: `../share/share?from=finishCheckin&courseId=${this.data.item.courseId}&itemId=${this.data.item.id}`,
      })
    },err => {
      let errMsg = '';
      if (err.errorCode == '-157') {
        errMsg = '抱歉，该课程已经下架'
      } else if (err.errorCode == '-151') {
        errMsg = '抱歉，该打卡项目不存在'
      }
      if (err.errorCode == '-157' || err.errorCode == '-151'){
        wx.showModal({
          title: '提示',
          content: errMsg,
          showCancel: false,
          success: function (res) {
            this.data.prevPage.updateTaskStatus && this.data.prevPage.updateTaskStatus();
            wx.navigateBack();
          }
        })
      }
    });
  },
  /**
   * 开始作业
   */
  startWorking:function(event) {
    app.player.stop();
    Analytics.nextChapterOrStartWork({
      itemId: '开始作业',
      courseId: this.data.item.courseId,
      taskId: this.data.item.tasks[this.data.item.currentTaskIndex].id
    })
    this.data.item.currentTaskIndex++;
    wx.setStorageSync('item', JSON.stringify(this.data.item));
    wx.redirectTo({
      url: `../question/question?key=item`,
    })
  },
  /**
   * 进入举报页
   */
  report:function(event){
    wx.navigateTo({
      url: `../report/report?courseId=${this.data.item.courseId}&taskId=${this.data.item.tasks[this.data.item.currentTaskIndex].id}`,
    })
  },

  finishLearning:function(){
    app.player.stop();
    wx.redirectTo({
      url: `../share/share?from=finishCheckin&courseId=${this.data.item.courseId}&itemId=${this.data.item.id}`,
    })
  },

  playerLoad(){
    this.loader.show(this);
  },
  /**
   * 视频组件加载完成
   */
  playerReady(){
    this.loader.hide(this);
  },
 
})