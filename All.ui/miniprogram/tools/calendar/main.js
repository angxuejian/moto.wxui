
import { Solar } from './solar'


class Calendar extends Solar {
  constructor() {
    super()

    this.sColor = '#438EDB' // 选择的颜色
    this.nColor = '#c8ccd6' // 非当月颜色
    this.tColor = '#373C52' // 当月的颜色
    this.bColor = '#d8d8d8' // 今天的背景颜色
    this.dColor = '#ffffff' // 今天的字体颜色
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
   * @param {boolean} params.current 是否为当前月
   */
  formatDate(params) {
    const { y, m } = this.clearMonth(params.y, params.m)
    const { d } = params
    const current = new Date([y, m, d].join('-')).getTime()
    
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

    const calendar = this.solar_to_lunar(y, m, d)
    const today = [calendar.day_lunar, ...calendar.festival]
    if (today.length > 1) l_color = this.sColor

    return {
      solar: this.padStart(d),
      time: current,
      color: color,
      today,
      l_color: l_color,
      b_color: b_color,
      w_color: w_color, 
      ...calendar
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

  getAdjacentMonths(d) {
    const last = new Date(d)
    const curr = new Date(d)
    const next = new Date(d)
    
    last.setMonth(last.getMonth() - 1)
    last.setDate(1)

    next.setMonth(next.getMonth() + 1)
    next.setDate(1)

    return {
      last: this.getFormat(last),
      curr: this.getFormat(curr),
      next: this.getFormat(next)
    }
  }
  getFormat(d) {
    const yy = d.getFullYear()
    const mm = d.getMonth() + 1
    const dd = d.getDate()
    return { yy, mm, dd }
  }

  getWeeks(year, month, day) {
    const list = []
    for (let i = 0; i < 7; i++) {
      const d = new Date([year, month, day].join('-'))
      d.setDate(d.getDate() + i)

      const { yy, mm, dd } = this.getFormat(d)
      list.push(this.formatDate({
        y: yy, m: mm,
        d: dd, color: this.tColor,
        current: true
      }))
    }

    return list
  }

  getAdjacentWeeks(d, base = 0) {
    const last = new Date(d)
    const next = new Date(d)
    const min = base ? 1 : 0

    last.setDate(last.getDate() - 7)
    next.setDate(next.getDate() + 7)
    
    const lastStart = new Date(last.getTime())
    const nextStart = new Date(next.getTime())

    lastStart.setDate(lastStart.getDate() + min - lastStart.getDay())
    nextStart.setDate(nextStart.getDate() + min - nextStart.getDay())

    return {
      last: this.getFormat(lastStart),
      next: this.getFormat(nextStart)
    }
  }
}


export { Calendar }