// pages/album/list.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    albums: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database()
    db.collection("goodsinfo").where({
      _openid: app.globalData.openid,
      show: true
    }).get({
      success: res => {
        this.setData({
          albums: res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onCancel:function(e){

    wx.showModal({
      title: '提示',
      content: '确认删除',
      success: res => {
        console.log(e.target.dataset.goodsid)
        if (res.confirm) {
          const db = wx.cloud.database()
          db.collection("goodsinfo").doc(e.target.dataset.goodsid).update({
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
  t:function(e){
    app.globalData.singleChoiceAnswerNow=this.data.albums[e.currentTarget.dataset.index].imagepath
    wx.navigateTo({
      url: '/pages/album/view?goodsdetail=' + this.data.albums[e.currentTarget.dataset.index].goodsdetail,
    })
  }


 


})
