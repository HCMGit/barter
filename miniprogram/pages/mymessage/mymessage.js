var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    showOrHidden:false,
    list1:[],
    commentid:'',
    userid:''
  },
  onShow:function(){
    this.onLoad()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      userid: app.globalData.openid
    })
  wx.cloud.callFunction({
    
    name:'messagequery',
    data:{
      openid:app.globalData.openid,
    },
    success:res=>{
      console.log(res)
      this.setData({
        list1:res.result.data
      })
    }
  })
 
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  cancleReply:function(e){
    this.setData({
      showOrHidden:false
    })
  },
  bindReply:function(e){
    console.log(e.target.dataset.commentid)
     this.setData({
       showOrHidden:true,
       commentid:e.target.dataset.commentid
     })

  },
  deleteComment:function(e){
    wx.showModal({
      title: '警告',
      content: '删除该留言将会失去留言以及回复的信息',
      success:res=>{
        if(res.confirm){
          const db = wx.cloud.database()
          db.collection("message").doc(e.target.dataset.commentid).update({
            data: {
              show: false
            }
          })
          this.onLoad()
        }
        else{}
      }
    })
    
  },
  submitForm:function(e){
    const db = wx.cloud.database()
    db.collection('reply').add({
      data: {
        reply:e.detail.value.comment,
        reply_man:app.globalData.openid,
        commentid:this.data.commentid,
        show: true,
        due: new Date(),
        nickName:app.globalData.nickName,
        avatarUrl:app.globalData.avatarUrl
      }
    }).then(res => {

      wx.showToast({
        title: '回复成功',
      })

    }).catch(console.error)

  },
  reply:function(e){
    wx.navigateTo({
      url: '../reply/reply?commentid='+e.target.dataset.commentid,
    })
  }
  
})