import API from '../../requests/api/api.js';
import Player from "../commen/player/Player.js";
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        wxNick: '',
        telephone: '',
        status:1, //1默认  2填写其他  3成功
        kpRef:0,
        taskRef:null,
        currentType:null,
        content:'',
        reportTypes:[
          {type:1,text:'节目含有欺诈、反动、色情内容'},
          {type:2,text:'版权侵权'},
          {type:3,text:'虚假谣言'},
          { type: 0, text: '其他' }
        ],
      btnDisable: true,
      navHeight: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.data.kpRef = options.courseId;
      this.data.taskRef = options.taskId;
      this.player = new Player(this);
      this.setData({
        navHeight: app.globalData.navHeight
      })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    // 返回到原来页面
    backTo: function () {
        wx.navigateBack()
    },
    showFeedback:function(event){
      this.data.currentType = event.currentTarget.dataset.type; 
      if (this.data.currentType  == 0){
        // 其他
        this.setData({
          status:2
        })
      } else {
        this.report();
      }
    },
    report:function(e){
      this.data.content = (e && e.detail.value.content) || '';
      if(this.data.currentType == 0 && this.data.btnDisable){
        return;
      } else {
        API.report({
          "kpRef": this.data.kpRef,
          "taskRef": this.data.taskRef,
          "type": this.data.currentType,
          "content": this.data.content
        }).then(res => {
          this.setData({
            status: 3
          })
        });
      }
    },
    textChange:function(e){
      let value = e.detail.value;
      if(value.trim() != ''){
        if(this.data.btnDisable){
          this.setData({
            btnDisable:false
          })
        }  
      } else {
        if (!this.data.btnDisable) {
          this.setData({
            btnDisable:true
          })
        }
      }
    }
});