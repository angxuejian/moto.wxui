// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const resetEnglishRandom = async function (list) {
    await db.collection('english').where({
      random: true
    }).update({
      data: { random: false }
    })
  }

  const getEnglish = async function(size = 10, ids = []) {
    return await db.collection('english').aggregate().match({ 
      random: false,
      _id: _.nin(ids)
     }).sample({ size }).end()
  }
  const setRandom = async function(ids) {
    await db.collection('english').where({
      _id: _.in(ids)
    }).update({
      data: { random: true }
    })
  }
  const addTimestamp = async function(day, ids) {
    await db.collection('timestamp').add({
      data: {
        day, ids
      }
    })
  }
  const getTodayEnglish = async function(ids) {
    return await db.collection('english').where({
      _id: _.in(ids)
    }).get()
  }
  try {
    const currentTimestamp = Date.now()
    const currentDay = new Date(currentTimestamp).toISOString().split('T')[0]
  
    const lastTimestamp = await db.collection('timestamp').where({
      day: currentDay
    }).get()

    const isArray = lastTimestamp.data.length
    const lastDay = isArray ? lastTimestamp.data[0] : null
    

    if (lastDay) {
      const { data } = await getTodayEnglish(lastDay.ids)
      const list = []
      lastDay.ids.forEach(id => {
        list.push(data.find(item => item._id === id))
      })
      return { data: list }
    } else {
      
      const { list } = await getEnglish()

      if (list.length !== 10) {
        await resetEnglishRandom(list)
        
        const ids = list.map(item => item._id)
        const result = await getEnglish(10 - list.length, ids)
        
        list.push(...result.list)
      }
      const ids = list.map(item => item._id)
  
      await setRandom(ids)
      await addTimestamp(currentDay, ids)
      return { data: list }
    }
  } catch (error) {
    return { error: error.message}
  } 

  // 查询出timestamp最新的一条日期；
  // 如果最新一条日期是今天的，就根据data中_id 查出今天的随机的10条数据
  // 如果最新一条日期是昨天的，就随机10条数据

  // 根据timestamp的count字段来随机
  // english中的count === timestamp的random=false，取出10条
  // 如不满10条，就先重置enlish表random = false，在随机剩余数据补足10条数据
  // 取出后的10条数据 random = true
}