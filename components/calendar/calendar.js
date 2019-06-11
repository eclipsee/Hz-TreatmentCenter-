// components/calendar.js
Component({
  /** 
   * 组件的属性列表
   */
  properties: {
    calendarItems: {
      type: Array,
      value: [],
      observer: function () {
        // this.setData({ 
        //   PrevSunday: this.getPrevSunday(new Date()),
        //   sMonthB:this.getPrevSunday(new Date()).getMonth() + 1,
        //   sYearB:this.getPrevSunday(new Date()).getFullYear(),
        //   sDayB:this.getPrevSunday(new Date()).getDate()
        // })
        this.isInnerTime(new Date());
        if (this.data.checkedTime.length>0){
          this.setData({
            PrevSunday: this.getPrevSunday(new Date(this.data.checkedTime)),
            sMonthB: new Date(this.data.checkedTime).getMonth() + 1,
            sYearB: new Date(this.data.checkedTime).getFullYear(),
            sDayB: new Date(this.data.checkedTime).getDate(),
            checked: new Date(this.data.checkedTime).getDay(),
            currentChecked: new Date(this.data.checkedTime).getDay(),
          })
        }else{
          if (this.data.innerTime == false && this.data.startTime.length > 0) {
            this.setData({
              PrevSunday: this.getPrevSunday(new Date(this.data.startTime)),
              sMonthB: new Date(this.data.startTime).getMonth() + 1,
              sYearB: new Date(this.data.startTime).getFullYear(),
              sDayB: new Date(this.data.startTime).getDate(),
              checked: new Date(this.data.startTime).getDay(),
              currentChecked: new Date(this.data.startTime).getDay(),
            })
          } else {
            this.setData({
              PrevSunday: this.getPrevSunday(new Date()),
              sMonthB: new Date().getMonth() + 1,
              sYearB: new Date().getFullYear(),
              sDayB: new Date().getDate(),
              checked: new Date().getDay(),
              currentChecked: new Date().getDay(),
            })
          }
        }

        this.setData({
          weeklist: this.initWeekList(this.data.PrevSunday, 1)
        })
        this.triggerEvent('myevent', {
          item: this.data.weeklist[this.data.checked]
        }, {})

      }
    },
    startTime: String,
    endTime: String,
    checkedTime: String,
    isCourseOver: Boolean,
  },

  /**
   * 组件的初始数据
   */
  data: {
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    checked: new Date().getDay(),
    // checked: 5,
    sMonthB: '',
    sYearB: '',
    sDayB: '',
    weeklist: [],
    startX: '',
    movedis: 0,
    innerTime: false,
    currentChecked: new Date().getDay()
  },
  ready() {
    // var date = new Date()
    // console.log("dateset", new Date("2017-12-08").getDay())
    // this.setData({ 
    //   weeklist: this.getWeekList(this.data.PrevSunday,1)
    // })
    
  },
  /**
   * 组件的方法列表
   */
  methods: {
    checkedDate: function (e) {
      let dataset = e.target.dataset,
        date = dataset.item.date;
      this.isInnerTime(date)

      if (this.data.startTime.length > 0) {
        if (this.data.innerTime == true) {
          wx.setStorageSync("checkedDate", date)
          this.setData({
            checked: dataset.num,
            sMonthB: new Date(date).getMonth() + 1,
            sYearB: new Date(date).getFullYear(),
            currentChecked: dataset.num
          });
          this.triggerEvent('myevent', {
            item: dataset.item
          }, {})
        } else {
          wx.showToast({
            title: "不在打卡日期内",
            icon: "none",
            duration: 1500
          });
        }
      } else {
        this.setData({
          checked: dataset.num,
          sMonthB: new Date(date).getMonth() + 1,
          sYearB: new Date(date).getFullYear(),
          currentChecked: dataset.num
        });
        this.triggerEvent('myevent', {
          item: dataset.item
        }, {})
      }

    },
    isInnerTime(date) {
      if (this.data.startTime.length > 0 && this.data.endTime.length > 0) {
        let dateBegin = new Date(this.data.startTime)
        let dateEnd = new Date(this.data.endTime)
        let dateNow = new Date(date)
        let beginDiff = dateNow.getTime() - dateBegin.getTime();//时间差的毫秒数       
        let beginDayDiff = Math.floor(beginDiff / (24 * 3600 * 1000));//计算出相差天数

        let endDiff = dateEnd.getTime() - dateNow.getTime();//时间差的毫秒数
        let endDayDiff = Math.ceil(endDiff / (24 * 3600 * 1000));//计算出相差天数       
        if (endDayDiff < 0 || beginDayDiff < 0) {//已过期
          // console.log("不在时间范围内")
          this.setData({
            innerTime: false
          })
        } else {
          this.setData({
            innerTime: true
          })
        }
      } else if (this.data.startTime.length > 0 && this.data.endTime.length == 0){
        this.setData({
          innerTime: true
        })
      }

    },
    touchS: function (e) {
      if (e.touches.length == 1) {
        this.setData({        //设置触摸起始点水平方向位置        
          startX: e.touches[0].clientX
        });
      }
    },
    touchM: function (e) {
      var that = this
      if (e.touches.length == 1) {
        var moveX = e.touches[0].clientX;
        //计算手指起始点的X坐标与当前触摸点的X坐标的差值
        var disX = that.data.startX - moveX;
        this.setData({
          movedis: -disX + 'rpx'
        });
      }
    },
    touchE: function (e) {
      if (e.changedTouches.length == 1) {      //手指移动结束后水平位置      
        var endX = e.changedTouches[0].clientX;      //触摸开始与结束，手指移动的距离      
        var disX = this.data.startX - endX;
        disX > 60 ? this.switchPage(1) : '';
        disX < -60 ? this.switchPage(-13) : '';
        this.setData({
          movedis: '0rpx'
        });
      }
    },
    //plan B
    //获取离今日最近的星期天
    getPrevSunday: function (date) {
      const _d = new Date(date);
      _d.setDate(_d.getDate() - _d.getDay());
      _d.getFullYear();
      return _d
    },
    //初始化weeklist
    initWeekList: function (sunday, type) {
      if (this.data.startTime.length > 0 && this.data.innerTime == false) {
        this.setData({
          checked: sunday.toDateString() == this.getPrevSunday(new Date(this.data.startTime)).toDateString() ? new Date(this.data.startTime).getDay() : 7
        })
      } else if (this.data.checkedTime.length>0){
        this.setData({
          checked: sunday.toDateString() == this.getPrevSunday(new Date(this.data.checkedTime)).toDateString() ? new Date(this.data.checkedTime).getDay() : 7
        })
      }else {
        this.setData({
          checked: sunday.toDateString() == this.getPrevSunday(new Date()).toDateString() ? new Date().getDay() : 7
        })
      }

      //type 1 默认，2滑动显示
      let weekList = [];
      for (let i = 0; i < 7; i++) {
        let days = {};
        var day,
          day = i == 0 ? sunday : sunday.setDate(sunday.getDate() + 1);
        day = new Date(day);
        let Y = day.getFullYear();
        let M = day.getMonth() + 1;
        M = M < 10 ? '0' + M : M;
        let D = day.getDate();
        D = D < 10 ? '0' + D : D;
        days.date = Y + '-' + M + '-' + D;
        // 处理当日文案
        days.d = new Date(day).toDateString() == new Date().toDateString() ? '今' : D;

        //活动范围外的课程
        if (this.data.startTime.length > 0) {
          this.isInnerTime(new Date(day));
          if (this.data.innerTime == true) {
            days.isSee = false
          } else {
            days.isSee = true
          }
        }
        if (type == 2) {
          //左右滑动后自动选中第一天

          // if(new Date(day).toDateString() == new Date().toDateString()){
          //     this.setData({
          //       checked:new Date().getDay()
          //     })
          //     console.log('当前周');
          // }
        }
        //课程数据
        let myCourse = this.data.calendarItems;
        for (let j = 0; j < myCourse.length; j++) {
          //日期一样，合并对象
          if (myCourse[j].topicItemDate == days.date) {
            days = Object.assign(days, myCourse[j]);
          }
        }
        weekList.push(days);
      }
      return weekList;

    },
    //获取7天list

    getWeekList: function (sunday, type) {
      if (this.data.checkedTime.length > 0){
        this.setData({
          checked: sunday.toDateString() == this.getPrevSunday(new Date(this.data.checkedTime)).toDateString() ? this.data.currentChecked : 7
        })
      }else if (this.data.startTime.length > 0 && this.data.innerTime == false) {
        this.setData({
          checked: sunday.toDateString() == this.getPrevSunday(new Date(this.data.startTime)).toDateString() ? this.data.currentChecked : 7
        })
      }else{
        this.setData({
          checked: sunday.toDateString() == this.getPrevSunday(new Date()).toDateString() ? this.data.currentChecked : 7
        })
      }



      //type 1 默认，2滑动显示
      let weekList = [];
      for (let i = 0; i < 7; i++) {
        let days = {};
        var day,
          day = i == 0 ? sunday : sunday.setDate(sunday.getDate() + 1);
        day = new Date(day);
        let Y = day.getFullYear();
        let M = day.getMonth() + 1;
        M = M < 10 ? '0' + M : M;
        let D = day.getDate();
        D = D < 10 ? '0' + D : D;
        days.date = Y + '-' + M + '-' + D;
        // 处理当日文案
        days.d = new Date(day).toDateString() == new Date().toDateString() ? '今' : D;

        //活动范围外的课程
        if (this.data.startTime.length > 0) {
          this.isInnerTime(new Date(day));
          // console.log("this.data.innerTime",this.data.innerTime)
          if (this.data.innerTime == true) {
            days.isSee = false
          } else {
            days.isSee = true
          }
        }
        if (type == 2) {
          //左右滑动后自动选中第一天

          // if(new Date(day).toDateString() == new Date().toDateString()){
          //     this.setData({
          //       checked:new Date().getDay()
          //     })
          //     console.log('当前周');
          // }
        }
        //课程数据
        let myCourse = this.data.calendarItems;
        for (let j = 0; j < myCourse.length; j++) {
          //日期一样，合并对象
          if (myCourse[j].topicItemDate == days.date) {
            days = Object.assign(days, myCourse[j]);
          }
        }
        weekList.push(days);
      }
      return weekList;

    },
    //
    //翻页
    switchPage: function (type) {
      //type 1 上周 -13 ; type 2 下周 +1;
      const date = new Date(this.data.PrevSunday); // 拷贝一个当前的指针时间（直接拧的话，双向数据绑定watch不到变化）
      date.setDate(date.getDate() + parseInt(type)) // 拧到上周的这个日子
      this.setData({
        PrevSunday: date,
        sMonthB: date.getMonth() + 1,
        sYearB: date.getFullYear(),
        sDayB: date.getDate()
      })
      this.setData({
        weeklist: this.getWeekList(date, 2)
      })
    }
  }
})
