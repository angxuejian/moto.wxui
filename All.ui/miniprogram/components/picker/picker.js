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
    },
  }
})
