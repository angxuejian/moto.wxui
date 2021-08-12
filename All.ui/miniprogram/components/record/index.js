// components/record/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    mask: {
      type:Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: 0 // 是否打开 record 组件 0:真关闭 1:打开 2:伪关闭
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 对外实例方法 - 调用实例打开组件
    open: function() {
      this.showRecord()
    },

    /**
     * -------------------------------
     * -------------------------------
     * -------------------------------
     * -------------------------------
     * 分割线 - 分割线
     * 
     * 下面是 私有方法！ 不要随意调用哦！！！
     */

    // 打开 或 关闭 record 组件
    showRecord: function () {
      let show = this.data.isShow
      if (!show) this.data.isShow = 1
      else if (show === 1) this.data.isShow = 2
      else if (show === 2) this.data.isShow = 1

      this.setData({
        isShow: this.data.isShow
      })
    },

    // 是否开启遮罩层关闭
    maskShowRecord: function() {
      if (!this.data.mask) return

      this.showRecord()
    },

    onCallbackEnd: function() {
      if (this.data.isShow === 2) {
        this.data.isShow = 0
        this.setData({
          isShow: this.data.isShow
        })
      }
    }
  }
})
