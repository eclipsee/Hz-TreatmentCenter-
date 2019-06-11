import API from '../../../requests/api/api.js';
import busiUtil from '../../../utils/busiUtil.js';
import {
  xmlog
} from '../../../utils/xmlog.js';
import Util from "../../../utils/util.js";
import Constant from '../../../constants/constants.js';
import Player from '../../../pages/commen/player/Player.js';
const app = getApp();

Page({
  type: "lessonDetails",
  /**
   * 页面的初始数据
   */
  data: {
    wxNick: '',
    telephone: '',
    courseId: '',
    courseInfo: {},
    calendarItems: [],
    checkedItem: {},
    contactFlag: false,
    prevPage: {},
    activityName: "",
    activityId: 0,
    isAccomplished: false,
    isOver: false,
    hasActivity: false,
    startTime: "",
    endTime: "",
    checkedTime:"",
    isCourseOver: false,
    courseType:"calendar",
    currentItemId:0,
    checked:1000,
    navHeight:0,
    notask:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options) {
      this.player = new Player(this);
      // console.log("opotions", options.toUrl)
      this.setData({
        courseId: options.courseId || 1,
      })
      if(options.checked){
        this.setData({
          checked: options.checked
        })
      }
      this.getCourseDetail();
      let pages = getCurrentPages();
      this.data.prevPage = pages[pages.length - 2];
      wx.reportAnalytics('show_lesson_details', {
        lessonid: this.data.courseId,
        srcpage: '课程详情页',
      });
      if(options.clear){
        wx.setStorageSync("checkedDate","")
      }
      //服务号推送消息进入小程序页面处理
      if (options.toUrl == 'checkinResult') {
        console.log("activityId", options.activityId)
        wx.navigateTo({
          url: "../../checkinResult/checkinResult?courseId=" + this.data.courseId + "&activityId=" + options.activityId
        })
      } else if (options.toUrl == 'activityDetail') {
        wx.navigateTo({
          url: "../../activityDetail/activityDetail?courseId=" + this.data.courseId
        })
      } else if (options.toUrl == 'moreSelect') {
        wx.navigateTo({
          url: "../../moreSelect/moreSelect?courseId=" + this.data.courseId + "&taskRef=" + options.taskRef + "&sequence=" + options.sequence + "&source=" + options.source
        })
      } else if (options.toUrl == 'questionAnswer') {
        let url = "../../questionAnswer/questionAnswer?courseId=" + this.data.courseId + "&itemId=" + options.itemId;

        if (options.questionIndex) {
            url += "&questionIndex=" + options.questionIndex;
        }
        wx.navigateTo({
          url: url
        })
      }
    }
    this.setData({
      navHeight: app.globalData.navHeight
    })
    
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
   
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log("123456", this.data.checkedTime)
    this.onLoad();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.toLessons = null;
    // this.toggleTask = null;
    this.checkedTask = null;
    this.getCourseDetail = null;
    this.toLessons = null;
    this.toTodayTask = null;
    this.toggleTask = null;
    this.switchContact = null;
    this.hideContact = null;
    this.toSetting = null;
    this.backTo = null;
    this.toActivityDetail = null;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // onPullDownRefresh: function() {
  //   this.getCourseDetail();
  //   wx.stopPullDownRefresh();
  // },
  /**
   * 获取课程详情
   */
  getCourseDetail: function(tipFlag = true) {
    API.getCourseDetail({
      courseId: this.data.courseId
    }).then(res => {
      if (res.statusCode) {
        this.setData({
          courseInfo: res.data,
          calendarItems: res.data.items,
          // startTime: "2018/12/04",
          startTime: res.data.startDate && res.data.startDate.replace(/-/g, '/') || "",
          endTime: res.data.endDate && res.data.endDate.replace(/-/g, '/') || "",
          // endTime: "2018/12/05",
          isCourseOver: res.data.isOver,
          // isCourseOver:true,
          courseType: res.data.courseType || 'calendar',
          currentItemId: res.data.currentItemId || 0
        })
        if (this.data.courseType == 'stage') {

          console.log("this.data.courseType")
          this.initBreak()
        }
        if (res.data.activityInfoDto != null) {
          this.setData({
            activityName: res.data.activityInfoDto.activityName,
            // activityName: "动打卡活动打卡活动卡活动打卡活动打卡活动打卡活动打卡活动动打卡活动",
            isAccomplished: res.data.activityInfoDto.isAccomplished,
            isOver: res.data.activityInfoDto.isOver,
            activityId: res.data.activityInfoDto.id,
            hasActivity: true
          })
        } else {
          this.setData({
            hasActivity: false
          })
        }
        if (res.data.status == 'inactive' && tipFlag) {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: Constant.COURSE_OFF_MODAL,
            confirmText: "返回首页",
            success: function(res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '/pages/todayTask/todayTask'
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      } else {

      }
    }).catch(res => {
      console.log(res);
    });
  },
  /**
   * 跳转至报名页面
   */
  toLessons: function(e) {
    var id = e.currentTarget.id;
    wx.reportAnalytics('click_lesson_introduce_ld', {
      srcpage: '课程详情页',
      srcmodule: '课程标题',
      item: '课程介绍',
      lessonid: e.currentTarget.id,
    });
    wx.navigateTo({
      url: `/pages/signIn/signIn?type=1&courseId=${id}`
    })
  },
  
  toTodayTask: function() {
    wx.reLaunch({
      url: '/pages/todayTask/todayTask'
    })
  },
  //选择日期
  toggleTask: function(e) {
    wx.reportAnalytics('click_date_ld', {
      itemid: e.detail.item.id,
      lessonid: this.data.courseId,
      srcpage: '课程详情页',
      srcmodule: '日历日期',
      item: 'date',
    });
    this.getSinglelesson(this.data.courseId, e.detail.item.id)
   
  },
  getSinglelesson(courseId,itemId){
    if (itemId !== undefined){
      API.singleLesson({
        courseId: courseId,
        itemId: itemId
      }).then(res => {
        if (res.statusCode) {
          this.setData({
            checkedItem: res.data
          })
          if (!this.data.checkedItem.tasks) {
            this.setData({
              notask: true
            })
          } else {
            this.setData({
              notask: false
            })
          }
        }
      }).catch(res => {
        console.log(res);
      });
    }else{
      this.setData({
        checkedItem: [],
        notask: true
      })
    } 
  },
  initBreak:function(){
    console.log("checked", this.data.checked)
    if (this.data.checked != 1000){
      var check = Number(this.data.checked)
      this.setData({
        checkedItem: this.data.calendarItems[check]
      })
      if (this.data.checkedItem.tasks.length == 0) {
        this.setData({
          notask: true
        })
      }else {
        this.setData({
          notask: false
        })
      }

      console.log("初始化关卡", this.data.checkedItem.tasks, this.data.notask)
    }else{
      var calendarItems = this.data.calendarItems;
      for (var i = 0; i < calendarItems.length; i++) {
        if (calendarItems[i].id == this.data.currentItemId) {
          this.setData({
            checkedItem: calendarItems[i]
          })
        }
      }
      if (this.data.checkedItem.tasks.length == 0) {
        this.setData({
          notask: true
        })
      }else{
        this.setData({
          notask: false
        })
      }


      console.log("初始化关卡2222", this.data.checkedItem.tasks, this.data.notask)
    }
   
  },
  toggleBreakTask: function (e) {

    this.getSinglelesson(this.data.courseId, e.detail.item.id)

    // this.setData({
    //   checkedItem: e.detail.item
    // })
    // if (this.data.checkedItem.tasks.length == 0) {
    //   this.setData({
    //     notask: true
    //   })
    // } else {
    //   this.setData({
    //     notask: false
    //   })
    // }

  },
  //点击任务或作业
  checkedTask: function(e) {
    var e = e.currentTarget.dataset;
    var item = {},
      taskId = e.taskid,
      currentTaskIndex = e.index,
      taskType = e.tasktype,
      taskStatus = e.taskstatus;
    item = this.data.checkedItem;
    item["currentTaskIndex"] = currentTaskIndex;
    item["coverUrl"] = this.data.courseInfo.coverUrl;
    item["taskId"] = taskId;
    item["courseId"] = this.data.courseInfo.id;
    wx.setStorageSync('item', JSON.stringify(item));
    // console.log("itemitemitem", item.id, this.data.calendarItems)
    if (taskStatus == 'not_startted') {
      if (this.data.courseType == 'stage'){
        var calendarItems = this.data.calendarItems;
        for (var i = 0; i < calendarItems.length; i ++){
          if (calendarItems[i].id == item.id){
            if(i>0){
              if (calendarItems[i - 1].doneCheckin == false){
                Util.showToast(Constant.BREAK_LOCKED_TIP);
              }else{
                Util.showToast(Constant.BREAK_LOCKED_TIP_NO);
              }
            }
          }
        }
      }else{
        let d1 = new Date(item.topicItemDate.replace(/\-/g, "\/"));
        let d2 = new Date();
        if (d1 > d2) {
          Util.showToast(Constant.QUIZ_LOCKED_TIP);
        } else {
          Util.showToast(Constant.LESSON_LOCKED_TIP);
        }
      }
      return false;
    }
    // return false;
    wx.reportAnalytics('click_taskwork_ld', {
      srcpage: '课程详情页',
      srcmodule: '任务列表',
      item: taskType == 'course' ? 'task' : 'work',
      itemid: e.taskid,
      lessonid: this.data.courseId,
    });
    if (app.globalData.item && app.globalData.item.tasks[app.globalData.item.currentTaskIndex].id !== item.taskId) {
      app.player.stop();
    }
    if (taskType !== 'quiz') {
      app.globalData.item = item;
      console.log("item1111",item)
      wx.setStorageSync("checkedDate", item.date)
      wx.navigateTo({
        url: '/pages/learning/learning?key=item&courseType=' + this.data.courseType,
      })
    } else {
      // 作业已完成
      if (taskStatus == 'done') {
        wx.navigateTo({
          url: `../../questionAnswer/questionAnswer?key=item&fromPage=lessonDetails`,
        })
      } else {
        wx.navigateTo({
          url: `../../question/question?key=item&fromPage=lessonDetails`
        })
      }
    }
  },
  //客服弹窗隐藏显示
  switchContact: function() {
    this.setData({
      contactFlag: this.data.contactFlag == true ? false : true
    })
    if (this.data.contactFlag) {
      wx.reportAnalytics('click_join_group_ld', {
        srcpage: '课程详情页',
        srcmodule: 'topTool',
        itemid: '我要加群',
        lessonid: this.data.courseId,
      });
    }
  },
  hideContact() {
    this.setData({
      contactFlag: false
    })
  },
  toSetting: function() {
    wx.navigateTo({
      url: "../../lessonSetting/lessonSetting?courseId=" + this.data.courseId
    })
    wx.reportAnalytics('click_setting', {
      srcpage: '马上打卡课程详情页',
      srcmodule: 'topTool',
      item: 'button',
      itemid: '设置',
      lessonid: this.data.courseId,
    });
  },
  // 返回到原来页面
  backTo: function() {
    wx.navigateBack()
  },

  toActivityDetail: function() {
    // this.data.isOver = true
    // this.data.isAccomplished = true
    if (this.data.isOver == true) {
      if (this.data.isAccomplished == true) {
        wx.navigateTo({
          url: "../../checkinResult/checkinResult?courseId=" + this.data.courseId + "&activityId=" + this.data.activityId
        })
      } else {
        wx.navigateTo({
          url: "../../activityDetail/activityDetail?courseId=" + this.data.courseId
        })
      }
    } else {
      wx.navigateTo({
        url: "../../activityDetail/activityDetail?courseId=" + this.data.courseId
      })
    }
  },
  /**
   * 更新任务状态,其他页面调用
   */
  updateTaskStatus: function() {
    this.getCourseDetail(false);
  }
});