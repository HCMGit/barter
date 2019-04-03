var app=getApp()
Page({
  data:{
   
  },
submitform:function(e){
  const db=wx.cloud.database()
  db.collection("feedback").add({
    data:{
    feedback:e.detail.value.feedback
    }
  }).then(res => {
    this.setData({
      textarea:''
    })
    wx.showToast({
      title: '反馈成功',
    })

  }).catch(console.error)
}

})