// tools/sideBox/sideBox.js
const app = getApp()
Component({

  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: 0, // 0:真关闭 1:打开 2:伪关闭
    height: 0,
    color: ''
  },

  ready: function() {
    this.setData({
      height: app.globalData.statusBarHeight
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {

    open: function() {
      this.showSideBox()
    },


    showSideBox: function () {
      let show = this.data.isShow
      if (!show) this.data.isShow = 1
      else if (show === 1) this.data.isShow = 2
      else if (show === 2) this.data.isShow = 1
      
      if (this.data.isShow === 2 && this.data.color) {
        this.triggerEvent('change', {
          color: this.data.color
        })
        this.data.color = ''
      }

      this.setData({
        isShow: this.data.isShow
      })
    },


    onCallbackChange: function(event) {
      const { detail } = event
      this.data.color = detail.hex || '#333333'
    }
  }
})
