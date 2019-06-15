// components/replyKeyboard/replyKeyboard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      value: 'voice',
    },
    currentItem: {
      type: Object,
      value: {},
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    randomItem() {
      this.triggerEvent('randomevent', {});
    },
  },
});
