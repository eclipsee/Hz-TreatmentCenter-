import API from '../../requests/api/api.js';
import Util from '../../utils/util.js';
import Analytics from '../../requests/analytics.js';
import Constant from '../../constants/constants.js';
var app = getApp();
const logger = app.logger;

// pages/question/question.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    questions:[],
    item:{},
    questionsAnswer:[],
    currentQuestion: 0,
    btnStatus:'nextTitle',
    btnTxt: {
      'nextChapter': '下一章',
      'startWorking': '去完成作业',
      'checkIn': '立即打卡',
      'startLearning': '开始学习',
      'finishLearning': '完成学习',
      'finished': '完成',
      'reviewCheckIn': '查看今日打卡',
      'nextTitle': '下一题',
      'submitAndReview': '提交并查看作业解析',
      'return': '返回',
      'analysisPage': '查看作业解析'
    },
    fromPage:'',
    prevPage:{},
    btnDisable:false,
    isSpread:false,
    isShow:false,
    style:'',
    imgArr:[],
    videoImgArr:[],
    videoArr:[],
    recordArr:[],
    txtContent:"",
    recordShow:false,
    recordStatus:"0",
    recordMinute:"00",
    recordSecond:"00",
    recordDuration:0,
    timeFlag:"0",
    t1:{},
    isVideoShow:'0',
    style1:'',
    isIphoneX:false,
    focus:false,
    isused:true,
    btnCount:0,
    isText:true,
    isVideoTop:-1,
    isPlay:"false",
    playVideoSrc:"",
    isRecording:false,
    isFull:false,
    startX: '',
    movedis: 0,
    navHeight:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.recorderManager = wx.getRecorderManager();
    this.videoContext = wx.createVideoContext('myVideo', this)
    this.data.fromPage = options.fromPage;
    this.setData({
      isIphoneX: app.globalData.isIphoneX,
      navHeight: app.globalData.navHeight
    })
    this.getItemFromPrevPage(options.key, questions =>{ 
    // 如果本地有缓存答题进度，则取缓存进度
      let tempData = wx.getStorageSync(`taskId${this.data.item.tasks[this.data.item.currentTaskIndex].id}`);
      if (tempData){
        if (JSON.stringify(questions) == JSON.stringify(JSON.parse(tempData).questions)) {
          this.setData({
            questions: JSON.parse(tempData).questions,
            currentQuestion: JSON.parse(tempData).currentQuestion,
            questionsAnswer: JSON.parse(tempData).questionsAnswer
          })
          // console.log(this.data.currentQuestion)
          // console.log(this.data.questions)
        } else {
          wx.removeStorageSync(`taskId${this.data.item.tasks[this.data.item.currentTaskIndex].id}`);
          this.setData({
            questionsAnswer: []
          })
          this.initQuestionAnswers(questions);
        }
      } else {
        this.setData({
          questionsAnswer: []
        })
        this.initQuestionAnswers(questions);
      }
      this.initBtn(true);
      
      if (this.data.currentQuestion == this.data.questions.length - 1) {
        this.setData({
          btnStatus:'submitAndReview'
        })
      }

    });
    
    let pages = getCurrentPages();
    this.data.prevPage = pages[pages.length - 2];

    API.courseOffConfirm({ courseId: this.data.item.courseId }).then(res => {
      wx.showModal({
        title: '提示',
        content: Constant.COURSE_OFF_MODAL,
        showCancel: false,
        success: res => {
          this.data.prevPage.updateTaskStatus && this.data.prevPage.updateTaskStatus();
          wx.navigateBack();
        }
      })
    });
  },
  /**
   * 生命周期函数-监听页面卸载
   */
  onReady:function(){
    var that = this;
    this.videoContext = wx.createVideoContext('prew_video');
    this.query = wx.createSelectorQuery();
    //选择id
    var classname = ".question-instruction" + this.data.currentQuestion;
    that.query.select(classname).boundingClientRect(function (rect) {
      if (rect) {
        if (rect.height > 180) {
          that.setData({
            style: "height:180px;overflow:hidden",
            isShow: true
          })
        }
      }
    }).exec();
    //选择id
    var classname = ".question-subjective" + this.data.currentQuestion;
    that.query.select(classname).boundingClientRect(function (rect) {
      if (rect) {
        console.log("高度", rect.height)
        if (rect.height > 180) {
          that.setData({
            style: "height:180px;overflow:hidden",
            isShow: true
          })
        }
      }
    }).exec();
  },
  onUnload:function(){
    this.chooseAnswer = null;
    this.runNext = null;
    this.toNextTitle = null;
    this.toQuestionAnswer = null;
    this.getItemFromPrevPage = null;
    this.spreadFn = null;
    this.initQuestionAnswers = null;
    this.uploadFile = null;
    this.addPicture = null;
    this.addVideo = null;
    this.deleteImg = null;
    this.deleteVideo = null;
    this.deleteRecord = null;
    this.showRecordBox = null;
    this.recordStart = null;
    this.recordFn = null;
    this.recordStop = null;
    this.recordTime = null;
    this.closeRecordBox = null;
    this.previewVideoFn = null;
    this.bindTextAreaBlur = null;
    this.initBtn = null;
    this.runNext = null;
    this.pageIsshow = null;
    this.toNextTitle = null;
    this.toQuestionAnswer = null;
    this.combineQuestion = null;
    this.previewImg = null;

    // 退出时，记住当前进度并缓存到本地
    let key = `taskId${this.data.item.tasks[this.data.item.currentTaskIndex].id}`;
    let questionStorage = {
      currentQuestion:this.data.currentQuestion,
      questions: this.data.item.tasks[this.data.item.currentTaskIndex].taskContent.questions,
      questionsAnswer:this.data.questionsAnswer
    }
    wx.setStorageSync(key, JSON.stringify(questionStorage));
  },
  /**
   * 生命周期函数-监听页面显示
   */
  onShow:function(){
    Analytics.showQuestionPage({
      courseId:this.data.item.courseId,
      taskId: this.data.item.tasks[this.data.item.currentTaskIndex].id
    })
    console.log("btnCount", this.data.btnCount)
  },
  /**
   * 获取上一页面缓存的item信息
   */
  getItemFromPrevPage(key,callback){
    this.data.item = JSON.parse(wx.getStorageSync(key));
    try {
      this.data.questions = this.data.item.tasks[this.data.item.currentTaskIndex].taskContent.questions;

    //   this.data.questions = [{
    //     "sequence": 1,
    //     "questionType": "subjective",
    //     "title": "这是一道主观题",
    //     "questionContent": {
    //       "text": "题目内容",
    //       "medias": [
    //         {
    //           "mediaURI": "http: //fdfs.test.ximalaya.com/group1/M01/4E/AB/wKgDplvs5LmANgwbAAgdcFZtTDk748.mp3",
    //           "mediaName": "7月3日16点47分.mp3",
    //           "mediaType": "audio",
    //           "duration": 34
    //         },
    //         {
    //           "mediaURI": "http://fdfs.test.ximalaya.com/group1/M00/F7/C6/wKgD3lvzgPSAWuoUAA7t86JXsNk394.mp4",
    //           "mediaName": "7月3日16点47分.mp4",
    //           "mediaType": "video",
    //           "duration": 34
    //         }
    //       ]
    //     },
    //     "questionAnalysis": {
    //       "text": "老师评论内容",
    //       "medias": [
    //         {
    //           "mediaURI": "http: //fdfs.test.ximalaya.com/group1/M01/4E/AB/wKgDplvs5LmANgwbAAgdcFZtTDk748.mp3",
    //           "mediaName": "7月3日16点47分.mp3",
    //           "mediaType": "audio",
    //           "duration": 34
    //         },
    //         {
    //           "mediaURI": "http: //fdfs.test.ximalaya.com/group1/M01/4E/AB/wKgDplvs5LmANgwbAAgdcFZtTDk748.mp3",
    //           "mediaName": "7月3日16点47分.mp4",
    //           "mediaType": "video",
    //           "duration": 34
    //         }
    //       ]
    //     }
    //   }
    //  ]
      if(this.data.questions.length == 1){
        this.setData({
          btnStatus:'submitAndReview'
        })
      }
      this.setData({
        item: this.data.item,
        questions: this.data.questions
      });
      callback && callback(this.data.questions);
    } catch (e) {
      let message = {
        'msg': 'getItemFromPrevPage failed',
        'item': this.data.item,
        'e': e.stack
      }
      logger.error(message);
    }
  },
  // 展开题目
  spreadFn:function(){
    if (this.data.isSpread == false){
      this.setData({
        isSpread: !this.data.isSpread,
        style: "",
      })
    }else{
      this.setData({
        isSpread: !this.data.isSpread,
        style: "height: 180px; overflow: hidden",
        isVideoShow: "0",
        isVideoTop: -1
      })
    }
  },
  
  /**
   * 初始化答案集合
   */
  initQuestionAnswers:function(questions){
    for (let i = 0; i < questions.length; i++) {
      let answersArr = [];
      if (questions[i].questionType == "subjective"){
        answersArr.push('');
      }else{
        for (let j = 0; j < questions[i].options.length; j++) {
          answersArr.push('unchoosed');
        }
      }
      this.data.questionsAnswer.push(answersArr);
      // console.log("初始化组合", this.data.questionsAnswer)
    }
  },
  move:function(e)
  {
    console.log("111",e)
  },
  // touchS: function (e) {
  //   if (e.touches.length == 1) {
  //     this.setData({        //设置触摸起始点水平方向位置        
  //       startX: e.touches[0].clientX
  //     });
  //   }
  //   console.log("开始")
  // },
  // touchM: function (e) {
  //   var that = this
  //   if (e.touches.length == 1) {
  //     var moveX = e.touches[0].clientX;
  //     //计算手指起始点的X坐标与当前触摸点的X坐标的差值
  //     var disX = that.data.startX - moveX;
  //     this.setData({
  //       movedis: -disX + 'rpx'
  //     });
  //   }
  //   console.log("移动", moveX)
  // },

  /**
   * 选项点击
   */
  chooseAnswer:function(event){
    let optionIndex = event.currentTarget.dataset.index;
    if (this.data.questions[this.data.currentQuestion].questionType === 'singleSelection'){
      // 单选题模式，重置选项
      for (let i = 0; i < this.data.questionsAnswer[this.data.currentQuestion].length;i++){
        if(i!=optionIndex){
          this.data.questionsAnswer[this.data.currentQuestion][i] = 'unchoosed';
        }
      }
    } 
    this.data.questionsAnswer[this.data.currentQuestion][optionIndex] = this.data.questionsAnswer[this.data.currentQuestion][optionIndex] === 'unchoosed' ? 'choosed' : 'unchoosed';
    this.setData({
      questionsAnswer:this.data.questionsAnswer
    })
    this.initBtn();
  },
  /**
   * 视频全屏事件
   */
  bindfullscreenchange: function (event) {
    // console.log("event",event)
    if(event.detail.fullScreen == true){
        this.setData({
          isText:false,
          isFull:true
        })
    } else if (event.detail.fullScreen == false){
      this.setData({
        isText: true,
        focus:false,
        isFull: false
      })
    }
  },
  bindfullscreenchange1: function (event) {
    // console.log("event", event)
    if (event.detail.fullScreen == true) {
      this.setData({
        isText: false,
        isFull: true
      })
    } else if (event.detail.fullScreen == false) {
      this.setData({
        isText: true,
        focus: false,
        isFull: false,
        isVideoShow: "0"
      })
    }
  },
  /**
   * 上传文件
   */
  uploadFile(path, fileType,msg){
    // console.log("上传了上传了",path)
    wx.showLoading({
      title: '文件上传中',
    })
    var that = this;
    // var localUid = app.globalData.Authorization.split("&")[0]
    // var localToken = app.globalData.Authorization.split("&")[1]
    var authorize = encodeURIComponent(app.globalData.Authorization)
    // console.log("authorize", authorize)
    //UPLOAD_PICTURE
    var pathUrl='';
    if (fileType == 'picture') {
      pathUrl = Constant.UPLOAD_PICTURE + "?_token=" + authorize + "&callerSource=ambassador";
    } else if (fileType == 'video') {
      pathUrl = Constant.UPLOAD_VIDEO + "?_token=" + authorize + "&callerSource=ambassador";
    } else if (fileType == 'audio') {
      pathUrl = Constant.UPLOAD_AUDIO + "?_token=" + authorize + "&callerSource=ambassador";
    }
    wx.uploadFile({
      url: pathUrl,
      filePath: path,
      name: 'myfile',
      success: function (res) {
        if (res.statusCode == '200') {
          var data = JSON.parse(res.data)
          if (fileType == 'picture'){
            var imgArr = that.data.imgArr;
            imgArr.push(data.data[0].url);
            that.setData({
              imgArr: imgArr
            });
          } else if (fileType == 'video') {
            var videoArr = that.data.videoArr;
            videoArr.push(data.data[0].url);
            that.setData({
              videoArr: videoArr
            });
          } else if (fileType == 'audio'){
            var recordArr = that.data.recordArr;
            // console.log("datadata",data)
            recordArr.push(
              {
                path: data.data[0].url,
                duration: that.data.recordDuration
              }
            )
            that.setData({
              recordStatus: '0',
              recordShow: false,
              recordArr: recordArr
            })
            
          }
          that.initBtn();
          wx.hideLoading()
        }else{
          wx.showToast({
            title: '上传失败，请重试',
            icon: "none"
          });
        }
        if (msg){
             wx.showToast({
               title: msg,
              icon: "none"
            });
        }
      },
      fail:function(res){
        wx.showToast({
          title: "上传出错，请重试",
          icon: "none"
        });
      }
    }) 
  },

 /**
   * 添加图片
   */
  addPicture(){
    var that = this;
    var imgArr = this.data.imgArr;
    if (imgArr.length >= 2) {
      wx.showToast({
        title: "最多上传两张图片",
        icon: "none"
      });
    }else{
      wx.chooseImage({
        // count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths;
          var imgArr = that.data.imgArr;
          if ((imgArr.length + tempFilePaths.length)  >2){
           var msg = "最多上传两张图片"
            for (var i = 0; i < (2 - imgArr.length); i++) {
              that.uploadFile(tempFilePaths[i],'picture', msg);
            }
          }else{
            for (var i = 0; i < tempFilePaths.length; i++) {
              that.uploadFile(tempFilePaths[i], 'picture');
            }
          }  
        }
      });
    }
    
    wx.reportAnalytics('click_question_media', {
      srcpage: '马上打卡作业页',
      srcmodule: 'bottomTool',
      item: 'button',
      itemid: '图片',
      lessonid: this.data.courseId,
      workid: this.data.item.tasks[this.data.item.currentTaskIndex].id,
    });
  },
