// components/uploadAudio/index.js
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
    timerName: '00:00',
    timer: 0,
    isStart: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    open: function() {
      this.selectComponent('#drawerMoto').open()
    },

    audioStart: function() {
      this.data.isStart = !this.data.isStart
      this.setData({
        isStart: this.data.isStart,
        timer: 1
      })
    }
  }
})
