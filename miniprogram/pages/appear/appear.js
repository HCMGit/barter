var app=getApp()
Page({
  data: {
    image:'./user-unlogin.png',
    wxname:'undefine',
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    current:0,
    showModal: false,
    goodsinfo:[],

  },
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  submitForm: function (e) {
    console.log(e)
    this.hideModal();
    const db = wx.cloud.database()
    db.collection('message').add({
      data: {
       message:e.detail.value.message,
       message_man:this.data.goodsinfo[this.data.current]._openid,
       show:true,
       due: new Date(),
       nickName:this.data.goodsinfo[this.data.current].nickName,
       avatarUrl:this.data.goodsinfo[this.data.current].avatarUrl,
       goodsId:this.data.goodsinfo[this.data.current]._id
      }
    }).then(res => {
      wx.switchTab({
        url: '/pages/mymessage/mymessage',
      })
       wx.showToast({
         title: '留言成功',
       })
    
    }).catch(console.error)


  },
  bindchange: function (e) {
    //轮播图发生改变
    this.setData({
      current: e.detail.current
    })
    
  },
  start:function(){
    this.setData({
      showModal: true
    }) 
  },
  onShow:function(){
    this.onLoad()
  },

 /*页面启动时，从数据库里查找所有数据，把与用户相距小于3公里的其他用户
 加入数组中，然后显示在页面里
*/
  onLoad:function () {
   var that=this
    if(app.globalData.openid&&app.globalData.openid!=''){
      console.log("1")
   wx.cloud.callFunction({
     name:'cloudquery',
     data:{},
     success:res=>{
       console.log("2")
       for (let i = 0; i < res.result.data.length; i++) {
         const db = wx.cloud.database()
         db.collection('location').where({
           _openid: res.result.data[i]._openid
         }).get({
           success: res1 => {
             console.log(app.globalData.latitude)
             console.log(res1.data[0].latitude)
             console.log(app.globalData.longitude)
             console.log(res1.data[0].longitude)
             console.log(this.distance(app.globalData.latitude, app.globalData.longitude, res1.data[0].latitude, res1.data[0].longitude) + "dd")
             if (this.distance(app.globalData.latitude, app.globalData.longitude, res1.data[0].latitude, res1.data[0].longitude) <40) {
               console.log("3")
               this.setData({
                 goodsinfo: res.result.data
               })
             }
              
           }
         })
       }
     }
   })
    }
    else{
      app.openidCallback = openid =>{
        console.log("4")
        if(openid!=''){
          wx.cloud.callFunction({
            name: 'cloudquery',
            data: {
            },
            success: res => { 
              console.log("5")
            for (let i = 0; i < res.result.data.length; i++) {
                   const db=wx.cloud.database()
                   db.collection('location').where({
                   _openid:res.result.data[i]._openid
                  }).get({
                      success:res1=>{
                        console.log(app.globalData.latitude)
                        console.log(res1.data[0].latitude)
                        console.log(app.globalData.longitude)
                        console.log(res1.data[0].longitude)
                        console.log(this.distance(app.globalData.latitude, app.globalData.longitude, res1.data[0].latitude, res1.data[0].longitude)+"dd")
                        if(this.distance(app.globalData.latitude,app.globalData.longitude,                                     res1.data[0].latitude,res1.data[0].longitude)<40){
                          console.log("6")
                            this.setData({
                              goodsinfo:res.result.data
                            })  
                      }     
                 }
              })
            }
         
            }
          })
        }
      }
    }
 
  },
  img: function (e) {
    var that = this;
    var all_pic = [];
    var url = e.currentTarget.dataset.url
    console.log("点击的url：", e);
    for (var i = 0; i < that.data.goodsinfo[e.target.dataset.index].imagepath.length; i++) {
      var imgs = that.data.goodsinfo[e.target.dataset.index].imagepath[i].fileID
      all_pic.push(imgs)
    }
    wx.previewImage({
      current: url, // 当前显示图片的http链接 
      urls: all_pic // 需要预览的图片http链接列表 
    })
  },
  onShow:function(){
  this.onLoad();
  },
//////////////////////////计算经纬度两点之间的距离
  distance: function (la1, lo1, la2, lo2) {
    var La1 = la1 * Math.PI / 180.0;
    var La2 = la2 * Math.PI / 180.0;
    var La3 = La1 - La2;
    var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
    s = s * 6378.137;//地球半径
    s = Math.round(s * 10000) / 10000;
    return s
    // console.log("计算结果",s)
  },

})
