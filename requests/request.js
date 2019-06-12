import Promise from '../utils/es6-promise.min';
import { isFunction } from '../utils/util';
import {BASE_URL} from '../constants/constants.js';


/**
 * request
 * @param  {String} [method='GET'] [description]
 * @param  {[type]} header         [description]
 * @return {[type]}                [description]
 */
export const request = ({ method = 'GET' }) => (url, data, completeCallback) => {
  return new Promise((resolve, reject) => {
    let header = {
      'content-type': (method == 'POST') ? 'application/x-www-form-urlencoded' : 'application/json',
    };
    wx.request({
      url: BASE_URL + url,
      data,
      method,
      header: header,
      success: function (res) {
        resolve(res.data)
      },
      fail: function (err) {
        reject(err);
      },
      complete: function () {
        isFunction(completeCallback) && completeCallback();
      }
    });
  })
}

export const get = request('GET');
export const post = request('POST');
export const put = request('PUT');
export const del = request('DELETE');
