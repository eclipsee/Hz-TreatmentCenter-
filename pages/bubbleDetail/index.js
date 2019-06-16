import joke from '../../data/joke';
import music from '../../data/music';
import cure from '../../data/voice';
import { dbRequests } from '../../requests/request';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    bubbleId: '',
    isExpand: false,
    replyType: '',
    currentReplay: {},
    recordSecond: '00',
    recordStatus: '0',
    recordMinute: '00',
    user: {},
    bubble: {},
    comments: [],
    replyTypes: [
      { name: '语音', value: 'voice', icon: '../../img/icons/voice.png' },
      { name: '歌曲', value: 'music', icon: '../../img/icons/music.png' },
      { name: '段子', value: 'joke', icon: '../../img/icons/joke.png' },
      { name: '治愈音', value: 'cure', icon: '../../img/icons/dog.png' },
    ],
    library: {
      music,
      joke,
      cure,
    },
  },

  randomReplay() {
    if (this.data.replyType === 'voice') return;
  
    const options = this.data.library[this.data.replyType];
    
    const index = Math.floor(1 + Math.random() * (options.length - 1));

    this.setData({ currentReplay: options[index] });
  },

  changeType(e) {
    const { type } = e.currentTarget.dataset;
    if (type === 'more') {
      wx.showModal({
        title: '提示',
        content: '此处功能可以无限拓展',
        success() {},
      });
    } else if (type === 'close')  {
      this.setData({ isExpand: false });
    } else {
      this.setData({
        recordSecond: '00',
        recordStatus: '0',
        recordMinute: '00',
        replyType: type,
        isExpand: true,
      }, () => {
        this.randomReplay();
      });
    }
  },
  onReqErr() {
    wx.showModal({
      title: '获取失败',
      showCancel: false,
    });
  },
  getBubble(id) {
    dbRequests.getBubble(id).then((bubble) => {
      this.setData({
        user: {
          username: bubble.user_name,
          avatar: bubble.avatar,
        },
        bubble: {
          ...bubble,
          duration: 10,
        },
      });
    }).catch(this.onReqErr);
  },
  getComments(id) {
    dbRequests.getComments(id).then((res) => {
      this.setData({
        comments: res.map(item => ({
          ...item,
          isSelf: item.user_id === wx.getStorageSync('uid'),
          bubble: {
            url: item.sound_url,
            duration: 10,
            tag: item.tag,
          },
        })),
      });
    }).catch(this.onReqErr);
  },
  addcomment(e) {
    dbRequests.addBubbleComment({
      user_id: wx.getStorageSync('uid'),
      user_name: wx.getStorageSync('user_name'),
      avatar: wx.getStorageSync('avatar'),
      bubble_id: this.data.bubble._id,
      comment_type: this.data.replyType, // voice music joke cure
      sound_url: e.detail.url,
    }).then(() => {
      wx.showToast({
        title: '发送成功',
        icon: 'success',
        duration: 2000,
      });
      this.getComments(this.data.bubbleId);
      this.setData({
        isExpand: false,
      });
    }).catch(() => {
      wx.showModal({
        title: '获取失败',
        showCancel: false,
      });
    });
  },
  onLoad(options) {
    this.setData({
      bubbleId: options.bubble_id,
    });
    this.getBubble(options.bubble_id);
    this.getComments(options.bubble_id);
  },
});
