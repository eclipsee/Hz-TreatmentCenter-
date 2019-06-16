export const dbRequests = {
  addUser(param) {
    const db = wx.cloud.database();
    return new Promise((resolve, reject) => {
      db.collection('hz_user').add({
        data: {
          user_name: param.user_name,
          avatar: param.avatar,
          create_time: new Date(),
          update_time: new Date(),
        },
        success(res) {
          wx.showToast({
            title: '新增记录成功',
          });
          console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id);
          resolve(res._id);
        },
        fail(err) {
          wx.showToast({
            icon: 'none',
            title: '新增记录失败',
          });
          console.error('[数据库] [新增记录] 失败：', err);
          reject();
        },
      });
    });
  },
  addBubble(param) {
    const db = wx.cloud.database()
    return new Promise((resolve, reject) => {
      db.collection('hz_bubble').add({
        data: {
          user_id: param.user_id,
          user_name: param.user_name,
          avatar: param.avatar,
          url: param.url,
          title: param.title,
          tag: param.tag, // 0,1,2,3,4,5
          level: param.level, //1,2,3,4,5
          like_count: 0,
          closed: false,
          create_time: new Date(),
          update_time: new Date(),
        },
        success(res) {
          // 在返回结果中会包含新创建的记录的 _id
          wx.showToast({
            title: '新增记录成功',
          });
          console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id);
          resolve(res._id);
        },
        fail(err) {
          wx.showToast({
            icon: 'none',
            title: '新增记录失败',
          });
          console.error('[数据库] [新增记录] 失败：', err);
          reject();
        },
      });
    });
  },
  // add a comment for a bubble
  addBubbleComment(param) {
    const db = wx.cloud.database();
    return new Promise((resolve, reject) => {
      db.collection('hz_comment').add({
        data: {
          user_id: param.user_id,
          user_name: param.user_name,
          avatar: param.avatar,
          bubble_id: param.bubble_id,
          comment_type: param.comment_type, // voice music joke cure
          sound_url: param.sound_url,
          bubble_owner_like: false,
          create_time: new Date(),
          update_time: new Date(),
        },
        success(res) {
          // 在返回结果中会包含新创建的记录的 _id
          wx.showToast({
            title: '新增记录成功',
          });
          console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id);
          resolve(res._id);
        },
        fail(err) {
          wx.showToast({
            icon: 'none',
            title: '新增记录失败',
          });
          console.error('[数据库] [新增记录] 失败：', err);
          reject();
        },
      });
    });
  },
  getUser(openId) {
    const db = wx.cloud.database();
    return new Promise((resolve, reject) => {
      // 查询当前用户信息
      db.collection('hz_user').where({
        _openid: openId,
      }).get({
        success(res) {
          console.log('[数据库] [查询记录] 成功: ', res)
          resolve(res.data.length > 0 ? res.data.shift() : null)
        },
        fail(err) {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败',
          });
          console.error('[数据库] [查询记录] 失败：', err);
          reject();
        },
      });
    });
  },
  // get a random bubble
  getLuckyBubble() {
    const db = wx.cloud.database();
    return new Promise((resolve, reject) => {
      // 查询当前用户信息
      db.collection('hz_bubble').where({
        closed: false,
      }).get({
        success(res) {
          console.log('[数据库] [查询记录] 成功: ', res);
          const luckyIndex = Math.floor(Math.random() * (res.data.length - 1));
          resolve(res.data.splice(luckyIndex, 1).shift());
        },
        fail(err) {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败',
          });
          console.error('[数据库] [查询记录] 失败：', err);
          reject();
        },
      });
    });
  },
  // get a specific bubble by bubbleid
  getBubble(bubbleId) {
    const db = wx.cloud.database();
    return new Promise((resolve, reject) => {
      db.collection('hz_bubble').where({
        _id: bubbleId,
      }).get({
        success(res) {
          console.log('[数据库] [查询记录] 成功: ', res);
          resolve(res.data.shift());
        },
        fail(err) {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败',
          });
          console.error('[数据库] [查询记录] 失败：', err);
          reject();
        },
      });
    });
  },
  // get the bubble list of the user
  getUserBubbles(userId) {
    const db = wx.cloud.database();
    return new Promise((resolve, reject) => {
      db.collection('hz_bubble').where({
        user_id: userId,
      }).get({
        success(res) {
          console.log('[数据库] [查询记录] 成功: ', res);
          resolve(res.data);
        },
        fail(err) {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败',
          });
          console.error('[数据库] [查询记录] 失败：', err);
          reject();
        },
      });
    });
  },
  // get comment list of the bubble
  getComments(bubbleId) {
    const db = wx.cloud.database();
    return new Promise((resolve, reject) => {
      // 查询当前用户信息
      db.collection('hz_comment').where({
        bubble_id: bubbleId,
      }).get({
        success(res) {
          console.log('[数据库] [查询记录] 成功: ', res);
          resolve(res.data);
        },
        fail(err) {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败',
          });
          console.error('[数据库] [查询记录] 失败：', err);
          reject();
        },
      });
    });
  },
  // updateBubble(bubbleId, data) {
  //   console.log(bubbleId, data);
  //   const db = wx.cloud.database();
  //   return new Promise((resolve, reject) => {
  //     // 查询当前用户信息
  //     db.collection('hz_bubble').doc(bubbleId).update({
  //       data: { like_count: 2 },
  //       success(res) {
  //         console.log('[数据库] [修改记录] 成功: ', res);
  //         resolve(res.data);
  //       },
  //       fail(err) {
  //         console.error('[数据库] [修改记录] 失败：', err);
  //         reject();
  //       },
  //     });
  //   });
  // },
};

export default {};
