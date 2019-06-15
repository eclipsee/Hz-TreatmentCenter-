// components/star/star.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    rate: {
      type: Number,
      value: 5,
    },
    size: {
      type: String,
      value: 'middle',
    },
  },

  ready() {
    this.setData({
      stars: new Array(this.data.rate).fill(1),
    });
  },

  /**
   * 组件的初始数据
   */
  data: {
    stars: null,
    grayStars: new Array(5).fill(1),
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
})
