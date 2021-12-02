// components/calendar/calendar.js
const app = getApp()
import { Calendar } from './main'
const Calen = new Calendar()
const SWIPER_INDEX = 1  // swiper 默认索引
const MONTH_INDEX  = 10 // 从listMonth列表中取出 本月数据; (不需要确认是哪一天，只要是本月即可)

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
    offsetRow: 0, // margin-top 偏移量
    rowNumber: 0, // 行数

    weeks   : ['日', '一', '二', '三', '四', '五', '六'], // 星期
    calendar: {}, // 每天的信息
    current: SWIPER_INDEX,  // 计算swiper 左滑or右滑
    dayIndex: 0, // 日索引
    dayType: 'curr', // last:上月, curr:本月, next:下月, week:周, month:月

    listMonth: [], // 三个月的日历的信息
    listWeek: [],  // 三个周的日历的信息

    listIndex: SWIPER_INDEX, // listData的索引
    listData: [],  // 月或者周列表
    listHeight: 0, // 列表高度; 
    dayHeight: 55, // .content高度 = 45高度 + 10上下外边距
  },


  attached: async function () {
    this.setListMonth(new Date())
  },


  /**
   * 组件的方法列表
   */
  methods: {

    // 获取三个月的日历信息
    setListMonth: function(date) {
      this.data.dayType = 'month' // 周
      const { last, curr, next } = Calen.getAdjacentMonths(date)
      const lastMonth = Calen.getDays(last.yy, last.mm)
      const currMonth = Calen.getDays(curr.yy, curr.mm)
      const nextMonth = Calen.getDays(next.yy, next.mm)
  
      this.renderCalendar(curr.yy, curr.mm, curr.dd, currMonth)
      this.data.listMonth = [lastMonth, currMonth, nextMonth]
  
      this.setData({
        listData: this.data.listMonth,
        listHeight: this.setListHeight(currMonth)
      })
    },

    // 获取下下月的日历信息
    getNextMonth: function(dotIndex, time) {

      const { dotNewIndex, direction} = this.isTouchDirection(dotIndex)
      let d = new Date(time)

      if (direction === 'left') d.setMonth(d.getMonth() + 1)
      else d.setMonth(d.getMonth() - 1)

      d = new Date(d.getTime())

      const month = Calen.getDays(d.getFullYear(), d.getMonth() + 1)
      const setDays = () => {
        this.data.listMonth.splice(dotNewIndex, 1, month)
        this.setData({
          ['listData[' + dotNewIndex + ']']: this.data.listMonth[dotNewIndex],
        })
      }

      if (dotIndex === 2) setDays()
      else if (dotIndex === 0) setDays()
      else if (dotIndex === 1) setDays()
    },

    // 从周模式切换成月模式
    updateListMonth: function() {
      // 切换到本月数据
      const currIndex = this.data.listIndex
      const lastNextIndex = this.cleanListIndex(currIndex) // 上月或者下月的索引
      const currItem  = this.data.listMonth[lastNextIndex]
      
      // 切换到本月后的上月或下月数据
      const oldIndex = this.cleanListIndex(lastNextIndex)
      const oldItem = this.data.listMonth[currIndex]

      // 新的月份数据
      const newDate = new Date(currItem[MONTH_INDEX].time)
      if (this.data.dayType === 'last') newDate.setMonth(newDate.getMonth() - 1)
      else newDate.setMonth(newDate.getMonth() + 1)

      // swiper索引 0,1,2; 已知索引[0,1] 求 [2]
      const newIndex = [0,1,2].find(s => ![currIndex, oldIndex].includes(s))
      const newItem = Calen.getDays(newDate.getFullYear(), newDate.getMonth() + 1)

      // 更新标题日历信息
      const { year, month, day } = this.data.calendar
      this.renderCalendar(year, month, day, currItem, 0)

      this.setData({
        ['listData[' + newIndex + ']'] : newItem,
        ['listData[' + oldIndex + ']'] : oldItem,
        ['listData[' + currIndex + ']']: currItem,
      })

      this.data.dayType = 'curr'
      this.data.listMonth[currIndex] = currItem
      this.data.listMonth[oldIndex]  = oldItem
      this.data.listMonth[newIndex]  = newItem
    },


    onCallbackSwiperChange: function(event) {
      const dotIndex = event.detail.current
      this.data.listIndex = dotIndex
      let dotItem = {}
      let curDays = {}
      let func = ''

      if (this.data.dayType === 'week') {
        dotItem = this.data.listWeek[dotIndex]
        curDays = this.data.listWeek[dotIndex][this.data.dayIndex]
        func = 'getNextWeek'
      } else {
        dotItem = this.data.listMonth[dotIndex]
        curDays = dotItem[10]
        const { day } = this.data.calendar
        const newDay = Calen.months[curDays.month - 1]
        curDays.day = day > newDay ? newDay : day
        func = 'getNextMonth'
      }
      this.renderCalendar(curDays.year, curDays.month, curDays.day, dotItem)
      this[func](dotIndex, curDays.time)
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

    getNextWeek: function(dotIndex, time) {
      const axis = dotIndex - this.data.current

      let t = true
      let dayIndex = 1
      // 左滑
      if (axis > 0 && axis < 2) {
        this.data.current++
        if (this.data.current === 2) this.data.current = -1

        dayIndex = this.data.current + 1
        t = true
      } 
      // 右滑
      else {
        this.data.current--
        if (this.data.current === -1) this.data.current = 2
        if (this.data.current === 2) this.data.current = -1
        if (this.data.current === -2) this.data.current = 1

        dayIndex = this.data.current === 1 ? 0 : this.data.current + 2
        t = false
      }

      const { yy, mm, dd } = Calen.getOnlyWeeks(time, t)
 
      const day = Calen.getWeeks(yy, mm, dd, this.data.rowNumber)
      const setDays = () => {
        this.data.listWeek.splice(dayIndex, 1, day)
        this.setData({
          ['listData[' + dayIndex + ']']: this.data.listWeek[dayIndex],
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
    renderCalendar: function (y, m, d, dotItem, timer = 500) {
      const time = new Date([y, m, d].join('-')).getTime()
      const dayIndex = dotItem.findIndex(s => s.time === time)
      setTimeout(() => { this.setCalendar(dayIndex, dotItem) }, timer)
    },
    
    
    setCalendar: function(dayIndex, item) {
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
    setListIndex: function() {
      this.setData({ listIndex: this.data.listIndex })
    },
    setListHeight: function(list) {
      // 35: 月长度(35 or 42)
      // 275和330: .swiper高度
      return list.length === 35 ? 275 : 330
    },

    selectDate: function (event) {
      const { i, index } = event.currentTarget.dataset
      let dotItem = {}
      let curDays = {}
      let curMonth = {}
      // const dotItem = this.data.listMonth[i]
      // const curDays = dotItem[index]
      // const curMonth = this.data.listMonth[this.data.listIndex][10]

      if (this.data.dayType === 'week') {
        dotItem = this.data.listWeek[i]
        curDays = dotItem[index]
        curMonth = this.data.listWeek[this.data.listIndex][this.data.dayIndex]
      } else {
        dotItem = this.data.listMonth[i]
        curDays = dotItem[index]
        curMonth = this.data.listMonth[this.data.listIndex][10]
      }

      const nowMon = new Date([curMonth.year, curMonth.month, 1].join('-'))
      const target = new Date(curDays.time)

      if (curMonth.month === curDays.month) {
        this.data.dayType = 'curr'  // 本月
        this.setCalendar(index, dotItem)
      } else {
    
        if (nowMon < target) this.data.dayType = 'next'   // 下个月
        else this.data.dayType = 'last'  // 上个月

        // 在周模式下、选择上月或者下月不调转swiper
        if (this.data.isARow) {
          this.setCalendar(index, dotItem)
        } else {
          this.data.listIndex = this.cleanListIndex(this.data.listIndex)
          this.data.calendar.day = curDays.day
          this.setListIndex()
        }
      }
    },
    selectARow: function () {
      this.data.isARow = !this.data.isARow
      this.data.rowNumber = parseInt(this.data.dayIndex / 7)
      this.data.offsetRow = this.data.isARow ? this.data.rowNumber * this.data.dayHeight : 0

      this.setData({
        isARow: this.data.isARow,
        offsetRow: this.data.offsetRow
      })

      // 周模式下、选择非本月日期时重新渲染上月本月下月日历
      const authType = ['curr', 'week']
      if (!this.data.isARow && !authType.includes(this.data.dayType)) {
        // this.setListMonth(true)
        this.updateListMonth()
      } 

      else if (!this.data.isARow) {
        console.log('月模式')
        this.setListMonth()
      }

      // 切换成周模式
      else if (this.data.isARow) {
        console.log('周模式')
        // this.setListWeek()
      }
    },

    

    setListWeek: function() {

      this.data.dayType = 'week' // 周
      const { listIndex, rowNumber } = this.data
      const { year, month, day } = this.data.calendar

      const { last, curr,  next } = Calen.getAdjacentWeeks([year, month, day].join('-'))
    
      const lastWeek = Calen.getWeeks(last.yy, last.mm, last.dd, rowNumber)
      const currWeek = Calen.getWeeks(curr.yy, curr.mm, curr.dd, rowNumber)
      const nextWeek = Calen.getWeeks(next.yy, next.mm, next.dd, rowNumber)

      const lastIndex = this.cleanListIndex(listIndex - 1)
      const nextIndex = this.cleanListIndex(listIndex + 1)
      
      this.data.listWeek = [lastWeek, currWeek, nextWeek]

      this.setData({
        ['listData[' + lastIndex + ']'] : lastWeek,
        ['listData[' + listIndex + ']'] : currWeek,

        ['listData[' + nextIndex + ']'] : nextWeek,
      })
    },

   
    cleanListIndex: function(index) {
      let i = index

      if (this.data.dayType === 'next') i += 1
      else if (this.data.dayType === 'last') i -= 1

      if (i === 3) i = 0
      if (i === -1) i = 2

      return i
    }
  }
})