import { get, post } from "../request.js";

// 接口API在此处编写
// 例 获取我的所有课程信息
const getMyCourse = params => {
  return get("/course/my", params);
};
//个人中心
const getCourseCount = params => {
  return get("/user", params);
};

//课程详情(日历页)
const getCourseDetail = params => {
  return get(`/course/my/${params.courseId}/full`, params);
};

// 根据课程id获取课程信息
const getMyCourseById = params => {
  return get(`/course/my/${params.courseId}/full`, params);
};

// 获取课程详情（报名页）
const getMySignCourse = params => {
  return get(`/course/my/${params.courseId}`, params);
};

// 获取我的今日任务
const getMyTodayTask = (params,loadFlag) => {
  return get("/course/my/today", params,loadFlag);
};

// 提交已完成任务
const submitTask = (params, loadFlag = true, errTip) => {
  return post(`/course/${params.courseId}/task/result`, params, loadFlag, errTip);
};

// 课程打卡
const checkIn = params => {
  return post("/course/checkin", params);
};
//打卡分享
const checkInShare = (params, loadFlag) => {
  return get(`/course/${params.courseId}/share`, params, loadFlag);
};

//小程序码
// const wechatQrcode = (params, loadFlag) => {
//   return get('/wechat/miniprogramQr', params, loadFlag)
// }
//服务号二维码
const seiviceQrcode = (params, loadFlag) => {
  return get('/qrCode', params, loadFlag)
}
//课程报名
const courseEnroll = (params, loadFlag = true, errTip = false) => {
  return post(`/course/${params.courseId}/enroll`, params, loadFlag, errTip, false)
}
//绑定群
const addGroup = (params,loadFlag) => {
  return post(`/course/${params.courseId}/addWxGroup?openGid=` + params.openGid, params, loadFlag)
}

// 确认课程是否下架
const courseOffConfirm = (params) => {
  return post(`/course/${params.courseId}/offConfirm`, params,false,false);
}

// 举报
const report = (params) => {
  return post('/course/report', params);
}

// 精选回答   /course/{courseId}/setting
const selectAnswer = (params, loadFlag) => {
  return get('/comment/essences', params, loadFlag)
}

//课程设置   /course/{courseId}/setting
const lessonSetting = (params, loadFlag) => {
  return get(`/course/${params.courseId}/setting`, params, loadFlag)
}
//设置课程   /course/{courseId}/setting
const setLesson = (params, loadFlag) => {
  return post(`/course/setting`, params, loadFlag)
}

//活动详情  /course/{ courseId } /activity
const activityDetail = (params, loadFlag) => {
  return get(`/course/${params.courseId}/activity`, params, loadFlag)
}
//挑战结果
const activityResult = (params, loadFlag) => {
  return get(`/course/${params.courseId}/activity/result`, params, loadFlag)
}
//提交手机号
const activityPhone = (params, loadFlag) => {
  return post(`/course/activity/authorization`, params, loadFlag)
}
//打卡分享统计  /course/checkin/share
const shareRecord = (params, loadFlag) => {
  return post(`/course/checkin/share`, params, loadFlag)
}

//判断是否有精选回答
const isHaveSelect = (params, loadFlag=false) => {
  return get(`/comment/essences/exist`, params, loadFlag)
}

//判断是否有精选回答
const singleLesson = (params, loadFlag = false) => {
  return get(`/course/${params.courseId}/item/${params.itemId}`, params, loadFlag)
}

export default {
  getMyCourse,
  getCourseCount,
  getCourseDetail,
  getMyCourseById,
  getMySignCourse,
  getMyTodayTask,
  submitTask,
  checkIn,
  checkInShare,
  courseEnroll,
  courseOffConfirm,
  report,
  seiviceQrcode,
  selectAnswer,
  addGroup,
  lessonSetting,
  setLesson,
  activityDetail,
  activityResult,
  activityPhone,
  shareRecord,
  isHaveSelect,
  singleLesson
};
