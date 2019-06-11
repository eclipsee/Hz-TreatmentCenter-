import API from '../../../requests/api/api.js';
import Util from "../../../utils/util.js";
import Constant from '../../../constants/constants.js';
import Player from '../../../pages/commen/player/Player.js';
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        products:[],
        showNo:false,
        pageNum:1,
        pages:1,
        reachBottomFlag:false,
      navHeight:0
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
    // onReady: function () {

    // },
    onReady() {
        this.getMyAllCourse(1);
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
        this.toLessonsDetail = null;
        this.getMyAllCourse = null;
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.getMyAllCourse(1);
        wx.stopPullDownRefresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.data.pageNum ++ ;
        if(this.data.pageNum <= this.data.pages){
             wx.showLoading({
                title: '玩命加载中',
            })
            this.getMyAllCourse(this.data.pageNum);
        }else{
            this.setData({ 
                reachBottomFlag: true
            })
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    toLessonsDetail: function (e) {
        let id = e.currentTarget.id,
            status = e.currentTarget.dataset.status;
        if(status == 'inactive'){
            Util.showToast(Constant.COURSE_OFF_MODAL);
            return false;
        }
        wx.navigateTo({
          url: "/pages/learning/lessonDetails/lessonDetails?clear=true&courseId=" + id
        })
    },
    getMyAllCourse:function(pageNum) {
        var _this = this;
        if(pageNum == 1){
            this.setData({ 
                products:[],
            })
        }
        API.getMyCourse({pageNum:pageNum}).then(res => {
            var data = res.data;
            // if(data.products.length == 0 && pageNum == 1){
            //     this.setData({ 
            //         showNo:true
            //     })
            // }
            this.setData({ 
                products: _this.data.products.concat(data.products),
                pageNum:data.pageInfo.pageNum,
                pages:data.pageInfo.pages
            })

            this.setData({ 
                reachBottomFlag:false
            })
        }).catch(res => {
        
        });
    },
    // 返回到原来页面
    backTo: function () {
        wx.navigateBack()
    }
});