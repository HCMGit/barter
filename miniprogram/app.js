//app.js
App({
  
  globalData: {
    singleChoiceAnswerNow:[],
    openid:'',
    latitude:1,
    longitude:1,
    nickName:'',
    avatarUrl:'',
    userInfo:''
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
       
        db.collection('basicinfo').where({
          _openid:that.globalData.openid
        }).get({
          success: res => {
           
            if (res.data.length!=0)
            {
      ///////用户存在时获得用户信息和地理位置，并更新用户信息地理位置
              wx.getUserInfo({
                success: function (res) {
                  that.globalData.nickName=res.userInfo.nickName
                  that.globalData.avatarUrl=res.userInfo.avatarUrl
                  that.globalData.userInfo=res.userInfo
                  const db = wx.cloud.database()
                  db.collection('basicinfo').doc(that.globalData.openid).update({
                    data: {
                      nickName: res.userInfo.nickName,
                      avatarUrl: res.userInfo.avatarUrl,
                      
                    }
                  }).then(res => {
                   
                  }).catch(console.error)
                }

              })
              wx.getLocation({
                type: 'wgs84',
                success: function (res) {
                  var latitude = 1
                  var longitudee = 1
                  that.globalData.latitude=res.latitude
                  that.globalData.longitude=res.longitude
                  latitude = res.latitude
                  longitudee = res.longitude
                  const db = wx.cloud.database()
                  db.collection('location').doc(that.globalData.openid).update({
                    data: {
                      latitude:latitude,
                      longitudee:longitudee
                    }
                  }).then(res => {
                    console.log(that.globalData.latitude)
                    if (that.openidCallback) {
                      that.openidCallback(that.globalData.openid);   
                    }

                    
                  }).catch(console.error)
                },
              })



              //////////////////////////////////////////////////
            }
            else{
              /////////////////////用户不存在时，插入用户基本信息和用户地理位置
              wx.getUserInfo({
                success: function (res) {
                  that.globalData.nickName = res.userInfo.nickName
                  that.globalData.avatarUrl = res.userInfo.avatarUrl
                  that.globalData.userInfo = res.userInfo
                  const db = wx.cloud.database()
                  db.collection('basicinfo').add({
                    data: {
                      nickName: res.userInfo.nickName,
                      avatarUrl: res.userInfo.avatarUrl,
                   
                    }
                  }).then(res => {
                    
                  }).catch(console.error)
                }

              })
              wx.getLocation({
                type: 'wgs84',
                success: function (res) {
                  var latitude = 1
                  var longitudee = 1
                  that.globalData.latitude = res.latitude
                  that.globalData.longitude = res.longitude
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
          title: '',
        })
        
      }
    })
  },
 
  })
  
  


