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

    itoday: 0, // 今天的索引

    TODAY_INDEX: 0, // 获取当天的索引
    TIMESTAMP: 0, // 获取当天的时间戳
    isARow: false,
    offsetRow: 0,
    current: 1,
    listDay: []
  },


  attached: async function () {
    
    const { last, curr, next } = Calen.getAdjacentMonths(new Date())

    const lastMonth = await Calen.getDays(last.yy, last.mm)
    const currMonth = await Calen.getDays(curr.yy, curr.mm)
    const nextMonth = await Calen.getDays(next.yy, next.mm)

    console.log(nextMonth)
    this.renderCalendar(curr.yy, curr.mm, curr.dd)
    this.setData({
      listDay: [lastMonth, currMonth, nextMonth],
    })
  },


  /**
   * 组件的方法列表
   */
  methods: {

    setCurrentDay: async function(event) {

      const dotIndex = event.detail.current
      const curDays = this.data.listDay[dotIndex][10]
      const monthTime = new Date(curDays.time)
      const axis = dotIndex - this.data.current

      let index = 1

      if (axis > 0 && axis < 2) {
        this.data.current++
        if (this.data.current === 2) this.data.current = -1

        index = this.data.current + 1
        monthTime.setMonth(monthTime.getMonth() + 1)
      } else {
        this.data.current--
        if (this.data.current === -1) this.data.current = 2
        if (this.data.current === 2) this.data.current = -1
        if (this.data.current === -2) this.data.current = 1

        index = this.data.current === 1 ? 0 : this.data.current + 2
        monthTime.setMonth(monthTime.getMonth() - 1)
      }

      const d = new Date(monthTime.getTime())
      const day = await Calen.getDays(d.getFullYear(), d.getMonth() + 1)

      if (dotIndex === 2) this.setDays(index, day)
      else if (dotIndex === 0) this.setDays(index, day)
      else if (dotIndex === 1) this.setDays(index, day)

      const firstTime = [curDays.year, curDays.month, 1].join('-')

      const itoday = this.data.listDay[dotIndex].findIndex(item => item.date === firstTime)
      this.setData({
        itoday: itoday,
        calendar: {
          year: this.data.listDay[dotIndex][itoday].year,
          month: this.data.listDay[dotIndex][itoday].month,
          lunar: this.data.listDay[dotIndex][itoday].lunar
        }
      })
      // console.log(curDays)
      // this.renderCalendar(curDays.year, curDays.month, 1)
    },

    setDays: function(index, day) {
      this.data.listDay.splice(index, 1, day)
      this.setData({
        ['listDay[' + index + ']']: this.data.listDay[index],
      })
    },

    selectARow: function () {
      this.data.isARow = !this.data.isARow

      if (this.data.isARow) {
        // 单行高度为 55px
        this.data.offsetRow = parseInt(this.data.itoday / 7) * 55
      } else {
        this.data.offsetRow = 0
      }

      this.setData({
        isARow: this.data.isARow,
        offsetRow: this.data.offsetRow
      })
    },

    
    /**
     * 渲染当天的阳历、农历日期
     * @param {number | string} y 阳历年
     * @param {number | string} m 阳历月
     * @param {number | string} d 阳历日
     */
    renderCalendar: function (y, m, d) {

      const calendar = Calen.solar_to_lunar(y, m, d)
      this.setData({
        calendar
      })
    },


    /**
     * 选择日期
     */
    selectDate: function (event) {
      const {
        i, index
      } = event.currentTarget.dataset

      console.log(i, index)
      const calendar = this.data.listDay[i][index]

      this.setData({ calendar, itoday: index })
      return
      this.data.itoday = index
      this.setData({
        itoday: this.data.itoday
      })
    }
  }
})