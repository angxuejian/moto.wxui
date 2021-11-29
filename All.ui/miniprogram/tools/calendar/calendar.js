// components/calendar/calendar.js
const app = getApp()

import { Calendar } from './main'
const Calen = new Calendar()

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
    isARow: false,
    offsetRow: 0,
    calendar: {}, // 每天的信息

    current: 1,  // 计算swiper 左滑or右滑
    dayIndex: 0, // 日索引
    listMonth: [], // 三个月的日历的信息
    monthIndex: 1, // 月索引
  },


  attached: async function () {
    const { last, curr, next } = Calen.getAdjacentMonths(new Date())

    const lastMonth = await Calen.getDays(last.yy, last.mm)
    const currMonth = await Calen.getDays(curr.yy, curr.mm)
    const nextMonth = await Calen.getDays(next.yy, next.mm)

    this.renderCalendar(curr.yy, curr.mm, curr.dd, currMonth)
    this.setData({
      listMonth: [lastMonth, currMonth, nextMonth],
    })
  },


  /**
   * 组件的方法列表
   */
  methods: {

    setCurrentDay: function(event) {
      const dotIndex = event.detail.current
      const dotItem = this.data.listMonth[dotIndex]
      const curDays = dotItem[10]

      this.data.monthIndex = dotIndex

      if (this.data.calendar.day > Calen.months[curDays.month - 1]) {
        this.data.calendar.day = Calen.months[curDays.month - 1]
      }

      this.renderCalendar(curDays.year, curDays.month, this.data.calendar.day, dotItem)
      this.getNextMonth(dotIndex, curDays.time)
    },

    // 获取下下月的 日历信息
    getNextMonth: async function(dotIndex, time) {
      const nextMonth = new Date(time)
      const axis = dotIndex - this.data.current

      let dayIndex = 1
      // 左滑
      if (axis > 0 && axis < 2) {
        this.data.current++
        if (this.data.current === 2) this.data.current = -1

        dayIndex = this.data.current + 1
        nextMonth.setMonth(nextMonth.getMonth() + 1)
      } 
      // 右滑
      else {
        this.data.current--
        if (this.data.current === -1) this.data.current = 2
        if (this.data.current === 2) this.data.current = -1
        if (this.data.current === -2) this.data.current = 1

        dayIndex = this.data.current === 1 ? 0 : this.data.current + 2
        nextMonth.setMonth(nextMonth.getMonth() - 1)
      }

      const d = new Date(nextMonth.getTime())
      const day = await Calen.getDays(d.getFullYear(), d.getMonth() + 1)
      const setDays = () => {
        this.data.listMonth.splice(dayIndex, 1, day)
        this.setData({
          ['listMonth[' + dayIndex + ']']: this.data.listMonth[dayIndex],
        })
      }

      if (dotIndex === 2) setDays()
      else if (dotIndex === 0) setDays()
      else if (dotIndex === 1) setDays()
    },

    /**
     * 渲染当天的阳历、农历日期
     * @param {number | string} y 阳历年
     * @param {number | string} m 阳历月 1 - 12
     * @param {number | string} d 阳历日
     */
    renderCalendar: function (y, m, d, dotItem) {

      const time = new Date([y, m, d].join('-')).getTime()
      const dayIndex = dotItem.findIndex(s => s.time === time)
      setTimeout(() => { this.setCalendar(dayIndex, dotItem) }, 500)
    },
    
    /**
     * 选择日期
     */
    selectDate: function (event) {
      const { i, index } = event.currentTarget.dataset

      const dotItem = this.data.listMonth[i]
      const curDays = dotItem[index]

      const nowMon = new Date([this.data.calendar.year, this.data.calendar.month, 1].join('-'))
      const target = new Date(curDays.time)

      if (this.data.calendar.month === curDays.month) {
        this.setCalendar(index, dotItem)
      } else {

        if (nowMon < target) this.data.monthIndex += 1
        else this.data.monthIndex -= 1

        if (this.data.monthIndex === 3) this.data.monthIndex = 0
        if (this.data.monthIndex === -1) this.data.monthIndex = 2

        this.data.calendar.day = curDays.day
        this.setMonthIndex()
      }
    },

    setCalendar: function(dayIndex, item) {
      this.data.dayIndex = dayIndex
      this.setData({
        dayIndex,
        ['calendar.day']: item[dayIndex].day,
        ['calendar.year']: item[dayIndex].year,
        ['calendar.month']: item[dayIndex].month,
        ['calendar.lunar']: item[dayIndex].lunar,
      })
    },

    setMonthIndex: function() {
      this.setData({ monthIndex: this.data.monthIndex })
    },

    selectARow: function () {
      this.data.isARow = !this.data.isARow

      if (this.data.isARow) {
        // 单行高度为 55px
        this.data.offsetRow = parseInt(this.data.dayIndex / 7) * 55
      } else {
        this.data.offsetRow = 0
      }

      this.setData({
        isARow: this.data.isARow,
        offsetRow: this.data.offsetRow
      })
    },
  }
})