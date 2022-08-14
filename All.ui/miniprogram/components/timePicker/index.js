// components/timePicker/index.js
import { getClockNumbers } from './clock'
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
    },
    hoursArr: [],
    rotateZ: 0,
    rect: {}
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
        const { left, top, angle } = getClockNumbers(radius, i)
        this.data.hoursArr.push({
          value: i,
          angle,
          style: `width: ${number.width}px;height: ${number.height}px; line-height:${number.height}px; top:${top}px;left:${left}px;`
        })
      }
      this.setData({
        hoursArr: this.data.hoursArr
      })

    },
    getContentHeight(id) {
      const query = wx.createSelectorQuery().in(this);
      const that = this;
      //选择id
      query
        .select('#clock__wrap')
        .boundingClientRect(function (rect) {
          console.log(rect);// 这里包含内容 的宽高
          that.data.rect = rect
        })
        .exec();
    },


    getClockAngle: function(event) {
      console.log(event, '-->')
      const { clock, number, rect } = this.data
      const { pageX, pageY } = event.touches[0]
      const radius = (clock.width / 2) - (number.width / 2)

      const cx = radius
      const cy = radius
      const x = pageX - radius
      const y = radius - pageY
      // const x1 = pageX
      // const y1 = pageY
      // console.log(pageY, pageX)
      // const angle = Math.atan2(cx, cy) - Math.atan2(x1, y1)
      const a = Math.atan2(y, x)
      let deg = a / (Math.PI / 180)
      deg = -deg
      console.log(deg)
      this.setData({
        rotateZ:  deg
      })
    }
  }
})
