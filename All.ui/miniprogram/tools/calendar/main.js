
import { Solar } from './solar'
import { LUNAR_FESTIVAL, SOLAR_FESTIVAL } from './config'

const d = new Date()

class Calendar extends Solar {
  constructor() {
    super()

    this.months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] // 阳历月份
    this.sColor = '#438EDB' // 选择的颜色
    this.nColor = '#c8ccd6' // 非当月颜色
    this.tColor = '#373C52' // 当月的颜色
    this.bColor = '#d8d8d8' // 今天的背景颜色
    this.dColor = '#ffffff' // 今天的字体颜色

    this.SOLAR_TERMS = [] // 24节气
    this.TIMESTAMP = new Date(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`).getTime()
  }

  getDays(year, month) {
    return new Promise((resolve, reject) => {
      const list = []
      const M = month - 1

      if (M < 0) { 
        console.log('错误')
        return
      }
      if (M === 1) this.leapMonth(year)

      this.SOLAR_TERMS = this.getSolarTerms(year) // 24节气 对应时间表

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
        }))
      }


       // 下月日期
       // (list.length > 35 ? 42 : 35)
       const elength = 42 - list.length
       for (let i = 0; i < elength; i++) {
         list.push(this.formatDate({
           y: year, m: M + 2,
           d: i + 1, color: this.nColor,
         }))
       }
       resolve(list)
    })

  }

  /**
   * 获取阳历 + 合并农历 + 并渲染数据
   * @param {object} params 
   * @param {number} params.y 月
   * @param {number} params.m 月
   * @param {number} params.d 日
   * @param {string} params.color 颜色代码
   */
  formatDate(params) {
    const { y, m } = this.clearMonth(params.y, params.m)
    const { d } = params
    const current = new Date([y, m, d].join('-')).getTime()
    
    let color   = params.color // 阳历字体颜色
    let l_color = null  // 节假日字体颜色
    let b_color = null  // 今天背景颜色

    if (current === this.TIMESTAMP) {
      color   = this.dColor
      l_color = this.dColor
      b_color = this.bColor
    }

    const lunar = this.solar_to_lunar(y, m, d)

    const s_fes = `${this.padStart(m)}${this.padStart(d)}`
    const l_fes = lunar.fes.join(' ').replace(/\s*/ig, '')

    const today = [
      lunar.day,             // 阴历日期
      LUNAR_FESTIVAL[l_fes], // 阴历节日
      SOLAR_FESTIVAL[s_fes], // 阳历节日
      this.SOLAR_TERMS[s_fes], // 节气
    ].filter(item => item && item)

    if (today.length > 1) l_color = this.sColor

    return {
      solar: this.padStart(d),
      time: current,
      color: color,
      today: today,
      l_color: l_color,
      b_color: b_color,
      cn: `${y}-${m}-${d}`
    }
  }


  /**
  * 阳历 确认二月份 是28天还是29天
  */
  leapMonth(year) {
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      this.months[1] = 29
    }
  }

  getAdjacentMonths(type, d) {

    const last = new Date(d)
    const next = new Date(d)
    
    last.setMonth(last.getMonth() - 1)
    last.setDate(1)

    next.setMonth(next.getMonth() + 1)
    next.setDate(1)

    const data = {}

    if (!type || type === 1) data.lastMonth = this.getFormat(last)
    if (!type || type === 2) data.nextMonth = this.getFormat(next)

    return data
  }
}


export { Calendar }