/**
   * 添加视频
   */
  addVideo() {
    var that = this;
    var videoArr = this.data.videoArr;
    if (videoArr.length >= 1) {
      wx.showToast({
        title: "最多上传一个视频",
        icon: "none"
      });
    } else {
      wx.chooseVideo({
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        camera: 'back',
        maxDuration:60,
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePath = res.tempFilePath;
          // console.log("tempFilePaths", tempFilePath)
          that.uploadFile(tempFilePath,'video');
        },
        fail:function(res){
          console.log("resres",res)
        }
      });
    }
    wx.reportAnalytics('click_question_media', {
      srcpage: '马上打卡作业页',
      srcmodule: 'bottomTool',
      item: 'button',
      itemid: '视频',
      lessonid: this.data.courseId,
      workid: this.data.item.tasks[this.data.item.currentTaskIndex].id,
    });
  },

/**
   * 删除图片
   */
  deleteImg: function (e) {
    var imgs = this.data.imgArr;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    this.setData({
      imgArr: imgs
    });
    // this.data.questionsAnswer[this.data.currentQuestion].splice(index, 1);
    var tempArr = [];
    for (let j = 0; j < this.data.questionsAnswer[this.data.currentQuestion].length; j++) {
     
      if (this.data.questionsAnswer[this.data.currentQuestion][j].mediaType == 'image') {
        tempArr.push(this.data.questionsAnswer[this.data.currentQuestion][j])
        if (j == index) {
          this.data.questionsAnswer[this.data.currentQuestion].splice(j, 1);
        }
      }
    }
    for (let j = 0; j < tempArr.length; j++) {
      if (j == index) {
        this.data.questionsAnswer[this.data.currentQuestion].splice(j, 1);
      }
    }
  },

  /**
   * 删除视频
   */
  deleteVideo: function (e) {
    var videoArr = this.data.videoArr;
    var index = e.currentTarget.dataset.index;
    videoArr.splice(index, 1);
    this.setData({
      videoArr: videoArr
    });

    for (let j = 0; j < this.data.questionsAnswer[this.data.currentQuestion].length; j++) {
      if (this.data.questionsAnswer[this.data.currentQuestion][j].mediaType == 'video' ) {
        this.data.questionsAnswer[this.data.currentQuestion].splice(j, 1);
      }
    }
  },
  /**
   * 删除录音
   */
  deleteRecord: function (e) {
    var recordArr = this.data.recordArr;
    var index = e.currentTarget.dataset.index;
    recordArr.splice(index, 1);
    this.setData({
      recordArr: recordArr,
        recordSecond: '00',
        recordMinute: '00'
    });
    for (let j = 0; j < this.data.questionsAnswer[this.data.currentQuestion].length; j++) {
      // console.log("234343434", this.data.questionsAnswer[this.data.currentQuestion][j])
      if (this.data.questionsAnswer[this.data.currentQuestion][j].mediaType == 'audio') { 
          this.data.questionsAnswer[this.data.currentQuestion].splice(j, 1);
      }
    }
  },
  /**
   * 展示录音卡
   */
  showRecordBox:function(){
    if (this.videoContextTop){
      this.videoContextTop.pause()
    }
    if (this.videoContext){
      this.videoContext.pause()
    }
    var recordArr = this.data.recordArr;
    if(recordArr.length>=1){
      wx.showToast({
        title: "最多录制一条录音",
        icon: "none"
      });
    }else{
      // wx.showModal({
      //   title: '',
      //   showCancel:false,
      // })
      this.setData({
        recordShow: true,
        
      })
    }
    wx.reportAnalytics('click_question_media', {
      srcpage: '马上打卡作业页',
      srcmodule: 'bottomTool',
      item: 'button',
      itemid: '录音',
      lessonid: this.data.courseId,
      workid: this.data.item.tasks[this.data.item.currentTaskIndex].id,
    });
  },
   /**
   * 开始录音
   */
  recordStart:function(){
    // console.log("开始了开始了开始了")
    var that = this;
    wx.getSetting({
      // success(res) {
      //   if (res.authSetting['scope.record']) {
      //     that.recordFn();
      //   } else {
      //     wx.authorize({
      //       scope: 'scope.record',
      //       success() {
      //         that.recordFn();
      //       },
      //       fail(){
      //         wx.showToast({
      //           title: "暂无授权",
      //           icon: "none"
      //         });
      //       }
      //     })
      //   }
      // },
      success(res) {
        // 进行授权检测，未授权则进行弹层授权
        if (typeof res.authSetting["scope.record"] != "undefined") {
          // console.log("222")
          // res.authSetting["scope.record"] = false
          if (res.authSetting["scope.record"] == true) {
            that.recordFn();
          } else if (res.authSetting["scope.record"] == false) {
            wx.showModal({
              content:
                "检测到您没打开马上打卡小程序录音的权限，是否去设置打开？",
              confirmText: "确认",
              cancelText: "取消",
              success: function (res) {
                //点击“确认”时打开设置页面
                if (res.confirm) {
                  console.log("用户点击确认");
                  wx.openSetting({
                    success: res => { }
                  });
                } else {
                  console.log("用户点击取消");
                }
              }
            });
          }
        } else {
          wx.authorize({
            scope: "scope.record",
            success() {
              //这里是用户同意授权后的回调
              that.recordFn();
            },
            fail() {
              //这里是用户拒绝授权后的回调
            }
          });
        }
      },
      fail(res) {
        console.log(res);
      }

    })
  },
  recordFn: function () {
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
    this.data.isRecording = true;
    this.data.recordDuration = 0;
    this.recordTime();
    this.recorderManager.start({
      duration: 600000,//指定录音的时长，单位 ms
      format: 'mp3',//音频格式，有效值 aac/mp3
    });
    this.setData({
      recordStatus: '1',
      timeFlag: "1"
    })
  },
   /**
   * 结束录音
   */
  recordStop:function(){
    var that = this;
    // console.log("结束了结束了", that.recorderManager)
    // console.log("录音时长", that.data.recordDuration)
    wx.setKeepScreenOn({
      keepScreenOn: false
    })
    that.recorderManager.stop();
    that.recorderManager.onStop(function (res) {
      if (that.data.recordDuration <= 0) {
        wx.showToast({
          title: "录音时长为0",
          icon: 'none'
        })
      } else {
      that.uploadFile(res.tempFilePath, 'audio');
      }
      
    });

    that.recorderManager.onError(function (res) {
      // 停止录音之后，把录取到的音频放在res.tempFilePath
      console.log("录制失败",res)
    　　});
    that.setData({
      recordStatus: '0',
      recordShow: false,
      recordSecond: '00',
      recordMinute: '00',
      isRecording:false
    })
    clearInterval(that.data.t1);

  },
  recordTime:function(){
    var that = this;
    var flag = that.data.timeFlag;
    var a = 0;
    var b = 0;
    var x = 0;
    var y = 0;
    // t1 = setInterval(beginTime, 1000);
    var t1 = setInterval(() => {
      beginTime()
    }, 1000);
    that.data.t1 = t1;

    function beginTime(){
      that.data.recordDuration++;
      x++;
      if (x < 10) {
        var seconds = '0' + x;
        that.setData({
          recordSecond: seconds
        })
      } else if (x >= 10 && x <= 59) {
        var seconds = x;
        that.setData({
          recordSecond: seconds
        })
      } else if (x > 59) {
        // seconds = '00';
        that.setData({
          recordSecond: "00"
        })
        x = 0;
        a++;
      }
      if (a < 10) {
        var minus = '0' + a;
        that.setData({
          recordMinute: minus
        })
      } else if (a >= 10) {
        var minus =  a;
        that.setData({
          recordMinute: minus
        })
        this.recordStop()
        clearInterval(t1);
      } 
    }
  },
   /**
   * 关闭录音卡
   */
  closeRecordBox:function(){
    var that = this;
    if (this.data.isRecording == true){

    }else{
      that.recorderManager.stop();
      that.recorderManager.onStop(function (res) {
        // 停止录音之后，把录取到的音频放在res.tempFilePath
        console.log("结束")
      });
      clearInterval(this.data.t1);
      that.setData({
        recordStatus: '0',
        recordShow: false,
        recordSecond: '00',
        recordMinute: '00'

      })
    }
  },

 /**
   * 预览视频
   */
  previewVideoFn:function(){
    this.setData({
      isVideoShow: '1',
      isPlay: "true"
    })
    var videoContext = this.videoContext;
    videoContext.seek(0);
    if (this.videoContextTop) {
      this.videoContextTop.pause()
    }
    videoContext.play();
    videoContext.requestFullScreen();
  },
  previewVideoTopFn:function(e){  
    this.videoContext.pause()
    var index = e.currentTarget.dataset.index;
    var src = e.currentTarget.dataset.src;
    this.videoContextTop = wx.createVideoContext('prew_video' + index); 
    var videoContextTop = this.videoContextTop;
    videoContextTop.seek(0);
    videoContextTop.play();
    this.setData({
      playVideoSrc: src,
      isVideoTop:index,
      isPlay:"true",
      isSpread: true,
      style: "",
    })
    // console.log("11111111", this.data.playVideoSrc, this.data.isVideoShow, this.data.isPlay)
  },
  bindpause:function(){
    // isFull
    if (this.data.isFull == false){
      this.setData({
        isVideoTop:-1,
        isVideoShow:0
      })
    }
    this.setData({
      isPlay: "false",
      // isVideoTop:-1,
      // isVideoShow:0
    })
  },
  bindendedComment: function () {
    this.data.videoContext.seek(0);
    this.setData({
      isPlay: 'false'
    })
  },
