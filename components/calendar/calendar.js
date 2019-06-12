// components/calendar.js
let calendar = require('../../utils/calendar.js');
Component({
  /** 
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    weekdays:['一','二','三','四','五','六','日'],
    months: calendar.getMonths(new Date().getFullYear())
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
