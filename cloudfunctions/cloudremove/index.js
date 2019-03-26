
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
 
  try {
    console.log(event._openid)
    return await db.collection('basicinfo').where({
    _openid:_openid
  }).remove()
  } catch (e) {
    console.error(e)
  }
}