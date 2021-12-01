// components/calendar/calendar.js
const app = getApp()
import { throttle } from '../../utils/util'
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
    weeks   : ['日', '一', '二', '三', '四', '五', '六'], // 星期
    calendar: {}, // 每天的信息
    current: 1,  // 计算swiper 左滑or右滑
    dayIndex: 0, // 日索引
    dayType: 'curr', // last:上月, curr:本月, next:下月, week:周

    listMonth: [], // 三个月的日历的信息
    monthIndex: 1, // 月索引

    listWeek: [],  // 三个周的日历的信息

    listData: [],  // 月或者周列表
    listHeight: 0, // 列表高度; 
    dayHeight: 55, // .content高度 = 45高度 + 10上下外边距
  },


  attached: async function () {
    const { last, curr, next } = Calen.getAdjacentMonths(new Date())
    const lastMonth = await Calen.getDays(last.yy, last.mm)
    const currMonth = await Calen.getDays(curr.yy, curr.mm)
    const nextMonth = await Calen.getDays(next.yy, next.mm)

    this.renderCalendar(curr.yy, curr.mm, curr.dd, currMonth)
    this.data.listMonth = [lastMonth, currMonth, nextMonth]

    this.setData({
      listData: this.data.listMonth,
      listHeight: this.setListHeight(currMonth)
    })
  },


  /**
   * 组件的方法列表
   */
  methods: {

    onCallbackSwiperChange: function(event) {
      const dotIndex = event.detail.current
      this.data.monthIndex = dotIndex

      if (this.data.dayType !== 'week') {
        const dotItem = this.data.listMonth[dotIndex]
        const curDays = dotItem[10]

        if (this.data.calendar.day > Calen.months[curDays.month - 1]) {
          this.data.calendar.day = Calen.months[curDays.month - 1]
        }
        this.renderCalendar(curDays.year, curDays.month, this.data.calendar.day, dotItem)
        this.getNextMonth(dotIndex, curDays.time)
      } else {
        // this.setData({ offsetRow: 0 })
      }
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
          ['listData[' + dayIndex + ']']: this.data.listMonth[dayIndex],
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
    setMonthIndex: function() {
      this.setData({ monthIndex: this.data.monthIndex })
    },
    setListHeight: function(list) {
      // 35: 月长度(35 or 42)
      // 275和330: .swiper高度
      return list.length === 35 ? 275 : 330
    },

    selectDate: function (event) {
      const { i, index } = event.currentTarget.dataset

      const dotItem = this.data.listMonth[i]
      const curDays = dotItem[index]
      const curMonth = this.data.listMonth[this.data.monthIndex][10]

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
          this.data.monthIndex = this.cleanMonthIndex(this.data.monthIndex)
          this.data.calendar.day = curDays.day
          this.setMonthIndex()
        }
      }
    },
    selectARow: function () {
      this.data.isARow = !this.data.isARow

      this.data.offsetRow = this.data.isARow ? parseInt(this.data.dayIndex / 7) * this.data.dayHeight : 0

      this.setData({
        isARow: this.data.isARow,
        offsetRow: this.data.offsetRow
      })

      // 周模式下、选择非本月日期时重新渲染上月本月下月日历
      const authType = ['curr', 'week']
      if (!this.data.isARow && !authType.includes(this.data.dayType)) {
        this.updateListMonth()
      } 
      // 切换成周模式
      else if (this.data.isARow) {
        console.log('周模式')
        // this.setListWeek()
      }
    },


    setListWeek: function() {
      this.data.dayType = 'week' // 周
      const currIndex = this.data.monthIndex
      const { year, month, day } = this.data.calendar
      const indexs = [currIndex - 1, currIndex + 1].map(this.cleanMonthIndex, this)
      
      const { last, next } = Calen.getAdjacentWeeks([year, month, day].join('-'))
      const lastWeek = Calen.getWeeks(last.yy, last.mm, last.dd)
      const nextWeek = Calen.getWeeks(next.yy, next.mm, next.dd)
      
      this.data.listWeek = [lastWeek, nextWeek]

      this.setData({
        ['listData[' + indexs[0] + ']'] : lastWeek,
        ['listData[' + indexs[1] + ']'] : nextWeek,
      })

      console.log(this.data.listData, '---')
    },

    updateListMonth: async function() {
      // 切换到本月数据
      const currIndex = this.data.monthIndex
      const lastNextIndex = this.cleanMonthIndex(currIndex) // 上月或者下月的索引
      const currItem  = this.data.listMonth[lastNextIndex]
      
      // 切换到本月后的上月或下月数据
      const oldIndex = this.cleanMonthIndex(lastNextIndex)
      const oldItem = this.data.listMonth[currIndex]

      // 新的月份数据
      const newIndex = [0,1,2].find(s => ![currIndex, oldIndex].includes(s))
      const newDate = new Date(currItem[10].time)
      if (this.data.dayType === 'last') newDate.setMonth(newDate.getMonth() - 1)
      else newDate.setMonth(newDate.getMonth() + 1)
      const newItem = await Calen.getDays(newDate.getFullYear(), newDate.getMonth() + 1)

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
    cleanMonthIndex: function(index) {
      let i = index

      if (this.data.dayType === 'next') i += 1
      else if (this.data.dayType === 'last') i -= 1

      if (i === 3) i = 0
      if (i === -1) i = 2

      return i
    }
  }
})