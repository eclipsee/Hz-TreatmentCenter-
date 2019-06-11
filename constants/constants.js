/*
正式环境
*/
// //API请求基址
const BASE_URL = 'https://daka.ximalaya.com/checkin/api/v1'

// // 登录主站获取Token的地址
const ACESS_URL = "https://mobile.ximalaya.com/passport-sign-mobile/ws/access";
const DECRYPT_URL = "https://mobile.ximalaya.com/passport-sign-mobile/ws/decrypt";

// // 文件上传地址
const UPLOAD_PICTURE = "https://upload.ximalaya.com/dtres/attachment/upload";
const UPLOAD_VIDEO = "https://upload.ximalaya.com/dtres/video/upload";
const UPLOAD_AUDIO = "https://upload.ximalaya.com/dtres/audio/upload";
/*
测试环境
*/ 
 // API请求基址
// const BASE_URL = 'https://wxeco.test.ximalaya.com/checkin/api/v1'

// // 登录主站获取Token的地址
// const ACESS_URL = "https://mobile.test.ximalaya.com/passport-sign-mobile/ws/access";
// const DECRYPT_URL = "https://m.test.ximalaya.com/passport-sign-mobile/ws/decrypt";

// // 文件上传地址
// const UPLOAD_PICTURE = "https://upload.test.ximalaya.com/dtres/attachment/upload";
// const UPLOAD_VIDEO = "https://upload.test.ximalaya.com/dtres/video/upload";
// const UPLOAD_AUDIO = "https://upload.test.ximalaya.com/dtres/audio/upload";

// 小程序 APPID
const APP_ID = 'wx1a95b0a2ef72071f';
// const APP_ID = 'wxae22a70370ceb103'; 


// 文案提示（TOST提示）
const LESSON_LOCKED_TIP = '请先完成之前的任务';
const QUIZ_LOCKED_TIP = '还未到学习时间';
const TITLE_NOT_FINISHED_TIP = '请先完成此题';
const PLEASE_LOGIN_TIP = '请到个人中心登录';
const SERVER_ERROR_TIP = '请稍后再试';
const LOADING_TIP = '数据加载中';
const LOGINERROR = '登录失败，请重新点击按钮'
const BREAK_LOCKED_TIP = '闯过前面的关卡才能挑战当前关卡哦'
const BREAK_LOCKED_TIP_NO = '每天最多学习1个关卡哦'



// 模态框内的提示
const COURSE_OFF_MODAL = '抱歉，该课程已经下架';
const QUESTION_QUIT_MODAL = '退出后答题进度将清空，请确认';
const SIGN_ERROR_MODEL = '登录失败，点击确定按钮重新登录';
const LOGIN_OUT_OF_DATE_MODEL = '登录信息过期';

export default {
  BASE_URL,
  QUIZ_LOCKED_TIP,
  LESSON_LOCKED_TIP,
  TITLE_NOT_FINISHED_TIP,
  PLEASE_LOGIN_TIP,
  SERVER_ERROR_TIP,
  LOADING_TIP,
  COURSE_OFF_MODAL,
  QUESTION_QUIT_MODAL,
  SIGN_ERROR_MODEL,
  LOGIN_OUT_OF_DATE_MODEL,
  APP_ID,
  ACESS_URL,
  DECRYPT_URL,
  LOGINERROR,
  UPLOAD_PICTURE,
  UPLOAD_VIDEO,
  UPLOAD_AUDIO,
  BREAK_LOCKED_TIP,
  BREAK_LOCKED_TIP_NO
}