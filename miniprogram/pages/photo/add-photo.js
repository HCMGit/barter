// pages/photo/add.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPhoto: false,
    albumIndex: -1,
    album_id: null,
    albums: [],
    photos: [],
    photoscloudPath:[],
   goodsname:'',
   goodsdetail:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () { 
  },

  previewImage: function (e) {
    var that=this
    var current = e.target.dataset.src
    var imgArr = [];
    var objkeys = Object.keys(that.data.photos);
    for (var i = 0; i < objkeys.length; i++) {
      imgArr.push(this.data.photos[i].src)
        }
    wx.previewImage({
      current: current,
      urls:imgArr
    })
  },
/***选择图片 */
  chooseImage: function () {
    var that = this;
    var items = that.data.photos;
    var p=that.data.photosname
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        for (var i = 0; i < tempFilePaths.length; i++) {
          const filePath = res.tempFilePaths[i]
          const name = Math.random() * 1000000
          const cloudPath = name + filePath.match(/\.[^.]+?$/)[0]
          items.push({
            src:filePath,
            name:cloudPath
          });  
        }
        that.setData({
          photos: items,
        });
      }
      
    })
  },

  /**
   * 提交表单
   */
  formSubmit: function (e) {
    var that = this;
    that.data.goodsname = e.detail.value.goodsname;
    that.data.goodsdetail=e.detail.value.goodsdetail
    if (that.data.photos.length == 0) {
      wx.showToast({
        title: '至少传一个图',
      })
      return;
    }
    wx.showLoading({ title: '提交中' });
          var photos = that.data.photos;
          that.uploadImage(photos);
         ///////上交数据库

  },
  /***上传图片 */
  uploadImage: function (data) {
    var that=this,
     i=data.i?data.i:0,//当前上传的哪张图片
     success=data.success?data.success:0,//上传成功个数
     fail = data.fail ? data.fail : 0;//上传失败的个数
      wx.cloud.uploadFile({
         cloudPath:data[i].name,
         filePath:data[i].src,
         success:function(res){
           let fileID = res.fileID
           success++;
           that.data.photoscloudPath.push({
             fileID
           })
         },
         fail:function(res){
           fail++;//图片上传失败
         },
         complete:function(){
           i++;
           if(i==data.length){
             console.log(that.data.photoscloudPath)

             wx.cloud.callFunction({
               name: 'cloudadd',
               data: {
                 _openid: app.globalData.openid,
                 imagepath: that.data.photoscloudPath,
                 goodsname: that.data.goodsname,
                 goodsdetail: that.data.goodsdetail,
                 nickName: app.globalData.nickName,
                 avatarUrl: app.globalData.avatarUrl,
               },
               success: res => {
                 wx.navigateTo({
                   url: '/pages/album/list',
                 })
                 wx.showToast({
                   title: '上传成功',
                 })
               },
               fail:function(){
                 wx.showToast({
                   title: '上传失败',
                 })
               }
             })
          wx.hideLoading()
           }else{
             data.i=i;
             data.success=success;
             data.fail=fail;
             that.uploadImage(data);
           }
         }
      });


  },
})
