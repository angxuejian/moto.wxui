// 云函数入口文件
const cloud = require('wx-server-sdk')
const $     = require('request')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db   = cloud.database()
const _    = db.command
const r_db = db.collection('remove-key')



// 云函数入口函数
exports.main = async (event, context) => {
  const { data } = event

  const list = await getRemoveKey()

  if (!list.data.length) {
    return Promise.resolve({
      status: 400,
      message: '本月次数已用完'
    })
  }

  return await getRmoveBG(data, list.data[0])
}


/**
 * 获取 X-Api-Key
 */
const getRemoveKey = () => {
  return r_db.where({
    count: _.gt(0)
  }).get()
}

/**
 * 请求 remove bg 接口
 * @param {Object} data 
 * @param {Object} item 当前key 的信息
 */
const getRmoveBG = (data, item) => {
  data.size = 'auto'

  return new Promise((resolve, reject) => {
    $.post({
      url: 'https://api.remove.bg/v1.0/removebg',
      headers: {
        'X-Api-Key': item.key
      },
      formData: data,
      encoding: null
    }, (error, response, body) => {

      if (error) {
        resolve({
          status: '500',
          message: error
        })
      }

      if (response.statusCode !== 200) {
        resolve({
          status: response.statusCode,
          message: body.toString('utf8')
        })
      }

      resolve({
        status: 200,
        data: body
      })

      incRemoveCount(item._id)
    })
  })
}

/**
 * 减去当前请求key的数量
 * @param {String} id 当前key 的id
 */
const incRemoveCount = id => {
  r_db.doc(id).update({
    data: {
      count: _.inc(-1)
    }
  })
}