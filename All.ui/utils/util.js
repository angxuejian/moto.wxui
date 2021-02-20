const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

/**
 * 更改 svg 的 颜色
 * @param {String} str   svg dataurl 代码
 * @param {String} color 16进制颜色代码
 */
const changeColor = (str, color = '#333333') => {
   return str.replace(/%23[a-zA-Z0-9]{6}/g, color.replace(/#/, '%23'))
}

module.exports = {
  formatTime,
  changeColor
}
