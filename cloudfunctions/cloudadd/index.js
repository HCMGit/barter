// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()
const _=db.command
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('goodsinfo').add({
    data:{
        _openid:event._openid, 
        goodsname:event.goodsname,
        imagepath:event.imagepath,
        goodsdetail:event.goodsdetail,
        avatarUrl:event.avatarUrl,
        nickName:event.nickName,
        due:new Date(),
        show:true
    }
  })
}