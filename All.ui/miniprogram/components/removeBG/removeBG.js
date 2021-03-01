// components/removeBG/removeBG.js
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
    isRBG: false, // 是否开始消除背景
  },

  attached() {
    setTimeout(() => {
      this.setData({
        isRBG: true
      })
    }, 2000)
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
