import Promise from "../utils/es6-promise.min";
import Util from "../utils/util";
import Constant from "../constants/constants.js";
import Exception from "../constants/exceptions.js";
const app = getApp();

/**
 * request
 * @param  {String} [method='GET'] [description]
 * @param  {[type]} header         [description]
 * @return {[type]}                [description]
 */

export const request = (method = "GET") => (url, data, loadFlag=true, errTip=true, dealUnlogin=true) => {
  return new Promise((resolve, reject) => {
    let header = {
          'Authorization': app.globalData.Authorization || '',
            'content-type': (method == 'POST') ? 'application/json' : 'application/x-www-form-urlencoded',
    };
    
    if (loadFlag) {
      wx.showLoading({
        title: Constant.LOADING_TIP
      });
    }
    wx.request({
      url: Constant.BASE_URL + url,
      data,
      method,
      header: header,
      success: function(res) {
        if(res && res.statusCode == 401 && dealUnlogin){
			wx.clearStorage();
			// wx.showToast({
			// 	title: '请到个人中心登录',
			// 	icon: 'none'
			// })
			wx.showModal({
                title: '提示',
                showCancel: false,
                content: Constant.LOGIN_OUT_OF_DATE_MODEL,
                confirmText: "去登录",
                success: function (res) {
                    if (res.confirm) {
                        wx.switchTab({
							url: '/pages/personalCenter/my'
						})
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
			return false;
        }
        if(res){
          if (res.statusCode == Exception.SUCCESS) {
            resolve(res);
          } else {
            reject(res);
            if (errTip) {
              wx.showToast({
                title: Constant.SERVER_ERROR_TIP,
                icon: "none"
              });
            }
          }
        }
      },
      fail: function(err) {
        // console.log(res.statusCode,2);
        console.log(err);
        reject(err);
      },
      complete: function() {
        wx.hideLoading()
      }
    });
  });
};

export const get = request("GET");
export const post = request("POST");
export const put = request("PUT");
export const del = request("DELETE");
