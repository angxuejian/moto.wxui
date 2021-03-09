// components/calendar/calendar.js
import { Canlendar } from './util'

const Canlr = new Canlendar()
const date  = new Date()        ,
      year  = date.getFullYear(),
      month = date.getMonth()   ,
      day   = date.getDate()    ;

const time = new Date(`${year}-${month + 1}-${day}`).getTime() // 获取当天的时间戳

let index = 0 // 获取当天的索引

const sColor = '#438EDB' // 选择的颜色
const nColor = '#c8ccd6' // 非当月颜色
const tColor = '#373C52' // 当月的颜色

const SOLAR_TERMS = Canlr.getSolarTerms(year) // 24节气 对应时间表
import { LUNAR_FESTIVAL, SOLAR_FESTIVAL } from './config'

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
    weeks   : ['日', '一', '二', '三', '四', '五', '六'], // 星期
    months  : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], // 阳历月份
    days    : [], // 日期数组
    itoday  : 0 , // 今天的索引
    festival: '', // 节日
  },


  attached: function () {
    this.init(year, month)
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 初始化 阳历 + 获取农历
     * @param {number} y 年份
     * @param {number} m 月份 0-11
     */
    init: function (y, m) {
      if (m === 1) this.leapMonth()
      const monday = new Date(`${y}-${m + 1}-01`).getDay()

      // 补齐 月初之前的空白
      const sLength = this.data.months[m] - monday
      for (let i = sLength; i < this.data.months[m]; i++) {
        this.domCalendar({
          m    : month    ,
          d    : i        ,
          color: nColor,
        })
      }

      // 当月的日期
      for (let i = 0; i < this.data.months[m]; i++) {
        this.domCalendar({
          m    : month + 1,
          d    : i + 1    ,
          color: tColor,
        })
      }

      // 补齐 月底之后的空白
      const elength = 42 - this.data.days.length
      for (let i = 0; i < elength; i++) {
        this.domCalendar({
          m    : month + 2,
          d    : i + 1    ,
          color: nColor,
        })
      }
    },

    /**
     * 阳历 确认二月份 是28天还是29天
     */
    leapMonth: function () {
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        this.data.months[1] = 29
      }
    },

    /**
     * 获取阳历 + 合并农历 + 并渲染数据
     * @param {object} params 
     * @param {number} params.m 月
     * @param {number} params.d 日
     * @param {string} params.color 颜色代码
     */
    domCalendar: function (params) {
      const { m, d } = params
      const t = new Date(`${year}-${m}-${d}`).getTime()

      let { color } = params // 阳历字体颜色
      let l_color   = ''     // 节假日字体颜色
      
      if (t === time) {
        color  = tColor

        this.data.itoday = index
        this.setData({
          itoday: this.data.itoday
        })
        index = 0
      } else {
        index += 1
      }

      const lunar =  Canlr.solar_to_lunar(year, m, d)

      // 0:阴历日期、1:节气 2:阴历节日、3: 阳历节日
      const s_fes = `${Canlr.padStart(m)}${Canlr.padStart(d)}`,
            l_fes = lunar.fes.join(' ').replace(/\s*/ig, '');

      const today = [
        lunar.day,             // 阴历日期
        SOLAR_TERMS[s_fes],    // 节气
        LUNAR_FESTIVAL[l_fes], // 阴历节日
        SOLAR_FESTIVAL[s_fes], // 阳历节日
      ].filter( a => a && a )

      if(today.length > 1) l_color = sColor

      this.data.days.push({
        solar  : Canlr.padStart(d),
        time   : t      ,
        color  : color  ,
        today  : today  ,
        l_color: l_color,
      })

      
      if (this.data.days.length === 42) {
        let list  = this.data.days[this.data.itoday].today
        let isFes = list.length > 1 ? list : []
        isFes.shift()

        this.setData({ 
          days     : this.data.days,
          festival : isFes.join('、')
        })
        this.domTotalCalendar()
      }
    },

  
    /**
     * 渲染当天的阳历、农历日期
     * @param {number | string} y 阳历年
     * @param {number | string} m 阳历月
     * @param {number | string} d 阳历日
     */
    domTotalCalendar: function(y = year, m = month + 1, d = day) {
      this.setData({ 
        year : y                                 ,
        month: m                                 ,
        lunar: Canlr.solar_to_lunar(y, m, d, true),
      })
    },


    /**
     * 选择日期
     */
    selectDate: function(event) {
      const { index } = event.currentTarget.dataset

      this.data.itoday = index
      this.setData({
        itoday: this.data.itoday
      })
    }
  }
})