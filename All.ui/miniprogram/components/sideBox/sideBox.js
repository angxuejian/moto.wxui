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
    color: '',
    show: false,
    isShowAdd: false,
  },

  ready: function() {
    this.setData({
      height: app.globalData.bar
    })
    this.getOpenId()
  },

  /**
   * 组件的方法列表
   */
  methods: {

    open: function() {
      // this.selectComponent('#drawer').open()
      this.setData({
        show: true
      })
    },
    gotoShare: function() {
      wx.navigateTo({
        url: '/pages/share/share',
      })
    },
    gotoAdd: function() {
      wx.navigateTo({
        url: '/pages/add/add',
      })
    },
    onCallbackChange: function(event) {
      const { detail } = event
      this.data.color = detail.hex || '#333333'
      this.triggerEvent('change', {
        color: this.data.color
      })
    },
    onCallbackAfterLeave: function(event) {
      const self = this.selectComponent('#colorPicker')
      // 手机物理返回后，若colorPicker组件未关闭，就手动关闭
      if (self.data.isShow === 1) {
        self.open()
      }
    },
    getOpenId: function() {
      const self = this
      wx.cloud.callFunction({
        name: 'checkUser',
        success:( { result } ) => {
          self.setData({
            isShowAdd: 'o5vlw5VWKwEwyEO6fyLONlRa0B6U' === result
          })
        }
      })
    }
  }
})
