export const xmlog = (params)=> {
    let name = 'xm';
    let data = {
        name:name
    }
        data = Object.assign(data,params);
    wx.request({
        url: 'https://xdcs-collector.test.ximalaya.com/api/v1/statistics',
        data: data,
        method: 'POST',
        success: function (res) {
        wx.hideLoading();
        console.log(res.data.data, 'category data acquisition success');
                // that.setData({category: res.data.data});
        }
    });
}

  