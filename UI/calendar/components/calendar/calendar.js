// components/calendar/calendar.js
const date  = new Date()        ,
      year  = date.getFullYear(),
      month = date.getMonth()   ,
      day   = date.getDate()    ;

const time = new Date(`${year}-${month + 1}-${day}`).getTime()
import { lunarArr, BASIS, LUNAR_MONTH, LUNAR_DAY, SHENGXIAO, TIANGAN, DIZHI } from './config'

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    weeks: ['日', '一', '二', '三', '四', '五', '六'], // 星期
    months: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], // 阳历月份
    days: [], // 日期数组
  },


  attached: function () {
    this.init(year, month)
  },

  /**
   * 组件的方法列表
   */
  methods: {

    // 初始化 阳历 + 获取农历
    init: function (y, m) {
      /*
        y: number => 年份
        m: number => 月份 0-11
      */

      if (m === 1) this.leapMonth()
      const monday = new Date(`${y}-${m + 1}-01`).getDay()

      // 补齐 月初之前的空白
      const sLength = this.data.months[m] - monday
      for (let i = sLength; i < this.data.months[m]; i++) {
        this.domCalendar({
          m    : month    ,
          d    : i        ,
          color: '#c8ccd6',
        })
      }

      // 当月的日期
      for (let i = 0; i < this.data.months[m]; i++) {
        this.domCalendar({
          m    : month + 1,
          d    : i + 1    ,
          color: '#373C52',
        })
      }

      // 补齐 月底之后的空白
      const elength = 42 - this.data.days.length
      for (let i = 0; i < elength; i++) {
        this.domCalendar({
          m    : month + 2,
          d    : i + 1    ,
          color: '#c8ccd6',
        })
      }
    },

    // 阳历 确认二月份 是28天还是29天
    leapMonth: function () {
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        this.data.months[1] = 29
      }
    },

    // 获取阳历 + 合并农历 + 并渲染数据
    domCalendar: function (params) {
      /*
        params: {
          m    : number  => 月
          d    : number  => 日
          color: string  => 颜色代码
        }
      */
      const { m, d } = params
      const t    = new Date(`${year}-${m}-${d}`).getTime()
      let bColor = ''
      let { color } = params
      
      if (t === time) {
        color  = '#fff'
        bColor = '#5B7CFF'
      }
      this.data.days.push({
        solar : this.padStart(d)               ,
        time  : t                              ,
        color : color                          ,
        lunar : this.solar_to_lunar(year, m, d),
        bColor: bColor                         ,
      })

      if (this.data.days.length === 42) {
        this.setData({ 
          days : this.data.days
        })
        this.domTotalCalendar()
      }
    },

    // 将日期统一转为2位数
    padStart: function(n) {
      n = n.toString()
      return n.padStart(2, 0)
    },

    // 渲染当天的阳历、农历日期
    domTotalCalendar: function(y = year, m = month + 1, d = day) {
      /*
        y: number | string => 阳历年
        m: number | string => 阳历月
        d: number | string => 阳历日
      */

      this.setData({ 
        year : y                                 ,
        month: m                                 ,
        lunar: this.solar_to_lunar(y, m, d, true),
      })
    },

