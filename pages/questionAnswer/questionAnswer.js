import API from '../../requests/api/api.js';
var app = getApp();
// pages/questionAnswer/questionAnswer.js
Page({

  /**
   * 页面的初始数据
   *
   */
  data: {
    currentProductIndex: 0,
    currentTaskIndex: 0,
    currentItemIndex: 0,
    currentQuestion: 0,
    imageIndex: 3,
    showCount: 8,
    allCount: 8,
    scoreRate: 0,
    showAllFlag: false,
    showAllCommentFlag: false,
    timer: null,
    isVideoShow: '0',
    answerSequence: 0,
    answerComment: [],
    isShow1: 'false',
    isShow2: 'false',
    style1: "",
    style2: "",
    videoSrc: "",
    task: {},
    trueOfFalse: [],
    fromPage: '',
    prevPage: {},
    item: {},
    btnStatus: 'checkIn',
    noticeId: "",
    courseId: "",
    isFull: false,
    isPlay: 'false',
    playVideoSrc: "",
    isVideoTop: -1,
    isSelectExits: false,
    navHeight:0,
    questionIndex: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.data.item = JSON.parse(wx.getStorageSync(options.key));
    this.data.fromPage = options.fromPage || '';
    if (options.itemId) {
      // console.log("有日期")
      this.setData({
        noticeId: options.itemId,
        courseId: options.courseId,
      })
    }else{
      // console.log("无日期")
      this.data.item = JSON.parse(wx.getStorageSync("item"));
      this.setData({
        task: this.data.item.tasks[this.data.item.currentTaskIndex],
      })
    }
   
    let pages = getCurrentPages();
    this.data.prevPage = pages[pages.length - 2];
    this.setData({
      navHeight: app.globalData.navHeight
    })
    if (options.questionIndex){
      this.setData({
        navHeight: app.globalData.navHeight,
        questionIndex: parseInt(options.questionIndex)
      })
    }

  },
  onShow: function() {
    // console.log("onshow", this.data.item.id)
    wx.reportAnalytics('show_question_answer', {
      item: '马上打卡作业解析页',
      lessonid: this.data.item.courseId,
      workid: this.data.item.tasks[this.data.item.currentTaskIndex].id,
    });
  },
  /**
   * 生命周期函数-监听页面卸载
   */
  onUnload: function(event) {
    this.checkIn = null;
    this.previewVideoFn = null;
    this.onFullscreenChange = null;
    this.initPage = null;
    this.sortAsc = null;
    this.initBtnStatus = null;
    this.showAll = null;
    this.showAllComment = null;
    this.chooseTitle = null;
    this.runNext = null;
    this.nextChapter = null;
    this.reviewCheckIn = null;
    this.reviewAnalysisPage = null;
    this.startWorking = null;
    this.finishLearning = null;
    this.previewImg = null;
    this.toMoreSelete = null;
    this.getCourseDetail = null;
    // this.data.videoContext.pause();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    this.videoContext11 = wx.createVideoContext('prew_video');
    that.query = wx.createSelectorQuery();
    that.query.select('.question-instructionSub').boundingClientRect(function(rect) {
      if (rect) {
        if (rect.height > 200) {
          that.setData({
            isShow1: 'true',
            style1: "height:200px;overflow:hidden"
          })
        }
      }
    }).exec();
    if (that.data.noticeId) {
      that.getCourseDetail()
    } else {
      this.initPage();
      this.initBtnStatus();
    }
    // let _this = this;
    // API.courseOffConfirm({ courseId: this.data.item.courseId }).then(res => {
    //   wx.showModal({
    //     title: '提示',
    //     content: Constant.COURSE_OFF_MODAL,
    //     showCancel: false,
    //     success: res => {
    //       _this.data.prevPage.updateTaskStatus && this.data.prevPage.updateTaskStatus();
    //       if (_this.data.fromPage == 'todayTask') {
    //         wx.navigateBack();
    //       } else {
    //         wx.reLaunch({
    //           url: '/pages/todayTask/todayTask',
    //         })
    //       }
    //     }
    //   })
    // });
  },

  /**
   * 预览视频  
   * 
   */
  previewVideoTopFn: function(e) {
    if (this.videoContext) {
      this.videoContext.pause()
    }
    var index = e.currentTarget.dataset.index;
    var src = e.currentTarget.dataset.src;
    this.videoContextTop = wx.createVideoContext('prew_video' + index);
    var videoContextTop = this.videoContextTop;
    videoContextTop.seek(0);
    videoContextTop.play();

    console.log("index", index, src)
    this.setData({
      playVideoSrc: src,
      isVideoTop: index,
      isPlay: "true",
      isSpread: true,
      style: "",
      showAllFlag: true,
      style1: ""
    })
    // console.log("11111111", this.data.playVideoSrc, this.data.isVideoShow, this.data.isPlay)
  },
  previewVideoFn: function(e) {
    var videoContext11 = this.videoContext11;
    var src = e.currentTarget.dataset.src;
    this.setData({
      videoSrc: src,
      isVideoShow: '1',
      isPlay: "0"
    })
    videoContext11.play();
    videoContext11.requestFullScreen();
    if (this.videoContextTop) {
      this.videoContextTop.pause();
      videoContext11.play();
      videoContext11.requestFullScreen();
    }

  },

  bindpause: function() {
    if (this.data.isFull == false) {
      this.setData({
        isVideoTop: -1,
        isVideoShow: 0,
      })
    }
  },
  bindVideoScreenChange: function(event) {
    var that = this;
    if (event.detail.fullScreen == false) {
      that.setData({
        isVideoShow: "0",
        isFull: false
      })
    } else {
      that.setData({
        isVideoShow: "1",
        isFull: true
      })
    }
  },

  /**
   * 根据传入的参数，渲染页面数据  singleSelection   multiSelection
   */
  initPage: function() {
    var that = this;
    let rightCounts = 0;
    let questions = this.data.task.taskContent.questions;
    let results = this.data.task.taskResult.questionResults;
    for (let i = 0; i < questions.length; i++) {
      if (results[i] && results[i].answer) {
        if (questions[i].questionType != "subjective") {
          if (results[i].answer.sort().join("") == questions[i].rightAnswer.sort().join("")) {
            this.data.trueOfFalse.push(true);
            rightCounts++;
          } else {
            this.data.trueOfFalse.push(false);
          }
        } else {
          this.data.trueOfFalse.push(true);
          rightCounts++;
        }
      } else {
        this.data.trueOfFalse.push(false);
      }
    }
    this.setData({
      trueOfFalse: this.data.trueOfFalse,
      scoreRate: (rightCounts / this.data.task.taskContent.questions.length).toFixed(2)
    })
    let progressBar = this.selectComponent("#progressBar");
    progressBar && progressBar.drawProgress && progressBar.drawProgress();


    if (this.data.task.taskResult.taskType == 'quiz') {
      if (!this.data.task.taskResult.questionResults[this.data.currentQuestion])
      {
        this.setData({
            currentQuestion: 0
        });
      }
      if (this.data.task.taskResult.questionResults[this.data.currentQuestion]) {
        if (this.data.task.taskResult.questionResults[this.data.currentQuestion].questionType == "subjective") {

          this.setData({
            answerSequence: this.data.task.taskResult.questionResults[this.data.currentQuestion].sequence
          })
          this.isSelectExits()

          if (this.data.task.taskComment && this.data.task.taskComment.length > 0) {
            var taskComment = this.data.task.taskComment
            for (var i = 0; i < taskComment.length; i++) {
              if (taskComment[i].sequence == this.data.answerSequence) {
                this.setData({
                  answerComment: taskComment[i]
                })
              } else {
                this.setData({
                  answerComment: {}
                })
              }
            }
            //选择id
            that.query.select('.spreadContent').boundingClientRect(function(rect) {
              console.log("11111", rect)
              if (rect) {
                if (rect.height > 300) {
                  that.setData({
                    isShow2: 'true',
                    style2: "height:300px;overflow:hidden"
                  })
                }
              }
            }).exec();
          }
        }
      }
    }

  },

  /**
   * 对答案集合进行增排序
   */
  sortAsc(arr) {
    return arr.sort(function(a, b) {
      return a[0] - b[0];
    })
  },

  /**
   * 初始化按钮状态
   */
  initBtnStatus: function() {
    let dateFlag = (new Date().getTime() - new Date(this.data.item.topicItemDate).getTime()) > 24 * 60 * 60 * 1000 ? 'yesterday' : 'today';
    if (this.data.item.doneCheckin) {
      // 1. 已打卡
      if (this.data.item.currentTaskIndex >= this.data.item.tasks.length - 1) {
        // 1.1 后面已无任务
        if (dateFlag === 'today') {
          // 1.1.1 查看今日打卡
          this.setData({
            btnStatus: "reviewCheckIn"
          })
          
        } else {
          // 1.1.2 完成
          this.setData({
            btnStatus: "finishLearning"
          })
        }
      } else {
        // 1.2 后面还有任务
        if (this.data.item.tasks[this.data.item.currentTaskIndex + 1].taskType !== 'quiz') {
          // 1.2.1 不是作业，下一章
          this.setData({
            btnStatus: "nextChapter"
          })
        } else {
          // 1.2.2 是作业
          if (this.data.item.tasks[this.data.item.currentTaskIndex + 1].taskStatus == 'done') {
            // 1.2.2.1 如果作业已经完成，进入作业解析页
            this.setData({
              btnStatus: "analysisPage"
            })
          } else {
            // 1.2.2.2 作业未完成，进入答题页
            this.setData({
              btnStatus: "startWorking"
            })
          }
        }
      }
    } else {
      // 2. 未打卡
      if (this.data.item.currentTaskIndex >= this.data.item.tasks.length - 1) {
        // 2.1 后面已无任务
        // this.setData({
        //   btnStatus: "checkIn"
        // })
        if (dateFlag === 'today') {
          // 2.1.1 立即打卡
          this.setData({
            btnStatus: "checkIn"
          })
        } else {
          // 2.1.2 完成学习
          this.setData({
            btnStatus: "checkInOther"
          })
        }
      } else {
        // 2.2 后面还有任务
        if (this.data.item.tasks[this.data.item.currentTaskIndex + 1].taskType === 'quiz') {
          // 2.2.1 任务为作业，去完成作业
          this.setData({
            btnStatus: "startWorking"
          })
        } else {
          // 2.2.2 进入下一章
          this.setData({
            btnStatus: "nextChapter"
          })

        }
      }
    }
    this.setData({
      btnStatus: this.data.btnStatus
    })
  },

  /**
   * 展示或收起全部
   */
  showAll: function(event) {
    var that = this;
    // console.log("11111111111111111")
    if (this.data.showAllFlag) {
      this.data.showAllFlag = false;
      this.data.allCount = this.data.showCount;
      that.setData({
        style1: "height:200px;overflow:hidden",
        isVideoShow: "0",
        isVideoTop: -1
      })
    } else {
      this.data.showAllFlag = true;
      this.data.allCount = this.data.task.taskContent.questions.length;
      that.setData({
        style1: ""
      })
    }
    this.setData({
      showAllFlag: this.data.showAllFlag,
      allCount: this.data.allCount
    })
    console.log("isvideoShow", this.data.isVideoShow)
  },
  showAllComment: function(event) {
    var that = this;
    if (this.data.showAllCommentFlag) {
      this.data.showAllCommentFlag = false;
      that.setData({
        style2: "height:300px;overflow:hidden",
        isVideoShow: "0"
      })
    } else {
      this.data.showAllCommentFlag = true;
      this.data.allCount = this.data.task.taskContent.questions.length;
      that.setData({
        style2: ""
      })
    }
    this.setData({
      showAllCommentFlag: this.data.showAllCommentFlag,
      allCount: this.data.allCount
    })
  },
  showAllVideo: function() {
    if (this.data.showAllFlag == false) {
      this.data.showAllFlag = true;
      this.data.allCount = this.data.task.taskContent.questions.length;
      that.setData({
        style1: ""
      })
    }
  },


    /**
     * 小程序，模板消息跳转到指定的题目
     *
     * 不知道咋传递参数，所以使用了全局变量
     */
    autoJumpToQuestion: function () {

        if (!this.data.questionIndex) {
            return
        }

        this.setData({
            currentQuestion: this.data.questionIndex
        });
     

        this.doChoose(this);

        //按需展开
        if (this.data.questionIndex > 7) {
            this.showAll();
        }

        //使用清空
        this.setData({
            questionIndex: null
        });
    },


    /**
   * 查看指定题目的答案解析
   */
  chooseTitle: function(event) {
    // console.log(" event.currentTarget.dataset.index",event.currentTarget.dataset.index)
    // let tempQuestions = this.data.questions;
    var that = this;

    this.setData({
      currentQuestion: event.currentTarget.dataset.index
    });
    // console.log(this.data.currentQuestion, this.data.item)

    this.doChoose(that);
  },

    doChoose: function (that) {
        this.setData({
            task: {}
        });
        this.setData({
            task: this.data.item.tasks[this.data.item.currentTaskIndex],
        });

        that.setData({
            isShow1: 'false',
            style1: "",
            isShow2: 'false',
            style2: "",
        });

        if (this.data.task.taskResult.taskType == 'quiz') {
          // 索引超标，重置为0，但还是有空数组的情况
          // console.log("this.data.task.taskResult.questionResults[this.data.currentQuestion]", this.data.task)

            // if (!this.data.task.taskResult.questionResults[this.data.currentQuestion])
            // {
              // this.setData({
              //     currentQuestion: 0
              // });
            // }

            if (this.data.task.taskResult.questionResults[this.data.currentQuestion]) {
                if (this.data.task.taskResult.questionResults[this.data.currentQuestion].questionType == "subjective") {
                    this.setData({
                        answerSequence: this.data.task.taskResult.questionResults[this.data.currentQuestion].sequence
                    })

                    this.isSelectExits()

                    if (this.data.task.taskComment && this.data.task.taskComment.length > 0) {
                        var taskComment = this.data.task.taskComment
                        for (var i = 0; i < taskComment.length; i++) {
                            if (taskComment[i].sequence == this.data.answerSequence) {
                                this.setData({
                                    answerComment: taskComment[i]
                                })
                            } else {
                                this.setData({
                                    answerComment: {}
                                })
                            }
                        }
                    }
                }
            }
        }
        //选择id
        this.query.select('.spreadContent').boundingClientRect(function (rect) {
            if (rect) {
                if (rect.height > 300) {
                    that.setData({
                        isShow2: 'true',
                        style2: "height:300px;overflow:hidden"
                    })
                }
            }
        }).exec();

        this.query.select('.question-instructionSub').boundingClientRect(function (rect) {
            if (rect) {
                if (rect.height > 200) {
                    that.setData({
                        isShow1: 'true',
                        style1: "height:200px;overflow:hidden"
                    })
                }
            }
        }).exec();
    },


  runNext: function(event) {
    switch (event.currentTarget.dataset.btnstatus) {
      case 'nextChapter':
        this.nextChapter();
        break;
      case 'reviewCheckIn':
        this.reviewCheckIn();
        break;
      case 'finished':
        ;
      case 'finishLearning':
        this.finishLearning();
        break;
      case 'checkIn':
        this.checkIn();
        break;
      case 'checkInOther':
        this.checkIn();
        break;
      case 'startWorking':
        this.startWorking();
        break;
      case 'analysisPage':
        this.reviewAnalysisPage();
        break;
    }
  },

  /**
   * 立即打卡
   */
  checkIn: function(event) {
    let _this = this;
    let params = {
      "topicRef": this.data.task.topicRef,
      "itemRef": this.data.item.id
    };
    API.checkIn(params).then((res) => {
      // 更新页面状态
      _this.data.prevPage.updateTaskStatus && _this.data.prevPage.updateTaskStatus();
      wx.redirectTo({
        url: `../share/share?from=finishCheckin&courseId=${_this.data.item.courseId}&itemId=${_this.data.item.id}`,
      })
    }, err => {
      let errMsg = '';
      if (err.data.errorCode == -157) {
        errMsg = '抱歉，该课程已经下架'
      } else if (err.data.errorCode == -151) {
        errMsg = '抱歉，该打卡项目不存在'
      }
      if (err.data.errorCode == -157 || err.data.errorCode == -151) {
        wx.showModal({
          title: '提示',
          content: errMsg,
          showCancel: false,
          success: function(res) {
            _this.data.prevPage.updateTaskStatus && _this.data.prevPage.updateTaskStatus();
            wx.navigateBack();
          }
        })
      }
    });
  },
  /**
   * 下一章
   */
  nextChapter: function() {
    this.data.item.currentTaskIndex++;
    wx.setStorageSync('item', JSON.stringify(this.data.item));
    wx.redirectTo({
      url: '../learning/learning?key=item',
    })
  },
  /**
   * 查看今日打卡
   */
  reviewCheckIn: function(event) {
    // console.log("111112",this.data.item.id)
    wx.redirectTo({
      url: `../share/share?from=finishCheckin&courseId=${this.data.item.courseId}&itemId=${this.data.item.id}`,
    })
  },
  /**
   * 查看作业解析页
   */
  reviewAnalysisPage: function(event) {
    this.data.item.currentTaskIndex++;
    wx.setStorageSync('item', JSON.stringify(this.data.item));
    wx.redirectTo({
      url: `../questionAnswer/questionAnswer?key=item`,
    })
  },
  /**
   * 开始作业
   */
  startWorking: function(event) {
    this.data.item.currentTaskIndex++;
    wx.setStorageSync('item', JSON.stringify(this.data.item));
    wx.redirectTo({
      url: `../question/question?key=item`,
    })
  },
  /**
   * 完成/完成学习
   */
  finishLearning: function() {
    wx.redirectTo({
      url: `../share/share?from=finishCheckin&courseId=${this.data.item.courseId}&itemId=${this.data.item.id}`,
    })
  },
  /**
   * 图片预览
   */
  previewImg: function(event) {
    var src = event.currentTarget.dataset.src; //获取data-src
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src]
    })
  },

  /**
   * 去更多精选页面
   */
  toMoreSelete: function() {
    var that = this;
    wx.navigateTo({
      url: `../moreSelect/moreSelect?courseId=${this.data.item.courseId}&taskRef=${this.data.item.tasks[this.data.item.currentTaskIndex].id}&sequence=${this.data.answerSequence}`,
    })
    wx.reportAnalytics('click_moreselect', {
      srcpage: '马上打卡作业解析页',
      srcmodule: 'bottomTool',
      item: 'button',
      itemid: '查看学员精选答案',
      lessonid: this.data.item.courseId,
      workid: this.data.item.tasks[that.data.item.currentTaskIndex].id,
    });
  },
  /*
   查看是否有精选回答
  */
  isSelectExits: function() {
    API.isHaveSelect({
      courseId: this.data.item.courseId,
      taskRef: this.data.item.tasks[this.data.item.currentTaskIndex].id,
      sequence: this.data.answerSequence
    }).then(res => {
      if (res.statusCode == 200) {
        if (res.data.exist == true) {
          this.setData({
            isSelectExits: true
          })

          console.log("有精选回答")
        } else {
          this.setData({
            isSelectExits: false
          })
          // console.log("没有精选回答")
        }
      } else {
        this.setData({
          isSelectExits: true
        })
      }
    }).catch(res => {
      console.log(res);
      this.setData({
        isSelectExits: true
      })
    });
  },

  /**
   * 获取课程详情
   */
  getCourseDetail: function(tipFlag = true) {
    API.getCourseDetail({
      courseId: this.data.courseId
    }).then(res => {
      if (res.statusCode) {
        var items = res.data.items;
        for (var i = 0; i < items.length; i++) {
          if (items[i].id == this.data.noticeId) {
            var task = items[i].tasks
            for (var j = 0; j < task.length; j++) {
              if (task[j].taskType == 'quiz') {
                var itemNew = {};
                itemNew = items[i]
                itemNew["currentTaskIndex"] = j;
                itemNew["taskId"] = task[j].id;
                itemNew["courseId"] = this.data.courseId;
                this.setData({
                  item: itemNew
                })
                this.setData({
                  task: task[j]
                })
                console.log("task", this.data.item)
                this.initPage();
                this.initBtnStatus();
              }
            }
          }
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
          this.autoJumpToQuestion();
      } else {

      }
    }).catch(res => {
      console.log(res);
    });
  },
  bindpause1: function() {
    // isFull
    if (this.data.isFull == false) {
      this.setData({
        isVideoTop: -1,
        isVideoShow: 0
      })
    }
    this.setData({
      isPlay: "false",
      // isVideoTop:-1,
      // isVideoShow:0
    })
  },

  bindfullscreenchange: function(event) {
    console.log("event", event)
    if (event.detail.fullScreen == true) {
      this.setData({
        isFull: true
      })
    } else if (event.detail.fullScreen == false) {
      this.setData({
        isFull: false
      })
    }
  },
})