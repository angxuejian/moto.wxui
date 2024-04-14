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

  const getRemoveKey = async function() {
    return await  r_db.where({ count: _.gt(0) }).get()
  }
  const incRemoveCount = function(id) {
    r_db.where({ _id: id }).update({
      data: { count: _.inc(-1) }
    })
  }
  const getRmoveBG = (data, item) => {
    data.format = 'png'
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
        
        incRemoveCount(item._id)

        const buffer = Buffer.from(body)
        resolve({
          status: 200,
          data: 'data:image/png;base64,' + buffer.toString('base64')
        })
      })
    })
  }

  const list = await getRemoveKey()

  if (!list.data.length) {
    return Promise.resolve({
      status: 400,
      message: '本月次数已用完'
    })
  }
  return await getRmoveBG(data, list.data[0])
}

