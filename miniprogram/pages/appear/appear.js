var app=getApp()
Page({
  data: {
    imgs: [
      "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522069454.jpg",
      "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2522778567.jpg",
      "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2523516430.jpg",
    ],
    img: "http://img.kaiyanapp.com/7ff70fb62f596267ea863e1acb4fa484.jpeg",
  

    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  bindchange: function (e) {//轮播图发生改变
    this.setData({
      current: e.detail.current
    })
  },
  onLoad:function () {
    if(app.globalData.openid&&app.globalData.openid!=''){
   wx.cloud.callFunction({
     name:'cloudquery',
     data:{},
     success:res=>{
      
     }
   })
    }
    else{
      app.openidCallback = openid =>{
        if(openid!=''){
          wx.cloud.callFunction({
            name: 'cloudquery',
            data: {
            },
            success: res => { 
            
            }
          })
        }
      }
    }
   this.distance(39.928712,116.393345,39.928722,116.393853)
  },


  distance: function (la1, lo1, la2, lo2) {
    var La1 = la1 * Math.PI / 180.0;
    var La2 = la2 * Math.PI / 180.0;
    var La3 = La1 - La2;
    var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
    s = s * 6378.137;//地球半径
    s = Math.round(s * 10000) / 10000;
    // return s
    console.log("计算结果",s)
  },

})
