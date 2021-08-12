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
      height: app.globalData.bar
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {

    open: function() {
      this.selectComponent('#drawer').open()
    },
    onCallbackClose: function() {
      this.triggerEvent('change', {
        color: this.data.color
      })
      this.data.color = ''
    },


    gotoShare: function() {
      wx.navigateTo({
        url: '/pages/UI-Pages/ui.share/ui.share',
      })

    },

    onCallbackChange: function(event) {
      const { detail } = event
      this.data.color = detail.hex || '#333333'
    }
  }
})
