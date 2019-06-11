// pages/moreSelect.js
import API from '../../requests/api/api.js';
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    courseId:"",
    taskRef:"",
    sequence:"",
    products:[],
    isVideoShow:{},
    isShow1:[],
    isShow2:[],
    showAllFlag:[],
    showAllCommentFlag:[],
    style1:[],
    style2:[],
    isFull:false,
    isPlay:'1',
    source:'',
    navHeight:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.data.courseId = options.courseId;
    this.data.taskRef = options.taskRef;
    this.data.sequence = options.sequence
    // this.getPage(courseId, taskRef, sequence)
    var that = this;
    if (options && options.source){
      this.setData({
        source: options.source
      })
    } 
    this.setData({
      navHeight: app.globalData.navHeight
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
    var that = this;
    this.getPage();
    this.videoContext = wx.createVideoContext('prew_video');
    that.query = wx.createSelectorQuery();
    API.courseOffConfirm({ courseId: this.data.courseId }).then(res => {
      wx.showModal({
        title: '提示',
        content: Constant.COURSE_OFF_MODAL,
        showCancel: false,
        success: res => {
          _this.data.prevPage.updateTaskStatus && this.data.prevPage.updateTaskStatus();
          if (_this.data.fromPage == 'todayTask') {
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
   * 预览视频  
   */
  previewVideoFn: function (event) {
    console.log("1111", this.data.showAllFlag)
    console.log("222", event.currentTarget.dataset.index)

    var videoContext = this.videoContext;
    var index = event.currentTarget.dataset.index;
    var showAllFlag = this.data.showAllFlag
    var style1 = this.data.style1;
    style1.splice(index, 1, "");
    showAllFlag.splice(index, 1, true);
    this.setData({
      style1: style1,
      showAllFlag: showAllFlag
    })
    videoContext.seek(0);
    videoContext.play();
    videoContext.requestFullScreen();
    var isVideoShow = this.data.isVideoShow;
    isVideoShow[index]='1'
    this.setData({
      isVideoShow: isVideoShow,
      isPlay:'0'
    })
  },
  bindVideoScreenChange: function (event) {
    if (event.detail.fullScreen == false) {
      // this.data.videoContext.pause();
      console.log("变小")
      this.videoContext.seek(0);
      this.setData({
        isVideoShow: {},
        isFull: false,
        isPlay: '1'
      })
    }else{
      this.setData({
        isFull: true,
      })
    }
  },
  bindpause:function(){
    if(this.data.isFull == false){
      this.setData({
        isVideoShow: {},
      })
    }
  },
  /**
  * 图片预览
  */
  previewImg: function (event) {
    var src = event.currentTarget.dataset.src;//获取data-src
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src]
    })
  },
  getPage(courseId, taskRef, sequence){
    var that = this;
    var _data ={
      courseId: this.data.courseId,
      taskRef: this.data.taskRef,
      sequence: this.data.sequence
    }
    API.selectAnswer(_data, true).then(res => {
      if (res.statusCode == 200) {
        this.setData({
          products: res.data.products
        })
        if(this.data.products.length == 0){
          if (this.data.source == 'notification'){
            wx.showToast({
              title: "老师正在重新编辑精选答案",
              icon: "none",
              duration: 2000
            });
          }
        }
        // this.setData({
        //   products: [
        //     {
        //       answer:[{}]
        //     }
        //   ]showAllCommentFlag
        // })
        for (let i = 0; i < res.data.products.length;i++){
          console.log("22223333")
          var showAllFlag = that.data.showAllFlag;
          showAllFlag.push(false)
          var showAllCommentFlag = that.data.showAllCommentFlag;
          showAllCommentFlag.push(false)
          this.setData({
            showAllFlag: showAllFlag,
            showAllCommentFlag: showAllCommentFlag
          })
          //选择id isShow2
          that.query.select('.analysis-answer'+i).boundingClientRect(function (rect) {
            console.log("1111", rect)
            if (rect) {
              if (rect.height > 230) {
                var isShow1 =  that.data.isShow1
                isShow1.push("true")
                var style1 = that.data.style1
                style1.push("height:230px;overflow:hidden")
                that.setData({
                  style1: style1,
                  isShow1: isShow1
                })
                console.log("22222", that.data.isShow1[i])
              }else{
                var isShow1 = that.data.isShow1
                isShow1.push("false")
                var style1 = that.data.style1
                style1.push("")
                that.setData({
                  style1: style1,
                  isShow1: isShow1
                })
              }
            }
          }).exec();

          //选择id isShow2
          console.log('.spreadContent' + i)
          that.query.select('.spreadContent' + i).boundingClientRect(function (rect) {
            if (rect) {
              if (rect.height > 173) {
                console.log("22222")
                var isShow2 = that.data.isShow2
                isShow2.push("true")
                var style2 = that.data.style2
                style2.push("height:173px;overflow:hidden")
                that.setData({
                  style2: style2,
                  isShow2: isShow2
                })
              } else {
                var isShow2 = that.data.isShow2
                isShow2.push("false")
                var style2 = that.data.style2
                style2.push("")
                that.setData({
                  style2: style2,
                  isShow2: isShow2
                })
              }
            }
          }).exec();
        }
      }else if(statusCode ==400){
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: Constant.COURSE_OFF_MODAL,
          confirmText: "返回首页",
          success: function (res) {
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
    }).catch(res => {
     
    });
  },
  /**
   * 展示或收起全部
   */
  showAll: function (event) {
    var that = this;
    var index = event.currentTarget.dataset.index;
    var showAllFlag = this.data.showAllFlag;
    var style1 = this.data.style1;
    if (showAllFlag[index] == true) {
      showAllFlag.splice(index, 1, false);
      style1.splice(index, 1, "height:230px;overflow:hidden");
      that.setData({
        style1: style1,
        showAllFlag: showAllFlag,
      isVideoShow: {},
      })
    } else {
      showAllFlag.splice(index, 1, true);
      style1.splice(index, 1, "");
      that.setData({
        style1: style1,
        showAllFlag: showAllFlag
      })
    }
  },
  showAllComment: function (event) {
    var that = this;
    var index = event.currentTarget.dataset.index;
    var showAllCommentFlag = this.data.showAllCommentFlag;
    var style2 = this.data.style2;
    if (showAllCommentFlag[index] == true) {
      showAllCommentFlag.splice(index, 1, false);
      style2.splice(index, 1, "height:173px;overflow:hidden");
      that.setData({
        style2: style2,
        showAllCommentFlag: showAllCommentFlag,
        isVideoShow: {},
      })
    } else {
      showAllCommentFlag.splice(index, 1, true);
      style2.splice(index, 1, "");
      that.setData({
        style2: style2,
        showAllCommentFlag: showAllCommentFlag
      })
    }
  },
/**
   * 视频暂停
   */
  // onPause:function(){
  //     console.log("222222")
  // },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.reportAnalytics('show_moreselect', {
      item: '马上打卡精选答案页',
      lessonid: this.data.courseId,
    });
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },


  

})