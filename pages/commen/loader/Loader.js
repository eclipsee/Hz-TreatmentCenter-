const app = getApp();

import Util from "../../../utils/pureUtil.js";;
function Loader(page) {
  this.prefix = '_Loader_';
  this.init(page);
}
Loader.prototype.init = function (page) {
  this.wrapFns(page);
  this.appendEvents(page);
  this.bindEvents(page);
  this.initData(page);
};
Loader.prototype.initData = function (page) {
  var prefix = this.prefix;
  var data = {};
  page.setData({
    'loader.hidden':true
  });
};
Loader.prototype.wrapFns = function (page) {
  var self = this;
  Util.wrapFn(page, 'onHide', function () {
    page.setData({
    });
  });
  Util.wrapFn(page, 'onShow', function () {
    // self.setHiddenOrShow(page);
    page.setData({
    })
  });
  Util.wrapFn(page, 'onUnload', function () {
    page.setData({
    });
    self.unBindEvents(page);
  });
};

Loader.prototype.hide = function(page){
  page.setData({
    "loader.hidden":true
  })
}
Loader.prototype.show = function (page) {
  page.setData({
    "loader.hidden": false
  })
}
Loader.prototype.appendEvents = function (page) {
  let prefix = this.prefix;
  page[prefix + 'tapPlayBtn'] = function (event) {
  };
};
Loader.prototype.unBindEvents = function (page) {
};
Loader.prototype.bindEvents = function (page) {
};
module.exports = Loader;

