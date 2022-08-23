// components/checkInDatePicker/index.js
import Calendar from '../../utils/calendar/index'
const Calen = new Calendar()

Component({

  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    multiple: {
      type: Boolean,
      value: true
    },
    value: {
      type: [Array,String,Number],
      value: null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    weeks: Calen.weeks,
    nightNumber: 0,
    startName: '',
    endName: '',
    startTime: 0,
    endTime: 0,
    startObj: {},
    endObj: {},
    months: []
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
      if (!this.data.months.length) {
        const { list } = Calen.getSolarNumber()
        this.data.months = list
        this.setData({ months: this.data.months })
      }

      if (this.data.value) {
        if (Array.isArray(this.data.value)) {
          this.data.value.forEach((s, i) => {
            this.setValues(i ? 'end' : 'start', s)
          })
        } else {
          this.setValues('start', this.data.value)
        }
 
      } else {
        // this.formatTime('start', object)
        this.setValues('start', new Date())
      }
    },

    setValues: function(type = 'start', time) {
      const itemDate = Calen.getSolarDate(new Date(time))
      const itemObj = Calen.formatDate({y: itemDate.year, m: itemDate.month, d: itemDate.day })
      let d = {}

      if (type === 'end') {
        this.data.nightNumber = Math.floor((itemObj.time - this.data.startTime) / 86400000)
        d = { nightNumber:  this.data.nightNumber }
      }
      this.formatTime(type, itemObj, d)
    },
    onCallbackClose: function() {
      this.data.startTime = 0
      this.data.startName = ''
      this.data.endTime = 0
      this.data.endName = ''
      this.data.nightNumber = 0
      this.data.endObj = {}
      this.data.startObj = {}
      const d = {
        endTime: this.data.endTime,
        endName: this.data.endName,
        startTime: this.data.startTime,
        startName: this.data.startName,
        nightNumber: this.data.nightNumber
      }
      this.setData(d)
    },

    selectCheckInDate: function(event) {
      const { item } = event.currentTarget.dataset

      if (item.color) return

      if (!this.data.multiple) {
        this.formatTime('start', item)
        return
      }

      if (this.data.endTime) {
        this.selectStartTime(item)
        return
      }

      if (this.data.startTime) {
        if (this.data.startTime < item.time) {
          this.data.nightNumber = Math.floor((item.time - this.data.startTime) / 86400000)
          this.formatTime('end', item, { nightNumber: this.data.nightNumber })
        } else {
          this.selectStartTime(item)
        }
      }
    },
    selectStartTime: function(item) {
      this.data.endTime = 0
      this.data.endName = ''
      this.data.nightNumber = 0
      this.data.endObj = {}
      const d = {
        endTime: this.data.endTime,
        endName: this.data.endName,
        nightNumber: this.data.nightNumber
      }
      this.formatTime('start', item, d)
    },

    formatTime: function(key, obj, d = {}) {
      const name = `${obj.month}月${obj.day}日 ${obj.lunar.week}`
      const time = obj.time
      this.data[`${key}Obj`] = obj
      this.data[`${key}Name`] = name
      this.data[`${key}Time`] = time

      d[`${key}Name`] = name
      d[`${key}Time`] = time
      this.setData(d)
    },


    confirm: function() {
      if (this.data.nightNumber && this.data.multiple) {
        this.triggerEvent('change', {
          start: this.data.startObj,
          end: this.data.endObj,
          startName: this.data.startName,
          endName: this.data.endName,
          nightNumber: this.data.nightNumber
        })
        
      } else if (!this.data.multiple) {
        this.triggerEvent('change', {
          start: this.data.startObj,
          startName: this.data.startName,
        })
      }
      this.close()
    }
  }
})
