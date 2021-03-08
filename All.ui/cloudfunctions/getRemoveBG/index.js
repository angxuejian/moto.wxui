// 云函数入口文件
const cloud = require('wx-server-sdk')
const $ = require('request')
cloud.init(
  {
    env: cloud.DYNAMIC_CURRENT_ENV
  }
)

// 云函数入口函数
exports.main = async (event, context) => {
  const { data } = event
  data.size = 'auto'

  return new Promise((resolve, reject) => {
    $.post({
      url:'https://api.remove.bg/v1.0/removebg',
      headers: { 'X-Api-Key': 'UGNDgug4rQ17rstQW2taRbqv' },
      formData: data,
      encoding: null
    }, (error, response, body) => {
      // console.log(error, response, body, ':这是hi是')
      if (error) reject(error)

      if (response.statusCode !== 200) reject(console.error('Error:', response.statusCode, body.toString('utf8')))

      resolve(body)
    })
  })
}