
import { SOLAR_FESTIVAL } from './config'
import Lunar from './lunar'

// 阳历js
class Solar extends Lunar {
  constructor() {
    super()

    this.sColor = '#438EDB' // 选择的颜色
    this.nColor = '#c8ccd6' // 非当月颜色
    this.tColor = '#373C52' // 当月的颜色
    this.bColor = '#d8d8d8' // 今天的背景颜色
    this.dColor = '#ffffff' // 今天的字体颜色
  }
  getSolar(year, month) {
    const list = []
    const M = month - 1

    if (M < 0) { 
      console.log('错误')
      return
    }
    if (M === 1) this.isSolarLeapMonth(year)

    // 上月日期
    const monday = new Date(`${year}-${month}-01`).getDay()
    const SM = M === 0 ? 11 : M - 1
    const sLength = this.months[SM] - monday
    for (let i = sLength; i < this.months[SM]; i++) {
      list.push(this.formatDate({
        y: year, m: M, 
        d: i + 1, 
        color: this.nColor,
      }))
    }

    // 当月日期
    for (let i = 0; i < this.months[M]; i++) {
      list.push(this.formatDate({
        y: year, m: M + 1,
        d: i + 1, color: this.tColor,
        current: true
      }))
    }


    // 下月日期
    const elength = (list.length > 35 ? 42 : 35) - list.length
    for (let i = 0; i < elength; i++) {
      list.push(this.formatDate({
        y: year, m: M + 2,
        d: i + 1, color: this.nColor,
      }))
    }
    return list

  }

  /**
   * 获取阳历 + 合并农历 + 并渲染数据
   * @param {object} params 
   * @param {number} params.y 月
   * @param {number} params.m 月
   * @param {number} params.d 日
   * @param {string} params.color 颜色代码
   * @param {boolean} params.current 是否为当前月
   */
  formatDate(params) {
    const { y, m } = this.formatIntMonth(params.y, params.m)
    const { d } = params
    const dateObj = new Date([y, m, d].join('-'))
    const current = dateObj.getTime()
    const week = dateObj.getDay()

    let color   = params.color // 阳历字体颜色
    let l_color = null  // 节假日字体颜色
    let b_color = null  // 今天背景颜色
    let w_color = this.tColor // 周颜色

    if (current === this.TIMESTAMP && params.current) {
      color   = this.dColor
      l_color = this.dColor
      b_color = this.bColor
      w_color = this.dColor
    }

    let lunar = { festival: []}
    let solar = {}
    let today = []
    if (this.isLunar) {
      lunar = this.solar_to_lunar(y, m, d, week)
      today = today.concat([lunar.day, ...lunar.festival])
    }
    solar = this.getSolarDay(y, m, d)
    today = today.concat([...solar.festival])

    if (today.length > 1) l_color = this.sColor

    return {
      time: current,
      color: color,
      today,
      l_color: l_color,
      b_color: b_color,
      w_color: w_color,
      solar,
      lunar,
      year: y,
      month: m,
      day: d,
      week
    }
  }

  getSolarDay(sy, sm, sd) {
    const mm = this.padStart(sm)
    const dd = this.padStart(sd)
    return {
      festival: this.isLunar ? [
        SOLAR_FESTIVAL[`${mm}${dd}`],
        this.SOLAR_TERMS[`${mm}${dd}`]
      ].filter(s => s) : [],
      year: sy,
      month: sm,
      day: sd,
      value: [sy, sm, sd].join('-')
    }
  }

  /**
   * 阳历 确认二月份 是28天还是29天
   */
   isSolarLeapMonth(year) {
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      this.months[1] = 29
    }
  }

  /**
   * 超过 12月， 年 + 1
   * @param {number} y 阳历年份 
   * @param {number} m 阳历月份（已加 1 ）
   * @returns { y, m }
   */
  formatIntMonth = function (y, m) {
    if (m > 12) {
      y += 1
      m = 1
    } else if (m === 0) {
      y -= 1
      m = 12
    }
    return { y, m }
  }


  /**
   * 获取从今天开始到指定天数的日期
   * @param {number} number 天数
   */
  getSolarNumber = function(number = 181) {
    this.setLunar(true)
    const startDate = this.getSolarDate()
    const startObj = this.formatDate({y: startDate.year, m: startDate.month, d: startDate.day })
    const checkInDateArr = []
    let list = []

    // 周日开始，非周日的往前补位，以今天的日期往前补位一排
    if (startObj.week !== 0 && startObj.day !== 1) {
      for(let i = startObj.day - startObj.week; i < startObj.day; i++) {
        list.push(this.formatDate({y: startDate.year, m: startDate.month, d: i, color: this.nColor }))
      }
    }

    for (let i = 0; i < number; i++) {
      const itemTime = startObj.time + (i * 86400000)
      const itemDate = this.getSolarDate(new Date(itemTime))
      const itemObj = this.formatDate({y: itemDate.year, m: itemDate.month, d: itemDate.day })
      if (i === 0) { itemObj.title = '今天' }
      else if (i === 1) { itemObj.title = '明天' }

      // 每月的1号之前的，非周日往前补位空白
      if (itemObj.day === 1 && itemObj.week !== 0) {
        for (let j = 0; j < itemObj.week; j++) {
          list.push({ color: this.nColor })
        }
      }

      list.push(itemObj)

      // 每月的最后一日，初始化list， month 已经加1
      if (itemObj.month === 2) this.isSolarLeapMonth(itemObj.year)
      if (this.months[itemObj.month - 1] === itemObj.day) {
        checkInDateArr.push({
          month: `${itemObj.year}年${itemObj.month}月`,
          days: list
        })
        list = []
      }
    }

    // 未满一个月的
    if (list.length) {
      const lastObj = list[list.length - 1]
      checkInDateArr.push({
        month: `${lastObj.year}年${lastObj.month}月`,
        days: list
      })
      list = []
    }

    return {
      list: checkInDateArr,
      object: startObj
    }
  }

  getSolarDate= function(date = new Date()) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return { year, month, day }
  }
}


export default Solar