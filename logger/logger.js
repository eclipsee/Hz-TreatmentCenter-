import Constant from '../constants/constants.js';
var xbossdebug = require('xbossdebug.min.js');
initLogger(xbossdebug);

class Logger {
  /**
   * 调用Logger里面的日志方法，如果在app.js中，建议把app作为参数，这样可以打印全局变量里的用户信息；其他地方调用不需要此参数，可以通过getApp()获取到
   */
  log(msg, app) {
    xbossdebug.log(convertMessage(msg, app));
  }
  debug(msg, app) {
    xbossdebug.debug(convertMessage(msg, app));
  }
  info(msg, app) {
    xbossdebug.info(convertMessage(msg, app));
  }
  warn(msg, app) {
    xbossdebug.warn(convertMessage(msg, app));
  }
  error(msg, app) {
    xbossdebug.error(convertMessage(msg, app));
  }
}

function initLogger(xbossdebug) {
  xbossdebug.config.key = 'xmkp-checkin';// key为自定义唯一值，用于后端记录时区分应用
  xbossdebug.config.url = Constant.BASE_URL + '/log';// 上报服务端地址
  xbossdebug.config.setSystemInfo = true; // 获取系统信息
}

function convertMessage(msg, app) {
  // 获取当前的app对象，如果在app.js调用此方法，获取到的是undefined
  let currentApp = getApp();
  let msgObject = convertObject(msg);
  if (!currentApp) {
    // 参数也没有app对象，不打印全局变量里的用户信息
    if (!app) {
      return msgObject;
    }
    currentApp = app;
  }
  msgObject.auth = currentApp.globalData.Authorization;
  msgObject.openid = currentApp.globalData.openid;
  return msgObject;
}

function convertObject(msg) {
  if (typeof(msg) == 'string') {
    return {
      'msg': msg
    }
  }
  return msg;
}

const logger = new Logger();

export default logger;