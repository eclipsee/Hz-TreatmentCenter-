/**业务相关的工具类*/

import API from '../requests/api/api.js';
import Constant from '../constants/constants.js';

/**
 * 判断课程是否下架，已下架返回true，未下架返回false
 */
const courseOffConfirm = courseId => {
    let confirmFlag = {};
    API.courseOffConfirm({courseId:courseId}).then(res=>{
      confirmFlag.flag = true;
    },err=>{
      confirmFlag.flag = false;
    })
    while(confirmFlag.flag == undefined){

    }
    return confirmFlag.flag;
}


export default {
  courseOffConfirm
}