// components/timePicker/index.js
import { getClockNumbers, getClockAngle } from './clock'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    timestamp: {
      type: String,
      value: `${new Date().getTime()}`
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    clock: {
      width: 240,
      height: 240
    },
    number: {
      width: 35,
      height: 35,
    },
    amHoursArr: [1,2,3,4,5,6,7,8,9,10,11,12], // 上午
    pmHoursArr: [13,14,15,16,17,18,19,20,21,22,23,0], // 下午
    msHoursArr: [5,10,15,20,25,30,35,40,45,50,55,0], // 分秒
    hoursArr: [],
    rotateZ: 0,
    rect: {},
    hours: '00', // 时
    minute: '00', // 分
    second: '00', // 秒
    isPoint: false, // 选择分和秒的 非%5的 选择状态
    isIndex: 12, // 时钟整数选择状态
    isAmpm: 'am', // 上午或者下午
    type: 'hours',
  },

  /**
   * 组件的方法列表
   */
  methods: {

    open: function() {
      this.selectComponent('#drawerMoto').open()
    },
    close: function() {
      this.selectComponent('#drawerMoto').close()
    },
    

    onCallbackOpen: function() {
      if (this.data.timestamp.length !== 13) {
        this.data.timestamp = new Date().getTime()
      }
      
      const d = new Date(Number(this.data.timestamp))
      const h = d.getHours()
      const m = d.getMinutes()
      this.data.isAmpm = h <= 12 ? 'am' : 'pm'

      this.data.hours = this.padStart(h)
      this.data.minute = this.padStart(m)
      this.selectType({}, 'hours')

      this.getContentHeight()
    },
    
    // 选择上午下午
    selectAmpm: function(event) {
      const { current } = event.detail

      this.data.isAmpm = current ? 'pm' : 'am'
      this.initClock()
    },

    // 选择时分
    selectType: function(event, t) {
      if (t) this.data.type = t
      else {
        const { type } = event.currentTarget.dataset
        this.data.type = type
      }
      const h = Number(this.data.hours)
      const m = Number(this.data.minute)
      let z = 0

      if (this.data.type === 'hours') z = h <= 12 ? h * 30 : (h - 12) * 30
      else z = m * 6
      
      this.setSelected(z)
      this.data.rotateZ = z

      this.initClock()
    },


    initClock: function() {
      this.getClockHours()
    },

    getClockHours: function() {
      const { clock, number, type, isAmpm, isIndex, amHoursArr, pmHoursArr, msHoursArr } = this.data
      const radius = (clock.width / 2) - (number.width / 2)  // 减去时钟数字的宽度
      const list = []
      let numberArr = []
      
      if (type !== 'hours') numberArr = msHoursArr
      else {
        if (isAmpm === 'am') numberArr = amHoursArr
        else numberArr = pmHoursArr
      }

      for (let i = 1; i <= 12; i++) {
        const { left, top } = getClockNumbers(radius, i)
        list.push({
          value: i,
          label: numberArr[i - 1],
          style: `width: ${number.width}px;height: ${number.height}px; line-height:${number.height}px; top:${top}px;left:${left}px;`
        })
      }

      if (type === 'hours') this.data.hours = this.padStart(list[isIndex - 1].label)

      this.data.hoursArr = list
      this.setData({
        type: this.data.type,
        hours: this.data.hours,
        minute: this.data.minute,
        isAmpm: this.data.isAmpm,
        isIndex: this.data.isIndex,
        isPoint: this.data.isPoint,
        rotateZ: this.data.rotateZ,
        hoursArr: this.data.hoursArr
      })
    },

    onTouchMove: function(event) {
      const { rect, clock, type } = this.data
      const radius = clock.width / 2
      const step = type === 'hours' ? 30 : 6

      const deg = getClockAngle(event.touches[0], rect, radius, step)

      this.setTime(deg)
    },
    onTouchEnd: function() {
      if (this.data.type === 'hours') {
        setTimeout(() => {
          this.selectType({}, 'minute')
        }, 500);
      }
    },


    // 赋值时间
    setTime: function(deg) {

      this.setSelected(deg)

      const { type, hoursArr, isIndex } = this.data

      
      if (type !== 'hours') this.data[type] = this.padStart(deg / 6)  // 分秒的值
      else this.data.hours = this.padStart(hoursArr[isIndex - 1].label)

      this.setData({
        [type]: this.data[type],
        rotateZ: deg,
        isIndex: this.data.isIndex,
        isPoint: this.data.isPoint
      })
    },

    // 赋值选中状态
    setSelected: function(deg) {
      const { type } = this.data

      if (type !== 'hours') {
        this.data.isIndex = !deg ? 12 : deg / 30    // %5的选择状态
        this.data.isPoint = !!(deg % 5) // 非%5的选择状态
      } else {
        this.data.isPoint = false
        this.data.isIndex = (deg / 30) || 12
      }
    },

    onCallbackCancel: function() {
      this.close()
    },

    onCallbackConfirm: function() {
      const { hours, minute } = this.data
      console.log()

      this.triggerEvent('change', { value: [hours, minute].join(':') })
      this.close()
    },

    padStart: function(n) {
      n = `${n}`
      return n.padStart(2, 0)
    },

    getContentHeight(id) {
      // 一定到settimeout后，才能获取到正确的宽高
      setTimeout(() => {
        const query = wx.createSelectorQuery().in(this);
        const that = this;
        query
          .select('#clock__wrap')
          .boundingClientRect(function (rect) {
            that.data.rect = rect
          })
          .exec();
      }, 500);
    },
  }
})
