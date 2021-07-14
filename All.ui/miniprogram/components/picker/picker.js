// components/picker/picker.js
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
    isShow: 0, // 是否打开 colorPicker 组件 0:真关闭 1:打开 2:伪关闭
    touch: {
      startY: 0,
      moveY : 0,
      transY: 0,
    },
    index: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 打开 或 关闭 Picker 组件
    showPicker: function () {
      let show = this.data.isShow
      if (!show) this.data.isShow = 1
      else if (show === 1) this.data.isShow = 2
      else if (show === 2) this.data.isShow = 1


      this.setData({
        isShow: this.data.isShow
      }, () => {
        // if (this.data.isShow === 1) this.init()
      })
    },


    touchStart: function(event) {
      // console.log(event, '触发了')

      this.data.touch.startY = -this.data.touch.transY + event.touches[0].pageY
    },

    touchMove: function(event) {
      this.data.touch.moveY = event.touches[0].pageY
      let y = this.data.touch.startY - this.data.touch.moveY
   
      if (y < -45) {
        this.data.touch.transY = 0;
        return
      } else if (y >= (45 * 5)) {
        this.data.touch.transY = 45 * 4;
        return
      } 
      
      this.data.touch.transY = -y
      

     
      this.setData({
        ['touch.transY']: this.data.touch.transY
      })
    },

    touchEnd: function() {

      let index = Math.round(Math.abs(this.data.touch.transY) / 45)
      this.data.index = index
      this.data.touch.transY = -(45 * index)
      this.setData({
        ['touch.transY']: this.data.touch.transY
      })
    },

    // 清空事件
    clear: function() {
      this.showPicker()
    },

    // 确认事件
    confirm: function() {
      /**
       * bindchange: 点击确认
       */
      this.showPicker()
      this.triggerEvent('change', { index: this.data.index })
    },
  }
})
