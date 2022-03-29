// components/datePicker/datePicker.js

import Calendar from '../../utils/calendar/index'
const Calen = new Calendar()
const SWIPER_INDEX = 1  // swiper 默认索引
const MONTH_INDEX  = 10 // 从listMonth列表中取出 本月数据; (不需要确认是哪一天，只要是本月即可)

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    timestamp: {
      type: String,
      value: `${new Date().getTime()}`
    },
    showLunar: {
      type: Boolean,
      value: false,
    },
    showPred: {
      type: Boolean,
      value: true
    },
    mask: {
      type:Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    weeks   : Calen.weeks, // 星期
    showDate: '',
    calendar: {}, // 每天的信息
    current: SWIPER_INDEX,  // 计算swiper 左滑or右滑
    dayIndex: 0, // 日索引
    dayType: 'curr', // last:上月, curr:本月, next:下月, 

    listMonth: [], // 三个月的日历的信息
    listIndex: SWIPER_INDEX, // listData的索引
    listData: [],  // 月列表

    isShow: 0, //是否打开 datePicker 组件 0:真关闭 1:打开 2:伪关闭
  },

  lifetimes: {
    attached: function() {
      // this.open()
      this.checkPred(this.data.timestamp)
      
    }
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    
    // 对外实例方法 - 调用实例打开组件
    open: function() {
      this.showDatePicker()
    },

    /**
     * -------------------------------
     * -------------------------------
     * -------------------------------
     * -------------------------------
     * 分割线 - 分割线
     * 
     * 下面是 私有方法！ 不要随意调用哦！！！
     */

    // 打开 或 关闭 datePicker 组件
    showDatePicker: function() {
      let show = this.data.isShow

      if (!show) this.data.isShow = 1
      else if (show === 1) this.data.isShow = 2
      else if (show === 2) this.data.isShow = 1

      this.setData({
        isShow: this.data.isShow
      }, () => {
        if (this.data.isShow === 1) this.create()
        // else this.destroy()
      })
    },

    // 是否开启遮罩层关闭
    maskShowDatePicker: function() {
      if (!this.data.mask) return

      this.showDatePicker()
    },

     // 创建 日期
     create: function() {
      // if (this.data.showLunar) {
      //   SOLAR_TERMS = Canlr.getSolarTerms(this.data.YEAR)
      // }
      // console.log(new Date(this.data.timestamp), '--')
      const d = this.data.showDate ? new Date(this.data.showDate) : new Date()
      this.setListMonth(d)
    },

    // 组件销毁时、清空索引
    destroy: function() {
      this.data.calendar = {}
      this.data.current = SWIPER_INDEX
      this.data.dayIndex = 0
      this.data.dayType = 'curr'
      this.data.listMonth = []
      this.data.listIndex = SWIPER_INDEX,
      this.data.listData = []
      this.setData({ 
        calendar: this.data.calendar,
        current: this.data.current,
        dayIndex: this.data.dayIndex,
        dayType: this.data.dayType,
        listMonth: this.data.listMonth,
        listIndex: this.data.listIndex,
        listData: this.data.listData
       })
    },
    
    // 检查时间戳是否正确
    checkPred: function(t) {
      if (isNaN(t)) {
        this.showErr('请输入13位时间戳')
      } else if (t.length !== 13) {
        this.showErr('请输入13位时间戳')
      }
      const d = Calen.getFormat(new Date(Number(t)))
      this.setData({
        showDate: `${d.yy}-${d.mm}-${d.dd}`
      })
    },


    // 获取三个月的日历信息
    setListMonth: function(date) {
      const { last, curr, next } = Calen.getAdjacentMonths(date)
      const lastMonth = Calen.getDays(last.yy, last.mm)
      const currMonth = Calen.getDays(curr.yy, curr.mm)
      const nextMonth = Calen.getDays(next.yy, next.mm)

      const currIndex = this.data.listIndex
      const lastIndex = this.cleanListIndex(currIndex - 1)
      const nextIndex = this.cleanListIndex(currIndex + 1)
  
      this.renderCalendar(curr.yy, curr.mm, curr.dd, currMonth, 0)
      this.setData({
        ['listData[' + lastIndex + ']'] : lastMonth,
        ['listData[' + currIndex + ']'] : currMonth,
        ['listData[' + nextIndex + ']'] : nextMonth,
      })
      this.data.listMonth[lastIndex]  = lastMonth
      this.data.listMonth[currIndex]  = currMonth
      this.data.listMonth[nextIndex]  = nextMonth
    },

     // 监听swiper change事件
     onCallbackSwiperChange: function(event) {
      const dotIndex = event.detail.current
      this.data.listIndex = dotIndex
      let dotItem = {}
      let curDays = {}

      dotItem = this.data.listMonth[dotIndex]
      curDays = dotItem[MONTH_INDEX]

      const newDay = Calen.months[curDays.month - 1]
      const day    = this.data.calendar.day
      curDays.day  = day > newDay ? newDay : day

      this.renderCalendar(curDays.year, curDays.month, curDays.day, dotItem)
      this.getNextMonth(dotIndex, curDays.time)
    },

     // 获取下下月的日历信息
     getNextMonth: function(dotIndex, time, render) {

      const { dotNewIndex, direction } = this.isTouchDirection(dotIndex)
      let d = new Date(time)

      if (direction === 'left') d.setMonth(d.getMonth() + 1)
      else d.setMonth(d.getMonth() - 1)

      d = new Date(d.getTime())
      const day = Calen.getDays(d.getFullYear(), d.getMonth() + 1)

      this.setDays('listMonth', dotNewIndex, day, render)
    },

    /**
     * 获取触摸方向
     * @param {number} dotIndex 当前swiper的索引
     * @returns {object} { dotNewIndex: 下下月或者上上月的索引, direction: 触摸方向 }
     */
    isTouchDirection: function(dotIndex) {
      dotIndex -= this.data.current

      let dotNewIndex = SWIPER_INDEX // 下下月或者上上月的索引
      let direction = '' // 触摸方向

      // 左滑
      if (dotIndex > 0 && dotIndex < 2) {
        this.data.current++
        if (this.data.current === 2) this.data.current = -1

        dotNewIndex = this.data.current + 1
        direction = 'left'
      } 
      // 右滑
      else {
        this.data.current--
        if (this.data.current === -1) this.data.current = 2
        if (this.data.current === 2) this.data.current = -1
        if (this.data.current === -2) this.data.current = 1

        dotNewIndex = this.data.current === 1 ? 0 : this.data.current + 2
        direction = 'right'
      }

      return { dotNewIndex, direction }
    },




    /**
     * 切换月份后、获取同一天的索引
     * @param {number | string} y 阳历年
     * @param {number | string} m 阳历月 1 - 12
     * @param {number | string} d 阳历日
     */
    renderCalendar: function (y, m, d, dotItem, timer = 500) {
      const time = new Date([y, m, d].join('-')).getTime()
      const dayIndex = dotItem.findIndex(s => s.time === time)
      setTimeout(() => { this.setCalendar(dayIndex, dotItem) }, timer)
    },

    /**
     * 渲染当天的阳历、农历日期
     * @param {number} dayIndex 日索引
     * @param {object} item 当前索引的值
     */
    setCalendar: function(dayIndex, item) {
      this.data.dayIndex = dayIndex
      this.setData({
        dayIndex,
        ['calendar.day']: item[dayIndex].day,
        ['calendar.year']: item[dayIndex].year,
        ['calendar.month']: item[dayIndex].month,
        ['calendar.lunar']: item[dayIndex].lunar,
        ['calendar.item']: item[dayIndex]
      })
    },

    setListIndex: function() {
      this.setData({ listIndex: this.data.listIndex })
    },

    // 切换swiper时、更新下下个swiper的日历信息
    setDays: function(listKey, index, day) {
      this.data[listKey].splice(index, 1, day)

      this.setData({
        ['listData[' + index + ']']: this.data[listKey][index],
      })
    },

    // 清洗swiper Index
    cleanListIndex: function(index) {
      let i = index
    
      if (this.data.dayType === 'next') i += 1
      else if (this.data.dayType === 'last') i -= 1

      if (i === 3) i = 0
      if (i === -1) i = 2

      return i
    },

    // 选择日期
    selectDate: function (event) {
      const { i, index } = event.currentTarget.dataset

      const dotItem = this.data.listMonth[i]
      const curMonth = this.data.listMonth[i][MONTH_INDEX]
      const curDays = dotItem[index]
      const isCurr = curMonth.month === curDays.month
      
      // 在周模式下、选择上月或者下月不跳转swiper
      if (isCurr) {
        this.setCalendar(index, dotItem)
      }

      if (isCurr) {
        this.data.dayType = 'curr'  // 本月
      } else {
        const nowMon = new Date([curMonth.year, curMonth.month, 1].join('-'))
        const target = new Date(curDays.time)

        if (nowMon < target) this.data.dayType = 'next'   // 下个月
        else this.data.dayType = 'last'  // 上个
        this.data.listIndex = this.cleanListIndex(this.data.listIndex)
        this.data.calendar.day = curDays.solar.day
        this.setListIndex()
      }
    },
    
    /**
     * 上一年 or 下一年
     * @param {Object} event 标签属性 
     */
    changeYear: function(event) {
      const { index:i } = event.currentTarget.dataset
      if (i === '+1') this.data.YEAR += 1
      else this.data.YEAR -= 1

      index = 0
      this.data.days = []
      this.setData({
        days: this.data.days,
        ['domDate.yy']: this.data.YEAR,
      })
      this.create()
    },


    /**
     * 新版
     * 上一月 or 下一月
     * @param {Object} event 标签属性 
     */
    changeMonthNew: function(event) {
      const { index: i } = event.currentTarget.dataset

      let y = this.data.YEAR, 
          m = this.data.MONTH;
      
      let  n = new Date(`${y}-${m === 0 ? '01' : m}-01`)

      if (i === '-1') n.setMonth(m - 1) 
      else n.setMonth(m + 1)
      

      this.data.YEAR = n.getFullYear()
      this.data.MONTH = n.getMonth()

      index = 0
      this.data.days = []
      this.setData({
        days: this.data.days,
        ['domDate.yy']: this.data.YEAR,
        ['domDate.mm']: Canlr.padStart(this.data.MONTH + 1)
      })
      this.create()
    },


    // 清空事件
    clear: function() {
      this.setData({ 
        showDate: ''
      })

      this.change()
    },

    // 确认事件
    confirm: function() {
      /**
       * bindchange: 点击确认
       */
      this.setData({
        showDate: this.data.calendar.item.date
      })
      this.change()
    },

    change: function() {
      this.triggerEvent('change', this.data.calendar.item)
      this.showDatePicker()
    },

    showErr: function(err) {
      throw new Error(err)
    }
  }
})