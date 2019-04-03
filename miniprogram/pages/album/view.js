// pages/album/view.js
var app = getApp();
Page({
  data:{
    goodsdetail:'',
    imagepath:[],
    swiper: {
      imgUrls: [],
      indicatorDots: true,
      autoplay: false,
      interval: 5000,
      duration: 1000,
      current: 0,
    },
  },
  onLoad:function(options){
    var swiper=this.data.swiper
    swiper.imgUrls = app.globalData.singleChoiceAnswerNow
    this.setData({
      goodsdetail:options.goodsdetail,
      swiper:swiper
    })
  },
  prevImg: function () {
    var swiper = this.data.swiper;
    var current = swiper.current;
    swiper.current = current > 0 ? current - 1 : swiper.imgUrls.length - 1;
    this.setData({
      swiper: swiper,
    })
  },

  nextImg: function () {
    console.log(2);
    var swiper = this.data.swiper;
    var current = swiper.current;
    swiper.current = current < (swiper.imgUrls.length - 1) ? current + 1 : 0;
    this.setData({
    swiper: swiper,
    })
  },
  
})