// ---- 农历


    // 阳历 转 农历
    solar_to_lunar: function (sy, sm, sd, done) {
      /*
        sy  : number  => 阳历年
        sm  : number  => 阳历月 0-11
        sd  : number  => 阳历日
        done: boolear => 是否return 年月日
      */
      sm -= 1
      let ly, lm, ld;
      let day_diff = (Date.UTC(sy, sm, sd) - Date.UTC(1949, 0, 29)) / (24 * 60 * 60 * 1000) + 1;

      // 农历年
      for (let i = 0; i < lunarArr.length; i++) {
        let bly = this.clear_binary(lunarArr[i])

        day_diff -= this.lunar_year(bly)
        if (day_diff <= 0) {
          ly = BASIS + i
          day_diff += this.lunar_year(bly)
          break;
        }
      }

      // 农历月
      const blm = this.clear_binary(lunarArr[ly - BASIS])
      const monthDay = this.month_day(blm)
      for (let i = 0; i < monthDay.length; i++) {
        day_diff -= monthDay[i]
        if (day_diff <= 0) {
          if (monthDay.length === 13) {
            let m = this.leap_month(blm)
            if (m < i) lm = i
            else if (m === i) lm = `闰${m}`
            else lm = i + 1
          } else {
            lm = i + 1
          }
          ld = day_diff += monthDay[i]
          break
        }
      }
      return this.clear_day(ly, lm, ld, done)
    },


    // 计算 农历每一年的天数
    lunar_year: function (ly) {
      /*
        ly: string => 2进制农历年
      */
      let day = 0
      const yearDay = this.month_day(ly)

      for (let i = 0; i < yearDay.length; i++) {
        day += yearDay[i]
      }
      return day
    },

    // 农历 确认每个月的天数
    month_day: function (ly) {
      /*
        ly: string => 2进制农历年
      */
      let monthArr = []

      const arr = Array.from(ly.slice(ly.length - 16, ly.length - 4))
      for (let i = 0; i < arr.length; i++) {
        monthArr.push(Number(arr[i]) ? 30 : 29)
      }

      // 是否有闰月
      if (this.leap_month(ly)) {
        monthArr.splice(this.leap_month(ly), 0, this.leap_day(ly))
      }
      return monthArr
    },

    // 农历 确认是否闰月
    leap_month: function (ly) {
      /*
        ly: string => 2进制农历年
      */
      const monthDay = ly.slice(ly.length - 4)
      return parseInt(monthDay, 2)
    },

    // 农历 确认闰月是 大月(30天)还是小月(29天) 
    leap_day: function (ly) {
      /*
        ly: string => 2进制农历年
      */
      return ly.length > 16 ? 30 : 29
    },

    // 10进制 转 2进制
    clear_binary: function (ly) {
      /*
        ly: string => 10进制农历年
      */
      return ly.toString(2).padStart(16, 0)
    },

    // 清洗农历日期 将数字日期转为汉字
    clear_day: function(ly, lm, ld, done) {
      /*
        ly  : number          => 农历年
        lm  : number | string => 农历月 1-12 | 1-13
        ld  : number          => 农历日
        done: boolear         => 是否return 年月日
      */
      let cy, cm, cd;
      ld = ld.toString()
      if (ld == 1) { 
        cd = this.clear_cn_month(lm)

      } else if (ld >= 2 && ld <= 10) {
        cd = `${LUNAR_DAY[10]}${LUNAR_DAY[ld - 1]}`

      } else if (ld >= 11 && ld <= 19) {
        cd = `${LUNAR_DAY[9]}${LUNAR_DAY[ld[1] - 1]}`

      } else if (ld == 20 || ld == 30) {
        cd = `${LUNAR_DAY[ld[0] - 1]}${LUNAR_DAY[9]}`
        
      } else if (ld >= 21 && ld <= 29){
        cd = `${LUNAR_DAY[11]}${LUNAR_DAY[ld[1] - 1]}`
      }

      cm = this.clear_cn_month(lm)

      let tg, dz, sx;
      tg = TIANGAN[ly % 10]
      dz = DIZHI[ly % 12]
      sx = SHENGXIAO[ly % 12]
      cy = `${tg}${dz}${sx}年`

      // done && cd = this.clear_cn_month(lm, ld)
      // console.log(cy, cm, cd)

      if (!done) return cd
      else {
        cd = this.clear_cn_month(lm, ld)
        return `${cy} ${cm}${cd}`
      }
    },

    // 获取中文月份
    clear_cn_month: function(lm, ld) {
      /*
        lm: number => 农历月
        ld: number => 农历日
      */
      lm = lm.toString()
      let m = ''
      if (ld) {
        m = `${LUNAR_DAY[10]}${LUNAR_DAY[ld - 1]}`
      } else {
        if (/^闰/ig.test(lm)) {
          lm = lm.substring(1)
          m = `闰${LUNAR_MONTH[lm - 1]}月`
        } else {
          m = `${LUNAR_MONTH[lm - 1]}月`
        }
      }

      return m
    }
  }
})