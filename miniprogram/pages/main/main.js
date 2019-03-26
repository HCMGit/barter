const app=getApp()
Page({
  data: {
    bigImg:'./user-unlogin.png'
  },
  uploader:function(){
    //选择图片
    let that=this;
    wx.chooseImage({
      count:1,
      sizeType:['compressed'],
      sourceType:['album','camera'],
      success: function(res) {
        wx.showLoading({
          title: '上传中',
        })
        const filePath=res.tempFilePaths[0]
        const name=Math.random()*1000000
        const cloudPath=name+filePath.match(/\.[^.]+?$/)[0]
        //上传图片
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
         
          success : res=>{
            console.log('【上传文件】成功',res)
           that.setData({
             bigImg:res.fileID,
           });
           let fileID=res.fileID;
          },
          fail:e=>{
            console.error('[上传图片]失败',e)
            wx.showToast({
              icon:'none',
              title: '上传失败',
            })
          },
          complete:()=>{
            wx.hideLoading()
          }
        })
      },
      fail:e=>{
        console.error(e)
      }
    })
  },
 
  res:function(e){

    const db = wx.cloud.database()
    db.collection('goodsinfo').where({
      _openid:app.globalData.openid 
    }).count({
      success(res) {
        if(res.total>2){
          wx.showModal({
            title: '提示',
            content: '物品数量不能多于三个个',
          })
        }
        else{
          wx.cloud.callFunction({
            name: 'cloudadd',
            data: {
              _openid: app.globalData.openid,
              imagepath: this.data.bigImg,
              goodsname: e.detail.value.goodsname,
              goodsdetail: e.detail.value.goodsdetail
            }
          })
        }
      }
    })

  },
})