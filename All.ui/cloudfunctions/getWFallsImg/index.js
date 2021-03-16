// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db   = cloud.database()
const w_db = db.collection('wfalls-img')

// 云函数入口函数
exports.main = async (event, context) => {
  let { page } = event
  page--
  return w_db.skip(page * 10).limit(10).get()
}