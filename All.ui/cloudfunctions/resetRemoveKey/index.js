// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db   = cloud.database()
const _    = db.command
const r_db = db.collection('remove-key')


// 云函数入口函数
exports.main = async (event, context) => {
  r_db.where({
    count: _.neq(50)
  }).update({
    data: {
      count: 50
    }
  })
}