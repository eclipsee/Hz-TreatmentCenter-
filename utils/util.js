import Constant from '../constants/constants.js';

/**业务无关工具类 */
const app = getApp();
const logger = app.logger;
// 格式化日期为 yyyy/MM/dd hh:MM:ss格式
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

// 格式化数字，例如将个位数1格式化为01
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 将秒数转换为hh:MM:ss的时间格式
const formatSeconds = seconds => {
  seconds = Math.floor(seconds);
  let hour = Math.floor(seconds / (60 * 60));
  let minute = Math.floor((seconds - hour * 60 * 60) / 60);
  let second = Math.round((seconds - hour * 60 * 60) % 60);
  if (hour > 0) {
    return [hour, minute, second].map(formatNumber).join(':');
  } else {
    return [minute, second].map(formatNumber).join(':');
  }
}
// hh:MM:ss的时间格式转化为秒数
const parseSeconds = seconds => {
  let arr = seconds.split(':');
  if (arr.length > 2) {
    return parseInt(arr[0]) * 3600 + parseInt(arr[1]) * 60 + parseInt(arr[2])
  } else if (arr.length = 2) {
    return parseInt(arr[0]) * 60 + parseInt(arr[1]);
  }
  return 0;
}
// 获取节点信息
const getRect = (id, callback) => {
  wx.createSelectorQuery().select(id).boundingClientRect(function (rect) {
    rect.id      // 节点的ID
    rect.dataset // 节点的dataset
    rect.left    // 节点的左边界坐标
    rect.right   // 节点的右边界坐标
    rect.top     // 节点的上边界坐标
    rect.bottom  // 节点的下边界坐标
    rect.width   // 节点的宽度
    rect.height  // 节点的高度
  }).exec(function (res) {
    if (isFunction(callback)) {
      callback(res);
    }
  })
}
// 判断是否为function
const isFunction = fn => {
  return typeof (fn) === 'function' ? true : false
}

// 将日期转换为 **月**日 星期* 格式
const formatDate = date => {
  let dayDesc = '';
  switch (date.getDay()) {
    case 1: dayDesc = '星期一'; break;
    case 2: dayDesc = '星期二'; break;
    case 3: dayDesc = '星期三'; break;
    case 4: dayDesc = '星期四'; break;
    case 5: dayDesc = '星期五'; break;
    case 6: dayDesc = '星期六'; break;
    case 0: dayDesc = '星期日'; break;
  }
  return `${date.getMonth() + 1}月${date.getDate()}日 ${dayDesc}`;
}
// toast弹框
const showToast = content => {
  wx.showToast({
    title: content,
    icon: 'none'
  })
}

const loginApp = (sucessCallback, detail) => {
  var _this = this;
  wx.showLoading({
    title: '数据加载中',
  })
  wx.login({
    success: res => {
      var js_code = res.code;
      var _data = {}
      if (detail) {
        wx.getUserInfo({
          success: function (res) {
            var encryptedData = res.encryptedData
            var iv = res.iv
            _data = {
              appid: Constant.APP_ID,
              encryptedData: encryptedData,
              iv: iv,
              js_code: js_code
            }
            wx.request({
              url: Constant.ACESS_URL,
              method: "get",
              header: {
                "Content-Type": "application/json"
              },
              data: _data,
              success: function (res) {
                if (res.statusCode == 200) {
                  // console.log("res.data.ret", res.data.ret)
                  if (res.data.ret == 0){
                    let uid = res.data.uid;
                    let token = res.data.token;
                    app.globalData.Authorization = uid + "&" + token;
                    wx.setStorage({
                      key: "Authorization",
                      data: uid + "&" + token,
                    })
                    wx.setStorage({
                      key: "nickName",
                      data: detail.userInfo.nickName,
                    })
                    wx.setStorage({
                      key: "avatarUrl",
                      data: detail.userInfo.avatarUrl,
                    })
                    app.globalData.isLogin = true;
                    wx.setStorage({
                      key: "openid",
                      data: res.data.openId,
                    })
                    app.globalData.openid = res.data.openId
                    getOpenGid(sucessCallback, res.data.openId)
                  }else{
                    let message = {
                      'msg': 'login ret != 0',
                      'res': res
                    }
                    logger.error(message);
                  }
                } else {
                  wx.hideLoading()
                  wx.showToast({
                    title: Constant.LOGINERROR,
                    icon: "none"
                  });
                }
              },
              fail: function (err) {
                wx.hideLoading()
                let message = {
                  'msg': 'login  failed',
                  'err': err
                }
                logger.error(message);
              },
              complete: function () {
                // wx.hideLoading();
              }
            })
          }
        })
      } else {
        _data = {
          appid: Constant.APP_ID,
          js_code: js_code
        }
        wx.request({
          url: Constant.ACESS_URL,
          method: "get",
          header: {
            "Content-Type": "application/json"
          },
          data: _data,
          success: function (res) {
            if (res.statusCode == 200) {
              // let uid = res.data.uid;
              // let token = res.data.token;
              // console.log(res)
              // console.log("res.data.ret", res.data.ret)
              if (res.data.ret == 0) {
                wx.setStorageSync({
                  key: "openid",
                  data: res.data.openId,
                })
                app.globalData.openid = res.data.openId
                var openid = wx.getStorageSync('openid')
                getOpenGid(sucessCallback, openid)
              } else {
                let message = {
                  'msg': 'login ret != 0',
                  'res': res
                }
                logger.error(message);
              }
            } else {
              wx.hideLoading()
              wx.showToast({
                title: Constant.LOGINERROR,
                icon: "none"
              });
            }
          },
          fail: function (err) {
            wx.hideLoading()
            // reject(err);
            let message = {
              'msg': 'login failed',
              'err': err
            }
            logger.error(message);
          },
          complete: function () {
            // wx.hideLoading();
          }
        })
      }
    }
  })
}

