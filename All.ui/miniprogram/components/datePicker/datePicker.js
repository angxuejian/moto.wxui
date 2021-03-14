// components/datePicker/datePicker.js
import { Canlendar } from './date'

const Canlr = new Canlendar()

// 计算日期的 年月日
let year  = '' // 年
let month = '' // 月
let day   = '' // 日

let index = 0  // 索引

let todayTime   = '' // 获取当天的时间戳
let SOLAR_TERMS = [] // 24节气 对应时间表

const sColor = '#438EDB' // 选择的颜色
const tColor = '#333333' // 当月的颜色
const nColor = '#c8ccd6' // 非当月颜色


import { LUNAR_FESTIVAL, SOLAR_FESTIVAL } from './config'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    predefined: {
      type: String,
      value: `${new Date().getTime()}`
    },
    showLunar: {
      type: Boolean,
      value: false,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    weeks   : ['日', '一', '二', '三', '四', '五', '六'], // 星期
    months  : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], // 阳历月份

    days    : [],  // 日期数组
    itoday  : 0 ,  // 当前索引

    festival: '', // 节日
    domDate : {
      y: '',
      m: '',
      d: '',
      date: ''
    }, // dom 节点上的 年月日

    isShow: 0, //是否打开 datePicker 组件 0:真关闭 1:打开 2:伪关闭
  },

  lifetimes: {
    attached: function() {
      this.initDom(this.data.predefined)
    }
  },
  
  /**
   * 组件的方法列表
   */
  methods: {

    // 打开或关闭 datePicker 组件
    showDatePicker: function() {
      let show = this.data.isShow

      if (!show) this.data.isShow = 1
      else if (show === 1) this.data.isShow = 2
      else if (show === 2) this.data.isShow = 1

      this.setData({
        isShow: this.data.isShow
      }, () => {
        if (this.data.isShow === 1) this.open()
        else this.close()
      })
    },

    // 打开组件
    open: function() {
      if (this.data.showLunar) {
        SOLAR_TERMS = Canlr.getSolarTerms(year)
      }

      this.init(year, month)
    },

    // 组件关闭时、清空索引
    close: function() {
      index = 0
      this.data.days   = []
      this.data.itoday = index

      this.setData({ 
        days: this.data.days,
        itoday: this.data.itoday
       })
    },


    // 初始化 dom 节点信息
    initDom: function(t, isDom = true) {
      Canlr.getYY_MM_DD(t).then(res => {
        const { yy, mm, dd, time } = res
        year  = yy
        month = mm
        day   = dd
        
        todayTime = time
        isDom && this.domTotalCalendar()

      })
    },

    /**
     * 初始化 阳历 + 获取农历
     * @param {number} y 年份
     * @param {number} m 月份 0-11
     */
    init: function (y, m, set) {
      if (m === 1) this.leapMonth()
      const monday = new Date(`${y}-${m + 1}-01`).getDay()

      // 补齐 月初之前的空白
      const sLength = this.data.months[m] - monday
      for (let i = sLength; i < this.data.months[m]; i++) {
        this.domCalendar({
          m    : m,
          d    : i     ,
          color: nColor,
        })
      }

      // 当月的日期
      for (let i = 0; i < this.data.months[m]; i++) {
        this.domCalendar({
          m    : m + 1,
          d    : i + 1    ,
          color: tColor,
        })
      }

      // 补齐 月底之后的空白
      const elength = 42 - this.data.days.length
      for (let i = 0; i < elength; i++) {
        this.domCalendar({
          m    : m + 2,
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
      const { y, m } = Canlr.clearMonth(year, params.m)
      const { d } = params

      const t = new Date(`${y}-${m}-${d}`).getTime()

      let { color } = params // 阳历字体颜色
      let l_color   = ''     // 节假日字体颜色
      
      if (t === todayTime) { 
        color  = tColor 

        this.data.itoday = index
        this.setData({
          itoday: this.data.itoday
        })
        index = 0
      } else {
        index++
      }

      let lunar = {} // 阴历日期、节日等
      let today = [] // 清洗后的 阴历、节日信息

      // 是否加载 阴历信息
      if (this.data.showLunar) {
        lunar =  Canlr.solar_to_lunar(y, m, d)

        // 0:阴历日期、1:节气 2:阴历节日、3: 阳历节日
        const s_fes = `${Canlr.padStart(m)}${Canlr.padStart(d)}`,
              l_fes = lunar.fes.join(' ').replace(/\s*/ig, '');

        today = [
          lunar.day,             // 阴历日期
          SOLAR_TERMS[s_fes],    // 节气
          LUNAR_FESTIVAL[l_fes], // 阴历节日
          SOLAR_FESTIVAL[s_fes], // 阳历节日
        ].filter( a => a && a )

        if(today.length > 1) l_color = sColor
      }

      let mm = Canlr.padStart(m)
      let dd = Canlr.padStart(d)

      this.data.days.push({
        solar  : dd, // 日
        time   : t , // 时间戳
        today  : today  , // 节日信息

        s_color: color  , // 阳历颜色
        l_color: l_color, // 阴历颜色

        s_date : `${y}-${mm}-${dd}`, // 阳历日期
        l_date : lunar.date, // 阴历日期
      })


      if (this.data.days.length === 42) {

        this.setData({ days: this.data.days })
      }
    },

  
    /**
     * 渲染当天的阳历、农历日期
     * @param {number | string} y 阳历年
     * @param {number | string} m 阳历月
     * @param {number | string} d 阳历日
     */
    domTotalCalendar: function(y = year, m = month + 1, d = day) {
      const list = [m, d].map(s => Canlr.padStart(s))
      const data = {
        y,
        m: list[0],
        d: list[1],
        date: `${y}-${list[0]}-${list[1]}`
      }

      this.setData({ domDate: data })
    },


    /**
     * 选择日期
     */
    selectDate: function(event) {
      const { index } = event.currentTarget.dataset

      if (!this.data.days[index].time) return false;
      
      this.data.itoday = index
      this.setData({
        itoday: this.data.itoday
      })
    },

    
    /**
     * 上一年 or 下一年
     * @param {Object} event 标签属性 
     */
    changeYear: function(event) {
      const { index:i } = event.currentTarget.dataset
      if (i === '+1') year += 1
      else year -= 1

      index = 0
      this.data.days = []
      this.setData({
        days: this.data.days,
        ['domDate.y']: year,
      })
      this.open()
    },


    changeMonth: function(event) {
      
      const { index: i } = event.currentTarget.dataset

      let y = year, 
          m = month;

      if (month > 11 && i === '-1') {
        y = year + 1
        m = 0
      } else if(month >= 11 && i === '+1') {
        y = year + 1
        m = 0
      } else if (month < 0 && i === '+1') {
        y = year - 1
        m = 11
      } else if (month <= 0 && i === '-1') {
        y = year - 1
        m = 11
      } else {
        if (i === '+1') m++
        else m--
      }

      year = y
      month = m
  
      index = 0
      this.data.days = []
      this.setData({
        days: this.data.days,
        ['domDate.y']: year,
        ['domDate.m']: Canlr.padStart(month + 1)
      })
      this.open()

      

      console.log(y, m)
    },


    // 清空事件
    clear: function() {

      this.data.domDate.date = ''
      this.setData({ 
        ['domDate.date']: this.data.domDate.date 
      })

      this.initDom(new Date(), false)
      this.change()
    },

    // 确认事件
    confirm: function() {
      /**
       * bindchange: 点击确认
       */
      const current = this.data.days[this.data.itoday]
      const fes = current.today[1] ? current.today.slice(1) : []


      this.initDom(current.time)
      this.change(current, fes)
    },

    change: function(current = {}, fes = '') {

      const data = {
        time : current.time,
        solor: current.s_date,
        lunar: current.l_date,
        festival: fes
      }
      this.triggerEvent('change', data)
      this.showDatePicker()
    },
  }
})