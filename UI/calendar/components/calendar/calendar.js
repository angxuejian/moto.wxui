// components/calendar/calendar.js
import { Canlendar } from './util'

const Canlr = new Canlendar()
const date  = new Date()        ,
      year  = date.getFullYear(),
      month = date.getMonth() + 1   ,
      day   = date.getDate()    ;

const time        = new Date(`${year}-${month + 1}-${day}`).getTime()
const SOLAR_TERMS = Canlr.getSolarTerms(year) // 24节气 对应时间表

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
        solar : Canlr.padStart(d)               ,
        time  : t                               ,
        color : color                           ,
        lunar : Canlr.solar_to_lunar(year, m, d),
        terms : SOLAR_TERMS[`${Canlr.padStart(m)}${Canlr.padStart(d)}`]         ,
        bColor: bColor                          ,
      })

      if (this.data.days.length === 42) {
        this.setData({ 
          days : this.data.days
        })
        this.domTotalCalendar()
      }
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
        lunar: Canlr.solar_to_lunar(y, m, d, true),
      })
    },
  }
})