/**
   * 文本输入框失焦
   */
  bindTextAreaBlur:function(e){ 
    // console.log("123456789",e)
    var that = this;
    this.setData({
      txtContent: e.detail.value,
    })
    this.initBtn();
    if (that.data.txtContent.length > 0) {
      var textAnswer = {
        "text": that.data.txtContent,
        "mediaURI": "",
        "mediaName": "",
        "mediaType": "text",
        "duration": 0
      }
      that.data.questionsAnswer[that.data.currentQuestion].splice(0, 1, textAnswer);
      // that.data.questionsAnswer[that.data.currentQuestion].push(textAnswer);
    } else {
      that.data.questionsAnswer[that.data.currentQuestion].splice(0, 1);
    }
  },
  noteKeyUp(){
    console.log("11111")
  },
  /**
   * 文本输入框获取焦点
   */
  bindButtonTap: function () {
    this.setData({
      focus: true
    })
    wx.pageScrollTo({
      scrollTop:2000
    })
  },
  /**
   * 初始化按钮状态  imgArr:[],
    videoImgArr:[],
    videoArr:[],
    recordArr:[],
   */
  initBtn(){
    if (this.data.questions[this.data.currentQuestion].questionType == "subjective"){
      if (this.data.txtContent.length > 0 || this.data.imgArr.length > 0 || this.data.videoArr.length > 0 || this.data.recordArr.length > 0){
        this.setData({
          btnDisable: false
        })
      }else{
        this.setData({
          btnDisable: true
        })
      }
    }else{
      if (this.data.questionsAnswer[this.data.currentQuestion].indexOf('choosed') > -1) {
        this.setData({
          btnDisable: false
        })
      } else {
        this.setData({
          btnDisable: true
        })
      }
    }
  },
  /**
   * 底部按钮点击
   */
  runNext:function(event){
    switch(event.currentTarget.dataset.status){
      case 'nextTitle': this.toNextTitle();break;
      case 'submitAndReview':this.toQuestionAnswer();break;
    }
  },

  /**
   * 进入下一题
   */
  toNextTitle:function(event){
    var that = this;
    let tempQuestions = this.data.questions;
    this.setData({
      questions: []
    })
    this.setData({
      questions: tempQuestions,
      recordStatus: '0',
      recordShow: false,
      recordSecond: '00',
      recordMinute: '00',
      focus:false
    })

    if (this.data.questions[this.data.currentQuestion].questionType == "subjective") {

      var classname = ".question-subjective" + this.data.currentQuestion;
      setTimeout(function () {
        that.query.select(classname).boundingClientRect(function (rect) {
          if (rect) {
            // console.log("下一题问答题", rect)
            if (rect.height > 180) {
              that.setData({
                style: "height:180px;overflow:hidden",
                isShow: true
              })
            } else {
              that.setData({
                style: "",
                isShow: false
              })
            }
          }
        }).exec();
      }, 100)
    } else {
      var classname = ".question-instruction" + this.data.currentQuestion;
      setTimeout(function () {
        that.query.select(classname).boundingClientRect(function (rect) {
          if (rect) {
            // console.log("下一题选择题", rect)
            if (rect.height > 180) {
              that.setData({
                style: "height:180px;overflow:hidden",
                isShow: true
              })
            } else {
              that.setData({
                style: "",
                isShow: false
              })
            }
          }
        }).exec();
      }, 100)
    }
   
    if(this.data.btnDisable){
      return;
    } else {
      if (this.data.currentQuestion < this.data.questions.length - 1) {
        if (this.data.questions[this.data.currentQuestion].questionType == "subjective"){
          if (this.data.txtContent.length > 0 || this.data.imgArr.length > 0 || this.data.videoArr.length > 0 || this.data.recordArr.length > 0) {
            if (this.data.imgArr.length > 0){
              for (let i = 0; i < this.data.imgArr.length; i++) {
                var textAnswer = {
                  "text": "",
                  "mediaURI": that.data.imgArr[i],
                  "mediaName": "",
                  "mediaType": "image",
                  "duration": 0
                }
                that.data.questionsAnswer[that.data.currentQuestion].push(textAnswer);
              }
            }
            if (this.data.videoArr.length > 0) {
              var textAnswer = {
                "text": "",
                "mediaURI": that.data.videoArr[0],
                "mediaName": "",
                "mediaType": "video",
                "duration": 0
              }
              that.data.questionsAnswer[that.data.currentQuestion].push(textAnswer);
            }
            if (this.data.recordArr.length > 0) {
              var textAnswer = {
                "text": "",
                "mediaURI": this.data.recordArr[0].path,
                "mediaName": "",
                "mediaType": "audio",
                "duration": this.data.recordDuration
              }
              that.data.questionsAnswer[that.data.currentQuestion].push(textAnswer);

            }
            this.data.currentQuestion++;
            wx.pageScrollTo({
              scrollTop: 0
            })
            this.pageIsshow()
            
            that.setData({
              txtContent: "",
              recordArr: [],
              videoArr: [],
              imgArr:[]
            })
          } else {
            Util.showToast(Constant.TITLE_NOT_FINISHED_TIP);
          }
        }else {
          if (this.data.questionsAnswer[this.data.currentQuestion].indexOf('choosed') < 0) {
            Util.showToast(Constant.TITLE_NOT_FINISHED_TIP);
          } else {
            Analytics.nextTitleOrSubmit({
              itemId: '下一题',
              courseId: this.data.item.courseId,
              taskId: this.data.item.tasks[this.data.item.currentTaskIndex].id
            });
            this.data.currentQuestion++;
            wx.pageScrollTo({
              scrollTop: 0
            })
            this.pageIsshow()
          }
        }
      }
      if (this.data.currentQuestion == this.data.questions.length - 1) {
        this.data.btnStatus = 'submitAndReview';
      }
      this.setData({
        currentQuestion: this.data.currentQuestion,
        btnStatus: this.data.btnStatus
      })
      this.initBtn();
    }
  },
  pageIsshow(){
    var that = this;
    that.setData({
      style: "",
      isShow: false,
      isSpread:false
    })
    if (this.data.questions[this.data.currentQuestion].questionType == "subjective") {
   
      var classname = ".question-subjective"+this.data.currentQuestion;
      setTimeout(function(){
        that.query.select(classname).boundingClientRect(function (rect) {
          if (rect) {
            // console.log("下一题问答题", rect)
            if (rect.height > 180) {
              that.setData({
                style: "height:180px;overflow:hidden",
                isShow: true
              })
            } else {
              that.setData({
                style: "",
                isShow: false
              })
            }
          }
        }).exec();
      },100)
    }else{
      var classname = ".question-instruction" + this.data.currentQuestion;
      setTimeout(function () {
        that.query.select(classname).boundingClientRect(function (rect) {
          if (rect) {
            // console.log("下一题选择题", rect)
            if (rect.height > 180) {
              that.setData({
                style: "height:180px;overflow:hidden",
                isShow: true
              })
            } else {
              that.setData({
                style: "",
                isShow: false
              })
            }
          }
        }).exec();
      }, 100)
    }
  },
  
  /**
   * 进入答案解析页面 
   */
  toQuestionAnswer:function(event){
    // console.log("this.data.btnCount", this.data.btnCount)
    if(this.data.btnCount == 0){
      this.setData({
        btnCount: 1,
      })
      if (this.data.questions[this.data.currentQuestion].questionType == "subjective") {
        if (this.data.txtContent.length > 0 || this.data.imgArr.length > 0 || this.data.videoArr.length > 0 || this.data.recordArr.length > 0) {
          this.combineQuestion()
        } else {
          Util.showToast(Constant.TITLE_NOT_FINISHED_TIP);
        }
      } else {
        if (this.data.questionsAnswer[this.data.currentQuestion].indexOf('choosed') < 0) {
          Util.showToast(Constant.TITLE_NOT_FINISHED_TIP);
        } else {
          Analytics.nextTitleOrSubmit({
            itemId: '提交并查看作业解析',
            courseId: this.data.item.courseId,
            taskId: this.data.item.tasks[this.data.item.currentTaskIndex].id
          });
          this.combineQuestion();
        }
      } 
    }
    // this.combineQuestion();
  },
  /**
   * 组合答案  course
   */
  combineQuestion:function(){
    var that = this;
    let params = {};
    let taskResult = {
      taskType: 'quiz',
      questionResults: [],
    };


    if (this.data.imgArr.length > 0) {
      for (let i = 0; i < this.data.imgArr.length; i++) {
        var textAnswer = {
          "text": "",
          "mediaURI": that.data.imgArr[i],
          "mediaName": "",
          "mediaType": "image",
          "duration": 0
        }
        that.data.questionsAnswer[that.data.currentQuestion].push(textAnswer);
      }
    }
    if (this.data.videoArr.length > 0) {
      var textAnswer = {
        "text": "",
        "mediaURI": that.data.videoArr[0],
        "mediaName": "",
        "mediaType": "video",
        "duration": 0
      }
      that.data.questionsAnswer[that.data.currentQuestion].push(textAnswer);
    }
    if (this.data.recordArr.length > 0) {
      var textAnswer = {
        "text": "",
        "mediaURI": this.data.recordArr[0].path,
        "mediaName": "",
        "mediaType": "audio",
        "duration": this.data.recordDuration
      }
      that.data.questionsAnswer[that.data.currentQuestion].push(textAnswer);

    }

    // 1、组装taskResult  
    for (let i = 0; i < this.data.questionsAnswer.length; i++) {
      let answerObj;
      if (this.data.questionsAnswer[i].indexOf('choosed') < 0) {
        answerObj = {
          questionType: 'subjective', answer: [], isEssence: false,
          sequence: this.data.questions[i].sequence
        }
        for (let j = 0; j < this.data.questionsAnswer[i].length; j++) {
          if (this.data.questionsAnswer[i][j] == "") {
            answerObj.answer.splice(j,1);
          }else{
            answerObj.answer.push(this.data.questionsAnswer[i][j]);
          }
          // answerObj.answer.push(this.data.questionsAnswer[i][j]);
          // taskResult.questionResults.push(answerObj);
        } 
        taskResult.questionResults.push(answerObj);
        // console.log("jjjjj", j, this.data.questionsAnswer[i])
        // console.log("jj", j, this.data.questionsAnswer[i][j])
       
      } else {
        answerObj = { answer: [] };
        for (let j = 0; j < this.data.questionsAnswer[i].length; j++) {
          if (this.data.questionsAnswer[i][j] == 'choosed') {
            answerObj.answer.push(this.data.questions[i].options[j].number);
          }
        }
        taskResult.questionResults.push(answerObj);
      }
    }

    // console.log("taskResult.questionResults", taskResult.questionResults)
    // 2、组装提交答题结果接口参数
    params["taskType"] = 'quiz'
    params["courseId"] = this.data.item.courseId;
    params["taskRef"] = this.data.item.tasks[this.data.item.currentTaskIndex].id;
    params["taskStatus"] = "done";
    params["taskResult"] = taskResult;
    console.log("btnCount", this.data.btnCount)
    console.log("params",params)
    // 判断提交内容是否有误，上报
    if (JSON.stringify(taskResult) == '{}') {
      let message = {
        'msg': 'question error submit taskResult',
        'params': params
      }
      logger.error(message);
    }
    //3、提交答题结果
    let _this = this;
    // console.log("提交结果")
    API.submitTask(params, true, false).then((res) => {
      _this.data.item.tasks[_this.data.item.currentTaskIndex].taskResult = taskResult;
      _this.data.prevPage.updateTaskStatus && _this.data.prevPage.updateTaskStatus();
      wx.setStorageSync('item', JSON.stringify(_this.data.item));
      wx.redirectTo({
        url: `../questionAnswer/questionAnswer?key=item`
      })
    }, err => {
      this.setData({
        btnCount: 0,
      })
      if (err.data.errorCode == -158) {
        wx.showModal({
          title: '提示',
          content: '抱歉，该作业已经下架',
          showCancel: false,
          success: function (res) {
            _this.data.prevPage.updateTaskStatus && _this.data.prevPage.updateTaskStatus();
            wx.navigateBack();
          }
        })
      }else{
        wx.showToast({
          title: err.data.technialMessage,
          icon: 'none'
        })
      }
    });
  },
  /**
   * 图片预览
   */
  previewImg:function(event){
    var src = event.currentTarget.dataset.src;//获取data-src
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls:[src]
    })
  }
})