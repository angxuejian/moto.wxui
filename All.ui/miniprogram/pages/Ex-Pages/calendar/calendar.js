// pages/Ex-Pages/calendar/calendar.js
const app = getApp()
import Calendar from '../../../utils/calendar/index'
const Calen = new Calendar(true)
const SWIPER_INDEX = 1 // swiper 默认索引
const MONTH_INDEX = 10 // 从listMonth列表中取出 本月数据; (不需要确认是哪一天，只要是本月即可)

Page({

  /**
   * 组件的初始数据
   */
  data: {
    isARow: false,
    offsetRow: 0, // margin-top 偏移量
    rowNumber: 0, // 行数

    weeks: ['日', '一', '二', '三', '四', '五', '六'], // 星期
    calendar: {}, // 每天的信息
    current: SWIPER_INDEX, // 计算swiper 左滑or右滑
    dayIndex: 0, // 日索引
    dayType: 'curr', // last:上月, curr:本月, next:下月, 

    listMonth: [], // 三个月的日历的信息
    listWeek: [], // 三个周的日历的信息

    listType: 'month', // week:周, month:月
    listIndex: SWIPER_INDEX, // listData的索引
    listData: [], // 月或者周列表
    listHeight: 0, // 列表高度; 
    dayHeight: 55, // .content高度 = 45高度 + 10上下外边距
  },


  onLoad: function () {
    this.setListMonth(new Date())
  },



  // 获取三个月的日历信息
  setListMonth: function (date) {
    const {
      last,
      curr,
      next
    } = Calen.getAdjacentMonths(date)
 
    const lastMonth = Calen.getDays(last.yy, last.mm)
    const currMonth = Calen.getDays(curr.yy, curr.mm)
    const nextMonth = Calen.getDays(next.yy, next.mm)
    console.log(lastMonth, 'zhix ? 2')
    const currIndex = this.data.listIndex
    const lastIndex = this.cleanListIndex(currIndex - 1)
    const nextIndex = this.cleanListIndex(currIndex + 1)

    console.log(currMonth, '??x')
    this.renderCalendar(curr.yy, curr.mm, curr.dd, currMonth, 0)
    this.setData({
      ['listData[' + lastIndex + ']']: lastMonth,
      ['listData[' + currIndex + ']']: currMonth,
      ['listData[' + nextIndex + ']']: nextMonth,
    })
    this.data.listMonth[lastIndex] = lastMonth
    this.data.listMonth[currIndex] = currMonth
    this.data.listMonth[nextIndex] = nextMonth
  },

  // 获取下下月的日历信息
  getNextMonth: function (dotIndex, time, render) {

    const {
      dotNewIndex,
      direction
    } = this.isTouchDirection(dotIndex)
    let d = new Date(time)

    if (direction === 'left') d.setMonth(d.getMonth() + 1)
    else d.setMonth(d.getMonth() - 1)

    d = new Date(d.getTime())
    const day = Calen.getDays(d.getFullYear(), d.getMonth() + 1)

    this.setDays('listMonth', dotNewIndex, day, render)
  },

  // 获取三个周的日历信息
  setListWeek: function () {
    const {
      listIndex,
      rowNumber
    } = this.data
    const {
      year,
      month,
      day
    } = this.data.calendar
    const {
      last,
      curr,
      next
    } = Calen.getAdjacentWeeks([year, month, day].join('-'))

    const lastWeek = Calen.getWeeks(last.yy, last.mm, last.dd, rowNumber)
    const currWeek = Calen.getWeeks(curr.yy, curr.mm, curr.dd, rowNumber)
    const nextWeek = Calen.getWeeks(next.yy, next.mm, next.dd, rowNumber)

    const lastIndex = this.cleanListIndex(listIndex - 1)
    const currIndex = this.data.listIndex
    const nextIndex = this.cleanListIndex(listIndex + 1)

    this.setData({
      ['listData[' + lastIndex + ']']: lastWeek,
      ['listData[' + currIndex + ']']: currWeek,
      ['listData[' + nextIndex + ']']: nextWeek,
    })
    this.data.listWeek[lastIndex] = lastWeek
    this.data.listWeek[currIndex] = currWeek
    this.data.listWeek[nextIndex] = nextWeek
  },

  // 获取下下周的日历信息
  getNextWeek: function (dotIndex, time) {

    const {
      dotNewIndex,
      direction
    } = this.isTouchDirection(dotIndex)
    let type = true

    if (direction === 'left') type = true
    else type = false

    const {
      yy,
      mm,
      dd
    } = Calen.getOnlyWeeks(time, type)
    const day = Calen.getWeeks(yy, mm, dd, this.data.rowNumber)

    this.setDays('listWeek', dotNewIndex, day)
  },


  // 监听swiper change事件
  onCallbackSwiperChange: function (event) {
    const dotIndex = event.detail.current
    this.data.listIndex = dotIndex
    let dotItem = {}
    let curDays = {}
    let func = ''

    if (this.data.listType === 'week') {
      dotItem = this.data.listWeek[dotIndex]
      curDays = this.data.listWeek[dotIndex][this.data.dayIndex]

      func = 'getNextWeek'
    } else {
      dotItem = this.data.listMonth[dotIndex]
      curDays = dotItem[MONTH_INDEX]

      const newDay = Calen.months[curDays.month - 1]
      const day = this.data.calendar.day
      curDays.day = day > newDay ? newDay : day

      func = 'getNextMonth'
    }

    this.renderCalendar(curDays.year, curDays.month, curDays.day, dotItem)
    this[func](dotIndex, curDays.time)
  },


  // 选择日期
  selectDate: function (event) {
    const {
      i,
      index
    } = event.currentTarget.dataset

    const dotItem = this.data.listMonth[i]
    const curMonth = this.data.listMonth[i][MONTH_INDEX]
    const curDays = dotItem[index]
    const isCurr = curMonth.month === curDays.month
    const isType = this.data.listType === 'week'

    // 在周模式下、选择上月或者下月不跳转swiper
    if (isType || isCurr) {
      this.setCalendar(index, dotItem)
    }

    if (isCurr) {
      this.data.dayType = 'curr' // 本月
    } else {
      const nowMon = new Date([curMonth.year, curMonth.month, 1].join('-'))
      const target = new Date(curDays.time)

      if (nowMon < target) this.data.dayType = 'next' // 下个月
      else this.data.dayType = 'last' // 上个

      if (!isType) {
        this.data.listIndex = this.cleanListIndex(this.data.listIndex)
        this.data.calendar.day = curDays.day
        this.setListIndex()
      }
    }
  },

  // 切换 周与月模式
  selectARow: function () {
    this.data.isARow = !this.data.isARow
    this.data.rowNumber = parseInt(this.data.dayIndex / 7)
    this.data.offsetRow = this.data.isARow ? this.data.rowNumber * this.data.dayHeight : 0

    this.setData({
      isARow: this.data.isARow,
      offsetRow: this.data.offsetRow
    })

    if (!this.data.isARow) {
      this.data.listType = 'month' // 月
      const {
        year,
        month,
        day
      } = this.data.calendar
      this.setListMonth([year, month, day].join('-'))
    } else if (this.data.isARow) {
      this.data.listType = 'week' // 周
      // if (this.data.offsetRow === 0) {
      this.onCallbackTransitionEnd()
      // }
    }
  },

  // 过渡结束过、在获取周日历信息
  onCallbackTransitionEnd: function () {
    if (this.data.listType === 'week') this.setListWeek()
  },

  /**
   * 获取触摸方向
   * @param {number} dotIndex 当前swiper的索引
   * @returns {object} { dotNewIndex: 下下月或者上上月的索引, direction: 触摸方向 }
   */
  isTouchDirection: function (dotIndex) {
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

    return {
      dotNewIndex,
      direction
    }
  },

  /**
   * 切换月份后、获取同一天的索引
   * @param {number | string} y 阳历年
   * @param {number | string} m 阳历月 1 - 12
   * @param {number | string} d 阳历日
   */
  renderCalendar: function (y, m, d, dotItem, timer = 500) {
    const time = new Date(Date.UTC(y,m,d)).getTime()
    console.log(dotItem, time, 'error')
    const dayIndex = dotItem.findIndex(s => s.time === time)
    setTimeout(() => {
      this.setCalendar(dayIndex, dotItem)
    }, timer)
  },

  /**
   * 渲染当天的阳历、农历日期
   * @param {number} dayIndex 日索引
   * @param {object} item 当前索引的值
   */
  setCalendar: function (dayIndex, item) {
    this.data.dayIndex = dayIndex
    this.setData({
      dayIndex,
      ['calendar.day']: item[dayIndex].day,
      ['calendar.year']: item[dayIndex].year,
      ['calendar.month']: item[dayIndex].month,
      ['calendar.lunar']: item[dayIndex].lunar,
      listHeight: this.setListHeight(item)
    })
  },

  // 切换swiper时、更新下下个swiper的日历信息
  setDays: function (listKey, index, day) {
    this.data[listKey].splice(index, 1, day)

    this.setData({
      ['listData[' + index + ']']: this.data[listKey][index],
    })
  },

  setListIndex: function () {
    this.setData({
      listIndex: this.data.listIndex
    })
  },

  setListHeight: function (list) {
    // 35: 月长度(35 or 42)
    // 275和330: .swiper高度
    return list.length === 35 ? 275 : 330
  },

  // 清洗swiper Index
  cleanListIndex: function (index) {
    let i = index

    if (this.data.dayType === 'next') i += 1
    else if (this.data.dayType === 'last') i -= 1

    if (i === 3) i = 0
    if (i === -1) i = 2

    return i
  }

  /**
   * 利用缓存 切换月份
   */
  // updateListMonth: function() {

  // // 切换到本月数据
  // const currIndex = this.data.listIndex
  // const lastNextIndex = this.cleanListIndex(currIndex) // 上月或者下月的索引
  // const currItem  = this.data.listMonth[lastNextIndex]

  // // 切换到本月后的上月或下月数据
  // const oldIndex = this.cleanListIndex(lastNextIndex)
  // const oldItem = this.data.listMonth[currIndex]

  // // 新的月份数据
  // const newDate = new Date(currItem[MONTH_INDEX].time)
  // if (this.data.dayType === 'last') newDate.setMonth(newDate.getMonth() - 1)
  // else newDate.setMonth(newDate.getMonth() + 1)

  // // swiper索引 0,1,2; 已知索引[0,1] 求 [2]
  // const newIndex = [0,1,2].find(s => ![currIndex, oldIndex].includes(s))
  // const newItem = Calen.getDays(newDate.getFullYear(), newDate.getMonth() + 1)

  // // 更新标题日历信息
  // const { year, month, day } = this.data.calendar
  // this.renderCalendar(year, month, day, currItem, 0)

  // this.setData({
  //   ['listData[' + newIndex + ']'] : newItem,
  //   ['listData[' + oldIndex + ']'] : oldItem,
  //   ['listData[' + currIndex + ']']: currItem,
  // })

  // this.data.dayType = 'curr'
  // this.data.listMonth[newIndex]  = newItem
  // this.data.listMonth[oldIndex]  = oldItem
  // this.data.listMonth[currIndex] = currItem
  // }
})