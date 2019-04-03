var app=getApp()
Page({
  data:{
   reply:[],
   userid:''
  },
onLoad:function(options){
  this.setData({
    userid: app.globalData.openid
  })
 wx.cloud.callFunction({
   name:'replyquery',
   data:{
     commentid:options.commentid
   },
   success:res=>{
     
     this.setData({
       reply:res.result.data
     })
   }
 })
},

  /**
    * 用户点击右上角分享
    */
  onShareAppMessage: function () {

  },
  cancleReply: function (e) {
    this.setData({
      showOrHidden: false
    })
  },
  bindReply: function (e) {
    console.log(e.target.dataset.commentid)
    this.setData({
      showOrHidden: true,
      commentid: e.target.dataset.commentid
    })

  },
  deleteComment: function (e) {
    wx.showModal({
      title: '提示',
      content: '删除回复？',
      success: res => {
        if (res.confirm) {
          const db = wx.cloud.database()
          db.collection("reply").doc(e.target.dataset.commentid).update({
            data: {
              show: false
            }
          })
          this.onLoad()
        }
        else { }
      }
    })

  },
  submitForm: function (e) {
    const db = wx.cloud.database()
    db.collection('reply').add({
      data: {
        reply: e.detail.value.comment,
        reply_man: app.globalData.openid,
        commentid: this.data.commentid,
        show: true,
        due: new Date(),
        nickName: app.globalData.nickName,
        avatarUrl: app.globalData.avatarUrl
      }
    }).then(res => {

      wx.showToast({
        title: '回复成功',
      })

    }).catch(console.error)

  }
})