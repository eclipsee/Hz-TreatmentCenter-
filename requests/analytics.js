/** 所有埋点统一管理 */
// next_title_or_submit 下一题&查看作业解析-作业页
const nextTitleOrSubmit = params => {
  wx.reportAnalytics('next_title_or_submit', {
    srcpage:'作业页',
    srcmodule:'bottomTool',
    item:'button',
    itemid:params.itemId,
    lessonid:params.courseId,
    workid:params.taskId
  });
}
// show_question_page 作业页面露出	
const showQuestionPage = params => {
  wx.reportAnalytics('show_question_page', {
    item:'作业页',
    lessonid:params.courseId,
    workid:params.taskId
  });
}
// next_chapter_or_start_work 下一章&开始作业-课程学习页	
const nextChapterOrStartWork = params  => {
  wx.reportAnalytics('next_chapter_or_start_work', {
    srcpage:'课程学习页',
    srcmodule:'任务列表',
    item:'button',
    itemid:params.itemId,
    lessonid:params.courseId,
    taskid:params.taskId
  });
}
// show_learning_page 课程学习页露出
const showLearningPage = params => {
  wx.reportAnalytics('show_learning_page', {
    item:'课程学习页',
    lessonid:params.courseId,
    taskid:params.taskId
  });
}
// todo_task 查看任务&作业-今日任务页	
const todoTask = params => {
  wx.reportAnalytics('todo_task', {
    srcpage:'今日任务页',
    srcmodule:'课程章节',
    item:params.item,
    itemid:params.taskId,
    lessonid:params.courseId
  });
}
// look_course_detail 查看课程详情-今日任务页	
const lookCourseDetail = params => {
  wx.reportAnalytics('look_course_detail', {
    srcpage:'今日任务页',
    srcmodule:'课程卡片',
    item:'lesson',
    itemid:params.courseId
  });
}
// show_today_task 今日任务页面露出	
const showTodayTask = params => {
  wx.reportAnalytics('show_today_task', {
    item:'今日任务页',
    lessonid:params.courseId
  });
}

export default {
  nextTitleOrSubmit,
  showQuestionPage,
  nextChapterOrStartWork,
  showLearningPage,
  todoTask,
  lookCourseDetail,
  showTodayTask
}


