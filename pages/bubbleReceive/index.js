// pages/bubble/bubbleFishing.js
import { dbRequests } from '../../requests/request';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    bubble: {
      title: '谁来安慰安慰我～',
      url: 'http://yss.yisell.com/yisell/ybys2018050819052088/sound/yisell_sound_2014031622091974505_88366.mp3',
      level: 3,
      tag: 1,
      tagName: '开心',
      isPositive: false,
      comments: [1, 2, 3],
      like_count: 3,
      user: {
        username: '布丁',
        avatar: '../../img/avatar/user2.png',
      },
    },
  },

  goReply() {
    wx.navigateTo({ url: '../bubbleDetail/index' });
  },

  randomBubble() {
    console.log('randomBubble');
  },

  getBubbleTxt(tag) {
    const txts = ['生气', '快乐', '伤心', '烦躁', '苦恼', '纠结'];
    return txts[tag];
  },

  giveFive() {
    console.log('giveFive');
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
    dbRequests.getLuckyBubble({}).then((res) => {
      this.setData({
        bubble: res,
      });
      console.log(res);
    }).catch(() => {
      wx.showModal({
        title: '获取失败',
        showCancel: false,
      });
    });
  },
});
