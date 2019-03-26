//app.js
App({
  
  globalData: {
    openid:''
  },
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    var that=this
   const db = wx.cloud.database()
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        that.globalData.openid = res.result.openid;
        console.log(that.globalData.openid)
        db.collection('basicinfo').where({
          _openid:that.globalData.openid
        }).get({
          success: res => {
            console.log(res.data.length)
            if (res.data.length!=0)
            {
              ///////////////////////////////更新信息
              wx.getUserInfo({
                success: function (res) {
                  const db = wx.cloud.database()
                  db.collection('basicinfo').doc(that.globalData.openid).update({
                    data: {
                      nickname: res.userInfo.nickName,
                      avatarUrl: res.userInfo.avatarUrl
                    }
                  }).then(res => {
                    console.log(res)
                  }).catch(console.error)
                }

              })
              wx.getLocation({
                type: 'wgs84',
                success: function (res) {
                  var latitude = 1
                  var longitudee = 1
                  latitude = res.latitude
                  longitudee = res.longitude
                  const db = wx.cloud.database()
                  db.collection('location').doc(that.globalData.openid).update({
                    data: {
                      latitude:latitude,
                      longitudee:longitudee
                    }
                  }).then(res => {
                    if (that.openidCallback) {
                      that.openidCallback(that.globalData.openid);   
                    }

                    console.log(res)
                  }).catch(console.error)
                },
              })



              //////////////////////////////////////////////////
            }
            else{
              //////////////////////////////////////////首次登录插入信息
              wx.getUserInfo({
                success: function (res) {
                  const db = wx.cloud.database()
                  db.collection('basicinfo').add({
                    data: {
                      nickname: res.userInfo.nickName,
                      avatarUrl: res.userInfo.avatarUrl
                    }
                  }).then(res => {
                    console.log(res)
                  }).catch(console.error)
                }

              })
              wx.getLocation({
                type: 'wgs84',
                success: function (res) {
                  var latitude = 1
                  var longitudee = 1
                  latitude = res.latitude
                  longitudee = res.longitude
                  const db = wx.cloud.database()
                  db.collection('location').add({
                    data: {
                      latitude:latitude,
                      longitude:longitudee
                    }
                  }).then(res => {
                    if (that.openidCallback) {
                      that.openidCallback(that.globalData.openid);
                    }
                    console.log(res)
                  }).catch(console.error)
                },
              })
              /////////////////////////////////////////////////////////
            }
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '查询记录失败'
            })
            console.error('[数据库] [查询记录] 失败：', err)
          }
        })   
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '获取 openid 失败，请检查是否有部署 login 云函数',
        })
        console.log('[云函数] [login] 获取 openid 失败，请检查是否有部署云函数，错误信息：', err)
      }
    })
  },
   
 
  
  })
  
  


