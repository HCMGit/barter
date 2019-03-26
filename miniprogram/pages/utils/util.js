
Page({
GetUser: function() {
  return new Promise(function (resolve, reject) {
    wx.getUserInfo({
      success: function (res) {
        let result = res.userInfo.avatarUrl;
        resolve(result);
      },
      fail: function () {
        reject("系统异常")
      }
    })
  })


}
})