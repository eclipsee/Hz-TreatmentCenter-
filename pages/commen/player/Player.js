const app = getApp();

import Util from "../../../utils/pureUtil.js";;
function Player(page) {
  this.prefix = '_player_';
  this.init(page);
}
Player.prototype.init = function (page) {
  this.wrapFns(page);
  this.appendEvents(page);
  this.bindEvents(page);
  this.initData(page);
};
Player.prototype.initData = function (page) {
  var player = app.player;
  var prefix = this.prefix;
  var data = {};
  page.setData({
    'player.tapPlayBtn': prefix + 'tapPlayBtn',
    'player.touchMove':prefix + 'touchMove',
    'player.hidden':true,
    'player.state':null
  });
};
Player.prototype.wrapFns = function (page) {
  var self = this;
  Util.wrapFn(page, 'onHide', function () {
    page.setData({
      'play.state':null
    });
  });
  Util.wrapFn(page, 'onShow', function () {
    self.setHiddenOrShow(page);
    page.setData({
      'play.state':null
    })
  });
  Util.wrapFn(page, 'onUnload', function () {
    page.setData({
      'play.state':null,
      'player.hidden': true
    });
    self.unBindEvents(page);
  });
};

Player.prototype.setHiddenOrShow = function(page){
  let hidden = true;
  if (!Util.checkPageExist("learning")) {
    // if(page.type === 'todayTask' || page.type === 'lessonDetails'){
      if(app.globalData.item){
        hidden = false;
        page.setData({
          'player.coverUrl': app.globalData.item.coverUrl
        })
        
      } else {
        hidden = true;
      }
    // }
  } else {
    hidden = false;
  }
  page.setData({
    "player.hidden":hidden
  })
}
Player.prototype.appendEvents = function (page) {
  var prefix = this.prefix;
  var player = app.player;
  page[prefix + 'tapPlayBtn'] = function (event) {
    // if(player.state){
    //   if(player.state.status === 1){
    //     player.pause();
    //     return;
    //   } 
    //   if(player.state.status === 0){
    //     player.play();
    //     return;
    //   }
    //   if(player.state.status === 2 && player.soundInfo && player.soundInfo.src){
    //     player.play();
    //     return;
    //   }
    // }
    wx.setStorageSync("item2", JSON.stringify(app.globalData.item));
    Util.jumpTo({
      url: `/pages/learning/learning?key=item2&&fromPage=${page.type}`
    })
  };
 
  page[prefix + 'playerStateChange'] = function (state) {
    page.setData({
      'player.state': state,
      'player.sound':player.soundInfo
    });
  };

  page[prefix + 'soundchange'] = function (sound) {
    // page.setData({
    //   'player.sound': sound
    // });
  };
  page[prefix + 'inPause'] = function (inStart) {
    page.setData({
      'player.state': null
    });
  };
  page[prefix + 'inEnd'] = function (inEnd) {
    // page.setData({
    //   'player.inEnd': inEnd
    // });
  };
  page[prefix + 'inStop'] = function (state) {
    page.setData({
      'player.state':null
    });
  };
  page[prefix + 'touchMove'] = function(event){
    wx.setStorage({
      key: 'moveLeft',
      data: event.touches[0].pageX * 2 - 56
    })
    wx.setStorage({
      key: 'moveTop',
      data: event.touches[0].pageY * 2 - 56,
    })
    this.setData({
      "player.moveLeft":event.touches[0].pageX * 2 -56,
      "player.moveTop":event.touches[0].pageY * 2 - 56
    })
  }
};
Player.prototype.unBindEvents = function (page) {
  var player = app.player;
  var prefix = this.prefix;
  player.removeListener('playerStateChange', page[prefix + 'playerStateChange']);
  player.removeListener('soundchange', page[prefix + 'soundchange']);
  player.removeListener('inEnd', page[prefix + 'inEnd'])
  player.removeListener('pause', page[prefix + 'inPause']);
  player.removeListener('stop', page[prefix + 'inStop'])
};
Player.prototype.bindEvents = function (page) {
  var player = app.player;
  var prefix = this.prefix;
  player.on('playerStateChange', page[prefix + 'playerStateChange']);
  player.on('soundchange', page[prefix + 'soundchange'])
  player.on('inEnd', page[prefix + 'inEnd'])
  player.on('pause', page[prefix + 'inPause'])
  player.on('stop', page[prefix + 'inStop'])
};
module.exports = Player;

