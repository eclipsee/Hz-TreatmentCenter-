import joke from '../../data/joke';
import music from '../../data/music';
import cure from '../../data/voice';

const testUrl = 'http://yss.yisell.com/yisell/ybys2018050819052088/sound/yisell_sound_2014031622091974505_88366.mp3';
const testAvatar = 'http://img.wxcha.com/file/201807/13/9bbc369f6e.jpg';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isExpand: false,
    replyType: '',
    currentReplay: {},
    recordSecond: '00',
    recordStatus: '0',
    recordMinute: '00',
    user: {
      username: 'lizifen',
      avatar: testAvatar,
    },
    bubble: {
      title: '分手求安慰',
      url: testUrl,
      duration: 10,
      tag: 1,
    },
    comments: [
      { user: { username: 'lizifen', avatar: testAvatar }, bubble: { url: testUrl, duration: 10, comment_type: 1, tag: 6 } },
      { user: { username: 'lizifen', avatar: testAvatar }, bubble: { url: testUrl, duration: 10, comment_type: 2, tag: 6 } },
      { user: { username: 'lizifen', avatar: testAvatar }, isSelf: true, bubble: { url: testUrl, duration: 10, comment_type: 3, tag: 6 } },
    ],
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
});
