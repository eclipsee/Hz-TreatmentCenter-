import API from '../../requests/api/api.js';
import Util from '../../utils/util.js';
import Player from '../commen/player/Player.js';
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        nickName:'点击登录',
        headImg:'https://s1.xmcdn.com/css/img/common/default/user200.jpg',
        checkinCount:0,
        sessionCount:0,
        islogin: '',
        navHeight: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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
        var _this = this;
        wx.getStorage({
            key:"Authorization",
            success:function(res){
                if(res.data){
                    _this.getCourseInfo();
                }
            },
        })
        wx.showShareMenu({
            withShareTicket: false
        })
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
        this.toMyLessons = null;
        this.getWxUserInfo = null;
        this.getCourseInfo = null;
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
       var _this = this;
       //获取Authorization 成功后拿用户信息和用户的课程信息
        wx.getStorage({
            key:"Authorization",
            success:function(res){
                if(res.data){
                    _this.getCourseInfo();
                }
            },
        })
        wx.stopPullDownRefresh();
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
    //点击我的课程
    toMyLessons: function () {
        if (!this.data.islogin) {
            wx.showToast({
                title: '请先登录',
                icon: 'none'
            })
            return false;
        }
        wx.navigateTo({
            url: "./lessons/lessonsList"
        })
    },
    //获取用户课程和打卡信息
    getCourseInfo:function(){
        this.setData({ 
            islogin: true,
        })
        this.getWxUserInfo();
        API.getCourseCount({}).then(res => {
            if(res.statusCode){
                this.setData({ 
                    checkinCount: res.data.checkinCount,
                    sessionCount:res.data.sessionCount
                })
            }else{

            }
        }).catch(res => {
            console.log(res);
        });
    },
    //去Storage里面拿用户头像，昵称
    getWxUserInfo:function(){
        var _this = this;
        wx.getStorage({
            key:"nickName",
            success:function(res){
                if(res.data){
                    _this.setData({ 
                        nickName: res.data
                    })
                }
            },
        })
        wx.getStorage({
            key:"avatarUrl",
            success:function(res){
                if(res.data){
                    _this.setData({ 
                        headImg: res.data
                    })
                }
                
            },
        })
        wx.getStorage({
            key:"Authorization",
            success:function(res){
                if(res.data){
                    _this.setData({ 
                        Authorization: res.data
                    })
                }
                
            },
        })
    },
    //授权登录后调用主站的登录接口
    bindGetUserInfo: function (e) {
        var that = this;
        if(e.detail.userInfo){
          Util.loginApp(that.getCourseInfo, e.detail);
        }
    },

    // 返回到原来页面
    backTo: function () {
        wx.navigateBack()
    }
});