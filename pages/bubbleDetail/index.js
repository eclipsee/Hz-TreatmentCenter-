import jokes from '../../data/joke';

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
    user: {
      username: 'lizifen',
      avatar: testAvatar,
    },
    bubble: {
      title: '分手求安慰',
      url: testUrl,
      duration: 10,
      tag: 1, // 1, 开心，2，悲伤，3，愤怒，4，语音回复，5，治愈音
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
      music: [{ name: '分手快乐', title: '你是TA永远得不到的爸爸', content: '分手快乐祝你快乐你可以找到更好的' }],
      joke: jokes,
      cure: [{ name: '小海豚治愈不开心', title: '花莲海豚叫声', url: 'http://yss.yisell.com/yisell/ybys2018050819052088/sound/yisell_sound_2014031622091974505_88366.mp3' }],
    },
  },

  randomReplay() {
    if (this.data.replyType === 'voice') return {};
  
    const options = this.data.library[this.data.replyType];
    
    const randomseed = options.length;
    const index = Math.ceil(1 + Math.random() * randomseed);

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
      this.setData({ replyType: type, isExpand: true }, () => {
        this.randomReplay();
      });
    }
  },
});
