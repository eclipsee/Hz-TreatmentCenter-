var EventEmitter = require('../../../utils/EventEmitter.js');
import pureUtil from '../../../utils/pureUtil';
var app = getApp();
var manager = null;
function XMPlayer(options) {
  manager = wx.getBackgroundAudioManager();
  this.options = {
    getPlayerStateStep: 1000
  };
  Object.assign(this.options,options);
  this.bindEvents();
}

XMPlayer.prototype = {
  play: function(){
    try{
      if(manager.src === this.soundInfo.dataUrl){
        manager.play();
      } else {
        // manager.title = this.soundInfo.title || ''
        // manager.coverImgUrl = this.soundInfo.coverImgUrl
        // manager.src = this.soundInfo.dataUrl
        // audioManager.webUrl = "http://m.ximalaya.com/share/sound/" + trackI
        manager.title = this.soundInfo.title || ''
        manager.epname = ''
        manager.singer = ''
        manager.coverImgUrl = this.soundInfo.coverImgUrl || ''
        manager.src = this.soundInfo.dataUrl
      }
    }catch(e){
      // 关闭因为连续切换声音而提示地址不可播放的错误
      console.log("play error");
    }
  },
  pause: function() {
    try{
     manager.pause();
    }catch(e){
      console.log("pause error");
    }
  },
  stop:function(){
    try {
      manager.seek(0);
      manager.pause();
      this.emit("end");
    } catch (e) {
      console.log("stop error");
    }
  },
  setSoundInfo:function(soundInfo){
    this.soundInfo = soundInfo
  },
  clearSoundInfo: function (soundInfo) {
    manager.title = this.soundInfo.title || ''
    manager.coverImgUrl = this.soundInfo.coverImgUrl
    manager.src = this.soundInfo.dataUrl
  },
  seek: function(position){
    var self = this;
    try{
      manager && manager.seek(position);
    }catch(e){
      console.log("play error");
    }
  },
  getState: function () {
    /******************2018-06-12 更换成    backgroundAudioManager**********************/
    const {
      duration,
      currentTime: currentPosition,
      paused,
      src,
      startTime,
      buffered,
      title,
      epname,
      singer,
      coverImgUrl,
      webUrl
    } = manager
    const res = {
      duration,
      currentPosition,
      paused,
      src,
      startTime,
      buffered,
      title,
      epname,
      singer,
      coverImgUrl,
      webUrl,
      soundId:this.soundInfo.soundId
    }
    res.calcCurrentPosition = pureUtil.formatDuration(res.currentPosition) || 0
    return res
  },

  bindEvents: function () {
    var self = this;
    var lastPlayerState = {};
    var lastSoundSrc;
    manager && manager.onPlay(function (e) {
      console.log('play');
      self.emit('play', self.soundInfo, e);
      if (lastSoundSrc !== self.soundInfo.src) {
        lastSoundSrc = self.soundInfo.src;
      }
    });
    manager && manager.onPause(function (e) {
      console.log('pause');
      console.log(e);
      let soundSrc = self.soundInfo.src;
      self.emit('pause', self.soundInfo, e);
    });
    manager && manager.onStop(function (e) {
      console.log('stop');
      console.log(e);
      let soundSrc = self.soundInfo.src;
      self.emit('stop', e);
    });
    manager && manager.onTimeUpdate(function(){
      const res = self.getState();
      self.emit('playerStateChange', res);
    })
    manager && manager.onError(function(err){
      console.log(err);
      self.emit('error',err);
    })
    manager && manager.onEnded(function(e){
      console.log("ended")
      self.emit("end",e);
      //  manager.src =  "http://fdfs.test.ximalaya.com/group1/M01/52/3A/wKgDplwh_oCAKoZ1ABwI_G26spg242.m4a";
      // manager.src ="http://fdfs.test.ximalaya.com/group1/M01/52/3A/wKgDplwh_oCAKoZ1ABwI_G26spg242.m4a";
      manager.title = self.soundInfo && self.soundInfo.title;
      manager.coverImgUrl = self.soundInfo && self.soundInfo.coverImgUrl;
      manager.src = self.soundInfo && self.soundInfo.dataUrl;
      setTimeout(function(){
        manager.pause();
      },500);
    })
  },
}

pureUtil.inherits(XMPlayer, EventEmitter);
module.exports = XMPlayer;