
import Solar from './solar'

class Calendar extends Solar {
  constructor(isl = false) {
    super()

    this.setLunar(isl)
  }


  getDays(year, month) {
    console.log(year, month, 'index')
    return this.getSolar(year, month)
  }

  // 获取上月本月下月数据
  getAdjacentMonths(d) {
    const curr = new Date(d)
    const year = curr.getFullYear()
    const month= curr.getMonth()
    const day  = curr.getDate()
    
    const addMonths = (date, n) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
    
      const newDate = new Date(Date.UTC(year, month + n, day));
      return newDate;
    }
    const getMonthNumber = (i) => {
      // let  n = new Date(`${year}-${month === 0 ? '01' : month}-01`)

      // if (i === '-1') n.setMonth(month - 1) 
      // else n.setMonth(month + 1)
      const n = addMonths(curr, i === '-1' ? -1 : 1)
      return {
        yy: n.getFullYear(),
        mm: n.getMonth() + 1,
        dd: n.getDate()
      }
    }
    return {
      last: getMonthNumber('-1'),
      curr: { yy: year, mm: month + 1, dd: day},
      next: getMonthNumber('+1')
    }
  }


  getWeeks(year, month, day, row) {
    const list = []
    const date = [year, month, day].join('-')

    for (let i = 0; i < (row * 7); i++) {
      list.push({ solar: 0 })
    }

    for (let i = 0; i < 7; i++) {
      const d = new Date(date)
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
  getOnlyWeeks(d, t, month = false) {
    const curr = new Date(d)
    const min = 0

    if (!month) {
      if (!t) curr.setDate(curr.getDate() - 7)
      else curr.setDate(curr.getDate() + 7)
    }

    const start = new Date(curr.getTime())
    start.setDate(start.getDate() + min - start.getDay())

    return this.getFormat(start)
  }

  getAdjacentWeeks(d) {
    return {
      last: this.getOnlyWeeks(d, false),
      curr: this.getOnlyWeeks(d, '', true),
      next: this.getOnlyWeeks(d, true),
    }
  }

  getFormat(d) {
    const yy = d.getFullYear()
    const mm = d.getMonth() + 1
    const dd = d.getDate()
    return { yy, mm, dd }
  }
}


export default Calendar