// miniprogram/components/showImage/showImage.js
Component({

  options: {
    addGlobalClass: true
  },

  data: {
    isShow: 0
  },

  methods: {
     // 对外实例方法 - 调用实例打开组件
     open: function() {
      this.showImage()
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

    // 打开 或 关闭 showImage 组件
    showImage: function () {
      let show = this.data.isShow
      if (!show) this.data.isShow = 1
      else if (show === 1) this.data.isShow = 2
      else if (show === 2) this.data.isShow = 1


      this.setData({
        isShow: this.data.isShow
      })
    },
  }
})