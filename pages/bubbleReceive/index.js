// pages/bubble/bubbleFishing.js
import { dbRequests } from '../../requests/request';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    bubble: {},
    isFishing: false,
  },

  goReply() {
    wx.navigateTo({ url: `../bubbleDetail/index?bubble_id=${this.data.bubble._id}` });
  },

  randomBubble() {
    this.getBubble();
  },

  getBubbleTxt(tag) {
    const txts = ['生气', '快乐', '伤心', '烦躁', '苦恼', '纠结'];
    return txts[tag];
  },

  giveFive() {
    this.setData({
      bubble: { ...this.data.bubble,like_count: this.data.bubble.like_count + 1 },
    });
  },

  getBubble() {
    this.setData({ isFishing: true }, () => {
      dbRequests.getLuckyBubble().then((res) => {
        dbRequests.getComments(res._id).then((comments) => {
          this.setData({
            isFishing: false,
            bubble: { ...res, comments, tag: parseInt(res.tag, 10), tagName: this.getBubbleTxt(res.tag), isPositive: res.tag === 1 },
          });
        });
      }).catch(() => {
        wx.showToast({
          title: '获取失败',
          icon: 'success',
          duration: 2000
        })
        this.setData({
          isFishing: false,
        });
      });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.getBubble();
  },
});
