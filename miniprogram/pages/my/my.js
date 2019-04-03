var app = getApp()
Page({
  data: {
    current: 0,
    goodsinfo:[],
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  bindchange: function (e) {
    //轮播图发生改变
    this.setData({
      current: e.detail.current
    })

  },

  onLoad: function () {
   const db=wx.cloud.database()
   db.collection("goodsinfo").where({
     _openid:app.globalData.openid
   }).get({
     success:res=>{
       this.setData({ goodsinfo:res.data})
     }
   })
  },
  remove:function(){
    const db=wx.cloud.database()
    db.collection("goodsinfo").doc(this.data.goodsinfo[this.data.current]._id).update({
      show:false
    })
  },
  checkreply:function(){
    wx.navigateTo({
      url: '../reply/reply?id='+this.data.goodsinfo[this.data.current]._id,
    })
  }
})