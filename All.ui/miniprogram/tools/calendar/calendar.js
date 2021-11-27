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
    SOLAR_TERMS: {}, // 24节气 对应时间表
    isARow: false,
    offsetRow: 0,
    current: 1
  },


  attached: async function () {

    const last = await Calen.getDays(2021, 10)
    const curr = await Calen.getDays(2021, 11)
    const next = await Calen.getDays(2021, 12)
    
    this.renderCalendar(2021, 11, 27)
    this.setData({
      listDay: [last, curr, next],
    })
  },


  /**
   * 组件的方法列表
   */
  methods: {

    setCurrentDay: async function(event) {

      const { current } = event.detail
      const curDays = this.data.listDay[current]
      const dayTime = new Date(curDays[10].time)
      const axis = current - this.data.current

      let index = 1

      if (axis > 0 && axis < 2) {
        this.data.current++
        if (this.data.current === 2) this.data.current = -1

        index = this.data.current + 1
        dayTime.setMonth(dayTime.getMonth() + 1)
      } else {
        this.data.current--
        if (this.data.current === -1) this.data.current = 2
        if (this.data.current === 2) this.data.current = -1
        if (this.data.current === -2) this.data.current = 1

        index = this.data.current === 1 ? 0 : this.data.current + 2
        dayTime.setMonth(dayTime.getMonth() - 1)
      }

      const d = new Date(dayTime.getTime())
      const day = await Calen.getDays(d.getFullYear(), d.getMonth() + 1)

      if (current === 2) this.setDays(index, day)
      else if (current === 0) this.setDays(index, day)
      else if (current === 1) this.setDays(index, day)

      // this.renderCalendar(curDays)
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
      console.log(calendar, '')
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