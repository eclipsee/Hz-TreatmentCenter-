// pages/bubble/bubbleFishing.js
import { dbRequests } from '../../requests/request';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    bubble: {},
  },

  goReply() {
    wx.navigateTo({ url: `../bubbleDetail/index?bubble_id=${this.data.bubble._id}` });
  },

  randomBubble() {
    console.log('randomBubble');
    this.getBubble();
  },

  getBubbleTxt(tag) {
    const txts = ['生气', '快乐', '伤心', '烦躁', '苦恼', '纠结'];
    return txts[tag];
  },

  giveFive() {
    console.log('giveFive');
  },

  getBubble() {
    dbRequests.getLuckyBubble().then((res) => {
      dbRequests.getComments(res._id).then((comments) => {
        this.setData({
          bubble: { ...res, comments, tagName: this.getBubbleTxt(res.tag) },
        });
      });
    }).catch(() => {
      wx.showModal({
        title: '获取失败',
        showCancel: false,
      });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // dbRequests.addUser({
    //   user_name: 'lizifen04',
    //   avatar: 'http://img.wxcha.com/file/201807/13/9bbc369f6e.jpg',
    // }).then((res) => {
    //   console.log(res);
    // });
    this.getBubble();
  },
});
