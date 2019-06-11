module.exports = {
  //当某月的天数
  getDaysInOneMonth: function(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const d = new Date(year, month, 0)
    return d.getDate()
  },
  //向前空几个
  getMonthweek: function(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const dateFirstOne = new Date(year + '/' + month + '/1')
    return dateFirstOne.getDay() == 0 ? 6 : dateFirstOne.getDay() - 1
  },
  // 向后空几个
  getMonthTail: function(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const dateFirstOne = new Date(year + '/' + month + "/" + this.getDaysInOneMonth(date))
    return dateFirstOne.getDay() == 6 ? 0 : 6 - dateFirstOne.getDay()
  },
  /**
   * 获取当前日期上个月或者下个月
   */
  getOtherMonth: function(date, str = 'nextMonth') {
    const timeArray = this.dateFormat(date).split('/')
    const year = timeArray[0]
    const month = timeArray[1]
    const day = timeArray[2]
    let year2 = year
    let month2
    if (str === 'nextMonth') {
      month2 = parseInt(month) + 1
      if (month2 == 13) {
        year2 = parseInt(year2) + 1
        month2 = 1
      }
    } else {
      month2 = parseInt(month) - 1
      if (month2 == 0) {
        year2 = parseInt(year2) - 1
        month2 = 12
      }
    }
    let day2 = day
    const days2 = new Date(year2, month2, 0).getDate()
    if (day2 > days2) {
      day2 = days2
    }
    if (month2 < 10) {
      month2 = '0' + month2
    }
    if (day2 < 10) {
      day2 = '0' + day2
    }
    const t2 = year2 + '/' + month2 + '/' + day2
    return new Date(t2)
  },
  //上个月末尾的一些日期
  getLeftArr: function(date) {
    let arr = []
    const leftNum = this.getMonthweek(date)
    const num = this.getDaysInOneMonth(this.getOtherMonth(date, 'preMonth')) - leftNum + 1
    const preDate = this.getOtherMonth(date, 'preMonth')
    //上个月多少开始
    for (let i = 0; i < leftNum; i++) {
      const nowTime = preDate.getFullYear() + '/' + (preDate.getMonth() + 1) + '/' + (num + i)
      arr.push({
        id: num + i,
        date: nowTime,
        isToday: false,
        otherMonth: `preMonth`
      })
    }
    return arr
  },
  //下个月末尾的一些日期
  getRightArr: function(date) {
    let arr = [];
    const nextDate = this.getOtherMonth(date, 'nextMonth');
    const leftLength = this.getDaysInOneMonth(date) + this.getMonthweek(date);
    const _length = 7 - leftLength % 7;
    for (let i = 0; i < _length; i++) {
      const nowTime = nextDate.getFullYear() + '/' + (nextDate.getMonth() + 1) + '/' + (i + 1);
      arr.push({
        id: i + 1,
        date: nowTime,
        isToday: false,
        otherMonth: `nextMonth`
      });
    }
    return arr;
  },
  //format日期
  dateFormat: function(date) {
    if (date) {
      date = new Date(date)
    } else {
      date = new Date()
    }
    return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()

  },
  //获取某月的列表不包括上月和下月
  getMonthListNoOther: function(date) {
    let arr = [];
    const num = this.getDaysInOneMonth(date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    let toDay = this.dateFormat(new Date())

    for (let i = 0; i < num; i++) {
      const nowTime = year + '/' + month + '/' + (i + 1)
      arr.push({
        id: i + 1,
        date: nowTime,
        isToday: toDay === nowTime,
        otherMonth: `nowMonth`
      })
    }
    return arr;
  },
  //获取某月的列表 用于渲染
  getMonthList: function(date) {
    return [...this.getLeftArr(date), ...this.getMonthListNoOther(date), ...this.getRightArr(date)]
  },
  //格式化日历列表
  formateMonthList(list) {
    let _date = new Date(JSON.parse(list[0]).date);
    let _emptyCount = this.getMonthweek(_date);
    let _firstCount = _date.getDate();
    let _dayCount = this.getDaysInOneMonth(_date);
    let formateList = [];
    let dateInfo = `${_date.getFullYear()}年${_date.getMonth() + 1}月`;

    for (let m = 0; m < _emptyCount; m++) {
      formateList.push({
        text: ''
      });
    }
    for (let n = 0; n < _firstCount - 1; n++) {
      formateList.push({
        text: n + 1
      });
    }
    for (let p = 0; p < _dayCount - _firstCount + 1; p++) {
      if (list[p]) {
        let _item = JSON.parse(list[p]);
        if (_item.gift == 1) {
          _item.status = 4;
        }
        if (_item.gift == 2) {
          _item.status = 5;
        }

        formateList.push({
          text: new Date(_item.date).getDate(),
          state: _item.status + 1,
          date: this.dateFormat(_item.date),
          dateNo: _item.dateNo,
          isFree: _item.isFree,
          flag: _item.flag,
        })
      } else {
        formateList.push({
          text: p + _firstCount
        })
      }
    }
    return {
      formateList,
      dateInfo
    }
  },
  // 获取某年的所有月份的信息
  getMonths: function(year) {
    let months = [];
    for (let i = 1; i < 13; i++) {
      let month = {};
      let date = new Date(year + "/" + i + "/" + 1);
      if (date != null) {
        month.nth = i;
        month.days = this.getDaysInOneMonth(date); // 每月有多少天
        month.topSpaceDays = this.getMonthweek(date); // 日历前面空格天数
        month.tailSpaceDays = this.getMonthTail(date); // 日历后面空格天数
        month.daysArray = [];
        for (let index1 = 1; index1 < month.topSpaceDays + 1; index1++) {
          let day = {};
          month.daysArray.push(day);
        }
        for (let index2 = 1; index2 < month.days + 1; index2++) {
          let day = {};
          day.nthDay = index2;
          day.date = year + "/" + month.nth + "/" + day.nthDay;
          month.daysArray.push(day);
        }
        for (let index3 = 1; index3 < month.tailSpaceDays + 1; index3++) {
          let day = {};
          month.daysArray.push(day);
        }
        months.push(month);
      }
    }
    return months;
  }
}