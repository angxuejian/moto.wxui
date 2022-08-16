// components/timePicker/index.js
import { getClockNumbers, getClockAngle } from './clock'
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
    clock: {
      width: 240,
      height: 240
    },
    number: {
      width: 35,
      height: 35,
      paddingTop: 0,
    },
    hoursArr: [],
    rotateZ: 0,
    rect: {},
    selectedIndex: 12
  },

  lifetimes: {
    ready:function() {
     
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {

    open: function() {
      this.selectComponent('#drawerMoto').open()
    },
    onCallbackOpen: function() {
      this.initClock()
      this.getContentHeight()
    },
    

    initClock: function(params) {
      this.getClockHours()
    },

    getClockHours: function() {
      // 减去时钟数字的宽度
      const { clock, number } = this.data
      const radius = (clock.width / 2) - (number.width / 2)

      for (let i = 1; i <= 12; i++) {
        const { left, top } = getClockNumbers(radius, i)
        this.data.hoursArr.push({
          value: i,
          style: `width: ${number.width}px;height: ${number.height}px; line-height:${number.height + number.paddingTop}px; top:${top}px;left:${left}px;`
        })
      }
      this.setData({
        hoursArr: this.data.hoursArr
      })

    },
    getContentHeight(id) {
      // 一定到settimeout后，才能获取到正确的宽高
      setTimeout(() => {
        const query = wx.createSelectorQuery().in(this);
        const that = this;
        //选择id
        query
          .select('#clock__wrap')
          .boundingClientRect(function (rect) {
            that.data.rect = rect
          })
          .exec();
      }, 500);
    },

    onTouchMove: function(event) {
      const { rect, clock } = this.data
      const radius = clock.width / 2
      const step = 30
      const deg = getClockAngle(event.touches[0], rect, radius, step)
      this.data.selectedIndex = deg / step || 12 // 等于0时 等于12点

      this.setData({ rotateZ: deg, selectedIndex: this.data.selectedIndex })
    }
  }
})