const getOpenGid = (sucessCallback,openid) => {
  if (app.globalData.shareTicket) {
    wx.getShareInfo({
      shareTicket: app.globalData.shareTicket,
      success: function (res) {
        var encryptedData = res.encryptedData;
        var iv = res.iv;
        // console.log("openid", openid)
        wx.request({
          url: Constant.DECRYPT_URL,
          method: "get",
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            appId: Constant.APP_ID,
            encryptData: encryptedData,
            iv: iv,
            openId: openid
          },
          success: function (res) {
            // console.log("count", app.globalData.count)
            if (res.data.gotoLogin) {
              if (app.globalData.count == '0'){
                loginApp(sucessCallback);
                app.globalData.count = '1';
              }else{
                wx.hideLoading()
                wx.showModal({
                  title: '提示',
                  content: Constant.SIGN_ERROR_MODEL,
                  showCancel: false,//是否显示取消按钮
                  cancelColor: '#333',//取消文字的颜色
                  confirmColor: '#333',//确定文字的颜色
                  success: function (res) {
                    loginApp(sucessCallback);
                  },
                  fail: function (res) { },//接口调用失败的回调函数
                  complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
                })
              }
            } else {
              var data = JSON.parse(res.data.data)
              sucessCallback(data.openGId)
              app.globalData.openGid = data.openGId;
            }
          },
          fail: function (err) {
            wx.hideLoading()
            let message = {
              'msg': 'getopenGid failed',
              'err': err
            }
            logger.error(message);
          },
          complete: function () {
            // wx.hideLoading();
          }
        })
      }
    })
  } else {
    sucessCallback()
  }
}

function wrapFn(page, fnName, innerFn) {
  var fn = page[fnName] || function () { }
  page[fnName] = function () {
    fn.call(page, arguments)
    innerFn.call(page, arguments)
  }
}

function jumpTo(options) {
  var url = options.url || "";
  var to = (url.match(/.+\/(\w+)/i) || ['index', 'index'])[1];
  var pages = getCurrentPages();
  var i = 0;
  while (pages[i] && pages[i].type !== to) {
    i++;
  }
  //已有页面在栈里，返回
  if (i < pages.length - 2 && to !== "albumDetail") {
    var delta = pages.length - 1 - i;
    wx.navigateBack({
      delta: delta
    });
    return;
  }
  //是当前页，刷新当前页
  if (i === pages.length - 1) {
    wx.redirectTo({
      url: url
    });
    return;
  }
  //如果页面数已经大于上线，怎重定向
  if (pages.length >= 5) {
    wx.redirectTo({
      url: url
    });
    return;
  }
  wx.navigateTo({
    url: url
  });
}

function inherits(ctor, superCtor) {

  if (ctor === undefined || ctor === null)
    throw new TypeError('The constructor to "inherits" must not be ' +
      'null or undefined');

  if (superCtor === undefined || superCtor === null)
    throw new TypeError('The super constructor to "inherits" must not ' +
      'be null or undefined');

  if (superCtor.prototype === undefined)
    throw new TypeError('The super constructor to "inherits" must ' +
      'have a prototype');

  ctor.super_ = superCtor;
  Object.setPrototypeOf(ctor.prototype, superCtor.prototype);
};

function formatDuration(time = 0) {
  var seconds = parseInt(time % 60) >= 10 ? parseInt(time % 60) : '0' + parseInt(time % 60);
  var minutes = parseInt(time / 60 % 60) >= 10 ? parseInt(time / 60 % 60) : '0' + parseInt(time / 60 % 60);
  var hours = parseInt(time / 3600 % 24);
  if (hours != 0) {
    return (hours + ':' + minutes + ':' + seconds);
  } else {
    return (minutes + ':' + seconds);
  }
}

export default {
  formatTime,
  getRect,
  isFunction,
  formatSeconds,
  parseSeconds,
  formatDate,
  showToast,
  loginApp,
  getOpenGid,
  wrapFn,
  jumpTo,
  inherits,
  formatDuration
}
