// components/drawer.moto/index.js
Component({

  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    maskClose: {
      type: Boolean,
      value: true
    },
    showConfirm: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: 0, //是否打开 0:真关闭 1:打开 2:伪关闭

  },

  /**
   * 组件的方法列表
   */
  methods: {
    showDrawerMoto: function() {
      let show = this.data.isShow

      if (!show) this.data.isShow = 1
      else if (show === 1) this.data.isShow = 2
      else if (show === 2) this.data.isShow = 1

      this.setData({
        isShow: this.data.isShow
      }, () => {
        if (this.data.isShow === 1) this.triggerEvent('open')
      })
    },

    open: function() {
      this.showDrawerMoto()
    },
    close: function() {
      this.showDrawerMoto()
      this.triggerEvent('close')
    },
    cancel: function() {
      this.triggerEvent('cancel')
    },
    confirm: function() {
      this.triggerEvent('confirm')
    },
    tapMaskClose: function() {
      if (!this.data.maskClose) return 

      this.close()
    }
  }
})
