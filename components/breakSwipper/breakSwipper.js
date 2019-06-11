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
        // this.triggerEvent('myevent', {
        //   item: this.data.initTask()
        // }, {})
      }
    },
    isCourseOver: Boolean,
    currentItemId:Number,
    courseId:String,
    currentChecked: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    // checked: new Date().getDay(),
    // checked: 0,
    leftX:""
  },
  ready() {
    this.query = wx.createSelectorQuery();
    // var date = new Date()
    if (this.data.currentChecked == 1000){
      var calendarItems = this.data.calendarItems;
      for (var i = 0; i < calendarItems.length; i++) {
        if (calendarItems[i].id == this.data.currentItemId) {
          this.setData({
            checked: i
          })
        }
      }
    }else{
      this.setData({
        checked: this.data.currentChecked
      })
    }
    var myCanvasWidth;
    wx.getSystemInfo({
      success: function (res) {
        myCanvasWidth = (270 / 375) * res.screenWidth;
      }
    });
    var check = this.data.checked;
    this.setData({
      leftX: check * myCanvasWidth
    })
    console.log("check", myCanvasWidth, this.data.checked, this.data.leftX)
   
  },
  /**
   * 组件的方法列表
   */
  methods: {
    checkedDate: function (e) {
      let dataset = e.currentTarget.dataset;
      // console.log(this.data.calendarItems, e, e.currentTarget.dataset.num)
      this.setData({
        checked: dataset.num
      });
      this.triggerEvent('myevent', {
        item: dataset.item
      }, {})
      wx.reportAnalytics('click_break', {
        srcpage: '马上打卡课程详情页',
        srcmodule: '所有课时',
        item: 'class',
        itemid: this.data.calendarItems[this.data.checked].id,
        lessonid: Number(this.data.courseId),
      });
    },
    toBreakList:function(){
      wx.navigateTo({
        url: `../../allBreak/allBreak?checked=${this.data.checked}&courseId=${this.data.courseId}`,
      })
      wx.reportAnalytics('click_more_break', {
        srcpage: '马上打卡课程详情页',
        srcpageid: '所有课时',
        srcmodule: 'button',
        item: '查看更多',
        lessonid: Number(this.data.courseId),
      });
    }
  }
})
