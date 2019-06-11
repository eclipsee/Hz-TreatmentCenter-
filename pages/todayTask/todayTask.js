import Util from "../../utils/util.js";
import API from "../../requests/api/api.js";
import Analytics from "../../requests/analytics.js";
import Constant from '../../constants/constants.js';
import Player from "../commen/player/Player.js";

//index.js
//获取应用实例
const app = getApp()
const logger = app.logger

Page({
  data: {
    currDate: Util.formatDate(new Date()),
    todayCourseAndTask: {
      products:[]
    },
    courseIdArr:[],
    Authorization:'',
    recommendCourses:[],
    navHeight:0,
    showFlag:0
  },
  type:"todayTask",
  /**
   * 生命周期函数-监听页面加载
   */
  onLoad: function(options) {
    // logger.info('test logger');
    this.player = new Player(this);
    this.data.Authorization = wx.getStorageSync('Authorization');
    this.setData({
      navHeight: app.globalData.navHeight
    })
  },
  /**
   * 生命周期函数-监听页面显示
   */
  onShow:function(){
    this.getTodayCourseAndTask();
    Analytics.showTodayTask({
      courseId: this.data.courseIdArr.join(',')
    })
    if (this.data.Authorization == '' && wx.getStorageSync('Authorization') != ''){
      this.data.Authorization = wx.getStorageSync('Authorization');
      this.getTodayCourseAndTask();
    }
  },

  /**
   * 生命周期函数-监听页面下拉
   */
  onPullDownRefresh:function(){
    this.getTodayCourseAndTask();
    wx.stopPullDownRefresh();
  },
  getTodayCourseAndTask: function(loadFlag) {
    if (wx.getStorageSync('Authorization') == ''){
      Util.showToast(Constant.PLEASE_LOGIN_TIP);
    } else {
      API.getMyTodayTask({
        pageNum: 1
      },loadFlag).then((res) => {
        if(res){
          this.setData({
            todayCourseAndTask: res.data,
            recommendCourses: res.data.recommendCourses || []
            // recommendCourses: []
          })
          if (this.data.todayCourseAndTask.products.length > 0) {
            for (let i = 0; i < this.data.todayCourseAndTask.products.length; i++) {
              this.data.courseIdArr.push(this.data.todayCourseAndTask.products[i].id);
            }
          
          }else{
            this.setData({
              showFlag: 1
            })
          }

        }
      },err=>{callback && callback()});
    }
  },
  
  

  /**
   * 跳转到学习页面或答题页
   */
  navigateToLearningOrQuestion: function(currentProductIndex, currentTaskIndex,courseId) {
    let item = this.data.todayCourseAndTask.products[currentProductIndex].items[0];
    // 组装任务详情对像，作为跳转到学习页面的参数
    item["currentTaskIndex"] = currentTaskIndex;
    item["currentProductIndex"] = currentProductIndex;
    item["coverUrl"] = this.data.todayCourseAndTask.products[currentProductIndex].coverUrl;
    item["courseId"] = this.data.todayCourseAndTask.products[currentProductIndex].id;
    Analytics.todoTask({
      item:item.tasks[currentTaskIndex].taskType == 'quiz'?'work':'course',
      courseId:item.courseId,
      taskId:item.tasks[currentTaskIndex].id
    })
    // 缓存本地，将key值作为参数传递到将要跳转的页面
    wx.setStorageSync('item', JSON.stringify(item));
    // 判断任务状态
    if (item.tasks[currentTaskIndex].taskStatus === 'not_startted') {
      Util.showToast(Constant.LESSON_LOCKED_TIP);
    } else {
      if (app.globalData.item && app.globalData.item.tasks[app.globalData.item.currentTaskIndex].id !== item.tasks[currentTaskIndex].id) {
        app.player.stop();
      }
      // 确定课程是否下架
        if (item.tasks[currentTaskIndex].taskType !== 'quiz') {
          app.globalData.item = item;
          wx.navigateTo({
            url: `../learning/learning?key=item&fromPage=todayTask`
          })
        } else {
          // 作业已完成
          if (item.tasks[currentTaskIndex].taskStatus == 'done') {
            wx.navigateTo({
              url: `../questionAnswer/questionAnswer?key=item&fromPage=todayTask`,
            })
          } else {
            wx.navigateTo({
              url: `../question/question?key=item&fromPage=todayTask`
            })
          }
        }
    }
  },
  /**
   * 更新页面任务及打卡状态
   */
  // updateTaskStatus: function() {
  //   this.getTodayCourseAndTask(false);
  // },
  toSignIn:function(event){
    wx.navigateTo({
      url: `../signIn/signIn?courseId=${event.currentTarget.dataset.courseid}`
    })
  },
  toLessonlist:function(){
    wx.navigateTo({
      url: `../personalCenter/lessons/lessonsList`
    })
  },
  /**
   * 点击title，进入课程详情页
   */
  toCourseDetail: function(event) {
    Analytics.lookCourseDetail({
      courseId: event.currentTarget.dataset.courseid
    })
    wx.navigateTo({
      url: `../learning/lessonDetails/lessonDetails?courseId=${event.currentTarget.dataset.courseid}&clear=true`
    })
  },
  /**
   * 点击任务，进入学习或作业页面
   */
  toLearning: function(event) {
    let currentProductIndex = event.currentTarget.dataset.productindex;
    let currentTaskIndex = event.currentTarget.dataset.taskindex;
    let courseId = event.currentTarget.dataset.courseid;
    this.navigateToLearningOrQuestion(currentProductIndex, currentTaskIndex,courseId);
  }
})